import { ordersStyles as styles } from "../../../styles/tailwindStyles";

export default function FulfillmentSelector({ deliveryMode, onChange }) {
  return (
    <>
      <div
        className={`${styles.sectionTop} max-[520px]:![flex-direction:row] max-[520px]:!items-center max-[520px]:gap-2`}
      >
        <h2 className={`${styles.colTitle} ${styles.fulfilmentTitle}`}>
          Fulfilment Method
        </h2>
        <span className={`${styles.safeBadge} max-[520px]:mt-0 max-[520px]:shrink-0`}>
          Cold-safe
        </span>
      </div>
      <div
        className={`${styles.modes} max-[520px]:![grid-template-columns:repeat(2,minmax(0,1fr))] max-[520px]:gap-2`}
      >
        <ModeButton
          active={deliveryMode === "delivery"}
          icon="🚚"
          name="Home Delivery"
          onClick={() => onChange("delivery")}
          subtitle="Delivered in 2-4 hours"
        />
        <ModeButton
          active={deliveryMode === "pickup"}
          icon="🏪"
          name="Store Pickup"
          onClick={() => onChange("pickup")}
          subtitle="Ready in 30 mins · Apollo Pharmacy"
        />
      </div>
    </>
  );
}

function ModeButton({ active, icon, name, onClick, subtitle }) {
  return (
    <button
      className={`${styles.modeBtn} ${active ? styles.modeActive : ""}`}
      onClick={onClick}
      type="button"
    >
      <span className={`${styles.modeIcon} max-[520px]:text-base`}>{icon}</span>
      <div className="min-w-0">
        <div className={`${styles.modeName} max-[520px]:text-[12px]`}>{name}</div>
        <div className={`${styles.modeSub} max-[520px]:text-[10px] max-[520px]:leading-snug`}>
          {subtitle}
        </div>
      </div>
    </button>
  );
}
