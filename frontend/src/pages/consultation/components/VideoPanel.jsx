import {
  CALL_STATES,
  getCallLabel,
} from "./callMachine";
import { formatDuration } from "./consultationUtils";

const isMediaControlEnabled = (callState, hasLocalStream) =>
  callState.status === CALL_STATES.ACTIVE && hasLocalStream && !callState.controlsLocked;

const cx = (...items) => items.filter(Boolean).join(" ");

const buttonBase =
  "inline-flex min-h-[38px] min-w-[78px] max-w-[220px] items-center justify-center rounded-med border px-3 text-xs font-extrabold transition disabled:cursor-not-allowed disabled:opacity-45";
const neutralButton =
  `${buttonBase} border-med-border bg-med-card2 text-med-text hover:border-slate-300`;
const primaryButton =
  `${buttonBase} border-med-primary bg-med-primary text-white hover:opacity-95`;
const dangerButton =
  `${buttonBase} border-med-accent bg-med-accent text-white hover:opacity-95`;
const blueButton =
  `${buttonBase} border-blue-700 bg-blue-700 text-white hover:opacity-95`;

export default function VideoPanel({
  audioOn,
  callState,
  elapsed,
  hasLocalStream,
  hasRemoteStream,
  initials,
  localVideoRef,
  myInitials,
  onAcceptCall,
  onCancelCall,
  onEndCall,
  onMinimize,
  onOpenVideoWindow,
  onRejectCall,
  onStartCall,
  onSwitchCamera,
  onToggleAudio,
  onToggleScreenShare,
  onToggleSpeaker,
  onToggleVideo,
  peerName,
  remoteVideoRef,
  screenSharing,
  specialization,
  speakerOn,
  videoOn,
  disabled,
  immersive = false,
}) {
  const statusLabel = getCallLabel(callState);

  return (
    <div
      className={cx(
        "flex flex-col overflow-hidden rounded-med border border-med-border bg-med-card",
        immersive && "h-full w-full border-0 shadow-2xl",
      )}
    >
      <div className="flex items-center gap-2.5 border-b border-med-border p-3.5">
        <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-med border border-med-border bg-med-card2 text-xs font-bold">
          {initials}
        </div>
        <div>
          <div className="text-[13px] font-semibold text-med-text">{peerName}</div>
          <div className="text-[11px] text-med-muted">
            {specialization || statusLabel}
          </div>
        </div>
        <div
          className="ml-auto text-[11px] font-semibold tabular-nums text-med-primary"
          aria-live="polite"
        >
          {statusLabel}
          {(callState.status === CALL_STATES.ACTIVE ||
            callState.status === CALL_STATES.MINIMIZED) &&
            ` · ${formatDuration(elapsed)}`}
        </div>
      </div>

      <div className="relative flex min-h-[300px] flex-1 items-center justify-center bg-gradient-to-br from-slate-100 to-slate-200">
        {(callState.status === CALL_STATES.CONNECTING ||
          callState.status === CALL_STATES.ENDING) && (
          <div
            className="absolute right-4 top-4 z-[3] h-9 w-9 animate-spin rounded-full border-[3px] border-white/50 border-t-med-primary"
            aria-hidden="true"
          />
        )}

        <video
          ref={remoteVideoRef}
          autoPlay
          playsInline
          className={cx(
            "absolute inset-0 h-full w-full bg-slate-900 object-cover",
            hasRemoteStream ? "block" : "hidden",
          )}
        />

        {!hasRemoteStream && (
          <VideoPlaceholder
            callState={callState}
            disabled={disabled}
            initials={initials}
            peerName={peerName}
          />
        )}

        <div
          className={cx(
            "absolute bottom-3 right-3 flex h-[60px] w-20 items-center justify-center overflow-hidden rounded-med border border-med-border bg-med-card text-xl font-bold text-sky-500 shadow-xl",
            hasLocalStream ? "block" : "hidden",
          )}
        >
          <video
            ref={localVideoRef}
            autoPlay
            playsInline
            muted
            className="h-full w-full bg-slate-900 object-cover"
          />
        </div>

        {!hasLocalStream && (
          <div className="absolute bottom-3 right-3 flex h-[60px] w-20 items-center justify-center rounded-med border border-dashed border-med-border bg-white/80">
            <span className="text-base font-bold text-sky-500">{myInitials}</span>
          </div>
        )}

        {callState.status === CALL_STATES.ACTIVE && (
          <div className="absolute left-2.5 top-2.5 rounded-md border border-med-border bg-white/90 px-2 py-1 text-[10px] text-med-muted">
            {callState.reconnecting
              ? "Reconnecting..."
              : screenSharing
                ? "Sharing screen"
                : "Live call"}
          </div>
        )}
      </div>

      <VideoControls
        audioOn={audioOn}
        callState={callState}
        disabled={disabled}
        hasLocalStream={hasLocalStream}
        hasRemoteStream={hasRemoteStream}
        onAcceptCall={onAcceptCall}
        onCancelCall={onCancelCall}
        onEndCall={onEndCall}
        onMinimize={onMinimize}
        onOpenVideoWindow={onOpenVideoWindow}
        onRejectCall={onRejectCall}
        onStartCall={onStartCall}
        onSwitchCamera={onSwitchCamera}
        onToggleAudio={onToggleAudio}
        onToggleScreenShare={onToggleScreenShare}
        onToggleSpeaker={onToggleSpeaker}
        onToggleVideo={onToggleVideo}
        screenSharing={screenSharing}
        speakerOn={speakerOn}
        videoOn={videoOn}
      />
    </div>
  );
}

export function MinimizedCallWidget({
  audioOn,
  callState,
  elapsed,
  onEndCall,
  onRestore,
  peerName,
  speakerOn,
  videoOn,
}) {
  if (callState.status !== CALL_STATES.MINIMIZED) return null;

  return (
    <div
      className="fixed bottom-4 right-4 z-[1000] flex min-w-[320px] max-w-[calc(100vw-24px)] items-center justify-between gap-3.5 rounded-med border border-white/10 bg-slate-900 p-3 text-white shadow-2xl max-sm:left-2.5 max-sm:right-2.5 max-sm:min-w-0"
      role="status"
      aria-live="polite"
    >
      <div>
        <strong className="block text-[13px]">{peerName}</strong>
        <span className="mt-0.5 block text-xs font-extrabold tabular-nums text-med-primary">
          {formatDuration(elapsed)}
        </span>
        <small className="mt-0.5 block text-[11px] text-slate-300">
          {audioOn ? "Mic on" : "Muted"} · {videoOn ? "Camera on" : "Camera off"} ·{" "}
          {speakerOn ? "Speaker on" : "Speaker off"}
        </small>
      </div>
      <div className="flex gap-2">
        <button
          className="min-h-[34px] rounded-med bg-blue-700 px-3 text-xs font-extrabold text-white"
          onClick={onRestore}
          type="button"
        >
          Return
        </button>
        <button
          className="min-h-[34px] rounded-med bg-med-accent px-3 text-xs font-extrabold text-white"
          onClick={onEndCall}
          type="button"
        >
          End
        </button>
      </div>
    </div>
  );
}

function VideoPlaceholder({ callState, disabled, initials, peerName }) {
  const hint = {
    [CALL_STATES.IDLE]: disabled
      ? "Video starts after the consultation is active"
      : "Click Call to start video",
    [CALL_STATES.OUTGOING]: `Calling ${peerName}...`,
    [CALL_STATES.INCOMING]: "Incoming call",
    [CALL_STATES.CONNECTING]: "Connecting...",
    [CALL_STATES.ACTIVE]: callState.reconnecting
      ? "Reconnecting..."
      : "Connected. Waiting for video...",
    [CALL_STATES.ENDING]: "Call ended",
    [CALL_STATES.ERROR]: callState.error || "Call failed",
  }[callState.status];

  return (
    <div className="flex flex-col items-center justify-center gap-3 p-6 text-center text-med-muted">
      <div className="flex h-[72px] w-[72px] items-center justify-center rounded-med border-2 border-med-border bg-med-card2 font-display text-[26px] font-bold text-med-text">
        {initials}
      </div>
      <p
        className={cx(
          "max-w-[240px] text-xs",
          callState.status === CALL_STATES.ERROR && "text-red-400",
        )}
      >
        {hint}
      </p>
    </div>
  );
}

function VideoControls({
  audioOn,
  callState,
  disabled,
  hasLocalStream,
  hasRemoteStream,
  onAcceptCall,
  onCancelCall,
  onEndCall,
  onMinimize,
  onOpenVideoWindow,
  onRejectCall,
  onStartCall,
  onSwitchCamera,
  onToggleAudio,
  onToggleScreenShare,
  onToggleSpeaker,
  onToggleVideo,
  screenSharing,
  speakerOn,
  videoOn,
}) {
  const locked = callState.controlsLocked;
  const mediaEnabled = isMediaControlEnabled(callState, hasLocalStream);

  if (callState.status === CALL_STATES.OUTGOING) {
    return (
      <div className="flex flex-wrap items-center justify-end gap-3 border-t border-med-border p-3.5">
        <button
          className={dangerButton}
          disabled={locked}
          onClick={onCancelCall}
          type="button"
        >
          Cancel
        </button>
      </div>
    );
  }

  if (callState.status === CALL_STATES.INCOMING) {
    return (
      <div className="flex flex-wrap items-center justify-end gap-3 border-t border-med-border p-3.5">
        <div className="flex flex-wrap items-center gap-2">
          <button
            className={dangerButton}
            disabled={locked}
            onClick={onRejectCall}
            type="button"
          >
            Reject
          </button>
          <button
            className={primaryButton}
            disabled={locked}
            onClick={onAcceptCall}
            type="button"
          >
            Accept
          </button>
        </div>
      </div>
    );
  }

  if (callState.status === CALL_STATES.CONNECTING) {
    return (
      <div className="flex flex-wrap items-center justify-between gap-3 border-t border-med-border p-3.5">
        <span className="text-[13px] font-bold text-med-muted">Connecting...</span>
        <button
          className={dangerButton}
          disabled={locked}
          onClick={onCancelCall}
          type="button"
        >
          Cancel
        </button>
      </div>
    );
  }

  if (callState.status === CALL_STATES.ACTIVE) {
    return (
      <div className="flex flex-wrap items-center justify-between gap-3 border-t border-med-border p-3.5">
        <div className="flex flex-wrap items-center gap-2 max-sm:grid max-sm:w-full max-sm:grid-cols-3">
          <button
            className={cx(neutralButton, !audioOn && "border-red-200 bg-red-50 text-med-accent")}
            disabled={!mediaEnabled}
            onClick={onToggleAudio}
            type="button"
          >
            {audioOn ? "Mute" : "Unmute"}
          </button>
          <button
            className={cx(neutralButton, !videoOn && "border-red-200 bg-red-50 text-med-accent")}
            disabled={!mediaEnabled}
            onClick={onToggleVideo}
            type="button"
          >
            {videoOn ? "Camera" : "Camera off"}
          </button>
          <button
            className={cx(neutralButton, !speakerOn && "border-red-200 bg-red-50 text-med-accent")}
            disabled={locked}
            onClick={onToggleSpeaker}
            type="button"
          >
            {speakerOn ? "Speaker" : "Speaker off"}
          </button>
          <button
            className={neutralButton}
            disabled={!mediaEnabled}
            onClick={onSwitchCamera}
            type="button"
          >
            Switch
          </button>
          <button
            className={cx(neutralButton, screenSharing && "border-sky-200 bg-sky-50 text-sky-600")}
            disabled={locked || callState.reconnecting}
            onClick={onToggleScreenShare}
            type="button"
          >
            Share
          </button>
        </div>

        <div className="ml-auto flex flex-wrap items-center gap-2 border-l border-med-border pl-3 max-sm:ml-0 max-sm:grid max-sm:w-full max-sm:grid-cols-3 max-sm:border-l-0 max-sm:pl-0">
          <button
            className={blueButton}
            disabled={locked || (!hasLocalStream && !hasRemoteStream)}
            onClick={onOpenVideoWindow}
            type="button"
          >
            Pop-out
          </button>
          <button
            className={blueButton}
            disabled={locked}
            onClick={onMinimize}
            type="button"
          >
            Minimize
          </button>
          <button
            className={dangerButton}
            disabled={locked}
            onClick={onEndCall}
            type="button"
          >
            End call
          </button>
        </div>
      </div>
    );
  }

  if (callState.status === CALL_STATES.ENDING) {
    return (
      <div className="flex flex-wrap items-center justify-between gap-3 border-t border-med-border p-3.5">
        <span className="text-[13px] font-bold text-med-muted">Ending call...</span>
      </div>
    );
  }

  return (
    <div className="flex flex-wrap items-center justify-end gap-3 border-t border-med-border p-3.5">
      <button
        className={primaryButton}
        disabled={disabled || locked}
        onClick={onStartCall}
        type="button"
      >
        {callState.status === CALL_STATES.ERROR ? "Try again" : "Request call"}
      </button>
      {callState.status === CALL_STATES.ERROR && (
        <button
          className={neutralButton}
          disabled={locked}
          onClick={onEndCall}
          type="button"
        >
          Dismiss
        </button>
      )}
    </div>
  );
}
