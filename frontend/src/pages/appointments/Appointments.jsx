import { useEffect, useMemo, useState } from "react";
import { useApp, PAGES } from "../../context/AppContext";
import {
  appointments as appointmentsApi,
  doctors as doctorsApi,
} from "../../services/api";
import { Button, ErrorMsg, PageSkeleton } from "../../components/ui/UI";
import { appointmentsStyles as styles } from "../../styles/tailwindStyles";

const nextSlotValue = () => {
  const date = new Date(Date.now() + 24 * 60 * 60 * 1000);
  date.setMinutes(0, 0, 0);
  return toLocalInputValue(date);
};

const toLocalInputValue = (date) => {
  const pad = (value) => String(value).padStart(2, "0");
  return `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())}T${pad(date.getHours())}:${pad(date.getMinutes())}`;
};

const statusLabel = (status = "requested") =>
  status.replaceAll("_", " ").replace(/^\w/, (char) => char.toUpperCase());

export default function Appointments() {
  const { navigate, pageParams, showToast, user } = useApp();
  const [appointments, setAppointments] = useState([]);
  const [doctors, setDoctors] = useState([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [form, setForm] = useState({
    doctorId: pageParams.doctorId || "",
    scheduledFor: nextSlotValue(),
    reason: "",
  });

  const isDoctor = user?.role === "doctor";
  const upcoming = useMemo(
    () =>
      [...appointments].sort(
        (a, b) => new Date(a.scheduledFor) - new Date(b.scheduledFor),
      ),
    [appointments],
  );

  const load = async () => {
    setLoading(true);
    setError("");
    try {
      const [appointmentRes, doctorRes] = await Promise.all([
        appointmentsApi.getAll(),
        isDoctor ? Promise.resolve({ data: [] }) : doctorsApi.getAll({ limit: 60 }),
      ]);
      setAppointments(appointmentRes.data || []);
      setDoctors(doctorRes.data || []);
      if (!form.doctorId && doctorRes.data?.[0]?._id) {
        setForm((current) => ({ ...current, doctorId: doctorRes.data[0]._id }));
      }
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    load();
  }, [isDoctor]);

  useEffect(() => {
    if (pageParams.doctorId) {
      setForm((current) => ({ ...current, doctorId: pageParams.doctorId }));
    }
  }, [pageParams.doctorId]);

  const updateForm = (field, value) => {
    setForm((current) => ({ ...current, [field]: value }));
  };

  const bookAppointment = async (event) => {
    event.preventDefault();
    if (!form.doctorId || !form.scheduledFor) {
      showToast("Choose a doctor and appointment time", "warning");
      return;
    }

    setSaving(true);
    try {
      await appointmentsApi.create({
        doctorId: form.doctorId,
        scheduledFor: new Date(form.scheduledFor).toISOString(),
        reason: form.reason,
      });
      showToast("Appointment request sent.");
      setForm((current) => ({
        ...current,
        scheduledFor: nextSlotValue(),
        reason: "",
      }));
      await load();
    } catch (err) {
      showToast(err.message, "error");
    } finally {
      setSaving(false);
    }
  };

  const updateAppointment = async (appointment, action) => {
    setSaving(true);
    try {
      if (action === "confirm") {
        await appointmentsApi.confirm(appointment._id);
        showToast("Appointment confirmed.");
      } else if (action === "cancel") {
        await appointmentsApi.cancel(appointment._id);
        showToast("Appointment cancelled.", "warning");
      } else {
        await appointmentsApi.updateStatus(appointment._id, { status: action });
        showToast(
          action === "missed"
            ? "Appointment marked as missed."
            : "Appointment marked as completed.",
        );
      }
      await load();
    } catch (err) {
      showToast(err.message, "error");
    } finally {
      setSaving(false);
    }
  };

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
          <h1>{isDoctor ? "Appointment Requests" : "Appointments"}</h1>
          <p>
            {isDoctor
              ? "Confirm scheduled visits and keep your queue clear."
              : "Book a time that works before starting a live consultation."}
          </p>
        </div>
        {!isDoctor && (
          <Button variant="outline" onClick={() => navigate(PAGES.DOCTORS)}>
            Find Doctors
          </Button>
        )}
      </div>

      {!isDoctor && (
        <form className={styles.bookingPanel} onSubmit={bookAppointment}>
          <div className={styles.bookingIntro}>
            <div>
              <h2 className={styles.bookingTitle}>Request a New Appointment</h2>
              <p className={styles.bookingCopy}>
                Pick a doctor, choose a suitable slot, and share a short reason
                so the visit starts with the right context.
              </p>
            </div>
          </div>

          <div className={styles.formGrid}>
            <label className={styles.formGroup}>
              <span className={styles.label}>Doctor</span>
              <select
                className={styles.select}
                value={form.doctorId}
                onChange={(event) => updateForm("doctorId", event.target.value)}
              >
                {doctors.map((doctor) => (
                  <option key={doctor._id} value={doctor._id}>
                    {doctor.userId?.name || "Doctor"} - {doctor.specialization}
                  </option>
                ))}
              </select>
            </label>

            <label className={styles.formGroup}>
              <span className={styles.label}>Date and time</span>
              <input
                className={styles.input}
                type="datetime-local"
                value={form.scheduledFor}
                onChange={(event) =>
                  updateForm("scheduledFor", event.target.value)
                }
              />
            </label>

            <label className={`${styles.formGroup} ${styles.fieldWide}`}>
              <span className={styles.label}>Reason</span>
              <textarea
                className={styles.textarea}
                maxLength={300}
                placeholder="Describe the concern briefly, such as fever, follow-up, prescription review, or recurring symptoms."
                value={form.reason}
                onChange={(event) => updateForm("reason", event.target.value)}
              />
            </label>
          </div>

          <div className={styles.formActions}>
            <p className={styles.formNote}>
              {doctors.length === 0
                ? "No doctors are available to book right now."
                : "Appointments are shared in your doctor's queue as a request first."}
            </p>
            <Button
              className={styles.submitBtn}
              disabled={saving || doctors.length === 0}
              type="submit"
            >
              {saving ? "Requesting..." : "Request Appointment"}
            </Button>
          </div>
        </form>
      )}

      <div className={styles.list}>
        {upcoming.length === 0 ? (
          <div className={styles.empty}>
            <strong>No appointments yet</strong>
            <span>
              {isDoctor
                ? "New booking requests will appear here."
                : "Choose a doctor and request your first slot."}
            </span>
          </div>
        ) : (
          upcoming.map((appointment) => (
            <AppointmentRow
              appointment={appointment}
              disabled={saving}
              isDoctor={isDoctor}
              key={appointment._id}
              onAction={updateAppointment}
            />
          ))
        )}
      </div>
    </div>
  );
}

function AppointmentRow({ appointment, disabled, isDoctor, onAction }) {
  const doctorName = appointment.doctor?.userId?.name || "Doctor";
  const patientName = appointment.patient?.userId?.name || "Patient";
  const title = isDoctor ? patientName : doctorName;
  const subtitle = isDoctor
    ? appointment.reason || "Scheduled visit"
    : appointment.doctor?.specialization || appointment.reason || "Scheduled visit";
  const canConfirm = isDoctor && appointment.status === "requested";
  const canClose = isDoctor && appointment.status === "confirmed";
  const canCancel = ["requested", "confirmed"].includes(appointment.status);

  return (
    <article className={styles.card}>
      <div className={styles.cardTop}>
        <div className={styles.cardInfo}>
          <div className={styles.cardTitle}>{title}</div>
          <div className={styles.cardMeta}>
            {new Date(appointment.scheduledFor).toLocaleString("en-IN", {
              day: "numeric",
              month: "short",
              year: "numeric",
              hour: "2-digit",
              minute: "2-digit",
            })}{" "}
            · {subtitle}
          </div>
        </div>
        <span
          className={`${styles.status} ${styles[`status_${appointment.status}`] || ""}`}
        >
          {statusLabel(appointment.status)}
        </span>
      </div>

      <div className={styles.actions}>
        {canConfirm && (
          <Button
            className={styles.actionBtnPrimary}
            disabled={disabled}
            onClick={() => onAction(appointment, "confirm")}
          >
            Confirm
          </Button>
        )}
        {canClose && (
          <>
            <Button
              className={styles.actionBtn}
              disabled={disabled}
              onClick={() => onAction(appointment, "completed")}
              variant="outline"
            >
              Complete
            </Button>
            <Button
              className={styles.actionBtn}
              disabled={disabled}
              onClick={() => onAction(appointment, "missed")}
              variant="outline"
            >
              Missed
            </Button>
          </>
        )}
        {canCancel && (
          <Button
            className={styles.actionBtnGhost}
            disabled={disabled}
            onClick={() => onAction(appointment, "cancel")}
            variant="ghost"
          >
            Cancel
          </Button>
        )}
      </div>
    </article>
  );
}
