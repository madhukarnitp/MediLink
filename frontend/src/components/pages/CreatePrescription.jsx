import { Fragment, useState, useEffect } from "react";
import { useApp, PAGES } from "../../context/AppContext";
import { Button, InlineSkeleton } from "../ui/UI";
import {
  prescriptions as rxApi,
  doctors as doctorsApi,
} from "../../services/api";
import { createPrescriptionStyles as styles } from "../../styles/tailwindStyles";

const DOSAGES = [
  "1 tablet",
  "2 tablets",
  "1 capsule",
  "2 capsules",
  "5ml",
  "10ml",
  "As directed",
];
const FREQUENCIES = [
  "Once daily",
  "Twice daily",
  "Thrice daily",
  "Four times daily",
  "At night",
  "Morning & night",
  "As needed",
];

const getPatientId = (patient) => patient?._id || patient?.id || "";
const getPatientName = (patient) =>
  patient?.userId?.name || patient?.name || "Patient";
const getPatientSearchText = (patient) =>
  [
    getPatientName(patient),
    patient?.userId?.email,
    patient?.userId?.phone,
    getPatientId(patient),
  ]
    .filter(Boolean)
    .join(" ")
    .toLowerCase();

export default function CreatePrescription() {
  const { navigate, pageParams, showToast } = useApp();
  const [step, setStep] = useState(1);
  const [patients, setPatients] = useState([]);
  const [loadingPatients, setLoadingPatients] = useState(true);
  const [selectedPatient, setSelectedPatient] = useState(null);
  const [search, setSearch] = useState("");
  const [diagnosis, setDiagnosis] = useState("");
  const [medicines, setMedicines] = useState([
    { name: "", dosage: "", frequency: "", duration: "" },
  ]);
  const [instructions, setInstructions] = useState("");
  const [followUp, setFollowUp] = useState(false);
  const [followUpDate, setFollowUpDate] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const intake = pageParams?.intake || null;

  useEffect(() => {
    (async () => {
      try {
        const r = await doctorsApi.getPatients({ limit: 50 });
        const seen = new Set();
        const pts = [];
        (r.data || []).forEach((row) => {
          const p = row.patient || row;
          const patientId = getPatientId(p);
          if (p && patientId && !seen.has(patientId)) {
            seen.add(patientId);
            pts.push(p);
          }
        });
        setPatients(pts);
        if (pageParams?.patientId) {
          const match = pts.find(
            (patient) => String(getPatientId(patient)) === String(pageParams.patientId),
          );
          if (match) {
            setSelectedPatient(match);
            setSearch(getPatientName(match));
          }
        }
      } catch {
      } finally {
        setLoadingPatients(false);
      }
    })();
  }, [pageParams?.patientId]);

  useEffect(() => {
    if (!intake || diagnosis || instructions) return;
    const symptomText = intake.symptoms?.length
      ? ` Symptoms: ${intake.symptoms.join(", ")}.`
      : "";
    const durationText = intake.duration ? ` Duration: ${intake.duration}.` : "";
    const severityText = intake.severity ? ` Severity: ${intake.severity}.` : "";
    setDiagnosis(
      [intake.chiefComplaint, symptomText, durationText, severityText]
        .filter(Boolean)
        .join("")
        .trim(),
    );
    const safetyNotes = [
      intake.allergies ? `Allergies: ${intake.allergies}` : "",
      intake.currentMedicines ? `Current medicines: ${intake.currentMedicines}` : "",
      intake.existingConditions ? `Existing conditions: ${intake.existingConditions}` : "",
      intake.notes ? `Patient notes: ${intake.notes}` : "",
    ]
      .filter(Boolean)
      .join("\n");
    if (safetyNotes) setInstructions(safetyNotes);
  }, [diagnosis, instructions, intake]);

  const filtered = patients.filter((patient) =>
    getPatientSearchText(patient).includes(search.trim().toLowerCase()),
  );

  const addMed = () =>
    setMedicines((m) => [
      ...m,
      { name: "", dosage: "", frequency: "", duration: "" },
    ]);
  const removeMed = (i) => setMedicines((m) => m.filter((_, j) => j !== i));
  const updateMed = (i, k, v) =>
    setMedicines((m) => m.map((x, j) => (j === i ? { ...x, [k]: v } : x)));

  const validStep1 = !!selectedPatient;
  const validStep2 =
    diagnosis.trim() &&
    medicines.some((m) => m.name && m.dosage && m.frequency && m.duration);

  const submit = async () => {
    if (!validStep2 || !selectedPatient) return;
    setSubmitting(true);
    try {
      const payload = {
        patientId: getPatientId(selectedPatient),
        consultationId: pageParams?.consultationId || undefined,
        diagnosis: diagnosis.trim(),
        medicines: medicines.filter((m) => m.name),
        advice: instructions || undefined,
        followUpDate: followUp && followUpDate ? followUpDate : undefined,
      };
      await rxApi.create(payload);
      showToast("Prescription issued successfully!");
      navigate(PAGES.DOCTOR_PRESCRIPTIONS);
    } catch (e) {
      showToast(e.message, "error");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className={styles.page}>
      <div className={styles.header}>
        <div className="min-w-0">
          <h1 className={styles.headerTitle}>Create Prescription</h1>
          <p className={`${styles.headerSubtitle} break-words`}>
            Select a patient, add clinical details, and review before issuing.
          </p>
        </div>
        <div
          className={`${styles.steps} max-[520px]:grid max-[520px]:grid-cols-[1fr_auto_1fr_auto_1fr] max-[520px]:gap-1 max-[520px]:overflow-visible max-[520px]:[&_span]:h-7 max-[520px]:[&_span]:w-7`}
        >
          {["Patient", "Details", "Review"].map((label, i) => (
            <Fragment key={label}>
              <div
                className={`${styles.step} ${step === i + 1 ? styles.active : ""} ${step > i + 1 ? styles.completed : ""}`}
              >
                <span>{i + 1}</span>
                <label>{label}</label>
              </div>
              {i < 2 && <div className={styles.connector} />}
            </Fragment>
          ))}
        </div>
      </div>

      {step === 1 && (
        <div className={styles.card}>
          <div className={styles.stepContent}>
            <h2>Select Patient</h2>
            <p>Choose the patient for this prescription</p>
            <div className={styles.searchBox}>
              <input
                type="text"
                placeholder="Search by name…"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
            </div>
            {loadingPatients ? (
              <InlineSkeleton className="min-h-[260px]" lines={6} showAvatar />
            ) : (
              <div className={styles.patientList}>
                {filtered.length === 0 ? (
                  <div className={styles.noResults}>
                    {patients.length === 0
                      ? "No consulted patients found yet."
                      : "No patients match your search."}
                  </div>
                ) : (
                  filtered.map((p) => (
                    <button
                      key={getPatientId(p)}
                      className={`${styles.patientCard} min-w-0 max-[520px]:p-3 ${getPatientId(selectedPatient) === getPatientId(p) ? styles.selected : ""}`}
                      onClick={() => setSelectedPatient(p)}
                      type="button"
                    >
                      <div className={`${styles.patientInfo} min-w-0`}>
                        <div className={`${styles.patientName} truncate`}>
                          {getPatientName(p)}
                        </div>
                        <div className={`${styles.patientDetail} break-words`}>
                          ID: {getPatientId(p).slice(-6) || "—"} · Age:{" "}
                          {p.age || "—"}
                        </div>
                      </div>
                      <div className={styles.checkmark}>✓</div>
                    </button>
                  ))
                )}
              </div>
            )}
            <div className={styles.actions}>
              <Button variant="outline" disabled>
                Back
              </Button>
              <Button
                variant="primary"
                disabled={!validStep1}
                onClick={() => setStep(2)}
              >
                Next: Add Details
              </Button>
            </div>
          </div>
        </div>
      )}

      {step === 2 && (
        <div className={styles.card}>
          <div className={styles.stepContent}>
            <h2>Prescription Details</h2>
            <p className="break-words">Patient: {getPatientName(selectedPatient)}</p>
            <IntakePanel intake={intake} />
            <div className={styles.formGroup}>
              <label>Diagnosis</label>
              <textarea
                value={diagnosis}
                onChange={(e) => setDiagnosis(e.target.value)}
                placeholder="Enter diagnosis…"
                rows="3"
              />
            </div>
            <div className={styles.medicinesSection}>
              <div className={styles.sectionHeader}>
                <h3>Medicines</h3>
                <button className={styles.addBtn} onClick={addMed} type="button">
                  Add Medicine
                </button>
              </div>
              {medicines.map((med, i) => (
                <div
                  key={i}
                  className={styles.medicineRow}
                >
                  <input
                    className={styles.inputFull}
                    type="text"
                    placeholder="Medicine name"
                    value={med.name}
                    onChange={(e) => updateMed(i, "name", e.target.value)}
                  />
                  <select
                    className={styles.inputSelect}
                    value={med.dosage}
                    onChange={(e) => updateMed(i, "dosage", e.target.value)}
                  >
                    <option value="">Dosage</option>
                    {DOSAGES.map((d) => (
                      <option key={d}>{d}</option>
                    ))}
                  </select>
                  <select
                    className={styles.inputSelect}
                    value={med.frequency}
                    onChange={(e) => updateMed(i, "frequency", e.target.value)}
                  >
                    <option value="">Frequency</option>
                    {FREQUENCIES.map((f) => (
                      <option key={f}>{f}</option>
                    ))}
                  </select>
                  <input
                    className={styles.inputSmall}
                    type="text"
                    placeholder="Duration"
                    value={med.duration}
                    onChange={(e) => updateMed(i, "duration", e.target.value)}
                  />
                  {medicines.length > 1 && (
                    <button
                      className={styles.removeBtn}
                      onClick={() => removeMed(i)}
                      type="button"
                    >
                      ✕
                    </button>
                  )}
                </div>
              ))}
            </div>
            <div className={styles.formGroup}>
              <label>Instructions</label>
              <textarea
                value={instructions}
                onChange={(e) => setInstructions(e.target.value)}
                placeholder="Special instructions…"
                rows="2"
              />
            </div>
            <div className={styles.followUpBox}>
              <label className={styles.checkbox}>
                <input
                  type="checkbox"
                  checked={followUp}
                  onChange={(e) => setFollowUp(e.target.checked)}
                />
                <span>Requires follow-up</span>
              </label>
              {followUp && (
                <input
                  type="date"
                  className={styles.followUpInput}
                  value={followUpDate}
                  onChange={(e) => setFollowUpDate(e.target.value)}
                />
              )}
            </div>
            <div className={styles.actions}>
              <Button variant="outline" onClick={() => setStep(1)}>
                Back
              </Button>
              <Button
                variant="primary"
                disabled={!validStep2}
                onClick={() => setStep(3)}
              >
                Review Prescription
              </Button>
            </div>
          </div>
        </div>
      )}

      {step === 3 && (
        <div className={styles.card}>
          <div className={styles.stepContent}>
            <h2>Review Prescription</h2>
            <div className={styles.reviewBox}>
              <div className={styles.reviewSection}>
                <h3>Patient</h3>
                <p className="break-words">
                  <strong>{getPatientName(selectedPatient)}</strong>
                </p>
              </div>
              <div className={styles.reviewSection}>
                <h3>Diagnosis</h3>
                <p className="break-words">{diagnosis}</p>
              </div>
              <div className={styles.reviewSection}>
                <h3>Medicines</h3>
                {medicines
                  .filter((m) => m.name)
                  .map((m, i) => (
                    <div key={i} className={`${styles.reviewMedicine} min-w-0`}>
                      <strong className="break-words">{m.name}</strong>
                      <div className={styles.muted}>
                        {m.dosage} · {m.frequency} · {m.duration}
                      </div>
                    </div>
                  ))}
              </div>
              {instructions && (
                <div className={styles.reviewSection}>
                  <h3>Instructions</h3>
                  <p className="break-words">{instructions}</p>
                </div>
              )}
              {followUp && followUpDate && (
                <div className={styles.reviewSection}>
                  <h3>Follow-up</h3>
                  <p>
                    {new Date(followUpDate).toLocaleDateString("en-IN", {
                      day: "numeric",
                      month: "long",
                      year: "numeric",
                    })}
                  </p>
                </div>
              )}
            </div>
            <div className={styles.actions}>
              <Button variant="outline" onClick={() => setStep(2)}>
                Edit
              </Button>
              <Button variant="primary" onClick={submit} disabled={submitting}>
                {submitting ? "Issuing…" : "Issue Prescription"}
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

function IntakePanel({ intake }) {
  if (!intake) return null;
  const rows = [
    ["Issue", intake.chiefComplaint],
    ["Symptoms", intake.symptoms?.join(", ")],
    ["Duration", intake.duration],
    ["Severity", intake.severity],
    ["Allergies", intake.allergies],
    ["Medicines", intake.currentMedicines],
    ["Conditions", intake.existingConditions],
    ["Notes", intake.notes],
  ].filter(([, value]) => value);

  if (!rows.length) return null;

  return (
    <div className="rounded-med border border-[var(--primary-border)] bg-[var(--primary-dim)] p-3">
      <div className="text-[12px] font-black uppercase tracking-[0.04em] text-[var(--primary)]">
        Patient Intake
      </div>
      <div className="mt-2 grid min-w-0 gap-2 sm:grid-cols-2">
        {rows.map(([label, value]) => (
          <div key={label} className="min-w-0">
            <div className="text-[11px] font-bold text-[var(--muted)]">{label}</div>
            <div className="break-words text-[13px] font-bold text-[var(--text)]">
              {value}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
