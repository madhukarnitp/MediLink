import { useEffect, useMemo, useState } from "react";
import { useApp, PAGES } from "../../context/AppContext";
import { Button, ErrorMsg, PageSkeleton } from "../../components/ui/UI";
import { doctors as doctorsApi, resolveAssetUrl } from "../../services/api";
import { doctorPatientsStyles as styles } from "../../styles/tailwindStyles";

const FILTERS = [
  { value: "all", label: "All" },
  { value: "active", label: "Active" },
  { value: "pending", label: "Pending" },
  { value: "completed", label: "Completed" },
];

const formatDate = (value) => {
  if (!value) return "No date";
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return "No date";
  return date.toLocaleDateString("en-IN", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });
};

const getInitials = (name = "Patient") =>
  name
    .split(" ")
    .filter(Boolean)
    .map((part) => part[0])
    .join("")
    .slice(0, 2)
    .toUpperCase() || "P";

const getStatusClassName = (status) =>
  ({
    pending: styles.statusPending,
    completed: styles.statusCompleted,
    active: styles.statusActive,
    cancelled: styles.statusCancelled,
  })[status] || styles.statusDefault;

const statusLabel = (status = "history") =>
  status.replaceAll("_", " ").replace(/^\w/, (char) => char.toUpperCase());

const formatDuration = (value) => {
  if (value === undefined || value === null) return "—";
  const minutes = Number(value);
  if (!minutes) return "Less than 1 min";
  if (minutes < 60) return `${minutes} min`;
  const hours = Math.floor(minutes / 60);
  const remainder = minutes % 60;
  return remainder ? `${hours} hr ${remainder} min` : `${hours} hr`;
};

export default function DoctorPatients() {
  const { navigate, pageParams } = useApp();
  const [patients, setPatients] = useState([]);
  const [consultations, setConsultations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [query, setQuery] = useState("");
  const [filter, setFilter] = useState("all");
  const selectedPatientId = pageParams?.patientId || "";

  const load = async () => {
    setLoading(true);
    setError("");
    try {
      const [patientsResponse, consultationsResponse] = await Promise.all([
        doctorsApi.getPatients({ limit: 50 }),
        doctorsApi.getConsultations({ limit: 100 }),
      ]);
      setPatients(patientsResponse.data || []);
      setConsultations(consultationsResponse.data || []);
    } catch (err) {
      setError(err.message || "Unable to load patients");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    load();
  }, []);

  const summary = useMemo(
    () => ({
      patients: patients.length,
      consultations: patients.reduce(
        (sum, row) => sum + (row.totalConsultations || 0),
        0,
      ),
      active: patients.reduce(
        (sum, row) => sum + (row.activeConsultations || 0),
        0,
      ),
      prescriptions: patients.reduce(
        (sum, row) => sum + (row.prescriptionsIssued || 0),
        0,
      ),
    }),
    [patients],
  );

  const filteredPatients = useMemo(() => {
    const normalized = query.trim().toLowerCase();
    return patients.filter((row) => {
      const patient = row.patient || {};
      const user = patient.userId || {};
      const haystack = [
        user.name,
        user.email,
        user.phone,
        patient._id,
        row.lastConsultation?.reason,
      ]
        .filter(Boolean)
        .join(" ")
        .toLowerCase();

      const matchesQuery = !normalized || haystack.includes(normalized);
      const matchesFilter =
        filter === "all" || (row[`${filter}Consultations`] || 0) > 0;
      return matchesQuery && matchesFilter;
    });
  }, [filter, patients, query]);

  const selectedPatient = useMemo(
    () =>
      patients.find(
        (row) => String(row.patient?._id || "") === String(selectedPatientId),
      ) || null,
    [patients, selectedPatientId],
  );

  const selectedConsultations = useMemo(() => {
    if (!selectedPatientId) return [];
    return consultations
      .filter((consultation) => {
        const patientId =
          consultation.patient?._id ||
          consultation.patientId ||
          consultation.patient;
        return String(patientId) === String(selectedPatientId);
      })
      .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
  }, [consultations, selectedPatientId]);

  if (loading) {
    return (
      <div className={styles.page}>
        <PageSkeleton />
      </div>
    );
  }

  if (error) {
    return (
      <div className={styles.page}>
        <ErrorMsg message={error} onRetry={load} />
      </div>
    );
  }

  return (
    <div className={styles.page}>
      <div className={styles.header}>
        <div>
          <h1 className={styles.headerTitle}>My Patients</h1>
          <p className={styles.headerSubtitle}>
            People who have consulted with you, including old patients.
          </p>
        </div>
        <Button variant="outline" onClick={() => navigate(PAGES.CONSULTATION_LIST)}>
          Consultation Records
        </Button>
      </div>

      <div className={styles.summaryGrid}>
        <div className={styles.summaryCard}>
          <span>Total Patients</span>
          <strong>{summary.patients}</strong>
        </div>
        <div className={styles.summaryCard}>
          <span>Consultations</span>
          <strong>{summary.consultations}</strong>
        </div>
        <div className={styles.summaryCard}>
          <span>Active Now</span>
          <strong>{summary.active}</strong>
        </div>
        <div className={styles.summaryCard}>
          <span>Rx Issued</span>
          <strong>{summary.prescriptions}</strong>
        </div>
      </div>

      <div className={styles.toolbar}>
        <div className={styles.searchBox}>
          <input
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            placeholder="Search patient, email, phone, or reason"
            type="search"
          />
        </div>
        <div className={styles.filterBar}>
          {FILTERS.map((item) => (
            <button
              key={item.value}
              className={`${styles.filterBtn} ${
                filter === item.value ? styles.active : ""
              }`}
              onClick={() => setFilter(item.value)}
              type="button"
            >
              {item.label}
            </button>
          ))}
        </div>
      </div>

      {selectedPatientId && (
        <PatientConsultationHistory
          consultationRows={selectedConsultations}
          onClose={() =>
            navigate(PAGES.DOCTOR_PATIENTS, {}, { updateUrl: true, replace: true })
          }
          onCreatePrescription={(patientId, consultationId, intake) =>
            navigate(PAGES.CREATE_PRESCRIPTION, {
              patientId,
              consultationId,
              intake,
            })
          }
          onOpenConsultation={(consultation) => {
            const targetPage =
              consultation.status === "active" || consultation.status === "pending"
                ? PAGES.CONSULTATION
                : PAGES.CONSULTATION_LIST;
            navigate(targetPage, { consultationId: consultation._id });
          }}
          patientRow={selectedPatient}
          selectedPatientId={selectedPatientId}
        />
      )}

      <div className={styles.list}>
        {filteredPatients.length === 0 ? (
          <div className={styles.empty}>
            <strong>No patients found</strong>
            <span>
              {patients.length === 0
                ? "Your consulted patients will appear here after a consultation starts."
                : "Try a different search or filter."}
            </span>
          </div>
        ) : (
          filteredPatients.map((row) => {
            const patient = row.patient || {};
            const user = patient.userId || {};
            const name = user.name || "Patient";
            const avatarUrl = resolveAssetUrl(user.avatar);
            const last = row.lastConsultation || {};
            const activeOrPending =
              (row.activeConsultations || 0) + (row.pendingConsultations || 0);
            const isSelected = String(patient._id) === String(selectedPatientId);

            return (
              <article
                className={`${styles.card} ${isSelected ? styles.cardSelected : ""}`}
                key={patient._id}
              >
                <div className={styles.patientBlock}>
                  <div className={styles.avatar}>
                    {avatarUrl ? <img src={avatarUrl} alt="" /> : getInitials(name)}
                  </div>
                  <div className={styles.patientInfo}>
                    <div className={styles.nameRow}>
                      <h2>{name}</h2>
                      <span
                        className={`${styles.status} ${getStatusClassName(last.status)}`}
                      >
                        {last.status || "history"}
                      </span>
                    </div>
                    <div className={styles.meta}>
                      <span>{user.email || "No email"}</span>
                      <span>{user.phone || "No phone"}</span>
                      <span>ID: {patient._id?.slice(-6)}</span>
                    </div>
                    <div className={`${styles.lastReason} break-words`}>
                      Last consultation:{" "}
                      {formatDate(row.lastConsultationAt || last.createdAt)}
                    </div>
                  </div>
                </div>

                <div className={styles.stats}>
                  <span>
                    <strong>{row.totalConsultations || 0}</strong>
                    Consults
                  </span>
                  <span>
                    <strong>{row.completedConsultations || 0}</strong>
                    Completed
                  </span>
                  <span>
                    <strong>{activeOrPending}</strong>
                    Open
                  </span>
                  <span>
                    <strong>{row.prescriptionsIssued || 0}</strong>
                    Rx
                  </span>
                </div>

                <div className={styles.actions}>
                  {last._id && (
                    <Button
                      variant="outline"
                      onClick={() =>
                        navigate(PAGES.CONSULTATION, {
                          consultationId: last._id,
                        })
                      }
                    >
                      Open Last
                    </Button>
                  )}
                  <Button
                    variant={isSelected ? "primary" : "outline"}
                    onClick={() =>
                      navigate(
                        PAGES.DOCTOR_PATIENTS,
                        { patientId: patient._id },
                        { updateUrl: true },
                      )
                    }
                  >
                    History
                  </Button>
                  <Button
                    variant="outline"
                    onClick={() =>
                      navigate(PAGES.PATIENT_VITALS, {
                        patientId: patient._id,
                      })
                    }
                  >
                    Vitals
                  </Button>
                  <Button
                    variant="outline"
                    onClick={() =>
                      navigate(PAGES.PATIENT_REPORTS, {
                        patientId: patient._id,
                      })
                    }
                  >
                    Reports
                  </Button>
                  <Button
                    variant="primary"
                    onClick={() =>
                      navigate(PAGES.CREATE_PRESCRIPTION, {
                        patientId: patient._id,
                      })
                    }
                  >
                    New Rx
                  </Button>
                </div>
              </article>
            );
          })
        )}
      </div>
    </div>
  );
}

function PatientConsultationHistory({
  consultationRows,
  onClose,
  onCreatePrescription,
  onOpenConsultation,
  patientRow,
  selectedPatientId,
}) {
  const patient = patientRow?.patient || {};
  const user = patient.userId || {};
  const name = user.name || "Selected patient";
  const lastConsultation = patientRow?.lastConsultation || {};

  return (
    <section className={styles.historyPanel}>
      <div className={styles.historyHeader}>
        <div>
          <span>Patient Wise Details</span>
          <h2>{name}</h2>
          <p>
            {user.email || "No email"} · {user.phone || "No phone"} ·{" "}
            {consultationRows.length} consultation
            {consultationRows.length === 1 ? "" : "s"}
          </p>
        </div>
        <Button variant="outline" onClick={onClose}>
          Close
        </Button>
      </div>

      <div className={styles.historySummary}>
        <div>
          <span>Total Consults</span>
          <strong>{patientRow?.totalConsultations || consultationRows.length || 0}</strong>
        </div>
        <div>
          <span>Completed</span>
          <strong>{patientRow?.completedConsultations || 0}</strong>
        </div>
        <div>
          <span>Open</span>
          <strong>
            {(patientRow?.activeConsultations || 0) +
              (patientRow?.pendingConsultations || 0)}
          </strong>
        </div>
        <div>
          <span>Last Visit</span>
          <strong>
            {formatDate(patientRow?.lastConsultationAt || lastConsultation.createdAt)}
          </strong>
        </div>
      </div>

      <div className={styles.historyList}>
        {consultationRows.length === 0 ? (
          <div className={styles.empty}>
            <strong>No consultation details found</strong>
            <span>
              This patient summary exists, but detailed consultation records are not available yet.
            </span>
          </div>
        ) : (
          consultationRows.map((consultation) => (
            <article className={styles.historyItem} key={consultation._id}>
              <div className={styles.historyItemTop}>
                <div>
                  <h3>{consultation.reason || "General consultation"}</h3>
                  <p>
                    {formatDate(consultation.createdAt)} · Duration:{" "}
                    {formatDuration(consultation.duration)}
                  </p>
                </div>
                <span
                  className={`${styles.status} ${getStatusClassName(consultation.status)}`}
                >
                  {statusLabel(consultation.status)}
                </span>
              </div>

              <div className={styles.historyInfoGrid}>
                <div>
                  <span>Started</span>
                  <strong>{formatDate(consultation.startedAt)}</strong>
                </div>
                <div>
                  <span>Ended</span>
                  <strong>{formatDate(consultation.endedAt)}</strong>
                </div>
                <div>
                  <span>Messages</span>
                  <strong>{consultation.messageCount || consultation.messages?.length || "—"}</strong>
                </div>
                <div>
                  <span>Prescription</span>
                  <strong>{consultation.prescription ? "Linked" : "Not added"}</strong>
                </div>
              </div>

              {(consultation.notes || consultation.intake?.chiefComplaint) && (
                <div className={styles.historyNotes}>
                  {consultation.intake?.chiefComplaint && (
                    <p>
                      <strong>Complaint:</strong>{" "}
                      {consultation.intake.chiefComplaint}
                    </p>
                  )}
                  {consultation.notes && (
                    <p>
                      <strong>Doctor notes:</strong> {consultation.notes}
                    </p>
                  )}
                </div>
              )}

              <div className={styles.historyActions}>
                <Button
                  variant="outline"
                  onClick={() => onOpenConsultation(consultation)}
                >
                  Open Details
                </Button>
                {!consultation.prescription && consultation.status !== "cancelled" && (
                  <Button
                    variant="primary"
                    onClick={() =>
                      onCreatePrescription(
                        selectedPatientId,
                        consultation._id,
                        consultation.intake,
                      )
                    }
                  >
                    Create Rx
                  </Button>
                )}
              </div>
            </article>
          ))
        )}
      </div>
    </section>
  );
}
