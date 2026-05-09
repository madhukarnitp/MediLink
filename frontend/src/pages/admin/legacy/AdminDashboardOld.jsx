import { useEffect, useState } from "react";
import { admin as adminApi } from "../../../services/api";
import { BinaryFilter, Button, ErrorMsg, PageSkeleton, InlineSkeleton, StatCard } from "../../../components/ui/UI";
import { adminDashboardStyles as styles } from "../../../styles/tailwindStyles";

const USER_FILTERS = ["all", "patient", "doctor", "admin"];
const ACCOUNT_FILTERS = ["all", "active", "blocked", "pending"];
const ORDER_STATUSES = [
  "all",
  "pending",
  "confirmed",
  "processing",
  "shipped",
  "delivered",
  "cancelled",
];
const ORDER_STATUS_OPTIONS = ORDER_STATUSES.filter((status) => status !== "all");
const PAYMENT_STATUSES = ["pending", "paid", "failed", "refunded"];
const MEDICINE_FILTERS = ["all", "available", "low_stock", "out_of_stock"];
const ORDER_STATUS_ALIASES = {
  placed: "pending",
  packed: "processing",
  out_for_delivery: "shipped",
};
const ADMIN_VIEWS = ["overview", "users", "doctors", "orders", "medicines"];
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
  available: true,
  requiresPrescription: true,
};

export default function AdminDashboard() {
  const [dashboard, setDashboard] = useState(null);
  const [users, setUsers] = useState([]);
  const [orders, setOrders] = useState([]);
  const [medicines, setMedicines] = useState([]);
  const [activeView, setActiveView] = useState("overview");
  const [query, setQuery] = useState("");
  const [roleFilter, setRoleFilter] = useState("all");
  const [accountFilter, setAccountFilter] = useState("all");
  const [orderStatusFilter, setOrderStatusFilter] = useState("all");
  const [medicineFilter, setMedicineFilter] = useState("all");
  const [medicineForm, setMedicineForm] = useState(EMPTY_MEDICINE_FORM);
  const [editingMedicineId, setEditingMedicineId] = useState("");
  const [selectedUser, setSelectedUser] = useState(null);
  const [detailsLoading, setDetailsLoading] = useState(false);
  const [loading, setLoading] = useState(true);
  const [savingId, setSavingId] = useState("");
  const [error, setError] = useState("");

  const load = async () => {
    setLoading(true);
    setError("");
    try {
      const [dashboardRes, usersRes, ordersRes, medicinesRes] = await Promise.all([
        adminApi.getDashboard().catch(() => ({ data: null })),
        adminApi.getUsers({ limit: 50 }),
        adminApi.getOrders({ limit: 50 }),
        adminApi.getMedicines({ limit: 50 }),
      ]);
      setDashboard(dashboardRes.data);
      setUsers(usersRes.data?.users || usersRes.data || []);
      setOrders(ordersRes.data?.orders || ordersRes.data || []);
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

  const verifyUser = async (userId) => {
    setSavingId(userId);
    try {
      await adminApi.verifyUser(userId, true);
      await load();
    } catch (e) {
      setError(e.message || "Could not verify user");
    } finally {
      setSavingId("");
    }
  };

  const verifyDoctor = async (userId, verified) => {
    setSavingId(userId);
    try {
      await adminApi.verifyDoctor(userId, verified);
      await load();
      if (selectedUser?.user?._id === userId || selectedUser?._id === userId) {
        await viewUser(userId);
      }
    } catch (e) {
      setError(e.message || "Could not update doctor verification");
    } finally {
      setSavingId("");
    }
  };

  const viewUser = async (userId) => {
    setDetailsLoading(true);
    setError("");
    try {
      const response = await adminApi.getUserById(userId);
      setSelectedUser(response.data);
    } catch (e) {
      setError(e.message || "Could not load user details");
    } finally {
      setDetailsLoading(false);
    }
  };

  const updateUserStatus = async (userId, status) => {
    setSavingId(userId);
    try {
      await adminApi.updateUserStatus(userId, status);
      await load();
    } catch (e) {
      setError(e.message);
    } finally {
      setSavingId("");
    }
  };

  const updateOrderStatus = async (orderId, status) => {
    setSavingId(orderId);
    try {
      await adminApi.updateOrderStatus(orderId, status);
      await load();
    } catch (e) {
      setError(e.message);
    } finally {
      setSavingId("");
    }
  };

  const updateOrderPayment = async (orderId, paymentStatus) => {
    setSavingId(orderId);
    try {
      await adminApi.updateOrderStatus(orderId, { paymentStatus });
      await load();
    } catch (e) {
      setError(e.message);
    } finally {
      setSavingId("");
    }
  };

  const resetMedicineForm = () => {
    setEditingMedicineId("");
    setMedicineForm(EMPTY_MEDICINE_FORM);
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
      available: medicine.available !== false,
      requiresPrescription: medicine.requiresPrescription !== false,
    });
    setActiveView("medicines");
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

  const stats = buildStats(dashboard, users, orders, medicines);
  const filteredUsers = filterUsers(users, {
    accountFilter,
    query,
    roleFilter,
  });
  const filteredOrders = filterOrders(orders, {
    query,
    status: orderStatusFilter,
  });
  const doctorQueue = users.filter(
    (item) => item.role === "doctor" && !item.profile?.isVerified,
  );
  const orderPipeline = getOrderPipeline(orders);
  const visibleUsers =
    activeView === "doctors"
      ? filteredUsers.filter((item) => item.role === "doctor")
      : filteredUsers;
  const visibleOrders = filteredOrders;
  const visibleMedicines = filterMedicines(medicines, {
    query,
    stockStatus: medicineFilter,
  });

  return (
    <div className={styles.page}>
      <div className={styles.header}>
        <div>
          <span className={styles.eyebrow}>Admin Control Center</span>
          <h1>Platform Command Center</h1>
          <p>
            Verify doctors, manage account access, monitor orders, and keep
            MediLink operations healthy.
          </p>
        </div>
        <div className={styles.headerActions}>
          <Button variant="outline" onClick={() => exportUsersCsv(visibleUsers)}>
            Export Users
          </Button>
          <Button variant="outline" onClick={load}>
            Refresh
          </Button>
        </div>
      </div>

      {error && <ErrorMsg message={error} onRetry={load} />}

      <div className={styles.toolbar}>
        <div className={styles.searchBox}>
          <span>Search</span>
          <input
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            placeholder="Name, email, phone, order ID, patient..."
          />
        </div>
        <div className={styles.viewTabs}>
          {ADMIN_VIEWS.map((view) => (
            <button
              className={`${styles.viewTab} ${activeView === view ? styles.viewActive : ""}`}
              key={view}
              onClick={() => setActiveView(view)}
              type="button"
            >
              {view}
            </button>
          ))}
        </div>
      </div>

      <div className={styles.statsGrid}>
        {stats.map((stat) => (
          <StatCard key={stat.label} {...stat} />
        ))}
      </div>

      {(activeView === "overview" || activeView === "doctors") && (
        <section className={styles.insightGrid}>
          <DoctorQueue
            doctors={doctorQueue}
            onView={viewUser}
            onVerifyDoctor={verifyDoctor}
            savingId={savingId}
          />
          <OrderPipeline pipeline={orderPipeline} />
          <InventorySnapshot medicines={medicines} />
          <AdminChecklist
            pendingDoctors={doctorQueue.length}
            pendingOrders={orderPipeline.pending}
            blockedUsers={users.filter((user) => user.isActive === false).length}
          />
        </section>
      )}

      {(activeView === "overview" ||
        activeView === "users" ||
        activeView === "doctors") && (
      <section className={styles.sectionCard}>
        <div className={styles.sectionHeader}>
          <div>
            <h2>{activeView === "doctors" ? "Doctor Management" : "Users"}</h2>
            <p>
              Approve accounts, review doctor credentials, and control platform
              access.
            </p>
          </div>
          <div className={styles.filterCluster}>
            <div className={styles.filters}>
              {USER_FILTERS.map((filter) => (
                <button
                  className={`${styles.filterBtn} ${roleFilter === filter ? styles.filterActive : ""}`}
                  key={filter}
                  onClick={() => setRoleFilter(filter)}
                  type="button"
                >
                  {filter}
                </button>
              ))}
            </div>
            <div className={styles.filters}>
              {ACCOUNT_FILTERS.map((filter) => (
              <button
                className={`${styles.filterBtn} ${accountFilter === filter ? styles.filterActive : ""}`}
                key={filter}
                onClick={() => setAccountFilter(filter)}
                type="button"
              >
                {filter}
              </button>
            ))}
            </div>
          </div>
        </div>

        <div className={styles.tableWrap}>
          <table className={styles.table}>
            <thead>
              <tr>
                <th>User</th>
                <th>Role</th>
                <th>Verification</th>
                <th>Status</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {users.length === 0 ? (
                <tr>
                  <td colSpan="5" className={styles.empty}>
                    No users found
                  </td>
                </tr>
              ) : (
                visibleUsers.map((item) => (
                  <UserRow
                    item={item}
                    key={item._id || item.id || item.email}
                    onStatus={updateUserStatus}
                    onView={viewUser}
                    onVerifyDoctor={verifyDoctor}
                    onVerify={verifyUser}
                    saving={savingId === (item._id || item.id)}
                  />
                ))
              )}
            </tbody>
          </table>
        </div>
      </section>
      )}

      {(activeView === "overview" || activeView === "orders") && (
      <section className={styles.sectionCard}>
        <div className={styles.sectionHeader}>
          <div>
            <h2>Orders</h2>
            <p>Track pharmacy fulfilment and update delivery workflow.</p>
          </div>
          <div className={styles.filters}>
            {ORDER_STATUSES.map((status) => (
              <button
                className={`${styles.filterBtn} ${orderStatusFilter === status ? styles.filterActive : ""}`}
                key={status}
                onClick={() => setOrderStatusFilter(status)}
                type="button"
              >
                {formatStatus(status)}
              </button>
            ))}
          </div>
        </div>

        <div className={styles.orderGrid}>
          {visibleOrders.length === 0 ? (
            <div className={styles.empty}>No orders found</div>
          ) : (
            visibleOrders.map((order) => (
              <OrderCard
                key={order._id || order.id}
                order={order}
                onPayment={updateOrderPayment}
                onStatus={updateOrderStatus}
                saving={savingId === (order._id || order.id)}
              />
            ))
          )}
        </div>
      </section>
      )}

      {(activeView === "overview" || activeView === "medicines") && (
      <section className={styles.sectionCard}>
        <div className={styles.sectionHeader}>
          <div>
            <h2>Medicine Inventory</h2>
            <p>
              Manage stock, delivery availability, pricing, and prescription
              requirements.
            </p>
          </div>
          <div className={styles.filters}>
            {MEDICINE_FILTERS.map((filter) => (
              <button
                className={`${styles.filterBtn} ${medicineFilter === filter ? styles.filterActive : ""}`}
                key={filter}
                onClick={() => setMedicineFilter(filter)}
                type="button"
              >
                {formatStatus(filter)}
              </button>
            ))}
          </div>
        </div>

        <MedicineForm
          form={medicineForm}
          editing={Boolean(editingMedicineId)}
          onChange={setMedicineForm}
          onReset={resetMedicineForm}
          onSubmit={saveMedicine}
          saving={savingId === (editingMedicineId || "new-medicine")}
        />

        <div className={styles.medicineGrid}>
          {visibleMedicines.length === 0 ? (
            <div className={styles.empty}>No medicines found</div>
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
      )}

      {(selectedUser || detailsLoading) && (
        <UserDetailsPanel
          data={selectedUser}
          loading={detailsLoading}
          onClose={() => setSelectedUser(null)}
          onVerifyDoctor={verifyDoctor}
          savingId={savingId}
        />
      )}
    </div>
  );
}

function DoctorQueue({ doctors, onView, onVerifyDoctor, savingId }) {
  return (
    <section className={styles.insightCard}>
      <div className={styles.insightHeader}>
        <div>
          <span>Credential queue</span>
          <h2>Doctor Verification</h2>
        </div>
        <strong>{doctors.length}</strong>
      </div>
      <div className={styles.queueList}>
        {doctors.length === 0 ? (
          <p className={styles.emptyMini}>No doctors waiting for review.</p>
        ) : (
          doctors.slice(0, 5).map((doctor) => {
            const id = doctor._id || doctor.id;
            return (
              <div className={styles.queueItem} key={id}>
                <div className={styles.userCell}>
                  <div className={styles.avatar}>{getInitials(doctor.name)}</div>
                  <div>
                    <div className={styles.name}>{doctor.name}</div>
                    <div className={styles.meta}>
                      {doctor.profile?.specialization || "Doctor"} ·{" "}
                      {doctor.profile?.regNo || "No reg. no."}
                    </div>
                  </div>
                </div>
                <div className={styles.queueActions}>
                  <button onClick={() => onView(id)} type="button">
                    Review
                  </button>
                  <button
                    disabled={savingId === id}
                    onClick={() => onVerifyDoctor(id, true)}
                    type="button"
                  >
                    Approve
                  </button>
                </div>
              </div>
            );
          })
        )}
      </div>
    </section>
  );
}

function OrderPipeline({ pipeline }) {
  const steps = ["pending", "confirmed", "processing", "shipped", "delivered"];
  const max = Math.max(...steps.map((step) => pipeline[step] || 0), 1);

  return (
    <section className={styles.insightCard}>
      <div className={styles.insightHeader}>
        <div>
          <span>Pharmacy ops</span>
          <h2>Order Pipeline</h2>
        </div>
      </div>
      <div className={styles.pipeline}>
        {steps.map((step) => (
          <div className={styles.pipelineRow} key={step}>
            <span>{formatStatus(step)}</span>
            <div className={styles.pipelineTrack}>
              <div
                className={styles.pipelineFill}
                style={{ width: `${((pipeline[step] || 0) / max) * 100}%` }}
              />
            </div>
            <strong>{pipeline[step] || 0}</strong>
          </div>
        ))}
      </div>
    </section>
  );
}

function AdminChecklist({ pendingDoctors, pendingOrders, blockedUsers }) {
  const checks = [
    {
      label: "Review doctor registrations",
      value: pendingDoctors,
      tone: pendingDoctors > 0 ? "warn" : "good",
    },
    {
      label: "Watch pending medicine orders",
      value: pendingOrders,
      tone: pendingOrders > 0 ? "warn" : "good",
    },
    {
      label: "Blocked accounts under control",
      value: blockedUsers,
      tone: blockedUsers > 0 ? "danger" : "good",
    },
  ];

  return (
    <section className={styles.insightCard}>
      <div className={styles.insightHeader}>
        <div>
          <span>Daily control</span>
          <h2>Admin Checklist</h2>
        </div>
      </div>
      <div className={styles.checkList}>
        {checks.map((item) => (
          <div className={styles.checkItem} key={item.label}>
            <span className={`${styles.checkDot} ${styles[item.tone]}`} />
            <p>{item.label}</p>
            <strong>{item.value}</strong>
          </div>
        ))}
      </div>
    </section>
  );
}

function InventorySnapshot({ medicines }) {
  const available = medicines.filter(
    (medicine) => medicine.available !== false && Number(medicine.stock || 0) > 0,
  ).length;
  const lowStock = medicines.filter(
    (medicine) =>
      medicine.available !== false &&
      Number(medicine.stock || 0) > 0 &&
      Number(medicine.stock || 0) <= Number(medicine.lowStockThreshold || 0),
  ).length;
  const outOfStock = medicines.filter(
    (medicine) => medicine.available === false || Number(medicine.stock || 0) <= 0,
  ).length;

  return (
    <section className={styles.insightCard}>
      <div className={styles.insightHeader}>
        <div>
          <span>Medicine delivery</span>
          <h2>Inventory Health</h2>
        </div>
        <strong>{medicines.length}</strong>
      </div>
      <div className={styles.checkList}>
        <div className={styles.checkItem}>
          <span className={`${styles.checkDot} ${styles.good}`} />
          <p>Available for delivery</p>
          <strong>{available}</strong>
        </div>
        <div className={styles.checkItem}>
          <span className={`${styles.checkDot} ${styles.warn}`} />
          <p>Low stock</p>
          <strong>{lowStock}</strong>
        </div>
        <div className={styles.checkItem}>
          <span className={`${styles.checkDot} ${styles.danger}`} />
          <p>Out of stock or disabled</p>
          <strong>{outOfStock}</strong>
        </div>
      </div>
    </section>
  );
}

function MedicineForm({
  form,
  editing,
  onChange,
  onReset,
  onSubmit,
  saving,
}) {
  const setField = (field, value) => {
    onChange((current) => ({ ...current, [field]: value }));
  };

  return (
    <form className={styles.medicineForm} onSubmit={onSubmit}>
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
          <input
            value={form.dosageForm}
            onChange={(event) => setField("dosageForm", event.target.value)}
            placeholder="tablet"
          />
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
        <Button disabled={saving} type="submit" variant="primary">
          {saving ? "Saving..." : editing ? "Update Medicine" : "Add Medicine"}
        </Button>
        {editing && (
          <Button disabled={saving} onClick={onReset} type="button" variant="outline">
            Cancel Edit
          </Button>
        )}
      </div>
    </form>
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
        <span className={`${styles.statusPill} ${styles[stockStatus.tone]}`}>
          {formatStatus(stockStatus.label)}
        </span>
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
        <button disabled={saving} onClick={() => onArchive(id)} type="button">
          Archive
        </button>
      </div>
    </article>
  );
}

function UserRow({
  item,
  onStatus,
  onVerify,
  onVerifyDoctor,
  onView,
  saving,
}) {
  const id = item._id || item.id;
  const emailVerified =
    item.isEmailVerified ??
    item.isVerified ??
    item.emailVerified ??
    item.verified;
  const doctorVerified = item.profile?.isVerified;
  const status =
    item.status || (item.isActive === false ? "blocked" : "active");

  return (
    <tr>
      <td>
        <div className={styles.userCell}>
          <div className={styles.avatar}>{getInitials(item.name)}</div>
          <div>
            <div className={styles.name}>{item.name || "Unnamed user"}</div>
            <div className={styles.meta}>{item.email}</div>
          </div>
        </div>
      </td>
      <td>
        <span className={styles.rolePill}>{item.role || "patient"}</span>
      </td>
      <td>
        <span
          className={`${styles.statusPill} ${emailVerified ? styles.good : styles.warn}`}
        >
          {emailVerified ? "Email verified" : "Email pending"}
        </span>
        {item.role === "doctor" && (
          <span
            className={`${styles.statusPill} ${doctorVerified ? styles.good : styles.warn} ${styles.inlinePill}`}
          >
            {doctorVerified ? "Doctor verified" : "Doctor pending"}
          </span>
        )}
      </td>
      <td>
        <span
          className={`${styles.statusPill} ${status === "active" ? styles.good : styles.danger}`}
        >
          {status}
        </span>
      </td>
      <td>
        <div className={styles.rowActions}>
          <button disabled={saving} onClick={() => onView(id)} type="button">
            Details
          </button>
          {!emailVerified && (
            <button
              disabled={saving}
              onClick={() => onVerify(id)}
              type="button"
            >
              Verify
            </button>
          )}
          {item.role === "doctor" && (
            <button
              disabled={saving}
              onClick={() => onVerifyDoctor(id, !doctorVerified)}
              type="button"
            >
              {doctorVerified ? "Unverify Doctor" : "Verify Doctor"}
            </button>
          )}
          <button
            disabled={saving}
            onClick={() =>
              onStatus(id, status === "active" ? "blocked" : "active")
            }
            type="button"
          >
            {status === "active" ? "Block" : "Activate"}
          </button>
        </div>
      </td>
    </tr>
  );
}

function UserDetailsPanel({
  data,
  loading,
  onClose,
  onVerifyDoctor,
  savingId,
}) {
  const user = data?.user || data;
  const profile = data?.profile || null;
  const userId = user?._id || user?.id;
  const isDoctor = user?.role === "doctor";
  const doctorVerified = Boolean(profile?.isVerified);

  return (
    <div className={styles.modalBackdrop} role="presentation">
      <aside className={styles.detailsPanel} role="dialog" aria-modal="true">
        <div className={styles.detailsHeader}>
          <div>
            <h2>User Details</h2>
            <p>Complete account and profile information.</p>
          </div>
          <button className={styles.closeBtn} onClick={onClose} type="button">
            Close
          </button>
        </div>

        {loading ? (
          <InlineSkeleton className="min-h-[240px]" lines={6} showAvatar />
        ) : (
          <>
            <div className={styles.detailsHero}>
              <div className={styles.avatar}>{getInitials(user?.name)}</div>
              <div>
                <h3>{user?.name || "Unnamed user"}</h3>
                <p>{user?.email || "No email"}</p>
              </div>
            </div>

            <DetailGrid
              title="Account"
              items={[
                ["Role", user?.role],
                ["Phone", user?.phone],
                ["Email verified", yesNo(user?.isEmailVerified)],
                ["Status", user?.isActive === false ? "Blocked" : "Active"],
                ["Joined", formatDateTime(user?.createdAt)],
                ["Last seen", formatDateTime(user?.lastSeen)],
              ]}
            />

            {profile && (
              <DetailGrid
                title={isDoctor ? "Doctor Profile" : "Patient Profile"}
                items={profileDetailItems(profile, isDoctor)}
              />
            )}

            {isDoctor && (
              <div className={styles.verifyBox}>
                <div>
                  <strong>Doctor verification</strong>
                  <span>
                    {doctorVerified
                      ? "This doctor is approved to appear as verified."
                      : "Review registration details before approving."}
                  </span>
                </div>
                <Button
                  variant={doctorVerified ? "outline" : "primary"}
                  disabled={savingId === userId}
                  onClick={() => onVerifyDoctor(userId, !doctorVerified)}
                >
                  {doctorVerified ? "Unverify Doctor" : "Verify Doctor"}
                </Button>
              </div>
            )}
          </>
        )}
      </aside>
    </div>
  );
}

function DetailGrid({ title, items }) {
  return (
    <section className={styles.detailSection}>
      <h3>{title}</h3>
      <div className={styles.detailGrid}>
        {items.map(([label, value]) => (
          <div className={styles.detailItem} key={label}>
            <span>{label}</span>
            <strong>{formatValue(value)}</strong>
          </div>
        ))}
      </div>
    </section>
  );
}

function OrderCard({ order, onPayment, onStatus, saving }) {
  const id = order._id || order.id;
  const status = normalizeOrderStatus(order.status);
  const paymentStatus = order.paymentStatus || "pending";
  const patientName =
    order.patient?.userId?.name ||
    order.patient?.name ||
    order.user?.name ||
    "Patient";
  const total = order.total || order.totalAmount || order.amount || 0;
  const address = formatShippingAddress(order.shippingAddress);
  const items = order.items || order.medicines || [];

  return (
    <article className={styles.orderCard}>
      <div className={styles.orderTop}>
        <div>
          <h3>
            {order.orderNumber ||
              order.orderId ||
              order.rxId ||
              `Order ${String(id || "").slice(-6)}`}
          </h3>
          <p>
            {patientName} ·{" "}
            {order.items?.length || order.medicines?.length || 0} items
          </p>
        </div>
        <span className={styles.price}>₹{total}</span>
      </div>
      {address && <p className={styles.deliveryAddress}>{address}</p>}
      <div className={styles.orderItems}>
        {items.slice(0, 4).map((item, index) => {
          const availability = getAvailabilityTone(item.availabilityStatus);
          return (
            <div className={styles.orderItem} key={`${item.name}-${index}`}>
              <span>
                {item.name} x{item.quantity || 1}
              </span>
              <strong className={styles[availability.tone]}>
                {formatStatus(availability.label)}
              </strong>
            </div>
          );
        })}
      </div>
      <div className={styles.orderMetaGrid}>
        <label>
          Delivery
          <select
            value={status}
            onChange={(event) => onStatus(id, event.target.value)}
            disabled={saving}
          >
            {ORDER_STATUS_OPTIONS.map((option) => (
              <option key={option} value={option}>
                {formatStatus(option)}
              </option>
            ))}
          </select>
        </label>
        <label>
          Payment
          <select
            value={paymentStatus}
            onChange={(event) => onPayment(id, event.target.value)}
            disabled={saving}
          >
            {PAYMENT_STATUSES.map((option) => (
              <option key={option} value={option}>
                {formatStatus(option)}
              </option>
            ))}
          </select>
        </label>
      </div>
      <div className={styles.deliveryActions}>
        <button
          disabled={saving || status === "processing"}
          onClick={() => onStatus(id, "processing")}
          type="button"
        >
          Prepare
        </button>
        <button
          disabled={saving || status === "shipped"}
          onClick={() => onStatus(id, "shipped")}
          type="button"
        >
          Dispatch
        </button>
        <button
          disabled={saving || status === "delivered"}
          onClick={() => onStatus(id, "delivered")}
          type="button"
        >
          Delivered
        </button>
      </div>
    </article>
  );
}

function buildStats(dashboard, users, orders, medicines) {
  const totalUsers =
    dashboard?.stats?.users ??
    dashboard?.totalUsers ??
    dashboard?.users ??
    users.length;
  const pendingUsers =
    dashboard?.stats?.pendingUsers ??
    users.filter(
      (user) =>
        !(
          user.isEmailVerified ??
          user.isVerified ??
          user.emailVerified ??
          user.verified
        ),
    ).length;
  const totalOrders =
    dashboard?.stats?.orders ??
    dashboard?.totalOrders ??
    dashboard?.orders ??
    orders.length;
  const activeOrders =
    dashboard?.stats?.activeOrders ??
    dashboard?.pendingOrders ??
    orders.filter(
      (order) =>
        !["delivered", "cancelled"].includes(
          normalizeOrderStatus(order.status),
        ),
    ).length;
  const availableMedicines =
    dashboard?.availableMedicines ??
    medicines.filter(
      (medicine) =>
        medicine.available !== false && Number(medicine.stock || 0) > 0,
    ).length;

  return [
    {
      label: "Total Users",
      value: String(totalUsers),
      sub: "Registered accounts",
      color: "#007BFF",
      positive: null,
    },
    {
      label: "Pending Verification",
      value: String(pendingUsers),
      sub: "Need admin/email approval",
      color: "#F59E0B",
      positive: pendingUsers === 0,
    },
    {
      label: "Total Orders",
      value: String(totalOrders),
      sub: "Pharmacy records",
      color: "#10B981",
      positive: null,
    },
    {
      label: "Active Orders",
      value: String(activeOrders),
      sub: "In fulfilment",
      color: "#8B5CF6",
      positive: null,
    },
    {
      label: "Available Medicines",
      value: String(availableMedicines),
      sub: "Ready for delivery",
      color: "#06B6D4",
      positive: null,
    },
  ];
}

function filterUsers(users, { accountFilter, query, roleFilter }) {
  const needle = query.trim().toLowerCase();

  return users.filter((user) => {
    const status = user.isActive === false ? "blocked" : "active";
    const emailVerified =
      user.isEmailVerified ??
      user.isVerified ??
      user.emailVerified ??
      user.verified;
    const matchesRole = roleFilter === "all" || user.role === roleFilter;
    const matchesStatus =
      accountFilter === "all" ||
      status === accountFilter ||
      (accountFilter === "pending" && !emailVerified);
    const searchable = [
      user.name,
      user.email,
      user.phone,
      user.role,
      user.profile?.specialization,
      user.profile?.regNo,
    ]
      .filter(Boolean)
      .join(" ")
      .toLowerCase();

    return matchesRole && matchesStatus && (!needle || searchable.includes(needle));
  });
}

function filterOrders(orders, { query, status }) {
  const needle = query.trim().toLowerCase();

  return orders.filter((order) => {
    const normalizedStatus = normalizeOrderStatus(order.status);
    const patientName =
      order.patient?.userId?.name ||
      order.patient?.name ||
      order.user?.name ||
      "";
    const searchable = [
      order.orderNumber,
      order.orderId,
      order.rxId,
      order.prescription?.rxId,
      patientName,
      normalizedStatus,
    ]
      .filter(Boolean)
      .join(" ")
      .toLowerCase();

    return (
      (status === "all" || normalizedStatus === status) &&
      (!needle || searchable.includes(needle))
    );
  });
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

function getOrderPipeline(orders) {
  return orders.reduce(
    (acc, order) => {
      const status = normalizeOrderStatus(order.status);
      acc[status] = (acc[status] || 0) + 1;
      return acc;
    },
    {
      pending: 0,
      confirmed: 0,
      processing: 0,
      shipped: 0,
      delivered: 0,
      cancelled: 0,
    },
  );
}

function exportUsersCsv(users) {
  const rows = [
    ["Name", "Email", "Role", "Status", "Email Verified", "Doctor Verified"],
    ...users.map((user) => [
      user.name || "",
      user.email || "",
      user.role || "",
      user.isActive === false ? "Blocked" : "Active",
      yesNo(
        user.isEmailVerified ??
          user.isVerified ??
          user.emailVerified ??
          user.verified,
      ),
      user.role === "doctor" ? yesNo(user.profile?.isVerified) : "",
    ]),
  ];
  const csv = rows
    .map((row) =>
      row
        .map((cell) => `"${String(cell).replaceAll('"', '""')}"`)
        .join(","),
    )
    .join("\n");
  const blob = new Blob([csv], { type: "text/csv;charset=utf-8" });
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = `medilink-users-${new Date().toISOString().slice(0, 10)}.csv`;
  link.click();
  URL.revokeObjectURL(url);
}

function normalizeOrderStatus(status) {
  return ORDER_STATUS_ALIASES[status] || status || "pending";
}

function formatStatus(status) {
  return status.replaceAll("_", " ");
}

function normalizeMedicineForm(form) {
  return {
    ...form,
    unitPrice: Number(form.unitPrice || 0),
    mrp: Number(form.mrp || 0),
    stock: Number(form.stock || 0),
    lowStockThreshold: Number(form.lowStockThreshold || 0),
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

function getAvailabilityTone(status) {
  if (status === "available") return { label: "available", tone: "good" };
  if (status === "partial") return { label: "partial", tone: "warn" };
  if (status === "out_of_stock") {
    return { label: "out_of_stock", tone: "danger" };
  }
  return { label: "untracked", tone: "warn" };
}

function formatShippingAddress(address) {
  if (!address) return "";
  return [
    address.name,
    address.phone,
    address.street,
    address.city,
    address.state,
    address.pincode,
  ]
    .filter(Boolean)
    .join(", ");
}

function profileDetailItems(profile, isDoctor) {
  if (isDoctor) {
    return [
      ["Specialization", profile.specialization],
      ["Qualification", profile.qualification],
      ["Registration No.", profile.regNo],
      ["Experience", profile.experience ? `${profile.experience} years` : "0 years"],
      ["Consultation fee", profile.price ? `₹${profile.price}` : "₹0"],
      ["Doctor verified", yesNo(profile.isVerified)],
      ["Online", yesNo(profile.online)],
      ["Rating", profile.rating ? `${profile.rating} (${profile.ratingCount || 0} reviews)` : "No ratings"],
      ["Consultations", profile.consultationCount],
      ["Hospital", formatHospital(profile.hospital)],
      ["Languages", profile.languages?.join(", ")],
      ["Bio", profile.bio],
    ];
  }

  return [
    ["Age", profile.age],
    ["Gender", profile.gender],
    ["Blood group", profile.bloodGroup],
    ["Weight", profile.weight ? `${profile.weight} kg` : ""],
    ["Height", profile.height ? `${profile.height} cm` : ""],
    ["Allergies", arrayOrText(profile.allergies)],
    ["Chronic conditions", arrayOrText(profile.chronicConditions)],
    ["Emergency contact", profile.emergencyContact?.phone || profile.emergencyContact],
    ["Address", formatAddress(profile.address)],
  ];
}

function formatValue(value) {
  if (value === undefined || value === null || value === "") return "Not provided";
  if (typeof value === "boolean") return yesNo(value);
  return String(value);
}

function yesNo(value) {
  return value ? "Yes" : "No";
}

function arrayOrText(value) {
  if (Array.isArray(value)) return value.join(", ");
  return value;
}

function formatHospital(hospital) {
  if (!hospital) return "";
  return [hospital.name, hospital.city, hospital.state].filter(Boolean).join(", ");
}

function formatAddress(address) {
  if (!address) return "";
  if (typeof address === "string") return address;
  return [address.line1, address.city, address.state, address.pincode]
    .filter(Boolean)
    .join(", ");
}

function formatDateTime(value) {
  if (!value) return "";
  return new Date(value).toLocaleString("en-IN", {
    day: "numeric",
    month: "short",
    year: "numeric",
    hour: "numeric",
    minute: "2-digit",
  });
}

function getInitials(name = "U") {
  return (
    name
      .split(" ")
      .filter(Boolean)
      .map((part) => part[0])
      .join("")
      .toUpperCase()
      .slice(0, 2) || "U"
  );
}
