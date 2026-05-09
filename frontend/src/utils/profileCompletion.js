const hasValue = (value) => {
  if (Array.isArray(value)) return value.length > 0;
  if (typeof value === "number") return Number.isFinite(value);
  return value !== undefined && value !== null && String(value).trim() !== "";
};

const addressValue = (profile, key) =>
  profile?.address?.[key] ?? profile?.[key];

export function getMissingProfileFields(user, profile) {
  if (!user || user.role === "admin") return [];

  const common = [
    ["name", "Full name", user.name],
    ["phone", "Phone number", user.phone || profile?.phone || profile?.user?.phone],
  ];

  const roleFields =
    user.role === "doctor"
      ? [
          ["experience", "Years of experience", profile?.experience],
          ["languages", "Languages spoken", profile?.languages],
        ]
      : [
          ["age", "Age", profile?.age],
          ["gender", "Gender", profile?.gender],
          ["bloodGroup", "Blood group", profile?.bloodGroup],
          ["city", "City", addressValue(profile, "city")],
          ["state", "State", addressValue(profile, "state")],
          ["country", "Country", addressValue(profile, "country")],
          ["pincode", "Pincode", addressValue(profile, "pincode")],
        ];

  return [...common, ...roleFields]
    .filter(([, , value]) => !hasValue(value))
    .map(([key, label]) => ({ key, label }));
}

export function needsProfileCompletion(user, profile) {
  return getMissingProfileFields(user, profile).length > 0;
}
