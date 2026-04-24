import { useState, useEffect, useRef } from "react";
import { useApp, PAGES } from "../../context/AppContext";
import { Button, PageSkeleton, InlineSkeleton, ErrorMsg } from "../ui/UI";
import {
  consultations as consultationsApi,
  doctors as doctorsApi,
  patients as patientsApi,
  prescriptionCache,
  prescriptionSelection,
} from "../../services/api";
import { consultationListStyles as styles } from "../../styles/tailwindStyles";

const getStatusClassName = (status) =>
  ({
    pending: styles.statusPending,
    completed: styles.statusCompleted,
    active: styles.statusActive,
    cancelled: styles.statusCancelled,
  })[status] || styles.statusDefault;

export default function ConsultationList() {
  const { navigate, pageParams, showToast, user } = useApp();
  const [consultList, setConsultList] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [filter, setFilter] = useState("all");
  const [expandedId, setExpandedId] = useState("");
  const [details, setDetails] = useState({});
  const [detailLoading, setDetailLoading] = useState("");
  const openedFromRoute = useRef("");
  const isDoctor = user?.role === "doctor";
  const filters = ["all", "pending", "active", "completed", "cancelled"];

  const load = async () => {
    setLoading(true);
    setError("");
    try {
      const api = isDoctor ? doctorsApi : patientsApi;
      const r = await api.getConsultations({ limit: 50 });
      setConsultList(r.data || []);
    } catch (e) {
      setError(e.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    load();
  }, [isDoctor]);

  useEffect(() => {
    if (
      loading ||
      !pageParams?.consultationId ||
      openedFromRoute.current === pageParams.consultationId
    ) {
      return;
    }
    openedFromRoute.current = pageParams.consultationId;
    openDetails(pageParams.consultationId);
  }, [loading, pageParams?.consultationId]);

  const openDetails = async (consultationId, fallback = null) => {
    if (!consultationId) return;
    if (expandedId === consultationId && details[consultationId]) {
      setExpandedId("");
      return;
    }

    setExpandedId(consultationId);
    if (details[consultationId]) return;

    setDetailLoading(consultationId);
    try {
      const [consultationRes, messagesRes] = await Promise.all([
        consultationsApi.getById(consultationId),
        consultationsApi.getMessages(consultationId),
      ]);
      setDetails((current) => ({
        ...current,
        [consultationId]: {
          consultation: consultationRes.data || fallback,
          messages: messagesRes.data || [],
          totalMessages: messagesRes.total || messagesRes.data?.length || 0,
        },
      }));
    } catch (e) {
      showToast(e.message || "Could not load consultation details", "error");
    } finally {
      setDetailLoading("");
    }
  };

  const openPrescription = (prescription) => {
    if (!prescription?._id) return;
    prescriptionCache.saveItem(prescription);
    prescriptionSelection.set(prescription._id);
    navigate(PAGES.PRESCRIPTION, {
      prescriptionId: prescription._id,
      prescription,
    });
  };

  const createPrescriptionFor = (consultation) => {
    const patientId = consultation?.patient?._id;
    if (!patientId) {
      showToast("Patient details are missing for this consultation", "error");
      return;
    }
    navigate(PAGES.CREATE_PRESCRIPTION, {
      patientId,
      consultationId: consultation._id,
      intake: consultation.intake,
    });
  };

  const filtered =
    filter === "all"
      ? consultList
      : consultList.filter((c) => c.status === filter);
  const count = (s) => consultList.filter((c) => c.status === s).length;

  if (loading)
    return (
      <div className={styles.page}>
        <PageSkeleton />
      </div>
    );
  if (error)
    return (
      <div className={styles.page}>
        <ErrorMsg message={error} onRetry={load} />
      </div>
    );

  return (
    <div className={styles.page}>
      <div className={styles.header}>
        <div>
          <h1 className={styles.headerTitle}>
            {isDoctor ? "Consultation Records" : "My Consultations"}
          </h1>
          <p className={styles.headerSubtitle}>
            {isDoctor
              ? "Review patient consultations, status, and chat history"
              : "View and manage your past and active consultations"}
          </p>
        </div>
        {isDoctor ? (
          <Button variant="outline" onClick={() => navigate(PAGES.CONSULTATION)}>
            Current Rooms
          </Button>
        ) : (
          <Button variant="primary" onClick={() => navigate(PAGES.DOCTORS)}>
            + New Consultation
          </Button>
        )}
      </div>
      <div className={styles.filterBar}>
        {filters.map((f) => (
          <button
            key={f}
            className={`${styles.filterBtn} ${filter === f ? styles.active : ""}`}
            onClick={() => setFilter(f)}
          >
            {f.charAt(0).toUpperCase() + f.slice(1)} (
            {f === "all" ? consultList.length : count(f)})
          </button>
        ))}
      </div>
      <div className={styles.list}>
        {filtered.length === 0 ? (
          <div className={styles.empty}>
            <span className={styles.emptyIcon}>💬</span>
            <p>No consultations found</p>
          </div>
        ) : (
          filtered.map((c) => {
            const peer = isDoctor ? c.patient : c.doctor;
            const peerName =
              peer?.userId?.name || peer?.name || (isDoctor ? "Patient" : "Doctor");
            const peerLabel = isDoctor
              ? "Patient"
              : c.doctor?.specialization || "Specialist";
            const consultationTitle = isDoctor
              ? `Consultation with ${peerName}`
              : c.reason || "General Consultation";
            const consultationMeta = isDoctor
              ? `Reason: ${c.reason || "General consultation"}`
              : `${peerLabel}: Dr. ${peerName.replace("Dr. ", "")}`;
            const isRoomAction = c.status === "active" || c.status === "pending";
            const actionLabel = isRoomAction
              ? c.status === "active"
                ? "Join Chat"
                : isDoctor
                  ? "Review"
                  : "Waiting"
              : expandedId === c._id
                ? "Hide Details"
                : "View More";
            const detail = details[c._id];
            const detailConsultation = detail?.consultation || c;
            return (
              <div key={c._id} className={styles.card}>
                <div className={styles.cardHeader}>
                  <div className={styles.cardInfo}>
                    <div className={`${styles.title} break-words`}>
                      {consultationTitle}
                    </div>
                    <div className={`${styles.meta} break-words`}>
                      {new Date(c.createdAt).toLocaleDateString("en-IN", {
                        day: "numeric",
                        month: "short",
                        year: "numeric",
                      })}{" "}
                      • {consultationMeta}
                    </div>
                  </div>
                  <div
                    className={`${styles.status} ${getStatusClassName(c.status)}`}
                  >
                    {c.status}
                  </div>
                </div>
                <div className={styles.actions}>
                  <Button
                    variant={isRoomAction ? "primary" : "outline"}
                    onClick={() => {
                      if (isRoomAction) {
                        navigate(PAGES.CONSULTATION, { consultationId: c._id });
                        return;
                      }
                      openDetails(c._id, c);
                    }}
                    disabled={c.status === "pending" && !isDoctor}
                  >
                    {actionLabel}
                  </Button>
                </div>
                {expandedId === c._id ? (
                  <ConsultationDetails
                    consultation={detailConsultation}
                    detailLoading={detailLoading === c._id}
                    isDoctor={isDoctor}
                    messages={detail?.messages || []}
                    onCreatePrescription={createPrescriptionFor}
                    onOpenPrescription={openPrescription}
                    totalMessages={detail?.totalMessages || 0}
                    user={user}
                  />
                ) : null}
              </div>
            );
          })
        )}
      </div>
    </div>
  );
}

function ConsultationDetails({
  consultation,
  detailLoading,
  isDoctor,
  messages,
  onCreatePrescription,
  onOpenPrescription,
  totalMessages,
  user,
}) {
  const prescription = consultation?.prescription;
  const duration = formatDuration(consultation?.duration);
  const chatPreview = messages.slice(-8);

  return (
    <div className={styles.detailPanel}>
      {detailLoading ? (
        <div className={styles.detailLoading}>
          <InlineSkeleton className="min-h-[220px]" lines={5} showAvatar />
        </div>
      ) : (
        <>
          <div className={styles.detailGrid}>
            <DetailItem label="Requested" value={formatDateTime(consultation?.createdAt)} />
            <DetailItem label="Started" value={formatDateTime(consultation?.startedAt)} />
            <DetailItem label="Ended" value={formatDateTime(consultation?.endedAt)} />
            <DetailItem label="Call Time" value={duration} />
            <DetailItem label="Messages" value={String(totalMessages)} />
            <DetailItem label="Room" value={consultation?.roomId?.slice(-12) || "—"} />
          </div>

          {consultation?.notes ? (
            <div className={styles.notesBox}>
              <span>Doctor Notes</span>
              <p>{consultation.notes}</p>
            </div>
          ) : null}

          <IntakeDetails intake={consultation?.intake} />

          {consultation?.review?.rating ? (
            <div className={styles.reviewBox}>
              <span>{isDoctor ? "Patient Rating" : "Your Rating"}</span>
              <p>
                {"★".repeat(consultation.review.rating)}
                {"☆".repeat(5 - consultation.review.rating)}
                {consultation.review.comment
                  ? ` · ${consultation.review.comment}`
                  : ""}
              </p>
            </div>
          ) : null}

          <div className={styles.relatedRow}>
            <div>
              <div className={styles.relatedTitle}>Related Prescription</div>
              <div className={styles.relatedMeta}>
                {prescription
                  ? `${prescription.rxId || "Prescription"} · ${prescription.diagnosis || "Diagnosis added"}`
                  : "No prescription is linked to this consultation yet."}
              </div>
            </div>
            {prescription ? (
              <Button variant="primary" onClick={() => onOpenPrescription(prescription)}>
                View Prescription
              </Button>
            ) : isDoctor && consultation?.status !== "cancelled" ? (
              <Button variant="primary" onClick={() => onCreatePrescription(consultation)}>
                Create Prescription
              </Button>
            ) : null}
          </div>

          <div className={styles.chatSection}>
            <div className={styles.chatHeader}>
              <h3>Chat Transcript</h3>
              {totalMessages > chatPreview.length ? (
                <span>Last {chatPreview.length} messages</span>
              ) : null}
            </div>
            {chatPreview.length ? (
              <div className={styles.messageList}>
                {chatPreview.map((message) => {
                  const mine =
                    String(message.sender?._id || message.sender) === String(user?._id);
                  const senderName =
                    message.sender?.name ||
                    (message.senderRole === "doctor" ? "Doctor" : "Patient");
                  return (
                    <div
                      key={message._id}
                      className={`${styles.messageRow} ${
                        mine ? styles.messageMine : ""
                      }`}
                    >
                      <div className={styles.messageMeta}>
                        <span>{mine ? "You" : senderName}</span>
                        <span>{formatTime(message.createdAt)}</span>
                      </div>
                      <div className={styles.messageText}>
                        {message.text || "Attachment"}
                      </div>
                    </div>
                  );
                })}
              </div>
            ) : (
              <div className={styles.emptyTranscript}>
                No chat messages were recorded.
              </div>
            )}
          </div>
        </>
      )}
    </div>
  );
}

function IntakeDetails({ intake }) {
  if (!intake) return null;
  const rows = [
    ["Main Issue", intake.chiefComplaint],
    ["Symptoms", intake.symptoms?.join(", ")],
    ["Duration", intake.duration],
    ["Severity", intake.severity],
    ["Allergies", intake.allergies],
    ["Current Medicines", intake.currentMedicines],
    ["Existing Conditions", intake.existingConditions],
    ["Other Notes", intake.notes],
  ].filter(([, value]) => value);

  if (!rows.length) return null;

  return (
    <div className={styles.notesBox}>
      <span>Patient Intake</span>
      <div className="mt-2 grid min-w-0 gap-2 sm:grid-cols-2">
        {rows.map(([label, value]) => (
          <div
            key={label}
            className="min-w-0 rounded-med border border-[var(--border)] bg-[var(--card)] p-2.5"
          >
            <div className="text-[11px] font-black uppercase tracking-[0.04em] text-[var(--muted)]">
              {label}
            </div>
            <div className="mt-1 break-words text-[13px] font-bold text-[var(--text)]">
              {value}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

function DetailItem({ label, value }) {
  return (
    <div className={styles.detailItem}>
      <span>{label}</span>
      <strong>{value || "—"}</strong>
    </div>
  );
}

function formatDateTime(value) {
  if (!value) return "—";
  return new Date(value).toLocaleString("en-IN", {
    day: "numeric",
    month: "short",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}

function formatTime(value) {
  if (!value) return "";
  return new Date(value).toLocaleTimeString("en-IN", {
    hour: "2-digit",
    minute: "2-digit",
  });
}

function formatDuration(value) {
  if (value === undefined || value === null) return "—";
  const minutes = Number(value);
  if (!minutes) return "Less than 1 min";
  if (minutes < 60) return `${minutes} min`;
  const hours = Math.floor(minutes / 60);
  const remainder = minutes % 60;
  return remainder ? `${hours} hr ${remainder} min` : `${hours} hr`;
}
