import { useEffect, useState } from "react";
import { admin as adminApi } from "../../services/api";
import {
  Button,
  EmptyState,
  ErrorMsg,
  FilterBar,
  InlineSkeleton,
  PageHeader,
  PageSkeleton,
  SearchField,
  SegmentedFilter,
  StatusPill,
} from "../../components/ui/UI";
import { adminDashboardStyles as styles } from "../../styles/tailwindStyles";

const ACCOUNT_FILTERS = ["all", "active", "blocked", "pending"];

export default function AdminDoctors() {
  const [users, setUsers] = useState([]);
  const [query, setQuery] = useState("");
  const [accountFilter, setAccountFilter] = useState("all");
  const [selectedUser, setSelectedUser] = useState(null);
  const [detailsLoading, setDetailsLoading] = useState(false);
  const [loading, setLoading] = useState(true);
  const [savingId, setSavingId] = useState("");
  const [error, setError] = useState("");

  const load = async () => {
    setLoading(true);
    setError("");
    try {
      const usersRes = await adminApi.getUsers({ limit: 100 });
      setUsers(usersRes.data?.users || usersRes.data || []);
    } catch (e) {
      setError(e.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    load();
  }, []);

  const verifyDoctor = async (userId, verified) => {
    setSavingId(userId);
    try {
      await adminApi.verifyDoctor(userId, verified);
      await load();
      if (selectedUser?.user?._id === userId || selectedUser?._id === userId) {
        await viewUser(userId);
      }
    } catch (e) {
      setError(e.message || "Could not update doctor verification");
    } finally {
      setSavingId("");
    }
  };

  const viewUser = async (userId) => {
    setDetailsLoading(true);
    setError("");
    try {
      const response = await adminApi.getUserById(userId);
      setSelectedUser(response.data);
    } catch (e) {
      setError(e.message || "Could not load user details");
    } finally {
      setDetailsLoading(false);
    }
  };

  const updateUserStatus = async (userId, status) => {
    setSavingId(userId);
    try {
      await adminApi.updateUserStatus(userId, status);
      await load();
    } catch (e) {
      setError(e.message);
    } finally {
      setSavingId("");
    }
  };

  if (loading) {
    return (
      <div className={styles.page}>
        <PageSkeleton />
      </div>
    );
  }

  const doctorUsers = users.filter((item) => item.role === "doctor");
  const filteredUsers = filterUsers(doctorUsers, {
    accountFilter,
    query,
  });

  return (
    <div className={styles.page}>
      <PageHeader
        eyebrow="Doctor Management"
        title="Doctor Administration"
        subtitle="Review doctor credentials, manage verification status, and oversee medical professionals."
        actions={
          <Button variant="outline" onClick={load}>
            Refresh
          </Button>
        }
      />

      {error && <ErrorMsg message={error} onRetry={load} />}

      <FilterBar>
        <SearchField
          value={query}
          onChange={setQuery}
          placeholder="Name, email, specialization, reg. no..."
        />
        <SegmentedFilter
          value={accountFilter}
          onChange={setAccountFilter}
          options={ACCOUNT_FILTERS.map((filter) => ({
            value: filter,
            label: filter === "pending" ? "Need admin approval" : filter,
          }))}
        />
      </FilterBar>

      <section className={styles.sectionCard}>
        <div className={styles.tableWrap}>
          <table className={styles.table}>
            <thead>
              <tr>
                <th>Doctor</th>
                <th>Specialization</th>
                <th>Verification</th>
                <th>Status</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredUsers.length === 0 ? (
                <tr>
                  <td colSpan="5" className={styles.empty}>
                    <EmptyState
                      title={doctorUsers.length === 0 ? "No doctors found" : "No doctors match the filters"}
                      subtitle="Clear search or switch filters to review professional accounts."
                      action="Show all doctors"
                      onAction={() => {
                        setQuery("");
                        setAccountFilter("all");
                      }}
                    />
                  </td>
                </tr>
              ) : (
                filteredUsers.map((item) => (
                  <DoctorRow
                    item={item}
                    key={item._id || item.id || item.email}
                    onStatus={updateUserStatus}
                    onView={viewUser}
                    onVerifyDoctor={verifyDoctor}
                    saving={savingId === (item._id || item.id)}
                  />
                ))
              )}
            </tbody>
          </table>
        </div>
      </section>

      {(selectedUser || detailsLoading) && (
        <UserDetailsPanel
          data={selectedUser}
          loading={detailsLoading}
          onClose={() => setSelectedUser(null)}
          onVerifyDoctor={verifyDoctor}
          savingId={savingId}
        />
      )}
    </div>
  );
}

function DoctorRow({
  item,
  onStatus,
  onVerifyDoctor,
  onView,
  saving,
}) {
  const id = item._id || item.id;
  const doctorVerified = item.profile?.isVerified;
  const status =
    item.status || (item.isActive === false ? "blocked" : "active");

  return (
    <tr>
      <td>
        <div className={styles.userCell}>
          <div className={styles.avatar}>{getInitials(item.name)}</div>
          <div>
            <div className={styles.name}>{item.name || "Unnamed doctor"}</div>
            <div className={styles.meta}>
              {item.profile?.regNo || "No reg. no."} · {item.email}
            </div>
          </div>
        </div>
      </td>
      <td>
        <span className={styles.rolePill}>
          {item.profile?.specialization || "General Medicine"}
        </span>
      </td>
      <td>
        <StatusPill status={doctorVerified ? "verified" : "pending"}>
          {doctorVerified ? "Verified" : "Need admin approval"}
        </StatusPill>
      </td>
      <td>
        <StatusPill status={status === "active" ? "active" : "blocked"}>
          {status}
        </StatusPill>
      </td>
      <td>
        <div className={styles.rowActions}>
          <button disabled={saving} onClick={() => onView(id)} type="button">
            Details
          </button>
          <button
            disabled={saving}
            onClick={() => onVerifyDoctor(id, !doctorVerified)}
            type="button"
          >
            {doctorVerified ? "Unverify" : "Verify"}
          </button>
          <button
            disabled={saving}
            onClick={() =>
              onStatus(id, status === "active" ? "blocked" : "active")
            }
            type="button"
          >
            {status === "active" ? "Block" : "Activate"}
          </button>
        </div>
      </td>
    </tr>
  );
}

function UserDetailsPanel({
  data,
  loading,
  onClose,
  onVerifyDoctor,
  savingId,
}) {
  const user = data?.user || data;
  const profile = data?.profile || null;
  const userId = user?._id || user?.id;
  const doctorVerified = Boolean(profile?.isVerified);

  return (
    <div className={styles.modalBackdrop} role="presentation">
      <aside className={styles.detailsPanel} role="dialog" aria-modal="true">
        <div className={styles.detailsHeader}>
          <div>
            <h2>Doctor Details</h2>
            <p>Complete doctor profile and credentials.</p>
          </div>
          <button className={styles.closeBtn} onClick={onClose} type="button">
            Close
          </button>
        </div>

        {loading ? (
          <InlineSkeleton className="min-h-[240px]" lines={6} showAvatar />
        ) : (
          <>
            <div className={styles.detailsHero}>
              <div className={styles.avatar}>{getInitials(user?.name)}</div>
              <div>
                <h3>{user?.name || "Unnamed doctor"}</h3>
                <p>{user?.email || "No email"}</p>
              </div>
            </div>

            <DetailGrid
              title="Account"
              items={[
                ["Role", user?.role],
                ["Phone", user?.phone],
                ["Email verified", yesNo(user?.isEmailVerified)],
                ["Status", user?.isActive === false ? "Blocked" : "Active"],
                ["Joined", formatDateTime(user?.createdAt)],
                ["Last seen", formatDateTime(user?.lastSeen)],
              ]}
            />

            {profile && (
              <DetailGrid
                title="Doctor Profile"
                items={[
                  ["Specialization", profile.specialization],
                  ["Qualification", profile.qualification],
                  ["Registration No.", profile.regNo],
                  ["Experience", profile.experience ? `${profile.experience} years` : "0 years"],
                  ["Consultation fee", profile.price ? `₹${profile.price}` : "₹0"],
                  ["Doctor verified", yesNo(profile.isVerified)],
                  ["Online", yesNo(profile.online)],
                  ["Rating", profile.rating ? `${profile.rating} (${profile.ratingCount || 0} reviews)` : "No ratings"],
                  ["Consultations", profile.consultationCount],
                  ["Hospital", formatHospital(profile.hospital)],
                  ["Languages", profile.languages?.join(", ")],
                  ["Bio", profile.bio],
                ]}
              />
            )}

            <div className={styles.verifyBox}>
              <div>
                <strong>Doctor verification</strong>
                <span>
                  {doctorVerified
                    ? "This doctor is approved to appear as verified."
                    : "Review registration details before approving."}
                </span>
              </div>
              <Button
                variant={doctorVerified ? "outline" : "primary"}
                disabled={savingId === userId}
                onClick={() => onVerifyDoctor(userId, !doctorVerified)}
              >
                {doctorVerified ? "Unverify Doctor" : "Verify Doctor"}
              </Button>
            </div>
          </>
        )}
      </aside>
    </div>
  );
}

function DetailGrid({ title, items }) {
  return (
    <section className={styles.detailSection}>
      <h3>{title}</h3>
      <div className={styles.detailGrid}>
        {items.map(([label, value]) => (
          <div className={styles.detailItem} key={label}>
            <span>{label}</span>
            <strong>{formatValue(value)}</strong>
          </div>
        ))}
      </div>
    </section>
  );
}

function filterUsers(users, { accountFilter, query }) {
  const needle = query.trim().toLowerCase();

  return users.filter((user) => {
    const status = user.isActive === false ? "blocked" : "active";
    const doctorVerified = user.profile?.isVerified;
    const matchesStatus =
      accountFilter === "all" ||
      status === accountFilter ||
      (accountFilter === "pending" && !doctorVerified);
    const searchable = [
      user.name,
      user.email,
      user.phone,
      user.profile?.specialization,
      user.profile?.regNo,
      user.profile?.qualification,
    ]
      .filter(Boolean)
      .join(" ")
      .toLowerCase();

    return matchesStatus && (!needle || searchable.includes(needle));
  });
}

function formatValue(value) {
  if (value === undefined || value === null || value === "") return "Not provided";
  if (typeof value === "boolean") return yesNo(value);
  return String(value);
}

function yesNo(value) {
  return value ? "Yes" : "No";
}

function formatHospital(hospital) {
  if (!hospital) return "";
  return [hospital.name, hospital.city, hospital.state].filter(Boolean).join(", ");
}

function formatDateTime(value) {
  if (!value) return "";
  return new Date(value).toLocaleString("en-IN", {
    day: "numeric",
    month: "short",
    year: "numeric",
    hour: "numeric",
    minute: "2-digit",
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
