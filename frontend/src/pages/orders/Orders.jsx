import { useState } from "react";
import { useApp, PAGES } from "../../context/AppContext";
import {
  Button,
  EmptyState,
  ErrorMsg,
  ModalPanel,
  PageSkeleton,
  StepProgress,
} from "../../components/ui/UI";
import { ordersStyles as styles } from "../../styles/tailwindStyles";
import FulfillmentSelector from "./components/FulfillmentSelector";
import OrderSummaryCard from "./components/OrderSummaryCard";
import OrdersHero from "./components/OrdersHero";
import OrderTracker from "./components/OrderTracker";
import PrescriptionItems from "./components/PrescriptionItems";
import PromiseGrid from "./components/PromiseGrid";
import { useMedicineOrder } from "./components/useMedicineOrder";

export default function Orders() {
  const { navigate, profile, showToast, user } = useApp();
  const [addressModalOpen, setAddressModalOpen] = useState(false);
  const [workspaceView, setWorkspaceView] = useState("prescriptions");
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

      <OrderWorkspaceNav
        activeView={workspaceView}
        orderCount={order.orderHistory.length}
        prescriptionCount={order.prescriptions.length}
        onChange={setWorkspaceView}
      />
      {workspaceView === "prescriptions" ? (
        <StepProgress
          activeStep={
            order.latestOrder || order.ordered
              ? 5
              : order.canPlaceOrder
                ? 4
                : order.addressErrors.length === 0
                  ? 3
                  : order.availableMedicines.length > 0
                    ? 2
                    : 1
          }
          steps={[
            { label: "Prescription" },
            { label: "Medicines" },
            { label: "Address" },
            { label: "Review" },
            { label: "Placed" },
          ]}
        />
      ) : null}

      {workspaceView === "prescriptions" ? (
        <div className={styles.layout}>
          <div className={styles.mainContent}>
            <PrescriptionNavigator
              prescriptions={order.prescriptions}
              selectedId={order.selectedPrescriptionId}
              onFindDoctor={() => navigate(PAGES.DOCTORS)}
              onSelect={order.setSelectedPrescriptionId}
            />
            <PrescriptionItems
              medicines={order.medicines}
              prescription={order.prescription}
              unavailableMedicines={order.unavailableMedicines}
            />
            <DeliveryAddressCard
              address={order.address}
              errors={order.addressErrors}
              onEdit={() => setAddressModalOpen(true)}
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
      ) : (
        <OrderHistoryWorkspace
          orders={order.orderHistory}
          selectedOrder={order.selectedOrder}
          selectedOrderId={order.selectedOrderId}
          onOrderFromPrescription={() => setWorkspaceView("prescriptions")}
          onSelect={order.setSelectedOrderId}
        />
      )}

      {addressModalOpen && (
        <DeliveryAddressModal
          address={order.address}
          errors={order.addressErrors}
          onChange={order.setAddress}
          onClose={() => setAddressModalOpen(false)}
        />
      )}
    </div>
  );
}

function OrderWorkspaceNav({
  activeView,
  orderCount,
  prescriptionCount,
  onChange,
}) {
  const views = [
    {
      id: "prescriptions",
      label: "Order from prescription",
      meta: `${prescriptionCount} active Rx`,
    },
    {
      id: "history",
      label: "Track previous orders",
      meta: `${orderCount} orders`,
    },
  ];

  return (
    <nav className={styles.workspaceNav} aria-label="Order workspace">
      {views.map((view) => (
        <button
          className={`${styles.workspaceNavItem} ${
            activeView === view.id ? styles.workspaceNavActive : ""
          }`}
          key={view.id}
          onClick={() => onChange(view.id)}
          type="button"
        >
          <span>{view.label}</span>
          <strong>{view.meta}</strong>
        </button>
      ))}
    </nav>
  );
}

function PrescriptionNavigator({ prescriptions, selectedId, onFindDoctor, onSelect }) {
  return (
    <section className={styles.prescriptionPicker}>
      <div className={styles.sectionTop}>
        <div className="min-w-0">
          <h2 className={styles.colTitle}>Choose Prescription</h2>
          <p className={styles.emptyText}>
            Select the prescription you want to inspect or order from.
          </p>
        </div>
      </div>

      {prescriptions.length === 0 ? (
        <EmptyState
          icon="Rx"
          title="No active prescriptions"
          subtitle="Active prescriptions from doctors will appear here after a consultation."
          action="Find a Doctor"
          onAction={onFindDoctor}
        />
      ) : (
        <div className={styles.prescriptionTabs}>
          {prescriptions.map((rx) => {
            const id = rx._id || rx.id;
            const isActive = id === selectedId;
            const doctorName = rx.createdBy?.userId?.name || "Doctor";
            return (
              <button
                className={`${styles.prescriptionTab} ${
                  isActive ? styles.prescriptionTabActive : ""
                }`}
                key={id}
                onClick={() => onSelect(id)}
                type="button"
              >
                <span>{rx.rxId || `Rx ${String(id || "").slice(-6)}`}</span>
                <strong>{doctorName}</strong>
                <small>{formatDate(rx.createdAt)}</small>
              </button>
            );
          })}
        </div>
      )}
    </section>
  );
}

function OrderHistoryWorkspace({
  orders,
  selectedOrder,
  selectedOrderId,
  onOrderFromPrescription,
  onSelect,
}) {
  return (
    <div className={styles.historyWorkspace}>
      <PreviousOrders
        orders={orders}
        onOrderFromPrescription={onOrderFromPrescription}
        selectedOrderId={selectedOrderId}
        onSelect={onSelect}
      />
      <SelectedOrderDetails order={selectedOrder} />
    </div>
  );
}

function DeliveryAddressCard({ address, errors, onEdit }) {
  const addressLine = formatAddress(address);
  const isComplete = errors.length === 0;

  return (
    <section className={styles.addressCard}>
      <div className={styles.addressCardTop}>
        <div className="min-w-0">
          <span className={styles.eyebrow}>Delivery Details</span>
          <h2>Delivery Address</h2>
          <p>
            {addressLine ||
              "Add the recipient and full delivery location before placing the order."}
          </p>
        </div>
        <span className={isComplete ? styles.addressComplete : styles.addressRequired}>
          {isComplete ? "Complete" : "Required"}
        </span>
      </div>

      <div className={styles.addressPreviewGrid}>
        <AddressPreviewItem label="Recipient" value={address.name || "Not added"} />
        <AddressPreviewItem label="Phone" value={address.phone || "Not added"} />
        <AddressPreviewItem
          className="sm:col-span-2"
          label="Location"
          value={addressLine || "Street, city, state, country, and pincode required"}
        />
      </div>

      {errors.length ? (
        <p className={styles.addressMissing}>Missing: {errors.join(", ")}</p>
      ) : null}

      <button className={styles.addressEditButton} onClick={onEdit} type="button">
        {isComplete ? "Edit address" : "Fill address"}
      </button>
    </section>
  );
}

function AddressPreviewItem({ className = "", label, value }) {
  return (
    <div className={`${styles.addressPreviewItem} ${className}`}>
      <span>{label}</span>
      <strong>{value}</strong>
    </div>
  );
}

function DeliveryAddressModal({ address, errors, onChange, onClose }) {
  const update = (key, value) =>
    onChange((current) => ({ ...current, [key]: value }));

  return (
    <ModalPanel
      className="max-w-2xl"
      eyebrow="Secure delivery"
      title="Delivery Address"
      subtitle="Fill the address exactly as it should appear on the pharmacy order."
      onClose={onClose}
      footer={
        <Button variant="primary" onClick={onClose}>
          Done
        </Button>
      }
    >
          <div className={styles.addressNotice}>
            <strong>{errors.length ? "Address is incomplete" : "Address is ready"}</strong>
            <span>
              {errors.length
                ? `Missing: ${errors.join(", ")}`
                : "You can close this panel and place the order from the summary."}
            </span>
          </div>

          <div className={styles.addressFormGrid}>
            <AddressInput label="Recipient name" value={address.name} onChange={(value) => update("name", value)} />
            <AddressInput label="Phone" value={address.phone} onChange={(value) => update("phone", value)} />
            <AddressInput className="sm:col-span-2" label="Street address" value={address.street} onChange={(value) => update("street", value)} />
            <AddressInput label="City" value={address.city} onChange={(value) => update("city", value)} />
            <AddressInput label="State" value={address.state} onChange={(value) => update("state", value)} />
            <AddressInput label="Country" value={address.country} onChange={(value) => update("country", value)} />
            <AddressInput label="Pincode" value={address.pincode} onChange={(value) => update("pincode", value)} />
          </div>
    </ModalPanel>
  );
}

function AddressInput({ className = "", label, onChange, value }) {
  return (
    <label className={`min-w-0 ${className}`}>
      <span className="mb-1.5 block text-[12px] font-bold text-[var(--text)]">
        {label}
      </span>
      <input
        className={styles.addressInput}
        value={value || ""}
        onChange={(event) => onChange(event.target.value)}
      />
    </label>
  );
}

function PreviousOrders({ orders, onOrderFromPrescription, selectedOrderId, onSelect }) {
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
        <EmptyState
          icon="Rx"
          title="No orders yet"
          subtitle="Place an order from an active prescription and track it here."
          action="Order from prescription"
          onAction={onOrderFromPrescription}
        />
      ) : (
        <div className={styles.historyList}>
          {orders.map((item) => (
            <button
              className={`${styles.historyCard} ${
                (item._id || item.id) === selectedOrderId ? styles.historyCardActive : ""
              } max-[520px]:![flex-direction:row] max-[520px]:!items-center max-[520px]:gap-2`}
              key={item._id || item.id}
              onClick={() => onSelect(item._id || item.id)}
              type="button"
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
            </button>
          ))}
        </div>
      )}
    </section>
  );
}

function SelectedOrderDetails({ order }) {
  if (!order) {
    return (
      <section className={styles.selectedOrderCard}>
        <h2 className={styles.colTitle}>Order Details</h2>
        <p className={styles.emptyText}>Select an order to review fulfilment details.</p>
      </section>
    );
  }

  const items = order.items || [];

  return (
    <section className={styles.selectedOrderCard}>
      <div className={styles.selectedOrderHeader}>
        <div className="min-w-0">
          <span className={styles.eyebrow}>Selected order</span>
          <h2>{order.orderNumber || `Order ${String(order._id || order.id || "").slice(-6)}`}</h2>
          <p>{formatDate(order.createdAt)} · {items.length} item{items.length === 1 ? "" : "s"}</p>
        </div>
        <span className={`${styles.statusPill} ${styles[`status_${order.status}`] || ""}`}>
          {formatStatus(order.status)}
        </span>
      </div>

      <div className={styles.selectedOrderItems}>
        {items.length === 0 ? (
          <div className={styles.emptyMini}>No item details available.</div>
        ) : (
          items.map((item, index) => (
            <div className={styles.selectedOrderItem} key={`${item.name}-${index}`}>
              <div>
                <strong>{item.name || "Medicine"}</strong>
                <span>{item.dosage || "Dose not listed"} · Qty {item.quantity || 1}</span>
              </div>
              <b>₹{Number(item.unitPrice || 0) * Number(item.quantity || 1)}</b>
            </div>
          ))
        )}
      </div>

      <div className={styles.selectedOrderTotal}>
        <span>Total paid/payable</span>
        <strong>₹{order.total || order.totalAmount || 0}</strong>
      </div>
    </section>
  );
}

function formatStatus(status = "pending") {
  return status
    .replaceAll("_", " ")
    .replace(/\b\w/g, (letter) => letter.toUpperCase());
}

function formatDate(value) {
  if (!value) return "Recently";
  return new Date(value).toLocaleDateString("en-IN", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });
}

function formatAddress(address) {
  return [
    address.street,
    address.city,
    address.state,
    address.country,
    address.pincode,
  ]
    .filter(Boolean)
    .join(", ");
}
