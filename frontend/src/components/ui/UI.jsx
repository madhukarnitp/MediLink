import { uiStyles as styles } from "../../styles/tailwindStyles";

/* ── Badge ─────────────────────────────────────── */
export function Badge({ type = "default", children }) {
  return (
    <span className={`${styles.badge} ${styles[`badge_${type}`]}`}>
      {children}
    </span>
  );
}

/* ── StatusBadge (online / offline) ────────────── */
export function StatusBadge({ online }) {
  return (
    <span
      className={`${styles.statusBadge} ${online ? styles.online : styles.offline}`}
    >
      <span className={styles.statusDot} />
      {online ? "Online" : "Offline"}
    </span>
  );
}

/* ── Avatar / Initials circle ───────────────────── */
export function Avatar({ initials, color = "#1D72F3", size = 38 }) {
  return (
    <div
      className={styles.avatar}
      style={{
        width: size,
        height: size,
        color,
        fontSize: size * 0.34,
        borderRadius: size * 0.26,
      }}
    >
      {initials}
    </div>
  );
}

/* ── Button variants ────────────────────────────── */
export function Button({
  variant = "primary",
  onClick,
  disabled,
  children,
  fullWidth,
  className = "",
  type,
}) {
  return (
    <button
      className={`${styles.btn} ${styles[`btn_${variant}`]} ${fullWidth ? styles.fullWidth : ""} ${className}`}
      onClick={onClick}
      disabled={disabled}
      type={type}
    >
      {children}
    </button>
  );
}

/* ── Stat Card ──────────────────────────────────── */
export function StatCard({ label, value, sub, color, positive }) {
  return (
    <div className={styles.statCard}>
      <div className={styles.statLabel}>{label}</div>
      <div className={styles.statValue} style={{ color }}>
        {value}
      </div>
      <div
        className={`${styles.statSub} ${
          positive === true
            ? styles.statUp
            : positive === false
              ? styles.statDown
              : ""
        }`}
      >
        {sub}
      </div>
    </div>
  );
}

/* ── Section Header ─────────────────────────────── */
export function SectionHeader({ title, action, onAction }) {
  return (
    <div className={styles.sectionHeader}>
      <h2 className={styles.sectionTitle}>{title}</h2>
      {action && (
        <span className={styles.sectionAction} onClick={onAction}>
          {action}
        </span>
      )}
    </div>
  );
}

/* ── Icon Button ────────────────────────────────── */
export function IconBtn({
  children,
  badge,
  onClick,
  title,
  ariaLabel,
  active,
  className = "",
}) {
  return (
    <button
      type="button"
      className={`${styles.iconBtn} ${active ? styles.iconBtnActive : ""} ${className}`}
      onClick={onClick}
      title={title}
      aria-label={ariaLabel || title}
    >
      {children}
      {badge && <span className={styles.iconBadge} />}
    </button>
  );
}

export function Spinner({ size = 28 }) {
  return (
    <div
      className={styles.spinner}
      style={{
        width: size,
        height: size,
        borderWidth: Math.max(2, size * 0.1),
      }}
    />
  );
}

export function PageHeader({
  eyebrow,
  title,
  subtitle,
  actions,
  className = "",
}) {
  return (
    <div className={`${styles.pageHeader} ${className}`}>
      <div className={styles.pageHeaderCopy}>
        {eyebrow ? <span>{eyebrow}</span> : null}
        <h1>{title}</h1>
        {subtitle ? <p>{subtitle}</p> : null}
      </div>
      {actions ? <div className={styles.pageHeaderActions}>{actions}</div> : null}
    </div>
  );
}

export function FilterBar({ children, className = "" }) {
  return <div className={`${styles.filterBar} ${className}`}>{children}</div>;
}

export function FilterSelect({ label, value, onChange, children, className = "" }) {
  return (
    <label className={`${styles.filterSelect} ${className}`}>
      {label ? <span>{label}</span> : null}
      <select value={value} onChange={(event) => onChange(event.target.value)}>
        {children}
      </select>
    </label>
  );
}

export function SearchField({
  label = "Search",
  value,
  onChange,
  placeholder = "Search...",
  className = "",
}) {
  return (
    <label className={`${styles.searchField} ${className}`}>
      <span>{label}</span>
      <input
        value={value}
        onChange={(event) => onChange(event.target.value)}
        placeholder={placeholder}
        type="search"
      />
      {value ? (
        <button
          aria-label={`Clear ${label.toLowerCase()}`}
          onClick={() => onChange("")}
          type="button"
        >
          Clear
        </button>
      ) : null}
    </label>
  );
}

export function SegmentedFilter({ options, value, onChange, className = "" }) {
  return (
    <div className={`${styles.segmentedFilter} ${className}`}>
      {options.map((option) => {
        const id = option.value ?? option;
        const label = option.label ?? option;
        const meta = option.meta;
        const active = value === id;
        return (
          <button
            className={`${styles.segmentedButton} ${active ? styles.segmentedButtonActive : ""}`}
            key={id}
            onClick={() => onChange(id)}
            type="button"
          >
            <span>{label}</span>
            {meta !== undefined ? <strong>{meta}</strong> : null}
          </button>
        );
      })}
    </div>
  );
}

export function BinaryFilter({
  checked,
  disabled = false,
  label,
  offLabel,
  onChange,
  className = "",
}) {
  return (
    <button
      aria-pressed={checked}
      disabled={disabled}
      className={`${styles.binaryFilter} ${checked ? styles.binaryFilterActive : ""} ${className}`}
      onClick={() => onChange(!checked)}
      type="button"
    >
      <span className={`${styles.binaryTrack} ${checked ? styles.binaryTrackActive : ""}`}>
        <span className={`${styles.binaryKnob} ${checked ? styles.binaryKnobOn : ""}`} />
      </span>
      <span>{checked ? label : offLabel || label}</span>
    </button>
  );
}

export function StatusPill({ status = "default", children, className = "" }) {
  const key = String(status || "default").toLowerCase();
  return (
    <span className={`${styles.statusPill} ${styles[`statusPill_${key}`] || styles.statusPill_default} ${className}`}>
      {children || key.replaceAll("_", " ")}
    </span>
  );
}

export function FormSection({
  eyebrow,
  title,
  subtitle,
  complete,
  children,
  className = "",
}) {
  return (
    <section className={`${styles.formSection} ${className}`}>
      <div className={styles.formSectionHeader}>
        <div>
          {eyebrow ? <span>{eyebrow}</span> : null}
          <h2>{title}</h2>
          {subtitle ? <p>{subtitle}</p> : null}
        </div>
        {complete !== undefined ? (
          <StatusPill status={complete ? "success" : "warning"}>
            {complete ? "Complete" : "Needs details"}
          </StatusPill>
        ) : null}
      </div>
      <div className={styles.formSectionBody}>{children}</div>
    </section>
  );
}

export function SummaryCard({
  eyebrow,
  title,
  value,
  subtitle,
  action,
  onAction,
  tone = "default",
  children,
  className = "",
}) {
  return (
    <article className={`${styles.summaryCard} ${styles[`summaryCard_${tone}`] || ""} ${className}`}>
      <div className={styles.summaryCardTop}>
        <div className="min-w-0">
          {eyebrow ? <span>{eyebrow}</span> : null}
          <h3>{title}</h3>
          {subtitle ? <p>{subtitle}</p> : null}
        </div>
        {value ? <strong>{value}</strong> : null}
      </div>
      {children ? <div className={styles.summaryCardBody}>{children}</div> : null}
      {action ? (
        <Button variant="outline" onClick={onAction}>
          {action}
        </Button>
      ) : null}
    </article>
  );
}

export function DetailDrawer({
  eyebrow,
  title,
  subtitle,
  children,
  footer,
  onClose,
  className = "",
}) {
  return (
    <ModalPanel
      className={`max-w-3xl ${className}`}
      eyebrow={eyebrow}
      title={title}
      subtitle={subtitle}
      footer={footer}
      onClose={onClose}
    >
      {children}
    </ModalPanel>
  );
}

export function DataTable({ columns, rows, empty, getRowKey, className = "" }) {
  return (
    <div className={`${styles.dataTableWrap} ${className}`}>
      <table className={styles.dataTable}>
        <thead>
          <tr>
            {columns.map((column) => (
              <th key={column.key || column.header}>{column.header}</th>
            ))}
          </tr>
        </thead>
        <tbody>
          {rows.length === 0 ? (
            <tr>
              <td colSpan={columns.length}>{empty}</td>
            </tr>
          ) : (
            rows.map((row, index) => (
              <tr key={getRowKey ? getRowKey(row) : row._id || row.id || index}>
                {columns.map((column) => (
                  <td key={column.key || column.header}>
                    {column.render ? column.render(row) : row[column.key]}
                  </td>
                ))}
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  );
}

export function StepProgress({ steps, activeStep, className = "" }) {
  return (
    <div className={`${styles.stepProgress} ${className}`}>
      {steps.map((step, index) => {
        const id = step.id ?? index + 1;
        const active = id === activeStep || index + 1 === activeStep;
        const done = Number(activeStep) > index + 1;
        return (
          <div
            className={`${styles.stepItem} ${active ? styles.stepActive : ""} ${done ? styles.stepDone : ""}`}
            key={id}
          >
            <span>{done ? "✓" : index + 1}</span>
            <strong>{step.label || step}</strong>
          </div>
        );
      })}
    </div>
  );
}

export function ModalPanel({
  eyebrow,
  title,
  subtitle,
  children,
  footer,
  onClose,
  closeLabel = "Close",
  staticBackdrop = true,
  className = "",
}) {
  const handleBackdropClick = (event) => {
    if (!staticBackdrop && event.target === event.currentTarget) onClose?.();
  };

  return (
    <div className={styles.panelBackdrop} onClick={handleBackdropClick} role="presentation">
      <section className={`${styles.panelModal} ${className}`} role="dialog" aria-modal="true">
        <div className={styles.panelHeader}>
          <div className={styles.panelTitle}>
            {eyebrow ? <span>{eyebrow}</span> : null}
            <h2>{title}</h2>
            {subtitle ? <p>{subtitle}</p> : null}
          </div>
          {onClose ? (
            <button className={styles.panelClose} onClick={onClose} type="button">
              {closeLabel}
            </button>
          ) : null}
        </div>
        <div className={styles.panelBody}>{children}</div>
        {footer ? <div className={styles.panelFooter}>{footer}</div> : null}
      </section>
    </div>
  );
}

export function MobileActionBar({ children, className = "" }) {
  return <div className={`${styles.mobileActionBar} ${className}`}>{children}</div>;
}

export function SkeletonBlock({ className = "" }) {
  return <div aria-hidden="true" className={`med-skeleton-block ${className}`} />;
}

export function InlineSkeleton({
  className = "",
  lines = 4,
  showAvatar = false,
}) {
  return (
    <div
      aria-hidden="true"
      className={`med-skeleton-panel flex min-w-0 flex-col gap-3 p-4 ${className}`}
    >
      <div className="flex items-center gap-3">
        {showAvatar ? <SkeletonBlock className="h-11 w-11 shrink-0 rounded-med" /> : null}
        <div className="flex min-w-0 flex-1 flex-col gap-2">
          <SkeletonBlock className="h-4 w-32 max-w-[45%]" />
          <SkeletonBlock className="h-3 w-48 max-w-[65%]" />
        </div>
      </div>
      <div className="flex flex-col gap-2">
        {Array.from({ length: lines }).map((_, index) => (
          <SkeletonBlock
            className={`h-3 ${index === lines - 1 ? "w-2/3" : "w-full"}`}
            key={index}
          />
        ))}
      </div>
    </div>
  );
}

export function PageSkeleton({ className = "" }) {
  return (
    <div
      aria-hidden="true"
      className={`med-skeleton-page flex w-full min-w-0 flex-col gap-4 ${className}`}
    >
      <div className="med-skeleton-panel p-5 max-[560px]:p-4">
        <SkeletonBlock className="mb-3 h-3 w-24 max-w-[30%]" />
        <SkeletonBlock className="mb-3 h-8 w-full max-w-[320px]" />
        <SkeletonBlock className="h-4 w-full max-w-[640px]" />
        <SkeletonBlock className="mt-2 h-4 w-4/5 max-w-[480px]" />
      </div>

      <div className="grid min-w-0 grid-cols-1 gap-3 sm:grid-cols-2 xl:grid-cols-3">
        {Array.from({ length: 3 }).map((_, index) => (
          <div className="med-skeleton-panel p-4" key={index}>
            <SkeletonBlock className="h-3 w-20" />
            <SkeletonBlock className="mt-3 h-9 w-24" />
            <SkeletonBlock className="mt-4 h-3 w-28" />
          </div>
        ))}
      </div>

      <div className="grid min-w-0 grid-cols-1 gap-3 xl:grid-cols-[minmax(0,1.45fr)_minmax(280px,0.85fr)]">
        <InlineSkeleton className="min-h-[320px]" lines={6} showAvatar />
        <div className="flex min-w-0 flex-col gap-3">
          <InlineSkeleton className="min-h-[150px]" lines={3} />
          <InlineSkeleton className="min-h-[150px]" lines={4} />
        </div>
      </div>
    </div>
  );
}

export function FullPageSkeleton() {
  return (
    <div className="min-h-screen bg-[var(--bg)] px-4 py-4 sm:px-5">
      <div className="mx-auto flex w-full max-w-[var(--main-content-max)] min-w-0">
        <PageSkeleton className="min-h-[calc(100vh-2rem)]" />
      </div>
    </div>
  );
}

export function ErrorMsg({ message, onRetry }) {
  return (
    <div className={styles.errorMsg}>
      <span>⚠ {message}</span>
      {onRetry && (
        <button className={styles.retryBtn} onClick={onRetry}>
          Retry
        </button>
      )}
    </div>
  );
}

export function EmptyState({ icon = "📭", title, subtitle, action, onAction, children }) {
  return (
    <div className={styles.emptyState}>
      <div className={styles.emptyIcon}>{icon}</div>
      <div className={styles.emptyTitle}>{title}</div>
      {subtitle && <div className={styles.emptySub}>{subtitle}</div>}
      {children}
      {action && (
        <Button variant="primary" onClick={onAction}>
          {action}
        </Button>
      )}
    </div>
  );
}

/* ── Modal ─────────────────────────────────────── */
export function Modal({
  onClose,
  children,
  closeOnBackdrop = true,
  priority = false,
}) {
  const handleBackdropClick = (e) => {
    if (e.target === e.currentTarget && closeOnBackdrop && onClose) {
      onClose();
    }
  };

  return (
    <div
      className={`${styles.modalBackdrop} ${priority ? styles.modalBackdropPriority : ""}`}
      onClick={handleBackdropClick}
      role="presentation"
    >
      <div className={styles.modalContent} onClick={(e) => e.stopPropagation()}>
        {children}
      </div>
    </div>
  );
}


