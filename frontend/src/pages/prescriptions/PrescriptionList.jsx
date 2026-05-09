import { useState, useEffect } from "react";
import { useApp, PAGES } from "../../context/AppContext";
import {
  Button,
  EmptyState,
  ErrorMsg,
  FilterBar,
  PageHeader,
  PageSkeleton,
  SegmentedFilter,
  StatusPill,
} from "../../components/ui/UI";
import {
  patients as patientsApi,
  prescriptionCache,
  prescriptionSelection,
} from "../../services/api";
import { prescriptionListStyles as styles } from "../../styles/tailwindStyles";

export default function PrescriptionList() {
  const { navigate } = useApp();
  const [rxList, setRxList] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [filter, setFilter] = useState("all");

  const load = async () => {
    setLoading(true);
    setError("");
    try {
      const r = await patientsApi.getPrescriptions();
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
        eyebrow="Medication safety"
        title="My Prescriptions"
        subtitle="Check validity, medicine timing, and order active medicines from one place."
        actions={
          <Button variant="primary" onClick={() => navigate(PAGES.DOCTORS)}>
            Find a Doctor
          </Button>
        }
      />

      <FilterBar>
        <SegmentedFilter
          value={filter}
          onChange={setFilter}
          options={["all", "active", "expired"].map((f) => ({
            value: f,
            label: f,
            meta: f === "all" ? rxList.length : count(f),
          }))}
        />
      </FilterBar>

      <div className={`${styles.prescriptionsList} ${styles.listSpacing}`}>
        {filtered.length === 0 && (
          <EmptyState
            icon="Rx"
            title="No prescriptions found"
            subtitle="Consult a doctor first. Active prescriptions will appear here when issued."
            action="Find a Doctor"
            onAction={() => navigate(PAGES.DOCTORS)}
          />
        )}

        {filtered.map((rx) => (
          <div key={rx._id} className={styles.card}>
            <div className={styles.cardHeader}>
              <div className={styles.cardInfo}>
                <div className={styles.diagnosis}>{rx.diagnosis}</div>
                <div className={styles.meta}>
                  {new Date(rx.createdAt).toLocaleDateString("en-IN", {
                    day: "numeric",
                    month: "short",
                    year: "numeric",
                  })}{" "}
                  • Prescribed by Dr.{" "}
                  {rx.createdBy?.userId?.name?.replace("Dr. ", "") || "Doctor"}
                </div>
              </div>
              <StatusPill status={rx.status}>
                {rx.status === "active" ? "Prescription ready" : rx.status}
              </StatusPill>
            </div>

            <div className={`${styles.cardContent} ${styles.contentSpacing}`}>
              <div className={styles.medicines}>
                <div className={`${styles.label} ${styles.labelHeading}`}>
                  Medicines
                </div>
                <div className={styles.medicineItems}>
                  {(rx.medicines || []).map((m, i) => (
                    <div key={i} className={styles.medicineItem}>
                      <div className={styles.medicineName}>{m.name}</div>
                      <div className={styles.medicineMeta}>
                        {m.dosage} • {m.frequency} • {m.duration}
                      </div>
                    </div>
                  ))}
                </div>

                <div className={styles.expiryRow}>
                  <span className={styles.expiryLabel}>Expires:</span>
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

            {rx.advice && (
              <div className={styles.instructions}>
                <strong>Doctor instructions:</strong> {rx.advice}
              </div>
            )}

            <div className={styles.actions}>
              <Button
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
                View More
              </Button>
              <Button
                variant="primary"
                disabled={rx.status !== "active"}
                onClick={() => {
                  if (rx.status === "active") {
                    navigate(PAGES.ORDERS);
                  }
                }}
              >
                Order Medicine
              </Button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
