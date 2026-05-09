import { useState, useEffect } from "react";
import { useApp, PAGES } from "../../context/AppContext";
import { Button, StatCard, PageSkeleton, ErrorMsg } from "../../components/ui/UI";
import { doctors as doctorsApi } from "../../services/api";
import { doctorDashboardStyles as styles } from "../../styles/tailwindStyles";

export default function DoctorDashboard() {
  const { user, navigate } = useApp();
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const load = async () => {
    setLoading(true);
    setError("");
    try {
      const r = await doctorsApi.getDashboard();
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

  const stats = data
    ? [
        {
          label: "Total Consultations",
          value: String(data.stats.total),
          sub: "All time",
          color: "#1D72F3",
          positive: true,
        },
        {
          label: "Active Now",
          value: String(data.stats.active),
          sub: "In progress",
          color: "#6BB6FF",
          positive: null,
        },
        {
          label: "Completed",
          value: String(data.stats.completed),
          sub: "Finished",
          color: "#8B5CF6",
          positive: null,
        },
        {
          label: "Rating",
          value: data.stats.rating ? `${data.stats.rating} ★` : "N/A",
          sub: `${data.stats.ratingCount || 0} reviews`,
          color: "#F59E0B",
          positive: null,
        },
      ]
    : [];

  return (
    <div className={styles.page}>
      <div className={styles.header}>
        <div>
          <h1 className={styles.headerTitle}>Welcome, {user?.name} 👋</h1>
          <p className={styles.headerSubtitle}>
            Manage your consultations and prescriptions
          </p>
        </div>
        <Button
          variant="primary"
          onClick={() => navigate(PAGES.CREATE_PRESCRIPTION)}
        >
          + New Prescription
        </Button>
      </div>

      <div className={styles.statsGrid}>
        {stats.map((s, i) => (
          <StatCard key={i} {...s} />
        ))}
      </div>
      <div className={styles.quickActions}>
        <h2 className={styles.sectionTitle}>Quick Actions</h2>
        <div className={styles.actionGrid}>
          <button
            className={styles.actionCard}
            onClick={() => navigate(PAGES.CREATE_PRESCRIPTION)}
          >
            <span className={styles.actionIcon}>📝</span>
            <div className={styles.actionText}>
              <div className={styles.actionTitle}>Create Prescription</div>
              <div className={styles.actionDesc}>Issue new prescription</div>
            </div>
          </button>
          <button
            className={styles.actionCard}
            onClick={() => navigate(PAGES.DOCTOR_PATIENTS)}
          >
            <span className={styles.actionIcon}>👥</span>
            <div className={styles.actionText}>
              <div className={styles.actionTitle}>My Patients</div>
              <div className={styles.actionDesc}>See old consulted patients</div>
            </div>
          </button>
          <button
            className={styles.actionCard}
            onClick={() => navigate(PAGES.DOCTOR_PRESCRIPTIONS)}
          >
            <span className={styles.actionIcon}>📋</span>
            <div className={styles.actionText}>
              <div className={styles.actionTitle}>My Prescriptions</div>
              <div className={styles.actionDesc}>
                View all issued prescriptions
              </div>
            </div>
          </button>
          <button
            className={styles.actionCard}
            onClick={() => navigate(PAGES.CONSULTATION)}
          >
            <span className={styles.actionIcon}>💬</span>
            <div className={styles.actionText}>
              <div className={styles.actionTitle}>Consultations</div>
              <div className={styles.actionDesc}>View active consultations</div>
            </div>
          </button>
          <button
            className={styles.actionCard}
            onClick={() => navigate(PAGES.CONSULTATION_LIST)}
          >
            <span className={styles.actionIcon}>🗂</span>
            <div className={styles.actionText}>
              <div className={styles.actionTitle}>Consultation Records</div>
              <div className={styles.actionDesc}>
                Review patient history
              </div>
            </div>
          </button>
        </div>
      </div>
      <div className={styles.recentSection}>
        <h2 className={styles.sectionTitle}>Recent Consultations</h2>
        {!data?.recentConsultations?.length ? (
          <div className={styles.empty}>No consultations yet</div>
        ) : (
          <div className={styles.prescriptionsList}>
            {data.recentConsultations.map((c) => {
              const patientName =
                c.patient?.userId?.name || c.patient?.name || "Patient";
              return (
                <div key={c._id} className={styles.prescriptionItem}>
                  <div className={styles.itemInfo}>
                    <div className={`${styles.itemTitle} break-words`}>
                      Consultation with {patientName}
                    </div>
                    <div className={`${styles.itemMeta} break-words`}>
                      {new Date(c.createdAt).toLocaleDateString("en-IN", {
                        day: "numeric",
                        month: "short",
                        year: "numeric",
                      })}
                      {c.status ? ` · ${c.status}` : ""}
                      {c.review?.rating
                        ? ` · ${c.review.rating} ★ review`
                        : ""}
                    </div>
                  </div>
                  <button
                    className={styles.viewLink}
                    onClick={() => {
                      const targetPage =
                        c.status === "active" || c.status === "pending"
                          ? PAGES.CONSULTATION
                          : PAGES.CONSULTATION_LIST;
                      navigate(targetPage, { consultationId: c._id });
                    }}
                  >
                    View →
                  </button>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}


