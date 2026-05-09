import { sosStyles as styles } from "../../../styles/tailwindStyles";
import { EMERGENCY_NUMBER } from "./sosUtils";

export default function SOSHero({
  dots,
  onAlertContacts,
  onFindDoctor,
  onPrimaryAction,
  onShareLocation,
  phase,
}) {
  return (
    <section className={styles.heroCard}>
      <div className={styles.alert}>Emergency Mode Active</div>

      <button
        className={`${styles.ring} ${phase === "connecting" ? styles.ringing : ""}`}
        onClick={onPrimaryAction}
        type="button"
      >
        <div className={styles.inner}>
          {phase === "idle" && "SOS"}
          {phase === "connecting" && "..."}
          {phase === "connected" && "GO"}
        </div>
      </button>

      <h1 className={styles.title}>Emergency Assistance</h1>
      <p className={styles.subtitle}>
        Activate SOS to prepare your live location, nearby hospitals, emergency
        contact alert, and a quick doctor search in one place.
      </p>

      {phase === "idle" && (
        <p className={styles.hint}>Tap SOS to start emergency mode</p>
      )}
      {phase === "connecting" && (
        <p className={styles.connecting}>Preparing emergency support{dots}</p>
      )}
      {phase === "connected" && (
        <p className={styles.connected}>
          Ready. Choose the fastest next action.
        </p>
      )}

      <div className={styles.actions}>
        <a className={styles.actionChip} href={`tel:${EMERGENCY_NUMBER}`}>
          <span>Call 108</span>
        </a>
        <button
          className={styles.actionChip}
          onClick={onShareLocation}
          type="button"
        >
          Share Location
        </button>
        <button
          className={styles.actionChip}
          onClick={onAlertContacts}
          type="button"
        >
          Alert Contacts
        </button>
        <button
          className={styles.actionChip}
          onClick={onFindDoctor}
          type="button"
        >
          Find Doctor
        </button>
      </div>

      <div className={styles.helpline}>
        <div className={styles.helplineLabel}>National Emergency Helpline</div>
        <div className={styles.helplineNumber}>{EMERGENCY_NUMBER}</div>
      </div>
    </section>
  );
}
