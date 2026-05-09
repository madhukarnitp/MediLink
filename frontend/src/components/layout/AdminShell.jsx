import { useState } from "react";
import { useApp, PAGES } from "../../context/AppContext";
import TopNavbar from "./TopNavbar";
import { adminShellStyles as styles } from "../../styles/tailwindStyles";

const PRIMARY_ITEMS = [
  {
    page: PAGES.ADMIN_DASHBOARD,
    label: "Overview",
    mobileLabel: "Home",
    description: "Platform summary and priorities",
    icon: OverviewIcon,
  },
  {
    page: PAGES.ADMIN_USERS,
    label: "Users",
    mobileLabel: "Users",
    description: "Accounts, access, and verification",
    icon: UsersIcon,
  },
  {
    page: PAGES.ADMIN_DOCTORS,
    label: "Doctors",
    mobileLabel: "Doctors",
    description: "Credential review and status control",
    icon: DoctorIcon,
  },
  {
    page: PAGES.ADMIN_ORDERS,
    label: "Orders",
    mobileLabel: "Orders",
    description: "Fulfilment and payment workflow",
    icon: OrdersIcon,
  },
  {
    page: PAGES.ADMIN_MEDICINES,
    label: "Medicines",
    mobileLabel: "Meds",
    description: "Inventory, stock, and pricing",
    icon: MedicineIcon,
  },
];

const SECONDARY_ITEMS = [
  {
    page: PAGES.PROFILE,
    label: "Profile",
    mobileLabel: "Profile",
    description: "Admin account details",
    icon: ProfileIcon,
  },
];

export default function AdminShell({ children }) {
  const { activePage, logout, navigate, user } = useApp();
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const effectiveCollapsed = sidebarCollapsed;
  const mobileNavItems = [...PRIMARY_ITEMS, ...SECONDARY_ITEMS];

  const initials =
    user?.name
      ?.split(" ")
      .filter(Boolean)
      .map((part) => part[0])
      .join("")
      .toUpperCase()
      .slice(0, 2) || "AD";

  const renderNavItem = ({ page, label, description, icon: Icon }) => {
    const isActive = activePage === page;

    return (
      <button
        key={page}
        className={`${styles.navItem} ${isActive ? styles.active : ""}`}
        onClick={() => navigate(page)}
        type="button"
        aria-current={isActive ? "page" : undefined}
      >
        <span className={styles.navIcon}>
          <Icon />
        </span>
        {!effectiveCollapsed && (
          <span className={styles.navCopy}>
            <span className={styles.navLabel}>{label}</span>
            <span className={styles.navMeta}>{description}</span>
          </span>
        )}
      </button>
    );
  };

  const renderBottomNavItem = ({ page, label, mobileLabel, icon: Icon }) => {
    const isActive = activePage === page;

    return (
      <button
        key={`mobile-${page}`}
        className={`${styles.bottomNavItem} ${isActive ? styles.bottomNavActive : ""}`}
        onClick={() => navigate(page)}
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
  };

  return (
    <div className={`${styles.shell} admin-dark`}>
      <TopNavbar />
      <div className={styles.workspace}>
        <aside
          className={`${styles.sidebar} ${effectiveCollapsed ? styles.collapsed : ""}`}
        >
          <div className={styles.sidebarHeader}>
            <div className={styles.identityBlock}>
              <div className={styles.identityAvatar}>{initials}</div>
              {!effectiveCollapsed && (
                <div className={styles.identityCopy}>
                  <strong>Admin workspace</strong>
                  <span>{user?.email || "Administrator"}</span>
                </div>
              )}
            </div>
            <button
              className={styles.collapseBtn}
              onClick={() => setSidebarCollapsed((current) => !current)}
              type="button"
              aria-label={sidebarCollapsed ? "Expand sidebar" : "Collapse sidebar"}
            >
              <CollapseIcon collapsed={effectiveCollapsed} />
            </button>
            <button
              className={styles.mobileCloseButton}
              onClick={() => setSidebarCollapsed(false)}
              type="button"
              aria-label="Close admin menu"
            >
              <MenuIcon open />
            </button>
          </div>

          <div className={styles.sidebarBody}>
            <div className={styles.navSection}>
              {!effectiveCollapsed && <span className={styles.sectionLabel}>Operations</span>}
              <nav className={styles.nav}>{PRIMARY_ITEMS.map(renderNavItem)}</nav>
            </div>

            <div className={styles.navSection}>
              {!effectiveCollapsed && <span className={styles.sectionLabel}>Account</span>}
              <nav className={styles.nav}>{SECONDARY_ITEMS.map(renderNavItem)}</nav>
            </div>
          </div>

          <div className={styles.sidebarFooter}>
            {!effectiveCollapsed && (
              <div className={styles.footerCard}>
                <span className={styles.footerLabel}>Signed in as</span>
                <strong>{user?.name || "Administrator"}</strong>
                <span className={styles.adminRolePill}>
                  {user?.role === "admin" ? "Administrator" : user?.role || "admin"}
                </span>
              </div>
            )}
            <button className={styles.logoutButton} onClick={logout} type="button">
              <span className={styles.navIcon}>
                <LogoutIcon />
              </span>
              {!effectiveCollapsed && <span className={styles.navLabel}>Logout</span>}
            </button>
          </div>
        </aside>

        <main className={`${styles.main} ${effectiveCollapsed ? styles.mainExpanded : ""}`}>
          <div className={styles.content}>{children}</div>
        </main>

        <nav className={styles.bottomNav} aria-label="Admin mobile navigation">
          <div className={styles.bottomNavScroller}>
            {mobileNavItems.map(renderBottomNavItem)}
          </div>
        </nav>
      </div>
    </div>
  );
}

function OverviewIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 20 20" fill="none" aria-hidden="true">
      <path
        d="M3 11.5L7.2 7.3l3 3L17 3.5"
        stroke="currentColor"
        strokeWidth="1.7"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M13.5 3.5H17v3.5"
        stroke="currentColor"
        strokeWidth="1.7"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M3 16.5h14"
        stroke="currentColor"
        strokeWidth="1.7"
        strokeLinecap="round"
      />
    </svg>
  );
}

function UsersIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 20 20" fill="none" aria-hidden="true">
      <circle cx="7" cy="7" r="3" stroke="currentColor" strokeWidth="1.6" />
      <path
        d="M2.8 16c.6-2.6 2.6-4 4.2-4s3.6 1.4 4.2 4"
        stroke="currentColor"
        strokeWidth="1.6"
        strokeLinecap="round"
      />
      <circle cx="14.4" cy="7.3" r="2.2" stroke="currentColor" strokeWidth="1.6" />
      <path
        d="M12.3 15.7c.4-1.7 1.7-2.7 3-2.7 1.1 0 2.2.7 2.8 1.9"
        stroke="currentColor"
        strokeWidth="1.6"
        strokeLinecap="round"
      />
    </svg>
  );
}

function DoctorIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 20 20" fill="none" aria-hidden="true">
      <circle cx="10" cy="5.8" r="3" stroke="currentColor" strokeWidth="1.6" />
      <path
        d="M4.6 16.2c.8-3 3-4.6 5.4-4.6s4.6 1.6 5.4 4.6"
        stroke="currentColor"
        strokeWidth="1.6"
        strokeLinecap="round"
      />
      <path
        d="M15.8 3.2v4M13.8 5.2h4"
        stroke="currentColor"
        strokeWidth="1.6"
        strokeLinecap="round"
      />
    </svg>
  );
}

function OrdersIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 20 20" fill="none" aria-hidden="true">
      <path
        d="M4 6.5h12v8.2A1.3 1.3 0 0 1 14.7 16H5.3A1.3 1.3 0 0 1 4 14.7V6.5Z"
        stroke="currentColor"
        strokeWidth="1.6"
      />
      <path
        d="M6.5 6.5V4.8A1.8 1.8 0 0 1 8.3 3h3.4a1.8 1.8 0 0 1 1.8 1.8v1.7"
        stroke="currentColor"
        strokeWidth="1.6"
      />
      <path
        d="M4 9.5h12"
        stroke="currentColor"
        strokeWidth="1.6"
        strokeLinecap="round"
      />
    </svg>
  );
}

function MedicineIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 20 20" fill="none" aria-hidden="true">
      <path
        d="M7.2 5.2a2.8 2.8 0 1 1 4 4l-4 4a2.8 2.8 0 0 1-4-4l4-4Z"
        stroke="currentColor"
        strokeWidth="1.6"
      />
      <path
        d="M8.8 7.6l3.6 3.6"
        stroke="currentColor"
        strokeWidth="1.6"
        strokeLinecap="round"
      />
      <path
        d="M12.6 4.8 15.2 2.2a2.6 2.6 0 1 1 3.7 3.7l-2.6 2.6"
        stroke="currentColor"
        strokeWidth="1.6"
      />
    </svg>
  );
}

function ProfileIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 20 20" fill="none" aria-hidden="true">
      <circle cx="10" cy="6.2" r="3.2" stroke="currentColor" strokeWidth="1.6" />
      <path
        d="M4.5 16c.7-3 2.9-4.7 5.5-4.7s4.8 1.7 5.5 4.7"
        stroke="currentColor"
        strokeWidth="1.6"
        strokeLinecap="round"
      />
    </svg>
  );
}

function LogoutIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 20 20" fill="none" aria-hidden="true">
      <path
        d="M12.5 4H15a2 2 0 0 1 2 2v8a2 2 0 0 1-2 2h-2.5"
        stroke="currentColor"
        strokeWidth="1.6"
        strokeLinecap="round"
      />
      <path
        d="M8 13.5 11.5 10 8 6.5M11.5 10H3"
        stroke="currentColor"
        strokeWidth="1.6"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function CollapseIcon({ collapsed }) {
  return (
    <svg width="18" height="18" viewBox="0 0 20 20" fill="none" aria-hidden="true">
      <path
        d={collapsed ? "M8 5l4 5-4 5" : "M12 5 8 10l4 5"}
        stroke="currentColor"
        strokeWidth="1.6"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function MenuIcon({ open = false }) {
  if (open) {
    return (
      <svg width="18" height="18" viewBox="0 0 20 20" fill="none" aria-hidden="true">
        <path
          d="M5 5l10 10M15 5 5 15"
          stroke="currentColor"
          strokeWidth="1.8"
          strokeLinecap="round"
        />
      </svg>
    );
  }

  return (
    <svg width="18" height="18" viewBox="0 0 20 20" fill="none" aria-hidden="true">
      <path
        d="M4 6h12M4 10h12M4 14h12"
        stroke="currentColor"
        strokeWidth="1.6"
        strokeLinecap="round"
      />
    </svg>
  );
}
