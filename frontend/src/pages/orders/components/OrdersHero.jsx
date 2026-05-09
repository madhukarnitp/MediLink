import { ordersStyles as styles } from "../../../styles/tailwindStyles";

export default function OrdersHero({ eta, itemCount, prescription, total }) {
  return (
    <div className={`${styles.hero} max-[520px]:gap-3 max-[520px]:p-3`}>
      <div className={`${styles.greeting} min-w-0`}>
        <span className={styles.eyebrow}>MediLink Pharmacy</span>
        <h1>Order Medicines</h1>
        <p className="break-words">
          {prescription
            ? `Prescription ${prescription.rxId} from ${
                prescription.createdBy?.userId?.name || "Doctor"
              }`
            : "No active prescription found"}
          </p>
      </div>
      <div
        className={`${styles.heroStats} max-[520px]:![grid-template-columns:repeat(3,minmax(0,1fr))] max-[520px]:gap-1.5 max-[520px]:[&_div]:px-1.5 max-[520px]:[&_div]:py-2 max-[520px]:[&_span]:text-[13px]`}
      >
        <div>
          <span>{itemCount}</span>
          Items
        </div>
        <div>
          <span>{eta}</span>
          Estimated time
        </div>
        <div>
          <span>₹{total}</span>
          Payable
        </div>
      </div>
    </div>
  );
}
