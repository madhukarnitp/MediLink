import { ordersStyles as styles } from "../../../styles/tailwindStyles";
import { formatOrderStatus, ORDER_STEPS } from "./orderUtils";

export default function OrderTracker({ currentStep, ordered, status }) {
  return (
    <div className={styles.trackerCard}>
      <div className={`${styles.trackerHead} gap-2`}>
        <h2 className={`${styles.cartTitle} min-w-0`}>Order Tracker</h2>
        {status && (
          <span
            className={`${styles.trackerStatus} max-[520px]:shrink-0 max-[520px]:text-[11px]`}
          >
            {formatOrderStatus(status)}
          </span>
        )}
      </div>
      <div className={styles.tracker}>
        {ORDER_STEPS.map((step, index) => (
          <TrackerStep
            currentStep={currentStep}
            index={index}
            key={step}
            ordered={ordered}
            step={step}
          />
        ))}
      </div>
    </div>
  );
}

function TrackerStep({ currentStep, index, ordered, step }) {
  const isDone = ordered && index < currentStep;
  const isCurrent = ordered && index === currentStep;
  const isActive = ordered && index <= currentStep;

  return (
    <div className={styles.step}>
      <div className={styles.stepLeft}>
        <div
          className={`${styles.stepDot} ${
            isDone ? styles.done : isCurrent ? styles.current : styles.pending
          }`}
        />
        {index < ORDER_STEPS.length - 1 && (
          <div
            className={`${styles.stepLine} ${isDone ? styles.doneLine : ""}`}
          />
        )}
      </div>
      <div
        className={`${styles.stepLabel} min-w-0 break-words max-[520px]:text-[12px] ${
          isActive ? styles.currentLabel : ""
        }`}
      >
        {step}
        {isCurrent && (
          <span
            className={`${styles.stepBadge} max-[520px]:w-fit max-[520px]:text-[10px]`}
          >
            {index === ORDER_STEPS.length - 1 ? "Done" : "In progress"}
          </span>
        )}
      </div>
    </div>
  );
}
