import { useState, useEffect } from "react";
import { getHomePage, useApp } from "../../context/AppContext";
import { Button, PageSkeleton, ErrorMsg } from "../../components/ui/UI";
import {
  auth as authApi,
  patients as patientsApi,
  doctors as doctorsApi,
  resolveAssetUrl,
} from "../../services/api";
import { profileStyles as styles } from "../../styles/tailwindStyles";

const BLOOD_GROUP_OPTIONS = ["A+", "A-", "B+", "B-", "AB+", "AB-", "O+", "O-"];
const GENDER_OPTIONS = ["male", "female", "other"];
const SPECIALIZATION_OPTIONS = [
  "General Physician",
  "Cardiologist",
  "Dermatologist",
  "Neurologist",
  "Orthopedic",
  "Pediatrician",
  "Psychiatrist",
  "Gynecologist",
  "Urologist",
  "Oncologist",
  "Endocrinologist",
  "Gastroenterologist",
  "Pulmonologist",
  "Ophthalmologist",
  "ENT Specialist",
];

export default function Profile({
  missingFields = [],
  requireCompletion = false,
}) {
  const {
    user,
    logout,
    navigate,
    profile: contextProfile,
    showToast,
    syncSession,
  } = useApp();
  const [dashboardData, setDashboardData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [isEditing, setIsEditing] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [form, setForm] = useState(null);
  const isAdmin = user?.role === "admin";
  const isDoctor = user?.role === "doctor";
  const homePage = getHomePage(user?.role);
  const canEditProfile = Boolean(user);

  const load = async () => {
    setLoading(true);
    setError("");
    try {
      if (user?.role === "patient") {
        const r = await patientsApi.getDashboard();
        setDashboardData(r.data);
      } else if (user?.role === "doctor") {
        const r = await doctorsApi.getDashboard();
        setDashboardData(r.data);
      }
    } catch (e) {
      setError(e.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    load();
  }, [user]);

  const profileData =
    dashboardData?.patient || dashboardData?.doctor || contextProfile || {};
  const stats = dashboardData?.stats || {};
  const recentReviews =
    (isDoctor
      ? dashboardData?.recentReviews || contextProfile?.recentReviews
      : []) || [];
  const locationText = formatLocation(profileData, user);
  const avatarUrl =
    form?.avatarPreview || resolveAssetUrl(profileData.avatar || user?.avatar);
  const initials =
    (form?.name || user?.name)
      ?.split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase()
      .slice(0, 2) || "U";
  const roleLabel = isAdmin
    ? "Administrator"
    : isDoctor
      ? "Medical Doctor"
      : "Patient";

  useEffect(() => {
    if (!user) return;
    setForm(buildFormState(user, profileData, isDoctor, isAdmin));
  }, [user, contextProfile, dashboardData, isDoctor, isAdmin]);

  useEffect(() => {
    if (requireCompletion) setIsEditing(true);
  }, [requireCompletion]);

  const handleChange = (field, value) => {
    setForm((current) => ({ ...current, [field]: value }));
  };

  const handleAvatarChange = (file) => {
    if (!file) return;
    setForm((current) => ({
      ...current,
      avatarFile: file,
      avatarPreview: URL.createObjectURL(file),
    }));
  };

  const resetForm = () => {
    if (requireCompletion) return;
    setForm(buildFormState(user, profileData, isDoctor, isAdmin));
    setIsEditing(false);
    setError("");
  };

  const saveProfile = async () => {
    if (!form) return;

    setIsSaving(true);
    setError("");

    try {
      const requiredMissing = getMissingRequiredFormFields(form, {
        isAdmin,
        isDoctor,
      });
      if (requiredMissing.length > 0) {
        throw new Error(
          `Complete required fields: ${requiredMissing.join(", ")}`,
        );
      }

      const payload = buildProfilePayload(form, isDoctor, isAdmin);

      if (isAdmin) {
        await authApi.updateMe(payload);
      } else if (isDoctor) {
        await doctorsApi.updateProfile(payload);
      } else {
        await patientsApi.updateProfile(payload);
      }

      const me = await authApi.getMe();
      syncSession(me.data.user, me.data.profile);
      await load();
      setIsEditing(requireCompletion);
      showToast(
        requireCompletion
          ? "Basic profile completed. Your account is ready."
          : "Profile updated successfully",
      );
    } catch (e) {
      setError(e.message);
      showToast(e.message, "error");
    } finally {
      setIsSaving(false);
    }
  };

  if (loading)
    return (
      <div className={styles.page}>
        <PageSkeleton />
      </div>
    );

  if (error && !dashboardData && !contextProfile)
    return (
      <div className={styles.page}>
        <ErrorMsg message={error} onRetry={load} />
      </div>
    );

  return (
    <div className={styles.page}>
      <div className={styles.header}>
        <div className={styles.greeting}>
          <h1>My Profile</h1>
          <p>
            {requireCompletion
              ? "Complete these required details before using your account."
              : isAdmin
              ? "View and manage your platform account details"
              : "View and manage your account and health details"}
          </p>
          {requireCompletion && missingFields.length > 0 ? (
            <div className={styles.requiredList}>
              {missingFields.map((field) => (
                <span key={field.key}>{field.label}</span>
              ))}
            </div>
          ) : null}
        </div>

        <div className={styles.headerActions}>
          {!requireCompletion && (
            <Button
              variant="outline"
              onClick={() =>
                navigate(homePage, {}, { updateUrl: true, replace: true })
              }
            >
              Back to Dashboard
            </Button>
          )}

          {!isEditing && canEditProfile ? (
            <Button variant="primary" onClick={() => setIsEditing(true)}>
              Edit Profile
            </Button>
          ) : isEditing ? (
            <>
              {!requireCompletion && (
                <Button variant="outline" onClick={resetForm} disabled={isSaving}>
                  Cancel
                </Button>
              )}
              <Button
                variant="primary"
                onClick={saveProfile}
                disabled={isSaving}
              >
                {isSaving
                  ? "Saving..."
                  : requireCompletion
                    ? "Complete Profile"
                    : "Save Changes"}
              </Button>
            </>
          ) : null}
        </div>
      </div>

      {error ? (
        <div className={styles.errorWrap}>
          <ErrorMsg message={error} onRetry={load} />
        </div>
      ) : null}

      <div className={styles.layout}>
        <div className={styles.profileCard}>
          <div className={styles.avatarWrap}>
            <div className={styles.avatar}>
              {avatarUrl ? (
                <img src={avatarUrl} alt={`${user?.name || "User"} avatar`} />
              ) : (
                initials
              )}
            </div>
            {isEditing && (
              <label className={styles.avatarUpload}>
                Update Photo
                <input
                  accept="image/*"
                  onChange={(e) => handleAvatarChange(e.target.files?.[0])}
                  type="file"
                />
              </label>
            )}
          </div>

          <h2 className={styles.profileName}>
            {isEditing ? (
              <input
                value={form?.name || ""}
                onChange={(e) => handleChange("name", e.target.value)}
                className={`${styles.input} ${styles.nameInput}`}
                placeholder="Full name"
              />
            ) : (
              user?.name || "Guest User"
            )}
          </h2>

          <div className={styles.roleBadge}>{roleLabel}</div>

          <div className={styles.contactSection}>
            <ContactBlock label="Email">
              <div className={styles.contactValue}>{user?.email || "N/A"}</div>
            </ContactBlock>

            <ContactBlock label="Phone Number">
              {isEditing ? (
                <input
                  value={form?.phone || ""}
                  onChange={(e) => handleChange("phone", e.target.value)}
                  className={styles.input}
                  placeholder="Phone number"
                />
              ) : (
                <div className={styles.contactValue}>
                  {user?.phone || profileData.phone || "N/A"}
                </div>
              )}
            </ContactBlock>

            {!isAdmin ? (
              <ContactBlock label="Location">
                {isEditing && !isDoctor ? (
                  <div className={styles.addressForm}>
                    <input
                      value={form?.street || ""}
                      onChange={(e) => handleChange("street", e.target.value)}
                      className={styles.input}
                      placeholder="Street address"
                    />
                    <div className={styles.twoCol}>
                      <input
                        value={form?.city || ""}
                        onChange={(e) => handleChange("city", e.target.value)}
                        className={styles.input}
                        placeholder="City"
                      />
                      <input
                        value={form?.state || ""}
                        onChange={(e) => handleChange("state", e.target.value)}
                        className={styles.input}
                        placeholder="State"
                      />
                    </div>
                    <div className={styles.twoCol}>
                      <input
                        value={form?.country || ""}
                        onChange={(e) =>
                          handleChange("country", e.target.value)
                        }
                        className={styles.input}
                        placeholder="Country"
                      />
                      <input
                        value={form?.pincode || ""}
                        onChange={(e) =>
                          handleChange("pincode", e.target.value)
                        }
                        className={styles.input}
                        placeholder="Pincode"
                      />
                    </div>
                  </div>
                ) : (
                  <div className={styles.contactValue}>
                    {locationText || "N/A"}
                  </div>
                )}
              </ContactBlock>
            ) : null}

            <Button
              variant="outline"
              fullWidth
              onClick={logout}
              className={styles.logoutBtn}
            >
              {requireCompletion ? "Log Out Instead" : "Log Out"}
            </Button>
          </div>
        </div>

        <div className={styles.rightColumn}>
          <section className={styles.sectionCard}>
            <h3 className={styles.sectionTitle}>
              {isAdmin
                ? "Admin Account"
                : isDoctor
                  ? "Professional Information"
                  : "Health Profile"}
            </h3>

            <div className={styles.infoGrid}>
              {isAdmin ? (
                <>
                  <InfoField label="Role" value="Administrator" />
                  <InfoField
                    label="Provisioning"
                    value="Manual database account"
                  />
                  <InfoField
                    label="Account Status"
                    value={user?.status || "Active"}
                  />
                  <InfoField
                    label="Access Level"
                    value="Platform controls, users, and orders"
                    fullWidth
                  />
                </>
              ) : !isDoctor ? (
                <>
                  <InfoField
                    label="Blood Group"
                    value={profileData.bloodGroup || user?.bloodGroup || "—"}
                  >
                    {isEditing ? (
                      <select
                        value={form?.bloodGroup || ""}
                        onChange={(e) =>
                          handleChange("bloodGroup", e.target.value)
                        }
                        className={styles.input}
                      >
                        <option value="">Select blood group</option>
                        {BLOOD_GROUP_OPTIONS.map((option) => (
                          <option key={option} value={option}>
                            {option}
                          </option>
                        ))}
                      </select>
                    ) : null}
                  </InfoField>

                  <InfoField
                    label="Age"
                    value={
                      profileData.age || user?.age
                        ? `${profileData.age || user.age} yrs`
                        : "—"
                    }
                  >
                    {isEditing ? (
                      <input
                        type="number"
                        min="0"
                        value={form?.age ?? ""}
                        onChange={(e) => handleChange("age", e.target.value)}
                        className={styles.input}
                        placeholder="Age"
                      />
                    ) : null}
                  </InfoField>

                  <InfoField
                    label="Gender"
                    value={profileData.gender || user?.gender || "—"}
                  >
                    {isEditing ? (
                      <select
                        value={form?.gender || ""}
                        onChange={(e) => handleChange("gender", e.target.value)}
                        className={styles.input}
                      >
                        <option value="">Select gender</option>
                        {GENDER_OPTIONS.map((option) => (
                          <option key={option} value={option}>
                            {option.charAt(0).toUpperCase() + option.slice(1)}
                          </option>
                        ))}
                      </select>
                    ) : null}
                  </InfoField>

                  <InfoField
                    label="Weight"
                    value={
                      profileData.weight ? `${profileData.weight} kg` : "—"
                    }
                  >
                    {isEditing ? (
                      <input
                        type="number"
                        min="0"
                        step="0.1"
                        value={form?.weight ?? ""}
                        onChange={(e) => handleChange("weight", e.target.value)}
                        className={styles.input}
                        placeholder="Weight in kg"
                      />
                    ) : null}
                  </InfoField>

                  <InfoField
                    label="Height"
                    value={
                      profileData.height ? `${profileData.height} cm` : "—"
                    }
                  >
                    {isEditing ? (
                      <input
                        type="number"
                        min="0"
                        step="0.1"
                        value={form?.height ?? ""}
                        onChange={(e) => handleChange("height", e.target.value)}
                        className={styles.input}
                        placeholder="Height in cm"
                      />
                    ) : null}
                  </InfoField>

                  <InfoField
                    label="BMI"
                    value={profileData.bmi || calculateBmi(form) || "—"}
                  />

                  <InfoField
                    label="Allergies"
                    value={
                      profileData.allergies?.length > 0
                        ? profileData.allergies.join(", ")
                        : "None reported"
                    }
                    fullWidth
                  >
                    {isEditing ? (
                      <textarea
                        value={form?.allergies || ""}
                        onChange={(e) =>
                          handleChange("allergies", e.target.value)
                        }
                        className={styles.textarea}
                        placeholder="Separate allergies with commas"
                      />
                    ) : null}
                  </InfoField>
                </>
              ) : (
                <>
                  <InfoField
                    label="Specialization"
                    value={
                      profileData.specialization ||
                      user?.specialization ||
                      "General Physician"
                    }
                  >
                    {isEditing ? (
                      <select
                        value={form?.specialization || ""}
                        onChange={(e) =>
                          handleChange("specialization", e.target.value)
                        }
                        className={styles.input}
                      >
                        <option value="">Select specialization</option>
                        {SPECIALIZATION_OPTIONS.map((option) => (
                          <option key={option} value={option}>
                            {option}
                          </option>
                        ))}
                      </select>
                    ) : null}
                  </InfoField>

                  <InfoField
                    label="Qualification"
                    value={
                      profileData.qualification || user?.qualification || "MBBS"
                    }
                  >
                    {isEditing ? (
                      <input
                        value={form?.qualification || ""}
                        onChange={(e) =>
                          handleChange("qualification", e.target.value)
                        }
                        className={styles.input}
                        placeholder="Qualification"
                      />
                    ) : null}
                  </InfoField>

                  <InfoField
                    label="Registration Number"
                    value={profileData.regNo || user?.regNo || "—"}
                  >
                    {isEditing ? (
                      <input
                        value={form?.regNo || ""}
                        onChange={(e) => handleChange("regNo", e.target.value)}
                        className={styles.input}
                        placeholder="Registration number"
                      />
                    ) : null}
                  </InfoField>

                  <InfoField
                    label="Consultation Fee"
                    value={
                      profileData.price || user?.price
                        ? `₹${profileData.price || user?.price}`
                        : "—"
                    }
                  >
                    {isEditing ? (
                      <input
                        type="number"
                        min="0"
                        step="1"
                        value={form?.price ?? ""}
                        onChange={(e) => handleChange("price", e.target.value)}
                        className={styles.input}
                        placeholder="Consultation fee"
                      />
                    ) : null}
                  </InfoField>

                  <InfoField
                    label="Experience"
                    value={
                      profileData.experience
                        ? `${profileData.experience} yrs`
                        : "—"
                    }
                  >
                    {isEditing ? (
                      <input
                        type="number"
                        min="0"
                        value={form?.experience ?? ""}
                        onChange={(e) =>
                          handleChange("experience", e.target.value)
                        }
                        className={styles.input}
                        placeholder="Years of experience"
                      />
                    ) : null}
                  </InfoField>

                  <InfoField
                    label="Languages"
                    value={
                      profileData.languages?.length
                        ? profileData.languages.join(", ")
                        : "—"
                    }
                  >
                    {isEditing ? (
                      <input
                        value={form?.languages || ""}
                        onChange={(e) =>
                          handleChange("languages", e.target.value)
                        }
                        className={styles.input}
                        placeholder="English, Hindi"
                      />
                    ) : null}
                  </InfoField>

                  <InfoField
                    label="Bio"
                    value={profileData.bio || "—"}
                    fullWidth
                  >
                    {isEditing ? (
                      <textarea
                        value={form?.bio || ""}
                        onChange={(e) => handleChange("bio", e.target.value)}
                        className={styles.textarea}
                        placeholder="Short professional bio"
                      />
                    ) : null}
                  </InfoField>
                </>
              )}
            </div>
          </section>

          <section className={styles.sectionCard}>
            <h3 className={styles.sectionTitle}>
              {isAdmin ? "Admin Overview" : "Activity Overview"}
            </h3>
            <div className={styles.statsGrid}>
              {isAdmin ? (
                <>
                  <StatBox
                    label="Account Status"
                    value={user?.status || "Active"}
                    tone={styles.statGreen}
                  />
                  <StatBox
                    label="Access"
                    value="Admin"
                    tone={styles.statBlue}
                  />
                  <StatBox
                    label="Provisioning"
                    value="Manual"
                    tone={styles.statPurple}
                  />
                </>
              ) : !isDoctor ? (
                <>
                  <StatBox
                    label="Total Consultations"
                    value={stats.totalConsultations || 0}
                    tone={styles.statGreen}
                  />
                  <StatBox
                    label="Active Prescriptions"
                    value={stats.activePrescriptions || 0}
                    tone={styles.statBlue}
                  />
                  <StatBox
                    label="Total Prescriptions"
                    value={stats.totalPrescriptions || 0}
                    tone={styles.statPurple}
                  />
                </>
              ) : (
                <>
                  <StatBox
                    label="Total Consultations"
                    value={stats.total || 0}
                    tone={styles.statGreen}
                  />
                  <StatBox
                    label="Active Now"
                    value={stats.active || 0}
                    tone={styles.statBlue}
                  />
                  <StatBox
                    label="Rating"
                    value={stats.rating ? `${stats.rating} ★` : "N/A"}
                    tone={styles.statAmber}
                  />
                </>
              )}
            </div>
          </section>

          {isDoctor ? (
            <section className={styles.sectionCard}>
              <h3 className={styles.sectionTitle}>Recent Patient Reviews</h3>
              {recentReviews.length === 0 ? (
                <div className={styles.emptyMini}>
                  No patient reviews yet.
                </div>
              ) : (
                <div className={styles.recordsList}>
                  {recentReviews.map((review) => {
                    const patientAvatar = resolveAssetUrl(review.patient?.avatar);
                    return (
                      <article
                        className={styles.reviewCard}
                        key={review.id}
                      >
                        <div className={styles.reviewTop}>
                          <div className={styles.reviewPatient}>
                            <div className={styles.reviewAvatar}>
                              {patientAvatar ? (
                                <img
                                  alt={`${review.patient?.name || "Patient"} avatar`}
                                  src={patientAvatar}
                                />
                              ) : (
                                getInitials(review.patient?.name || "P")
                              )}
                            </div>
                            <div className={styles.reviewPatientInfo}>
                              <div className={styles.reviewPatientName}>
                                {review.patient?.name || "Patient"}
                              </div>
                              <div className={styles.reviewDate}>
                                {formatReviewDate(review.createdAt)}
                              </div>
                            </div>
                          </div>
                          <div className={styles.reviewRating}>
                            {"★".repeat(review.rating)}
                            {"☆".repeat(5 - review.rating)}
                          </div>
                        </div>
                        <p className={styles.reviewComment}>
                          {review.comment || "Patient submitted a rating without a written review."}
                        </p>
                      </article>
                    );
                  })}
                </div>
              )}
            </section>
          ) : null}
        </div>
      </div>
    </div>
  );
}

function ContactBlock({ label, children }) {
  return (
    <div className={styles.contactBlock}>
      <div className={styles.contactLabel}>{label}</div>
      {children}
    </div>
  );
}

function InfoField({ label, value, fullWidth, children }) {
  return (
    <div
      className={`${styles.infoField} ${fullWidth ? styles.infoFieldFull : ""}`}
    >
      <div className={styles.infoLabel}>{label}</div>
      <div className={styles.infoValue}>{value}</div>
      {children ? <div className={styles.infoEditor}>{children}</div> : null}
    </div>
  );
}

function StatBox({ label, value, tone }) {
  return (
    <div className={styles.statBox}>
      <div className={`${styles.statValue} ${tone}`}>{value}</div>
      <div className={styles.statLabel}>{label}</div>
    </div>
  );
}

function buildFormState(user, profile, isDoctor, isAdmin) {
  const baseState = {
    name: user?.name || "",
    phone: user?.phone || "",
    avatar: profile?.avatar || user?.avatar || "",
    avatarFile: null,
    avatarPreview: "",
  };

  if (isAdmin) {
    return baseState;
  }

  if (isDoctor) {
    return {
      ...baseState,
      specialization: profile?.specialization || "",
      qualification: profile?.qualification || "",
      regNo: profile?.regNo || "",
      price: profile?.price ?? "",
      experience: profile?.experience ?? "",
      languages: (profile?.languages || []).join(", "),
      bio: profile?.bio || "",
    };
  }

  const address = profile?.address || {};
  return {
    ...baseState,
    age: profile?.age ?? "",
    gender: profile?.gender || "",
    weight: profile?.weight ?? "",
    height: profile?.height ?? "",
    bloodGroup: profile?.bloodGroup || "",
    allergies: (profile?.allergies || []).join(", "),
    street: address.street || "",
    city: address.city || "",
    state: address.state || "",
    country: address.country || "",
    pincode: address.pincode || "",
  };
}

function buildProfilePayload(form, isDoctor, isAdmin) {
  const payload = isAdmin
    ? buildAdminPayload(form)
    : isDoctor
      ? buildDoctorPayload(form)
      : buildPatientPayload(form);
  if (!form.avatarFile) return payload;

  const data = new FormData();
  Object.entries(payload).forEach(([key, value]) => {
    if (value === undefined || value === null) return;
    if (typeof value === "object") {
      data.append(key, JSON.stringify(value));
    } else {
      data.append(key, value);
    }
  });
  data.append("avatar", form.avatarFile);
  return data;
}

function getMissingRequiredFormFields(form, { isAdmin, isDoctor }) {
  if (isAdmin || !form) return [];
  const requiredFields = isDoctor
    ? [
        ["name", "Full name"],
        ["phone", "Phone number"],
        ["experience", "Years of experience"],
        ["languages", "Languages spoken"],
      ]
    : [
        ["name", "Full name"],
        ["phone", "Phone number"],
        ["age", "Age"],
        ["gender", "Gender"],
        ["bloodGroup", "Blood group"],
        ["city", "City"],
        ["state", "State"],
        ["country", "Country"],
        ["pincode", "Pincode"],
      ];

  return requiredFields
    .filter(([key]) => {
      const value = form[key];
      if (typeof value === "number") return !Number.isFinite(value);
      return value === undefined || value === null || String(value).trim() === "";
    })
    .map(([, label]) => label);
}

function buildAdminPayload(form) {
  return {
    name: form.name.trim(),
    phone: form.phone?.trim?.() ?? "",
  };
}

function buildPatientPayload(form) {
  return {
    name: form.name.trim(),
    phone: emptyToUndefined(form.phone),
    age: toNumberOrUndefined(form.age),
    gender: emptyToUndefined(form.gender),
    weight: toNumberOrUndefined(form.weight),
    height: toNumberOrUndefined(form.height),
    bloodGroup: emptyToUndefined(form.bloodGroup),
    allergies: splitCommaValues(form.allergies),
    address: {
      street: emptyToUndefined(form.street),
      city: emptyToUndefined(form.city),
      state: emptyToUndefined(form.state),
      country: emptyToUndefined(form.country),
      pincode: emptyToUndefined(form.pincode),
    },
  };
}

function buildDoctorPayload(form) {
  return {
    name: form.name.trim(),
    phone: emptyToUndefined(form.phone),
    specialization: emptyToUndefined(form.specialization),
    qualification: emptyToUndefined(form.qualification),
    regNo: emptyToUndefined(form.regNo),
    price: toNumberOrUndefined(form.price),
    experience: toNumberOrUndefined(form.experience),
    languages: splitCommaValues(form.languages),
    bio: emptyToUndefined(form.bio),
  };
}

function splitCommaValues(value) {
  return (value || "")
    .split(",")
    .map((item) => item.trim())
    .filter(Boolean);
}

function toNumberOrUndefined(value) {
  if (value === "" || value === null || value === undefined) return undefined;
  const parsed = Number(value);
  return Number.isNaN(parsed) ? undefined : parsed;
}

function emptyToUndefined(value) {
  const trimmed = value?.trim?.() ?? value;
  return trimmed === "" ? undefined : trimmed;
}

function formatLocation(profile, user) {
  const address = profile?.address;
  if (address) {
    const parts = [
      address.street,
      address.city,
      address.state,
      address.country,
      address.pincode,
    ].filter(Boolean);
    if (parts.length) return parts.join(", ");
  }
  return user?.location || profile?.location || user?.address || "";
}

function calculateBmi(form) {
  const weight = Number(form?.weight);
  const height = Number(form?.height);
  if (!weight || !height) return "";
  const heightInMeters = height / 100;
  return Math.round((weight / (heightInMeters * heightInMeters)) * 10) / 10;
}

function formatReviewDate(value) {
  if (!value) return "Recently";
  return new Date(value).toLocaleDateString("en-IN", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });
}

function getInitials(name = "U") {
  return (
    name
      .split(" ")
      .filter(Boolean)
      .map((part) => part[0])
      .join("")
      .toUpperCase()
      .slice(0, 2) || "U"
  );
}
