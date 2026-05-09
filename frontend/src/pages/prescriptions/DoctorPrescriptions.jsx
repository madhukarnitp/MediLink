import { useState, useEffect } from "react";
import { useApp, PAGES } from "../../context/AppContext";
import {
  Button,
  ErrorMsg,
  PageSkeleton,
} from "../../components/ui/UI";
import {
  prescriptions as rxApi,
  prescriptionCache,
  prescriptionSelection,
} from "../../services/api";
import { doctorPrescriptionsStyles as styles } from "../../styles/tailwindStyles";

const PRESCRIPTION_FILTERS = ["all", "active", "expired", "cancelled"];

const statusLabel = (status = "active") =>
  status.replaceAll("_", " ").replace(/^\w/, (char) => char.toUpperCase());

export default function DoctorPrescriptions() {
  const { navigate, showToast } = useApp();
  const [rxList, setRxList] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [filter, setFilter] = useState("all");
  const [revoking, setRevoking] = useState(null);

  const load = async () => {
    setLoading(true);
    setError("");
    try {
      const r = await rxApi.getDoctorList();
      const items = r.data || [];
      setRxList(items);
      prescriptionCache.saveList(items);
    } catch (e) {
      setError(e.message);
    } finally {
      setLoading(false);
    }
  };
  useEffect(() => {
    load();
  }, []);

  const filtered =
    filter === "all" ? rxList : rxList.filter((r) => r.status === filter);
  const count = (s) => rxList.filter((r) => r.status === s).length;

  const handleRevoke = async (id) => {
    if (!confirm("Revoke this prescription?")) return;
    setRevoking(id);
    try {
      await rxApi.updateStatus(id, "cancelled");
      setRxList((prev) =>
        prev.map((r) => (r._id === id ? { ...r, status: "cancelled" } : r)),
      );
      showToast("Prescription cancelled");
    } catch (e) {
      showToast(e.message, "error");
    } finally {
      setRevoking(null);
    }
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
          <h1>My Prescriptions</h1>
          <p>Review issued prescriptions, validity, and patient medicine instructions.</p>
        </div>
        <Button
          variant="primary"
          onClick={() => navigate(PAGES.CREATE_PRESCRIPTION)}
        >
          Create Prescription
        </Button>
      </div>

      <div className={styles.filterBar}>
        {PRESCRIPTION_FILTERS.map((f) => (
          <button
            className={`${styles.filterBtn} ${filter === f ? styles.filterActive : ""}`}
            key={f}
            onClick={() => setFilter(f)}
            type="button"
          >
            <span>{statusLabel(f)}</span>
            <strong>{f === "all" ? rxList.length : count(f)}</strong>
          </button>
        ))}
      </div>

      <div className={`${styles.prescriptionsList} ${styles.listSpacing}`}>
        {filtered.length === 0 ? (
          <div className={styles.empty}>
            <strong>No prescriptions found</strong>
            <span>Create a prescription after reviewing a patient consultation.</span>
            <Button
              className={styles.actionBtnPrimary}
              onClick={() => navigate(PAGES.CREATE_PRESCRIPTION)}
            >
              Create Prescription
            </Button>
          </div>
        ) : (
          filtered.map((rx) => {
            const patName = rx.createdFor?.userId?.name || "Patient";
            return (
              <article key={rx._id} className={styles.card}>
                <div className={styles.cardTop}>
                  <div className={styles.cardInfo}>
                    <div className={styles.cardTitle}>{rx.diagnosis}</div>
                    <div className={styles.cardMeta}>
                      {new Date(rx.createdAt).toLocaleDateString("en-IN", {
                        day: "numeric",
                        month: "short",
                        year: "numeric",
                      })}{" "}
                      • Patient: {patName}
                    </div>
                  </div>
                  <span
                    className={`${styles.status} ${styles[`status_${rx.status}`] || styles.statusDefault}`}
                  >
                    {rx.status === "active" ? "Prescription ready" : statusLabel(rx.status)}
                  </span>
                </div>
                <div
                  className={`${styles.cardContent} ${styles.cardContentSpacing}`}
                >
                  <div className={styles.medicines}>
                    <span className={`${styles.label} ${styles.labelHeading}`}>
                      Medicines ({rx.medicines?.length || 0})
                    </span>
                    <div
                      className={`${styles.medicineList} ${styles.medicineListWrap}`}
                    >
                      {(rx.medicines || []).slice(0, 2).map((m, i) => (
                        <span
                          key={i}
                          className={`${styles.medicineBadge} ${styles.medicineBadgePill}`}
                        >
                          {m.name}
                        </span>
                      ))}
                      {(rx.medicines?.length || 0) > 2 && (
                        <span className={`${styles.more} ${styles.moreBadge}`}>
                          +{rx.medicines.length - 2} more
                        </span>
                      )}
                    </div>
                  </div>
                  <div className={styles.details}>
                    <div className={`${styles.detail} ${styles.detailText}`}>
                      <span
                        className={`${styles.label} ${styles.detailLabelInline}`}
                      >
                        Expires:
                      </span>
                      <span>
                        {rx.expiresAt
                          ? new Date(rx.expiresAt).toLocaleDateString("en-IN", {
                              day: "numeric",
                              month: "short",
                              year: "numeric",
                            })
                          : "—"}
                      </span>
                    </div>
                  </div>
                </div>
                <div className={styles.actions}>
                  <Button
                    className={styles.actionBtn}
                    variant="outline"
                    onClick={() => {
                      prescriptionCache.saveItem(rx);
                      prescriptionSelection.set(rx._id);
                      navigate(PAGES.PRESCRIPTION, {
                        prescriptionId: rx._id,
                        prescription: rx,
                      });
                    }}
                  >
                    View Details
                  </Button>
                  {rx.status === "active" && (
                    <button
                      className={`${styles.revokeAction} ${styles.actionBtnGhost}`}
                      disabled={revoking === rx._id}
                      onClick={() => handleRevoke(rx._id)}
                    >
                      {revoking === rx._id ? "Revoking…" : "Revoke"}
                    </button>
                  )}
                </div>
              </article>
            );
          })
        )}
      </div>
    </div>
  );
}
