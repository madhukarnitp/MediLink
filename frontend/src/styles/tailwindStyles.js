import {
  adminDashboardGeneratedStyles,
  adminShellGeneratedStyles,
  appShellGeneratedStyles,
  appointmentsGeneratedStyles,
  chatbotGeneratedStyles,
  consultationListGeneratedStyles,
  createPrescriptionGeneratedStyles,
  dashboardGeneratedStyles,
  doctorDashboardGeneratedStyles,
  doctorListGeneratedStyles,
  doctorPatientsGeneratedStyles,
  doctorPrescriptionsGeneratedStyles,
  errorPageGeneratedStyles,
  healthRecordsGeneratedStyles,
  loginGeneratedStyles,
  ordersGeneratedStyles,
  patientReportsGeneratedStyles,
  patientVitalsGeneratedStyles,
  prescriptionGeneratedStyles,
  prescriptionListGeneratedStyles,
  profileGeneratedStyles,
  sidebarGeneratedStyles,
  sosGeneratedStyles,
  toastGeneratedStyles,
  topNavbarGeneratedStyles,
  uiGeneratedStyles,
} from "./generatedTailwindStyles.js";

const merge = (...classes) => classes.filter(Boolean).join(" ");

const createStyles = (overrides = {}) =>
  new Proxy({ ...baseStyles, ...overrides }, {
    get(target, prop) {
      if (typeof prop !== "string") return target[prop];
      return target[prop] || "";
    },
  });

const field =
  "w-full min-h-[42px] rounded-med border border-[var(--border)] bg-[linear-gradient(180deg,rgba(255,255,255,0.72),rgba(255,255,255,0.34)),var(--card)] px-3 py-2 text-sm font-normal leading-relaxed text-[var(--text)] shadow-[inset_0_1px_0_rgba(255,255,255,0.78),0_8px_20px_rgba(19,34,53,0.05)] outline-none transition placeholder:text-[color-mix(in_srgb,var(--muted)_76%,transparent)] hover:border-[var(--primary-border)] hover:bg-[linear-gradient(180deg,rgba(255,255,255,0.86),rgba(255,255,255,0.44)),var(--card)] focus:border-[var(--primary)] focus:shadow-[0_0_0_3px_var(--primary-dim),0_12px_26px_rgba(0,123,255,0.10),inset_0_1px_0_rgba(255,255,255,0.82)] disabled:cursor-not-allowed disabled:bg-[linear-gradient(180deg,rgba(255,255,255,0.38),rgba(255,255,255,0.18)),var(--surface)] disabled:text-[var(--muted)] disabled:opacity-70";
const card =
  "relative min-w-0 overflow-hidden rounded-med border border-[var(--border)] bg-[linear-gradient(180deg,var(--card),rgba(248,251,253,0.96))] p-4 shadow-[0_12px_30px_rgba(19,34,53,0.08)] ring-1 ring-white/60 before:pointer-events-none before:absolute before:inset-x-0 before:top-0 before:h-[3px] before:bg-[linear-gradient(90deg,var(--primary),rgba(34,184,242,0.68),transparent)]";
const softCard =
  "relative min-w-0 overflow-hidden rounded-med border border-[var(--border)] bg-[linear-gradient(145deg,rgba(255,255,255,0.98),var(--surface))] p-4 shadow-[0_8px_22px_rgba(19,34,53,0.07)] ring-1 ring-white/50";
const page =
  "mx-auto flex w-full min-w-0 max-w-[var(--main-content-max)] flex-col gap-4 pb-4 text-left";
const topPanel =
  "relative min-w-0 overflow-hidden rounded-med border border-[var(--primary-border)] bg-[linear-gradient(135deg,rgba(29,114,243,0.18),rgba(29,114,243,0.10),rgba(217,119,6,0.06)),var(--card)] p-5 shadow-[0_18px_42px_var(--admin-shadow)]";
const topCopy =
  "[&_h1]:m-0 [&_h1]:text-2xl [&_h1]:font-semibold [&_h1]:leading-tight [&_h1]:tracking-tight [&_h1]:text-[var(--text)] md:[&_h1]:text-3xl [&_p]:mt-1.5 [&_p]:max-w-3xl [&_p]:break-words [&_p]:text-sm [&_p]:leading-relaxed [&_p]:text-[var(--muted)] md:[&_p]:text-base max-[560px]:p-3";
const header =
  merge(topPanel, topCopy, "flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between");
const greetingBlock = merge(topPanel, topCopy);
const headerActions = "flex flex-wrap items-center gap-2";
const title = "text-2xl font-semibold leading-tight tracking-tight text-[var(--text)] md:text-3xl";
const subtitle = "mt-1 max-w-2xl text-sm leading-relaxed text-[var(--muted)] md:text-base";
const list = "flex min-w-0 flex-col gap-3";
const gridCards = "grid min-w-0 grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-3";
const pill =
  "inline-flex items-center justify-center rounded-med border border-[var(--border)] bg-[var(--surface)] px-2.5 py-1 text-[11px] font-bold text-[var(--muted)]";
const primaryButton =
  "inline-flex min-h-[var(--control-height)] items-center justify-center gap-2 rounded-med border border-transparent bg-[linear-gradient(135deg,var(--primary),#1557C8)] px-4 py-2 text-sm font-medium text-white shadow-[0_10px_22px_rgba(29,114,243,0.18)] transition hover:-translate-y-px hover:shadow-[0_14px_28px_rgba(29,114,243,0.22)] disabled:translate-y-0 disabled:cursor-not-allowed disabled:opacity-60";
const outlineButton =
  "inline-flex min-h-[var(--control-height)] items-center justify-center gap-2 rounded-med border border-[var(--border)] bg-[var(--card)] px-4 py-2 text-sm font-medium text-[var(--text)] shadow-[0_6px_16px_rgba(19,34,53,0.05)] transition hover:-translate-y-px hover:border-[var(--primary-border)] hover:bg-[var(--card2)] hover:text-[var(--primary)] disabled:translate-y-0 disabled:cursor-not-allowed disabled:opacity-60";
const dangerButton =
  "inline-flex min-h-[var(--control-height)] items-center justify-center gap-2 rounded-med border border-[var(--accent-border)] bg-[var(--accent-dim)] px-4 py-2 text-sm font-medium text-[var(--accent)] transition hover:-translate-y-px hover:bg-[var(--card2)] disabled:translate-y-0 disabled:cursor-not-allowed disabled:opacity-60";
const logoutButton =
  "inline-flex min-h-[var(--control-height)] items-center justify-center gap-2 rounded-med border border-[var(--accent-border)] bg-[var(--accent-dim)] px-4 py-2 text-sm font-medium text-[var(--accent)] transition hover:bg-[var(--card2)] disabled:cursor-not-allowed disabled:opacity-60 [&_svg]:text-[var(--accent)]";
const filterPanel =
  "flex flex-wrap items-center gap-2 overflow-x-auto rounded-med border border-[var(--border)] bg-[var(--surface)] p-2 shadow-[0_8px_20px_var(--admin-shadow)] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden";
const filterChip =
  "shrink-0 rounded-med border border-[var(--border)] bg-[var(--card)] px-3 py-2 text-[12px] font-semibold text-[var(--muted)] transition hover:border-[var(--primary-border)] hover:bg-[var(--card2)] hover:text-[var(--primary)]";
const recordCard =
  "group min-w-0 overflow-hidden rounded-med border border-[var(--border)] bg-[linear-gradient(180deg,var(--card),var(--surface))] shadow-[0_10px_26px_rgba(19,34,53,0.07)] ring-1 ring-white/50 transition hover:-translate-y-0.5 hover:border-[var(--primary-border)] hover:shadow-[0_16px_34px_rgba(29,114,243,0.12)]";
const recordCardHeader =
  "flex min-w-0 flex-col gap-2 border-b border-[var(--border)] bg-[linear-gradient(135deg,rgba(29,114,243,0.06),transparent)] p-3 sm:flex-row sm:items-start sm:justify-between";
const recordCardActions =
  "flex flex-wrap items-center justify-end gap-2 border-t border-[var(--border)] bg-[var(--surface)] p-3 max-[640px]:justify-stretch [&_button]:min-h-[38px] [&_button]:max-w-full max-[640px]:[&_button]:w-full";

const baseStyles = {
  page,
  loadingWrap: "flex min-h-[60vh] items-center justify-center text-[13px] text-[var(--muted)]",
  header,
  greeting: "min-w-0",
  headerTitle: title,
  title,
  heroTitle: title,
  sectionTitle: "text-xl font-semibold text-[var(--text)]",
  colTitle: "text-sm font-semibold text-[var(--text)]",
  headerSubtitle: subtitle,
  subtitle,
  copy: "text-sm leading-relaxed text-[var(--muted)] md:text-base",
  eyebrow: "text-[10px] font-semibold uppercase tracking-[0.08em] text-[var(--primary)]",
  headerActions,
  actions: headerActions,
  list,
  statsGrid: "grid min-w-0 grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4",
  summaryGrid: "grid min-w-0 grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-3",
  grid: gridCards,
  actionGrid: gridCards,
  workspaceGrid: gridCards,
  insightGrid: "grid min-w-0 grid-cols-1 gap-3 xl:grid-cols-2",
  layout: "grid min-w-0 grid-cols-1 gap-4 xl:grid-cols-[minmax(0,1fr)_340px]",
  mainContent: "min-w-0 space-y-4",
  right: "min-w-0 space-y-4",
  rightColumn: "min-w-0 space-y-4",
  card,
  cardTitle: "break-words text-lg font-semibold leading-snug text-[var(--text)]",
  cardMeta: "mt-1 break-words text-sm leading-relaxed text-[var(--muted)]",
  cardSection: "space-y-3",
  panel: card,
  heroCard: card,
  sectionCard: card,
  insightCard: card,
  chartCard: card,
  summaryCard: card,
  statCard: softCard,
  actionCard: softCard,
  metricCard: softCard,
  workspaceCard: softCard,
  workspaceMetric: "font-display text-[24px] font-bold text-[var(--primary)]",
  profileCard: card,
  tableCard: card,
  bookingPanel: card,
  cartCard: card,
  historyCard: card,
  trackerCard: card,
  emptyCard: softCard,
  verifyPanel: card,
  detailsPanel: card,
  detailPanel: card,
  infoPanel: card,
  mapCard: softCard,
  statusCard: softCard,
  hospitalCard: "flex min-w-0 gap-3 rounded-med border border-[var(--border)] bg-[var(--card)] p-3",
  reportCard: card,
  vitalCard: card,
  recordCard: card,
  medicineCard: card,
  orderCard: card,
  patientCard: "group relative min-w-0 overflow-hidden rounded-med border border-[var(--border)] bg-[linear-gradient(180deg,var(--card),var(--surface))] p-4 shadow-[0_10px_24px_rgba(19,34,53,0.07)] ring-1 ring-white/50 transition hover:-translate-y-0.5 hover:border-[var(--primary-border)] hover:shadow-[0_16px_34px_rgba(29,114,243,0.12)]",
  empty:
    "rounded-med border border-dashed border-[var(--primary-border)] bg-[var(--primary-dim)] p-6 text-center text-[13px] font-bold text-[var(--primary)]",
  emptyText: "text-sm leading-relaxed text-[var(--muted)] md:text-base",
  emptyMini: "rounded-med bg-[var(--surface)] p-3 text-xs leading-relaxed text-[var(--muted)]",
  emptyIcon: "mb-2 text-2xl",
  listState:
    "rounded-med border border-dashed border-[var(--border)] bg-[var(--surface)] p-4 text-center text-[12px] text-[var(--muted)]",
  sectionHeader: "mb-3 flex min-w-0 flex-col gap-2 border-b border-[var(--border)] pb-3 sm:flex-row sm:items-start sm:justify-between [&_h2]:m-0 [&_h2]:break-words [&_h2]:text-xl [&_h2]:font-semibold [&_h2]:text-[var(--text)] [&_p]:mt-1 [&_p]:break-words [&_p]:text-sm [&_p]:leading-relaxed [&_p]:text-[var(--muted)]",
  insightHeader: "mb-3 flex min-w-0 flex-col gap-2 border-b border-[var(--border)] pb-3 sm:flex-row sm:items-start sm:justify-between",
  insightActions: "flex flex-wrap items-center gap-2",
  toolbar: "flex flex-col gap-3 rounded-med border border-[var(--border)] bg-[var(--card)] p-3 lg:flex-row lg:items-center lg:justify-between",
  filterBar: "flex flex-wrap items-center gap-2",
  filtersBar: "flex flex-wrap items-center gap-2",
  filters: "flex flex-wrap items-center gap-2",
  filterCluster: "flex flex-col gap-2 sm:flex-row sm:items-center",
  viewTabs: "inline-flex flex-wrap items-center gap-2 rounded-med bg-[var(--surface)] p-1",
  tabs: "flex flex-wrap items-center gap-2",
  tab: outlineButton,
  activeTab: "border-[var(--primary)] bg-[var(--primary-dim)] text-[var(--primary)]",
  viewTab: "rounded-med px-3 py-2 text-sm font-medium text-[var(--muted)]",
  viewActive: "bg-[var(--card)] text-[var(--primary)] shadow-sm",
  filterBtn: outlineButton,
  filterActive: "border-[var(--primary)] bg-[var(--primary-dim)] text-[var(--primary)]",
  active: "border-[var(--primary)] bg-[var(--primary-dim)] text-[var(--primary)]",
  selected: "border-[var(--primary)] bg-[var(--primary-dim)]",
  searchBox: merge("relative min-w-0", field, "flex items-center gap-2 [&_input]:min-w-0 [&_input]:flex-1 [&_input]:border-0 [&_input]:bg-transparent [&_input]:outline-none"),
  input: field,
  select: field,
  textarea: merge(field, "min-h-[96px] resize-y"),
  inputSmall: merge(field, "sm:max-w-[130px]"),
  inputFull: "sm:col-span-2",
  inputSelect: field,
  field,
  fieldWide: "sm:col-span-2",
  form: "grid min-w-0 grid-cols-1 gap-3",
  formGrid: "grid min-w-0 grid-cols-1 gap-3 sm:grid-cols-2",
  formGroup: "flex min-w-0 flex-col gap-1.5",
  formRow: "grid min-w-0 grid-cols-1 gap-3 sm:grid-cols-2",
  formActions: "flex flex-wrap items-center justify-end gap-2 pt-2",
  modalActions: "flex flex-wrap items-center justify-end gap-2 pt-3",
  modalContent: "max-h-[90vh] w-full max-w-2xl overflow-y-auto rounded-med bg-[var(--card)] p-4 text-left shadow-xl",
  modalBackdrop: "fixed inset-0 z-[250] flex items-center justify-center bg-black/35 p-4",
  closeBtn: "rounded-med border border-[var(--border)] bg-[var(--card)] px-3 py-2 text-sm font-medium text-[var(--muted)] hover:bg-[var(--card2)]",
  adminButton: primaryButton,
  actionButton: primaryButton,
  addBtn: primaryButton,
  removeBtn: dangerButton,
  revokeBtn: dangerButton,
  revokeAction: "flex justify-end",
  drawerAction: outlineButton,
  smallBtn: outlineButton,
  inlineBtn: "font-bold text-[var(--primary)] underline-offset-2 hover:underline",
  actionChip: outlineButton,
  cancel: dangerButton,
  backBtn: outlineButton,
  emptyBackButton: primaryButton,
  primaryBtn: primaryButton,
  secondaryBtn: outlineButton,
  cardButton: primaryButton,
  loginBtn: primaryButton,
  demoBtn: outlineButton,
  linkBtn: "font-bold text-[var(--primary)]",
  logoutBtn: logoutButton,
  rowActions: "flex flex-wrap items-center gap-2",
  deliveryActions: "flex flex-wrap items-center gap-2",
  queueActions: "flex flex-wrap items-center justify-end gap-2",
  deliveryAddress: "text-[12px] text-[var(--muted)]",
  tableWrap: "w-full overflow-x-auto rounded-med border border-[var(--border)]",
  table:
    "w-full min-w-[720px] border-collapse text-left text-[12px] max-[620px]:min-w-0 max-[620px]:block [&_th]:bg-[var(--surface)] [&_th]:px-3 [&_th]:py-3 [&_th]:font-semibold [&_th]:uppercase [&_th]:tracking-[0.06em] [&_th]:text-[10px] [&_th]:text-[var(--muted)] [&_td]:border-t [&_td]:border-[var(--border)] [&_td]:px-3 [&_td]:py-3 [&_td]:align-middle [&_tr]:transition [&_tbody_tr:hover]:bg-[var(--surface)] max-[620px]:[&_thead]:hidden max-[620px]:[&_tbody]:block max-[620px]:[&_tr]:mb-2 max-[620px]:[&_tr]:block max-[620px]:[&_tr]:overflow-hidden max-[620px]:[&_tr]:rounded-med max-[620px]:[&_tr]:border max-[620px]:[&_tr]:border-[var(--border)] max-[620px]:[&_tr]:bg-[var(--card)] max-[620px]:[&_td]:grid max-[620px]:[&_td]:grid-cols-[92px_minmax(0,1fr)] max-[620px]:[&_td]:gap-2 max-[620px]:[&_td]:border-t-0 max-[620px]:[&_td]:border-b max-[620px]:[&_td]:px-3 max-[620px]:[&_td]:py-2 max-[620px]:[&_td:last-child]:border-b-0 max-[620px]:[&_td::before]:text-[10px] max-[620px]:[&_td::before]:font-semibold max-[620px]:[&_td::before]:uppercase max-[620px]:[&_td::before]:tracking-[0.06em] max-[620px]:[&_td::before]:text-[var(--muted)] max-[620px]:[&_td:nth-child(1)::before]:content-['Medicine'] max-[620px]:[&_td:nth-child(2)::before]:content-['Dosage'] max-[620px]:[&_td:nth-child(3)::before]:content-['Frequency'] max-[620px]:[&_td:nth-child(4)::before]:content-['Duration'] max-[620px]:[&_td:nth-child(5)::before]:content-['Notes']",
  qrSection:
    "min-w-0 rounded-med border border-[var(--border)] bg-white/80 p-2 text-center max-[760px]:w-fit",
  qrCode:
    "mx-auto flex h-20 w-20 items-center justify-center overflow-hidden rounded-med border border-[var(--border)] bg-white p-1 [&_img]:h-full [&_img]:w-full [&_img]:object-contain",
  queueList: "flex flex-col gap-2",
  queueItem: "flex min-w-0 flex-col gap-3 rounded-med border border-[var(--border)] bg-[var(--surface)] p-3 sm:flex-row sm:items-center sm:justify-between",
  userCell: "flex min-w-0 items-center gap-3",
  avatar:
    "flex h-10 w-10 shrink-0 items-center justify-center overflow-hidden rounded-med border border-[var(--border)] bg-[var(--primary-dim)] text-[12px] font-semibold text-[var(--primary)] [&_img]:h-full [&_img]:w-full [&_img]:object-cover",
  photo:
    "h-16 w-16 shrink-0 overflow-hidden rounded-med border border-[var(--border)] bg-[var(--surface)] object-cover",
  name: "font-bold text-[var(--text)]",
  meta: "text-[12px] text-[var(--muted)]",
  label: "text-xs font-medium uppercase tracking-[0.04em] text-[var(--muted)]",
  value: "font-semibold leading-relaxed text-[var(--text)]",
  price: "font-semibold text-[var(--primary)]",
  status: pill,
  statusPill: pill,
  pill,
  inlinePill: pill,
  rolePill: pill,
  badge: pill,
  rxBadge: "rounded-med bg-[var(--primary-dim)] px-2.5 py-1 text-[11px] font-semibold text-[var(--primary)]",
  safeBadge: "rounded-med bg-sky-50 px-2.5 py-1 text-[11px] font-semibold text-sky-700",
  statusActive: "border-sky-200 bg-sky-50 text-sky-700",
  statusCompleted: "border-sky-200 bg-sky-50 text-sky-700",
  statusConfirmed: "border-sky-200 bg-sky-50 text-sky-700",
  status_confirmed: "border-sky-200 bg-sky-50 text-sky-700",
  status_delivered: "border-sky-200 bg-sky-50 text-sky-700",
  status_processing: "border-sky-200 bg-sky-50 text-sky-700",
  status_shipped: "border-sky-200 bg-sky-50 text-sky-700",
  statusPending: "border-sky-200 bg-sky-50 text-sky-700",
  status_requested: "border-sky-200 bg-sky-50 text-sky-700",
  status_pending: "border-sky-200 bg-sky-50 text-sky-700",
  statusExpired: "border-sky-200 bg-sky-50 text-sky-700",
  statusCancelled: "border-sky-200 bg-sky-50 text-sky-700",
  status_cancelled: "border-sky-200 bg-sky-50 text-sky-700",
  status_missed: "border-sky-200 bg-sky-50 text-sky-700",
  status_completed: "border-sky-200 bg-sky-50 text-sky-700",
  statusDefault: "border-[var(--border)] bg-[var(--surface)] text-[var(--muted)]",
  good: "text-sky-700",
  warn: "text-amber-700",
  danger: "text-sky-700",
  normal: "text-sky-700",
  critical: "rounded-med bg-sky-50 px-2 py-1 text-[10px] font-semibold text-sky-700",
  checkList: "flex flex-col gap-2",
  checkItem: "flex min-w-0 items-center gap-2 text-[12px] text-[var(--muted)]",
  checkDot: "h-2.5 w-2.5 shrink-0 rounded-full bg-current",
  pipeline: "flex flex-col gap-2",
  pipelineRow: "grid grid-cols-[110px_minmax(0,1fr)_42px] items-center gap-3 text-[12px] text-[var(--muted)] max-sm:grid-cols-1",
  pipelineTrack: "h-2 overflow-hidden rounded-full bg-[var(--card2)]",
  pipelineFill: "h-full rounded-full bg-[var(--primary)]",
  detailGrid: "grid min-w-0 grid-cols-1 gap-3 sm:grid-cols-2",
  detailItem: softCard,
  detailSection: "space-y-3",
  detailsHeader: "flex flex-col gap-2 sm:flex-row sm:items-start sm:justify-between",
  detailsHero: "flex min-w-0 flex-col gap-3 rounded-med bg-[var(--surface)] p-4 sm:flex-row sm:items-center sm:justify-between",
  drawerTitle: "font-display text-[18px] font-bold text-[var(--text)]",
  drawerSubtitle: "text-[12px] text-[var(--muted)]",
  verifyBox: "rounded-med border border-sky-200 bg-sky-50 p-3 text-[12px] text-sky-700",
  priceRange: "text-[12px] font-bold text-[var(--muted)]",
  rating: "text-[12px] font-bold text-amber-600",
  spec: "text-[12px] text-[var(--muted)]",
  stats: "flex flex-wrap items-center gap-2 text-[12px] text-[var(--muted)]",
  resultCount: "text-[12px] text-[var(--muted)]",
  on: "bg-sky-500",
  off: "bg-slate-300",
  toggle: "flex items-center gap-2 text-[12px] text-[var(--muted)]",
  toggleTrack: "relative h-5 w-9 rounded-full bg-[var(--card2)]",
  toggleThumb: "absolute left-0.5 top-0.5 h-4 w-4 rounded-full bg-white shadow",
  left: "min-w-0 space-y-4",
  statsRow: "grid grid-cols-1 gap-3 sm:grid-cols-3",
  quickActions: "grid grid-cols-1 gap-3 sm:grid-cols-2",
  recentSection: card,
  quickCard: softCard,
  quickIcon: "mb-3 flex h-10 w-10 items-center justify-center rounded-med bg-[var(--surface)] text-[var(--primary)]",
  quickIconAccent: "bg-sky-50 text-sky-600",
  quickIconBlue: "bg-sky-50 text-sky-600",
  quickIconPrimary: "bg-sky-50 text-sky-600",
  quickIconSos: "bg-sky-50 text-sky-700",
  quickTitleSos: "text-sky-700",
  healthCard: card,
  mapBody: "min-h-[180px] overflow-hidden rounded-med bg-[var(--surface)]",
  mapGrid: "grid grid-cols-1 gap-3 sm:grid-cols-2",
  mapHeader: "mb-3 flex items-center justify-between",
  mapIframe: "h-[240px] w-full rounded-med border-0",
  mapEmpty: "flex min-h-[180px] items-center justify-center rounded-med bg-[var(--surface)]",
  mapEmptyText: "text-center text-[12px] text-[var(--muted)]",
  mapDot: "h-2 w-2 rounded-full bg-[var(--primary)]",
  pharmacyList: "flex flex-col gap-2",
  pharmacyRow: "flex items-center justify-between gap-3 rounded-med border border-[var(--border)] bg-[var(--card)] p-3",
  consultRow: "flex items-center gap-3 rounded-med border border-[var(--border)] bg-[var(--card)] p-3",
  consultMeta: "min-w-0 flex-1",
  consultDate: "text-[11px] text-[var(--muted)]",
  consultDot: "h-2.5 w-2.5 rounded-full bg-[var(--muted)]",
  consultDot_active: "bg-sky-500",
  consultDot_completed: "bg-sky-500",
  consultDot_cancelled: "bg-sky-500",
  consultDot_default: "bg-slate-300",
  reminderRow: "flex items-center justify-between gap-3 rounded-med border border-[var(--border)] bg-[var(--card)] p-3",
  reminderInfo: "min-w-0",
  reminderName: "font-bold text-[var(--text)]",
  reminderTime: "text-[12px] text-[var(--muted)]",
  docAvatar: "flex h-10 w-10 items-center justify-center rounded-med bg-sky-50 font-semibold text-sky-700",
  docAvatarAccent: "bg-sky-50 text-sky-700",
  docInfo: "min-w-0 flex-1",
  docName: "truncate font-bold text-[var(--text)]",
  docSpec: "truncate text-[12px] text-[var(--muted)]",
  inlineAction: "text-[12px] font-bold text-[var(--primary)]",
  sosCard:
    "rounded-med border border-red-200 bg-[linear-gradient(135deg,rgba(239,68,68,0.16),rgba(248,113,113,0.10))] p-4 text-red-700 shadow-[0_12px_30px_rgba(239,68,68,0.20)] ring-1 ring-red-200",
  dist: "text-[11px] font-bold text-[var(--muted)]",
  p1: "text-[13px] text-[var(--muted)]",
  p2: "text-[13px] text-[var(--muted)]",
  p3: "text-[13px] text-[var(--muted)]",
  you: "font-bold text-[var(--primary)]",
  actionIcon: "flex h-10 w-10 items-center justify-center rounded-med bg-[var(--primary-dim)] text-[var(--primary)]",
  actionText: "min-w-0",
  actionTitle: "font-bold text-[var(--text)]",
  actionDesc: "text-[12px] text-[var(--muted)]",
  sectionContent: "space-y-3",
  prescriptionsList: "flex flex-col gap-3",
  prescriptionItem: "flex min-w-0 flex-col gap-3 rounded-med border border-[var(--border)] bg-[var(--card)] p-3 sm:flex-row sm:items-center sm:justify-between",
  itemInfo: "min-w-0",
  itemTitle: "font-bold text-[var(--text)]",
  itemMeta: "text-[12px] text-[var(--muted)]",
  viewLink: "text-[12px] font-bold text-[var(--primary)]",
  patientBlock: "flex min-w-0 items-center gap-3",
  patientInfo: "min-w-0 flex-1",
  nameRow: "flex flex-wrap items-center gap-2",
  lastReason: "text-[12px] text-[var(--muted)]",
  summaryRow: "flex items-center justify-between gap-3",
  summaryTitle: "text-[12px] text-[var(--muted)]",
  cardHeader: "mb-3 flex flex-col gap-2 sm:flex-row sm:items-start sm:justify-between",
  cardTop: "mb-3 flex items-start gap-3",
  cardInfo: "min-w-0 flex-1",
  cardContent: "space-y-3",
  cardContentSpacing: "space-y-3",
  contentSpacing: "space-y-3",
  listSpacing: "flex flex-col gap-3",
  detail: "text-[12px] text-[var(--muted)]",
  details: "grid grid-cols-1 gap-2 sm:grid-cols-2",
  detailBox: softCard,
  detailLabelInline: "text-[11px] font-semibold uppercase tracking-[0.04em] text-[var(--muted)]",
  detailText: "text-[13px] text-[var(--text)]",
  labelHeading: "text-[12px] font-semibold text-[var(--text)]",
  patient: "font-bold text-[var(--text)]",
  date: "text-[12px] text-[var(--muted)]",
  diagnosis: "text-[13px] text-[var(--text)]",
  medicineListWrap: "flex flex-wrap gap-2",
  medicineList: "flex flex-wrap gap-2",
  medicineBadge: pill,
  medicineBadgePill: pill,
  moreBadge: pill,
  more: pill,
  medicineItems: "flex flex-col gap-2",
  medicineItem: "rounded-med bg-[var(--surface)] p-3",
  medicineName: "font-bold text-[var(--text)]",
  medicineMeta: "text-[12px] text-[var(--muted)]",
  medicines: "space-y-2",
  instructions: softCard,
  notes: softCard,
  notesBox: softCard,
  reviewBox: softCard,
  emptyTranscript: "rounded-med bg-[var(--surface)] p-4 text-[12px] text-[var(--muted)]",
  messageList: "flex max-h-[360px] flex-col gap-2 overflow-y-auto rounded-med bg-[var(--surface)] p-3",
  messageRow: "max-w-[85%] rounded-med bg-[var(--card)] p-3 text-[12px] text-[var(--text)]",
  messageMine: "ml-auto bg-[var(--primary-dim)]",
  messageMeta: "mt-1 text-[10px] text-[var(--muted)]",
  messageText: "whitespace-pre-wrap break-words",
  relatedRow: "rounded-med border border-[var(--border)] bg-[var(--surface)] p-3",
  relatedTitle: "font-bold text-[var(--text)]",
  relatedMeta: "text-[12px] text-[var(--muted)]",
  chatSection: card,
  chatHeader: "mb-3 flex items-center justify-between",
  detailLoading: "p-4 text-center text-[12px] text-[var(--muted)]",
  steps: "grid grid-cols-1 gap-3 md:grid-cols-3",
  step: softCard,
  completed: "border-sky-200 bg-sky-50",
  connector: "hidden",
  stepContent: "min-w-0",
  stepTitle: "font-bold text-[var(--text)]",
  stepSubtitle: "text-[12px] text-[var(--muted)]",
  patientList: "grid grid-cols-1 gap-3 sm:grid-cols-2 xl:grid-cols-3",
  patientName: "font-bold text-[var(--text)]",
  patientDetail: "text-[12px] text-[var(--muted)]",
  medicinesSection: "space-y-3",
  medicineRow: "grid grid-cols-1 gap-2 rounded-med border border-[var(--border)] bg-[var(--surface)] p-3 md:grid-cols-[2fr_1fr_1fr_auto]",
  reviewSection: "space-y-3",
  reviewMedicine: "rounded-med bg-[var(--surface)] p-3",
  followUpBox: softCard,
  followUpInput: field,
  checkbox: "sr-only",
  checkmark: "inline-flex h-5 w-5 items-center justify-center rounded border border-[var(--border)] bg-[var(--card)]",
  noResults: "rounded-med border border-dashed border-[var(--border)] p-4 text-center text-[12px] text-[var(--muted)]",
  muted: "text-[var(--muted)]",
  background: "min-h-screen bg-[var(--bg)]",
  container: "flex min-h-screen items-center justify-center p-4",
  cardLogin: card,
  scrollCard: "max-h-[92vh] overflow-y-auto",
  logo: "flex items-center justify-center gap-2",
  logoImage: "h-12 w-auto object-contain",
  brandWord:
    "inline-flex items-baseline font-display font-bold tracking-normal",
  brandMedi: "!text-[#0076bf]",
  brandLink: "!text-[#59b947]",
  roleSelector: "grid grid-cols-1 gap-2 sm:grid-cols-3",
  roleOption: outlineButton,
  tabRow: "grid grid-cols-2 gap-2 rounded-med bg-[var(--surface)] p-1",
  tabBtn: "rounded-med px-3 py-2 text-[12px] font-bold text-[var(--muted)]",
  tabActive: "bg-[var(--card)] text-[var(--primary)] shadow-sm",
  inputGroup: "space-y-1.5",
  divider: "my-3 h-px bg-[var(--border)]",
  demoButtons: "grid grid-cols-1 gap-2 sm:grid-cols-3",
  credentials: softCard,
  credList: "space-y-1 text-[12px] text-[var(--muted)]",
  error: "rounded-med border border-sky-200 bg-sky-50 p-3 text-[12px] text-sky-700",
  notice: "rounded-med border border-sky-200 bg-sky-50 p-3 text-[12px] text-sky-700",
  footer: "text-center text-[12px] text-[var(--muted)]",
  publicPage: "min-h-screen bg-[var(--bg)] p-4 sm:p-6",
  publicSuccessPage: "min-h-screen bg-[var(--bg)]",
  detailPage: "mx-auto max-w-5xl space-y-4",
  publicHero: "rounded-med border border-[var(--border)] bg-[var(--card)] p-5",
  publicHeroValid: "border-sky-200 bg-sky-50",
  publicHeroInvalid: "border-sky-200 bg-sky-50",
  publicHeroContent: "flex flex-col gap-3 sm:flex-row sm:items-center",
  publicHeroMark: "flex h-12 w-12 shrink-0 items-center justify-center rounded-med bg-white text-xl font-semibold text-sky-700",
  publicHeroMeta: "text-[12px] text-[var(--muted)]",
  rxHeader: "flex flex-col gap-3 rounded-med border border-[var(--border)] bg-[var(--card)] p-4 sm:flex-row sm:items-start sm:justify-between",
  rxBrand: "flex items-center gap-3",
  rxLogo: "flex h-12 w-12 items-center justify-center rounded-med bg-[var(--surface)]",
  rxLogoImage: "h-10 w-10 object-contain",
  rxBrandSub: "text-[12px] text-[var(--muted)]",
  rxId: "font-mono text-[12px] text-[var(--muted)]",
  rxDateGroup: "grid grid-cols-2 gap-2",
  rxDate: "text-right",
  rxDateLabel: "text-[10px] font-semibold uppercase text-[var(--muted)]",
  rxDateVal: "text-[12px] font-bold text-[var(--text)]",
  headerChips: "flex flex-wrap gap-2",
  headerChip: pill,
  parties: "grid grid-cols-1 gap-3 sm:grid-cols-2",
  party: softCard,
  partyLabel: "text-[10px] font-semibold uppercase tracking-[0.04em] text-[var(--muted)]",
  partyName: "mt-1 font-bold text-[var(--text)]",
  partyDetail: "text-[12px] text-[var(--muted)]",
  tableWrapRx: "overflow-x-auto rounded-med border border-[var(--border)]",
  instructionsLabel: "text-[11px] font-semibold uppercase text-[var(--muted)]",
  instructionsText: "mt-1 text-[13px] text-[var(--text)]",
  notesLabel: "text-[11px] font-semibold uppercase text-[var(--muted)]",
  notesText: "mt-1 text-[13px] text-[var(--text)]",
  detailBlock: softCard,
  detailTitle: "mb-2 text-[12px] font-semibold text-[var(--text)]",
  detailPills: "flex flex-wrap gap-2",
  detailPill: pill,
  qrSection: "flex flex-col items-center gap-2 rounded-med border border-[var(--border)] bg-[var(--surface)] p-4",
  qrCode: "rounded-med bg-white p-2",
  qrLabel: "text-[11px] font-semibold uppercase text-[var(--muted)]",
  qrId: "font-mono text-[11px] text-[var(--muted)]",
  validityBox: "grid grid-cols-1 gap-2 sm:grid-cols-3",
  validityItem: softCard,
  verified: "text-sky-700",
  valueActive: "text-sky-700",
  valueExpired: "text-sky-700",
  valueCancelled: "text-sky-700",
  expiryValue: "font-bold text-[var(--text)]",
  followUp: "flex items-start gap-3 rounded-med border border-sky-200 bg-sky-50 p-3 text-sky-700",
  followUpIcon: "mt-0.5",
  successBanner: "rounded-med border border-sky-200 bg-sky-50 p-3 text-[12px] text-sky-700",
  warningBanner: "rounded-med border border-sky-200 bg-sky-50 p-3 text-[12px] text-sky-700",
  verifyMarkError: "flex h-12 w-12 shrink-0 items-center justify-center rounded-med bg-sky-50 text-lg font-semibold text-sky-700",
  verifyContent: "space-y-2",
  verifyEyebrow: "text-[10px] font-semibold uppercase tracking-[0.08em] text-[var(--muted)]",
  verifyReason: "rounded-med bg-[var(--surface)] p-3 text-[12px] text-[var(--muted)]",
  verifyActions: "flex flex-wrap gap-2",
  expiryRow: "flex items-center justify-between gap-3",
  expiryLabel: "text-[11px] text-[var(--muted)]",
  reportHeader: "flex flex-col gap-2 sm:flex-row sm:items-start sm:justify-between",
  reportMeta: "flex flex-wrap items-center gap-2",
  reportType: "font-bold text-[var(--text)]",
  reportDate: "text-[12px] text-[var(--muted)]",
  description: "mt-3 text-[13px] text-[var(--muted)]",
  results: "mt-3 rounded-med bg-[var(--surface)] p-3",
  resultsContent: "whitespace-pre-wrap text-[13px] text-[var(--text)]",
  reportFooter: "mt-3 flex flex-wrap justify-end gap-2",
  checkboxLabel: "inline-flex items-center gap-2 text-[12px] text-[var(--text)]",
  vitalHeader: "mb-3 flex flex-col gap-2 sm:flex-row sm:items-start sm:justify-between",
  vitalGrid: "grid grid-cols-1 gap-2 sm:grid-cols-2 lg:grid-cols-3",
  vitalItem: softCard,
  bpInputs: "grid grid-cols-2 gap-2",
  tempInputs: "grid grid-cols-2 gap-2",
  contactBlock: "space-y-1",
  contactLabel: "text-[11px] font-semibold uppercase text-[var(--muted)]",
  contactValue: "break-words text-[13px] font-bold text-[var(--text)]",
  contactSection: "mt-4 space-y-3",
  avatarWrap: "flex flex-col items-center gap-2",
  avatarUpload: outlineButton,
  profileName: "text-center font-display text-[20px] font-bold text-[var(--text)]",
  nameInput: "text-center",
  roleBadge: merge(pill, "mx-auto"),
  infoGrid: "grid grid-cols-1 gap-3 sm:grid-cols-2",
  infoField: softCard,
  infoFieldFull: "sm:col-span-2",
  infoLabel: "text-[11px] font-semibold uppercase tracking-[0.04em] text-[var(--muted)]",
  infoValue: "mt-1 break-words text-[13px] font-bold text-[var(--text)]",
  infoEditor: "mt-2",
  addressForm: "space-y-2",
  twoCol: "grid grid-cols-1 gap-2 sm:grid-cols-2",
  statBox: softCard,
  statValue: "font-display text-[24px] font-bold text-[var(--text)]",
  statLabel: "text-[12px] text-[var(--muted)]",
  statGreen: "text-sky-700",
  statBlue: "text-sky-700",
  statPurple: "text-violet-700",
  statAmber: "text-amber-700",
  errorWrap: "rounded-med border border-sky-200 bg-sky-50 p-3 text-[12px] text-sky-700",
  healthSidebar: "space-y-3",
  sidebarHeader: "flex items-center justify-between",
  sidebarSection: card,
  recordHeader: "flex flex-col gap-2 sm:flex-row sm:items-start sm:justify-between",
  recordsList: "flex flex-col gap-3",
  recordTitle: "font-bold text-[var(--text)]",
  recordMeta: "text-[12px] text-[var(--muted)]",
  recordBadge: pill,
  resultList: "space-y-2",
  resultRow: "flex items-center justify-between gap-3 rounded-med bg-[var(--surface)] p-3",
  resultValue: "font-bold text-[var(--text)]",
  range: "text-[11px] text-[var(--muted)]",
  parameter: "font-bold text-[var(--text)]",
  instructionsBox: softCard,
  timeline: "relative space-y-3",
  timelineItem: "grid grid-cols-[24px_minmax(0,1fr)] gap-3",
  tlStem: "relative flex justify-center",
  tlDot: "mt-1 h-3 w-3 rounded-full bg-[var(--primary)]",
  tlLine: "absolute left-1/2 top-5 h-full w-px bg-[var(--border)]",
  tlContent: softCard,
  tlTitle: "font-bold text-[var(--text)]",
  tlDate: "text-[11px] text-[var(--muted)]",
  tlDetail: "mt-1 text-[12px] text-[var(--muted)]",
  timelineNote: "text-[12px] text-[var(--muted)]",
  timelineNoteIndented: "ml-9 text-[12px] text-[var(--muted)]",
  chartTitle: "font-bold text-[var(--text)]",
  chartSub: "text-[12px] text-[var(--muted)]",
  bars: "mt-3 flex h-36 items-end gap-2",
  barGroup: "flex flex-1 flex-col items-center gap-2",
  bar: "w-full rounded-t-med bg-[var(--primary-dim)]",
  barPrimary: "bg-[var(--primary)]",
  barBlue: "bg-sky-400",
  barLabel: "text-[10px] text-[var(--muted)]",
  barH20: "h-[20%]",
  barH40: "h-[40%]",
  barH46: "h-[46%]",
  barH50: "h-[50%]",
  barH54: "h-[54%]",
  barH58: "h-[58%]",
  barH60: "h-[60%]",
  barH62: "h-[62%]",
  barH65: "h-[65%]",
  barH70: "h-[70%]",
  stackList: "space-y-2",
  itemRow: "flex items-center justify-between gap-3 rounded-med bg-[var(--surface)] p-3",
  itemPrimary: "font-bold text-[var(--text)]",
  itemSecondary: "text-[12px] text-[var(--muted)]",
  inlineMetaRow: "flex items-center justify-between gap-3",
  inlineMetaLabel: "text-[12px] text-[var(--muted)]",
  sectionIcon: "flex h-9 w-9 items-center justify-center rounded-med bg-[var(--primary-dim)] text-[var(--primary)]",
  sectionLabel: "text-[11px] font-semibold uppercase tracking-[0.06em] text-[var(--muted)]",
  badgeHigh: "border-sky-200 bg-sky-50 text-sky-700",
  badgeLow: "border-sky-200 bg-sky-50 text-sky-700",
  badgeNormal: "border-sky-200 bg-sky-50 text-sky-700",
  badgeActive: "border-sky-200 bg-sky-50 text-sky-700",
  badgeExpired: "border-sky-200 bg-sky-50 text-sky-700",
  badgeCancelled: "border-sky-200 bg-sky-50 text-sky-700",
  badgeDefault: "border-[var(--border)] bg-[var(--surface)] text-[var(--muted)]",
  recordBadgeDefault: "border-[var(--border)] bg-[var(--surface)] text-[var(--muted)]",
  ordersLayout: "grid grid-cols-1 gap-4 xl:grid-cols-[minmax(0,1fr)_360px]",
  hero: "rounded-med border border-[var(--border)] bg-[var(--card)] p-4",
  heroStats: "mt-4 grid grid-cols-1 gap-3 sm:grid-cols-3",
  patientStrip: "flex min-w-0 items-center gap-3 rounded-med bg-[var(--surface)] p-3",
  patientAvatar: "flex h-10 w-10 items-center justify-center rounded-med bg-[var(--primary-dim)] font-semibold text-[var(--primary)]",
  patientName: "font-bold text-[var(--text)]",
  patientMeta: "text-[12px] text-[var(--muted)]",
  modes: "grid grid-cols-1 gap-2 sm:grid-cols-3",
  modeBtn: "flex min-w-0 items-center gap-3 rounded-med border border-[var(--border)] bg-[var(--card)] p-3 text-left",
  modeActive: "border-[var(--primary)] bg-[var(--primary-dim)]",
  modeIcon: "text-xl",
  modeName: "font-bold text-[var(--text)]",
  modeSub: "text-[12px] text-[var(--muted)]",
  fulfilmentTitle: "font-bold text-[var(--text)]",
  promiseGrid: "grid grid-cols-1 gap-2 sm:grid-cols-3",
  medList: "space-y-2",
  medRow: "flex min-w-0 items-start justify-between gap-3 rounded-med border border-[var(--border)] bg-[var(--card)] p-3",
  medIcon: "flex h-9 w-9 shrink-0 items-center justify-center rounded-med bg-[var(--surface)]",
  medInfo: "min-w-0 flex-1",
  medName: "font-bold text-[var(--text)]",
  medMeta: "text-[12px] text-[var(--muted)]",
  medRight: "text-right",
  medPrice: "font-bold text-[var(--primary)]",
  cartRows: "space-y-2",
  cartRow: "flex items-start justify-between gap-3 text-[12px]",
  cartTitle: "font-bold text-[var(--text)]",
  cartTotal: "flex items-center justify-between gap-3 border-t border-[var(--border)] pt-3 font-bold text-[var(--text)]",
  savingsRow: "rounded-med bg-sky-50 p-3 text-[12px] text-sky-700",
  sectionTop: "mb-3 flex items-center justify-between",
  tracker: "space-y-3",
  trackerHead: "flex items-start justify-between gap-3",
  trackerStatus: pill,
  step: "relative flex gap-3",
  stepLeft: "flex flex-col items-center",
  stepDot: "h-3 w-3 rounded-full bg-[var(--border)]",
  stepLine: "h-full min-h-[28px] w-px bg-[var(--border)]",
  done: "bg-sky-500",
  current: "bg-[var(--primary)]",
  pending: "bg-[var(--border)]",
  doneLine: "bg-sky-300",
  stepBadge: pill,
  stepLabel: "font-bold text-[var(--text)]",
  currentLabel: "text-[var(--primary)]",
  historySection: "space-y-3",
  historyTitle: "font-bold text-[var(--text)]",
  historyList: "space-y-2",
  historyMeta: "text-[12px] text-[var(--muted)]",
  historyRight: "text-right",
  historyTotal: "font-bold text-[var(--text)]",
  orderTime: "text-[11px] text-[var(--muted)]",
  pageSos: "grid min-h-[calc(100vh-90px)] grid-cols-1 gap-4 xl:grid-cols-[minmax(0,1fr)_420px]",
  alert: "rounded-med bg-red-50 px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.08em] text-red-700",
  ring: "mx-auto flex h-44 w-44 items-center justify-center rounded-full border border-red-200 bg-red-50 shadow-[0_0_0_10px_rgba(239,68,68,0.08),0_22px_50px_rgba(239,68,68,0.22)]",
  ringing: "animate-pulse",
  inner: "flex h-32 w-32 items-center justify-center rounded-full bg-[linear-gradient(135deg,#ef4444,#b91c1c)] text-xl font-semibold text-white shadow-[0_16px_34px_rgba(185,28,28,0.35)]",
  hint: "text-center text-[12px] text-[var(--muted)]",
  connecting: "text-center font-bold text-sky-700",
  connected: "text-center font-bold text-sky-700",
  helpline: "rounded-med border border-[var(--border)] bg-[var(--surface)] p-3 text-center",
  helplineLabel: "text-[10px] font-semibold uppercase tracking-[0.08em] text-[var(--muted)]",
  helplineNumber: "font-display text-[24px] font-bold text-[var(--accent)]",
  infoTitle: "font-display text-[18px] font-bold text-[var(--text)]",
  infoSubtitle: "text-[12px] text-[var(--muted)]",
  panelLabel: "text-[10px] font-semibold uppercase tracking-[0.08em] text-[var(--muted)]",
  statusText: "mt-1 break-words text-[13px] font-bold text-[var(--text)]",
  sosMap: "min-h-[180px] overflow-hidden rounded-med bg-[var(--surface)]",
  hospitalHeader: "flex items-center justify-between gap-3",
  hospitalList: "space-y-2",
  hospitalMain: "min-w-0 flex-1",
  hospitalActions: "mt-2 flex flex-wrap gap-2",
  rank: "flex h-8 w-8 shrink-0 items-center justify-center rounded-med bg-[var(--primary-dim)] font-semibold text-[var(--primary)]",
  checklist: "rounded-med border border-[var(--border)] bg-[var(--surface)] p-3",
  overlay: "fixed inset-0 z-[260] bg-black/40",
};

export const appShellStyles = createStyles({
  shell:
    "grid h-screen grid-cols-[232px_minmax(0,1fr)] grid-rows-[56px_minmax(0,1fr)] overflow-hidden bg-[var(--bg)] text-[var(--text)] max-[900px]:grid-cols-[188px_minmax(0,1fr)] max-[700px]:grid-cols-1 max-[700px]:grid-rows-[auto_minmax(0,1fr)]",
  main:
    "min-w-0 overflow-y-auto bg-transparent p-4 max-[700px]:p-3 max-[700px]:pb-[calc(96px+env(safe-area-inset-bottom,0px))]",
  content: "mx-auto min-h-full w-full max-w-[var(--main-content-max)] min-w-0",
});

export const adminShellStyles = createStyles({
  shell:
    "min-h-screen bg-[var(--bg)] text-[var(--text)]",
  workspace:
    "relative flex min-h-[calc(100vh-56px)] bg-[var(--bg)]",
  mobileMenuButton:
    "hidden",
  mobileMenuButtonOpen: "border-[var(--border)] bg-[var(--text)]",
  backdrop:
    "hidden",
  backdropVisible: "!opacity-100 !pointer-events-auto",
  sidebar:
    "sticky top-[56px] z-[190] flex h-[calc(100vh-56px)] w-[292px] shrink-0 flex-col gap-4 border-r border-[var(--border)] bg-[linear-gradient(180deg,rgba(18,29,45,0.98),rgba(9,14,24,0.96))] p-3 shadow-[12px_0_36px_rgba(0,0,0,0.26)] backdrop-blur transition-all max-[980px]:hidden",
  collapsed: "min-[981px]:w-[92px]",
  mobileOpen: "max-[980px]:!translate-x-0",
  sidebarHeader:
    "flex items-center justify-between gap-3 rounded-med border border-[var(--border)] bg-[var(--card)] p-2.5 shadow-[0_10px_28px_var(--admin-shadow)]",
  identityBlock: "flex min-w-0 items-center gap-3",
  identityAvatar:
    "flex h-10 w-10 shrink-0 items-center justify-center rounded-med border border-[var(--primary-border)] bg-[var(--primary-dim)] text-[13px] font-semibold text-[var(--primary)] shadow-sm ring-2 ring-[var(--primary-dim)]",
  identityCopy: "flex min-w-0 flex-col gap-0.5 [&_span]:truncate [&_span]:text-[11px] [&_span]:text-[var(--muted)] [&_strong]:text-[14px] [&_strong]:font-semibold [&_strong]:text-[var(--primary)]",
  collapseBtn:
    "inline-flex h-9 w-9 shrink-0 items-center justify-center rounded-med border border-[var(--border)] bg-[var(--card)] text-[var(--muted)] hover:bg-[var(--card2)] max-[980px]:hidden",
  mobileCloseButton:
    "hidden h-10 w-10 shrink-0 items-center justify-center rounded-med border border-[var(--border)] bg-[var(--card)] p-0 text-[var(--text)] hover:bg-[var(--card2)]",
  sidebarBody: "flex flex-1 flex-col gap-4 overflow-y-auto pr-0.5",
  navSection: "flex flex-col gap-2.5",
  sectionLabel: "px-1.5 text-[11px] font-semibold uppercase tracking-[0.08em] text-[var(--muted)]",
  nav: "flex flex-col gap-1.5",
  navItem:
    "group flex w-full min-w-0 items-center gap-3 rounded-med border border-transparent bg-transparent p-2.5 text-left text-[var(--muted)] transition hover:border-[var(--primary-border)] hover:bg-[rgba(107,182,255,0.08)] hover:text-[var(--text)]",
  active:
    "border-[var(--primary-border)] bg-[linear-gradient(135deg,rgba(107,182,255,0.18),rgba(107,182,255,0.08))] text-[var(--primary)] shadow-[inset_3px_0_0_var(--primary),0_10px_24px_rgba(0,0,0,0.18)]",
  navIcon:
    "inline-flex h-10 w-10 shrink-0 items-center justify-center rounded-med border border-[var(--border)] bg-[var(--card)] text-inherit group-hover:border-[var(--subtle)]",
  navCopy: "flex min-w-0 flex-1 flex-col gap-0.5",
  navLabel: "text-[13px] font-semibold text-inherit",
  navMeta: "text-[11px] leading-snug text-[var(--muted)]",
  sidebarFooter: "flex flex-col gap-2.5 pt-1",
  footerCard:
    "flex min-w-0 flex-col gap-1 rounded-med border border-[var(--primary-border)] bg-[linear-gradient(135deg,rgba(107,182,255,0.14),rgba(107,182,255,0.06))] p-3 shadow-sm [&_strong]:truncate [&_strong]:text-[13px] [&_strong]:font-semibold [&_strong]:text-[var(--text)]",
  footerLabel: "text-[10px] font-semibold uppercase tracking-[0.08em] text-[var(--muted)]",
  adminRolePill:
    "mt-1 inline-flex w-fit rounded-med border border-[var(--primary-border)] bg-[var(--card)] px-2 py-1 text-[10px] font-semibold uppercase tracking-[0.08em] text-[var(--primary)]",
  logoutButton:
    "group flex w-full items-center gap-2 rounded-med border border-red-400/25 bg-red-500/10 px-2.5 py-2 text-left text-[12px] font-medium text-red-200 shadow-[0_8px_18px_rgba(0,0,0,0.12)] transition hover:border-red-300/45 hover:bg-red-500/18 hover:text-red-100 hover:shadow-[0_10px_22px_rgba(248,113,113,0.10)] [&_span:first-child]:h-8 [&_span:first-child]:w-8 [&_span:first-child]:border-red-300/25 [&_span:first-child]:bg-red-500/10 [&_svg]:h-4 [&_svg]:w-4 [&_svg]:text-red-200 group-hover:[&_svg]:text-red-100",
  main:
    "min-w-0 flex-1 p-4 max-[980px]:p-3 max-[980px]:pb-[calc(96px+env(safe-area-inset-bottom,0px))] max-[560px]:p-2.5 max-[560px]:pb-[calc(96px+env(safe-area-inset-bottom,0px))]",
  mainExpanded: "pl-3",
  content: "mx-auto min-h-full w-full max-w-[var(--main-content-max)] min-w-0",
  bottomNav:
    "pointer-events-none fixed inset-x-0 bottom-0 z-[220] hidden px-2 pb-[calc(8px+env(safe-area-inset-bottom,0px))] max-[980px]:block",
  bottomNavScroller:
    "pointer-events-auto mx-auto flex max-w-[560px] items-center gap-1.5 overflow-x-auto rounded-med border border-[var(--border)] bg-[var(--nav-bg)] p-1.5 shadow-[0_14px_34px_rgba(0,0,0,0.32)] backdrop-blur [scrollbar-width:none] [&::-webkit-scrollbar]:hidden",
  bottomNavItem:
    "flex h-[58px] min-w-[70px] shrink-0 flex-col items-center justify-center gap-1 rounded-med border border-transparent bg-transparent px-2 text-[var(--muted)] transition active:scale-[0.98] hover:bg-[var(--card2)]",
  bottomNavActive:
    "border-[var(--primary-border)] bg-[var(--primary-dim)] text-[var(--primary)] shadow-[inset_0_-3px_0_var(--primary)]",
  bottomNavIcon:
    "inline-flex h-5 w-5 shrink-0 items-center justify-center [&_svg]:h-[18px] [&_svg]:w-[18px]",
  bottomNavText:
    "max-w-[64px] truncate text-[10px] font-semibold leading-none",
});

export const sidebarStyles = createStyles({
  mobileMenuButton:
    "hidden",
  mobileMenuButtonOpen: "border-[var(--border)] bg-[var(--text)]",
  mobileBackdrop:
    "hidden",
  mobileBackdropVisible: "!opacity-100 !pointer-events-auto",
  sidebar:
    "flex min-h-0 flex-col gap-1 overflow-hidden border-r border-[var(--border)] bg-[linear-gradient(180deg,var(--surface),rgba(255,255,255,0.72))] p-3 shadow-[10px_0_30px_rgba(19,34,53,0.06)] max-[700px]:hidden",
  mobileOpen: "max-[700px]:!translate-x-0",
  mobileHeader:
    "hidden items-center justify-between rounded-med border border-[var(--primary-border)] bg-[var(--primary-dim)] p-2.5 max-[700px]:flex [&_strong]:text-[14px] [&_strong]:font-semibold [&_strong]:text-[var(--primary)]",
  mobileCloseButton:
    "inline-flex h-10 w-10 shrink-0 items-center justify-center rounded-med border border-[var(--border)] bg-[var(--card)] p-0 text-[var(--text)] hover:bg-[var(--card2)]",
  label:
    "px-2 pb-1.5 text-[10px] font-bold uppercase tracking-[0.08em] text-[var(--muted)] max-[700px]:hidden",
  nav:
    "flex flex-col gap-0.5",
  navItem:
    "flex w-full items-center gap-2.5 rounded-med border border-transparent px-2.5 py-2.5 text-left text-[13px] font-bold text-[var(--muted)] transition hover:border-[var(--primary-border)] hover:bg-[var(--card)] hover:text-[var(--text)]",
  active:
    "border-[var(--primary-border)] bg-[linear-gradient(135deg,var(--primary-dim),var(--blue-dim))] font-semibold !text-[var(--primary)] shadow-[inset_3px_0_0_var(--primary)]",
  navIcon: "inline-flex shrink-0 items-center justify-center",
  navText: "inline",
  mobileText:
    "hidden",
  spacer: "flex-1 max-[700px]:hidden",
  sosBtn:
    "mb-2 flex w-full items-center gap-2.5 rounded-med border border-red-200 bg-[linear-gradient(135deg,rgba(239,68,68,0.16),rgba(248,113,113,0.10))] px-3 py-2.5 text-left text-[13px] font-semibold text-red-700 shadow-[0_10px_26px_rgba(239,68,68,0.18)] ring-1 ring-red-200 transition hover:border-red-300 hover:bg-red-50 hover:shadow-[0_12px_30px_rgba(239,68,68,0.26)]",
  sosActive: "bg-[linear-gradient(135deg,#ef4444,#b91c1c)] text-white shadow-[inset_0_-3px_0_rgba(255,255,255,0.35),0_12px_32px_rgba(239,68,68,0.32)] [&_.sosPulse]:bg-white",
  sosIconWrap: "inline-flex shrink-0 items-center justify-center",
  sosPulse: "sosPulse h-2.5 w-2.5 shrink-0 animate-ping rounded-full bg-red-600",
  logoutBtn:
    "flex w-full items-center gap-2.5 rounded-med border border-red-200 bg-red-50 px-3 py-2.5 text-left text-[13px] font-bold text-red-600 shadow-[0_8px_18px_rgba(239,68,68,0.08)] transition hover:border-red-300 hover:bg-red-100 hover:text-red-700 hover:shadow-[0_10px_22px_rgba(239,68,68,0.14)] [&_svg]:text-red-600 hover:[&_svg]:text-red-700",
  bottomNav:
    "pointer-events-none fixed inset-x-0 bottom-0 z-[220] hidden px-2 pb-[calc(8px+env(safe-area-inset-bottom,0px))] max-[700px]:block",
  bottomNavScroller:
    "pointer-events-auto mx-auto flex max-w-[560px] items-center gap-1.5 overflow-x-auto rounded-med border border-[var(--border)] bg-[var(--nav-bg)] p-1.5 shadow-[0_14px_34px_rgba(16,32,51,0.18)] backdrop-blur [scrollbar-width:none] [&::-webkit-scrollbar]:hidden",
  bottomNavItem:
    "flex h-[58px] min-w-[68px] shrink-0 flex-col items-center justify-center gap-1 rounded-med border border-transparent bg-transparent px-2 text-[var(--muted)] transition active:scale-[0.98] hover:bg-[var(--card2)]",
  bottomNavActive:
    "border-[var(--primary-border)] bg-[var(--primary-dim)] !text-[var(--primary)] shadow-[inset_0_-3px_0_var(--primary)]",
  bottomSosItem:
    "min-w-[58px] border-red-200 bg-[linear-gradient(135deg,rgba(239,68,68,0.16),rgba(248,113,113,0.10))] text-red-700 shadow-[0_8px_20px_rgba(239,68,68,0.16)]",
  bottomSosActive:
    "bg-[linear-gradient(135deg,#ef4444,#b91c1c)] text-white shadow-[inset_0_-3px_0_rgba(255,255,255,0.45),0_10px_26px_rgba(239,68,68,0.32)] [&_.sosPulse]:bg-white",
  bottomNavIcon:
    "inline-flex h-5 w-5 shrink-0 items-center justify-center [&_svg]:h-[18px] [&_svg]:w-[18px]",
  bottomNavText:
    "max-w-[62px] truncate text-[10px] font-semibold leading-none",
});

export const topNavbarStyles = createStyles({
  navbar:
    "col-span-full sticky top-0 z-[100] flex min-h-[56px] items-center gap-4 border-b border-[var(--border)] bg-[var(--nav-bg)] px-5 shadow-[0_8px_24px_var(--admin-shadow)] backdrop-blur-xl max-[760px]:gap-2.5 max-[760px]:px-3 max-[560px]:h-auto max-[560px]:flex-wrap max-[560px]:py-2",
  logo:
    "font-display flex min-h-10 shrink-0 items-center gap-2 bg-transparent p-0 text-[17px] font-bold text-[var(--primary)]",
  logoImage: "block h-[38px] w-[46px] shrink-0 object-contain max-[760px]:h-[34px] max-[760px]:w-[41px]",
  badge: "rounded-med border border-[var(--primary-border)] bg-[var(--primary-dim)] px-1.5 py-0.5 text-[10px] font-semibold uppercase tracking-[0.05em] text-[var(--primary)]",
  search:
    "relative mx-auto flex h-10 min-w-0 max-w-[460px] flex-1 items-center gap-2 rounded-med border border-[var(--border)] bg-[var(--card)] px-3 shadow-[0_8px_22px_rgba(19,34,53,0.06)] transition focus-within:border-[var(--primary)] focus-within:shadow-[0_0_0_3px_var(--primary-dim)] max-[760px]:max-w-none max-[560px]:order-3 max-[560px]:m-0 max-[560px]:h-[38px] max-[560px]:basis-full [&_input]:min-w-0 [&_input]:flex-1 [&_input]:border-0 [&_input]:bg-transparent [&_input]:text-[13px] [&_input]:font-normal [&_input]:text-[var(--text)] [&_input]:outline-none [&_input::placeholder]:text-[var(--muted)]",
  clearSearch:
    "flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-[var(--card2)] text-[14px] text-[var(--muted)]",
  searchMenu:
    "absolute left-0 right-0 top-[calc(100%+8px)] z-[220] rounded-med border border-[var(--border)] bg-[var(--card)] p-1.5 shadow-[0_22px_54px_rgba(19,34,53,0.16)]",
  searchItem:
    "flex w-full flex-col gap-0.5 rounded-med bg-transparent p-2.5 text-left hover:bg-[var(--card2)] [&_small]:text-[11px] [&_small]:text-[var(--muted)] [&_span]:text-[12px] [&_span]:font-semibold [&_span]:text-[var(--text)]",
  right: "ml-auto flex items-center gap-3",
  notificationWrap: "relative",
  accountWrap: "relative",
  notificationPanel:
    "absolute right-0 top-[calc(100%+10px)] z-[240] min-w-[280px] rounded-med border border-[var(--border)] bg-[var(--card)] p-3 text-[var(--text)] shadow-[0_22px_54px_rgba(19,34,53,0.16)] max-[560px]:right-[-44px] max-[560px]:w-[min(300px,calc(100vw-24px))]",
  notificationPanelHeader:
    "flex items-start justify-between gap-3 pb-2.5 [&_strong]:block [&_strong]:text-[13px] [&_strong]:font-semibold [&_span]:mt-0.5 [&_span]:block [&_span]:text-[11px] [&_span]:text-[var(--muted)]",
  notificationStatus:
    "shrink-0 rounded bg-[var(--card2)] px-2 py-1 text-[10px] font-semibold text-[var(--muted)]",
  notificationStatusActive: "bg-[var(--primary-dim)] text-[var(--primary)]",
  notificationList: "flex flex-col gap-1.5",
  notificationItem:
    "flex w-full flex-col gap-1 rounded-med bg-[var(--surface)] p-2.5 text-left hover:bg-[var(--card2)] [&_small]:line-clamp-2 [&_small]:text-[11px] [&_small]:text-[var(--muted)] [&_span]:text-[12px] [&_span]:font-semibold [&_span]:text-[var(--text)] [&_time]:mt-0.5 [&_time]:text-[10px] [&_time]:font-bold [&_time]:text-[var(--muted)]",
  notificationEmpty: "rounded-med bg-[var(--surface)] p-3 text-[12px] text-[var(--muted)]",
  notificationActions:
    "mt-2.5 flex justify-end gap-2 [&_button]:rounded [&_button]:bg-[var(--primary)] [&_button]:px-2.5 [&_button]:py-2 [&_button]:text-[11px] [&_button]:font-semibold [&_button]:text-white [&_button:last-child]:bg-[var(--card2)] [&_button:last-child]:text-[var(--text)]",
  userInfo:
    "flex min-h-[40px] items-center gap-2 rounded-med border border-transparent bg-transparent py-0.5 pl-0.5 pr-1.5 text-left text-[var(--text)] transition hover:border-[var(--primary-border)] hover:bg-[var(--card)] max-[760px]:min-h-[34px] max-[760px]:p-0 max-[760px]:[&_svg:last-child]:hidden",
  userInfoActive: "border-[var(--border)] bg-[var(--card)]",
  avatar:
    "flex h-8 w-8 shrink-0 items-center justify-center overflow-hidden rounded-med border border-[var(--border)] bg-[var(--primary-dim)] text-[12px] font-bold text-[var(--primary)] [&_img]:h-full [&_img]:w-full [&_img]:object-cover",
  userName: "max-w-[120px] truncate text-[13px] font-medium text-[var(--text)] max-[760px]:hidden",
  accountMenu:
    "absolute right-0 top-[calc(100%+10px)] z-[245] min-w-[230px] rounded-med border border-[var(--border)] bg-[var(--card)] p-2 text-[var(--text)] shadow-[0_22px_54px_rgba(19,34,53,0.16)] max-[560px]:top-[calc(100%+8px)] max-[560px]:w-[min(260px,calc(100vw-24px))]",
  accountHeader:
    "mb-1.5 flex items-center gap-2.5 border-b border-[var(--border)] px-2 py-2.5 [&_span]:block [&_span]:max-w-[150px] [&_span]:truncate [&_span]:text-[11px] [&_span]:text-[var(--muted)] [&_strong]:block [&_strong]:max-w-[150px] [&_strong]:truncate [&_strong]:text-[13px] [&_strong]:font-semibold",
  accountAvatar:
    "flex h-9 w-9 shrink-0 items-center justify-center overflow-hidden rounded-med border border-[var(--border)] bg-[var(--primary-dim)] text-[12px] font-semibold text-[var(--primary)] [&_img]:h-full [&_img]:w-full [&_img]:object-cover",
  accountMenuItem:
    "flex w-full items-center gap-2.5 rounded-med bg-transparent p-2.5 text-left text-[12px] font-semibold text-[var(--text)] hover:bg-[var(--card2)] [&_svg]:shrink-0 [&_svg]:text-[var(--muted)]",
  accountMenuDanger:
    "!text-[var(--accent)] hover:!bg-[var(--card2)] [&_svg]:!text-[var(--accent)]",
  notificationCount:
    "absolute -right-1.5 -top-1.5 flex h-4 min-w-4 items-center justify-center rounded-full border-2 border-[var(--surface)] bg-[var(--accent)] px-1 text-[9px] font-bold leading-3 text-white",
});

export const uiStyles = createStyles({
  pageHeader:
    "relative min-w-0 overflow-hidden rounded-med border border-[var(--primary-border)] bg-[linear-gradient(135deg,rgba(29,114,243,0.18),rgba(29,114,243,0.10),rgba(217,119,6,0.06)),var(--card)] p-5 shadow-[0_18px_42px_var(--admin-shadow)] flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between",
  pageHeaderCopy:
    "min-w-0 [&_span]:text-[10px] [&_span]:font-semibold [&_span]:uppercase [&_span]:tracking-[0.08em] [&_span]:text-[var(--primary)] [&_h1]:m-0 [&_h1]:font-display [&_h1]:text-[24px] [&_h1]:font-bold [&_h1]:leading-tight [&_h1]:text-[var(--text)] [&_p]:mt-1 [&_p]:max-w-3xl [&_p]:break-words [&_p]:text-[13px] [&_p]:leading-relaxed [&_p]:text-[var(--muted)]",
  pageHeaderActions:
    "flex shrink-0 flex-wrap items-center justify-end gap-2 max-[640px]:w-full max-[640px]:justify-start",
  filterBar:
    "flex min-w-0 flex-wrap items-center gap-2 rounded-med border border-[var(--border)] bg-[var(--surface)] p-2.5 shadow-[0_10px_24px_var(--admin-shadow)]",
  filterSelect:
    "inline-flex min-h-[var(--control-height)] min-w-[210px] items-center gap-2 rounded-med border border-[var(--border)] bg-[var(--card)] px-3 py-2 shadow-[0_6px_14px_rgba(19,34,53,0.04)] transition focus-within:border-[var(--primary-border)] focus-within:shadow-[0_0_0_3px_var(--primary-dim)] hover:border-[var(--primary-border)] max-[520px]:w-full [&_span]:shrink-0 [&_span]:text-[10px] [&_span]:font-semibold [&_span]:uppercase [&_span]:tracking-[0.08em] [&_span]:text-[var(--muted)] [&_select]:min-w-0 [&_select]:flex-1 [&_select]:border-0 [&_select]:bg-transparent [&_select]:text-[13px] [&_select]:font-bold [&_select]:text-[var(--text)] [&_select]:outline-none",
  searchField:
    "inline-flex min-h-[var(--control-height)] min-w-[260px] items-center gap-2 rounded-med border border-[var(--border)] bg-[var(--card)] px-3 py-2 shadow-[0_6px_14px_rgba(19,34,53,0.04)] transition focus-within:border-[var(--primary-border)] focus-within:shadow-[0_0_0_3px_var(--primary-dim)] hover:border-[var(--primary-border)] max-[560px]:w-full [&_span]:shrink-0 [&_span]:text-[10px] [&_span]:font-semibold [&_span]:uppercase [&_span]:tracking-[0.08em] [&_span]:text-[var(--muted)] [&_input]:min-w-0 [&_input]:flex-1 [&_input]:border-0 [&_input]:bg-transparent [&_input]:text-[13px] [&_input]:font-bold [&_input]:text-[var(--text)] [&_input]:outline-none [&_button]:shrink-0 [&_button]:rounded-med [&_button]:bg-[var(--card2)] [&_button]:px-2 [&_button]:py-1 [&_button]:text-[10px] [&_button]:font-semibold [&_button]:text-[var(--muted)]",
  segmentedFilter:
    "flex max-w-full gap-1 overflow-x-auto rounded-med border border-[var(--border)] bg-[var(--surface)] p-1 shadow-[inset_0_1px_0_rgba(255,255,255,0.04)] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden",
  segmentedButton:
    "inline-flex min-h-[36px] shrink-0 items-center justify-center gap-1.5 rounded-med border border-transparent bg-transparent px-3 py-2 text-[12px] font-bold capitalize text-[var(--muted)] transition hover:border-[var(--primary-border)] hover:bg-[var(--card2)] hover:text-[var(--text)] [&_strong]:text-[10px] [&_strong]:font-semibold [&_strong]:text-inherit",
  segmentedButtonActive:
    "border-[var(--primary-border)] bg-[linear-gradient(135deg,var(--primary-dim),rgba(94,168,255,0.10))] text-[var(--primary)] shadow-[0_6px_16px_rgba(94,168,255,0.12)]",
  binaryFilter:
    "inline-flex min-h-[40px] items-center gap-2 rounded-med border border-[var(--border)] bg-[var(--card)] px-3 py-2 text-[12px] font-semibold text-[var(--muted)] transition hover:border-[var(--primary-border)] hover:bg-[var(--card2)] hover:text-[var(--text)] disabled:cursor-not-allowed disabled:opacity-60 max-[520px]:w-full max-[520px]:justify-center",
  binaryFilterActive:
    "border-[var(--primary-border)] bg-[var(--primary-dim)] text-[var(--primary)]",
  binaryTrack:
    "relative h-5 w-9 shrink-0 rounded-full border border-[var(--border)] bg-[var(--surface)] transition-colors duration-200",
  binaryTrackActive:
    "border-[var(--primary-border)] bg-[var(--primary)]",
  binaryKnob:
    "absolute left-0.5 top-0.5 h-4 w-4 rounded-full bg-[var(--muted)] shadow transition duration-200",
  binaryKnobOn: "translate-x-4 bg-white",
  panelBackdrop:
    "fixed inset-0 z-[300] flex items-center justify-center bg-black/55 p-4 backdrop-blur-sm",
  panelModal:
    "flex max-h-[92vh] w-full max-w-4xl flex-col overflow-hidden rounded-med border border-[var(--border)] bg-[linear-gradient(180deg,var(--card),var(--surface))] text-left shadow-[0_28px_70px_rgba(0,0,0,0.38)]",
  panelHeader:
    "flex items-start justify-between gap-3 border-b border-[var(--border)] p-4 max-[640px]:flex-col",
  panelTitle:
    "min-w-0 [&_span]:text-[10px] [&_span]:font-semibold [&_span]:uppercase [&_span]:tracking-[0.08em] [&_span]:text-[var(--primary)] [&_h2]:m-0 [&_h2]:break-words [&_h2]:font-display [&_h2]:text-[20px] [&_h2]:font-bold [&_h2]:text-[var(--text)] [&_p]:mt-1 [&_p]:break-words [&_p]:text-[13px] [&_p]:text-[var(--muted)]",
  panelClose:
    "shrink-0 rounded-med border border-[var(--border)] bg-[var(--surface)] px-3 py-2 text-[12px] font-bold text-[var(--text)] transition hover:border-[var(--primary-border)] hover:bg-[var(--card2)]",
  panelBody: "min-h-0 overflow-y-auto p-4",
  panelFooter:
    "flex flex-wrap items-center justify-between gap-3 border-t border-[var(--border)] bg-[var(--surface)] p-4",
  mobileActionBar:
    "fixed inset-x-0 bottom-0 z-[260] hidden border-t border-[var(--border)] bg-[var(--nav-bg)] p-2 shadow-[0_-14px_34px_rgba(0,0,0,0.18)] backdrop-blur max-[700px]:flex max-[700px]:gap-2 max-[700px]:pb-[calc(8px+env(safe-area-inset-bottom,0px))] [&_button]:flex-1",
  formSection:
    "min-w-0 rounded-med border border-[var(--border)] bg-[linear-gradient(180deg,var(--card),var(--surface))] p-4 shadow-[0_14px_34px_var(--admin-shadow)]",
  formSectionHeader:
    "mb-3 flex min-w-0 items-start justify-between gap-3 border-b border-[var(--border)] pb-3 max-[640px]:flex-col [&_span:first-child]:text-[10px] [&_span:first-child]:font-semibold [&_span:first-child]:uppercase [&_span:first-child]:tracking-[0.08em] [&_span:first-child]:text-[var(--primary)] [&_h2]:m-0 [&_h2]:font-display [&_h2]:text-[18px] [&_h2]:font-bold [&_h2]:text-[var(--text)] [&_p]:mt-1 [&_p]:break-words [&_p]:text-[12px] [&_p]:text-[var(--muted)]",
  formSectionBody: "min-w-0",
  summaryCard:
    "min-w-0 rounded-med border border-[var(--border)] bg-[linear-gradient(180deg,var(--card),var(--surface))] p-4 shadow-[0_12px_28px_var(--admin-shadow)]",
  summaryCard_success: "border-sky-200",
  summaryCard_warning: "border-amber-200",
  summaryCard_danger: "border-sky-200",
  summaryCard_info: "border-sky-200",
  summaryCardTop:
    "mb-3 flex min-w-0 items-start justify-between gap-3 [&_span]:text-[10px] [&_span]:font-semibold [&_span]:uppercase [&_span]:tracking-[0.08em] [&_span]:text-[var(--primary)] [&_h3]:m-0 [&_h3]:break-words [&_h3]:font-display [&_h3]:text-[17px] [&_h3]:font-bold [&_h3]:text-[var(--text)] [&_p]:mt-1 [&_p]:break-words [&_p]:text-[12px] [&_p]:text-[var(--muted)] [&_strong]:shrink-0 [&_strong]:font-display [&_strong]:text-[22px] [&_strong]:font-bold [&_strong]:text-[var(--primary)]",
  summaryCardBody: "mb-3 min-w-0 text-[13px] text-[var(--muted)]",
  dataTableWrap:
    "min-w-0 overflow-x-auto rounded-med border border-[var(--border)] bg-[var(--card)] shadow-[0_14px_34px_var(--admin-shadow)]",
  dataTable:
    "w-full min-w-[720px] border-collapse text-left [&_th]:border-b [&_th]:border-[var(--border)] [&_th]:bg-[var(--surface)] [&_th]:px-3 [&_th]:py-3 [&_th]:text-[11px] [&_th]:font-semibold [&_th]:uppercase [&_th]:tracking-[0.06em] [&_th]:text-[var(--muted)] [&_td]:border-b [&_td]:border-[var(--border)] [&_td]:px-3 [&_td]:py-3 [&_td]:align-top [&_td]:text-[13px] [&_td]:text-[var(--text)] [&_tr:last-child_td]:border-b-0",
  stepProgress:
    "flex min-w-0 flex-wrap items-center gap-2 rounded-med border border-[var(--border)] bg-[var(--surface)] p-2",
  stepItem:
    "flex min-h-[38px] min-w-0 flex-1 items-center gap-2 rounded-med border border-transparent px-2.5 py-2 text-[12px] font-bold text-[var(--muted)] max-[560px]:basis-full [&_span]:flex [&_span]:h-6 [&_span]:w-6 [&_span]:shrink-0 [&_span]:items-center [&_span]:justify-center [&_span]:rounded-full [&_span]:bg-[var(--card2)] [&_span]:text-[11px] [&_span]:font-semibold [&_strong]:truncate",
  stepActive:
    "border-[var(--primary-border)] bg-[var(--primary-dim)] text-[var(--primary)]",
  stepDone:
    "border-sky-200 bg-sky-50 text-sky-700",
  badge: "inline-flex items-center rounded-med px-2 py-1 text-[11px] font-semibold",
  badge_success: "bg-sky-50 text-sky-700",
  badge_warning: "bg-amber-50 text-amber-700",
  badge_danger: "bg-red-50 text-red-700",
  badge_default: "bg-[var(--surface)] text-[var(--muted)]",
  statusPill:
    "inline-flex shrink-0 items-center justify-center rounded-med border px-2.5 py-1 text-[11px] font-semibold capitalize leading-tight",
  statusPill_success: "border-sky-200 bg-sky-50 text-sky-700",
  statusPill_active: "border-sky-200 bg-sky-50 text-sky-700",
  statusPill_available: "border-sky-200 bg-sky-50 text-sky-700",
  statusPill_verified: "border-sky-200 bg-sky-50 text-sky-700",
  statusPill_warning: "border-amber-200 bg-amber-50 text-amber-700",
  statusPill_pending: "border-amber-200 bg-amber-50 text-amber-700",
  statusPill_processing: "border-sky-200 bg-sky-50 text-sky-700",
  statusPill_info: "border-sky-200 bg-sky-50 text-sky-700",
  statusPill_confirmed: "border-sky-200 bg-sky-50 text-sky-700",
  statusPill_shipped: "border-indigo-200 bg-indigo-50 text-indigo-700",
  statusPill_delivered: "border-sky-200 bg-sky-50 text-sky-700",
  statusPill_danger: "border-sky-200 bg-sky-50 text-sky-700",
  statusPill_error: "border-sky-200 bg-sky-50 text-sky-700",
  statusPill_blocked: "border-sky-200 bg-sky-50 text-sky-700",
  statusPill_cancelled: "border-sky-200 bg-sky-50 text-sky-700",
  statusPill_expired: "border-slate-200 bg-slate-100 text-slate-600",
  statusPill_default: "border-[var(--border)] bg-[var(--surface)] text-[var(--muted)]",
  statusBadge: "inline-flex items-center gap-1.5 rounded-med px-2 py-1 text-[11px] font-semibold",
  online: "bg-sky-50 text-sky-700",
  offline: "bg-slate-100 text-slate-600",
  statusDot: "h-2 w-2 rounded-full bg-current",
  avatar:
    "flex shrink-0 items-center justify-center overflow-hidden rounded-med border border-[var(--border)] bg-[var(--primary-dim)] font-semibold text-[var(--primary)] [&_img]:h-full [&_img]:w-full [&_img]:object-cover",
  btn:
    "inline-flex min-h-[var(--control-height)] items-center justify-center gap-2 rounded-med px-4 py-2 text-[12px] font-semibold transition disabled:cursor-not-allowed disabled:opacity-60",
  btn_primary: "border border-transparent bg-[linear-gradient(135deg,var(--primary),#1557C8)] text-white shadow-[0_10px_22px_rgba(29,114,243,0.18)] enabled:hover:-translate-y-px enabled:hover:shadow-[0_14px_28px_rgba(29,114,243,0.22)]",
  btn_outline: "border border-[var(--border)] bg-[var(--card)] text-[var(--text)] shadow-[0_6px_16px_rgba(19,34,53,0.05)] enabled:hover:-translate-y-px enabled:hover:border-[var(--primary-border)] enabled:hover:bg-[var(--card2)] enabled:hover:text-[var(--primary)]",
  btn_ghost: "bg-transparent text-[var(--text)] hover:bg-[var(--card2)] hover:text-[var(--primary)]",
  btn_danger: "border border-[var(--accent-border)] bg-[var(--accent-dim)] text-[var(--accent)] hover:bg-[var(--card2)]",
  fullWidth: "w-full",
  statCard:
    "relative min-w-0 overflow-hidden rounded-med border border-[var(--primary-border)] bg-[linear-gradient(145deg,var(--card),var(--surface))] p-4 shadow-[0_16px_38px_var(--admin-shadow)] ring-1 ring-[rgba(148,163,184,0.10)] before:pointer-events-none before:absolute before:inset-x-0 before:top-0 before:h-[3px] before:bg-[linear-gradient(90deg,var(--primary),rgba(94,168,255,0.62),transparent)] after:pointer-events-none after:absolute after:-right-10 after:-top-10 after:h-24 after:w-24 after:rounded-full after:bg-[var(--primary-dim)]",
  statLabel: "relative z-[1] text-[11px] font-semibold uppercase tracking-[0.06em] text-[var(--muted)]",
  statValue: "relative z-[1] mt-2 font-display text-[30px] font-bold leading-none text-[var(--text)]",
  statSub: "relative z-[1] mt-2 text-[11px] font-bold text-[var(--muted)]",
  statUp: "text-sky-700",
  statDown: "text-sky-700",
  sectionHeader: "mb-3 flex items-center justify-between gap-3",
  sectionTitle: "font-display text-[16px] font-bold text-[var(--text)]",
  sectionAction: "cursor-pointer text-[12px] font-bold text-[var(--primary)]",
  iconBtn:
    "relative inline-flex h-9 w-9 items-center justify-center rounded-med border border-[var(--border)] bg-[var(--card)] text-[var(--muted)] hover:bg-[var(--card2)] hover:text-[var(--text)]",
  iconBtnActive: "border-[var(--primary-border)] bg-[var(--primary-dim)] text-[var(--primary)]",
  iconBadge: "absolute right-1.5 top-1.5 h-2 w-2 rounded-full bg-[var(--accent)]",
  spinner:
    "inline-block animate-spin rounded-full border-4 border-[var(--border)] border-t-[var(--primary)]",
  errorMsg: "rounded-med border border-sky-200 bg-sky-50 p-4 text-[13px] text-sky-700",
  retryBtn: outlineButton,
  emptyState: "rounded-med border border-dashed border-[var(--border)] bg-[var(--surface)] p-6 text-center",
  emptyIcon: "mb-2 text-3xl",
  emptyTitle: "font-bold text-[var(--text)]",
  emptySub: "mt-1 text-[12px] text-[var(--muted)]",
  modalBackdrop: "fixed inset-0 z-[250] flex items-center justify-center bg-black/35 p-4",
  modalBackdropPriority: "z-[300]",
  modalContent: "max-h-[90vh] w-full max-w-2xl overflow-y-auto rounded-med bg-[var(--card)] text-left shadow-xl",
  modalHeader: "flex items-center justify-between gap-3 border-b border-[var(--border)] p-4",
  modalTitle: "font-display text-[18px] font-bold text-[var(--text)]",
  modalClose: "rounded-med p-2 text-[var(--muted)] hover:bg-[var(--card2)] hover:text-[var(--text)]",
  modalBody: "p-4",
  modalFooter: "flex justify-end gap-2 border-t border-[var(--border)] p-4",
});

export const toastStyles = createStyles({
  wrap: "fixed right-4 top-4 z-[400] flex w-[min(320px,calc(100vw-24px))] flex-col gap-2.5 max-[640px]:right-3 max-[640px]:top-3",
  toast:
    "relative grid min-w-0 grid-cols-[34px_1fr_auto] items-center gap-2.5 overflow-hidden rounded-med border p-3 pr-2 text-left text-white shadow-[0_16px_36px_rgba(19,34,53,0.20)] ring-1 ring-white/20 transition duration-200 hover:-translate-y-0.5 hover:shadow-[0_20px_44px_rgba(19,34,53,0.24)]",
  icon:
    "flex h-8 w-8 shrink-0 items-center justify-center rounded-med bg-white/20 text-[16px] font-semibold leading-none text-white shadow-[inset_0_1px_0_rgba(255,255,255,0.28)] ring-1 ring-white/25",
  body: "min-w-0 flex-1",
  label: "text-[11px] font-semibold uppercase tracking-[0.08em] text-white/80",
  message: "mt-0.5 break-words text-[13px] font-semibold leading-snug text-white",
  close:
    "flex h-8 w-8 items-center justify-center rounded-med bg-white/10 text-[18px] font-semibold leading-none text-white/80 transition hover:bg-white/20 hover:text-white focus-visible:outline-white/50",
  progress: "absolute bottom-0 left-0 h-1 w-full bg-white/45",
  success:
    "border-emerald-500 bg-emerald-600",
  error:
    "border-sky-500 bg-sky-600",
  warning:
    "border-amber-500 bg-amber-600",
  info:
    "border-blue-500 bg-blue-600",
  loading:
    "border-indigo-500 bg-indigo-600",
});

export const chatbotStyles = createStyles({
  chatToggle:
    "fixed bottom-5 right-5 z-[160] flex h-12 w-12 items-center justify-center rounded-full bg-[var(--primary)] text-xl text-white shadow-xl transition hover:scale-105 max-[700px]:bottom-[calc(96px+env(safe-area-inset-bottom,0px))] max-[700px]:right-3 max-[700px]:h-11 max-[700px]:w-11",
  chatPanel:
    "fixed bottom-20 right-5 z-[160] flex h-[min(520px,calc(100vh-120px))] w-[min(380px,calc(100vw-24px))] flex-col overflow-hidden rounded-med border border-[var(--border)] bg-[var(--card)] shadow-2xl max-[700px]:bottom-[calc(150px+env(safe-area-inset-bottom,0px))] max-[700px]:left-3 max-[700px]:right-3 max-[700px]:h-[min(430px,calc(100vh-190px))] max-[700px]:w-auto",
  chatHeader: "bg-[var(--primary)] p-3 text-white",
  chatTitle: "font-bold",
  chatSub: "text-[11px] text-white/80",
  chatMessages: "flex-1 space-y-2 overflow-y-auto bg-[var(--surface)] p-3",
  messageWrap: "flex",
  messageWrapUser: "justify-end",
  messageWrapBot: "justify-start",
  message: "max-w-[82%] rounded-med p-2.5 text-[12px]",
  messageUser: "bg-[var(--primary)] text-white",
  messageBot: "bg-[var(--card)] text-[var(--text)]",
  typing: "text-[11px] text-[var(--muted)]",
  suggestions: "flex gap-2 overflow-x-auto border-t border-[var(--border)] p-2",
  suggestionBtn: "shrink-0 rounded-med border border-[var(--border)] bg-[var(--card)] px-2.5 py-1.5 text-[11px] font-bold text-[var(--text)]",
  inputRow: "flex gap-2 border-t border-[var(--border)] p-2",
  chatInput: merge(field, "min-w-0 flex-1 disabled:opacity-70"),
  sendBtn: merge(primaryButton, "disabled:opacity-70"),
});

export const adminDashboardStyles = createStyles({
  ...adminDashboardGeneratedStyles,
  page: "flex min-w-0 flex-col gap-3",
  loadingWrap: "flex min-h-[55vh] items-center justify-center p-8",
  header: merge(header, "max-[760px]:flex-col"),
  headerActions:
    "flex shrink-0 flex-wrap items-center justify-end gap-2 max-[760px]:w-full max-[760px]:justify-end",
  sectionHeader:
    "mb-3 flex min-w-0 items-start justify-between gap-3 max-[760px]:flex-col [&_h2]:m-0 [&_h2]:font-display [&_h2]:text-[18px] [&_h2]:font-bold [&_h2]:text-[var(--text)] [&_p]:mt-1 [&_p]:break-words [&_p]:text-[13px] [&_p]:text-[var(--muted)]",
  toolbar:
    "grid min-w-0 grid-cols-[minmax(220px,1fr)_auto] items-center gap-3 max-[900px]:grid-cols-1",
  searchBox:
    "flex min-h-[42px] min-w-0 items-center gap-2 rounded-med border border-[var(--border)] bg-[var(--card)] px-3 py-2 shadow-[0_8px_22px_var(--admin-shadow)] transition focus-within:border-[var(--primary-border)] focus-within:shadow-[0_0_0_3px_var(--primary-dim)] [&_span]:shrink-0 [&_span]:text-[10px] [&_span]:font-semibold [&_span]:uppercase [&_span]:tracking-[0.08em] [&_span]:text-[var(--muted)] [&_input]:min-w-0 [&_input]:flex-1 [&_input]:border-0 [&_input]:bg-transparent [&_input]:text-[13px] [&_input]:text-[var(--text)]",
  viewTabs:
    "flex min-w-0 max-w-full gap-2 overflow-x-auto rounded-med border border-[var(--border)] bg-[var(--surface)] p-1 shadow-[0_8px_22px_var(--admin-shadow)] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden",
  filters:
    "flex min-w-max gap-1 rounded-med bg-transparent p-0",
  filterBtn:
    "min-h-[36px] shrink-0 rounded-med border border-[var(--border)] bg-[var(--surface)] px-3 py-2 text-[12px] font-bold capitalize text-[var(--muted)] transition hover:border-[var(--primary-border)] hover:bg-[var(--card2)] hover:text-[var(--text)]",
  filterActive:
    "border-[var(--primary-border)] bg-[linear-gradient(135deg,var(--primary-dim),rgba(94,168,255,0.10))] text-[var(--primary)] shadow-[0_8px_18px_rgba(94,168,255,0.10)]",
  statsGrid: "grid min-w-0 grid-cols-1 gap-3 sm:grid-cols-2 xl:grid-cols-5",
  sectionCard:
    "min-w-0 rounded-med border border-[var(--border)] bg-[linear-gradient(180deg,var(--card),rgba(14,23,38,0.96))] p-3 shadow-[0_14px_34px_var(--admin-shadow)] ring-1 ring-[rgba(148,163,184,0.08)]",
  workspaceGrid: "grid min-w-0 grid-cols-1 gap-3 sm:grid-cols-2 xl:grid-cols-4",
  workspaceCard:
    "flex min-w-0 flex-col gap-2 rounded-med border border-[var(--border)] bg-[linear-gradient(180deg,var(--card),rgba(14,23,38,0.92))] p-3 shadow-[0_8px_20px_rgba(0,0,0,0.18)] transition hover:border-[var(--primary-border)] hover:bg-[linear-gradient(180deg,var(--card2),var(--card))] [&_h3]:m-0 [&_h3]:break-words [&_h3]:text-[15px] [&_h3]:font-bold [&_h3]:text-[var(--text)] [&_p]:m-0 [&_p]:break-words [&_p]:text-[12px] [&_p]:leading-relaxed [&_p]:text-[var(--muted)] [&_button]:mt-auto [&_button]:w-fit [&_button]:rounded-med [&_button]:border [&_button]:border-[var(--border)] [&_button]:bg-[var(--surface)] [&_button]:px-3 [&_button]:py-2 [&_button]:text-[12px] [&_button]:font-bold [&_button]:text-[var(--text)] [&_button:hover]:border-[var(--primary-border)] [&_button:hover]:bg-[var(--primary-dim)] [&_button:hover]:text-[var(--primary)]",
  workspaceMetric:
    "text-[10px] font-semibold uppercase tracking-[0.08em] text-[var(--primary)]",
  insightGrid: "grid min-w-0 grid-cols-1 gap-3 xl:grid-cols-2",
  insightCard:
    "relative min-w-0 overflow-hidden rounded-med border border-[var(--border)] bg-[linear-gradient(180deg,var(--card),rgba(14,23,38,0.96))] p-4 shadow-[0_12px_30px_rgba(0,0,0,0.24)] ring-1 ring-[rgba(148,163,184,0.08)] before:pointer-events-none before:absolute before:inset-x-0 before:top-0 before:h-[3px] before:bg-[linear-gradient(90deg,var(--primary),rgba(34,184,242,0.55),transparent)]",
  insightHeader:
    "mb-3 flex min-w-0 items-start justify-between gap-3 [&_span]:text-[10px] [&_span]:font-semibold [&_span]:uppercase [&_span]:tracking-[0.08em] [&_span]:text-[var(--primary)] [&_h2]:m-0 [&_h2]:text-[16px] [&_h2]:font-bold [&_h2]:text-[var(--text)] [&_strong]:font-display [&_strong]:text-[24px] [&_strong]:font-bold [&_strong]:text-[var(--primary)] [&_button]:rounded-med [&_button]:border [&_button]:border-[var(--border)] [&_button]:bg-[var(--surface)] [&_button]:px-3 [&_button]:py-2 [&_button]:text-[12px] [&_button]:font-bold [&_button]:text-[var(--text)] [&_button:hover]:border-[var(--primary-border)]",
  insightActions: "flex shrink-0 flex-wrap items-center justify-end gap-2",
  queueItem:
    "flex min-w-0 items-center justify-between gap-3 rounded-med border border-[var(--border)] bg-[linear-gradient(180deg,var(--card),rgba(14,23,38,0.92))] p-3 shadow-[0_8px_20px_rgba(0,0,0,0.18)] transition hover:border-[var(--primary-border)] max-[560px]:items-stretch max-[560px]:flex-col",
  queueActions:
    "flex shrink-0 flex-wrap items-center justify-end gap-2 [&_button]:rounded-med [&_button]:border [&_button]:border-[var(--border)] [&_button]:bg-[var(--card)] [&_button]:px-3 [&_button]:py-2 [&_button]:text-[12px] [&_button]:font-bold [&_button]:text-[var(--text)] [&_button:last-child]:border-[var(--primary)] [&_button:last-child]:bg-[var(--primary)] [&_button:last-child]:text-white",
  checkItem:
    "flex min-w-0 items-center gap-3 rounded-med border border-[var(--border)] bg-[var(--card)] p-3 max-[560px]:flex-wrap [&_p]:m-0 [&_p]:min-w-0 [&_p]:flex-1 [&_p]:break-words [&_p]:text-[13px] [&_p]:font-bold [&_p]:text-[var(--text)] [&_strong]:shrink-0 [&_strong]:font-bold [&_strong]:text-[var(--text)] [&_button]:ml-auto [&_button]:rounded-med [&_button]:border [&_button]:border-[var(--border)] [&_button]:bg-[var(--surface)] [&_button]:px-3 [&_button]:py-2 [&_button]:text-[12px] [&_button]:font-bold",
  pipelineRow:
    "grid min-w-0 grid-cols-[92px_minmax(0,1fr)_32px] items-center gap-2 text-[12px] max-[420px]:grid-cols-1 [&_span]:font-bold [&_span]:capitalize [&_span]:text-[var(--muted)] [&_strong]:font-bold [&_strong]:text-[var(--text)]",
  tableWrap:
    "min-w-0 overflow-x-auto rounded-med border border-[var(--border)] max-[720px]:overflow-visible",
  table:
    "w-full min-w-[760px] border-collapse text-left text-[12px] max-[720px]:min-w-0 max-[720px]:block [&_th]:border-b [&_th]:border-[var(--border)] [&_th]:bg-[var(--surface)] [&_th]:px-3 [&_th]:py-3 [&_th]:text-[10px] [&_th]:font-semibold [&_th]:uppercase [&_th]:tracking-[0.06em] [&_th]:text-[var(--muted)] [&_td]:border-b [&_td]:border-[var(--border)] [&_td]:px-3 [&_td]:py-3 [&_tbody_tr]:transition [&_tbody_tr:hover]:bg-[var(--surface)] max-[720px]:[&_thead]:hidden max-[720px]:[&_tbody]:block max-[720px]:[&_tr]:mb-3 max-[720px]:[&_tr]:block max-[720px]:[&_tr]:rounded-med max-[720px]:[&_tr]:border max-[720px]:[&_tr]:border-[var(--border)] max-[720px]:[&_tr]:bg-[var(--card)] max-[720px]:[&_td]:grid max-[720px]:[&_td]:grid-cols-[96px_minmax(0,1fr)] max-[720px]:[&_td]:gap-3 max-[720px]:[&_td]:border-b max-[720px]:[&_td]:px-3 max-[720px]:[&_td]:py-2.5 max-[720px]:[&_td:last-child]:border-b-0 max-[720px]:[&_td::before]:text-[10px] max-[720px]:[&_td::before]:font-semibold max-[720px]:[&_td::before]:uppercase max-[720px]:[&_td::before]:tracking-[0.06em] max-[720px]:[&_td::before]:text-[var(--muted)] max-[720px]:[&_td:nth-child(1)::before]:content-['Name'] max-[720px]:[&_td:nth-child(2)::before]:content-['Type'] max-[720px]:[&_td:nth-child(3)::before]:content-['Verification'] max-[720px]:[&_td:nth-child(4)::before]:content-['Status'] max-[720px]:[&_td:nth-child(5)::before]:content-['Actions']",
  userCell: "flex min-w-0 items-center gap-3",
  name: "break-words font-bold text-[var(--text)]",
  meta: "break-words text-[12px] text-[var(--muted)]",
  rowActions:
    "flex flex-wrap items-center gap-2 [&_button]:rounded-med [&_button]:border [&_button]:border-[var(--border)] [&_button]:bg-[var(--surface)] [&_button]:px-3 [&_button]:py-2 [&_button]:text-[12px] [&_button]:font-bold [&_button]:text-[var(--text)] [&_button]:transition [&_button:hover:not(:disabled)]:border-[var(--primary-border)] [&_button:hover:not(:disabled)]:bg-[var(--card2)] [&_button:disabled]:cursor-not-allowed [&_button:disabled]:opacity-60",
  actionCard:
    "relative min-w-0 overflow-hidden rounded-med border border-[var(--border)] bg-[linear-gradient(180deg,var(--card),rgba(14,23,38,0.96))] p-4 shadow-[0_10px_24px_rgba(0,0,0,0.22)] ring-1 ring-[rgba(148,163,184,0.08)]",
  heroText: "min-w-0",
  tableCard:
    "overflow-hidden rounded-med border border-[var(--border)] bg-[var(--card)] p-0 shadow-[0_10px_24px_rgba(0,0,0,0.22)]",
  orderGrid:
    "grid min-w-0 grid-cols-[minmax(0,1fr)] gap-4 lg:grid-cols-[repeat(auto-fit,minmax(300px,430px))] lg:justify-start",
  orderCard:
    "group relative min-w-0 overflow-hidden rounded-med border border-[var(--border)] bg-[linear-gradient(180deg,var(--card),rgba(14,23,38,0.96))] p-4 shadow-[0_12px_28px_rgba(0,0,0,0.24)] ring-1 ring-[rgba(148,163,184,0.08)] transition hover:-translate-y-0.5 hover:border-[var(--primary-border)] hover:shadow-[0_18px_38px_rgba(0,0,0,0.30)] before:pointer-events-none before:absolute before:inset-x-0 before:top-0 before:h-[3px] before:bg-[linear-gradient(90deg,var(--primary),rgba(34,184,242,0.55),transparent)]",
  previousOrderCard:
    "border-[var(--primary-border)] bg-[var(--surface)] opacity-90",
  orderTop:
    "flex min-w-0 items-start justify-between gap-3 [&_h3]:m-0 [&_h3]:break-words [&_h3]:text-[14px] [&_h3]:font-bold [&_h3]:text-[var(--text)] [&_p]:mt-1 [&_p]:break-words [&_p]:text-[12px] [&_p]:text-[var(--muted)]",
  price: "shrink-0 font-display text-[16px] font-bold text-[var(--primary)]",
  deliveryAddress:
    "mt-3 break-words rounded-med border border-[var(--border)] bg-[var(--surface)] p-3 text-[12px] leading-relaxed text-[var(--muted)]",
  orderItems: "mt-3 flex min-w-0 flex-col gap-2",
  orderItem:
    "flex min-w-0 items-center justify-between gap-2 rounded-med border border-[var(--border)] bg-[var(--surface)] p-2.5 text-[12px] shadow-[0_4px_12px_rgba(0,0,0,0.16)] max-[420px]:items-start max-[420px]:flex-col [&_span]:break-words [&_span]:font-bold [&_strong]:shrink-0 [&_strong]:rounded-med [&_strong]:px-2 [&_strong]:py-1 [&_strong]:text-[10px] [&_strong]:font-semibold",
  orderMetaGrid:
    "mt-3 grid min-w-0 grid-cols-1 gap-2 sm:grid-cols-2 [&_label]:flex [&_label]:min-w-0 [&_label]:flex-col [&_label]:gap-1.5 [&_label]:text-[11px] [&_label]:font-semibold [&_label]:text-[var(--muted)] [&_select]:min-h-[42px] [&_select]:min-w-0 [&_select]:rounded-med [&_select]:border [&_select]:border-[var(--border)] [&_select]:bg-[var(--card)] [&_select]:px-3 [&_select]:text-[13px] [&_select]:font-normal [&_select]:text-[var(--text)] [&_select]:shadow-[0_6px_16px_rgba(19,34,53,0.04)] [&_select]:transition [&_select:hover]:border-[var(--primary-border)] [&_select:focus]:border-[var(--primary)] [&_select:focus]:shadow-[0_0_0_3px_var(--primary-dim)] [&_select:disabled]:cursor-not-allowed [&_select:disabled]:bg-[var(--surface)] [&_select:disabled]:text-[var(--muted)]",
  deliveryActions:
    "mt-3 grid grid-cols-3 gap-2 max-[420px]:grid-cols-1 [&_button]:min-h-[36px] [&_button]:rounded-med [&_button]:border [&_button]:border-[var(--border)] [&_button]:bg-[var(--card)] [&_button]:px-2 [&_button]:text-[12px] [&_button]:font-bold [&_button:last-child]:border-[var(--primary)] [&_button:last-child]:bg-[var(--primary)] [&_button:last-child]:text-white [&_button:disabled]:cursor-not-allowed [&_button:disabled]:opacity-55",
  blueButton:
    "border-transparent bg-[linear-gradient(135deg,#1D72F3,#22B8F2)] text-white shadow-[0_10px_24px_rgba(29,114,243,0.24)] hover:shadow-[0_14px_30px_rgba(29,114,243,0.30)] hover:opacity-100",
  inventorySummary:
    "grid min-w-0 grid-cols-2 gap-3 rounded-med border border-[var(--border)] bg-[linear-gradient(180deg,var(--card),rgba(14,23,38,0.96))] p-3 shadow-[0_12px_28px_rgba(0,0,0,0.24)] ring-1 ring-[rgba(148,163,184,0.08)] md:grid-cols-4 [&_span]:rounded-med [&_span]:border [&_span]:border-[var(--border)] [&_span]:bg-[var(--surface)] [&_span]:p-3 [&_span]:text-[11px] [&_span]:font-semibold [&_span]:uppercase [&_span]:tracking-[0.06em] [&_span]:text-[var(--muted)] [&_strong]:mt-1 [&_strong]:block [&_strong]:font-display [&_strong]:text-[22px] [&_strong]:text-[var(--blue)]",
  medicineForm:
    "flex min-w-0 flex-col gap-3 rounded-med border border-[var(--border)] bg-[linear-gradient(180deg,var(--card),var(--surface))] p-3 shadow-[0_14px_34px_var(--admin-shadow)]",
  formGrid:
    "grid min-w-0 grid-cols-1 gap-3 sm:grid-cols-2 xl:grid-cols-3 [&_label]:flex [&_label]:min-w-0 [&_label]:flex-col [&_label]:gap-1.5 [&_label]:text-[11px] [&_label]:font-semibold [&_label]:uppercase [&_label]:tracking-[0.04em] [&_label]:text-[var(--muted)] [&_input]:min-h-[42px] [&_input]:min-w-0 [&_input]:rounded-med [&_input]:border [&_input]:border-[var(--border)] [&_input]:bg-[var(--card)] [&_input]:px-3 [&_input]:text-[13px] [&_input]:font-normal [&_input]:text-[var(--text)] [&_input]:shadow-[0_6px_16px_rgba(19,34,53,0.04)] [&_input]:transition [&_input:hover]:border-[var(--primary-border)] [&_input:focus]:border-[var(--primary)] [&_input:focus]:shadow-[0_0_0_3px_var(--primary-dim)] [&_select]:min-h-[42px] [&_select]:min-w-0 [&_select]:rounded-med [&_select]:border [&_select]:border-[var(--border)] [&_select]:bg-[var(--card)] [&_select]:px-3 [&_select]:text-[13px] [&_select]:font-normal [&_select]:text-[var(--text)] [&_select]:shadow-[0_6px_16px_rgba(19,34,53,0.04)] [&_select]:transition [&_select:hover]:border-[var(--primary-border)] [&_select:focus]:border-[var(--primary)] [&_select:focus]:shadow-[0_0_0_3px_var(--primary-dim)] [&_textarea]:min-h-[96px] [&_textarea]:min-w-0 [&_textarea]:resize-y [&_textarea]:rounded-med [&_textarea]:border [&_textarea]:border-[var(--border)] [&_textarea]:bg-[var(--card)] [&_textarea]:px-3 [&_textarea]:py-2.5 [&_textarea]:text-[13px] [&_textarea]:font-normal [&_textarea]:text-[var(--text)] [&_textarea]:shadow-[0_6px_16px_rgba(19,34,53,0.04)] [&_textarea]:transition [&_textarea:hover]:border-[var(--primary-border)] [&_textarea:focus]:border-[var(--primary)] [&_textarea:focus]:shadow-[0_0_0_3px_var(--primary-dim)]",
  fieldWide: "sm:col-span-2 xl:col-span-3",
  formActions: "flex flex-wrap items-center justify-end gap-2",
  medicineGrid: "grid min-w-0 grid-cols-1 gap-3 lg:grid-cols-2 xl:grid-cols-3",
  medicineCard:
    "group relative flex min-w-0 flex-col gap-3 overflow-hidden rounded-med border border-[var(--border)] bg-[linear-gradient(180deg,var(--card),rgba(14,23,38,0.96))] p-4 shadow-[0_12px_28px_rgba(0,0,0,0.24)] ring-1 ring-[rgba(148,163,184,0.08)] transition hover:-translate-y-0.5 hover:border-[var(--primary-border)] hover:shadow-[0_18px_38px_rgba(0,0,0,0.30)] before:pointer-events-none before:absolute before:inset-x-0 before:top-0 before:h-[3px] before:bg-[linear-gradient(90deg,var(--primary),rgba(34,184,242,0.55),transparent)]",
  medicineTop:
    "flex min-w-0 items-start justify-between gap-3 [&_h3]:m-0 [&_h3]:break-words [&_h3]:text-[15px] [&_h3]:font-bold [&_h3]:text-[var(--text)] [&_p]:mt-1 [&_p]:break-words [&_p]:text-[12px] [&_p]:text-[var(--muted)]",
  medicineStats:
    "grid min-w-0 grid-cols-3 gap-2 max-[420px]:grid-cols-1 [&_span]:min-w-0 [&_span]:rounded-med [&_span]:border [&_span]:border-[var(--border)] [&_span]:bg-[var(--card)] [&_span]:p-2.5 [&_span]:text-[11px] [&_span]:font-bold [&_span]:text-[var(--muted)] [&_strong]:mt-1 [&_strong]:block [&_strong]:break-words [&_strong]:font-display [&_strong]:text-[14px] [&_strong]:text-[var(--text)]",
  switchRow:
    "flex min-w-0 flex-wrap items-center gap-3 [&_label]:inline-flex [&_label]:min-w-0 [&_label]:items-center [&_label]:gap-2 [&_label]:text-[12px] [&_label]:font-bold [&_label]:text-[var(--text)] [&_input]:h-4 [&_input]:w-4 [&_input]:shrink-0 [&_input]:accent-[var(--primary)]",
  medicineModalBackdrop:
    "fixed inset-0 z-[320] flex items-center justify-center bg-slate-950/55 p-4 backdrop-blur-sm max-[760px]:items-end max-[520px]:p-2",
  medicineModal:
    "flex max-h-[92vh] w-full max-w-5xl flex-col overflow-hidden rounded-med border border-[rgba(29,114,243,0.28)] bg-[linear-gradient(180deg,var(--card),var(--surface))] text-left shadow-[0_28px_80px_rgba(15,23,42,0.34)]",
  medicineModalHeader:
    "flex items-start justify-between gap-3 border-b border-[var(--border)] bg-[linear-gradient(135deg,rgba(29,114,243,0.14),rgba(34,184,242,0.10)),var(--card)] p-4 max-[620px]:flex-col [&_span]:text-[10px] [&_span]:font-semibold [&_span]:uppercase [&_span]:tracking-[0.08em] [&_span]:text-[var(--blue)] [&_h2]:m-0 [&_h2]:font-display [&_h2]:text-[22px] [&_h2]:font-bold [&_h2]:text-[var(--text)] [&_p]:mt-1 [&_p]:text-[13px] [&_p]:text-[var(--muted)] [&_button]:shrink-0 [&_button]:rounded-med [&_button]:border [&_button]:border-[var(--border)] [&_button]:bg-[var(--card)] [&_button]:px-3 [&_button]:py-2 [&_button]:text-[12px] [&_button]:font-semibold [&_button]:text-[var(--text)] [&_button:hover]:border-[rgba(29,114,243,0.38)] [&_button:hover]:text-[var(--blue)]",
  medicineModalBody:
    "min-h-0 overflow-y-auto p-4 max-[520px]:p-3",
  modalBackdrop:
    "fixed inset-0 z-[250] flex justify-end bg-slate-900/35 max-[760px]:items-end",
  detailsPanel:
    "flex h-full w-[min(560px,100vw)] flex-col gap-4 overflow-y-auto border-l border-[var(--border)] bg-[var(--card)] p-4 shadow-[-18px_0_40px_rgba(15,23,42,0.18)] max-[760px]:h-[92vh] max-[760px]:w-full max-[760px]:rounded-t-med max-[760px]:border-l-0",
  detailsHeader:
    "flex items-start justify-between gap-3 border-b border-[var(--border)] pb-3 [&_h2]:m-0 [&_h2]:font-display [&_h2]:text-[20px] [&_h2]:font-bold [&_h2]:text-[var(--text)] [&_p]:mt-1 [&_p]:break-words [&_p]:text-[13px] [&_p]:text-[var(--muted)]",
  detailsHero:
    "flex min-w-0 items-center gap-3 rounded-med border border-[var(--border)] bg-[var(--surface)] p-3 [&_h3]:m-0 [&_h3]:break-words [&_h3]:text-[17px] [&_h3]:font-bold [&_h3]:text-[var(--text)] [&_p]:mt-1 [&_p]:break-words [&_p]:text-[13px] [&_p]:text-[var(--muted)]",
  detailGrid: "grid min-w-0 grid-cols-1 gap-2 sm:grid-cols-2",
  detailItem:
    "min-w-0 rounded-med border border-[var(--border)] bg-[var(--surface)] p-3 [&_span]:block [&_span]:text-[10px] [&_span]:font-semibold [&_span]:uppercase [&_span]:tracking-[0.06em] [&_span]:text-[var(--muted)] [&_strong]:mt-1 [&_strong]:block [&_strong]:break-words [&_strong]:text-[13px] [&_strong]:font-bold [&_strong]:text-[var(--text)]",
  verifyBox:
    "flex min-w-0 items-center justify-between gap-3 rounded-med border border-[var(--primary-border)] bg-[var(--primary-dim)] p-3 max-[560px]:items-stretch max-[560px]:flex-col [&_strong]:block [&_strong]:text-[14px] [&_strong]:font-bold [&_strong]:text-[var(--text)] [&_span]:mt-1 [&_span]:block [&_span]:text-[12px] [&_span]:text-[var(--muted)]",
  closeBtn:
    "shrink-0 rounded-med border border-[var(--border)] bg-[var(--surface)] px-3 py-2 text-[12px] font-bold text-[var(--text)] hover:bg-[var(--card2)]",
});

export const dashboardStyles = createStyles({
  ...dashboardGeneratedStyles,
  greeting: greetingBlock,
  page:
    "flex min-w-0 flex-col gap-4",
  statsRow:
    "grid min-w-0 grid-cols-1 gap-4 sm:grid-cols-3",
  grid:
    "grid min-w-0 grid-cols-[minmax(0,1fr)_340px] gap-4 max-[1100px]:grid-cols-[minmax(0,1fr)_320px] max-[900px]:grid-cols-1",
  left: "min-w-0 space-y-4",
  right: "min-w-0 space-y-4",
  quickActions:
    "grid min-w-0 grid-cols-[repeat(auto-fit,minmax(220px,1fr))] gap-4 max-[640px]:grid-cols-1",
  quickCard:
    "group relative flex min-h-[124px] min-w-0 w-full flex-col gap-3 overflow-hidden rounded-med border border-[rgba(0,123,255,0.20)] bg-[linear-gradient(145deg,rgba(255,255,255,0.99),rgba(241,248,255,0.94))] p-4 text-left shadow-[0_14px_34px_rgba(0,82,170,0.08)] ring-1 ring-white/70 transition duration-200 before:pointer-events-none before:absolute before:inset-x-0 before:top-0 before:h-[3px] before:bg-[linear-gradient(90deg,var(--primary),rgba(94,168,255,0.48),transparent)] after:pointer-events-none after:absolute after:-right-8 after:-top-8 after:h-20 after:w-20 after:rounded-full after:bg-[rgba(0,123,255,0.07)] hover:-translate-y-1 hover:border-[var(--primary-border)] hover:shadow-[0_20px_44px_rgba(0,82,170,0.13)] focus-visible:border-[var(--primary)] focus-visible:ring-2 focus-visible:ring-[var(--primary-dim)] max-[1180px]:min-h-[96px] max-[1180px]:flex-row max-[1180px]:items-center max-[640px]:min-h-[110px] max-[640px]:flex-col max-[640px]:items-start [&_div]:relative [&_div]:z-[1] [&_div]:min-w-0 [&_h3]:text-[15px] [&_h3]:font-semibold [&_h3]:text-[var(--text)] [&_p]:mt-1 [&_p]:break-words [&_p]:text-[12px] [&_p]:leading-relaxed [&_p]:text-[var(--muted)]",
  quickIcon:
    "relative z-[1] flex h-12 w-12 shrink-0 items-center justify-center rounded-med border border-white/80 bg-[linear-gradient(135deg,rgba(0,123,255,0.13),rgba(255,255,255,0.86))] text-[18px] font-semibold text-[var(--primary)] shadow-[0_10px_22px_rgba(0,123,255,0.12)] ring-1 ring-[var(--primary-dim)] transition group-hover:scale-[1.04]",
  quickIconAccent: "bg-[linear-gradient(135deg,rgba(0,123,255,0.15),rgba(255,255,255,0.86))] text-sky-700",
  quickIconBlue: "bg-[linear-gradient(135deg,rgba(94,168,255,0.18),rgba(255,255,255,0.86))] text-sky-700",
  quickIconPrimary: "bg-[linear-gradient(135deg,rgba(0,123,255,0.15),rgba(255,255,255,0.86))] text-[var(--primary)]",
  quickIconSos: "bg-[linear-gradient(135deg,rgba(0,123,255,0.16),rgba(255,255,255,0.88))] text-sky-700",
  quickTitleSos: "text-sky-700",
  sosCard:
    "!border-[var(--primary-border)] !bg-[linear-gradient(145deg,rgba(255,255,255,0.99),rgba(236,248,255,0.96))]",
  healthCard:
    "relative overflow-hidden rounded-med border border-[rgba(0,123,255,0.18)] bg-white shadow-[0_12px_30px_rgba(15,23,42,0.07)] ring-1 ring-white/80 before:pointer-events-none before:absolute before:inset-x-0 before:top-0 before:h-[3px] before:bg-[linear-gradient(90deg,var(--primary),rgba(94,168,255,0.50),transparent)]",
  mapCard:
    "relative min-w-0 overflow-hidden rounded-med border border-[rgba(0,123,255,0.16)] bg-white shadow-[0_12px_30px_rgba(15,23,42,0.07)] ring-1 ring-white/80",
  mapHeader:
    "relative z-[1] flex min-w-0 flex-col gap-1 border-b border-[rgba(15,23,42,0.08)] bg-[linear-gradient(180deg,rgba(248,251,253,0.96),rgba(255,255,255,0.98))] p-4 [&_h2]:m-0 [&_h2]:text-xl [&_h2]:font-semibold [&_h2]:tracking-tight [&_h2]:text-[var(--text)] [&_p]:m-0 [&_p]:break-words [&_p]:text-sm [&_p]:leading-relaxed [&_p]:text-[var(--muted)]",
  mapBody:
    "relative min-h-[220px] overflow-hidden border-b border-[rgba(15,23,42,0.06)] bg-[linear-gradient(135deg,rgba(0,123,255,0.07),rgba(255,255,255,0.82))]",
  mapIframe:
    "h-[260px] w-full border-0 grayscale-[15%] saturate-[1.05]",
  mapEmpty:
    "flex min-h-[180px] items-center justify-center p-5",
  mapEmptyText:
    "max-w-[280px] rounded-med border border-dashed border-[rgba(0,123,255,0.18)] bg-white/80 px-4 py-3 text-center text-sm font-medium leading-relaxed text-[var(--muted)]",
  pharmacyList:
    "relative z-[1] grid grid-cols-1 gap-2.5 p-4",
  pharmacyRow:
    "flex min-w-0 items-start justify-between gap-3 rounded-med border border-[rgba(15,23,42,0.08)] bg-[linear-gradient(180deg,#ffffff,rgba(248,251,253,0.96))] px-3.5 py-3 text-sm text-[var(--text)] shadow-[0_6px_16px_rgba(15,23,42,0.04)] transition hover:border-[rgba(0,123,255,0.22)] hover:shadow-[0_10px_22px_rgba(0,82,170,0.07)] [&_a]:font-medium [&_a]:text-[var(--primary)] [&_a:hover]:underline [&_span:first-child]:min-w-0 [&_span:first-child]:text-xs [&_span:first-child]:font-medium [&_span:first-child]:uppercase [&_span:first-child]:tracking-[0.04em] [&_span:first-child]:text-[var(--muted)]",
  dist:
    "shrink-0 break-words text-right font-semibold leading-relaxed text-[var(--text)]",
  consultRow:
    "group mb-3 flex min-w-0 items-center gap-3 rounded-med border border-[rgba(0,123,255,0.18)] bg-[linear-gradient(145deg,rgba(255,255,255,0.98),rgba(243,249,255,0.92))] p-3.5 shadow-[0_12px_28px_rgba(0,82,170,0.07)] ring-1 ring-white/60 transition hover:-translate-y-0.5 hover:border-[var(--primary-border)] hover:shadow-[0_18px_36px_rgba(0,82,170,0.11)]",
  docAvatar:
    "flex h-11 w-11 shrink-0 items-center justify-center rounded-med border border-[var(--primary-border)] bg-[linear-gradient(135deg,var(--primary-dim),rgba(255,255,255,0.85))] text-[13px] font-semibold text-[var(--primary)] shadow-[0_10px_22px_rgba(0,123,255,0.10)]",
  docAvatarAccent: "text-[var(--primary)]",
  docName:
    "truncate text-[13px] font-semibold text-[var(--text)]",
  docSpec:
    "mt-1 truncate text-[12px] leading-relaxed text-[var(--muted)]",
  consultMeta:
    "ml-auto flex shrink-0 flex-col items-end gap-2",
  consultDate:
    "rounded-med bg-white/90 px-2 py-1 text-[11px] font-semibold text-[var(--muted)] shadow-sm",
  consultDot:
    "h-2.5 w-2.5 rounded-full shadow-[0_0_0_4px_rgba(0,123,255,0.08)]",
});
export const doctorDashboardStyles = createStyles({
  ...doctorDashboardGeneratedStyles,
  page,
  header,
  headerTitle: "font-display text-[24px] font-bold leading-tight text-[var(--text)]",
  headerSubtitle: "mt-1 text-[13px] leading-relaxed text-[var(--muted)]",
  statsGrid: "grid min-w-0 grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4",
  quickActions:
    "min-w-0 rounded-med border border-[var(--border)] bg-[var(--card)] p-4 shadow-[0_8px_24px_rgba(16,32,51,0.05)]",
  recentSection:
    "min-w-0 rounded-med border border-[var(--border)] bg-[var(--card)] p-4 shadow-[0_8px_24px_rgba(16,32,51,0.05)]",
  sectionTitle:
    "mb-3 border-b border-[var(--border)] pb-3 font-display text-[18px] font-bold text-[var(--text)]",
  actionGrid: "grid min-w-0 grid-cols-1 gap-3 sm:grid-cols-2 xl:grid-cols-3",
  actionCard:
    "group flex min-w-0 items-center gap-3 rounded-med border border-[var(--border)] bg-[linear-gradient(180deg,var(--card),var(--surface))] p-3 text-left shadow-[0_8px_20px_rgba(16,32,51,0.05)] transition hover:-translate-y-0.5 hover:border-[var(--primary-border)] hover:shadow-[0_14px_30px_rgba(0,123,255,0.10)]",
  actionIcon:
    "flex h-11 w-11 shrink-0 items-center justify-center rounded-med border border-[var(--primary-border)] bg-[var(--primary-dim)] text-[20px] text-[var(--primary)] shadow-sm",
  actionText: "min-w-0 flex-1",
  actionTitle: "break-words text-[13px] font-semibold text-[var(--text)]",
  actionDesc: "mt-1 break-words text-[12px] leading-relaxed text-[var(--muted)]",
  prescriptionsList: "flex min-w-0 flex-col gap-3",
  prescriptionItem:
    "flex min-w-0 items-center justify-between gap-3 rounded-med border border-[var(--border)] bg-[linear-gradient(180deg,var(--card),var(--surface))] p-4 shadow-[0_8px_20px_rgba(16,32,51,0.05)] transition hover:border-[var(--primary-border)] max-[640px]:flex-col max-[640px]:items-start",
  itemInfo: "min-w-0 flex-1",
  itemTitle: "break-words text-[15px] font-bold text-[var(--text)]",
  itemMeta: "mt-1 break-words text-[12px] leading-relaxed text-[var(--muted)]",
  viewLink:
    "inline-flex min-h-[38px] shrink-0 items-center justify-center rounded-med border border-[var(--primary-border)] bg-[var(--primary-dim)] px-3 py-2 text-[12px] font-semibold text-[var(--primary)] transition hover:bg-[var(--primary)] hover:text-white",
  empty:
    "rounded-med border border-dashed border-[var(--border)] bg-[var(--surface)] p-6 text-center text-[13px] font-bold text-[var(--muted)]",
});
export const doctorListStyles = createStyles({
  ...doctorListGeneratedStyles,
  greeting: greetingBlock,
  filtersBar:
    "flex flex-wrap items-center gap-2 rounded-med border border-[var(--border)] bg-[var(--surface)] p-3",
  availabilityToggle:
    "inline-flex min-h-[40px] items-center gap-2 rounded-med border border-[var(--border)] bg-[var(--card)] px-3 py-2 text-[12px] font-semibold text-[var(--muted)] shadow-[0_8px_20px_var(--admin-shadow)] transition hover:border-[var(--primary-border)] hover:bg-[var(--card2)] hover:text-[var(--text)] max-[520px]:w-full max-[520px]:justify-center",
  availabilityToggleActive:
    "border-[var(--primary-border)] bg-[var(--primary-dim)] text-[var(--primary)]",
  availabilityKnobTrack:
    "relative h-5 w-9 shrink-0 rounded-full border border-[var(--border)] bg-[var(--surface)] transition",
  availabilityKnob:
    "absolute left-0.5 top-0.5 h-4 w-4 rounded-full bg-[var(--muted)] shadow transition-transform",
  availabilityKnobOn:
    "translate-x-4 bg-[var(--primary)]",
  toggle:
    "inline-flex min-h-[36px] items-center gap-2 rounded-med border border-[var(--border)] bg-[var(--card)] px-3 py-2 text-[12px] font-semibold text-[var(--muted)] transition hover:border-[var(--primary-border)] hover:text-[var(--text)]",
  toggleActive:
    "border-[var(--primary-border)] bg-[var(--primary-dim)] text-[var(--primary)]",
  toggleTrack:
    "relative inline-flex h-5 w-9 shrink-0 rounded-full bg-slate-300 transition-colors",
  on: "!bg-[var(--primary)]",
  off: "bg-slate-300",
  toggleThumb:
    "absolute left-0.5 top-0.5 h-4 w-4 rounded-full bg-white shadow transition-transform",
  toggleThumbOn: "translate-x-4",
  grid:
    "grid min-w-0 grid-cols-[repeat(auto-fit,minmax(248px,300px))] justify-center gap-3 max-[560px]:grid-cols-1",
  card:
    "group relative flex min-h-[226px] w-full max-w-[300px] min-w-0 flex-col gap-3 overflow-hidden rounded-med border border-[var(--border)] bg-[linear-gradient(180deg,var(--card),var(--surface))] p-4 shadow-[0_12px_28px_rgba(19,34,53,0.08)] ring-1 ring-white/50 transition hover:-translate-y-0.5 hover:border-[var(--primary-border)] hover:shadow-[0_18px_38px_rgba(29,114,243,0.13)] max-[560px]:max-w-none before:pointer-events-none before:absolute before:inset-x-0 before:top-0 before:h-[3px] before:bg-[linear-gradient(90deg,var(--primary),rgba(34,184,242,0.55),transparent)]",
  cardTop: "flex min-w-0 items-start justify-between gap-3",
  doctorIdentity: "flex min-w-0 items-center gap-2.5",
  photo:
    "flex h-11 w-11 shrink-0 items-center justify-center rounded-med border border-[var(--primary-border)] bg-[linear-gradient(135deg,rgba(29,114,243,0.16),rgba(34,184,242,0.12))] text-[14px] font-semibold text-[var(--primary)] shadow-sm ring-2 ring-[var(--primary-dim)]",
  identityCopy: "min-w-0",
  name: "truncate text-[14px] font-semibold text-[var(--text)]",
  spec: "mt-0.5 truncate text-[11px] font-bold text-[var(--muted)]",
  statusWrap:
    "shrink-0 [&_span]:rounded-med [&_span]:px-2 [&_span]:py-1 [&_span]:text-[10px] [&_span]:font-semibold",
  doctorSummary:
    "mt-3 line-clamp-2 min-h-[38px] text-[12px] leading-relaxed text-[var(--muted)]",
  cardMetaRow:
    "mt-2 grid grid-cols-[minmax(0,1fr)_auto] items-center gap-2",
  rating:
    "inline-flex min-w-0 items-center gap-1.5 truncate rounded-med border border-sky-200 bg-sky-50 px-2.5 py-1.5 text-[11px] font-semibold text-sky-700 [&_span]:truncate [&_span]:font-bold [&_span]:text-[var(--muted)]",
  price:
    "whitespace-nowrap rounded-med border border-[var(--primary-border)] bg-[var(--primary-dim)] px-2.5 py-1.5 text-[11px] font-semibold text-[var(--primary)]",
  cardActions:
    "mt-auto grid grid-cols-2 gap-2 border-t border-[var(--border)] pt-2.5 max-[520px]:grid-cols-1",
  cardButton:
    "min-h-[38px] w-full rounded-med px-3 text-[12px] font-semibold shadow-none",
  consultButton:
    "!border !border-[var(--primary)] !bg-[var(--primary)] !text-white shadow-[0_10px_22px_rgba(29,114,243,0.18)] hover:!opacity-100 hover:shadow-[0_12px_26px_rgba(29,114,243,0.24)]",
  appointmentButton:
    "!border !border-[var(--primary-border)] !bg-[var(--card)] !text-[var(--primary)] hover:!bg-[var(--primary-dim)]",
  unavailableButton:
    "!cursor-not-allowed !border !border-slate-300 !bg-[linear-gradient(135deg,#f8fafc,#e2e8f0)] !text-slate-600 !opacity-100 shadow-[inset_0_1px_0_rgba(255,255,255,0.75)] hover:!translate-y-0 hover:!shadow-[inset_0_1px_0_rgba(255,255,255,0.75)] before:h-2 before:w-2 before:rounded-full before:bg-slate-400 before:content-['']",
});
export const doctorPatientsStyles = createStyles({
  ...doctorPatientsGeneratedStyles,
  page,
  header,
  headerTitle: "font-display text-[24px] font-bold leading-tight text-[var(--text)]",
  headerSubtitle: "mt-1 text-[13px] leading-relaxed text-[var(--muted)]",
  summaryGrid: "grid min-w-0 grid-cols-2 gap-3 xl:grid-cols-4",
  summaryCard:
    "relative min-w-0 overflow-hidden rounded-med border border-[var(--border)] bg-[linear-gradient(180deg,var(--card),var(--surface))] p-4 shadow-[0_8px_24px_rgba(16,32,51,0.05)] before:pointer-events-none before:absolute before:inset-x-0 before:top-0 before:h-[3px] before:bg-[linear-gradient(90deg,var(--primary),rgba(34,184,242,0.55),transparent)] [&_span]:block [&_span]:text-[11px] [&_span]:font-semibold [&_span]:uppercase [&_span]:tracking-[0.06em] [&_span]:text-[var(--muted)] [&_strong]:mt-2 [&_strong]:block [&_strong]:font-display [&_strong]:text-[24px] [&_strong]:font-bold [&_strong]:leading-none [&_strong]:text-[var(--text)]",
  toolbar:
    "flex min-w-0 items-center justify-between gap-3 rounded-med border border-[var(--border)] bg-[var(--card)] p-3 shadow-[0_8px_24px_rgba(16,32,51,0.05)] max-[760px]:flex-col max-[760px]:items-stretch",
  searchBox:
    "min-w-0 flex-1 [&_input]:min-h-[42px] [&_input]:w-full [&_input]:rounded-med [&_input]:border [&_input]:border-[var(--border)] [&_input]:bg-[var(--surface)] [&_input]:px-3 [&_input]:py-2 [&_input]:text-[13px] [&_input]:text-[var(--text)] [&_input]:outline-none [&_input]:transition [&_input]:focus:border-[var(--primary)] [&_input]:focus:shadow-[0_0_0_3px_var(--primary-dim)]",
  filterBar: "flex min-w-0 flex-wrap items-center gap-2",
  filterBtn:
    "inline-flex min-h-[38px] shrink-0 items-center rounded-med border border-[var(--border)] bg-[var(--surface)] px-3 py-2 text-[12px] font-bold text-[var(--muted)] transition hover:border-[var(--primary-border)] hover:bg-[var(--primary-dim)] hover:text-[var(--primary)]",
  active:
    "border-[var(--primary-border)] bg-[var(--primary)] text-white shadow-[0_8px_18px_rgba(0,123,255,0.20)] hover:bg-[var(--primary)] hover:text-white",
  list: "flex min-w-0 flex-col gap-3",
  card:
    "grid min-w-0 grid-cols-[minmax(0,1.7fr)_minmax(300px,1fr)_auto] items-center gap-3 rounded-med border border-[var(--border)] bg-[var(--card)] p-4 shadow-[0_8px_24px_rgba(16,32,51,0.05)] transition hover:border-[var(--primary-border)] max-[1080px]:grid-cols-1 max-[560px]:p-3",
  cardSelected:
    "border-[var(--primary-border)] bg-[linear-gradient(135deg,var(--primary-dim),rgba(255,255,255,0.90))] shadow-[0_14px_32px_rgba(0,123,255,0.12)]",
  patientBlock: "flex min-w-0 items-center gap-3 max-[520px]:items-start",
  avatar:
    "flex h-12 w-12 shrink-0 items-center justify-center overflow-hidden rounded-med border border-[var(--primary-border)] bg-[var(--primary-dim)] text-[14px] font-semibold text-[var(--primary)] shadow-sm [&_img]:h-full [&_img]:w-full [&_img]:object-cover",
  patientInfo: "min-w-0",
  nameRow:
    "mb-1 flex min-w-0 items-center gap-2 max-[520px]:flex-col max-[520px]:items-start [&_h2]:m-0 [&_h2]:truncate [&_h2]:text-[16px] [&_h2]:font-bold [&_h2]:text-[var(--text)]",
  meta:
    "flex min-w-0 flex-wrap gap-x-3 gap-y-1 text-[12px] leading-relaxed text-[var(--muted)]",
  lastReason:
    "mt-1 break-words text-[12px] leading-relaxed text-[var(--muted)]",
  status:
    "inline-flex shrink-0 items-center justify-center rounded-med border px-2.5 py-1 text-[11px] font-semibold capitalize",
  statusPending: "border-amber-200 bg-amber-50 text-amber-700",
  statusActive: "border-sky-200 bg-sky-50 text-sky-700",
  statusCompleted: "border-emerald-200 bg-emerald-50 text-emerald-700",
  statusCancelled: "border-slate-200 bg-slate-50 text-slate-600",
  statusDefault: "border-slate-200 bg-slate-50 text-slate-600",
  stats:
    "grid min-w-0 grid-cols-4 gap-2 max-[680px]:grid-cols-2 [&_span]:rounded-med [&_span]:border [&_span]:border-[var(--border)] [&_span]:bg-[var(--surface)] [&_span]:p-2.5 [&_span]:text-center [&_span]:text-[11px] [&_span]:font-bold [&_span]:text-[var(--muted)] [&_strong]:mb-1 [&_strong]:block [&_strong]:font-display [&_strong]:text-[17px] [&_strong]:font-bold [&_strong]:leading-none [&_strong]:text-[var(--text)]",
  actions:
    "flex min-w-0 flex-wrap items-center justify-end gap-2 max-[1080px]:border-t max-[1080px]:border-[var(--border)] max-[1080px]:pt-3 [&_button]:min-h-[38px] [&_button]:whitespace-nowrap",
  empty:
    "flex min-w-0 flex-col items-center justify-center gap-2 rounded-med border border-dashed border-[var(--border)] bg-[var(--card)] p-6 text-center shadow-[0_8px_24px_rgba(16,32,51,0.04)] [&_strong]:text-[15px] [&_strong]:font-bold [&_strong]:text-[var(--text)] [&_span]:max-w-md [&_span]:text-[12px] [&_span]:leading-relaxed [&_span]:text-[var(--muted)]",
  historyPanel:
    "min-w-0 rounded-med border border-[var(--primary-border)] bg-[linear-gradient(180deg,var(--card),var(--surface))] p-4 shadow-[0_16px_38px_rgba(0,82,170,0.10)]",
  historyHeader:
    "mb-3 flex min-w-0 items-start justify-between gap-3 border-b border-[var(--border)] pb-3 max-[640px]:flex-col [&_span]:text-[10px] [&_span]:font-semibold [&_span]:uppercase [&_span]:tracking-[0.08em] [&_span]:text-[var(--primary)] [&_h2]:m-0 [&_h2]:mt-1 [&_h2]:break-words [&_h2]:font-display [&_h2]:text-[22px] [&_h2]:font-bold [&_h2]:text-[var(--text)] [&_p]:mt-1 [&_p]:break-words [&_p]:text-[12px] [&_p]:leading-relaxed [&_p]:text-[var(--muted)]",
  historySummary:
    "mb-3 grid min-w-0 grid-cols-2 gap-2 lg:grid-cols-4 [&_div]:rounded-med [&_div]:border [&_div]:border-[var(--border)] [&_div]:bg-[var(--card)] [&_div]:p-3 [&_span]:block [&_span]:text-[10px] [&_span]:font-semibold [&_span]:uppercase [&_span]:tracking-[0.06em] [&_span]:text-[var(--muted)] [&_strong]:mt-1 [&_strong]:block [&_strong]:break-words [&_strong]:text-[15px] [&_strong]:font-bold [&_strong]:text-[var(--text)]",
  historyList: "flex min-w-0 flex-col gap-3",
  historyItem:
    "min-w-0 rounded-med border border-[var(--border)] bg-[var(--card)] p-3 shadow-[0_8px_20px_rgba(16,32,51,0.05)]",
  historyItemTop:
    "flex min-w-0 items-start justify-between gap-3 border-b border-[var(--border)] pb-3 max-[640px]:flex-col [&_h3]:m-0 [&_h3]:break-words [&_h3]:text-[15px] [&_h3]:font-bold [&_h3]:text-[var(--text)] [&_p]:mt-1 [&_p]:break-words [&_p]:text-[12px] [&_p]:leading-relaxed [&_p]:text-[var(--muted)]",
  historyInfoGrid:
    "mt-3 grid min-w-0 grid-cols-2 gap-2 xl:grid-cols-4 [&_div]:rounded-med [&_div]:border [&_div]:border-[var(--border)] [&_div]:bg-[var(--surface)] [&_div]:p-2.5 [&_span]:block [&_span]:text-[10px] [&_span]:font-semibold [&_span]:uppercase [&_span]:tracking-[0.06em] [&_span]:text-[var(--muted)] [&_strong]:mt-1 [&_strong]:block [&_strong]:break-words [&_strong]:text-[12px] [&_strong]:font-bold [&_strong]:text-[var(--text)]",
  historyNotes:
    "mt-3 rounded-med border border-[var(--border)] bg-[var(--surface)] p-3 text-[12px] leading-relaxed text-[var(--muted)] [&_p]:m-0 [&_p+ p]:mt-2 [&_strong]:text-[var(--text)]",
  historyActions:
    "mt-3 flex min-w-0 flex-wrap items-center justify-end gap-2 border-t border-[var(--border)] pt-3",
});
export const doctorPrescriptionsStyles = createStyles({
  ...doctorPrescriptionsGeneratedStyles,
  page,
  header,
  filterBar:
    "flex min-w-0 flex-wrap items-center gap-2 rounded-med border border-[var(--border)] bg-[var(--card)] p-2 shadow-[0_8px_24px_rgba(16,32,51,0.05)]",
  filterBtn:
    "inline-flex min-h-[38px] min-w-0 items-center gap-2 rounded-med border border-transparent px-3 py-2 text-[12px] font-bold text-[var(--muted)] transition hover:border-[var(--primary-border)] hover:bg-[var(--primary-dim)] hover:text-[var(--primary)] [&_strong]:rounded-full [&_strong]:bg-[var(--surface)] [&_strong]:px-2 [&_strong]:py-0.5 [&_strong]:text-[11px] [&_strong]:text-[var(--text)]",
  filterActive:
    "border-[var(--primary-border)] bg-[var(--primary)] text-white shadow-[0_8px_18px_rgba(0,123,255,0.20)] hover:bg-[var(--primary)] hover:text-white [&_strong]:bg-white/20 [&_strong]:text-white",
  prescriptionsList: "flex min-w-0 flex-col gap-3",
  listSpacing: "mt-0",
  card:
    "min-w-0 rounded-med border border-[var(--border)] bg-[var(--card)] p-4 shadow-[0_8px_24px_rgba(16,32,51,0.05)] transition hover:border-[var(--primary-border)]",
  cardTop:
    "flex min-w-0 items-start justify-between gap-3 max-[720px]:flex-col max-[720px]:items-start",
  cardInfo: "min-w-0 flex-1",
  cardTitle: "break-words text-[15px] font-bold text-[var(--text)]",
  cardMeta: "mt-1 break-words text-[12px] leading-relaxed text-[var(--muted)]",
  cardHeader: recordCardHeader,
  diagnosis: "break-words font-display text-[16px] font-bold text-[var(--text)]",
  meta: "text-[12px] leading-relaxed text-[var(--muted)]",
  status:
    "inline-flex shrink-0 items-center justify-center rounded-med border px-2.5 py-1 text-[11px] font-semibold",
  status_active: "border-sky-200 bg-sky-50 text-sky-700",
  status_expired: "border-amber-200 bg-amber-50 text-amber-700",
  status_cancelled: "border-slate-200 bg-slate-50 text-slate-600",
  statusDefault: "border-slate-200 bg-slate-50 text-slate-600",
  cardContent:
    "grid min-w-0 grid-cols-1 gap-3 py-3 md:grid-cols-[minmax(0,1fr)_220px]",
  labelHeading:
    "mb-2 block text-[11px] font-semibold uppercase tracking-[0.06em] text-[var(--muted)]",
  medicineListWrap: "flex min-w-0 flex-wrap gap-2",
  medicineBadgePill:
    "inline-flex max-w-full items-center rounded-med border border-[var(--border)] bg-[var(--surface)] px-2.5 py-1.5 text-[12px] font-bold text-[var(--text)]",
  moreBadge:
    "inline-flex items-center rounded-med border border-[var(--primary-border)] bg-[var(--primary-dim)] px-2.5 py-1.5 text-[12px] font-semibold text-[var(--primary)]",
  detailText: "text-[12px] leading-relaxed text-[var(--muted)]",
  detailLabelInline: "font-semibold text-[var(--text)]",
  actions:
    "mt-1 flex min-w-0 flex-wrap items-center justify-end gap-2 border-t border-[var(--border)] pt-3",
  actionBtnPrimary: "w-auto min-w-[140px] whitespace-nowrap",
  actionBtn: "w-auto min-w-[108px] whitespace-nowrap",
  actionBtnGhost: "w-auto min-w-[96px] whitespace-nowrap",
  revokeAction:
    "inline-flex min-h-[38px] items-center justify-center rounded-med border border-[var(--accent-border)] bg-[var(--accent-dim)] px-3 py-2 text-[12px] font-semibold text-[var(--accent)] transition hover:bg-[rgba(0,123,255,0.18)] disabled:cursor-not-allowed disabled:opacity-60",
  empty:
    "flex min-w-0 flex-col items-center justify-center gap-2 rounded-med border border-dashed border-[var(--border)] bg-[var(--card)] p-6 text-center shadow-[0_8px_24px_rgba(16,32,51,0.04)] [&_strong]:text-[15px] [&_strong]:font-bold [&_strong]:text-[var(--text)] [&_span]:max-w-md [&_span]:text-[12px] [&_span]:leading-relaxed [&_span]:text-[var(--muted)]",
});
export const consultationListStyles = createStyles({
  ...consultationListGeneratedStyles,
  page,
  header,
  filterBar:
    "flex min-w-0 flex-wrap items-center gap-2 rounded-med border border-[var(--border)] bg-[var(--card)] p-2 shadow-[0_8px_24px_rgba(16,32,51,0.05)]",
  filterBtn:
    "inline-flex min-h-[38px] min-w-0 items-center gap-2 rounded-med border border-transparent px-3 py-2 text-[12px] font-bold text-[var(--muted)] transition hover:border-[var(--primary-border)] hover:bg-[var(--primary-dim)] hover:text-[var(--primary)] [&_strong]:rounded-full [&_strong]:bg-[var(--surface)] [&_strong]:px-2 [&_strong]:py-0.5 [&_strong]:text-[11px] [&_strong]:text-[var(--text)]",
  filterActive:
    "border-[var(--primary-border)] bg-[var(--primary)] text-white shadow-[0_8px_18px_rgba(0,123,255,0.20)] hover:bg-[var(--primary)] hover:text-white [&_strong]:bg-white/20 [&_strong]:text-white",
  list: "flex min-w-0 flex-col gap-3",
  card:
    "min-w-0 rounded-med border border-[var(--border)] bg-[var(--card)] p-4 shadow-[0_8px_24px_rgba(16,32,51,0.05)] transition hover:border-[var(--primary-border)]",
  cardTop:
    "flex min-w-0 items-start justify-between gap-3 max-[720px]:flex-col max-[720px]:items-start",
  cardInfo: "min-w-0 flex-1",
  cardTitle: "break-words text-[15px] font-bold text-[var(--text)]",
  cardMeta: "mt-1 break-words text-[12px] leading-relaxed text-[var(--muted)]",
  cardHeader: recordCardHeader,
  title: "break-words font-display text-[15px] font-bold text-[var(--text)]",
  meta: "break-words text-[12px] leading-relaxed text-[var(--muted)]",
  status:
    "inline-flex shrink-0 items-center justify-center rounded-med border px-2.5 py-1 text-[11px] font-semibold",
  status_pending: "border-amber-200 bg-amber-50 text-amber-700",
  status_active: "border-sky-200 bg-sky-50 text-sky-700",
  status_completed: "border-emerald-200 bg-emerald-50 text-emerald-700",
  status_cancelled: "border-slate-200 bg-slate-50 text-slate-600",
  statusDefault: "border-slate-200 bg-slate-50 text-slate-600",
  statusPending: "border-amber-200 bg-amber-50 text-amber-700",
  statusActive: "border-sky-200 bg-sky-50 text-sky-700",
  statusCompleted: "border-emerald-200 bg-emerald-50 text-emerald-700",
  statusCancelled: "border-slate-200 bg-slate-50 text-slate-600",
  actions:
    "mt-4 flex min-w-0 flex-wrap items-center justify-end gap-2 border-t border-[var(--border)] pt-3",
  actionBtnPrimary: "w-auto min-w-[124px] whitespace-nowrap",
  actionBtn: "w-auto min-w-[108px] whitespace-nowrap",
  actionBtnGhost: "w-auto min-w-[96px] whitespace-nowrap",
  patientHistoryHeader:
    "flex min-w-0 items-start justify-between gap-3 rounded-med border border-[var(--primary-border)] bg-[linear-gradient(135deg,var(--primary-dim),rgba(255,255,255,0.86))] p-4 shadow-[0_10px_26px_rgba(0,123,255,0.08)] max-[640px]:flex-col [&_span]:text-[10px] [&_span]:font-semibold [&_span]:uppercase [&_span]:tracking-[0.08em] [&_span]:text-[var(--primary)] [&_h2]:m-0 [&_h2]:mt-1 [&_h2]:break-words [&_h2]:font-display [&_h2]:text-[21px] [&_h2]:font-bold [&_h2]:text-[var(--text)] [&_p]:mt-1 [&_p]:break-words [&_p]:text-[12px] [&_p]:leading-relaxed [&_p]:text-[var(--muted)]",
  empty:
    "flex min-w-0 flex-col items-center justify-center gap-2 rounded-med border border-dashed border-[var(--border)] bg-[var(--card)] p-6 text-center shadow-[0_8px_24px_rgba(16,32,51,0.04)] [&_strong]:text-[15px] [&_strong]:font-bold [&_strong]:text-[var(--text)] [&_span]:max-w-md [&_span]:text-[12px] [&_span]:leading-relaxed [&_span]:text-[var(--muted)]",
  detailPanel:
    "border-t border-[var(--border)] bg-[var(--surface)] p-3 sm:p-4",
  detailModalBackdrop:
    "fixed inset-0 z-[300] flex items-center justify-center bg-black/55 p-4 backdrop-blur-sm",
  detailModal:
    "flex max-h-[92vh] w-full max-w-5xl flex-col overflow-hidden rounded-med border border-[var(--border)] bg-[linear-gradient(180deg,var(--card),var(--surface))] text-left shadow-[0_28px_70px_rgba(0,0,0,0.38)]",
  detailModalHeader:
    "flex items-start justify-between gap-3 border-b border-[var(--border)] p-4 max-[640px]:flex-col [&_h2]:m-0 [&_h2]:break-words [&_h2]:font-display [&_h2]:text-[20px] [&_h2]:font-bold [&_h2]:text-[var(--text)] [&_p]:mt-1 [&_p]:break-words [&_p]:text-[13px] [&_p]:text-[var(--muted)]",
  detailModalClose:
    "shrink-0 rounded-med border border-[var(--border)] bg-[var(--surface)] px-3 py-2 text-[12px] font-bold text-[var(--text)] transition hover:border-[var(--primary-border)] hover:bg-[var(--card2)]",
  detailModalBody:
    "min-h-0 overflow-y-auto p-4",
  detailGrid: "grid min-w-0 grid-cols-1 gap-2 sm:grid-cols-2 xl:grid-cols-3",
  detailItem:
    "rounded-med border border-[var(--border)] bg-[var(--card)] p-3 [&_span]:block [&_span]:text-[11px] [&_span]:font-semibold [&_span]:uppercase [&_span]:tracking-[0.06em] [&_span]:text-[var(--muted)] [&_strong]:mt-1 [&_strong]:block [&_strong]:text-[13px] [&_strong]:font-bold [&_strong]:leading-relaxed [&_strong]:text-[var(--text)]",
  chatLocked:
    "flex min-w-0 items-center justify-between gap-3 rounded-med border border-[var(--border)] bg-[var(--surface)] p-3 max-[640px]:items-stretch max-[640px]:flex-col [&_strong]:block [&_strong]:text-[13px] [&_strong]:font-bold [&_strong]:text-[var(--text)] [&_span]:mt-1 [&_span]:block [&_span]:text-[12px] [&_span]:text-[var(--muted)]",
});
export const createPrescriptionStyles = createStyles({
  ...createPrescriptionGeneratedStyles,
  page,
  header: merge(header, "max-[900px]:flex-col"),
  steps:
    "flex min-w-0 items-center gap-2 overflow-x-auto rounded-med border border-[var(--border)] bg-[var(--surface)] p-2 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden max-[520px]:w-full",
  step:
    "flex min-w-0 shrink-0 items-center gap-2 rounded-med px-2 py-1.5 text-[12px] font-bold text-[var(--muted)] [&_span]:flex [&_span]:h-7 [&_span]:w-7 [&_span]:shrink-0 [&_span]:items-center [&_span]:justify-center [&_span]:rounded-med [&_span]:border [&_span]:border-[var(--border)] [&_span]:bg-[var(--card)] [&_label]:whitespace-nowrap max-[520px]:justify-center max-[520px]:px-1 max-[520px]:[&_label]:hidden",
  completed: "text-[var(--primary)] [&_span]:border-[var(--primary)] [&_span]:bg-[var(--primary-dim)]",
  active: "text-[var(--primary)] [&_span]:border-[var(--primary)] [&_span]:bg-[var(--primary)] [&_span]:text-white",
  connector: "h-px w-5 shrink-0 bg-[var(--border)] max-[520px]:w-full",
  card:
    "w-full min-w-0 rounded-med border border-[var(--border)] bg-[var(--card)] shadow-[0_10px_30px_rgba(17,24,39,0.06)]",
  stepContent:
    "flex min-w-0 flex-col gap-3 p-4 max-[520px]:p-3 [&_h2]:m-0 [&_h2]:text-[18px] [&_h2]:font-bold [&_h2]:text-[var(--text)] [&_>p]:m-0 [&_>p]:text-[13px] [&_>p]:text-[var(--muted)]",
  patientList: "flex max-h-[520px] min-w-0 flex-col gap-2 overflow-y-auto",
  patientCard:
    "flex min-w-0 w-full items-center justify-between gap-3 rounded-med border border-[var(--border)] bg-[var(--surface)] p-3 text-left transition hover:border-[var(--subtle)] hover:bg-[var(--card)]",
  selected: "border-[var(--primary)] bg-[var(--primary-dim)]",
  medicinesSection:
    "flex min-w-0 flex-col gap-3 rounded-med border border-[var(--border)] bg-[var(--surface)] p-3 max-[520px]:p-2.5",
  sectionHeader:
    "flex min-w-0 items-center justify-between gap-2 [&_h3]:m-0 [&_h3]:text-[15px] [&_h3]:font-bold max-[520px]:flex-row max-[520px]:items-center",
  addBtn:
    "ml-auto min-h-[36px] shrink-0 rounded-med bg-[var(--primary)] px-3 py-2 text-[12px] font-bold text-white hover:opacity-90",
  medicineRow:
    "grid min-w-0 grid-cols-[minmax(150px,1.35fr)_minmax(104px,0.8fr)_minmax(116px,0.95fr)_minmax(96px,0.75fr)_minmax(150px,1.25fr)_38px] items-end gap-2 rounded-med border border-[var(--border)] bg-[var(--card)] p-2.5 max-[1280px]:grid-cols-2 max-[560px]:grid-cols-1 [&_input]:min-h-[38px] [&_input]:min-w-0 [&_input]:rounded-med [&_input]:border [&_input]:border-[var(--border)] [&_input]:bg-[var(--surface)] [&_input]:px-2.5 [&_input]:py-2 [&_input]:text-[13px] [&_input]:text-[var(--text)] [&_select]:min-h-[38px] [&_select]:min-w-0 [&_select]:rounded-med [&_select]:border [&_select]:border-[var(--border)] [&_select]:bg-[var(--surface)] [&_select]:px-2.5 [&_select]:py-2 [&_select]:text-[13px] [&_select]:text-[var(--text)]",
  inputFull: "min-w-0 max-[1280px]:col-span-2 max-[560px]:col-span-1",
  inputSelect: "min-w-0",
  inputSmall: "min-w-0",
  medInstructionInput: "min-w-0 max-[1280px]:col-span-2 max-[560px]:col-span-1",
  removeBtn:
    "flex h-[38px] w-[38px] items-center justify-center rounded-med border border-[var(--accent-border)] bg-[var(--accent-dim)] text-[13px] font-bold text-[var(--accent)] hover:bg-sky-50 max-[1280px]:w-full",
  formGroup:
    "flex min-w-0 flex-col gap-1.5 [&_label]:text-[13px] [&_label]:font-bold [&_label]:text-[var(--text)] [&_textarea]:min-h-[88px] [&_textarea]:rounded-med [&_textarea]:border [&_textarea]:border-[var(--border)] [&_textarea]:bg-[var(--surface)] [&_textarea]:p-3 [&_textarea]:text-[13px] [&_textarea]:text-[var(--text)]",
  followUpBox:
    "flex min-w-0 items-center gap-3 rounded-med border border-[var(--border)] bg-[var(--surface)] p-3 max-[520px]:items-stretch max-[520px]:flex-col",
  checkbox:
    "inline-flex min-w-0 items-center gap-2 text-[13px] font-bold text-[var(--text)] [&_input]:h-4 [&_input]:w-4 [&_input]:accent-[var(--primary)]",
  followUpInput: merge(field, "max-w-[170px] max-[520px]:max-w-none"),
  reviewBox:
    "flex min-w-0 flex-col gap-3 rounded-med border border-[var(--border)] bg-[var(--surface)] p-3",
  reviewSection:
    "flex min-w-0 flex-col gap-2 [&_h3]:m-0 [&_h3]:text-[11px] [&_h3]:font-semibold [&_h3]:uppercase [&_h3]:tracking-[0.04em] [&_h3]:text-[var(--muted)] [&_p]:m-0 [&_p]:text-[13px] [&_p]:text-[var(--text)]",
  reviewMedicine:
    "rounded-med border border-[var(--border)] bg-[var(--card)] p-3 [&_strong]:text-[13px] [&_strong]:font-bold [&_strong]:text-[var(--text)]",
  actions:
    "flex flex-wrap items-center justify-end gap-2 border-t border-[var(--border)] pt-3 max-[520px]:justify-end [&_button]:min-h-[38px] [&_button]:max-w-full",
});
export const appointmentsStyles = createStyles({
  ...appointmentsGeneratedStyles,
  header,
  bookingPanel:
    "min-w-0 rounded-med border border-[var(--border)] bg-[var(--card)] p-4 shadow-[0_8px_24px_rgba(16,32,51,0.05)]",
  bookingIntro:
    "mb-4 flex min-w-0 items-start justify-between gap-3 border-b border-[var(--border)] pb-3",
  bookingTitle: "font-display text-[16px] font-bold text-[var(--text)]",
  bookingCopy:
    "mt-1 max-w-2xl text-[12px] leading-relaxed text-[var(--muted)]",
  formGrid:
    "grid min-w-0 grid-cols-1 gap-3 sm:grid-cols-2 [&_label]:min-w-0 [&_select]:min-h-[38px] [&_select]:w-full [&_select]:rounded-med [&_select]:border [&_select]:border-[var(--border)] [&_select]:bg-[var(--card)] [&_select]:px-3 [&_select]:text-[13px] [&_select]:text-[var(--text)] [&_select]:outline-none [&_select]:transition [&_select]:focus:border-[var(--primary)]",
  formGroup:
    "flex min-w-0 flex-col gap-1.5 [&_span]:text-[11px] [&_span]:font-semibold [&_span]:uppercase [&_span]:tracking-[0.06em] [&_span]:text-[var(--muted)]",
  fieldWide: "sm:col-span-2",
  textarea: merge(field, "min-h-[96px]"),
  formActions:
    "mt-4 flex min-w-0 flex-wrap items-center justify-between gap-3 border-t border-[var(--border)] pt-3",
  formNote: "text-[12px] leading-relaxed text-[var(--muted)]",
  submitBtn: "w-auto min-w-[152px] whitespace-nowrap",
  card:
    "min-w-0 rounded-med border border-[var(--border)] bg-[var(--card)] p-4 shadow-[0_8px_24px_rgba(16,32,51,0.05)] transition hover:border-[var(--primary-border)]",
  cardTop:
    "flex min-w-0 items-start justify-between gap-3 max-[720px]:flex-col max-[720px]:items-start",
  cardInfo: "min-w-0 flex-1",
  cardTitle: "break-words text-[15px] font-bold text-[var(--text)]",
  cardMeta: "mt-1 break-words text-[12px] leading-relaxed text-[var(--muted)]",
  status:
    "inline-flex shrink-0 items-center justify-center rounded-med border px-2.5 py-1 text-[11px] font-semibold",
  actions:
    "mt-4 flex min-w-0 flex-wrap items-center justify-end gap-2 border-t border-[var(--border)] pt-3",
  actionBtnPrimary: "w-auto min-w-[104px] whitespace-nowrap",
  actionBtn: "w-auto min-w-[96px] whitespace-nowrap",
  actionBtnGhost: "w-auto min-w-[92px] whitespace-nowrap",
});
export const prescriptionStyles = createStyles({
  ...prescriptionGeneratedStyles,
  greeting: greetingBlock,
  card:
    "mx-auto w-full max-w-[920px] min-w-0 overflow-hidden rounded-med border border-[var(--border)] bg-[var(--card)] shadow-[0_12px_34px_rgba(16,32,51,0.08)]",
  rxHeader:
    "grid min-w-0 grid-cols-[minmax(0,1fr)_auto_auto] items-start gap-3 border-b border-[var(--border)] bg-[linear-gradient(135deg,rgba(29,114,243,0.12),rgba(29,114,243,0.10)),var(--card)] p-4 max-[760px]:grid-cols-1 max-[560px]:p-3",
  tableWrap:
    "min-w-0 overflow-x-auto p-4 max-[620px]:overflow-visible max-[560px]:p-3",
  table:
    merge(
      baseStyles.table,
      "min-w-[720px] table-fixed [&_th:last-child]:w-[32%] [&_td]:align-top [&_td]:break-words [&_td:last-child]:whitespace-pre-wrap max-[620px]:table-auto max-[620px]:[&_td:nth-child(5)::before]:content-['Instructions']",
    ),
  instructionsText:
    "text-[13px] leading-relaxed text-[var(--text)] break-words whitespace-pre-wrap",
  notesText:
    "text-[13px] leading-relaxed text-[var(--text)] break-words whitespace-pre-wrap",
  actions:
    "!flex flex-wrap items-center justify-end gap-2 border-t border-[var(--border)] bg-[var(--surface)] p-3 max-[680px]:justify-stretch [&_button]:min-h-[38px] [&_button]:max-w-full max-[680px]:[&_button]:w-full",
});
export const prescriptionListStyles = createStyles({
  ...prescriptionListGeneratedStyles,
  page,
  header,
  filterBar: filterPanel,
  filterBtn: filterChip,
  prescriptionsList: "grid min-w-0 grid-cols-1 gap-3 xl:grid-cols-2",
  card:
    "min-w-0 overflow-hidden rounded-med border border-[var(--border)] bg-[var(--card)] shadow-[0_8px_24px_rgba(16,32,51,0.05)] transition hover:border-[var(--primary-border)]",
  cardHeader:
    "flex min-w-0 items-start justify-between gap-3 border-b border-[var(--border)] p-3 max-[640px]:flex-col",
  cardContent: "min-w-0 p-3",
  instructions:
    "m-3 rounded-med border border-amber-200 bg-amber-50 p-3 text-[12px] leading-relaxed text-amber-900 break-words whitespace-pre-wrap",
  actions:
    "flex flex-wrap items-center justify-end gap-2 border-t border-[var(--border)] bg-[var(--surface)] p-3 max-[640px]:justify-stretch [&_button]:min-h-[38px] [&_button]:max-w-full max-[640px]:[&_button]:w-full",
});
export const healthRecordsStyles = createStyles({
  ...healthRecordsGeneratedStyles,
  page:
    "mx-auto flex w-full min-w-0 max-w-[1280px] flex-col gap-4 pb-4 text-left",
  greeting:
    merge(greetingBlock, "p-5"),
  layout:
    "grid min-w-0 grid-cols-[minmax(0,1fr)_300px] items-start gap-4 max-[1100px]:grid-cols-[minmax(0,1fr)_280px] max-[900px]:grid-cols-1",
  mainContent:
    "min-w-0 space-y-4",
  healthSidebar:
    "sticky top-[calc(var(--topnav-height,52px)+12px)] min-w-0 space-y-3 rounded-med border border-[rgba(0,123,255,0.18)] bg-white/70 p-3 shadow-[0_12px_28px_rgba(0,82,170,0.07)] ring-1 ring-white/70 backdrop-blur max-[900px]:static",
  trendGrid:
    "grid min-w-0 grid-cols-1 gap-3",
  summaryGrid:
    "grid min-w-0 grid-cols-2 gap-3 lg:grid-cols-4",
  chartCard:
    "flex min-w-0 flex-col rounded-med border border-[rgba(0,123,255,0.16)] bg-white/88 p-3 shadow-[0_8px_18px_rgba(0,82,170,0.05)]",
  bars: "mt-3 flex h-28 min-w-0 items-end gap-2",
  barGroup: "flex min-w-0 flex-1 flex-col items-center justify-end gap-2",
  bar: "w-full min-w-[12px] rounded-t-med border border-transparent bg-[var(--primary)] transition-[height]",
  barLabel: "text-[10px] font-bold text-[var(--muted)]",
  tabs:
    "inline-flex max-w-full flex-wrap items-center gap-1 rounded-med border border-[var(--border)] bg-white/80 p-1 shadow-[0_8px_22px_rgba(0,82,170,0.05)]",
  tab:
    "min-h-[38px] rounded-med bg-transparent px-4 py-2 text-[12px] font-bold text-[var(--muted)] transition hover:bg-[var(--surface)] hover:text-[var(--text)]",
  activeTab:
    "!bg-[var(--primary)] !text-white shadow-[0_8px_18px_rgba(0,123,255,0.20)] hover:!bg-[var(--primary)] hover:!text-white",
  recordsList:
    "flex min-w-0 flex-col gap-3",
  recordCard:
    "group min-w-0 overflow-hidden rounded-med border border-[rgba(0,123,255,0.16)] bg-white/90 p-4 shadow-[0_10px_24px_rgba(0,82,170,0.06)] ring-1 ring-white/70 transition hover:border-[var(--primary-border)] hover:shadow-[0_16px_32px_rgba(0,82,170,0.10)]",
  recordHeader:
    "flex min-w-0 items-start justify-between gap-3 border-b border-[rgba(0,123,255,0.12)] pb-3 max-[900px]:flex-col max-[900px]:items-start",
  recordTitle: "break-words font-display text-[17px] font-bold text-[var(--text)]",
  recordMeta: "mt-1 break-words text-[12px] leading-relaxed text-[var(--muted)]",
  itemRow:
    "grid min-w-0 grid-cols-[minmax(0,1fr)_auto] items-center gap-3 rounded-med bg-[var(--surface)] px-3 py-2.5 max-[900px]:grid-cols-1",
  itemPrimary: "break-words font-bold text-[var(--text)]",
  itemSecondary: "break-words text-right text-[12px] text-[var(--muted)] max-[900px]:text-left",
  resultList: "flex min-w-0 flex-col gap-2",
  resultRow:
    "grid min-w-0 grid-cols-[minmax(120px,0.45fr)_minmax(0,1fr)] items-start gap-3 border-b border-[rgba(0,123,255,0.12)] py-3 last:border-b-0 max-[900px]:grid-cols-1",
  parameter: "text-[12px] font-bold text-[var(--text)]",
  resultValue: "min-w-0 break-words text-[13px] font-semibold text-[var(--text)]",
  timeline: "relative flex min-w-0 flex-col gap-4",
  timelineItem: "grid min-w-0 grid-cols-[24px_minmax(0,1fr)] gap-3",
  tlContent:
    "min-w-0 rounded-med border border-[rgba(0,123,255,0.16)] bg-white/90 p-4 shadow-[0_8px_18px_rgba(0,82,170,0.05)]",
  tlTitle: "break-words text-[15px] font-bold text-[var(--text)]",
  tlDetail: "mt-2 space-y-1 break-words text-[12px] leading-relaxed text-[var(--muted)]",
  summaryCard:
    "relative min-w-0 overflow-hidden rounded-med border border-[rgba(0,123,255,0.16)] bg-white/85 p-3 shadow-[0_8px_18px_rgba(0,82,170,0.05)] ring-1 ring-white/70 [&_span]:block [&_span]:text-[11px] [&_span]:font-semibold [&_span]:uppercase [&_span]:tracking-[0.04em] [&_span]:text-[var(--muted)] [&_strong]:mt-1 [&_strong]:block [&_strong]:break-words [&_strong]:font-display [&_strong]:text-[22px] [&_strong]:font-bold [&_strong]:leading-tight [&_strong]:text-[var(--primary)]",
  summaryTitle: "mb-3 font-display text-[15px] font-bold text-[var(--text)]",
  summaryRow: "flex items-start justify-between gap-3 border-b border-[var(--border)] py-2 text-[12px] text-[var(--muted)] last:border-b-0",
  sidebarHeader: "border-b border-[rgba(0,123,255,0.14)] pb-3 [&_h3]:m-0 [&_h3]:font-display [&_h3]:text-[16px] [&_h3]:font-bold [&_h3]:text-[var(--text)] [&_p]:mt-1 [&_p]:text-[12px] [&_p]:leading-relaxed [&_p]:text-[var(--muted)]",
  chartTitle: "font-bold text-[var(--text)]",
  chartSub: "mt-3 text-[12px] text-[var(--muted)]",
});
export const ordersStyles = createStyles({
  ...ordersGeneratedStyles,
  page: "mx-auto flex w-full min-w-0 max-w-[1180px] flex-col gap-4 pb-4 text-left max-[700px]:pb-24",
  hero: merge(
    topPanel,
    topCopy,
    "flex min-w-0 items-center justify-between gap-4 shadow-[0_16px_42px_var(--admin-shadow)] max-[900px]:items-stretch max-[900px]:flex-col",
  ),
  layout:
    "grid min-w-0 grid-cols-1 items-start gap-4 xl:grid-cols-[minmax(0,1fr)_360px]",
  mainContent: "min-w-0 space-y-4",
  right:
    "min-w-0 space-y-4 xl:sticky xl:top-[calc(var(--topnav-height,52px)+16px)]",
  cartCard:
    "min-w-0 rounded-med border border-[var(--border)] bg-[linear-gradient(180deg,var(--card),var(--surface))] p-4 shadow-[0_16px_38px_var(--admin-shadow)]",
  historySection:
    "space-y-3 rounded-med border border-[var(--border)] bg-[linear-gradient(180deg,var(--card),var(--surface))] p-4 shadow-[0_14px_34px_var(--admin-shadow)]",
  workspaceNav:
    "grid min-w-0 grid-cols-1 gap-2 rounded-med border border-[var(--border)] bg-[var(--surface)] p-1.5 shadow-[0_10px_28px_var(--admin-shadow)] sm:grid-cols-2",
  workspaceNavItem:
    "min-w-0 rounded-med border border-transparent bg-transparent p-3 text-left transition hover:border-[var(--primary-border)] hover:bg-[var(--card)] [&_span]:block [&_span]:break-words [&_span]:text-[13px] [&_span]:font-semibold [&_span]:text-[var(--text)] [&_strong]:mt-1 [&_strong]:block [&_strong]:text-[11px] [&_strong]:font-bold [&_strong]:text-[var(--muted)]",
  workspaceNavActive:
    "border-[var(--primary-border)] bg-[linear-gradient(135deg,var(--primary-dim),rgba(94,168,255,0.10))] shadow-[0_8px_18px_rgba(94,168,255,0.10)] [&_span]:text-[var(--primary)]",
  prescriptionPicker:
    "min-w-0 rounded-med border border-[var(--border)] bg-[linear-gradient(180deg,var(--card),var(--surface))] p-4 shadow-[0_14px_34px_var(--admin-shadow)]",
  prescriptionTabs:
    "grid min-w-0 grid-cols-1 gap-2 md:grid-cols-2 xl:grid-cols-3",
  prescriptionTab:
    "min-w-0 rounded-med border border-[var(--border)] bg-[var(--card)] p-3 text-left transition hover:border-[var(--primary-border)] hover:bg-[var(--card2)] [&_span]:block [&_span]:break-words [&_span]:font-display [&_span]:text-[16px] [&_span]:font-bold [&_span]:text-[var(--text)] [&_strong]:mt-1 [&_strong]:block [&_strong]:break-words [&_strong]:text-[12px] [&_strong]:font-bold [&_strong]:text-[var(--muted)] [&_small]:mt-2 [&_small]:block [&_small]:text-[11px] [&_small]:font-semibold [&_small]:uppercase [&_small]:tracking-[0.06em] [&_small]:text-[var(--primary)]",
  prescriptionTabActive:
    "border-[var(--primary-border)] bg-[linear-gradient(135deg,var(--primary-dim),rgba(94,168,255,0.10))] shadow-[0_12px_26px_rgba(94,168,255,0.10)]",
  historyWorkspace:
    "grid min-w-0 grid-cols-1 items-start gap-4 lg:grid-cols-[minmax(280px,0.75fr)_minmax(0,1fr)]",
  historyCard:
    "flex w-full min-w-0 items-center justify-between gap-3 rounded-med border border-[var(--border)] bg-[var(--card)] p-3 text-left transition hover:border-[var(--primary-border)] hover:bg-[var(--card2)]",
  historyCardActive:
    "border-[var(--primary-border)] bg-[linear-gradient(135deg,var(--primary-dim),rgba(94,168,255,0.10))]",
  selectedOrderCard:
    "min-w-0 rounded-med border border-[var(--border)] bg-[linear-gradient(180deg,var(--card),var(--surface))] p-4 shadow-[0_14px_34px_var(--admin-shadow)]",
  selectedOrderHeader:
    "mb-4 flex min-w-0 items-start justify-between gap-3 border-b border-[var(--border)] pb-3 max-[560px]:flex-col [&_h2]:m-0 [&_h2]:break-words [&_h2]:font-display [&_h2]:text-[20px] [&_h2]:font-bold [&_h2]:text-[var(--text)] [&_p]:mt-1 [&_p]:text-[12px] [&_p]:text-[var(--muted)]",
  selectedOrderItems: "space-y-2",
  selectedOrderItem:
    "flex min-w-0 items-start justify-between gap-3 rounded-med border border-[var(--border)] bg-[var(--card)] p-3 [&_strong]:block [&_strong]:break-words [&_strong]:text-[13px] [&_strong]:text-[var(--text)] [&_span]:mt-1 [&_span]:block [&_span]:break-words [&_span]:text-[12px] [&_span]:text-[var(--muted)] [&_b]:shrink-0 [&_b]:text-[var(--primary)]",
  selectedOrderTotal:
    "mt-3 flex items-center justify-between gap-3 rounded-med border border-[var(--primary-border)] bg-[var(--primary-dim)] p-3 [&_span]:text-[12px] [&_span]:font-bold [&_span]:text-[var(--muted)] [&_strong]:font-display [&_strong]:text-[20px] [&_strong]:font-bold [&_strong]:text-[var(--primary)]",
  addressCard:
    "relative min-w-0 overflow-hidden rounded-med border border-[var(--primary-border)] bg-[linear-gradient(135deg,var(--primary-dim),rgba(94,168,255,0.08)),var(--card)] p-4 shadow-[0_14px_34px_var(--admin-shadow)]",
  addressCardTop:
    "mb-3 flex min-w-0 items-start justify-between gap-3 max-[640px]:flex-col [&_h2]:m-0 [&_h2]:font-display [&_h2]:text-[18px] [&_h2]:font-bold [&_h2]:text-[var(--text)] [&_p]:mt-1 [&_p]:break-words [&_p]:text-[13px] [&_p]:leading-relaxed [&_p]:text-[var(--muted)]",
  addressComplete:
    "shrink-0 rounded-med border border-[var(--primary-border)] bg-[var(--primary-dim)] px-2.5 py-1 text-[11px] font-semibold uppercase tracking-[0.06em] text-[var(--primary)]",
  addressRequired:
    "shrink-0 rounded-med border border-amber-200 bg-amber-50 px-2.5 py-1 text-[11px] font-semibold uppercase tracking-[0.06em] text-amber-700",
  addressPreviewGrid: "grid min-w-0 grid-cols-1 gap-2 sm:grid-cols-2",
  addressPreviewItem:
    "min-w-0 rounded-med border border-[var(--border)] bg-[var(--card)] p-3 [&_span]:block [&_span]:text-[10px] [&_span]:font-semibold [&_span]:uppercase [&_span]:tracking-[0.06em] [&_span]:text-[var(--muted)] [&_strong]:mt-1 [&_strong]:block [&_strong]:break-words [&_strong]:text-[13px] [&_strong]:font-bold [&_strong]:text-[var(--text)]",
  addressMissing: "mt-3 text-[12px] font-bold text-amber-700",
  addressEditButton:
    "mt-3 inline-flex min-h-[38px] items-center justify-center rounded-med border border-[var(--primary-border)] bg-[var(--primary)] px-4 py-2 text-[12px] font-semibold text-white shadow-[0_10px_24px_rgba(29,114,243,0.18)] transition hover:opacity-90",
  addressModalBackdrop:
    "fixed inset-0 z-[300] flex items-center justify-center bg-black/55 p-4 backdrop-blur-sm",
  addressModal:
    "flex max-h-[92vh] w-full max-w-2xl flex-col overflow-hidden rounded-med border border-[var(--border)] bg-[linear-gradient(180deg,var(--card),var(--surface))] text-left shadow-[0_28px_70px_rgba(0,0,0,0.38)]",
  addressModalHeader:
    "flex items-start justify-between gap-3 border-b border-[var(--border)] p-4 max-[560px]:flex-col [&_h2]:m-0 [&_h2]:font-display [&_h2]:text-[20px] [&_h2]:font-bold [&_h2]:text-[var(--text)] [&_p]:mt-1 [&_p]:break-words [&_p]:text-[13px] [&_p]:leading-relaxed [&_p]:text-[var(--muted)]",
  addressCloseButton:
    "shrink-0 rounded-med border border-[var(--border)] bg-[var(--surface)] px-3 py-2 text-[12px] font-bold text-[var(--text)] transition hover:border-[var(--primary-border)] hover:bg-[var(--card2)]",
  addressModalBody:
    "min-h-0 overflow-y-auto p-4",
  addressNotice:
    "mb-4 rounded-med border border-[var(--primary-border)] bg-[var(--primary-dim)] p-3 text-[12px] text-[var(--muted)] [&_strong]:block [&_strong]:text-[13px] [&_strong]:text-[var(--text)] [&_span]:mt-1 [&_span]:block",
  addressFormGrid:
    "grid min-w-0 gap-3 sm:grid-cols-2",
  addressInput:
    merge(field, "min-h-[42px]"),
});
export const sosStyles = createStyles({
  ...sosGeneratedStyles,
  alert:
    "rounded-med bg-red-50 px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.08em] text-red-700",
  ring:
    "mx-auto flex h-44 w-44 items-center justify-center rounded-full border border-red-200 bg-red-50 shadow-[0_0_0_10px_rgba(239,68,68,0.08),0_22px_50px_rgba(239,68,68,0.22)]",
  inner:
    "flex h-32 w-32 items-center justify-center rounded-full bg-[linear-gradient(135deg,#ef4444,#b91c1c)] text-xl font-semibold text-white shadow-[0_16px_34px_rgba(185,28,28,0.35)]",
  connecting: "text-center font-bold text-red-700",
  helplineNumber: "font-display text-[24px] font-bold text-red-700",
});
export const patientReportsStyles = createStyles({
  ...patientReportsGeneratedStyles,
  header,
  cardActions: "mt-3 flex flex-wrap items-center justify-end gap-2",
});
export const patientVitalsStyles = createStyles({
  ...patientVitalsGeneratedStyles,
  header,
  cardActions: "flex flex-wrap items-center gap-2",
});
export const profileStyles = createStyles({
  ...profileGeneratedStyles,
  page:
    "mx-auto flex w-full min-w-0 max-w-[1240px] flex-col gap-4 pb-4 text-left max-[700px]:pb-24",
  header: merge(
    header,
    "items-stretch gap-4 p-5 shadow-[0_16px_40px_var(--admin-shadow)] max-[760px]:p-4",
  ),
  greeting: "min-w-0",
  layout:
    "grid min-w-0 grid-cols-1 items-start gap-4 xl:grid-cols-[minmax(280px,340px)_minmax(0,1fr)] lg:grid-cols-[minmax(260px,320px)_minmax(0,1fr)]",
  headerActions:
    "flex w-full flex-wrap items-center gap-2 sm:w-auto sm:justify-end max-[680px]:grid max-[680px]:grid-cols-1 max-[680px]:items-stretch [&_button]:max-w-full max-[680px]:[&_button]:w-full",
  requiredList:
    "mt-3 flex max-w-3xl flex-wrap gap-2 [&_span]:rounded-med [&_span]:border [&_span]:border-[var(--primary-border)] [&_span]:bg-[var(--card)] [&_span]:px-2.5 [&_span]:py-1 [&_span]:text-[11px] [&_span]:font-semibold [&_span]:text-[var(--primary)]",
  profileCard:
    "sticky top-[72px] min-w-0 overflow-hidden rounded-med border border-[var(--border)] bg-[linear-gradient(180deg,var(--card),var(--surface))] p-4 shadow-[0_16px_38px_rgba(19,34,53,0.10)] ring-1 ring-white/50 max-[1024px]:static before:pointer-events-none before:absolute before:inset-x-0 before:top-0 before:h-[3px] before:bg-[linear-gradient(90deg,var(--primary),rgba(34,184,242,0.55),transparent)]",
  sectionCard:
    "relative min-w-0 overflow-hidden rounded-med border border-[var(--border)] bg-[linear-gradient(180deg,var(--card),var(--surface))] p-4 shadow-[0_14px_34px_rgba(19,34,53,0.09)] ring-1 ring-white/50 max-[520px]:p-3",
  rightColumn: "min-w-0 space-y-4",
  avatarWrap: "flex flex-col items-center gap-3 rounded-med border border-[var(--primary-border)] bg-[linear-gradient(135deg,var(--primary-dim),var(--blue-dim))] p-4",
  infoGrid:
    "grid min-w-0 grid-cols-1 gap-3 md:grid-cols-2 2xl:grid-cols-3",
  statsGrid:
    "grid min-w-0 grid-cols-1 gap-3 sm:grid-cols-2 xl:grid-cols-3",
  avatar:
    "flex h-[104px] w-[104px] shrink-0 items-center justify-center overflow-hidden rounded-med border border-[var(--primary-border)] bg-[linear-gradient(135deg,var(--card),var(--surface))] text-[28px] font-semibold text-[var(--primary)] shadow-[0_16px_34px_rgba(94,168,255,0.16)] ring-4 ring-[var(--primary-dim)] max-[420px]:h-[88px] max-[420px]:w-[88px] [&_img]:h-full [&_img]:w-full [&_img]:object-cover",
  avatarUpload:
    "inline-flex min-h-[36px] items-center justify-center rounded-med border border-[var(--primary-border)] bg-[var(--card)] px-3 py-2 text-[12px] font-semibold text-[var(--primary)] shadow-[0_8px_18px_var(--admin-shadow)] transition hover:bg-[var(--card2)] [&_input]:hidden",
  profileName:
    "mt-4 min-w-0 text-center font-display text-[22px] font-bold leading-tight text-[var(--text)] max-[420px]:text-[19px]",
  nameInput:
    "min-w-0 text-center text-[16px] font-semibold",
  roleBadge:
    "mx-auto mt-2 inline-flex max-w-full items-center justify-center rounded-med border border-[var(--primary-border)] bg-[var(--primary-dim)] px-2.5 py-1 text-center text-[11px] font-semibold uppercase tracking-[0.08em] text-[var(--primary)]",
  contactSection:
    "mt-4 flex min-w-0 flex-col gap-3",
  contactBlock:
    "min-w-0 rounded-med border border-[var(--border)] bg-[var(--card)] p-3 shadow-[0_8px_18px_rgba(19,34,53,0.06)]",
  contactLabel:
    "text-[10px] font-semibold uppercase tracking-[0.08em] text-[var(--muted)]",
  contactValue:
    "mt-1 min-w-0 break-words text-[13px] font-bold leading-relaxed text-[var(--text)]",
  infoField:
    "min-w-0 rounded-med border border-[var(--border)] bg-[var(--card)] p-3 shadow-[0_8px_20px_rgba(19,34,53,0.06)] transition hover:-translate-y-0.5 hover:border-[var(--primary-border)] hover:shadow-[0_12px_26px_rgba(29,114,243,0.10)]",
  infoFieldFull: "md:col-span-2 2xl:col-span-3",
  infoLabel:
    "text-[10px] font-semibold uppercase tracking-[0.08em] text-[var(--muted)]",
  infoValue:
    "mt-1 min-w-0 break-words text-[13px] font-bold leading-relaxed text-[var(--text)]",
  infoEditor: "mt-2 min-w-0",
  statBox:
    "relative min-w-0 overflow-hidden rounded-med border border-[var(--border)] bg-[linear-gradient(135deg,var(--card),var(--surface))] p-4 shadow-[0_10px_26px_rgba(19,34,53,0.07)] ring-1 ring-white/50",
  statValue:
    "min-w-0 break-words font-display text-[24px] font-bold leading-tight text-[var(--text)] max-[420px]:text-[21px]",
  statLabel:
    "mt-1 text-[12px] font-bold leading-relaxed text-[var(--muted)]",
  statGreen: "text-sky-700",
  statBlue: "text-sky-700",
  statPurple: "text-violet-700",
  statAmber: "text-amber-700",
  recordsList: "flex min-w-0 flex-col gap-3",
  reviewCard:
    "min-w-0 rounded-med border border-[var(--border)] bg-[var(--card)] p-3 shadow-[0_8px_22px_var(--admin-shadow)]",
  reviewTop:
    "flex min-w-0 items-start justify-between gap-3 max-[520px]:flex-col",
  reviewPatient:
    "flex min-w-0 items-center gap-3",
  reviewAvatar:
    "flex h-10 w-10 shrink-0 items-center justify-center overflow-hidden rounded-med border border-[var(--border)] bg-[var(--primary-dim)] text-[12px] font-semibold text-[var(--primary)] [&_img]:h-full [&_img]:w-full [&_img]:object-cover",
  reviewPatientInfo: "min-w-0",
  reviewPatientName: "truncate font-bold text-[var(--text)]",
  reviewDate: "text-[12px] text-[var(--muted)]",
  reviewRating:
    "shrink-0 rounded-med border border-amber-200 bg-amber-50 px-2.5 py-1 text-[12px] font-semibold text-amber-700",
  reviewComment:
    "mt-3 break-words text-[13px] leading-relaxed text-[var(--muted)]",
  errorWrap: "rounded-med border border-[var(--accent-border)] bg-[var(--accent-dim)] p-3 text-[12px] text-[var(--accent)]",
  logoutBtn:
    "mt-1 inline-flex min-h-[40px] w-full items-center justify-center gap-2 rounded-med border border-red-200 bg-red-50 px-4 py-2 text-[13px] font-semibold text-red-600 shadow-[0_8px_18px_rgba(239,68,68,0.08)] transition hover:border-red-300 hover:bg-red-100 hover:text-red-700 hover:shadow-[0_10px_22px_rgba(239,68,68,0.14)] disabled:cursor-not-allowed disabled:opacity-60",
});
export const loginStyles = createStyles({
  ...loginGeneratedStyles,
  container:
    "!flex min-h-screen !w-full !items-center !justify-center overflow-y-auto bg-[linear-gradient(135deg,rgba(0,123,255,0.72),rgba(0,123,255,0.62))] px-4 py-6 sm:py-8",
  registerPage:
    "relative min-h-screen w-full overflow-y-auto bg-[linear-gradient(180deg,rgba(248,251,253,0.96),rgba(235,244,255,0.98))] px-4 py-6 text-left sm:py-8",
  background:
    "pointer-events-none fixed inset-0 opacity-10 [background-image:radial-gradient(circle_at_20%_50%,#00ff88_0%,transparent_50%),radial-gradient(circle_at_80%_80%,#00d4ff_0%,transparent_50%)]",
  card:
    "relative z-[1] w-[90%] max-w-[450px] rounded-[20px] bg-white p-7 shadow-[0_20px_60px_rgba(0,0,0,0.3)] max-[600px]:p-[18px]",
  scrollCard:
    "max-h-[90vh] overflow-y-auto",
  registerShell:
    "relative z-[1] mx-auto grid w-full max-w-[1140px] overflow-hidden rounded-med border border-[var(--border)] bg-white shadow-[0_24px_70px_rgba(19,34,53,0.14)] lg:grid-cols-[360px_minmax(0,1fr)]",
  registerHero:
    "flex min-w-0 flex-col justify-between gap-5 bg-[linear-gradient(180deg,var(--primary),#1557c8)] p-7 text-white max-[900px]:hidden [&_h1]:m-0 [&_h1]:font-heading [&_h1]:text-[31px] [&_h1]:font-bold [&_h1]:leading-tight [&_p]:m-0 [&_p]:text-sm [&_p]:leading-relaxed [&_p]:text-white/82",
  registerLogo:
    "h-[76px] w-auto max-w-[180px] rounded-med bg-white p-2.5 object-contain shadow-[0_14px_32px_rgba(0,0,0,0.14)]",
  registerMobileLogo:
    "mb-4 hidden h-[72px] w-auto max-w-[170px] rounded-med bg-white p-2 object-contain shadow-[0_12px_28px_rgba(19,34,53,0.12)] max-[900px]:block max-[520px]:mx-auto max-[520px]:h-[64px] max-[520px]:max-w-[150px]",
  registerSteps:
    "grid gap-2 border-t border-white/20 pt-5 [&_span]:rounded-med [&_span]:bg-white/10 [&_span]:px-3 [&_span]:py-2 [&_span]:text-[12px] [&_span]:font-bold [&_span]:text-white",
  registerPanel:
    "min-w-0 p-5 max-[620px]:p-4",
  registerPanelTop:
    "mb-4 flex min-w-0 items-start justify-between gap-3 border-b border-[var(--border)] pb-4 [&_span]:text-xs [&_span]:font-medium [&_span]:uppercase [&_span]:tracking-[0.08em] [&_span]:text-[var(--primary)] [&_h2]:m-0 [&_h2]:mt-1 [&_h2]:text-2xl [&_h2]:font-semibold [&_h2]:tracking-tight [&_h2]:text-[var(--text)] [&_button]:shrink-0 [&_button]:rounded-med [&_button]:border [&_button]:border-[var(--border)] [&_button]:bg-[var(--surface)] [&_button]:px-3 [&_button]:py-2 [&_button]:text-sm [&_button]:font-medium [&_button]:text-[var(--primary)]",
  header:
    "mb-[18px] text-center [&_h1]:m-0 [&_h1]:mb-2 [&_h1]:text-2xl [&_h1]:font-semibold [&_h1]:tracking-tight [&_h1]:text-[#1a1a1a] [&_p]:m-0 [&_p]:text-sm [&_p]:leading-relaxed [&_p]:text-[#666] max-[600px]:[&_h1]:text-[20px]",
  logoImage:
    "mx-auto mb-3 block h-16 w-[78px] object-contain max-[600px]:h-[58px] max-[600px]:w-[72px]",
  form:
    "flex flex-col gap-[14px]",
  registerForm:
    "flex flex-col gap-4",
  formSection:
    "min-w-0 rounded-med border border-[var(--border)] bg-[var(--surface)] p-4 max-[520px]:p-3",
  formSectionTitle:
    "mb-3 flex min-w-0 flex-wrap items-center justify-between gap-2 border-b border-[var(--border)] pb-2 [&_strong]:text-lg [&_strong]:font-semibold [&_strong]:text-[var(--text)] [&_span]:rounded-med [&_span]:bg-[var(--primary-dim)] [&_span]:px-2 [&_span]:py-1 [&_span]:text-xs [&_span]:font-medium [&_span]:uppercase [&_span]:tracking-[0.06em] [&_span]:text-[var(--primary)]",
  registerGrid:
    "grid min-w-0 grid-cols-1 gap-3 md:grid-cols-2",
  tabRow:
    "mb-4 flex gap-0 rounded-med bg-[var(--surface)] p-[3px]",
  tabBtn:
    "flex-1 rounded-med border-0 bg-transparent px-4 py-2 text-[13px] font-medium text-[#666] transition",
  tabActive:
    "bg-white text-[var(--primary)] shadow-[0_1px_4px_rgba(0,0,0,0.1)]",
  roleSelector:
    "flex gap-2",
  roleOption:
    "flex min-h-[var(--control-height)] flex-1 cursor-pointer items-center gap-2 rounded-med border-2 border-[#e0e0e0] px-3 py-2 text-[13px] font-medium transition hover:border-[var(--primary)] [&_input[type='radio']]:h-[18px] [&_input[type='radio']]:w-[18px] [&_input[type='radio']]:cursor-pointer [&_input[type='radio']]:accent-[var(--primary)]",
  active:
    "!border-[var(--primary)] !bg-[rgba(0,123,255,0.08)] !text-[var(--primary)]",
  inputGroup:
    "flex flex-col gap-2 [&_label]:text-[14px] [&_label]:font-semibold [&_label]:text-[#1a1a1a] [&_input]:min-h-[var(--control-height)] [&_input]:rounded-med [&_input]:border [&_input]:border-[#ddd] [&_input]:px-3 [&_input]:py-2 [&_input]:text-[13px] [&_input]:outline-none [&_input]:transition [&_input:focus]:border-[var(--primary)] [&_input:focus]:shadow-[0_0_0_3px_rgba(0,123,255,0.1)] [&_input:disabled]:cursor-not-allowed [&_input:disabled]:bg-[#f5f5f5] [&_input:disabled]:opacity-60 [&_select]:min-h-[var(--control-height)] [&_select]:w-full [&_select]:rounded-med [&_select]:border [&_select]:border-[#ddd] [&_select]:bg-white [&_select]:px-3 [&_select]:py-2 [&_select]:text-[13px] [&_select]:outline-none [&_select]:transition [&_select:focus]:border-[var(--primary)] [&_select:focus]:shadow-[0_0_0_3px_rgba(0,123,255,0.1)]",
  authSwitch:
    "mt-4 flex flex-wrap items-center justify-center gap-1.5 border-t border-[#e0e0e0] pt-4 text-[13px] text-[#666] [&_button]:bg-transparent [&_button]:p-0 [&_button]:text-[13px] [&_button]:font-bold [&_button]:text-[var(--primary)] [&_button:hover]:underline",
  registerActions:
    "grid grid-cols-1 gap-2 sm:grid-cols-[minmax(0,1fr)_220px]",
  loginBtn:
    "w-full !rounded-med !bg-[linear-gradient(135deg,#007BFF_0%,#007BFF_100%)] !py-3 text-[13px] font-semibold",
  secondaryAction:
    "inline-flex min-h-[var(--control-height)] items-center justify-center rounded-med border border-[var(--primary-border)] bg-[var(--primary-dim)] px-4 py-2 text-[12px] font-semibold text-[var(--primary)] transition hover:bg-[var(--card2)] disabled:cursor-not-allowed disabled:opacity-60",
  linkBtn:
    "bg-transparent p-1 text-[13px] font-bold text-[var(--primary)] disabled:cursor-not-allowed disabled:opacity-60",
  verifyModalBackdrop:
    "fixed inset-0 z-[420] flex items-center justify-center bg-slate-950/55 p-4 backdrop-blur-sm",
  verifyModal:
    "flex max-h-[92vh] w-full max-w-[430px] flex-col overflow-hidden rounded-med border border-[var(--primary-border)] bg-[linear-gradient(180deg,var(--card),var(--surface))] text-left shadow-[0_28px_80px_rgba(15,23,42,0.34)]",
  verifyModalHeader:
    "border-b border-[var(--border)] bg-[var(--card)] p-4 [&_span]:text-[10px] [&_span]:font-semibold [&_span]:uppercase [&_span]:tracking-[0.08em] [&_span]:text-[var(--primary)] [&_h2]:m-0 [&_h2]:mt-1 [&_h2]:font-display [&_h2]:text-[21px] [&_h2]:font-bold [&_h2]:text-[var(--text)] [&_p]:mt-1 [&_p]:text-[13px] [&_p]:leading-relaxed [&_p]:text-[var(--muted)]",
  verifyModalBody:
    "flex min-h-0 flex-col gap-3 overflow-y-auto p-4",
  verifyModalActions:
    "grid grid-cols-1 gap-2",
});
export const errorPageStyles = createStyles(errorPageGeneratedStyles);




