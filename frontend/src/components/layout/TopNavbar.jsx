import { useEffect, useMemo, useRef, useState } from "react";
import { useApp, PAGES } from "../../context/AppContext";
import { resolveAssetUrl } from "../../services/api";
import { IconBtn } from "../ui/UI";
import { topNavbarStyles as styles } from "../../styles/tailwindStyles";
import logo from "../../assets/logo.png";

const SEARCH_ITEMS = {
  patient: [
    {
      title: "Find doctors",
      description: "Search verified specialists",
      page: PAGES.DOCTORS,
      keywords: ["doctor", "consult", "appointment", "specialist"],
    },
    {
      title: "General Physician",
      description: "Fever, cold, cough, weakness",
      page: PAGES.DOCTORS,
      params: { specialty: "General Physician", search: "general physician" },
      keywords: ["fever", "cold", "cough", "headache", "body pain", "general"],
    },
    {
      title: "Cardiologist",
      description: "Chest pain, heart and BP care",
      page: PAGES.DOCTORS,
      params: { specialty: "Cardiologist", search: "cardiologist" },
      keywords: ["heart", "cardio", "chest", "bp", "blood pressure"],
    },
    {
      title: "Dermatologist",
      description: "Skin rash, acne, allergy",
      page: PAGES.DOCTORS,
      params: { specialty: "Dermatologist", search: "dermatologist" },
      keywords: ["skin", "rash", "acne", "itching", "allergy"],
    },
    {
      title: "Neurologist",
      description: "Migraine, seizure, nerve pain",
      page: PAGES.DOCTORS,
      params: { specialty: "Neurologist", search: "neurologist" },
      keywords: ["migraine", "nerve", "seizure", "brain"],
    },
    {
      title: "Pediatrician",
      description: "Child health and fever",
      page: PAGES.DOCTORS,
      params: { specialty: "Pediatrician", search: "pediatrician" },
      keywords: ["child", "baby", "kids", "pediatric"],
    },
    {
      title: "Psychiatrist",
      description: "Stress, anxiety, sleep support",
      page: PAGES.DOCTORS,
      params: { specialty: "Psychiatrist", search: "psychiatrist" },
      keywords: ["stress", "anxiety", "sleep", "mental"],
    },
    {
      title: "Prescriptions",
      description: "View active and past prescriptions",
      page: PAGES.PRESCRIPTION_LIST,
      keywords: ["rx", "medicine list", "prescription"],
    },
    {
      title: "Appointments",
      description: "Book and manage scheduled visits",
      page: PAGES.APPOINTMENTS,
      keywords: ["appointment", "booking", "schedule", "slot"],
    },
    {
      title: "Order medicines",
      description: "Buy medicines from prescription",
      page: PAGES.ORDERS,
      keywords: ["order", "medicine", "pharmacy", "tablet"],
    },
    {
      title: "Health records",
      description: "Reports and medical files",
      page: PAGES.RECORDS,
      keywords: ["record", "report", "file", "health"],
    },
    {
      title: "SOS emergency",
      description: "Emergency help and hospitals",
      page: PAGES.SOS,
      keywords: ["sos", "emergency", "ambulance", "hospital"],
    },
  ],
  doctor: [
    {
      title: "Doctor dashboard",
      description: "Overview and activity",
      page: PAGES.DOCTOR_DASHBOARD,
      keywords: ["dashboard", "home"],
    },
    {
      title: "Create prescription",
      description: "Issue a new prescription",
      page: PAGES.CREATE_PRESCRIPTION,
      keywords: ["new", "create", "prescription", "rx"],
    },
    {
      title: "My patients",
      description: "Patients who consulted with you",
      page: PAGES.DOCTOR_PATIENTS,
      keywords: ["patients", "old patients", "consulted", "history"],
    },
    {
      title: "My prescriptions",
      description: "View issued prescriptions",
      page: PAGES.DOCTOR_PRESCRIPTIONS,
      keywords: ["prescriptions", "issued", "rx"],
    },
    {
      title: "Consultations",
      description: "Open live consultation room",
      page: PAGES.CONSULTATION,
      keywords: ["chat", "video", "consultation", "patient"],
    },
    {
      title: "Consultation records",
      description: "Review all patient consultations",
      page: PAGES.CONSULTATION_LIST,
      keywords: ["records", "history", "past consultations", "patients"],
    },
    {
      title: "Appointments",
      description: "Confirm scheduled patient visits",
      page: PAGES.APPOINTMENTS,
      keywords: ["appointment", "booking", "schedule", "slot"],
    },
    {
      title: "Profile",
      description: "Update professional profile",
      page: PAGES.PROFILE,
      keywords: ["profile", "account", "settings"],
    },
  ],
  admin: [
    {
      title: "Admin overview",
      description: "Platform summary and priorities",
      page: PAGES.ADMIN_DASHBOARD,
      keywords: ["admin", "dashboard", "control"],
    },
    {
      title: "Manage users",
      description: "Approve accounts and access",
      page: PAGES.ADMIN_USERS,
      keywords: ["verify", "verification", "users", "approve"],
    },
    {
      title: "Doctor approvals",
      description: "Review doctor credentials",
      page: PAGES.ADMIN_DOCTORS,
      keywords: ["doctor", "doctors", "credentials", "approval"],
    },
    {
      title: "Manage orders",
      description: "Update pharmacy order status",
      page: PAGES.ADMIN_ORDERS,
      keywords: ["order", "orders", "delivery", "pharmacy"],
    },
    {
      title: "Medicine inventory",
      description: "Stock, price, and availability",
      page: PAGES.ADMIN_MEDICINES,
      keywords: ["medicine", "inventory", "stock", "pharmacy"],
    },
    {
      title: "Profile",
      description: "Admin account profile",
      page: PAGES.PROFILE,
      keywords: ["profile", "account", "settings"],
    },
  ],
};

export default function TopNavbar() {
  const {
    notifications,
    notificationItems,
    notificationPermission,
    user,
    navigate,
    requestNotificationPermission,
    clearNotifications,
    dismissNotification,
    showToast,
    logout,
  } = useApp();
  const [query, setQuery] = useState("");
  const [open, setOpen] = useState(false);
  const [notificationOpen, setNotificationOpen] = useState(false);
  const [accountOpen, setAccountOpen] = useState(false);
  const notificationRef = useRef(null);
  const accountRef = useRef(null);

  const initials = user?.name
    ? user.name
        .split(" ")
        .map((n) => n[0])
        .join("")
        .toUpperCase()
    : "U";

  const isDoctor = user?.role === "doctor";
  const isAdmin = user?.role === "admin";
  const homePage = isAdmin
    ? PAGES.ADMIN_DASHBOARD
    : isDoctor
      ? PAGES.DOCTOR_DASHBOARD
      : PAGES.DASHBOARD;
  const avatarUrl = resolveAssetUrl(user?.avatar);
  const searchItems = SEARCH_ITEMS[user?.role] || SEARCH_ITEMS.patient;
  const recentNotifications = (notificationItems || []).slice(0, 6);
  const hasUnreadNotifications =
    notifications > 0 || recentNotifications.length > 0;
  const notificationText =
    notificationPermission === "granted"
      ? "Browser alerts are active"
      : notificationPermission === "unsupported"
        ? "Browser alerts are unavailable"
        : notificationPermission === "denied"
          ? "Browser alerts are blocked"
          : "Turn on browser alerts";
  const suggestions = useMemo(() => {
    const normalized = query.trim().toLowerCase();
    if (!normalized) return searchItems.slice(0, 5);

    return searchItems
      .map((item) => {
        const haystack = [
          item.title,
          item.description,
          ...(item.keywords || []),
        ]
          .join(" ")
          .toLowerCase();
        const title = item.title.toLowerCase();
        const score = title.includes(normalized)
          ? 3
          : haystack.includes(normalized)
            ? 2
            : normalized.split(/\s+/).some((word) => haystack.includes(word))
              ? 1
              : 0;
        return { ...item, score };
      })
      .filter((item) => item.score > 0)
      .sort((a, b) => b.score - a.score)
      .slice(0, 6);
  }, [query, searchItems]);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (!notificationRef.current?.contains(event.target)) {
        setNotificationOpen(false);
      }
      if (!accountRef.current?.contains(event.target)) {
        setAccountOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleBellClick = () => {
    setNotificationOpen((value) => !value);
    setAccountOpen(false);
  };

  const handleEnableNotifications = async () => {
    await requestNotificationPermission?.();
  };

  const handleClearNotifications = () => {
    clearNotifications?.();
    setNotificationOpen(false);
    showToast("Notifications cleared");
  };

  const handleNotificationOpen = (item) => {
    if (item.page) {
      navigate(item.page, item.params || {});
    }
    dismissNotification?.(item.id);
    setNotificationOpen(false);
  };

  const handleAccountClick = () => {
    setAccountOpen((value) => !value);
    setNotificationOpen(false);
  };

  const handleViewProfile = () => {
    navigate(PAGES.PROFILE);
    setAccountOpen(false);
  };

  const handleLogout = async () => {
    setAccountOpen(false);
    await logout?.();
  };

  const runSearch = (item = suggestions[0]) => {
    const trimmed = query.trim();
    if (item) {
      navigate(item.page, item.params || (trimmed ? { search: trimmed } : {}));
    } else if (trimmed) {
      const fallbackPage =
        user?.role === "admin"
          ? PAGES.ADMIN_DASHBOARD
          : user?.role === "doctor"
            ? PAGES.CONSULTATION
            : PAGES.DOCTORS;
      navigate(fallbackPage, { search: trimmed });
    }
    setOpen(false);
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    runSearch();
  };

  return (
    <header className={styles.navbar}>
      <button
        type="button"
        className={styles.logo}
        onClick={() => navigate(homePage)}
      >
        <img src={logo} alt="MediLink logo" className={styles.logoImage} />
        {isDoctor && <span className={styles.badge}>Doctor</span>}
        {isAdmin && <span className={styles.badge}>Admin</span>}
      </button>

      <form className={styles.search} onSubmit={handleSubmit}>
        <SearchIcon />
        <input
          placeholder={
            user?.role === "admin"
              ? "Search users, orders, verification..."
              : user?.role === "doctor"
                ? "Search consultations, prescriptions..."
                : "Search symptoms, doctors, medicines..."
          }
          value={query}
          onBlur={() => window.setTimeout(() => setOpen(false), 120)}
          onChange={(event) => {
            setQuery(event.target.value);
            setOpen(true);
          }}
          onFocus={() => setOpen(true)}
        />
        {query && (
          <button
            className={styles.clearSearch}
            onClick={() => {
              setQuery("");
              setOpen(false);
            }}
            type="button"
            aria-label="Clear search"
          >
            ×
          </button>
        )}
        {open && suggestions.length > 0 && (
          <div className={styles.searchMenu}>
            {suggestions.map((item) => (
              <button
                className={styles.searchItem}
                key={`${item.page}-${item.title}`}
                onMouseDown={(event) => {
                  event.preventDefault();
                  runSearch(item);
                }}
                type="button"
              >
                <span>{item.title}</span>
                <small>{item.description}</small>
              </button>
            ))}
          </div>
        )}
      </form>

      <div className={styles.right}>
        <div className={styles.notificationWrap} ref={notificationRef}>
          <IconBtn
            active={notificationOpen || hasUnreadNotifications}
            badge={hasUnreadNotifications}
            onClick={handleBellClick}
            title="Notifications"
            ariaLabel="Notifications"
          >
            <BellIcon />
            {hasUnreadNotifications && (
              <span className={styles.notificationCount}>
                {notifications > 9
                  ? "9+"
                  : notifications || recentNotifications.length}
              </span>
            )}
          </IconBtn>

          {notificationOpen && (
            <div className={styles.notificationPanel} role="status">
              <div className={styles.notificationPanelHeader}>
                <div>
                  <strong>Notifications</strong>
                  <span>{notificationText}</span>
                </div>
                <span
                  className={`${styles.notificationStatus} ${
                    notificationPermission === "granted"
                      ? styles.notificationStatusActive
                      : ""
                  }`}
                >
                  {notificationPermission === "granted" ? "Active" : "Off"}
                </span>
              </div>

              {recentNotifications.length > 0 ? (
                <div className={styles.notificationList}>
                  {recentNotifications.map((item) => (
                    <button
                      className={styles.notificationItem}
                      key={item.id}
                      onClick={() => handleNotificationOpen(item)}
                      type="button"
                    >
                      <span>{item.title}</span>
                      <small>{item.body}</small>
                      <time>
                        {new Date(item.createdAt).toLocaleString("en-IN", {
                          day: "numeric",
                          month: "short",
                          hour: "2-digit",
                          minute: "2-digit",
                        })}
                      </time>
                    </button>
                  ))}
                </div>
              ) : (
                <div className={styles.notificationEmpty}>
                  {notifications > 0
                    ? `${notifications} new update${notifications === 1 ? "" : "s"} waiting.`
                    : "No new notifications."}
                </div>
              )}

              <div className={styles.notificationActions}>
                {notificationPermission !== "granted" && (
                  <button onClick={handleEnableNotifications} type="button">
                    Enable alerts
                  </button>
                )}
                {hasUnreadNotifications && (
                  <button onClick={handleClearNotifications} type="button">
                    Clear
                  </button>
                )}
              </div>
            </div>
          )}
        </div>

        <div className={styles.accountWrap} ref={accountRef}>
          <button
            className={`${styles.userInfo} ${accountOpen ? styles.userInfoActive : ""}`}
            onClick={handleAccountClick}
            type="button"
            aria-expanded={accountOpen}
            aria-haspopup="menu"
          >
            <div className={styles.avatar}>
              {avatarUrl ? <img src={avatarUrl} alt="" /> : initials}
            </div>
            <div className={styles.userName}>{user?.name}</div>
            <ChevronIcon />
          </button>

          {accountOpen && (
            <div className={styles.accountMenu} role="menu">
              <div className={styles.accountHeader}>
                <div className={styles.accountAvatar}>
                  {avatarUrl ? <img src={avatarUrl} alt="" /> : initials}
                </div>
                <div>
                  <strong>{user?.name || "MediLink user"}</strong>
                  <span>{user?.email || user?.role || "Account"}</span>
                </div>
              </div>

              <button
                className={styles.accountMenuItem}
                onClick={handleViewProfile}
                role="menuitem"
                type="button"
              >
                <ProfileIcon />
                <span>View Profile</span>
              </button>
              <button
                className={`${styles.accountMenuItem} ${styles.accountMenuDanger}`}
                onClick={handleLogout}
                role="menuitem"
                type="button"
              >
                <LogoutIcon />
                <span>Logout</span>
              </button>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}

function SearchIcon() {
  return (
    <svg width="12" height="12" viewBox="0 0 16 16" fill="none">
      <circle cx="7" cy="7" r="5" stroke="#7A8694" strokeWidth="1.5" />
      <path
        d="M11 11l3 3"
        stroke="#7A8694"
        strokeWidth="1.5"
        strokeLinecap="round"
      />
    </svg>
  );
}

function BellIcon() {
  return (
    <svg width="14" height="14" viewBox="0 0 16 16" fill="none">
      <path
        d="M8 1a5 5 0 015 5c0 3 1 4 2 5H1c1-1 2-2 2-5a5 5 0 015-5z"
        stroke="currentColor"
        strokeWidth="1.3"
      />
      <path
        d="M6.5 13.5a1.5 1.5 0 003 0"
        stroke="currentColor"
        strokeWidth="1.3"
      />
    </svg>
  );
}

function ChevronIcon() {
  return (
    <svg
      width="12"
      height="12"
      viewBox="0 0 16 16"
      fill="none"
      aria-hidden="true"
    >
      <path
        d="M4 6l4 4 4-4"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function ProfileIcon() {
  return (
    <svg
      width="14"
      height="14"
      viewBox="0 0 16 16"
      fill="none"
      aria-hidden="true"
    >
      <circle cx="8" cy="5" r="3" stroke="currentColor" strokeWidth="1.3" />
      <path
        d="M2.5 14c.7-3.2 2.6-5 5.5-5s4.8 1.8 5.5 5"
        stroke="currentColor"
        strokeWidth="1.3"
        strokeLinecap="round"
      />
    </svg>
  );
}

function LogoutIcon() {
  return (
    <svg
      width="14"
      height="14"
      viewBox="0 0 16 16"
      fill="none"
      aria-hidden="true"
    >
      <path
        d="M10 2h2a2 2 0 012 2v8a2 2 0 01-2 2h-2M6 12l4-4m0 0L6 4m4 4H2"
        stroke="currentColor"
        strokeWidth="1.3"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}
