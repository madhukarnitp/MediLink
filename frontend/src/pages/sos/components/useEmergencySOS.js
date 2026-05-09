import { useCallback, useEffect, useMemo, useState } from "react";
import {
  currentLocationLink,
  fetchNearbyHospitals,
  hospitalSearchLink,
} from "./sosUtils";

export function useEmergencySOS(showToast) {
  const [phase, setPhase] = useState("idle");
  const [dots, setDots] = useState("");
  const [location, setLocation] = useState(null);
  const [locationStatus, setLocationStatus] = useState("idle");
  const [hospitals, setHospitals] = useState([]);
  const [hospitalLoading, setHospitalLoading] = useState(false);
  const [hospitalError, setHospitalError] = useState("");

  const locationUrl = useMemo(() => currentLocationLink(location), [location]);
  const smsBody = useMemo(
    () =>
      encodeURIComponent(
        location
          ? `Emergency SOS. I need help. My current location is ${locationUrl}`
          : "Emergency SOS. I need help. Please call me immediately.",
      ),
    [location, locationUrl],
  );

  useEffect(() => {
    if (phase !== "connecting") return;
    const timer = setInterval(() => {
      setDots((value) => (value.length >= 3 ? "" : `${value}.`));
    }, 500);
    return () => clearInterval(timer);
  }, [phase]);

  const requestLocation = useCallback(async () => {
    if (!navigator.geolocation) {
      setLocationStatus("error");
      throw new Error("Location is not supported in this browser");
    }

    setLocationStatus("loading");
    const position = await new Promise((resolve, reject) => {
      navigator.geolocation.getCurrentPosition(resolve, reject, {
        enableHighAccuracy: true,
        timeout: 12000,
        maximumAge: 60000,
      });
    });

    const nextLocation = {
      lat: Number(position.coords.latitude.toFixed(6)),
      lng: Number(position.coords.longitude.toFixed(6)),
      accuracy: Math.round(position.coords.accuracy || 0),
    };
    setLocation(nextLocation);
    setLocationStatus("ready");
    return nextLocation;
  }, []);

  const loadHospitals = useCallback(
    async (nextLocation = location) => {
      if (!nextLocation) return;

      setHospitalLoading(true);
      setHospitalError("");
      try {
        const nearby = await fetchNearbyHospitals(nextLocation);
        setHospitals(nearby);
        if (nearby.length === 0) {
          setHospitalError(
            "No mapped hospitals found nearby. Open Maps for live results.",
          );
        }
      } catch (e) {
        setHospitalError(e.message);
      } finally {
        setHospitalLoading(false);
      }
    },
    [location],
  );

  const activateEmergency = useCallback(async () => {
    setPhase("connecting");
    try {
      const nextLocation = location || (await requestLocation());
      await loadHospitals(nextLocation);
      showToast("Emergency mode activated. Location is ready to share.");
    } catch (e) {
      showToast(e.message, "error");
    } finally {
      setTimeout(() => setPhase("connected"), 700);
    }
  }, [loadHospitals, location, requestLocation, showToast]);

  const shareLocation = useCallback(async () => {
    try {
      const nextLocation = location || (await requestLocation());
      const shareUrl = currentLocationLink(nextLocation);
      const text = `Emergency SOS. My current location is ${shareUrl}`;

      if (navigator.share) {
        await navigator.share({ title: "MediLink SOS", text, url: shareUrl });
      } else if (navigator.clipboard) {
        await navigator.clipboard.writeText(text);
        showToast("Location copied to clipboard");
      } else {
        window.open(shareUrl, "_blank", "noopener,noreferrer");
      }
    } catch (e) {
      showToast(e.message || "Could not share location", "error");
    }
  }, [location, requestLocation, showToast]);

  const alertContacts = useCallback(() => {
    window.location.href = `sms:?body=${smsBody}`;
  }, [smsBody]);

  const openHospitalSearch = useCallback(() => {
    window.open(hospitalSearchLink(location), "_blank", "noopener,noreferrer");
  }, [location]);

  const locationText =
    locationStatus === "loading"
      ? "Getting precise location..."
      : location
        ? `Location ready (${location.accuracy || "?"} m accuracy)`
        : "Location not shared yet";

  return {
    dots,
    hospitalError,
    hospitalLoading,
    hospitals,
    location,
    locationText,
    phase,
    activateEmergency,
    alertContacts,
    openHospitalSearch,
    shareLocation,
  };
}
