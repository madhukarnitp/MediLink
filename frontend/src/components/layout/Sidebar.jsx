import { useEffect, useRef } from "react";
import { useApp, PAGES } from "../../context/AppContext";
import { sidebarStyles as styles } from "../../styles/tailwindStyles";

const PATIENT_NAV_ITEMS = [
  {
    page: PAGES.DASHBOARD,
    label: "Dashboard",
    mobileLabel: "Home",
    icon: GridIcon,
  },
  {
    page: PAGES.DOCTORS,
    label: "Consult Doctor",
    mobileLabel: "Doctors",
    icon: UserIcon,
  },
  {
    page: PAGES.CONSULTATION,
    label: "Consultations",
    mobileLabel: "Chat",
    icon: MessageIcon,
  },
  {
    page: PAGES.CONSULTATION_LIST,
    label: "Consultation Records",
    mobileLabel: "History",
    icon: FileIcon,
  },
  {
    page: PAGES.APPOINTMENTS,
    label: "Appointments",
    mobileLabel: "Visits",
    icon: CalendarIcon,
  },
  {
    page: PAGES.PRESCRIPTION_LIST,
    label: "Prescriptions",
    mobileLabel: "Rx",
    icon: FileIcon,
  },
  {
    page: PAGES.RECORDS,
    label: "Health Records",
    mobileLabel: "Files",
    icon: PlusSquareIcon,
  },
  { page: PAGES.ORDERS, label: "Orders", mobileLabel: "Meds", icon: BoxIcon },
];

const DOCTOR_NAV_ITEMS = [
  {
    page: PAGES.DOCTOR_DASHBOARD,
    label: "Dashboard",
    mobileLabel: "Home",
    icon: GridIcon,
  },
  {
    page: PAGES.CREATE_PRESCRIPTION,
    label: "New Prescription",
    mobileLabel: "New Rx",
    icon: PlusIcon,
  },
  {
    page: PAGES.DOCTOR_PATIENTS,
    label: "My Patients",
    mobileLabel: "Patients",
    icon: UserIcon,
  },
  {
    page: PAGES.DOCTOR_PRESCRIPTIONS,
    label: "My Prescriptions",
    mobileLabel: "Rx",
    icon: FileIcon,
  },
  {
    page: PAGES.CONSULTATION_LIST,
    label: "Past Consultations",
    mobileLabel: "History",
    icon: FileIcon,
  },
  {
    page: PAGES.CONSULTATION,
    label: "Consultations",
    mobileLabel: "Chat",
    icon: MessageIcon,
  },
  {
    page: PAGES.APPOINTMENTS,
    label: "Appointments",
    mobileLabel: "Visits",
    icon: CalendarIcon,
  },
];

const ADMIN_NAV_ITEMS = [
  {
    page: PAGES.ADMIN_DASHBOARD,
    label: "Admin Panel",
    mobileLabel: "Admin",
    icon: GridIcon,
  },
];

export default function Sidebar() {
  const { activePage, navigate, user, logout } = useApp();
  const activeItemRef = useRef(null);
  const bottomActiveItemRef = useRef(null);

  const NAV_ITEMS =
    user?.role === "admin"
      ? ADMIN_NAV_ITEMS
      : user?.role === "doctor"
        ? DOCTOR_NAV_ITEMS
        : PATIENT_NAV_ITEMS;
  const showSOS = user?.role === "patient";

  useEffect(() => {
    activeItemRef.current?.scrollIntoView({
      behavior: "smooth",
      block: "nearest",
      inline: "center",
    });
    bottomActiveItemRef.current?.scrollIntoView({
      behavior: "smooth",
      block: "nearest",
      inline: "center",
    });
  }, [activePage]);

  const navigateFromMenu = (page) => {
    navigate(page);
  };

  const logoutFromMenu = () => {
    logout();
  };

  return (
    <>
      <aside className={styles.sidebar}>

      <span className={styles.label}>Menu</span>

      <nav className={styles.nav} aria-label="Main navigation">
        {NAV_ITEMS.map(({ page, label, mobileLabel, icon: Icon }) => {
          const isActive = activePage === page;
          return (
            <button
              key={page}
              ref={isActive ? activeItemRef : null}
              className={`${styles.navItem} ${isActive ? styles.active : ""}`}
              onClick={() => navigateFromMenu(page)}
              type="button"
              aria-current={isActive ? "page" : undefined}
            >
              <span className={styles.navIcon}>
                <Icon />
              </span>
              <span className={styles.navText}>{label}</span>
              <span className={styles.mobileText}>{mobileLabel || label}</span>
            </button>
          );
        })}
      </nav>

      <div className={styles.spacer} />

      {showSOS && (
        <button
          className={`${styles.sosBtn} ${activePage === PAGES.SOS ? styles.sosActive : ""}`}
          onClick={() => navigateFromMenu(PAGES.SOS)}
          type="button"
          aria-current={activePage === PAGES.SOS ? "page" : undefined}
        >
          <span className={styles.sosIconWrap}>
            <span className={styles.sosPulse} />
          </span>
          <span className={styles.navText}>SOS Emergency</span>
          <span className={styles.mobileText}>SOS</span>
        </button>
      )}

      <button className={styles.logoutBtn} onClick={logoutFromMenu} type="button">
        <span className={styles.navIcon}>
          <LogoutIcon />
        </span>
        <span className={styles.navText}>Logout</span>
      </button>
      </aside>

      <nav className={styles.bottomNav} aria-label="Mobile navigation">
        <div className={styles.bottomNavScroller}>
          {NAV_ITEMS.map(({ page, label, mobileLabel, icon: Icon }) => {
            const isActive = activePage === page;

            return (
              <button
                key={`mobile-${page}`}
                ref={isActive ? bottomActiveItemRef : null}
                className={`${styles.bottomNavItem} ${isActive ? styles.bottomNavActive : ""}`}
                onClick={() => navigateFromMenu(page)}
                type="button"
                aria-current={isActive ? "page" : undefined}
                aria-label={label}
              >
                <span className={styles.bottomNavIcon}>
                  <Icon />
                </span>
                <span className={styles.bottomNavText}>{mobileLabel || label}</span>
              </button>
            );
          })}

          {showSOS && (
            <button
              ref={activePage === PAGES.SOS ? bottomActiveItemRef : null}
              className={`${styles.bottomNavItem} ${styles.bottomSosItem} ${
                activePage === PAGES.SOS ? styles.bottomSosActive : ""
              }`}
              onClick={() => navigateFromMenu(PAGES.SOS)}
              type="button"
              aria-current={activePage === PAGES.SOS ? "page" : undefined}
              aria-label="SOS Emergency"
            >
              <span className={styles.bottomNavIcon}>
                <span className={styles.sosPulse} />
              </span>
              <span className={styles.bottomNavText}>SOS</span>
            </button>
          )}
        </div>
      </nav>
    </>
  );
}

function GridIcon() {
  return (
    <svg width="14" height="14" viewBox="0 0 16 16" fill="none">
      <rect
        x="1"
        y="1"
        width="6"
        height="6"
        rx="1.5"
        stroke="currentColor"
        strokeWidth="1.3"
      />
      <rect
        x="9"
        y="1"
        width="6"
        height="6"
        rx="1.5"
        stroke="currentColor"
        strokeWidth="1.3"
      />
      <rect
        x="1"
        y="9"
        width="6"
        height="6"
        rx="1.5"
        stroke="currentColor"
        strokeWidth="1.3"
      />
      <rect
        x="9"
        y="9"
        width="6"
        height="6"
        rx="1.5"
        stroke="currentColor"
        strokeWidth="1.3"
      />
    </svg>
  );
}
function MessageIcon() {
  return (
    <svg width="14" height="14" viewBox="0 0 16 16" fill="none">
      <path
        d="M14.5 4.5v5c0 1.1-.9 2-2 2h-1.5l-3 3-3-3h-1.5c-1.1 0-2-.9-2-2v-5c0-1.1.9-2 2-2h9c1.1 0 2 .9 2 2z"
        stroke="currentColor"
        strokeWidth="1.3"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}
function UserIcon() {
  return (
    <svg width="14" height="14" viewBox="0 0 16 16" fill="none">
      <circle cx="8" cy="5" r="3" stroke="currentColor" strokeWidth="1.3" />
      <path
        d="M2 14c0-3.3 2.7-6 6-6s6 2.7 6 6"
        stroke="currentColor"
        strokeWidth="1.3"
        strokeLinecap="round"
      />
    </svg>
  );
}
function FileIcon() {
  return (
    <svg width="14" height="14" viewBox="0 0 16 16" fill="none">
      <rect
        x="2"
        y="1"
        width="12"
        height="14"
        rx="2"
        stroke="currentColor"
        strokeWidth="1.3"
      />
      <path
        d="M5 6h6M5 9h4"
        stroke="currentColor"
        strokeWidth="1.3"
        strokeLinecap="round"
      />
    </svg>
  );
}
function PlusSquareIcon() {
  return (
    <svg width="14" height="14" viewBox="0 0 16 16" fill="none">
      <path
        d="M3 2h10a1 1 0 011 1v10a1 1 0 01-1 1H3a1 1 0 01-1-1V3a1 1 0 011-1z"
        stroke="currentColor"
        strokeWidth="1.3"
      />
      <path
        d="M8 5v6M5 8h6"
        stroke="currentColor"
        strokeWidth="1.3"
        strokeLinecap="round"
      />
    </svg>
  );
}
function BoxIcon() {
  return (
    <svg width="14" height="14" viewBox="0 0 16 16" fill="none">
      <path
        d="M2 4h12v8a2 2 0 01-2 2H4a2 2 0 01-2-2V4z"
        stroke="currentColor"
        strokeWidth="1.3"
      />
      <path d="M5 4V2h6v2" stroke="currentColor" strokeWidth="1.3" />
    </svg>
  );
}
function PlusIcon() {
  return (
    <svg width="14" height="14" viewBox="0 0 16 16" fill="none">
      <path
        d="M8 2v12M2 8h12"
        stroke="currentColor"
        strokeWidth="1.3"
        strokeLinecap="round"
      />
    </svg>
  );
}
function CalendarIcon() {
  return (
    <svg width="14" height="14" viewBox="0 0 16 16" fill="none">
      <rect
        x="2"
        y="3"
        width="12"
        height="11"
        rx="2"
        stroke="currentColor"
        strokeWidth="1.3"
      />
      <path
        d="M5 1.8v2.4M11 1.8v2.4M2 6h12"
        stroke="currentColor"
        strokeWidth="1.3"
        strokeLinecap="round"
      />
    </svg>
  );
}
function LogoutIcon() {
  return (
    <svg width="14" height="14" viewBox="0 0 16 16" fill="none">
      <path
        d="M10 2H12a2 2 0 012 2v8a2 2 0 01-2 2h-2M6 12l4-4m0 0l-4-4"
        stroke="currentColor"
        strokeWidth="1.3"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}
