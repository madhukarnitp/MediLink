import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { useApp, PAGES } from "../../context/AppContext";
import { StatusBadge, Button, Spinner, ErrorMsg } from "../ui/UI";
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

  const handleConsult = async (doc) => {
    setStarting(doc._id);
    try {
      const { consultations } = await import("../../services/api");
      const r = await consultations.start(
        doc._id,
        `Consultation with ${doc.userId?.name || "Doctor"}`,
      );
      showToast(
        "Consultation request sent. The doctor has been notified and will connect when ready.",
      );
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
        <div className={styles.loadingWrap}>
          <Spinner size={36} />
        </div>
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
                    onClick={doc.online ? () => handleConsult(doc) : undefined}
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
    </div>
  );
}
