import { useEffect, useState } from "react";
import { admin as adminApi } from "../../services/api";
import {
  BinaryFilter,
  Button,
  EmptyState,
  ErrorMsg,
  FilterBar,
  PageHeader,
  PageSkeleton,
  SearchField,
  SegmentedFilter,
  StatusPill,
} from "../../components/ui/UI";
import { adminDashboardStyles as styles } from "../../styles/tailwindStyles";

const MEDICINE_FILTERS = ["all", "available", "low_stock", "out_of_stock"];

const EMPTY_MEDICINE_FORM = {
  name: "",
  genericName: "",
  brand: "",
  category: "General",
  dosageForm: "tablet",
  strength: "",
  unitPrice: "",
  mrp: "",
  stock: "",
  lowStockThreshold: "10",
  manufacturer: "",
  description: "",
  available: true,
  requiresPrescription: true,
};

export default function AdminMedicines() {
  const [medicines, setMedicines] = useState([]);
  const [query, setQuery] = useState("");
  const [medicineFilter, setMedicineFilter] = useState("all");
  const [medicineForm, setMedicineForm] = useState(EMPTY_MEDICINE_FORM);
  const [editingMedicineId, setEditingMedicineId] = useState("");
  const [medicineModalOpen, setMedicineModalOpen] = useState(false);
  const [loading, setLoading] = useState(true);
  const [savingId, setSavingId] = useState("");
  const [error, setError] = useState("");

  const load = async () => {
    setLoading(true);
    setError("");
    try {
      const medicinesRes = await adminApi.getMedicines({ limit: 100 });
      setMedicines(medicinesRes.data?.medicines || medicinesRes.data || []);
    } catch (e) {
      setError(e.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    load();
  }, []);

  const resetMedicineForm = () => {
    setEditingMedicineId("");
    setMedicineForm(EMPTY_MEDICINE_FORM);
    setMedicineModalOpen(false);
  };

  const openAddMedicine = () => {
    setEditingMedicineId("");
    setMedicineForm(EMPTY_MEDICINE_FORM);
    setMedicineModalOpen(true);
  };

  const saveMedicine = async (event) => {
    event?.preventDefault();
    setSavingId(editingMedicineId || "new-medicine");
    try {
      const payload = normalizeMedicineForm(medicineForm);
      if (editingMedicineId) {
        await adminApi.updateMedicine(editingMedicineId, payload);
      } else {
        await adminApi.createMedicine(payload);
      }
      resetMedicineForm();
      await load();
    } catch (e) {
      setError(e.message || "Could not save medicine");
    } finally {
      setSavingId("");
    }
  };

  const editMedicine = (medicine) => {
    setEditingMedicineId(medicine._id || medicine.id);
    setMedicineForm({
      name: medicine.name || "",
      genericName: medicine.genericName || "",
      brand: medicine.brand || "",
      category: medicine.category || "General",
      dosageForm: medicine.dosageForm || "tablet",
      strength: medicine.strength || "",
      unitPrice: String(medicine.unitPrice ?? ""),
      mrp: String(medicine.mrp ?? ""),
      stock: String(medicine.stock ?? ""),
      lowStockThreshold: String(medicine.lowStockThreshold ?? 10),
      manufacturer: medicine.manufacturer || "",
      description: medicine.description || "",
      available: medicine.available !== false,
      requiresPrescription: medicine.requiresPrescription !== false,
    });
    setMedicineModalOpen(true);
  };

  const updateMedicine = async (medicineId, payload) => {
    setSavingId(medicineId);
    try {
      await adminApi.updateMedicine(medicineId, payload);
      await load();
    } catch (e) {
      setError(e.message || "Could not update medicine");
    } finally {
      setSavingId("");
    }
  };

  const archiveMedicine = async (medicineId) => {
    setSavingId(medicineId);
    try {
      await adminApi.archiveMedicine(medicineId);
      await load();
      if (editingMedicineId === medicineId) resetMedicineForm();
    } catch (e) {
      setError(e.message || "Could not archive medicine");
    } finally {
      setSavingId("");
    }
  };

  if (loading) {
    return (
      <div className={styles.page}>
        <PageSkeleton />
      </div>
    );
  }

  const visibleMedicines = filterMedicines(medicines, {
    query,
    stockStatus: medicineFilter,
  });

  return (
    <div className={styles.page}>
      <PageHeader
        eyebrow="Medicine Inventory"
        title="Medicine Management"
        subtitle="Manage stock, delivery availability, pricing, and prescription requirements."
        actions={
          <>
            <Button variant="outline" onClick={load}>
              Refresh
            </Button>
            <Button
              className={styles.blueButton}
              onClick={openAddMedicine}
              variant="primary"
            >
              Add Medicine
            </Button>
          </>
        }
      />

      {error && <ErrorMsg message={error} onRetry={load} />}

      <FilterBar>
        <SearchField
          value={query}
          onChange={setQuery}
          placeholder="Medicine name, brand, category..."
        />
        <SegmentedFilter
          value={medicineFilter}
          onChange={setMedicineFilter}
          options={MEDICINE_FILTERS.map((filter) => ({
            value: filter,
            label: formatStatus(filter),
          }))}
        />
      </FilterBar>

      <InventorySummary medicines={medicines} />

      {medicineModalOpen && (
        <MedicineModal
          form={medicineForm}
          editing={Boolean(editingMedicineId)}
          onChange={setMedicineForm}
          onClose={resetMedicineForm}
          onSubmit={saveMedicine}
          saving={savingId === (editingMedicineId || "new-medicine")}
        />
      )}

      <section className={styles.sectionCard}>
        <div className={styles.medicineGrid}>
          {visibleMedicines.length === 0 ? (
            <EmptyState
              title="No medicines found"
              subtitle="Clear filters or add a medicine record to make it available for ordering."
              action="Show all medicines"
              onAction={() => {
                setQuery("");
                setMedicineFilter("all");
              }}
            />
          ) : (
            visibleMedicines.map((medicine) => (
              <MedicineCard
                key={medicine._id || medicine.id}
                medicine={medicine}
                onArchive={archiveMedicine}
                onEdit={editMedicine}
                onUpdate={updateMedicine}
                saving={savingId === (medicine._id || medicine.id)}
              />
            ))
          )}
        </div>
      </section>
    </div>
  );
}

function MedicineModal({
  form,
  editing,
  onChange,
  onClose,
  onSubmit,
  saving,
}) {
  const setField = (field, value) => {
    onChange((current) => ({ ...current, [field]: value }));
  };

  return (
    <div className={styles.medicineModalBackdrop} role="presentation">
      <section
        aria-modal="true"
        className={styles.medicineModal}
        role="dialog"
      >
        <div className={styles.medicineModalHeader}>
          <div>
            <span>Medicine details</span>
            <h2>{editing ? "Update Medicine" : "Add Medicine"}</h2>
            <p>Add inventory data, pricing, prescription rules, and stock alerts.</p>
          </div>
          <button disabled={saving} onClick={onClose} type="button">
            Close
          </button>
        </div>

        <form className={styles.medicineModalBody} onSubmit={onSubmit}>
          <div className={styles.medicineForm}>
            <div className={styles.formGrid}>
              <label>
                Medicine
                <input
                  value={form.name}
                  onChange={(event) => setField("name", event.target.value)}
                  placeholder="Paracetamol"
                  required
                />
              </label>
              <label>
                Generic
                <input
                  value={form.genericName}
                  onChange={(event) => setField("genericName", event.target.value)}
                  placeholder="Acetaminophen"
                />
              </label>
              <label>
                Brand
                <input
                  value={form.brand}
                  onChange={(event) => setField("brand", event.target.value)}
                  placeholder="Brand name"
                />
              </label>
              <label>
                Category
                <input
                  value={form.category}
                  onChange={(event) => setField("category", event.target.value)}
                  placeholder="Fever"
                />
              </label>
              <label>
                Form
                <select
                  value={form.dosageForm}
                  onChange={(event) => setField("dosageForm", event.target.value)}
                >
                  {["tablet", "capsule", "syrup", "injection", "cream", "drops", "inhaler", "other"].map((option) => (
                    <option key={option} value={option}>
                      {option}
                    </option>
                  ))}
                </select>
              </label>
              <label>
                Strength
                <input
                  value={form.strength}
                  onChange={(event) => setField("strength", event.target.value)}
                  placeholder="500mg"
                />
              </label>
              <label>
                Unit price
                <input
                  min="0"
                  step="0.01"
                  type="number"
                  value={form.unitPrice}
                  onChange={(event) => setField("unitPrice", event.target.value)}
                />
              </label>
              <label>
                MRP
                <input
                  min="0"
                  step="0.01"
                  type="number"
                  value={form.mrp}
                  onChange={(event) => setField("mrp", event.target.value)}
                />
              </label>
              <label>
                Stock
                <input
                  min="0"
                  type="number"
                  value={form.stock}
                  onChange={(event) => setField("stock", event.target.value)}
                />
              </label>
              <label>
                Low stock alert
                <input
                  min="0"
                  type="number"
                  value={form.lowStockThreshold}
                  onChange={(event) =>
                    setField("lowStockThreshold", event.target.value)
                  }
                />
              </label>
              <label>
                Manufacturer
                <input
                  value={form.manufacturer}
                  onChange={(event) => setField("manufacturer", event.target.value)}
                  placeholder="Manufacturer"
                />
              </label>
              <label className={styles.fieldWide}>
                Description
                <textarea
                  maxLength={500}
                  value={form.description}
                  onChange={(event) => setField("description", event.target.value)}
                  placeholder="Storage notes, pack size, safety notes, or ordering guidance"
                />
              </label>
            </div>
            <div className={styles.switchRow}>
              <BinaryFilter
                checked={form.available}
                label="Available for delivery"
                offLabel="Unavailable"
                onChange={(checked) => setField("available", checked)}
              />
              <BinaryFilter
                checked={form.requiresPrescription}
                label="Requires prescription"
                offLabel="No prescription"
                onChange={(checked) => setField("requiresPrescription", checked)}
              />
            </div>
            <div className={styles.formActions}>
              <Button
                className={styles.blueButton}
                disabled={saving}
                type="submit"
                variant="primary"
              >
                {saving ? "Saving..." : editing ? "Update Medicine" : "Add Medicine"}
              </Button>
              <Button disabled={saving} onClick={onClose} type="button" variant="outline">
                Cancel
              </Button>
            </div>
          </div>
        </form>
      </section>
    </div>
  );
}

function InventorySummary({ medicines }) {
  const counts = medicines.reduce(
    (totals, medicine) => {
      const status = getMedicineStockStatus(medicine).label;
      totals.total += 1;
      totals[status] += 1;
      return totals;
    },
    { total: 0, available: 0, low_stock: 0, out_of_stock: 0 },
  );

  return (
    <section className={styles.inventorySummary}>
      <span>Total <strong>{counts.total}</strong></span>
      <span>Available <strong>{counts.available}</strong></span>
      <span>Low stock <strong>{counts.low_stock}</strong></span>
      <span>Out of stock <strong>{counts.out_of_stock}</strong></span>
    </section>
  );
}

function MedicineCard({ medicine, onArchive, onEdit, onUpdate, saving }) {
  const id = medicine._id || medicine.id;
  const stockStatus = getMedicineStockStatus(medicine);

  return (
    <article className={styles.medicineCard}>
      <div className={styles.medicineTop}>
        <div>
          <h3>{medicine.name}</h3>
          <p>
            {[medicine.strength, medicine.dosageForm, medicine.brand]
              .filter(Boolean)
              .join(" · ") || "General medicine"}
          </p>
        </div>
        <StatusPill status={stockStatus.tone === "good" ? "available" : stockStatus.tone === "warn" ? "warning" : "danger"}>
          {formatStatus(stockStatus.label)}
        </StatusPill>
      </div>
      <div className={styles.medicineStats}>
        <span>Stock <strong>{medicine.stock || 0}</strong></span>
        <span>Price <strong>₹{medicine.unitPrice || 0}</strong></span>
        <span>Category <strong>{medicine.category || "General"}</strong></span>
      </div>
      <div className={styles.switchRow}>
        <BinaryFilter
          checked={medicine.available !== false}
          disabled={saving}
          label="Delivery available"
          offLabel="Delivery unavailable"
          onChange={(checked) => onUpdate(id, { available: checked })}
        />
        <BinaryFilter
          checked={medicine.requiresPrescription !== false}
          disabled={saving}
          label="Prescription required"
          offLabel="No prescription"
          onChange={(checked) => onUpdate(id, { requiresPrescription: checked })}
        />
      </div>
      <div className={styles.rowActions}>
        <button disabled={saving} onClick={() => onEdit(medicine)} type="button">
          Edit
        </button>
        <button
          disabled={saving}
          onClick={() =>
            onUpdate(id, {
              stock: Number(medicine.stock || 0) + 10,
              available: true,
            })
          }
          type="button"
        >
          +10 Stock
        </button>
        <button
          disabled={saving}
          onClick={() => {
            const nextStock = Math.max(0, Number(medicine.stock || 0) - 1);
            onUpdate(id, {
              stock: nextStock,
              available: nextStock > 0,
            });
          }}
          type="button"
        >
          -1
        </button>
        <button disabled={saving} onClick={() => onArchive(id)} type="button">
          Archive
        </button>
      </div>
    </article>
  );
}

function filterMedicines(medicines, { query, stockStatus }) {
  const needle = query.trim().toLowerCase();

  return medicines.filter((medicine) => {
    const status = getMedicineStockStatus(medicine).label;
    const searchable = [
      medicine.name,
      medicine.genericName,
      medicine.brand,
      medicine.category,
      medicine.manufacturer,
      medicine.description,
      status,
    ]
      .filter(Boolean)
      .join(" ")
      .toLowerCase();

    return (
      (stockStatus === "all" || status === stockStatus) &&
      (!needle || searchable.includes(needle))
    );
  });
}

function normalizeMedicineForm(form) {
  return {
    ...form,
    unitPrice: Number(form.unitPrice || 0),
    mrp: Number(form.mrp || 0),
    stock: Number(form.stock || 0),
    lowStockThreshold: Number(form.lowStockThreshold || 0),
    description: form.description?.trim?.() || "",
  };
}

function getMedicineStockStatus(medicine) {
  const stock = Number(medicine.stock || 0);
  const threshold = Number(medicine.lowStockThreshold || 0);
  if (medicine.available === false || stock <= 0) {
    return { label: "out_of_stock", tone: "danger" };
  }
  if (stock <= threshold) return { label: "low_stock", tone: "warn" };
  return { label: "available", tone: "good" };
}

function formatStatus(status) {
  return status.replaceAll("_", " ");
}
