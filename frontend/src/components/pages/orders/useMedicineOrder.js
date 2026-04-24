import { useEffect, useState } from "react";
import {
  orders as ordersApi,
  patients as patientsApi,
} from "../../../services/api";
import { getOrderSummary, STATUS_TO_STEP } from "./orderUtils";

export function useMedicineOrder({ profile, user, showToast } = {}) {
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

  const load = async () => {
    setLoading(true);
    setError("");
    try {
      const [prescriptionResponse, orderResponse] = await Promise.all([
        patientsApi.getActivePrescriptions().catch(() => ({ data: [] })),
        ordersApi.getAll({ limit: 10 }).catch(() => ({ data: [] })),
      ]);

      const activePrescription = prescriptionResponse.data?.[0] || null;
      setPrescription(activePrescription);
      setOrderHistory(orderResponse.data || []);
      if (activePrescription?._id) {
        const previewResponse = await ordersApi
          .previewPrescription(activePrescription._id)
          .catch(() => null);
        setAvailability(previewResponse?.data || null);
      } else {
        setAvailability(null);
      }
    } catch (e) {
      setError(e.message || "Could not load orders");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    load();
  }, []);

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
  const latestOrder = orderHistory[0] || null;
  const trackedStatus = latestOrder?.status || (ordered ? "pending" : "");
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
    summary,
    unavailableMedicines,
    setAddress,
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
