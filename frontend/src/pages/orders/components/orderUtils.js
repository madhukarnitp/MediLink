export const ORDER_STEPS = [
  "Order Placed",
  "Confirmed",
  "Processing",
  "Shipped",
  "Delivered",
];

export const STATUS_TO_STEP = {
  pending: 0,
  confirmed: 1,
  processing: 2,
  shipped: 3,
  delivered: 4,
  cancelled: 0,
};

export const formatOrderStatus = (status = "pending") =>
  status
    .replaceAll("_", " ")
    .replace(/\b\w/g, (letter) => letter.toUpperCase());

export const getInitials = (name) =>
  (name || "User")
    .split(" ")
    .filter(Boolean)
    .map((part) => part[0])
    .join("")
    .toUpperCase()
    .slice(0, 2) || "U";

export const getOrderSummary = (medicines, deliveryMode) => {
  const basePrice = medicines.reduce(
    (sum, medicine) =>
      sum + Number(medicine.quantity || 1) * Number(medicine.unitPrice || 0),
    0,
  );
  const delivery = deliveryMode === "delivery" ? 30 : 0;
  const packaging = medicines.length > 0 ? 10 : 0;
  const discount = medicines.length >= 3 ? 40 : 0;
  const total = Math.max(basePrice + delivery + packaging - discount, 0);
  const eta = deliveryMode === "delivery" ? "2-4 hours" : "30 mins";

  return {
    basePrice,
    delivery,
    discount,
    eta,
    packaging,
    total,
  };
};
