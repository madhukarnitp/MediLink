import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { useApp, PAGES } from "../../context/AppContext";
import { StatusBadge, Button, PageSkeleton, ErrorMsg } from "../ui/UI";
import { doctors as doctorsApi } from "../../services/api";
import { doctorListStyles as styles } from "../../styles/tailwindStyles";

const SPECS = [
  "All Specializations",
  "General Physician",
  "Cardiologist",
  "Dermatologist",
  "Neurologist",
  "Orthopedic",
  "Pediatrician",
  "Psychiatrist",
  "Gynecologist",
  "Urologist",
  "ENT Specialist",
];

export default function DoctorList() {
  const { navigate, pageParams, showToast } = useApp();
  const [doctors, setDoctors] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [spec, setSpec] = useState("All Specializations");
  const [onlineOnly, setOnlineOnly] = useState(false);
  const [maxPrice, setMaxPrice] = useState(2000);
  const [starting, setStarting] = useState(null);
  const [intakeDoctor, setIntakeDoctor] = useState(null);
  const [intakeForm, setIntakeForm] = useState(getEmptyIntakeForm);
  const presenceRefreshTimer = useRef(null);
  const searchTerm = (pageParams.search || "").trim().toLowerCase();
  const visibleDoctors = useMemo(
    () =>
      doctors.filter((doc) => {
        if (!searchTerm) return true;
        return [doc.userId?.name, doc.specialization, doc.qualification, doc.bio]
          .filter(Boolean)
          .join(" ")
          .toLowerCase()
          .includes(searchTerm);
      }),
    [doctors, searchTerm],
  );

  useEffect(() => {
    if (pageParams.specialty && SPECS.includes(pageParams.specialty)) {
      setSpec(pageParams.specialty);
    }
  }, [pageParams.specialty]);

  const load = useCallback(async ({ silent = false } = {}) => {
    if (!silent) setLoading(true);
    setError("");
    try {
      const params = { limit: 50 };
      if (spec !== "All Specializations") params.specialty = spec;
      if (onlineOnly) params.online = "true";
      if (maxPrice < 2000) params.maxPrice = maxPrice;
      const r = await doctorsApi.getAll(params);
      setDoctors(r.data || []);
    } catch (e) {
      if (!silent) setError(e.message);
    } finally {
      if (!silent) setLoading(false);
    }
  }, [maxPrice, onlineOnly, spec]);

  useEffect(() => {
    load();
  }, [load]);

  useEffect(() => {
    const sameDoctorUser = (doc, doctorUserId) =>
      String(doc.userId?._id || doc.userId) === String(doctorUserId);

    const scheduleRefresh = () => {
      if (presenceRefreshTimer.current) {
        window.clearTimeout(presenceRefreshTimer.current);
      }
      presenceRefreshTimer.current = window.setTimeout(() => {
        load({ silent: true });
        presenceRefreshTimer.current = null;
      }, 1200);
    };

    const applyPresence = ({ doctorUserId, online, lastSeen } = {}) => {
      if (!doctorUserId) return;

      setDoctors((current) => {
        const next = current.map((doc) => {
          if (!sameDoctorUser(doc, doctorUserId)) return doc;
          return {
            ...doc,
            online,
            lastSeen: lastSeen || doc.lastSeen,
            userId:
              typeof doc.userId === "object"
                ? { ...doc.userId, lastSeen: lastSeen || doc.userId?.lastSeen }
                : doc.userId,
          };
        });

        if (onlineOnly && online === false) {
          return next.filter((doc) => !sameDoctorUser(doc, doctorUserId));
        }

        return next;
      });

      scheduleRefresh();
    };

    const onPresence = (event) => applyPresence(event.detail || {});

    window.addEventListener("medilink:doctor-presence", onPresence);
    return () => {
      window.removeEventListener("medilink:doctor-presence", onPresence);
      if (presenceRefreshTimer.current) {
        window.clearTimeout(presenceRefreshTimer.current);
        presenceRefreshTimer.current = null;
      }
    };
  }, [load, onlineOnly]);

  useEffect(() => {
    const refresh = window.setInterval(() => {
      load({ silent: true });
    }, 30000);
    return () => window.clearInterval(refresh);
  }, [load]);

  const handleConsult = async (doc, form) => {
    setStarting(doc._id);
    try {
      const { consultations } = await import("../../services/api");
      const intake = buildIntakePayload(form);
      const r = await consultations.start(
        doc._id,
        intake.chiefComplaint,
        intake,
      );
      showToast(
        "Request sent with your health details. The doctor can prescribe directly or connect with you.",
      );
      setIntakeDoctor(null);
      setIntakeForm(getEmptyIntakeForm());
      navigate(PAGES.CONSULTATION, {
        consultationId: r.data._id,
        mode: "chat",
        doctor: {
          ...doc,
          name: doc.userId?.name,
          initials: (doc.userId?.name || "DR")
            .split(" ")
            .map((n) => n[0])
            .join("")
            .toUpperCase()
            .slice(0, 2),
          color: "#3ECF8E",
        },
      });
    } catch (e) {
      showToast(e.message, "error");
    } finally {
      setStarting(null);
    }
  };

  const openIntake = (doc) => {
    setIntakeDoctor(doc);
    setIntakeForm(getEmptyIntakeForm());
  };

  const closeIntake = () => {
    if (starting) return;
    setIntakeDoctor(null);
  };

  return (
    <div className={styles.page}>
      <div className={styles.greeting}>
        <h1>Find a Doctor</h1>
        <p>Connect with verified specialists instantly</p>
      </div>
      <div className={styles.filtersBar}>
        <select
          className={styles.select}
          value={spec}
          onChange={(e) => setSpec(e.target.value)}
        >
          {SPECS.map((s) => (
            <option key={s}>{s}</option>
          ))}
        </select>
        <button
          aria-pressed={onlineOnly}
          className={`${styles.toggle} ${onlineOnly ? styles.toggleActive : ""}`}
          onClick={() => setOnlineOnly((value) => !value)}
          type="button"
        >
          <span
            className={`${styles.toggleTrack} ${onlineOnly ? styles.on : styles.off}`}
          >
            <span
              className={`${styles.toggleThumb} ${
                onlineOnly ? styles.toggleThumbOn : ""
              }`}
            />
          </span>
          Available now
        </button>
        <div className={styles.priceRange}>
          <span>Price:</span>
          <input
            type="range"
            min={100}
            max={2000}
            value={maxPrice}
            onChange={(e) => setMaxPrice(Number(e.target.value))}
            step={50}
          />
          <span>₹{maxPrice}</span>
        </div>
        <span className={styles.resultCount}>
          {visibleDoctors.length} doctors found
          {searchTerm ? ` for "${pageParams.search}"` : ""}
        </span>
      </div>
      {loading ? (
        <PageSkeleton />
      ) : error ? (
        <ErrorMsg message={error} onRetry={load} />
      ) : (
        <div className={styles.grid}>
          {visibleDoctors.map((doc) => {
            const doctorName = doc.userId?.name || "Doctor";
            const initials = doctorName
              .split(" ")
              .map((n) => n[0])
              .join("")
              .toUpperCase()
              .slice(0, 2);
            const summary =
              doc.qualification ||
              doc.bio ||
              "Verified specialist for secure online care.";

            return (
              <article key={doc._id} className={styles.card}>
                <div className={styles.cardTop}>
                  <div className={styles.doctorIdentity}>
                    <div className={styles.photo}>{initials}</div>
                    <div className={styles.identityCopy}>
                      <div className={styles.name}>{doctorName}</div>
                      <div className={styles.spec}>{doc.specialization}</div>
                    </div>
                  </div>
                  <div className={styles.statusWrap}>
                    <StatusBadge online={doc.online} />
                  </div>
                </div>

                <p className={styles.doctorSummary}>{summary}</p>

                <div className={styles.cardMetaRow}>
                  <div className={styles.rating}>
                    ★ {doc.rating || 0}
                    <span>{doc.ratingCount || 0} reviews</span>
                  </div>
                  <div className={styles.price}>₹{doc.price} / consult</div>
                </div>

                <div className={styles.cardActions}>
                  <Button
                    variant="primary"
                    disabled={!doc.online || starting === doc._id}
                    className={`${styles.cardButton} ${
                      doc.online ? styles.consultButton : styles.unavailableButton
                    }`}
                    onClick={doc.online ? () => openIntake(doc) : undefined}
                  >
                    {starting === doc._id
                      ? "Starting..."
                      : doc.online
                        ? "Consult now"
                        : "Unavailable"}
                  </Button>
                  <Button
                    className={`${styles.cardButton} ${styles.appointmentButton}`}
                    onClick={() =>
                      navigate(PAGES.APPOINTMENTS, { doctorId: doc._id })
                    }
                    variant="outline"
                  >
                    Book visit
                  </Button>
                </div>
              </article>
            );
          })}
          {visibleDoctors.length === 0 && (
            <div className={styles.empty}>No doctors match your filters.</div>
          )}
        </div>
      )}
      {intakeDoctor ? (
        <ConsultIntakeModal
          doctor={intakeDoctor}
          form={intakeForm}
          onChange={setIntakeForm}
          onClose={closeIntake}
          onSubmit={() => handleConsult(intakeDoctor, intakeForm)}
          submitting={starting === intakeDoctor._id}
        />
      ) : null}
    </div>
  );
}

function getEmptyIntakeForm() {
  return {
    chiefComplaint: "",
    symptoms: "",
    duration: "",
    severity: "moderate",
    existingConditions: "",
    currentMedicines: "",
    allergies: "",
    notes: "",
  };
}

function buildIntakePayload(form) {
  return {
    chiefComplaint: form.chiefComplaint.trim(),
    symptoms: form.symptoms
      .split(",")
      .map((item) => item.trim())
      .filter(Boolean),
    duration: form.duration.trim(),
    severity: form.severity,
    existingConditions: form.existingConditions.trim(),
    currentMedicines: form.currentMedicines.trim(),
    allergies: form.allergies.trim(),
    notes: form.notes.trim(),
  };
}

function ConsultIntakeModal({
  doctor,
  form,
  onChange,
  onClose,
  onSubmit,
  submitting,
}) {
  const doctorName = doctor.userId?.name || "Doctor";
  const issueLength = form.chiefComplaint.trim().length;
  const canSubmit = issueLength >= 10 && !submitting;
  const update = (key, value) => onChange((current) => ({ ...current, [key]: value }));

  return (
    <div
      className="fixed inset-0 z-[1100] flex items-center justify-center bg-slate-950/45 p-4 backdrop-blur-sm"
      role="dialog"
      aria-modal="true"
      aria-label="Share consultation details"
    >
      <div className="flex max-h-[92vh] w-full max-w-2xl flex-col overflow-hidden rounded-med border border-[var(--border)] bg-[var(--card)] shadow-[0_24px_70px_rgba(15,23,42,0.24)]">
        <div className="flex items-start justify-between gap-3 border-b border-[var(--border)] p-4">
          <div className="min-w-0">
            <h2 className="m-0 text-[18px] font-black text-[var(--text)]">
              Share details for {doctorName}
            </h2>
            <p className="mt-1 text-[13px] text-[var(--muted)]">
              This helps the doctor decide whether a prescription is enough or chat/call is needed.
            </p>
          </div>
          <button
            className="flex h-9 w-9 shrink-0 items-center justify-center rounded-med border border-[var(--border)] bg-[var(--surface)] text-[18px] font-bold text-[var(--muted)] hover:text-[var(--text)]"
            onClick={onClose}
            disabled={submitting}
            type="button"
            aria-label="Close"
          >
            x
          </button>
        </div>

        <div className="grid min-w-0 gap-3 overflow-y-auto p-4 sm:grid-cols-2">
          <label className="flex min-w-0 flex-col gap-1.5 sm:col-span-2">
            <span className="text-[13px] font-bold text-[var(--text)]">Main issue</span>
            <textarea
              className="min-h-[96px] rounded-med border border-[var(--border)] bg-[var(--surface)] p-3 text-[13px] text-[var(--text)] outline-none focus:border-[var(--primary)]"
              value={form.chiefComplaint}
              onChange={(e) => update("chiefComplaint", e.target.value)}
              placeholder="Describe the problem, when it started, and what worries you most."
              maxLength={500}
            />
          </label>

          <label className="flex min-w-0 flex-col gap-1.5">
            <span className="text-[13px] font-bold text-[var(--text)]">Symptoms</span>
            <input
              className="min-h-[40px] rounded-med border border-[var(--border)] bg-[var(--surface)] px-3 text-[13px] text-[var(--text)] outline-none focus:border-[var(--primary)]"
              value={form.symptoms}
              onChange={(e) => update("symptoms", e.target.value)}
              placeholder="Fever, cough, headache"
            />
          </label>

          <label className="flex min-w-0 flex-col gap-1.5">
            <span className="text-[13px] font-bold text-[var(--text)]">Duration</span>
            <input
              className="min-h-[40px] rounded-med border border-[var(--border)] bg-[var(--surface)] px-3 text-[13px] text-[var(--text)] outline-none focus:border-[var(--primary)]"
              value={form.duration}
              onChange={(e) => update("duration", e.target.value)}
              placeholder="2 days, 1 week"
              maxLength={120}
            />
          </label>

          <label className="flex min-w-0 flex-col gap-1.5">
            <span className="text-[13px] font-bold text-[var(--text)]">Severity</span>
            <select
              className="min-h-[40px] rounded-med border border-[var(--border)] bg-[var(--surface)] px-3 text-[13px] text-[var(--text)] outline-none focus:border-[var(--primary)]"
              value={form.severity}
              onChange={(e) => update("severity", e.target.value)}
            >
              <option value="mild">Mild</option>
              <option value="moderate">Moderate</option>
              <option value="severe">Severe</option>
              <option value="urgent">Urgent</option>
            </select>
          </label>

          <label className="flex min-w-0 flex-col gap-1.5">
            <span className="text-[13px] font-bold text-[var(--text)]">Allergies</span>
            <input
              className="min-h-[40px] rounded-med border border-[var(--border)] bg-[var(--surface)] px-3 text-[13px] text-[var(--text)] outline-none focus:border-[var(--primary)]"
              value={form.allergies}
              onChange={(e) => update("allergies", e.target.value)}
              placeholder="None, penicillin, dust"
              maxLength={300}
            />
          </label>

          <label className="flex min-w-0 flex-col gap-1.5">
            <span className="text-[13px] font-bold text-[var(--text)]">Current medicines</span>
            <textarea
              className="min-h-[72px] rounded-med border border-[var(--border)] bg-[var(--surface)] p-3 text-[13px] text-[var(--text)] outline-none focus:border-[var(--primary)]"
              value={form.currentMedicines}
              onChange={(e) => update("currentMedicines", e.target.value)}
              placeholder="Medicine name and dose if known"
              maxLength={500}
            />
          </label>

          <label className="flex min-w-0 flex-col gap-1.5">
            <span className="text-[13px] font-bold text-[var(--text)]">Existing conditions</span>
            <textarea
              className="min-h-[72px] rounded-med border border-[var(--border)] bg-[var(--surface)] p-3 text-[13px] text-[var(--text)] outline-none focus:border-[var(--primary)]"
              value={form.existingConditions}
              onChange={(e) => update("existingConditions", e.target.value)}
              placeholder="Diabetes, BP, asthma, pregnancy"
              maxLength={500}
            />
          </label>

          <label className="flex min-w-0 flex-col gap-1.5 sm:col-span-2">
            <span className="text-[13px] font-bold text-[var(--text)]">Anything else</span>
            <textarea
              className="min-h-[72px] rounded-med border border-[var(--border)] bg-[var(--surface)] p-3 text-[13px] text-[var(--text)] outline-none focus:border-[var(--primary)]"
              value={form.notes}
              onChange={(e) => update("notes", e.target.value)}
              placeholder="Reports, home readings, or special concerns"
              maxLength={1000}
            />
          </label>
        </div>

        <div className="flex flex-wrap items-center justify-between gap-3 border-t border-[var(--border)] p-4">
          <span className={`text-[12px] font-bold ${canSubmit ? "text-[var(--muted)]" : "text-amber-700"}`}>
            {issueLength < 10 ? "Add at least 10 characters in main issue." : "Ready to send to doctor."}
          </span>
          <div className="flex gap-2">
            <Button variant="outline" onClick={onClose} disabled={submitting}>
              Cancel
            </Button>
            <Button variant="primary" onClick={onSubmit} disabled={!canSubmit}>
              {submitting ? "Sending..." : "Send request"}
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
