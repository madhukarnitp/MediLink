import { useCallback, useEffect, useState } from "react";
import {
  orders as ordersApi,
  patients as patientsApi,
} from "../../../services/api";
import { getOrderSummary, STATUS_TO_STEP } from "./orderUtils";

export function useMedicineOrder({ profile, user, showToast } = {}) {
  const [prescriptions, setPrescriptions] = useState([]);
  const [selectedPrescriptionId, setSelectedPrescriptionId] = useState("");
  const [selectedOrderId, setSelectedOrderId] = useState("");
  const [prescription, setPrescription] = useState(null);
  const [orderHistory, setOrderHistory] = useState([]);
  const [loading, setLoading] = useState(true);
  const [placing, setPlacing] = useState(false);
  const [error, setError] = useState("");
  const [deliveryMode, setDeliveryMode] = useState("delivery");
  const [availability, setAvailability] = useState(null);
  const [address, setAddress] = useState(() => buildInitialAddress(profile, user));
  const [ordered, setOrdered] = useState(false);
  const [orderedAt, setOrderedAt] = useState(null);

  const load = useCallback(async ({ silent = false } = {}) => {
    if (!silent) setLoading(true);
    if (!silent) setError("");
    try {
      const [prescriptionResponse, orderResponse] = await Promise.all([
        patientsApi.getActivePrescriptions().catch(() => ({ data: [] })),
        ordersApi.getAll({ limit: 10 }).catch(() => ({ data: [] })),
      ]);

      const activePrescriptions = prescriptionResponse.data || [];
      const orders = orderResponse.data || [];
      setPrescriptions(activePrescriptions);
      setOrderHistory(orders);
      setSelectedPrescriptionId((current) => {
        if (activePrescriptions.some((item) => item._id === current)) return current;
        return activePrescriptions[0]?._id || "";
      });
      setSelectedOrderId((current) => {
        if (orders.some((item) => (item._id || item.id) === current)) return current;
        return orders[0]?._id || orders[0]?.id || "";
      });
    } catch (e) {
      setError(e.message || "Could not load orders");
    } finally {
      if (!silent) setLoading(false);
    }
  }, []);

  useEffect(() => {
    load();
  }, [load]);

  useEffect(() => {
    const refresh = () => load({ silent: true });
    const handleVisibilityChange = () => {
      if (document.visibilityState === "visible") refresh();
    };

    window.addEventListener("focus", refresh);
    document.addEventListener("visibilitychange", handleVisibilityChange);
    const timer = window.setInterval(refresh, 30_000);

    return () => {
      window.removeEventListener("focus", refresh);
      document.removeEventListener("visibilitychange", handleVisibilityChange);
      window.clearInterval(timer);
    };
  }, [load]);

  useEffect(() => {
    const selected =
      prescriptions.find((item) => item._id === selectedPrescriptionId) ||
      prescriptions[0] ||
      null;
    setPrescription(selected);

    if (!selected?._id) {
      setAvailability(null);
      return;
    }

    let cancelled = false;
    ordersApi
      .previewPrescription(selected._id)
      .then((response) => {
        if (!cancelled) setAvailability(response.data || null);
      })
      .catch(() => {
        if (!cancelled) setAvailability(null);
      });

    return () => {
      cancelled = true;
    };
  }, [prescriptions, selectedPrescriptionId]);

  useEffect(() => {
    const next = buildInitialAddress(profile, user);
    setAddress((current) =>
      Object.fromEntries(
        Object.entries(next).map(([key, value]) => [key, current[key] || value]),
      ),
    );
  }, [profile, user]);

  const medicines = availability?.items || prescription?.medicines || [];
  const availableMedicines = availability?.availableItems || medicines;
  const unavailableMedicines = availability?.unavailableItems || [];
  const orderableSummary = getOrderSummary(availableMedicines, deliveryMode);
  const summary = orderableSummary;
  const selectedOrder =
    orderHistory.find((item) => (item._id || item.id) === selectedOrderId) ||
    orderHistory[0] ||
    null;
  const latestOrder = selectedOrder;
  const trackedStatus = selectedOrder?.status || (ordered ? "pending" : "");
  const currentStep = STATUS_TO_STEP[trackedStatus] || 0;
  const addressErrors = getAddressErrors(address);
  const canPlaceOrder =
    availableMedicines.length > 0 && addressErrors.length === 0 && !placing;

  const placeOrder = async () => {
    if (!canPlaceOrder) {
      showToast?.(
        availableMedicines.length === 0
          ? "No prescribed medicines are available to order right now"
          : "Add a complete delivery address before placing the order",
        "warning",
      );
      return;
    }

    setPlacing(true);
    setError("");
    try {
      const payload = {
        prescriptionId: prescription?._id,
        items: availableMedicines.map((medicine) => ({
          medicine: medicine.medicine,
          name: medicine.name,
          dosage: medicine.dosage,
          frequency: medicine.frequency,
          duration: medicine.duration,
          instructions: medicine.instructions,
          quantity: medicine.quantity || 1,
          unitPrice: medicine.unitPrice || 0,
        })),
        shippingAddress: address,
        paymentMethod: "cod",
        deliveryFee: orderableSummary.delivery + orderableSummary.packaging,
        discount: orderableSummary.discount,
        notes: deliveryMode === "delivery" ? "Home delivery" : "Store pickup",
      };
      const response = await ordersApi.create(payload);
      setOrderHistory((orders) => [response.data, ...orders]);
      setSelectedOrderId(response.data?._id || response.data?.id || "");
      setOrdered(true);
      setOrderedAt(new Date(response.data.createdAt || Date.now()));
      showToast?.("Order placed successfully");
    } catch (e) {
      setError(e.message || "Could not place order");
      showToast?.(e.message || "Could not place order", "error");
    } finally {
      setPlacing(false);
    }
  };

  return {
    currentStep,
    address,
    addressErrors,
    availability,
    availableMedicines,
    canPlaceOrder,
    deliveryMode,
    error,
    latestOrder,
    loading,
    medicines,
    orderHistory,
    orderableSummary,
    ordered,
    orderedAt,
    placing,
    prescription,
    prescriptions,
    selectedOrder,
    selectedOrderId,
    selectedPrescriptionId,
    summary,
    unavailableMedicines,
    setAddress,
    setSelectedOrderId,
    setSelectedPrescriptionId,
    load,
    placeOrder,
    setDeliveryMode,
  };
}

function buildInitialAddress(profile, user) {
  const saved = profile?.address || {};
  return {
    name: user?.name || "",
    phone: user?.phone || profile?.emergencyContact?.phone || "",
    street: saved.street || "",
    city: saved.city || "",
    state: saved.state || "",
    country: saved.country || "India",
    pincode: saved.pincode || "",
  };
}

function getAddressErrors(address) {
  const required = [
    ["name", "Recipient name"],
    ["phone", "Phone"],
    ["street", "Street address"],
    ["city", "City"],
    ["state", "State"],
    ["country", "Country"],
    ["pincode", "Pincode"],
  ];
  return required
    .filter(([key]) => !String(address?.[key] || "").trim())
    .map(([, label]) => label);
}
