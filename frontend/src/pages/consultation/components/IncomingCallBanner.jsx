export default function IncomingCallBanner({
  onAccept,
  onDecline,
  onOpenCall,
  peerName,
}) {
  return (
    <div
      className="fixed left-1/2 top-3 z-[1100] flex w-[min(720px,calc(100vw-24px))] -translate-x-1/2 items-center justify-between gap-3 rounded-med border border-[var(--primary-border)] bg-[var(--primary-dim)] p-3.5 shadow-xl max-sm:flex-col max-sm:items-stretch"
      role="alert"
    >
      <div className="flex items-center gap-2.5">
        <div className="h-[13px] w-[13px] animate-ping rounded-full bg-med-primary" />
        <div>
          <div className="text-lg font-semibold text-med-text">Incoming video call</div>
          <div className="text-sm text-med-muted">{peerName}</div>
        </div>
      </div>
      <div className="flex items-center gap-2.5 max-sm:flex-col max-sm:items-stretch">
        {onOpenCall && (
          <button
            className="min-h-[38px] rounded-med bg-blue-700 px-3 text-sm font-medium text-white max-sm:w-full"
            onClick={onOpenCall}
            type="button"
          >
            Open call
          </button>
        )}
        <button
          className="min-h-[38px] rounded-med bg-med-accent px-3 text-sm font-medium text-white max-sm:w-full"
          onClick={onDecline}
          type="button"
        >
          Decline
        </button>
        <button
          className="min-h-[38px] rounded-med bg-med-primary px-3 text-sm font-medium text-white max-sm:w-full"
          onClick={onAccept}
          type="button"
        >
          Accept
        </button>
      </div>
    </div>
  );
}
