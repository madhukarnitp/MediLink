import { sosStyles as styles } from "../../../styles/tailwindStyles";
import { EMERGENCY_NUMBER, formatDistance, mapsLink } from "./sosUtils";

const buildMapUrl = (location) => {
  if (!location) return "";
  const delta = 0.012;
  const bbox = [
    location.lng - delta,
    location.lat - delta,
    location.lng + delta,
    location.lat + delta,
  ]
    .map((value) => encodeURIComponent(value))
    .join("%2C");
  return `https://www.openstreetmap.org/export/embed.html?bbox=${bbox}&layer=mapnik&marker=${location.lat}%2C${location.lng}`;
};

export default function SOSInfoPanel({
  hospitalError,
  hospitalLoading,
  hospitals,
  location,
  locationText,
  onActivateEmergency,
  onCancel,
  onOpenHospitalSearch,
  onShareLocation,
}) {
  const mapUrl = buildMapUrl(location);

  return (
    <section className={styles.infoPanel}>
      <LocationStatus
        location={location}
        locationText={locationText}
        onShareLocation={onShareLocation}
      />

      {location && mapUrl && (
        <div className={styles.sosMap}>
          <iframe
            title="SOS location map"
            src={mapUrl}
            frameBorder="0"
            loading="lazy"
          />
        </div>
      )}

      <HospitalHeader onOpenHospitalSearch={onOpenHospitalSearch} />

      <HospitalContent
        hospitalError={hospitalError}
        hospitalLoading={hospitalLoading}
        hospitals={hospitals}
        onActivateEmergency={onActivateEmergency}
        onOpenHospitalSearch={onOpenHospitalSearch}
      />

      <SOSChecklist />

      <button className={styles.cancel} onClick={onCancel} type="button">
        Cancel and return to dashboard
      </button>
    </section>
  );
}

function LocationStatus({ location, locationText, onShareLocation }) {
  return (
    <div className={styles.statusCard}>
      <div>
        <div className={styles.panelLabel}>Your Location</div>
        <div className={styles.statusText}>{locationText}</div>
      </div>
      <button
        className={styles.smallBtn}
        onClick={onShareLocation}
        type="button"
      >
        {location ? "Share" : "Enable"}
      </button>
    </div>
  );
}

function HospitalHeader({ onOpenHospitalSearch }) {
  return (
    <div className={styles.hospitalHeader}>
      <div>
        <h2>Nearest Hospitals</h2>
        <p>Showing the closest five from open map data.</p>
      </div>
      <button
        className={styles.smallBtn}
        onClick={onOpenHospitalSearch}
        type="button"
      >
        Open Maps
      </button>
    </div>
  );
}

function HospitalContent({
  hospitalError,
  hospitalLoading,
  hospitals,
  onActivateEmergency,
  onOpenHospitalSearch,
}) {
  if (hospitalLoading) {
    return <div className={styles.listState}>Finding nearby hospitals...</div>;
  }

  if (hospitalError) {
    return (
      <div className={styles.listState}>
        {hospitalError}
        <button
          className={styles.inlineBtn}
          onClick={onOpenHospitalSearch}
          type="button"
        >
          Search in Maps
        </button>
      </div>
    );
  }

  if (hospitals.length === 0) {
    return (
      <div className={styles.listState}>
        Enable location to load the nearest five hospitals.
        <button
          className={styles.inlineBtn}
          onClick={onActivateEmergency}
          type="button"
        >
          Enable Now
        </button>
      </div>
    );
  }

  return (
    <div className={styles.hospitalList}>
      {hospitals.map((hospital, index) => (
        <HospitalCard hospital={hospital} index={index} key={hospital.id} />
      ))}
    </div>
  );
}

function HospitalCard({ hospital, index }) {
  return (
    <article className={styles.hospitalCard}>
      <div className={styles.rank}>{index + 1}</div>
      <div className={styles.hospitalMain}>
        <h3>{hospital.name}</h3>
        <p>
          {formatDistance(hospital.distance)}
          {hospital.address ? ` · ${hospital.address}` : ""}
        </p>
        <div className={styles.hospitalActions}>
          <a
            href={mapsLink(hospital.lat, hospital.lng)}
            target="_blank"
            rel="noreferrer"
          >
            Directions
          </a>
          {hospital.phone ? (
            <a href={`tel:${hospital.phone}`}>Call</a>
          ) : (
            <a href={`tel:${EMERGENCY_NUMBER}`}>Call 108</a>
          )}
        </div>
      </div>
    </article>
  );
}

function SOSChecklist() {
  return (
    <div className={styles.checklist}>
      <div className={styles.panelLabel}>SOS Checklist</div>
      <p>Call emergency services first for life-threatening symptoms.</p>
      <p>Keep the patient still, note symptoms, allergies, and medicines.</p>
      <p>Share location with a trusted contact before travelling.</p>
    </div>
  );
}
