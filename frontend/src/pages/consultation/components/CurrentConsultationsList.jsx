import { useEffect, useMemo, useState } from "react";
import { PAGES } from "../../../context/AppContext";
import { doctors as doctorsApi, patients as patientsApi } from "../../../services/api";
import { Button, ErrorMsg, InlineSkeleton } from "../../../components/ui/UI";

const CURRENT_STATUSES = new Set(["pending", "active"]);

const getStatusClassName = (status) =>
  status === "active"
    ? "bg-[var(--primary-dim)] text-med-primary"
    : status === "pending"
      ? "bg-amber-100 text-amber-800"
      : "bg-med-card2 text-med-muted";

const formatDateTime = (value) => {
  if (!value) return "Time not available";
  return new Date(value).toLocaleString("en-IN", {
    day: "numeric",
    month: "short",
    hour: "numeric",
    minute: "2-digit",
  });
};

export default function CurrentConsultationsList({ isCallBusy = false, navigate, user }) {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const isDoctor = user?.role === "doctor";

  const load = async () => {
    setLoading(true);
    setError("");
    try {
      const api = isDoctor ? doctorsApi : patientsApi;
      const response = await api.getConsultations({ limit: 50 });
      setItems(response.data || []);
    } catch (e) {
      setError(e.message || "Could not load consultations");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    load();
  }, [isDoctor]);

  const currentItems = useMemo(
    () => items.filter((item) => CURRENT_STATUSES.has(item.status)),
    [items],
  );

  const openRoom = (consultationId, startVideo = false) => {
    if (startVideo && isCallBusy) return;
    navigate(PAGES.CONSULTATION, {
      consultationId,
      mode: startVideo ? "call" : "chat",
      startVideo,
    });
  };

  const createPrescription = (consultation) => {
    const patientId = consultation?.patient?._id;
    if (!patientId) return;
    navigate(PAGES.CREATE_PRESCRIPTION, {
      patientId,
      consultationId: consultation._id,
      intake: consultation.intake,
    });
  };

  if (loading) {
    return (
      <InlineSkeleton className="min-h-[260px] p-8" lines={5} showAvatar />
    );
  }

  if (error) {
    return <ErrorMsg message={error} onRetry={load} />;
  }

  return (
    <div className="flex flex-col gap-4">
      <div className="flex items-center justify-between gap-3 max-sm:items-start">
        <div className="min-w-0 flex-1">
          <h1 className="font-display text-[22px] font-bold text-med-text">
            Current Consultations
          </h1>
          <p className="mt-1 text-[13px] text-med-muted">
            Select a consultation room to continue chat or start a video call.
          </p>
        </div>
        {!isDoctor && (
          <div className="ml-auto shrink-0">
            <Button variant="primary" onClick={() => navigate(PAGES.DOCTORS)}>
              New Consultation
            </Button>
          </div>
        )}
      </div>

      {currentItems.length === 0 ? (
        <div className="flex flex-col gap-1.5 rounded-med border border-dashed border-med-border bg-med-card px-5 py-10 text-center">
          <strong className="text-[15px] text-med-text">No current consultations</strong>
          <span className="text-[13px] text-med-muted">
            Active and pending consultations will appear here with their time.
          </span>
        </div>
      ) : (
        <div className="flex flex-col gap-3">
          {currentItems.map((consultation) => {
            const peer = isDoctor ? consultation.patient : consultation.doctor;
            const peerName =
              peer?.userId?.name || peer?.name || (isDoctor ? "Patient" : "Doctor");
            const detail = isDoctor
              ? "Patient"
              : consultation.doctor?.specialization || "Doctor";
            const time = consultation.startedAt || consultation.createdAt;
            const isActive = consultation.status === "active";

            return (
              <article
                key={consultation._id}
                className="flex items-center justify-between gap-4 rounded-med border border-med-border bg-med-card p-4 transition hover:border-slate-300 hover:shadow-sm max-sm:flex-col max-sm:items-stretch"
              >
                <div className="min-w-0 flex-1">
                  <div className="mb-1 flex items-center gap-2.5">
                    <h2 className="m-0 text-base font-bold text-med-text">{peerName}</h2>
                    <span
                      className={`rounded-full px-2 py-1 text-[11px] font-bold capitalize ${getStatusClassName(
                        consultation.status,
                      )}`}
                    >
                      {consultation.status}
                    </span>
                  </div>
                  <p className="mb-2 text-[13px] text-med-text">
                    {consultation.reason || "General consultation"}
                  </p>
                  {isDoctor && <IntakeSummary intake={consultation.intake} />}
                  <div className="flex flex-wrap gap-2.5 text-xs text-med-muted">
                    <span>{detail}</span>
                    <span>{formatDateTime(time)}</span>
                  </div>
                </div>
                <div className="ml-auto flex shrink-0 items-center justify-end gap-2.5 max-sm:w-full max-sm:flex-row">
                  {isDoctor && !consultation.prescription && (
                    <Button
                      variant="outline"
                      onClick={() => createPrescription(consultation)}
                    >
                      Prescribe
                    </Button>
                  )}
                  <Button
                    variant={isActive ? "outline" : "primary"}
                    onClick={() => openRoom(consultation._id)}
                  >
                    {isDoctor && !isActive ? "Accept / Chat" : "Chat"}
                  </Button>
                  <Button
                    variant="primary"
                    disabled={!isActive || isCallBusy}
                    onClick={() => openRoom(consultation._id, true)}
                  >
                    {isCallBusy ? "Call in progress" : "Video Call"}
                  </Button>
                </div>
              </article>
            );
          })}
        </div>
      )}
    </div>
  );
}

function IntakeSummary({ intake }) {
  if (!intake) return null;
  const details = [
    intake.duration ? `Duration: ${intake.duration}` : "",
    intake.severity ? `Severity: ${intake.severity}` : "",
    intake.allergies ? `Allergies: ${intake.allergies}` : "",
    intake.currentMedicines ? `Medicines: ${intake.currentMedicines}` : "",
  ].filter(Boolean);

  return (
    <div className="mb-3 rounded-med border border-med-border bg-med-card2 p-3 text-[12px] text-med-muted">
      {intake.symptoms?.length ? (
        <div className="mb-1 font-bold text-med-text">
          Symptoms: {intake.symptoms.join(", ")}
        </div>
      ) : null}
      {details.length ? (
        <div className="flex flex-wrap gap-x-3 gap-y-1">
          {details.map((item) => (
            <span key={item}>{item}</span>
          ))}
        </div>
      ) : null}
      {intake.existingConditions ? (
        <div className="mt-1">Conditions: {intake.existingConditions}</div>
      ) : null}
      {intake.notes ? <div className="mt-1">Notes: {intake.notes}</div> : null}
    </div>
  );
}
