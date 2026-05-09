export const getInitials = (value, fallback = "U") =>
  (value || fallback)
    .split(" ")
    .filter(Boolean)
    .map((part) => part[0])
    .join("")
    .toUpperCase()
    .slice(0, 2) || fallback;

export const formatDuration = (seconds) =>
  `${String(Math.floor(seconds / 60)).padStart(2, "0")}:${String(seconds % 60).padStart(2, "0")}`;

export const isOwnMessage = (message, user) => {
  const senderId = message.sender?._id || message.sender;
  return senderId
    ? String(senderId) === String(user?._id)
    : message.senderRole === user?.role;
};

export const formatMessageTime = (createdAt) =>
  createdAt
    ? new Date(createdAt).toLocaleTimeString("en-IN", {
        hour: "2-digit",
        minute: "2-digit",
      })
    : "";
