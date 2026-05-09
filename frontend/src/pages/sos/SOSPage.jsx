import { useApp, PAGES } from "../../context/AppContext";
import { sosStyles as styles } from "../../styles/tailwindStyles";
import SOSHero from "./components/SOSHero";
import SOSInfoPanel from "./components/SOSInfoPanel";
import { useEmergencySOS } from "./components/useEmergencySOS";

export default function SOSPage() {
  const { navigate, showToast } = useApp();
  const sos = useEmergencySOS(showToast);

  const handleConnect = () => {
    if (sos.phase === "idle") sos.activateEmergency();
    if (sos.phase === "connected") navigate(PAGES.DOCTORS, { emergency: true });
  };

  return (
    <div className={styles.overlay}>
      <SOSHero
        dots={sos.dots}
        onAlertContacts={sos.alertContacts}
        onFindDoctor={() => navigate(PAGES.DOCTORS, { emergency: true })}
        onPrimaryAction={handleConnect}
        onShareLocation={sos.shareLocation}
        phase={sos.phase}
      />

      <SOSInfoPanel
        hospitalError={sos.hospitalError}
        hospitalLoading={sos.hospitalLoading}
        hospitals={sos.hospitals}
        location={sos.location}
        locationText={sos.locationText}
        onActivateEmergency={sos.activateEmergency}
        onCancel={() => navigate(PAGES.DASHBOARD)}
        onOpenHospitalSearch={sos.openHospitalSearch}
        onShareLocation={sos.shareLocation}
      />
    </div>
  );
}
