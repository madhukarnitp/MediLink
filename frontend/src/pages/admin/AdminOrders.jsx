import { useEffect, useState } from "react";
import { admin as adminApi } from "../../services/api";
import {
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
const PREVIOUS_ORDER_STATUSES = new Set(["delivered", "cancelled"]);

export default function AdminOrders() {
  const [orders, setOrders] = useState([]);
  const [query, setQuery] = useState("");
  const [orderStatusFilter, setOrderStatusFilter] = useState("all");
  const [loading, setLoading] = useState(true);
  const [savingId, setSavingId] = useState("");
  const [error, setError] = useState("");

  const load = async () => {
    setLoading(true);
    setError("");
    try {
      const ordersRes = await adminApi.getOrders({ limit: 100 });
      setOrders(ordersRes.data?.orders || ordersRes.data || []);
    } catch (e) {
      setError(e.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    load();
  }, []);

  const updateOrderStatus = async (orderId, status) => {
    setSavingId(orderId);
    try {
      const response = await adminApi.updateOrderStatus(orderId, status);
      const updatedOrder = response.data || response;
      setOrders((items) =>
        items.map((item) =>
          (item._id || item.id) === orderId ? { ...item, ...updatedOrder } : item,
        ),
      );
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
      const response = await adminApi.updateOrderStatus(orderId, { paymentStatus });
      const updatedOrder = response.data || response;
      setOrders((items) =>
        items.map((item) =>
          (item._id || item.id) === orderId ? { ...item, ...updatedOrder } : item,
        ),
      );
      await load();
    } catch (e) {
      setError(e.message);
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

  const filteredOrders = filterOrders(orders, {
    query,
    status: orderStatusFilter,
  });
  const activeOrders = filteredOrders.filter(
    (order) => !isPreviousOrder(order)
  );
  const previousOrders = filteredOrders.filter(isPreviousOrder);
  const showActiveOrders = !PREVIOUS_ORDER_STATUSES.has(orderStatusFilter);
  const showPreviousOrders =
    orderStatusFilter === "all" || PREVIOUS_ORDER_STATUSES.has(orderStatusFilter);

  return (
    <div className={styles.page}>
      <PageHeader
        eyebrow="Order Management"
        title="Pharmacy Orders"
        subtitle="Track pharmacy fulfilment, payment status, and delivery workflow."
        actions={
          <Button variant="outline" onClick={load}>
            Refresh
          </Button>
        }
      />

      {error && <ErrorMsg message={error} onRetry={load} />}

      <FilterBar>
        <SearchField
          value={query}
          onChange={setQuery}
          placeholder="Order ID, patient name, medicine..."
        />
        <SegmentedFilter
          value={orderStatusFilter}
          onChange={setOrderStatusFilter}
          options={ORDER_STATUSES.map((status) => ({
            value: status,
            label: formatStatus(status),
          }))}
        />
      </FilterBar>

      {showActiveOrders && (
      <section className={styles.sectionCard}>
        <div className={styles.sectionHeader}>
          <div>
            <h2>Active orders</h2>
            <p>Orders still moving through fulfilment.</p>
          </div>
        </div>
        <div className={styles.orderGrid}>
          {activeOrders.length === 0 ? (
            <EmptyState
              title="No active orders found"
              subtitle="New medicine orders that need pharmacy action will appear here."
              action="Show all orders"
              onAction={() => {
                setQuery("");
                setOrderStatusFilter("all");
              }}
            />
          ) : (
            activeOrders.map((order) => (
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

      {showPreviousOrders && (
        <section className={styles.sectionCard}>
          <div className={styles.sectionHeader}>
            <div>
              <h2>Previous order records</h2>
              <p>Delivered and cancelled orders stay here as read-only history.</p>
            </div>
          </div>
          <div className={styles.orderGrid}>
            {previousOrders.length === 0 ? (
              <EmptyState
                title="No previous orders found"
                subtitle="Delivered and cancelled orders will appear here after fulfilment."
                action="Show all orders"
                onAction={() => {
                  setQuery("");
                  setOrderStatusFilter("all");
                }}
              />
            ) : (
              previousOrders.map((order) => (
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
    </div>
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
  const isPrevious = PREVIOUS_ORDER_STATUSES.has(status);
  const isLocked = saving || isPrevious;

  return (
    <article className={`${styles.orderCard} ${isPrevious ? styles.previousOrderCard : ""}`}>
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
      <div className="mt-3 flex flex-wrap gap-2">
        <StatusPill status={status}>
          {status === "processing" ? "Order is being packed" : formatStatus(status)}
        </StatusPill>
        <StatusPill status={paymentStatus === "paid" ? "success" : paymentStatus}>
          {formatStatus(paymentStatus)}
        </StatusPill>
      </div>
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
            disabled={isLocked}
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
            disabled={isLocked}
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
          disabled={isLocked || status === "processing"}
          onClick={() => onStatus(id, "processing")}
          type="button"
        >
          Prepare
        </button>
        <button
          disabled={isLocked || status === "shipped"}
          onClick={() => onStatus(id, "shipped")}
          type="button"
        >
          Dispatch
        </button>
        <button
          disabled={isLocked || status === "delivered"}
          onClick={() => onStatus(id, "delivered")}
          type="button"
        >
          Delivered
        </button>
      </div>
    </article>
  );
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

function normalizeOrderStatus(status) {
  return status || "pending";
}

function formatStatus(status) {
  return status.replaceAll("_", " ");
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

function isPreviousOrder(order) {
  return PREVIOUS_ORDER_STATUSES.has(normalizeOrderStatus(order.status));
}
