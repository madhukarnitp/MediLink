import { useApp } from "../../context/AppContext";
import { ErrorMsg, PageSkeleton } from "../ui/UI";
import { ordersStyles as styles } from "../../styles/tailwindStyles";
import FulfillmentSelector from "./orders/FulfillmentSelector";
import OrderSummaryCard from "./orders/OrderSummaryCard";
import OrdersHero from "./orders/OrdersHero";
import OrderTracker from "./orders/OrderTracker";
import PrescriptionItems from "./orders/PrescriptionItems";
import PromiseGrid from "./orders/PromiseGrid";
import { useMedicineOrder } from "./orders/useMedicineOrder";

export default function Orders() {
  const { profile, showToast, user } = useApp();
  const order = useMedicineOrder({ profile, showToast, user });

  if (order.loading)
    return (
      <div className={styles.page}>
        <PageSkeleton />
      </div>
    );

  return (
    <div className={styles.page}>
      {order.error && <ErrorMsg message={order.error} onRetry={order.load} />}

      <OrdersHero
        eta={order.summary.eta}
        itemCount={order.availableMedicines.length}
        prescription={order.prescription}
        total={order.summary.total}
      />

      <div className={styles.layout}>
        <div>
          <PrescriptionItems
            medicines={order.medicines}
            prescription={order.prescription}
            unavailableMedicines={order.unavailableMedicines}
          />
          <DeliveryAddressForm
            address={order.address}
            errors={order.addressErrors}
            onChange={order.setAddress}
          />
          <FulfillmentSelector
            deliveryMode={order.deliveryMode}
            onChange={order.setDeliveryMode}
          />
          <PromiseGrid />
        </div>

        <div className={styles.right}>
          <OrderSummaryCard
            deliveryMode={order.deliveryMode}
            itemCount={order.availableMedicines.length}
            latestOrder={order.latestOrder}
            onPlaceOrder={order.placeOrder}
            ordered={order.ordered}
            orderedAt={order.orderedAt}
            placing={order.placing}
            summary={order.summary}
            user={user}
            disabled={!order.canPlaceOrder}
          />
          <OrderTracker
            currentStep={order.currentStep}
            ordered={Boolean(order.latestOrder || order.ordered)}
            status={order.latestOrder?.status}
          />
        </div>
      </div>

      <PreviousOrders orders={order.orderHistory} />
    </div>
  );
}

function DeliveryAddressForm({ address, errors, onChange }) {
  const update = (key, value) =>
    onChange((current) => ({ ...current, [key]: value }));

  return (
    <section className="mt-4 rounded-med border border-[var(--border)] bg-[var(--card)] p-4">
      <div className="mb-3 flex items-start justify-between gap-3">
        <div className="min-w-0">
          <h2 className={styles.colTitle}>Delivery Address</h2>
          <p className={styles.emptyText}>
            Medicines will be delivered to this address after order confirmation.
          </p>
        </div>
        {errors.length ? (
          <span className="shrink-0 rounded-med bg-amber-100 px-2.5 py-1 text-[11px] font-black text-amber-800">
            Required
          </span>
        ) : (
          <span className="shrink-0 rounded-med bg-[var(--primary-dim)] px-2.5 py-1 text-[11px] font-black text-[var(--primary)]">
            Complete
          </span>
        )}
      </div>
      <div className="grid min-w-0 gap-3 sm:grid-cols-2">
        <AddressInput label="Recipient name" value={address.name} onChange={(value) => update("name", value)} />
        <AddressInput label="Phone" value={address.phone} onChange={(value) => update("phone", value)} />
        <AddressInput className="sm:col-span-2" label="Street address" value={address.street} onChange={(value) => update("street", value)} />
        <AddressInput label="City" value={address.city} onChange={(value) => update("city", value)} />
        <AddressInput label="State" value={address.state} onChange={(value) => update("state", value)} />
        <AddressInput label="Country" value={address.country} onChange={(value) => update("country", value)} />
        <AddressInput label="Pincode" value={address.pincode} onChange={(value) => update("pincode", value)} />
      </div>
      {errors.length ? (
        <p className="mt-3 text-[12px] font-bold text-amber-700">
          Missing: {errors.join(", ")}
        </p>
      ) : null}
    </section>
  );
}

function AddressInput({ className = "", label, onChange, value }) {
  return (
    <label className={`min-w-0 ${className}`}>
      <span className="mb-1.5 block text-[12px] font-bold text-[var(--text)]">
        {label}
      </span>
      <input
        className="min-h-[40px] w-full rounded-med border border-[var(--border)] bg-[var(--surface)] px-3 text-[13px] text-[var(--text)] outline-none focus:border-[var(--primary)]"
        value={value || ""}
        onChange={(event) => onChange(event.target.value)}
      />
    </label>
  );
}

function PreviousOrders({ orders }) {
  return (
    <section className={styles.historySection}>
      <div
        className={`${styles.sectionTop} max-[520px]:![flex-direction:row] max-[520px]:!items-start`}
      >
        <div className="min-w-0">
          <h2 className={styles.colTitle}>Previous Orders</h2>
          <p className={`${styles.emptyText} break-words`}>
            Track medicine orders and fulfilment status.
          </p>
        </div>
      </div>

      {orders.length === 0 ? (
        <div className={styles.emptyCard}>
          <div className={styles.emptyIcon}>Rx</div>
          <div>
            <div className={styles.medName}>No orders yet</div>
            <div className={styles.medMeta}>
              Placed medicine orders will appear here.
            </div>
          </div>
        </div>
      ) : (
        <div className={styles.historyList}>
          {orders.map((item) => (
            <article
              className={`${styles.historyCard} max-[520px]:![flex-direction:row] max-[520px]:!items-center max-[520px]:gap-2`}
              key={item._id || item.id}
            >
              <div className="min-w-0 flex-1">
                <div className={`${styles.historyTitle} truncate`}>
                  {item.orderNumber ||
                    `Order ${String(item._id || item.id || "").slice(-6)}`}
                </div>
                <div className={`${styles.historyMeta} truncate`}>
                  {(item.items || []).length} item
                  {(item.items || []).length === 1 ? "" : "s"} ·{" "}
                  {new Date(item.createdAt).toLocaleDateString("en-IN", {
                    day: "numeric",
                    month: "short",
                    year: "numeric",
                  })}
                </div>
              </div>
              <div
                className={`${styles.historyRight} max-[520px]:!items-end max-[520px]:shrink-0`}
              >
                <span
                  className={`${styles.statusPill} max-[520px]:text-[10px] ${styles[`status_${item.status}`] || ""}`}
                >
                  {formatStatus(item.status)}
                </span>
                <span className={`${styles.historyTotal} max-[520px]:text-sm`}>
                  ₹{item.total || 0}
                </span>
              </div>
            </article>
          ))}
        </div>
      )}
    </section>
  );
}

function formatStatus(status = "pending") {
  return status
    .replaceAll("_", " ")
    .replace(/\b\w/g, (letter) => letter.toUpperCase());
}
