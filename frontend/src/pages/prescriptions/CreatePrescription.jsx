import { useState, useEffect } from "react";
import { useApp, PAGES } from "../../context/AppContext";
import {
  Button,
  EmptyState,
  FormSection,
  InlineSkeleton,
  MobileActionBar,
  PageHeader,
  StepProgress,
} from "../../components/ui/UI";
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
    { name: "", dosage: "", frequency: "", duration: "", instructions: "" },
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
    if (!intake || diagnosis) return;
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
  }, [diagnosis, intake]);

  const filtered = patients.filter((patient) =>
    getPatientSearchText(patient).includes(search.trim().toLowerCase()),
  );

  const addMed = () =>
    setMedicines((m) => [
      ...m,
      { name: "", dosage: "", frequency: "", duration: "", instructions: "" },
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
      const prescriptionMedicines = medicines
        .filter((m) => m.name)
        .map((medicine) => ({
          ...medicine,
          name: medicine.name.trim(),
          instructions: medicine.instructions?.trim() || undefined,
        }));
      const payload = {
        patientId: getPatientId(selectedPatient),
        consultationId: pageParams?.consultationId || undefined,
        diagnosis: diagnosis.trim(),
        medicines: prescriptionMedicines,
        advice: instructions.trim() || undefined,
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
      <PageHeader
        eyebrow="Doctor workflow"
        title="Create Prescription"
        subtitle="Select patient, review complaint, add diagnosis, write doctor instructions, and issue."
        actions={
          <Button variant="outline" onClick={() => navigate(PAGES.CONSULTATION_LIST)}>
            Open consultation records
          </Button>
        }
      />
      <StepProgress
        activeStep={step}
        steps={[
          { label: "Select patient" },
          { label: "Diagnosis and medicines" },
          { label: "Safety check and issue" },
        ]}
      />

      {step === 1 && (
        <FormSection
          eyebrow="Patient"
          title="Select Patient"
          subtitle="Choose the patient for this prescription."
          complete={validStep1}
        >
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
                  <EmptyState
                    title={patients.length === 0 ? "No consulted patients found" : "No patients match your search"}
                    subtitle="Open consultation records to create a prescription from a completed or active consultation."
                    action="Open consultation records"
                    onAction={() => navigate(PAGES.CONSULTATION_LIST)}
                  />
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
        </FormSection>
      )}

      {step === 2 && (
        <FormSection
          eyebrow="Medical details"
          title="Prescription Details"
          subtitle="Review patient intake separately, then add diagnosis, medicines, and doctor instructions."
          complete={Boolean(validStep2)}
        >
          <div className={styles.stepContent}>
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
                  <input
                    className={styles.medInstructionInput}
                    type="text"
                    placeholder="Medicine instructions (e.g. after food)"
                    value={med.instructions}
                    onChange={(e) => updateMed(i, "instructions", e.target.value)}
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
              <label>Doctor instructions</label>
              <textarea
                value={instructions}
                onChange={(e) => setInstructions(e.target.value)}
                placeholder="Add doctor advice, e.g. sleep well, drink fluids, avoid heavy meals, return if symptoms worsen..."
                rows="3"
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
        </FormSection>
      )}

      {step === 3 && (
        <FormSection
          eyebrow="Safety check"
          title="Review and Issue"
          subtitle="Confirm patient, diagnosis, medicine instructions, and doctor advice before issuing."
          complete={Boolean(validStep2 && selectedPatient)}
        >
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
                      {m.instructions ? (
                        <div className={`${styles.muted} break-words`}>
                          Instructions: {m.instructions}
                        </div>
                      ) : null}
                    </div>
                  ))}
              </div>
              {instructions && (
                <div className={styles.reviewSection}>
                  <h3>Doctor instructions</h3>
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
        </FormSection>
      )}
      <MobileActionBar>
        {step > 1 ? (
          <Button variant="outline" onClick={() => setStep(step - 1)} disabled={submitting}>
            Back
          </Button>
        ) : null}
        {step < 3 ? (
          <Button
            variant="primary"
            onClick={() => setStep(step + 1)}
            disabled={step === 1 ? !validStep1 : !validStep2}
          >
            Next
          </Button>
        ) : (
          <Button variant="primary" onClick={submit} disabled={!validStep2 || submitting}>
            {submitting ? "Issuing..." : "Issue"}
          </Button>
        )}
      </MobileActionBar>
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
      <div className="text-[12px] font-semibold uppercase tracking-[0.04em] text-[var(--primary)]">
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
