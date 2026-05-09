import { useApp } from "../../context/AppContext";

export default function IncomingCallNotice() {
  const {
    incomingCall,
    isCallBusy,
    acceptIncomingCall,
    dismissIncomingCall,
    openIncomingCallChat,
  } = useApp();

  if (!incomingCall) return null;

  const callerName =
    incomingCall.from?.name ||
    (incomingCall.from?.role === "doctor" ? "Doctor" : "Patient");
  const roleLabel =
    incomingCall.from?.role === "doctor" ? "Doctor" : "Patient";

  return (
    <div
      className="fixed inset-0 z-[1200] flex items-start justify-center bg-slate-900/45 px-3 pt-5 backdrop-blur-sm"
      role="presentation"
    >
      <div
        className="w-full max-w-[520px] rounded-med border border-[var(--primary-border)] bg-white p-4 text-med-text shadow-2xl"
        role="alertdialog"
        aria-live="assertive"
      >
        <div className="flex items-center gap-3">
          <div className="relative flex h-10 w-10 shrink-0 items-center justify-center rounded-med bg-[var(--primary-dim)]">
            <span className="absolute h-4 w-4 animate-ping rounded-full bg-med-primary opacity-50" />
            <span className="h-3 w-3 rounded-full bg-med-primary" />
          </div>
          <div className="min-w-0">
            <strong className="block text-lg font-semibold">Incoming video call</strong>
            <span className="block truncate text-sm text-med-muted">
              {callerName} · {roleLabel}
              {incomingCall.reason ? ` · ${incomingCall.reason}` : ""}
            </span>
          </div>
        </div>
        <div className="mt-4 flex flex-wrap justify-end gap-2">
          <button
            className="min-h-[38px] rounded-med border border-med-border bg-med-card2 px-3 text-sm font-medium text-med-text disabled:cursor-not-allowed disabled:opacity-55"
            onClick={openIncomingCallChat}
            type="button"
          >
            Open chat
          </button>
          <button
            className="min-h-[38px] rounded-med bg-med-primary px-3 text-sm font-medium text-white disabled:cursor-not-allowed disabled:opacity-55"
            onClick={acceptIncomingCall}
            disabled={isCallBusy}
            type="button"
          >
            {isCallBusy ? "Busy" : "Join video"}
          </button>
          <button
            className="min-h-[38px] rounded-med bg-med-accent px-3 text-sm font-medium text-white"
            onClick={dismissIncomingCall}
            type="button"
          >
            Decline
          </button>
        </div>
      </div>
    </div>
  );
}
