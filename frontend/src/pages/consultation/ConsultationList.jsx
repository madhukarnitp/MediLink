import { useState, useEffect, useMemo, useRef } from "react";
import { useApp, PAGES } from "../../context/AppContext";
import {
  Button,
  ErrorMsg,
  InlineSkeleton,
  ModalPanel,
  PageSkeleton,
} from "../../components/ui/UI";
import {
  consultations as consultationsApi,
  doctors as doctorsApi,
  patients as patientsApi,
  prescriptionCache,
  prescriptionSelection,
} from "../../services/api";
import { consultationListStyles as styles } from "../../styles/tailwindStyles";

const getStatusClassName = (status) =>
  styles[`status_${status}`] || styles.statusDefault || "";

const statusLabel = (status = "pending") =>
  status.replaceAll("_", " ").replace(/^\w/, (char) => char.toUpperCase());

export default function ConsultationList() {
  const { navigate, pageParams, showToast, user } = useApp();
  const [consultList, setConsultList] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [filter, setFilter] = useState("all");
  const [expandedId, setExpandedId] = useState("");
  const [details, setDetails] = useState({});
  const [messagesByConsultation, setMessagesByConsultation] = useState({});
  const [messagesLoading, setMessagesLoading] = useState("");
  const [detailLoading, setDetailLoading] = useState("");
  const [selectedPatientId, setSelectedPatientId] = useState("");
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
    if (isDoctor && pageParams?.patientId) {
      setSelectedPatientId(pageParams.patientId);
    }
  }, [isDoctor, pageParams?.patientId]);

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
      const consultationRes = await consultationsApi.getById(consultationId);
      setDetails((current) => ({
        ...current,
        [consultationId]: {
          consultation: consultationRes.data || fallback,
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

  const closeDetails = () => {
    setExpandedId("");
  };

  const loadMessages = async (consultationId) => {
    if (!consultationId || messagesByConsultation[consultationId]) return;
    setMessagesLoading(consultationId);
    try {
      const messagesRes = await consultationsApi.getMessages(consultationId);
      setMessagesByConsultation((current) => ({
        ...current,
        [consultationId]: {
          messages: messagesRes.data || [],
          totalMessages: messagesRes.total || messagesRes.data?.length || 0,
        },
      }));
    } catch (e) {
      showToast(e.message || "Could not load chat transcript", "error");
    } finally {
      setMessagesLoading("");
    }
  };

  const filtered =
    filter === "all"
      ? consultList
      : consultList.filter((c) => c.status === filter);
  const count = (s) => consultList.filter((c) => c.status === s).length;

  const patientRows = useMemo(() => {
    if (!isDoctor) return [];
    const rows = new Map();
    filtered.forEach((consultation) => {
      const patient = consultation.patient || {};
      const patientId = patient._id || patient.userId?._id || "unknown";
      const existing = rows.get(patientId);
      const currentDate = new Date(consultation.createdAt).getTime();
      const existingDate = existing?.latest
        ? new Date(existing.latest.createdAt).getTime()
        : 0;

      rows.set(patientId, {
        patient,
        patientId,
        latest:
          !existing || currentDate > existingDate
            ? consultation
            : existing.latest,
        total: (existing?.total || 0) + 1,
        completed:
          (existing?.completed || 0) +
          (consultation.status === "completed" ? 1 : 0),
        open:
          (existing?.open || 0) +
          (["active", "pending"].includes(consultation.status) ? 1 : 0),
      });
    });
    return [...rows.values()].sort(
      (a, b) => new Date(b.latest.createdAt) - new Date(a.latest.createdAt),
    );
  }, [filtered, isDoctor]);

  const selectedPatientConsultations = useMemo(() => {
    if (!selectedPatientId) return [];
    return consultList
      .filter((consultation) => {
        const patient = consultation.patient || {};
        const patientId = patient._id || patient.userId?._id || "unknown";
        return String(patientId) === String(selectedPatientId);
      })
      .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
  }, [consultList, selectedPatientId]);

  const selectedPatient = selectedPatientConsultations[0]?.patient;

  const renderConsultationCard = (c) => {
    const peer = isDoctor ? c.patient : c.doctor;
    const peerName =
      peer?.userId?.name || peer?.name || (isDoctor ? "Patient" : "Doctor");
    const peerLabel = isDoctor
      ? "Patient"
      : c.doctor?.specialization || "Specialist";
    const consultationTitle = isDoctor
      ? c.reason || `Consultation with ${peerName}`
      : c.reason || "General Consultation";
    const consultationMeta = isDoctor
      ? `${new Date(c.createdAt).toLocaleDateString("en-IN", {
          day: "numeric",
          month: "short",
          year: "numeric",
        })} • ${peerName}`
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

    return (
      <article key={c._id} className={styles.card}>
        <div className={styles.cardTop}>
          <div className={styles.cardInfo}>
            <div className={styles.cardTitle}>{consultationTitle}</div>
            <div className={styles.cardMeta}>
              {consultationMeta}
              {isDoctor && c.status ? ` • ${statusLabel(c.status)}` : ""}
            </div>
          </div>
          <span className={`${styles.status} ${getStatusClassName(c.status)}`}>
            {statusLabel(c.status)}
          </span>
        </div>
        <div className={styles.actions}>
          <Button
            className={isRoomAction ? styles.actionBtnPrimary : styles.actionBtn}
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
      </article>
    );
  };

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
          <h1>{isDoctor ? "Consultation Records" : "My Consultations"}</h1>
          <p>
            {isDoctor
              ? "Review patient consultations, status, and private records on demand."
              : "View and manage your past and active consultations."}
          </p>
        </div>
        {isDoctor ? (
          <Button variant="outline" onClick={() => navigate(PAGES.CONSULTATION)}>
            Current Rooms
          </Button>
        ) : (
          <Button variant="primary" onClick={() => navigate(PAGES.DOCTORS)}>
            New Consultation
          </Button>
        )}
      </div>

      <div className={styles.filterBar}>
        {filters.map((f) => (
          <button
            className={`${styles.filterBtn} ${filter === f ? styles.filterActive : ""}`}
            key={f}
            onClick={() => setFilter(f)}
            type="button"
          >
            <span>{statusLabel(f)}</span>
            <strong>{f === "all" ? consultList.length : count(f)}</strong>
          </button>
        ))}
      </div>

      <div className={styles.list}>
        {isDoctor && selectedPatientId ? (
          <>
            <div className={styles.patientHistoryHeader}>
              <div>
                <span>Patient Consultation History</span>
                <h2>
                  {selectedPatient?.userId?.name ||
                    selectedPatient?.name ||
                    "Selected patient"}
                </h2>
                <p>
                  Showing all consultations for this patient, newest first.
                </p>
              </div>
              <Button
                variant="outline"
                onClick={() => setSelectedPatientId("")}
              >
                Back to Patients
              </Button>
            </div>

            {selectedPatientConsultations.length === 0 ? (
              <div className={styles.empty}>
                <strong>No history found</strong>
                <span>No consultation history is available for this patient.</span>
              </div>
            ) : (
              selectedPatientConsultations.map(renderConsultationCard)
            )}
          </>
        ) : isDoctor ? (
          patientRows.length === 0 ? (
            <div className={styles.empty}>
              <strong>No patients found</strong>
              <span>Try another status filter or show all records.</span>
              <Button
                className={styles.actionBtnPrimary}
                onClick={() => setFilter("all")}
                variant="outline"
              >
                Show All
              </Button>
            </div>
          ) : (
            patientRows.map((row) => {
              const patientName =
                row.patient?.userId?.name || row.patient?.name || "Patient";
              return (
                <article key={row.patientId} className={styles.card}>
                  <div className={styles.cardTop}>
                    <div className={styles.cardInfo}>
                      <div className={styles.cardTitle}>{patientName}</div>
                      <div className={styles.cardMeta}>
                        {row.total} consultation{row.total === 1 ? "" : "s"} •{" "}
                        Latest:{" "}
                        {new Date(row.latest.createdAt).toLocaleDateString(
                          "en-IN",
                          {
                            day: "numeric",
                            month: "short",
                            year: "numeric",
                          },
                        )}{" "}
                        • {row.latest.reason || "General consultation"}
                      </div>
                    </div>
                    <span
                      className={`${styles.status} ${getStatusClassName(row.latest.status)}`}
                    >
                      {row.open ? `${row.open} Open` : `${row.completed} Completed`}
                    </span>
                  </div>
                  <div className={styles.actions}>
                    <Button
                      className={styles.actionBtnPrimary}
                      onClick={() => setSelectedPatientId(row.patientId)}
                      variant="primary"
                    >
                      View History
                    </Button>
                  </div>
                </article>
              );
            })
          )
        ) : filtered.length === 0 ? (
          <div className={styles.empty}>
            <strong>No consultations found</strong>
            <span>
              {isDoctor
                ? "Try another status filter or show all records."
                : "Try another status filter or start a new consultation."}
            </span>
            <Button
              className={styles.actionBtnPrimary}
              onClick={() => (isDoctor ? setFilter("all") : navigate(PAGES.DOCTORS))}
              variant={isDoctor ? "outline" : "primary"}
            >
              {isDoctor ? "Show All" : "Start Consultation"}
            </Button>
          </div>
        ) : (
          filtered.map(renderConsultationCard)
        )}
      </div>
      {expandedId ? (
        <ConsultationDetailsModal
          consultation={details[expandedId]?.consultation}
          detailLoading={detailLoading === expandedId}
          isDoctor={isDoctor}
          messages={messagesByConsultation[expandedId]?.messages || []}
          messagesLoaded={Boolean(messagesByConsultation[expandedId])}
          messagesLoading={messagesLoading === expandedId}
          onClose={closeDetails}
          onCreatePrescription={createPrescriptionFor}
          onLoadMessages={() => loadMessages(expandedId)}
          onOpenPrescription={openPrescription}
          totalMessages={messagesByConsultation[expandedId]?.totalMessages || 0}
          user={user}
        />
      ) : null}
    </div>
  );
}

function ConsultationDetailsModal({
  consultation,
  detailLoading,
  isDoctor,
  messages,
  messagesLoaded,
  messagesLoading,
  onClose,
  onCreatePrescription,
  onLoadMessages,
  onOpenPrescription,
  totalMessages,
  user,
}) {
  const prescription = consultation?.prescription;
  const duration = formatDuration(consultation?.duration);
  const chatPreview = messages.slice(-8);

  return (
    <ModalPanel
      className="max-w-5xl"
      eyebrow="Consultation record"
      title={consultation?.reason || "Consultation Details"}
      subtitle="Related records stay hidden until you open this panel. Chat is loaded only on request."
      onClose={onClose}
    >
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
              {messagesLoaded && totalMessages > chatPreview.length ? (
                <span>Last {chatPreview.length} messages</span>
              ) : null}
            </div>
            {!messagesLoaded ? (
              <div className={styles.chatLocked}>
                <div>
                  <strong>Chat is private by default</strong>
                  <span>Open the transcript only when you need to review messages.</span>
                </div>
                <Button variant="outline" onClick={onLoadMessages} disabled={messagesLoading}>
                  {messagesLoading ? "Loading..." : "Show chat transcript"}
                </Button>
              </div>
            ) : chatPreview.length ? (
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
    </ModalPanel>
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
            <div className="text-[11px] font-semibold uppercase tracking-[0.04em] text-[var(--muted)]">
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
