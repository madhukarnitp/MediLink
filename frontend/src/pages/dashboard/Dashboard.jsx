import { useState, useEffect } from "react";
import { useApp, PAGES } from "../../context/AppContext";
import {
  Button,
  EmptyState,
  ErrorMsg,
  PageHeader,
  PageSkeleton,
  SectionHeader,
  StatCard,
} from "../../components/ui/UI";
import { patients as patientsApi } from "../../services/api";
import { dashboardStyles as styles } from "../../styles/tailwindStyles";

export default function Dashboard() {
  const { navigate, user } = useApp();
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [location, setLocation] = useState(null);
  const [locationStatus, setLocationStatus] = useState("loading");
  const [locationError, setLocationError] = useState("");
  const [mapUrl, setMapUrl] = useState("");

  const load = async () => {
    setLoading(true);
    setError("");
    try {
      const r = await patientsApi.getDashboard();
      setData(r.data);
    } catch (e) {
      setError(e.message);
    } finally {
      setLoading(false);
    }
  };
  useEffect(() => {
    load();
  }, []);

  useEffect(() => {
    if (!navigator.geolocation) {
      setLocationStatus("error");
      setLocationError("Location is not supported in this browser");
      return;
    }

    navigator.geolocation.getCurrentPosition(
      (position) => {
        const nextLocation = {
          lat: Number(position.coords.latitude.toFixed(6)),
          lng: Number(position.coords.longitude.toFixed(6)),
        };
        setLocation(nextLocation);
        setLocationStatus("ready");
      },
      (err) => {
        setLocationStatus("error");
        setLocationError(err.message || "Could not determine your location");
      },
      { enableHighAccuracy: true, timeout: 12000, maximumAge: 60000 },
    );
  }, []);

  useEffect(() => {
    if (!location) return;
    const delta = 0.012;
    const bbox = [
      location.lng - delta,
      location.lat - delta,
      location.lng + delta,
      location.lat + delta,
    ].join("%2C");
    setMapUrl(
      `https://www.openstreetmap.org/export/embed.html?bbox=${bbox}&layer=mapnik&marker=${location.lat}%2C${location.lng}`,
    );
  }, [location]);

  const firstName = user?.name?.split(" ")[0] || "Rahul";
  const currentDate = new Date().toLocaleDateString("en-GB", {
    weekday: "long",
    day: "numeric",
    month: "short",
    year: "numeric",
  });
  const stats = data
    ? [
        {
          label: "Total Consultations",
          value: String(data.stats.totalConsultations),
          sub: "All time",
          color: "#1D72F3",
          positive: true,
        },
        {
          label: "Active Prescriptions",
          value: String(data.stats.activePrescriptions),
          sub: "Currently active",
          color: "#F59E0B",
          positive: null,
        },
        {
          label: "Total Prescriptions",
          value: String(data.stats.totalPrescriptions),
          sub: "All time",
          color: "#6BB6FF",
          positive: null,
        },
      ]
    : [];

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
      <PageHeader
        eyebrow="Patient home"
        title={`Hello, ${firstName}`}
        subtitle={`${currentDate} · Start with the next important health action.`}
        actions={
          <>
            <Button variant="danger" onClick={() => navigate(PAGES.SOS)}>
              SOS Emergency
            </Button>
            <Button variant="primary" onClick={() => navigate(PAGES.DOCTORS)}>
              Consult Doctor
            </Button>
          </>
        }
      />

      {/* Stats Row */}
      <div className={styles.statsRow}>
        {stats.map((s) => (
          <StatCard key={s.label} {...s} />
        ))}
      </div>

      {/* Two-column grid */}
      <div className={styles.grid}>
        {/* Left column */}
        <div className={styles.left}>
          {/* Quick Actions */}
          <section>
            <SectionHeader title="Quick Actions" />
            <div className={styles.quickActions}>
              <QuickCard
                icon="SOS"
                title="SOS"
                subtitle="Emergency connect"
                variant="sos"
                onClick={() => navigate(PAGES.SOS)}
              />
              <QuickCard
                icon="Dr"
                title="Consult"
                subtitle="Talk to a doctor now"
                iconBg="var(--primary-dim)"
                onClick={() => navigate(PAGES.DOCTORS)}
              />
              <QuickCard
                icon="Rx"
                title="Orders"
                subtitle="Order & track"
                iconBg="var(--blue-dim)"
                onClick={() => navigate(PAGES.ORDERS)}
              />
              <QuickCard
                icon="Rx"
                title="Prescription"
                subtitle="View & manage"
                iconBg="var(--accent-dim)"
                onClick={() => navigate(PAGES.PRESCRIPTION_LIST)}
              />
            </div>
          </section>

          {/* Recent Consultations */}
          <section>
            <SectionHeader
              title="Recent Consultations"
              action="View all"
              onAction={() => navigate(PAGES.CONSULTATION_LIST)}
            />
            {data?.recentConsultations?.length > 0 ? (
              data.recentConsultations.slice(0, 5).map((c) => (
                <ConsultationRow key={c._id} consultation={c} />
              ))
            ) : (
              <EmptyState
                title="No consultations yet"
                subtitle="Start a consultation to get care, prescriptions, and follow-up records."
                action="Find a Doctor"
                onAction={() => navigate(PAGES.DOCTORS)}
              />
            )}
          </section>
        </div>

        {/* Right column */}
        <div className={styles.right}>
          <div className={`${styles.mapCard} ${styles.healthCard}`}>
            <div className={styles.mapHeader}>
              <h2>Health Profile</h2>
              <p>Complete details help doctors prescribe safely.</p>
            </div>
            {data?.patient ? (
              <ProfileCard p={data.patient} />
            ) : (
              <div className={styles.mapEmpty}>
                <p className={styles.mapEmptyText}>
                  Complete your health profile to make consultations safer.
                </p>
              </div>
            )}
          </div>

          <div className={styles.mapCard}>
            <div className={styles.mapHeader}>
              <h2>Your Location</h2>
              <p>Location is used only to help with nearby care and emergency support.</p>
            </div>
            <div className={styles.mapBody}>
              {locationStatus === "ready" && mapUrl ? (
                <iframe
                  title="Patient location map"
                  src={mapUrl}
                  frameBorder="0"
                  className={styles.mapIframe}
                />
              ) : (
                <div className={styles.mapEmpty}>
                  <p className={styles.mapEmptyText}>
                    {locationStatus === "loading"
                      ? "Finding your location…"
                      : locationError || "Location unavailable"}
                  </p>
                </div>
              )}
            </div>
            <div className={styles.pharmacyList}>
              <div className={styles.pharmacyRow}>
                <span>Coordinates</span>
                <span className={styles.dist}>
                  {location ? `${location.lat}, ${location.lng}` : "Unknown"}
                </span>
              </div>
              <div className={styles.pharmacyRow}>
                <span>Nearby guide</span>
                <a
                  href={
                    location
                      ? `https://www.google.com/maps/search/?api=1&query=${location.lat},${location.lng}`
                      : "https://www.google.com/maps/search/nearest+hospitals"
                  }
                  target="_blank"
                  rel="noreferrer"
                >
                  Open in Maps
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

/* ── Sub-components ──────────────────────────────── */

function QuickCard({ icon, title, subtitle, variant, iconBg, onClick }) {
  const iconClass =
    variant === "sos"
      ? styles.quickIconSos
      : iconBg === "var(--blue-dim)"
        ? styles.quickIconBlue
        : iconBg === "var(--accent-dim)"
          ? styles.quickIconAccent
          : styles.quickIconPrimary;
  return (
    <button
      className={`${styles.quickCard} ${variant === "sos" ? styles.sosCard : ""}`}
      onClick={onClick}
      type="button"
    >
      <span className={`${styles.quickIcon} ${iconClass}`}>{icon}</span>
      <div>
        <h3 className={variant === "sos" ? styles.quickTitleSos : ""}>
          {title}
        </h3>
        <p>{subtitle}</p>
      </div>
    </button>
  );
}

function ConsultationRow({ consultation }) {
  const doc = consultation.doctor?.userId;
  const initials =
    doc?.name
      ?.split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase()
      .slice(0, 2) || "DR";
  const statusColor =
    consultation.status === "completed"
      ? "var(--primary)"
      : consultation.status === "active"
        ? "var(--blue)"
        : "var(--muted)";

  return (
    <div className={styles.consultRow}>
      <div className={`${styles.docAvatar} ${styles.docAvatarAccent}`}>
        {initials}
      </div>
      <div className={styles.docInfo}>
        <div className={styles.docName}>{doc?.name || "Doctor"}</div>
        <div className={styles.docSpec}>
          {consultation.doctor?.specialization} ·{" "}
          {consultation.reason || "Consultation"}
        </div>
      </div>
      <div className={styles.consultMeta}>
        <span className={styles.consultDate}>
          {new Date(consultation.createdAt).toLocaleDateString("en-IN", {
            day: "numeric",
            month: "short",
          })}
        </span>
        <span
          className={`${styles.consultDot} ${styles[`consultDot_${consultation.status}`] || styles.consultDot_default}`}
        />
      </div>
    </div>
  );
}

function ProfileCard({ p }) {
  return (
    <div className={styles.pharmacyList}>
      {p.bloodGroup && (
        <div className={styles.pharmacyRow}>
          <span>Blood Group</span>
          <span className={styles.dist}>{p.bloodGroup}</span>
        </div>
      )}
      {p.age && (
        <div className={styles.pharmacyRow}>
          <span>Age</span>
          <span className={styles.dist}>{p.age} yrs</span>
        </div>
      )}
      {p.bmi && (
        <div className={styles.pharmacyRow}>
          <span>BMI</span>
          <span className={styles.dist}>{p.bmi}</span>
        </div>
      )}
      {p.allergies?.length > 0 && (
        <div className={styles.pharmacyRow}>
          <span>Allergies</span>
          <span className={styles.dist}>{p.allergies.join(", ")}</span>
        </div>
      )}
    </div>
  );
}


