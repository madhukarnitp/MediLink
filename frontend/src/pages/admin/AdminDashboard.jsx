import { useEffect, useState } from "react";
import { useApp, PAGES } from "../../context/AppContext";
import { admin as adminApi } from "../../services/api";
import { Button, ErrorMsg, PageSkeleton, StatCard } from "../../components/ui/UI";
import { adminDashboardStyles as styles } from "../../styles/tailwindStyles";

export default function AdminDashboard() {
  const { navigate, showToast } = useApp();
  const [dashboard, setDashboard] = useState(null);
  const [users, setUsers] = useState([]);
  const [orders, setOrders] = useState([]);
  const [medicines, setMedicines] = useState([]);
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

  const verifyDoctor = async (userId, verified) => {
    setSavingId(userId);
    try {
      await adminApi.verifyDoctor(userId, verified);
      showToast(
        verified ? "Doctor approved successfully." : "Doctor verification removed.",
      );
      await load();
    } catch (e) {
      setError(e.message || "Could not update doctor verification");
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
  const doctorQueue = users.filter(
    (item) => item.role === "doctor" && !item.profile?.isVerified,
  );
  const blockedUsers = users.filter((user) => user.isActive === false).length;
  const orderPipeline = getOrderPipeline(orders);
  const workspaceCards = [
    {
      title: "User administration",
      description: "Review signups, approve email verification, and manage account access.",
      metric: `${users.length} total accounts`,
      action: "Open users",
      page: PAGES.ADMIN_USERS,
    },
    {
      title: "Doctor approvals",
      description: "Work through professional credentials and keep verified doctors accurate.",
      metric: `${doctorQueue.length} pending reviews`,
      action: "Open doctors",
      page: PAGES.ADMIN_DOCTORS,
    },
    {
      title: "Order operations",
      description: "Track pending fulfilment and keep pharmacy delivery statuses current.",
      metric: `${orderPipeline.pending} pending orders`,
      action: "Open orders",
      page: PAGES.ADMIN_ORDERS,
    },
    {
      title: "Inventory control",
      description: "Manage low stock, medicine availability, and pricing updates.",
      metric: `${medicines.length} medicine records`,
      action: "Open medicines",
      page: PAGES.ADMIN_MEDICINES,
    },
  ];

  return (
    <div className={styles.page}>
      <div className={styles.header}>
        <div>
          <span className={styles.eyebrow}>Admin Workspace</span>
          <h1>Operations Overview</h1>
          <p>
            Keep the platform healthy, clear verification queues, and move into
            each admin area from a single focused landing page.
          </p>
        </div>
        <div className={styles.headerActions}>
          <Button variant="outline" onClick={() => navigate(PAGES.PROFILE)}>
            Profile
          </Button>
          <Button variant="outline" onClick={load}>
            Refresh
          </Button>
        </div>
      </div>

      {error && <ErrorMsg message={error} onRetry={load} />}

      <div className={styles.statsGrid}>
        {stats.map((stat) => (
          <StatCard key={stat.label} {...stat} />
        ))}
      </div>

      <section className={styles.sectionCard}>
        <div className={styles.sectionHeader}>
          <div>
            <span className={styles.eyebrow}>Workspace</span>
            <h2>Administrative Areas</h2>
            <p>Use the sidebar or jump directly into the work that needs attention.</p>
          </div>
        </div>
        <div className={styles.workspaceGrid}>
          {workspaceCards.map((card) => (
            <article className={styles.workspaceCard} key={card.title}>
              <span className={styles.workspaceMetric}>{card.metric}</span>
              <h3>{card.title}</h3>
              <p>{card.description}</p>
              <button onClick={() => navigate(card.page)} type="button">
                {card.action}
              </button>
            </article>
          ))}
        </div>
      </section>

      <section className={styles.insightGrid}>
        <DoctorQueue
          doctors={doctorQueue}
          onOpenDoctors={() => navigate(PAGES.ADMIN_DOCTORS)}
          onVerifyDoctor={verifyDoctor}
          savingId={savingId}
        />
        <OrderPipeline
          onOpenOrders={() => navigate(PAGES.ADMIN_ORDERS)}
          pipeline={orderPipeline}
        />
        <InventorySnapshot
          medicines={medicines}
          onOpenMedicines={() => navigate(PAGES.ADMIN_MEDICINES)}
        />
        <AdminChecklist
          blockedUsers={blockedUsers}
          onOpenDoctors={() => navigate(PAGES.ADMIN_DOCTORS)}
          onOpenOrders={() => navigate(PAGES.ADMIN_ORDERS)}
          onOpenUsers={() => navigate(PAGES.ADMIN_USERS)}
          pendingDoctors={doctorQueue.length}
          pendingOrders={orderPipeline.pending}
        />
      </section>
    </div>
  );
}

function DoctorQueue({ doctors, onOpenDoctors, onVerifyDoctor, savingId }) {
  return (
    <section className={styles.insightCard}>
      <div className={styles.insightHeader}>
        <div>
          <span>Credential queue</span>
          <h2>Doctor Verification</h2>
        </div>
        <div className={styles.insightActions}>
          <strong>{doctors.length}</strong>
          <button onClick={onOpenDoctors} type="button">
            View all
          </button>
        </div>
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
                  <button onClick={onOpenDoctors} type="button">
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

function OrderPipeline({ onOpenOrders, pipeline }) {
  const steps = ["pending", "confirmed", "processing", "shipped", "delivered"];
  const max = Math.max(...steps.map((step) => pipeline[step] || 0), 1);

  return (
    <section className={styles.insightCard}>
      <div className={styles.insightHeader}>
        <div>
          <span>Pharmacy ops</span>
          <h2>Order Pipeline</h2>
        </div>
        <button onClick={onOpenOrders} type="button">
          Open orders
        </button>
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

function AdminChecklist({
  pendingDoctors,
  pendingOrders,
  blockedUsers,
  onOpenDoctors,
  onOpenOrders,
  onOpenUsers,
}) {
  const checks = [
    {
      label: "Review doctor registrations",
      value: pendingDoctors,
      tone: pendingDoctors > 0 ? "warn" : "good",
      action: onOpenDoctors,
      actionLabel: "Doctors",
    },
    {
      label: "Watch pending medicine orders",
      value: pendingOrders,
      tone: pendingOrders > 0 ? "warn" : "good",
      action: onOpenOrders,
      actionLabel: "Orders",
    },
    {
      label: "Resolve blocked or inactive accounts",
      value: blockedUsers,
      tone: blockedUsers > 0 ? "danger" : "good",
      action: onOpenUsers,
      actionLabel: "Users",
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
            <button onClick={item.action} type="button">
              {item.actionLabel}
            </button>
          </div>
        ))}
      </div>
    </section>
  );
}

function InventorySnapshot({ medicines, onOpenMedicines }) {
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
        <div className={styles.insightActions}>
          <strong>{medicines.length}</strong>
          <button onClick={onOpenMedicines} type="button">
            Open stock
          </button>
        </div>
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

function buildStats(dashboard, users, orders, medicines) {
  const totalUsers =
    dashboard?.stats?.users ??
    dashboard?.totalUsers ??
    dashboard?.users ??
    users.length;
  const pendingUsers =
    users.length > 0
      ? users.filter(
          (user) =>
            user.role !== "admin" &&
            !(
              user.isEmailVerified ??
              user.isVerified ??
              user.emailVerified ??
              user.verified
            ),
        ).length
      : dashboard?.stats?.pendingUsers ?? 0;
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
      color: "#7DD3FC",
      positive: null,
    },
    {
      label: "Pending Verification",
      value: String(pendingUsers),
      sub: "Need admin approval",
      color: "#FCD34D",
      positive: pendingUsers === 0,
    },
    {
      label: "Total Orders",
      value: String(totalOrders),
      sub: "Pharmacy records",
      color: "#5EA8FF",
      positive: null,
    },
    {
      label: "Active Orders",
      value: String(activeOrders),
      sub: "In fulfilment",
      color: "#C4B5FD",
      positive: null,
    },
    {
      label: "Available Medicines",
      value: String(availableMedicines),
      sub: "Ready for ordering",
      color: "#67E8F9",
      positive: null,
    },
  ];
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

function normalizeOrderStatus(status) {
  return status || "pending";
}

function formatStatus(status) {
  return status.replaceAll("_", " ");
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


