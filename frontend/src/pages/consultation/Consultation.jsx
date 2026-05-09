import { useEffect, useRef, useState } from "react";
import { PAGES, useApp } from "../../context/AppContext";
import { InlineSkeleton, ErrorMsg } from "../../components/ui/UI";
import ChatPanel from "./components/ChatPanel";
import ConsultationHeader from "./components/ConsultationHeader";
import CurrentConsultationsList from "./components/CurrentConsultationsList";
import RatingModal from "./components/RatingModal";
import VideoPanel, { MinimizedCallWidget } from "./components/VideoPanel";
import {
  BLOCKING_MODAL_STATES,
  CALL_STATES,
} from "./components/callMachine";
import { getInitials } from "./components/consultationUtils";
import { useConsultationSession } from "./components/useConsultationSession";

export default function Consultation() {
  const {
    navigate,
    pageParams,
    user,
    selectedConsultationId,
    selectedDoctor,
    showToast,
    registerCallGuard,
    setCallActivity,
    isCallBusy,
  } = useApp();

  if (!selectedConsultationId) {
    return (
      <CurrentConsultationsList
        isCallBusy={isCallBusy}
        navigate={navigate}
        user={user}
      />
    );
  }

  return (
    <ConsultationRoom
      navigate={navigate}
      pageParams={pageParams}
      registerCallGuard={registerCallGuard}
      selectedConsultationId={selectedConsultationId}
      selectedDoctor={selectedDoctor}
      setCallActivity={setCallActivity}
      showToast={showToast}
      user={user}
    />
  );
}

function ConsultationRoom({
  navigate,
  pageParams,
  registerCallGuard,
  selectedConsultationId,
  selectedDoctor,
  setCallActivity,
  showToast,
  user,
}) {
  const autoVideoRequested = useRef(false);
  const autoAnswered = useRef(false);
  const [leaving, setLeaving] = useState(false);
  const session = useConsultationSession({
    navigate,
    registerCallGuard,
    selectedConsultationId,
    setCallActivity,
    showToast,
    user,
  });

  const isDoc = user?.role === "doctor";
  const peer = isDoc
    ? session.consultation?.patient || {}
    : session.consultation?.doctor || selectedDoctor || {};
  const peerName =
    peer?.userId?.name || peer?.name || (isDoc ? "Patient" : "Doctor");
  const specialization = isDoc ? "" : peer?.specialization || "";
  const initials = getInitials(peerName);
  const myInitials = getInitials(user?.name, "ME");
  const roomMode = pageParams?.mode === "call" ? "call" : "chat";
  const isPending = session.consultation?.status === "pending";
  const isCallInProgress = session.callBusy;
  const isCallModalBusy =
    session.callBusy && session.callStatus !== CALL_STATES.MINIMIZED;
  const peerOnline = isDoc
    ? session.peerReady
    : Boolean(session.peerReady || peer?.online);
  const showCallLayer = BLOCKING_MODAL_STATES.has(session.callStatus);
  const inactiveReason =
    session.consultation?.status === "pending"
      ? isDoc
        ? "Accept this consultation to start chat."
        : "Waiting for the doctor to accept this consultation."
      : "This consultation is not active.";
  const consultationStatus = session.consultation?.status;
  const leaveLabel =
    consultationStatus === "active"
      ? isDoc
        ? "Finish Consultation"
        : "Close Consultation"
      : consultationStatus === "pending"
        ? isDoc
          ? "Decline Request"
          : "Cancel Request"
        : "Close";
  const handleLeaveConsultation = async () => {
    if (leaving) return;
    setLeaving(true);
    try {
      await session.leaveConsultation();
    } finally {
      setLeaving(false);
    }
  };
  const switchToChat = () => {
    if (isCallModalBusy) {
      showToast("End the video call before switching pages.", "warning");
      return;
    }
    navigate(PAGES.CONSULTATION, {
      consultationId: selectedConsultationId,
      mode: "chat",
    });
  };
  const switchToCall = () => {
    if (session.callStatus === CALL_STATES.MINIMIZED) {
      session.restoreCall();
      return;
    }

    if (roomMode === "call") {
      if (
        session.callStatus === CALL_STATES.IDLE ||
        session.callStatus === CALL_STATES.ERROR
      ) {
        session.requestVideoCall();
      }
      return;
    }

    if (isCallModalBusy) {
      showToast("End the current call before switching pages.", "warning");
      return;
    }
    navigate(PAGES.CONSULTATION, {
      consultationId: selectedConsultationId,
      mode: "call",
      startVideo: true,
    });
  };

  useEffect(() => {
    if (
      !pageParams?.startVideo ||
      roomMode !== "call" ||
      session.loading ||
      autoVideoRequested.current
    ) {
      return;
    }
    autoVideoRequested.current = true;
    session.requestVideoCall();
  }, [
    pageParams?.startVideo,
    roomMode,
    session.loading,
    session.requestVideoCall,
  ]);

  useEffect(() => {
    if (roomMode === "chat") {
      autoVideoRequested.current = false;
      autoAnswered.current = false;
    }
  }, [roomMode]);

  useEffect(() => {
    if (
      !pageParams?.autoAcceptCall ||
      roomMode !== "call" ||
      session.callStatus !== CALL_STATES.INCOMING ||
      autoAnswered.current
    ) {
      return;
    }

    autoAnswered.current = true;
    session.acceptCall();
  }, [
    pageParams?.autoAcceptCall,
    roomMode,
    session.callStatus,
    session.acceptCall,
  ]);

  if (session.loading)
    return (
      <div className="flex flex-col gap-4">
        <InlineSkeleton className="min-h-[320px] p-8" lines={6} showAvatar />
      </div>
    );
  if (session.error && !session.consultation)
    return (
      <div className="flex flex-col gap-4">
        <ErrorMsg
          message={session.error}
          onRetry={() => window.location.reload()}
        />
      </div>
    );

  return (
    <div className="flex flex-col gap-[var(--page-gap)]">
      <ConsultationHeader
        accepting={session.accepting}
        canAccept={isDoc && isPending}
        consultationStatus={consultationStatus}
        onAccept={session.acceptConsultation}
        onLeave={handleLeaveConsultation}
        peerName={peerName}
        isActive={session.isConsultationActive}
        leaveLabel={leaveLabel}
        leaving={leaving}
        socketReady={session.socketReady}
        specialization={specialization}
      />

      <div className="ml-auto flex w-fit items-center gap-2 rounded-med border border-med-border bg-med-card p-1.5">
        <button
          className={`min-h-[38px] min-w-[110px] rounded-med border px-3 text-sm font-medium ${
            roomMode === "chat"
              ? "border-[var(--primary-border)] bg-[var(--primary-dim)] text-med-primary"
              : "border-transparent bg-transparent text-med-muted hover:text-med-text"
          } disabled:cursor-not-allowed disabled:opacity-50`}
          disabled={isCallModalBusy}
          onClick={switchToChat}
          type="button"
        >
          Chat
        </button>
        <button
          className={`min-h-[38px] min-w-[110px] rounded-med border px-3 text-sm font-medium ${
            roomMode === "call"
              ? "border-[var(--primary-border)] bg-[var(--primary-dim)] text-med-primary"
              : "border-transparent bg-transparent text-med-muted hover:text-med-text"
          } disabled:cursor-not-allowed disabled:opacity-50`}
          onClick={switchToCall}
          disabled={
            !session.isConsultationActive ||
            (isCallInProgress && session.callStatus !== CALL_STATES.MINIMIZED)
          }
          type="button"
        >
          Video Call
        </button>
      </div>

      <div className="grid h-[calc(100vh-160px)] grid-cols-1 gap-4 max-[1100px]:h-auto">
        {roomMode === "chat" || session.callStatus === CALL_STATES.MINIMIZED ? (
          <ChatPanel
            bottomRef={session.bottomRef}
            input={session.input}
            initials={initials}
            messages={session.messages}
            onInputChange={session.handleInputChange}
            onSend={session.sendMessage}
            peerName={peerName}
            peerTyping={session.peerTyping}
            sending={session.sending}
            disabled={!session.isConsultationActive}
            disabledReason={inactiveReason}
            peerOnline={peerOnline}
            socketReady={session.socketReady}
            user={user}
          />
        ) : !showCallLayer ? (
          <VideoPanel
            audioOn={session.audioOn}
            callState={session.callState}
            elapsed={session.elapsed}
            hasLocalStream={session.hasLocalStream}
            hasRemoteStream={session.hasRemoteStream}
            initials={initials}
            localVideoRef={session.localVideoRef}
            myInitials={myInitials}
            onAcceptCall={session.acceptCall}
            onCancelCall={session.endCall}
            onEndCall={session.endCall}
            onMinimize={session.minimizeCall}
            onOpenVideoWindow={session.openVideoWindow}
            onRejectCall={session.declineCall}
            onStartCall={session.requestVideoCall}
            onSwitchCamera={session.switchCamera}
            onToggleAudio={session.toggleAudio}
            onToggleScreenShare={session.toggleScreenShare}
            onToggleSpeaker={session.toggleSpeaker}
            onToggleVideo={session.toggleVideo}
            peerName={peerName}
            remoteVideoRef={session.remoteVideoRef}
            screenSharing={session.screenSharing}
            specialization={specialization}
            speakerOn={session.speakerOn}
            videoOn={session.videoOn}
            disabled={!session.isConsultationActive}
          />
        ) : null}
      </div>

      {showCallLayer && (
        <div
          className="fixed inset-0 z-[1000] flex bg-slate-900/80 p-[18px] backdrop-blur-[5px] max-sm:p-0"
          aria-label="Video call in progress"
          aria-modal="true"
          role="dialog"
        >
          <VideoPanel
            audioOn={session.audioOn}
            callState={session.callState}
            elapsed={session.elapsed}
            hasLocalStream={session.hasLocalStream}
            hasRemoteStream={session.hasRemoteStream}
            immersive
            initials={initials}
            localVideoRef={session.localVideoRef}
            myInitials={myInitials}
            onAcceptCall={session.acceptCall}
            onCancelCall={session.endCall}
            onEndCall={session.endCall}
            onMinimize={session.minimizeCall}
            onOpenVideoWindow={session.openVideoWindow}
            onRejectCall={session.declineCall}
            onStartCall={session.requestVideoCall}
            onSwitchCamera={session.switchCamera}
            onToggleAudio={session.toggleAudio}
            onToggleScreenShare={session.toggleScreenShare}
            onToggleSpeaker={session.toggleSpeaker}
            onToggleVideo={session.toggleVideo}
            peerName={peerName}
            remoteVideoRef={session.remoteVideoRef}
            screenSharing={session.screenSharing}
            specialization={specialization}
            speakerOn={session.speakerOn}
            videoOn={session.videoOn}
            disabled={!session.isConsultationActive}
          />
        </div>
      )}

      <MinimizedCallWidget
        audioOn={session.audioOn}
        callState={session.callState}
        elapsed={session.elapsed}
        onEndCall={session.endCall}
        onRestore={session.restoreCall}
        peerName={peerName}
        speakerOn={session.speakerOn}
        videoOn={session.videoOn}
      />

      {session.showRatingModal && (
        <RatingModal
          doctorName={peerName}
          rating={session.ratingData.rating}
          comment={session.ratingData.comment}
          onRatingChange={(rating) => session.setRatingData({ ...session.ratingData, rating })}
          onCommentChange={(comment) => session.setRatingData({ ...session.ratingData, comment })}
          onSubmit={session.submitRating}
          onSkip={session.skipRating}
          submitting={session.ratingSubmitting}
        />
      )}
    </div>
  );
}
