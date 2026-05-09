export default function ConsultationHeader({
  accepting,
  canAccept,
  consultationStatus,
  isActive,
  onAccept,
  onLeave,
  peerName,
  leaveLabel,
  leaving,
  socketReady,
  specialization,
}) {
  const statusText =
    consultationStatus === "pending"
      ? "Waiting for doctor acceptance"
      : consultationStatus
        ? consultationStatus.charAt(0).toUpperCase() +
          consultationStatus.slice(1)
        : "Connecting";

  return (
    <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
      <div className="min-w-0">
        <h1 className="font-display text-[22px] font-bold text-med-text">
          {isActive ? "Live Consultation" : "Consultation Request"}
        </h1>
        <p className="mt-1 text-[13px] text-med-muted">
          {socketReady ? (
            <>
              <span className="text-[10px] text-med-primary">●</span> Connected with{" "}
              {peerName}
              {specialization ? ` · ${specialization}` : ""} · {statusText}
            </>
          ) : (
            `Connecting to ${peerName}...`
          )}
        </p>
      </div>

      <div className="flex w-full flex-wrap items-center gap-2 sm:w-auto sm:justify-end">
        <button
          className="min-h-[38px] w-full shrink-0 rounded-med border border-med-border bg-med-card px-3.5 py-2.5 text-xs font-bold text-med-text transition hover:bg-med-card2 disabled:cursor-not-allowed disabled:opacity-55 sm:w-auto"
          onClick={onLeave}
          disabled={leaving || accepting}
          type="button"
        >
          {leaving ? "Closing..." : leaveLabel || "Close"}
        </button>

        {canAccept && (
          <button
            className="min-h-[38px] w-full shrink-0 whitespace-nowrap rounded-med bg-med-primary px-3.5 py-2.5 text-xs font-bold text-white disabled:cursor-not-allowed disabled:opacity-55 sm:w-auto"
            onClick={onAccept}
            disabled={accepting || leaving}
            type="button"
          >
            {accepting ? "Accepting..." : "Accept Consultation"}
          </button>
        )}
      </div>
    </div>
  );
}
