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
  "w-full rounded-med border border-[var(--border)] bg-[var(--card)] px-3 py-2 text-[13px] text-[var(--text)] outline-none transition focus:border-[var(--primary)]";
const card =
  "rounded-med border border-[var(--border)] bg-[var(--card)] p-4 shadow-[0_12px_32px_rgba(16,32,51,0.07)]";
const softCard =
  "rounded-med border border-[var(--border)] bg-[linear-gradient(135deg,rgba(255,255,255,0.92),rgba(248,251,255,0.96))] p-4 shadow-[0_8px_22px_rgba(16,32,51,0.04)]";
const page =
  "mx-auto flex w-full min-w-0 max-w-[var(--main-content-max)] flex-col gap-4 pb-4 text-left";
const topPanel =
  "relative min-w-0 overflow-hidden rounded-med border border-[var(--primary-border)] bg-[linear-gradient(135deg,rgba(20,184,166,0.20),rgba(59,130,246,0.14),rgba(14,165,233,0.08)),var(--card)] p-4 shadow-[0_14px_36px_rgba(15,23,42,0.08)]";
const topCopy =
  "[&_h1]:m-0 [&_h1]:font-display [&_h1]:text-[24px] [&_h1]:font-bold [&_h1]:leading-tight [&_h1]:text-[var(--text)] [&_p]:mt-1 [&_p]:max-w-3xl [&_p]:break-words [&_p]:text-[13px] [&_p]:leading-relaxed [&_p]:text-[var(--muted)] max-[560px]:p-3";
const header =
  merge(topPanel, topCopy, "flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between");
const greetingBlock = merge(topPanel, topCopy);
const headerActions = "flex flex-wrap items-center gap-2";
const title = "font-display text-[22px] font-bold leading-tight text-[var(--text)]";
const subtitle = "mt-1 max-w-2xl text-[13px] leading-relaxed text-[var(--muted)]";
const list = "flex min-w-0 flex-col gap-3";
const gridCards = "grid min-w-0 grid-cols-1 gap-3 sm:grid-cols-2 xl:grid-cols-3";
const pill =
  "inline-flex items-center justify-center rounded-med border border-[var(--border)] bg-[var(--surface)] px-2.5 py-1 text-[11px] font-bold text-[var(--muted)]";
const primaryButton =
  "inline-flex min-h-[38px] items-center justify-center gap-2 rounded-med bg-[var(--primary)] px-4 py-2 text-[12px] font-bold text-white transition hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-60";
const outlineButton =
  "inline-flex min-h-[38px] items-center justify-center gap-2 rounded-med border border-[var(--border)] bg-[var(--card)] px-4 py-2 text-[12px] font-bold text-[var(--text)] transition hover:bg-[var(--card2)] disabled:cursor-not-allowed disabled:opacity-60";
const dangerButton =
  "inline-flex min-h-[38px] items-center justify-center gap-2 rounded-med border border-[var(--accent-border)] bg-[var(--accent-dim)] px-4 py-2 text-[12px] font-bold text-[var(--accent)] transition hover:bg-sky-50 disabled:cursor-not-allowed disabled:opacity-60";
const logoutButton =
  "inline-flex min-h-[38px] items-center justify-center gap-2 rounded-med border border-[var(--border)] bg-[var(--card)] px-4 py-2 text-[12px] font-bold text-[var(--accent)] transition hover:bg-[var(--card2)] disabled:cursor-not-allowed disabled:opacity-60 [&_svg]:text-[var(--accent)]";

const baseStyles = {
  page,
  loadingWrap: "flex min-h-[60vh] items-center justify-center text-[13px] text-[var(--muted)]",
  header,
  greeting: "min-w-0",
  headerTitle: title,
  title,
  heroTitle: title,
  sectionTitle: "font-display text-[16px] font-bold text-[var(--text)]",
  colTitle: "text-[13px] font-bold text-[var(--text)]",
  headerSubtitle: subtitle,
  subtitle,
  copy: "text-[13px] text-[var(--muted)]",
  eyebrow: "text-[10px] font-black uppercase tracking-[0.08em] text-[var(--primary)]",
  headerActions,
  actions: headerActions,
  list,
  statsGrid: "grid min-w-0 grid-cols-1 gap-3 sm:grid-cols-2 xl:grid-cols-4",
  summaryGrid: "grid min-w-0 grid-cols-1 gap-3 sm:grid-cols-2 xl:grid-cols-3",
  grid: gridCards,
  actionGrid: gridCards,
  workspaceGrid: gridCards,
  insightGrid: "grid min-w-0 grid-cols-1 gap-3 xl:grid-cols-2",
  layout: "grid min-w-0 grid-cols-1 gap-4 xl:grid-cols-[minmax(0,1fr)_340px]",
  mainContent: "min-w-0 space-y-4",
  right: "min-w-0 space-y-4",
  rightColumn: "min-w-0 space-y-4",
  card,
  cardTitle: "font-bold text-[var(--text)]",
  cardMeta: "text-[12px] leading-relaxed text-[var(--muted)]",
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
  patientCard: "rounded-med border border-[var(--border)] bg-[var(--card)] p-3 transition hover:border-[var(--primary)]",
  empty:
    "rounded-med border border-dashed border-[var(--primary-border)] bg-[var(--primary-dim)] p-6 text-center text-[13px] font-bold text-[var(--primary)]",
  emptyText: "text-[13px] text-[var(--muted)]",
  emptyMini: "rounded-med bg-[var(--surface)] p-3 text-[12px] text-[var(--muted)]",
  emptyIcon: "mb-2 text-2xl",
  listState:
    "rounded-med border border-dashed border-[var(--border)] bg-[var(--surface)] p-4 text-center text-[12px] text-[var(--muted)]",
  sectionHeader: "mb-3 flex flex-col gap-2 sm:flex-row sm:items-start sm:justify-between",
  insightHeader: "mb-3 flex flex-col gap-2 sm:flex-row sm:items-start sm:justify-between",
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
  viewTab: "rounded-med px-3 py-2 text-[12px] font-bold text-[var(--muted)]",
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
  closeBtn: "rounded-med border border-[var(--border)] bg-[var(--card)] px-3 py-2 text-[12px] font-bold text-[var(--muted)] hover:bg-[var(--card2)]",
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
    "w-full min-w-[720px] border-collapse text-left text-[12px] max-[620px]:min-w-0 max-[620px]:block [&_th]:bg-[var(--surface)] [&_th]:px-3 [&_th]:py-3 [&_th]:font-black [&_td]:border-t [&_td]:border-[var(--border)] [&_td]:px-3 [&_td]:py-3 max-[620px]:[&_thead]:hidden max-[620px]:[&_tbody]:block max-[620px]:[&_tr]:mb-2 max-[620px]:[&_tr]:block max-[620px]:[&_tr]:overflow-hidden max-[620px]:[&_tr]:rounded-med max-[620px]:[&_tr]:border max-[620px]:[&_tr]:border-[var(--border)] max-[620px]:[&_tr]:bg-[var(--card)] max-[620px]:[&_td]:grid max-[620px]:[&_td]:grid-cols-[92px_minmax(0,1fr)] max-[620px]:[&_td]:gap-2 max-[620px]:[&_td]:border-t-0 max-[620px]:[&_td]:border-b max-[620px]:[&_td]:px-3 max-[620px]:[&_td]:py-2 max-[620px]:[&_td:last-child]:border-b-0 max-[620px]:[&_td::before]:text-[10px] max-[620px]:[&_td::before]:font-black max-[620px]:[&_td::before]:uppercase max-[620px]:[&_td::before]:tracking-[0.06em] max-[620px]:[&_td::before]:text-[var(--muted)] max-[620px]:[&_td:nth-child(1)::before]:content-['Medicine'] max-[620px]:[&_td:nth-child(2)::before]:content-['Dosage'] max-[620px]:[&_td:nth-child(3)::before]:content-['Frequency'] max-[620px]:[&_td:nth-child(4)::before]:content-['Duration'] max-[620px]:[&_td:nth-child(5)::before]:content-['Notes']",
  qrSection:
    "min-w-0 rounded-med border border-[var(--border)] bg-white/80 p-2 text-center max-[760px]:w-fit",
  qrCode:
    "mx-auto flex h-20 w-20 items-center justify-center overflow-hidden rounded-med border border-[var(--border)] bg-white p-1 [&_img]:h-full [&_img]:w-full [&_img]:object-contain",
  queueList: "flex flex-col gap-2",
  queueItem: "flex min-w-0 flex-col gap-3 rounded-med border border-[var(--border)] bg-[var(--surface)] p-3 sm:flex-row sm:items-center sm:justify-between",
  userCell: "flex min-w-0 items-center gap-3",
  avatar:
    "flex h-10 w-10 shrink-0 items-center justify-center overflow-hidden rounded-med border border-[var(--border)] bg-[var(--primary-dim)] text-[12px] font-black text-[var(--primary)] [&_img]:h-full [&_img]:w-full [&_img]:object-cover",
  photo:
    "h-16 w-16 shrink-0 overflow-hidden rounded-med border border-[var(--border)] bg-[var(--surface)] object-cover",
  name: "font-bold text-[var(--text)]",
  meta: "text-[12px] text-[var(--muted)]",
  label: "text-[11px] font-black uppercase tracking-[0.04em] text-[var(--muted)]",
  value: "font-bold text-[var(--text)]",
  price: "font-bold text-[var(--primary)]",
  status: pill,
  statusPill: pill,
  pill,
  inlinePill: pill,
  rolePill: pill,
  badge: pill,
  rxBadge: "rounded-med bg-[var(--primary-dim)] px-2.5 py-1 text-[11px] font-black text-[var(--primary)]",
  safeBadge: "rounded-med bg-emerald-50 px-2.5 py-1 text-[11px] font-black text-emerald-700",
  statusActive: "border-emerald-200 bg-emerald-50 text-emerald-700",
  statusCompleted: "border-emerald-200 bg-emerald-50 text-emerald-700",
  statusConfirmed: "border-emerald-200 bg-emerald-50 text-emerald-700",
  status_confirmed: "border-emerald-200 bg-emerald-50 text-emerald-700",
  status_delivered: "border-emerald-200 bg-emerald-50 text-emerald-700",
  status_processing: "border-sky-200 bg-sky-50 text-sky-700",
  status_shipped: "border-sky-200 bg-sky-50 text-sky-700",
  statusPending: "border-sky-200 bg-sky-50 text-sky-700",
  status_requested: "border-sky-200 bg-sky-50 text-sky-700",
  status_pending: "border-sky-200 bg-sky-50 text-sky-700",
  statusExpired: "border-sky-200 bg-sky-50 text-sky-700",
  statusCancelled: "border-sky-200 bg-sky-50 text-sky-700",
  status_cancelled: "border-sky-200 bg-sky-50 text-sky-700",
  status_missed: "border-sky-200 bg-sky-50 text-sky-700",
  status_completed: "border-emerald-200 bg-emerald-50 text-emerald-700",
  statusDefault: "border-[var(--border)] bg-[var(--surface)] text-[var(--muted)]",
  good: "text-emerald-700",
  warn: "text-amber-700",
  danger: "text-rose-700",
  normal: "text-emerald-700",
  critical: "rounded-med bg-sky-50 px-2 py-1 text-[10px] font-black text-sky-700",
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
  verifyBox: "rounded-med border border-emerald-200 bg-emerald-50 p-3 text-[12px] text-emerald-700",
  priceRange: "text-[12px] font-bold text-[var(--muted)]",
  rating: "text-[12px] font-bold text-amber-600",
  spec: "text-[12px] text-[var(--muted)]",
  stats: "flex flex-wrap items-center gap-2 text-[12px] text-[var(--muted)]",
  resultCount: "text-[12px] text-[var(--muted)]",
  on: "bg-emerald-500",
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
  quickIconPrimary: "bg-emerald-50 text-emerald-600",
  quickIconSos: "bg-emerald-50 text-emerald-700",
  quickTitleSos: "text-emerald-700",
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
  consultDot_active: "bg-emerald-500",
  consultDot_completed: "bg-emerald-500",
  consultDot_cancelled: "bg-sky-500",
  consultDot_default: "bg-slate-300",
  reminderRow: "flex items-center justify-between gap-3 rounded-med border border-[var(--border)] bg-[var(--card)] p-3",
  reminderInfo: "min-w-0",
  reminderName: "font-bold text-[var(--text)]",
  reminderTime: "text-[12px] text-[var(--muted)]",
  docAvatar: "flex h-10 w-10 items-center justify-center rounded-med bg-emerald-50 font-black text-emerald-700",
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
  detailLabelInline: "text-[11px] font-black uppercase tracking-[0.04em] text-[var(--muted)]",
  detailText: "text-[13px] text-[var(--text)]",
  labelHeading: "text-[12px] font-black text-[var(--text)]",
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
  completed: "border-emerald-200 bg-emerald-50",
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
  publicHeroValid: "border-emerald-200 bg-emerald-50",
  publicHeroInvalid: "border-sky-200 bg-sky-50",
  publicHeroContent: "flex flex-col gap-3 sm:flex-row sm:items-center",
  publicHeroMark: "flex h-12 w-12 shrink-0 items-center justify-center rounded-med bg-white text-xl font-black text-emerald-700",
  publicHeroMeta: "text-[12px] text-[var(--muted)]",
  rxHeader: "flex flex-col gap-3 rounded-med border border-[var(--border)] bg-[var(--card)] p-4 sm:flex-row sm:items-start sm:justify-between",
  rxBrand: "flex items-center gap-3",
  rxLogo: "flex h-12 w-12 items-center justify-center rounded-med bg-[var(--surface)]",
  rxLogoImage: "h-10 w-10 object-contain",
  rxBrandSub: "text-[12px] text-[var(--muted)]",
  rxId: "font-mono text-[12px] text-[var(--muted)]",
  rxDateGroup: "grid grid-cols-2 gap-2",
  rxDate: "text-right",
  rxDateLabel: "text-[10px] font-black uppercase text-[var(--muted)]",
  rxDateVal: "text-[12px] font-bold text-[var(--text)]",
  headerChips: "flex flex-wrap gap-2",
  headerChip: pill,
  parties: "grid grid-cols-1 gap-3 sm:grid-cols-2",
  party: softCard,
  partyLabel: "text-[10px] font-black uppercase tracking-[0.04em] text-[var(--muted)]",
  partyName: "mt-1 font-bold text-[var(--text)]",
  partyDetail: "text-[12px] text-[var(--muted)]",
  tableWrapRx: "overflow-x-auto rounded-med border border-[var(--border)]",
  instructionsLabel: "text-[11px] font-black uppercase text-[var(--muted)]",
  instructionsText: "mt-1 text-[13px] text-[var(--text)]",
  notesLabel: "text-[11px] font-black uppercase text-[var(--muted)]",
  notesText: "mt-1 text-[13px] text-[var(--text)]",
  detailBlock: softCard,
  detailTitle: "mb-2 text-[12px] font-black text-[var(--text)]",
  detailPills: "flex flex-wrap gap-2",
  detailPill: pill,
  qrSection: "flex flex-col items-center gap-2 rounded-med border border-[var(--border)] bg-[var(--surface)] p-4",
  qrCode: "rounded-med bg-white p-2",
  qrLabel: "text-[11px] font-black uppercase text-[var(--muted)]",
  qrId: "font-mono text-[11px] text-[var(--muted)]",
  validityBox: "grid grid-cols-1 gap-2 sm:grid-cols-3",
  validityItem: softCard,
  verified: "text-emerald-700",
  valueActive: "text-emerald-700",
  valueExpired: "text-rose-700",
  valueCancelled: "text-rose-700",
  expiryValue: "font-bold text-[var(--text)]",
  followUp: "flex items-start gap-3 rounded-med border border-sky-200 bg-sky-50 p-3 text-sky-700",
  followUpIcon: "mt-0.5",
  successBanner: "rounded-med border border-emerald-200 bg-emerald-50 p-3 text-[12px] text-emerald-700",
  warningBanner: "rounded-med border border-emerald-200 bg-emerald-50 p-3 text-[12px] text-emerald-700",
  verifyMarkError: "flex h-12 w-12 shrink-0 items-center justify-center rounded-med bg-sky-50 text-lg font-black text-sky-700",
  verifyContent: "space-y-2",
  verifyEyebrow: "text-[10px] font-black uppercase tracking-[0.08em] text-[var(--muted)]",
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
  contactLabel: "text-[11px] font-black uppercase text-[var(--muted)]",
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
  infoLabel: "text-[11px] font-black uppercase tracking-[0.04em] text-[var(--muted)]",
  infoValue: "mt-1 break-words text-[13px] font-bold text-[var(--text)]",
  infoEditor: "mt-2",
  addressForm: "space-y-2",
  twoCol: "grid grid-cols-1 gap-2 sm:grid-cols-2",
  statBox: softCard,
  statValue: "font-display text-[24px] font-bold text-[var(--text)]",
  statLabel: "text-[12px] text-[var(--muted)]",
  statGreen: "text-emerald-700",
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
  sectionLabel: "text-[11px] font-black uppercase tracking-[0.06em] text-[var(--muted)]",
  badgeHigh: "border-sky-200 bg-sky-50 text-sky-700",
  badgeLow: "border-emerald-200 bg-emerald-50 text-emerald-700",
  badgeNormal: "border-emerald-200 bg-emerald-50 text-emerald-700",
  badgeActive: "border-emerald-200 bg-emerald-50 text-emerald-700",
  badgeExpired: "border-sky-200 bg-sky-50 text-sky-700",
  badgeCancelled: "border-sky-200 bg-sky-50 text-sky-700",
  badgeDefault: "border-[var(--border)] bg-[var(--surface)] text-[var(--muted)]",
  recordBadgeDefault: "border-[var(--border)] bg-[var(--surface)] text-[var(--muted)]",
  ordersLayout: "grid grid-cols-1 gap-4 xl:grid-cols-[minmax(0,1fr)_360px]",
  hero: "rounded-med border border-[var(--border)] bg-[var(--card)] p-4",
  heroStats: "mt-4 grid grid-cols-1 gap-3 sm:grid-cols-3",
  patientStrip: "flex min-w-0 items-center gap-3 rounded-med bg-[var(--surface)] p-3",
  patientAvatar: "flex h-10 w-10 items-center justify-center rounded-med bg-[var(--primary-dim)] font-black text-[var(--primary)]",
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
  savingsRow: "rounded-med bg-emerald-50 p-3 text-[12px] text-emerald-700",
  sectionTop: "mb-3 flex items-center justify-between",
  tracker: "space-y-3",
  trackerHead: "flex items-start justify-between gap-3",
  trackerStatus: pill,
  step: "relative flex gap-3",
  stepLeft: "flex flex-col items-center",
  stepDot: "h-3 w-3 rounded-full bg-[var(--border)]",
  stepLine: "h-full min-h-[28px] w-px bg-[var(--border)]",
  done: "bg-emerald-500",
  current: "bg-[var(--primary)]",
  pending: "bg-[var(--border)]",
  doneLine: "bg-emerald-300",
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
  alert: "rounded-med bg-red-50 px-3 py-1 text-[11px] font-black uppercase tracking-[0.08em] text-red-700",
  ring: "mx-auto flex h-44 w-44 items-center justify-center rounded-full border border-red-200 bg-red-50 shadow-[0_0_0_10px_rgba(239,68,68,0.08),0_22px_50px_rgba(239,68,68,0.22)]",
  ringing: "animate-pulse",
  inner: "flex h-32 w-32 items-center justify-center rounded-full bg-[linear-gradient(135deg,#ef4444,#b91c1c)] text-xl font-black text-white shadow-[0_16px_34px_rgba(185,28,28,0.35)]",
  hint: "text-center text-[12px] text-[var(--muted)]",
  connecting: "text-center font-bold text-sky-700",
  connected: "text-center font-bold text-emerald-700",
  helpline: "rounded-med border border-[var(--border)] bg-[var(--surface)] p-3 text-center",
  helplineLabel: "text-[10px] font-black uppercase tracking-[0.08em] text-[var(--muted)]",
  helplineNumber: "font-display text-[24px] font-bold text-[var(--accent)]",
  infoTitle: "font-display text-[18px] font-bold text-[var(--text)]",
  infoSubtitle: "text-[12px] text-[var(--muted)]",
  panelLabel: "text-[10px] font-black uppercase tracking-[0.08em] text-[var(--muted)]",
  statusText: "mt-1 break-words text-[13px] font-bold text-[var(--text)]",
  sosMap: "min-h-[180px] overflow-hidden rounded-med bg-[var(--surface)]",
  hospitalHeader: "flex items-center justify-between gap-3",
  hospitalList: "space-y-2",
  hospitalMain: "min-w-0 flex-1",
  hospitalActions: "mt-2 flex flex-wrap gap-2",
  rank: "flex h-8 w-8 shrink-0 items-center justify-center rounded-med bg-[var(--primary-dim)] font-black text-[var(--primary)]",
  checklist: "rounded-med border border-[var(--border)] bg-[var(--surface)] p-3",
  overlay: "fixed inset-0 z-[260] bg-black/40",
};

export const appShellStyles = createStyles({
  shell:
    "grid h-screen grid-cols-[220px_minmax(0,1fr)] grid-rows-[52px_minmax(0,1fr)] overflow-hidden max-[900px]:grid-cols-[180px_minmax(0,1fr)] max-[700px]:grid-cols-1 max-[700px]:grid-rows-[auto_minmax(0,1fr)]",
  main:
    "min-w-0 overflow-y-auto bg-transparent p-3.5 max-[700px]:p-2.5 max-[700px]:pb-[calc(96px+env(safe-area-inset-bottom,0px))]",
  content: "mx-auto min-h-full w-full max-w-[var(--main-content-max)] min-w-0",
});

export const adminShellStyles = createStyles({
  shell:
    "min-h-screen bg-[var(--bg)]",
  workspace:
    "relative flex min-h-[calc(100vh-52px)] bg-[var(--bg)]",
  mobileMenuButton:
    "hidden",
  mobileMenuButtonOpen: "border-[var(--border)] bg-[var(--text)]",
  backdrop:
    "hidden",
  backdropVisible: "!opacity-100 !pointer-events-auto",
  sidebar:
    "sticky top-[52px] z-[190] flex h-[calc(100vh-52px)] w-[292px] shrink-0 flex-col gap-4 border-r border-[var(--border)] bg-[var(--surface)] p-3 transition-all max-[980px]:hidden",
  collapsed: "min-[981px]:w-[92px]",
  mobileOpen: "max-[980px]:!translate-x-0",
  sidebarHeader:
    "flex items-center justify-between gap-3 rounded-med border border-[var(--border)] bg-[var(--card)] p-2.5",
  identityBlock: "flex min-w-0 items-center gap-3",
  identityAvatar:
    "flex h-10 w-10 shrink-0 items-center justify-center rounded-med border border-[var(--primary-border)] bg-[var(--primary-dim)] text-[13px] font-black text-[var(--primary)] shadow-sm ring-2 ring-[var(--primary-dim)]",
  identityCopy: "flex min-w-0 flex-col gap-0.5 [&_span]:truncate [&_span]:text-[11px] [&_span]:text-[var(--muted)] [&_strong]:text-[14px] [&_strong]:font-black [&_strong]:text-[var(--primary)]",
  collapseBtn:
    "inline-flex h-9 w-9 shrink-0 items-center justify-center rounded-med border border-[var(--border)] bg-[var(--card)] text-[var(--muted)] hover:bg-[var(--card2)] max-[980px]:hidden",
  mobileCloseButton:
    "hidden h-10 w-10 shrink-0 items-center justify-center rounded-med border border-[var(--border)] bg-[var(--card)] p-0 text-[var(--text)] hover:bg-[var(--card2)]",
  sidebarBody: "flex flex-1 flex-col gap-4 overflow-y-auto pr-0.5",
  navSection: "flex flex-col gap-2.5",
  sectionLabel: "px-1.5 text-[11px] font-black uppercase tracking-[0.08em] text-[var(--muted)]",
  nav: "flex flex-col gap-1.5",
  navItem:
    "group flex w-full min-w-0 items-center gap-3 rounded-med border border-transparent bg-transparent p-2.5 text-left text-[var(--muted)] transition hover:border-[var(--border)] hover:bg-[var(--card)] hover:text-[var(--text)]",
  active:
    "border-[var(--primary-border)] bg-[var(--primary-dim)] text-[var(--primary)] shadow-[inset_3px_0_0_var(--primary)]",
  navIcon:
    "inline-flex h-10 w-10 shrink-0 items-center justify-center rounded-med border border-[var(--border)] bg-[var(--card)] text-inherit group-hover:border-[var(--subtle)]",
  navCopy: "flex min-w-0 flex-1 flex-col gap-0.5",
  navLabel: "text-[13px] font-black text-inherit",
  navMeta: "text-[11px] leading-snug text-[var(--muted)]",
  sidebarFooter: "flex flex-col gap-2.5 pt-1",
  footerCard:
    "flex min-w-0 flex-col gap-1 rounded-med border border-[var(--primary-border)] bg-[var(--primary-dim)] p-3 shadow-sm [&_strong]:truncate [&_strong]:text-[13px] [&_strong]:font-black [&_strong]:text-[var(--text)]",
  footerLabel: "text-[10px] font-black uppercase tracking-[0.08em] text-[var(--muted)]",
  adminRolePill:
    "mt-1 inline-flex w-fit rounded-med border border-[var(--primary-border)] bg-[var(--card)] px-2 py-1 text-[10px] font-black uppercase tracking-[0.08em] text-[var(--primary)]",
  logoutButton:
    "flex w-full items-center gap-3 rounded-med border border-[var(--border)] bg-[var(--card)] p-3 text-left font-bold text-[var(--accent)] hover:bg-[var(--card2)] [&_svg]:text-[var(--accent)]",
  main:
    "min-w-0 flex-1 p-3.5 max-[980px]:p-3 max-[980px]:pb-[calc(96px+env(safe-area-inset-bottom,0px))] max-[560px]:p-2.5 max-[560px]:pb-[calc(96px+env(safe-area-inset-bottom,0px))]",
  mainExpanded: "pl-3",
  content: "mx-auto min-h-full w-full max-w-[var(--main-content-max)] min-w-0",
  bottomNav:
    "pointer-events-none fixed inset-x-0 bottom-0 z-[220] hidden px-2 pb-[calc(8px+env(safe-area-inset-bottom,0px))] max-[980px]:block",
  bottomNavScroller:
    "pointer-events-auto mx-auto flex max-w-[560px] items-center gap-1.5 overflow-x-auto rounded-med border border-[var(--border)] bg-white/95 p-1.5 shadow-[0_14px_34px_rgba(16,32,51,0.18)] backdrop-blur [scrollbar-width:none] [&::-webkit-scrollbar]:hidden",
  bottomNavItem:
    "flex h-[58px] min-w-[70px] shrink-0 flex-col items-center justify-center gap-1 rounded-med border border-transparent bg-transparent px-2 text-[var(--muted)] transition active:scale-[0.98] hover:bg-[var(--card2)]",
  bottomNavActive:
    "border-[var(--primary-border)] bg-[var(--primary-dim)] text-[var(--primary)] shadow-[inset_0_-3px_0_var(--primary)]",
  bottomNavIcon:
    "inline-flex h-5 w-5 shrink-0 items-center justify-center [&_svg]:h-[18px] [&_svg]:w-[18px]",
  bottomNavText:
    "max-w-[64px] truncate text-[10px] font-black leading-none",
});

export const sidebarStyles = createStyles({
  mobileMenuButton:
    "hidden",
  mobileMenuButtonOpen: "border-[var(--border)] bg-[var(--text)]",
  mobileBackdrop:
    "hidden",
  mobileBackdropVisible: "!opacity-100 !pointer-events-auto",
  sidebar:
    "flex min-h-0 flex-col gap-1 overflow-hidden border-r border-[var(--border)] bg-[var(--surface)] p-3 max-[700px]:hidden",
  mobileOpen: "max-[700px]:!translate-x-0",
  mobileHeader:
    "hidden items-center justify-between rounded-med border border-[var(--primary-border)] bg-[var(--primary-dim)] p-2.5 max-[700px]:flex [&_strong]:text-[14px] [&_strong]:font-black [&_strong]:text-[var(--primary)]",
  mobileCloseButton:
    "inline-flex h-10 w-10 shrink-0 items-center justify-center rounded-med border border-[var(--border)] bg-[var(--card)] p-0 text-[var(--text)] hover:bg-[var(--card2)]",
  label:
    "px-2 pb-1.5 text-[10px] font-bold uppercase tracking-[0.08em] text-[var(--muted)] max-[700px]:hidden",
  nav:
    "flex flex-col gap-0.5",
  navItem:
    "flex w-full items-center gap-2.5 rounded-med px-2.5 py-2.5 text-left text-[13px] font-bold text-[var(--muted)] transition hover:bg-[var(--card)] hover:text-[var(--text)]",
  active:
    "border-[var(--primary-border)] bg-[var(--primary-dim)] font-bold text-[var(--primary)]",
  navIcon: "inline-flex shrink-0 items-center justify-center",
  navText: "inline",
  mobileText:
    "hidden",
  spacer: "flex-1 max-[700px]:hidden",
  sosBtn:
    "mb-2 flex w-full items-center gap-2.5 rounded-med border border-red-200 bg-[linear-gradient(135deg,rgba(239,68,68,0.16),rgba(248,113,113,0.10))] px-3 py-2.5 text-left text-[13px] font-black text-red-700 shadow-[0_10px_26px_rgba(239,68,68,0.18)] ring-1 ring-red-200 transition hover:border-red-300 hover:bg-red-50 hover:shadow-[0_12px_30px_rgba(239,68,68,0.26)]",
  sosActive: "bg-[linear-gradient(135deg,#ef4444,#b91c1c)] text-white shadow-[inset_0_-3px_0_rgba(255,255,255,0.35),0_12px_32px_rgba(239,68,68,0.32)] [&_.sosPulse]:bg-white",
  sosIconWrap: "inline-flex shrink-0 items-center justify-center",
  sosPulse: "sosPulse h-2.5 w-2.5 shrink-0 animate-ping rounded-full bg-red-600",
  logoutBtn:
    "flex w-full items-center gap-2.5 rounded-med border border-[var(--border)] bg-[var(--surface)] px-3 py-2.5 text-left text-[13px] font-bold text-[var(--accent)] hover:bg-[var(--card)] [&_svg]:text-[var(--accent)]",
  bottomNav:
    "pointer-events-none fixed inset-x-0 bottom-0 z-[220] hidden px-2 pb-[calc(8px+env(safe-area-inset-bottom,0px))] max-[700px]:block",
  bottomNavScroller:
    "pointer-events-auto mx-auto flex max-w-[560px] items-center gap-1.5 overflow-x-auto rounded-med border border-[var(--border)] bg-white/95 p-1.5 shadow-[0_14px_34px_rgba(16,32,51,0.18)] backdrop-blur [scrollbar-width:none] [&::-webkit-scrollbar]:hidden",
  bottomNavItem:
    "flex h-[58px] min-w-[68px] shrink-0 flex-col items-center justify-center gap-1 rounded-med border border-transparent bg-transparent px-2 text-[var(--muted)] transition active:scale-[0.98] hover:bg-[var(--card2)]",
  bottomNavActive:
    "border-[var(--primary-border)] bg-[var(--primary-dim)] text-[var(--primary)] shadow-[inset_0_-3px_0_var(--primary)]",
  bottomSosItem:
    "min-w-[58px] border-red-200 bg-[linear-gradient(135deg,rgba(239,68,68,0.16),rgba(248,113,113,0.10))] text-red-700 shadow-[0_8px_20px_rgba(239,68,68,0.16)]",
  bottomSosActive:
    "bg-[linear-gradient(135deg,#ef4444,#b91c1c)] text-white shadow-[inset_0_-3px_0_rgba(255,255,255,0.45),0_10px_26px_rgba(239,68,68,0.32)] [&_.sosPulse]:bg-white",
  bottomNavIcon:
    "inline-flex h-5 w-5 shrink-0 items-center justify-center [&_svg]:h-[18px] [&_svg]:w-[18px]",
  bottomNavText:
    "max-w-[62px] truncate text-[10px] font-black leading-none",
});

export const topNavbarStyles = createStyles({
  navbar:
    "col-span-full sticky top-0 z-[100] flex min-h-[52px] items-center gap-4 border-b border-[var(--border)] bg-white/90 px-5 shadow-[0_8px_24px_rgba(16,32,51,0.05)] backdrop-blur max-[760px]:gap-2.5 max-[760px]:px-3 max-[560px]:h-auto max-[560px]:flex-wrap max-[560px]:py-2",
  logo:
    "font-display flex min-h-10 shrink-0 items-center gap-2 bg-transparent p-0 text-[17px] font-bold text-[var(--primary)]",
  logoImage: "block h-[38px] w-[46px] shrink-0 object-contain max-[760px]:h-[34px] max-[760px]:w-[41px]",
  badge: "rounded bg-sky-100 px-1.5 py-0.5 text-[10px] font-bold text-sky-700",
  search:
    "relative mx-auto flex h-8 min-w-0 max-w-[400px] flex-1 items-center gap-2 rounded-med border-2 border-[var(--primary-border)] bg-[var(--card)] px-3 shadow-[0_6px_18px_rgba(15,159,127,0.08)] transition focus-within:border-[var(--primary)] focus-within:shadow-[0_0_0_3px_rgba(15,159,127,0.12)] max-[760px]:max-w-none max-[560px]:order-3 max-[560px]:m-0 max-[560px]:h-[34px] max-[560px]:basis-full [&_input]:min-w-0 [&_input]:flex-1 [&_input]:border-0 [&_input]:bg-transparent [&_input]:text-[12px] [&_input]:text-[var(--text)] [&_input]:outline-none [&_input::placeholder]:text-[var(--muted)]",
  clearSearch:
    "flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-[var(--card2)] text-[14px] text-[var(--muted)]",
  searchMenu:
    "absolute left-0 right-0 top-[calc(100%+8px)] z-[220] rounded-med border border-[var(--border)] bg-[var(--card)] p-1.5 shadow-xl",
  searchItem:
    "flex w-full flex-col gap-0.5 rounded-med bg-transparent p-2.5 text-left hover:bg-[var(--card2)] [&_small]:text-[11px] [&_small]:text-[var(--muted)] [&_span]:text-[12px] [&_span]:font-black [&_span]:text-[var(--text)]",
  right: "ml-auto flex items-center gap-3",
  notificationWrap: "relative",
  accountWrap: "relative",
  notificationPanel:
    "absolute right-0 top-[calc(100%+10px)] z-[240] min-w-[280px] rounded-med border border-[var(--border)] bg-[var(--card)] p-3 text-[var(--text)] shadow-xl max-[560px]:right-[-44px] max-[560px]:w-[min(300px,calc(100vw-24px))]",
  notificationPanelHeader:
    "flex items-start justify-between gap-3 pb-2.5 [&_strong]:block [&_strong]:text-[13px] [&_strong]:font-black [&_span]:mt-0.5 [&_span]:block [&_span]:text-[11px] [&_span]:text-[var(--muted)]",
  notificationStatus:
    "shrink-0 rounded bg-[var(--card2)] px-2 py-1 text-[10px] font-black text-[var(--muted)]",
  notificationStatusActive: "bg-[var(--primary-dim)] text-[var(--primary)]",
  notificationList: "flex flex-col gap-1.5",
  notificationItem:
    "flex w-full flex-col gap-1 rounded-med bg-[var(--surface)] p-2.5 text-left hover:bg-[var(--card2)] [&_small]:line-clamp-2 [&_small]:text-[11px] [&_small]:text-[var(--muted)] [&_span]:text-[12px] [&_span]:font-black [&_span]:text-[var(--text)] [&_time]:mt-0.5 [&_time]:text-[10px] [&_time]:font-bold [&_time]:text-[var(--muted)]",
  notificationEmpty: "rounded-med bg-[var(--surface)] p-3 text-[12px] text-[var(--muted)]",
  notificationActions:
    "mt-2.5 flex justify-end gap-2 [&_button]:rounded [&_button]:bg-[var(--primary)] [&_button]:px-2.5 [&_button]:py-2 [&_button]:text-[11px] [&_button]:font-black [&_button]:text-white [&_button:last-child]:bg-[var(--card2)] [&_button:last-child]:text-[var(--text)]",
  userInfo:
    "flex min-h-[38px] items-center gap-2 rounded-med border border-transparent bg-transparent py-0.5 pl-0.5 pr-1.5 text-left text-[var(--text)] transition hover:border-[var(--border)] hover:bg-[var(--card)] max-[760px]:min-h-[34px] max-[760px]:p-0 max-[760px]:[&_svg:last-child]:hidden",
  userInfoActive: "border-[var(--border)] bg-[var(--card)]",
  avatar:
    "flex h-8 w-8 shrink-0 items-center justify-center overflow-hidden rounded-med border border-[var(--border)] bg-[var(--primary-dim)] text-[12px] font-bold text-[var(--primary)] [&_img]:h-full [&_img]:w-full [&_img]:object-cover",
  userName: "max-w-[120px] truncate text-[13px] font-medium text-[var(--text)] max-[760px]:hidden",
  accountMenu:
    "absolute right-0 top-[calc(100%+10px)] z-[245] min-w-[230px] rounded-med border border-[var(--border)] bg-[var(--card)] p-2 text-[var(--text)] shadow-xl max-[560px]:top-[calc(100%+8px)] max-[560px]:w-[min(260px,calc(100vw-24px))]",
  accountHeader:
    "mb-1.5 flex items-center gap-2.5 border-b border-[var(--border)] px-2 py-2.5 [&_span]:block [&_span]:max-w-[150px] [&_span]:truncate [&_span]:text-[11px] [&_span]:text-[var(--muted)] [&_strong]:block [&_strong]:max-w-[150px] [&_strong]:truncate [&_strong]:text-[13px] [&_strong]:font-black",
  accountAvatar:
    "flex h-9 w-9 shrink-0 items-center justify-center overflow-hidden rounded-med border border-[var(--border)] bg-[var(--primary-dim)] text-[12px] font-black text-[var(--primary)] [&_img]:h-full [&_img]:w-full [&_img]:object-cover",
  accountMenuItem:
    "flex w-full items-center gap-2.5 rounded-med bg-transparent p-2.5 text-left text-[12px] font-black text-[var(--text)] hover:bg-[var(--card2)] [&_svg]:shrink-0 [&_svg]:text-[var(--muted)]",
  accountMenuDanger:
    "!text-[var(--accent)] hover:!bg-[var(--card2)] [&_svg]:!text-[var(--accent)]",
  notificationCount:
    "absolute -right-1.5 -top-1.5 flex h-4 min-w-4 items-center justify-center rounded-full border-2 border-[var(--surface)] bg-[var(--accent)] px-1 text-[9px] font-bold leading-3 text-white",
});

export const uiStyles = createStyles({
  badge: "inline-flex items-center rounded-med px-2 py-1 text-[11px] font-black",
  badge_success: "bg-emerald-50 text-emerald-700",
  badge_warning: "bg-emerald-50 text-emerald-700",
  badge_danger: "bg-sky-50 text-sky-700",
  badge_default: "bg-[var(--surface)] text-[var(--muted)]",
  statusBadge: "inline-flex items-center gap-1.5 rounded-med px-2 py-1 text-[11px] font-black",
  online: "bg-emerald-50 text-emerald-700",
  offline: "bg-slate-100 text-slate-600",
  statusDot: "h-2 w-2 rounded-full bg-current",
  avatar:
    "flex shrink-0 items-center justify-center overflow-hidden rounded-med border border-[var(--border)] bg-[var(--primary-dim)] font-black text-[var(--primary)] [&_img]:h-full [&_img]:w-full [&_img]:object-cover",
  btn:
    "inline-flex min-h-[38px] items-center justify-center gap-2 rounded-med px-4 py-2 text-[12px] font-bold transition disabled:cursor-not-allowed disabled:opacity-60",
  btn_primary: "bg-[var(--primary)] text-white hover:opacity-90",
  btn_outline: "border border-[var(--border)] bg-[var(--card)] text-[var(--text)] hover:bg-[var(--card2)]",
  btn_ghost: "bg-transparent text-[var(--text)] hover:bg-[var(--card2)]",
  btn_danger: "border border-[var(--accent-border)] bg-[var(--accent-dim)] text-[var(--accent)] hover:bg-sky-50",
  fullWidth: "w-full",
  statCard: softCard,
  statLabel: "text-[12px] text-[var(--muted)]",
  statValue: "font-display text-[24px] font-bold text-[var(--text)]",
  statSub: "text-[11px] font-bold text-[var(--muted)]",
  statUp: "text-emerald-700",
  statDown: "text-rose-700",
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
  wrap: "fixed right-4 top-4 z-[400] flex w-[min(360px,calc(100vw-24px))] flex-col gap-2",
  toast:
    "relative flex min-w-0 gap-3 overflow-hidden rounded-med border border-[var(--border)] bg-[var(--card)] p-3 pr-10 text-left shadow-xl",
  icon: "mt-0.5 shrink-0",
  body: "min-w-0 flex-1",
  label: "text-[12px] font-black text-[var(--text)]",
  message: "mt-0.5 break-words text-[12px] text-[var(--muted)]",
  close: "absolute right-2 top-2 rounded p-1 text-[var(--muted)] hover:bg-[var(--card2)]",
  progress: "absolute bottom-0 left-0 h-1 w-full bg-current opacity-30",
  success: "border-emerald-200 text-emerald-700",
  error: "border-rose-200 text-rose-700",
  warning: "border-amber-200 text-amber-700",
  info: "border-sky-200 text-sky-700",
  loading: "border-[var(--border)] text-[var(--primary)]",
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
    "flex min-h-[42px] min-w-0 items-center gap-2 rounded-med border border-[var(--border)] bg-[var(--card)] px-3 py-2 focus-within:border-[var(--primary-border)] [&_span]:shrink-0 [&_span]:text-[10px] [&_span]:font-black [&_span]:uppercase [&_span]:tracking-[0.08em] [&_span]:text-[var(--muted)] [&_input]:min-w-0 [&_input]:flex-1 [&_input]:border-0 [&_input]:bg-transparent [&_input]:text-[13px] [&_input]:text-[var(--text)]",
  viewTabs:
    "flex min-w-0 max-w-full gap-2 overflow-x-auto rounded-med border border-[var(--border)] bg-[var(--surface)] p-1 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden",
  filters:
    "flex min-w-max gap-1 rounded-med bg-transparent p-0",
  filterBtn:
    "min-h-[36px] shrink-0 rounded-med px-3 py-2 text-[12px] font-bold capitalize text-[var(--muted)] hover:bg-[var(--card)] hover:text-[var(--text)]",
  filterActive:
    "bg-[var(--card)] text-[var(--primary)] shadow-sm",
  statsGrid: "grid min-w-0 grid-cols-1 gap-3 sm:grid-cols-2 xl:grid-cols-5",
  sectionCard:
    "min-w-0 rounded-med border border-[var(--border)] bg-[var(--card)] p-3 shadow-[0_10px_30px_rgba(17,24,39,0.04)]",
  workspaceGrid: "grid min-w-0 grid-cols-1 gap-3 sm:grid-cols-2 xl:grid-cols-4",
  workspaceCard:
    "flex min-w-0 flex-col gap-2 rounded-med border border-[var(--border)] bg-[var(--surface)] p-3 [&_h3]:m-0 [&_h3]:break-words [&_h3]:text-[15px] [&_h3]:font-bold [&_h3]:text-[var(--text)] [&_p]:m-0 [&_p]:break-words [&_p]:text-[12px] [&_p]:leading-relaxed [&_p]:text-[var(--muted)] [&_button]:mt-auto [&_button]:w-fit [&_button]:rounded-med [&_button]:border [&_button]:border-[var(--border)] [&_button]:bg-[var(--card)] [&_button]:px-3 [&_button]:py-2 [&_button]:text-[12px] [&_button]:font-bold [&_button]:text-[var(--text)] [&_button:hover]:border-[var(--primary-border)] [&_button:hover]:text-[var(--primary)]",
  workspaceMetric:
    "text-[10px] font-black uppercase tracking-[0.08em] text-[var(--primary)]",
  insightGrid: "grid min-w-0 grid-cols-1 gap-3 xl:grid-cols-2",
  insightCard:
    "min-w-0 rounded-med border border-[var(--border)] bg-[var(--card)] p-3 shadow-[0_10px_30px_rgba(17,24,39,0.04)]",
  insightHeader:
    "mb-3 flex min-w-0 items-start justify-between gap-3 [&_span]:text-[10px] [&_span]:font-black [&_span]:uppercase [&_span]:tracking-[0.08em] [&_span]:text-[var(--primary)] [&_h2]:m-0 [&_h2]:text-[16px] [&_h2]:font-bold [&_h2]:text-[var(--text)] [&_strong]:font-display [&_strong]:text-[24px] [&_strong]:font-bold [&_strong]:text-[var(--primary)] [&_button]:rounded-med [&_button]:border [&_button]:border-[var(--border)] [&_button]:bg-[var(--card)] [&_button]:px-3 [&_button]:py-2 [&_button]:text-[12px] [&_button]:font-bold [&_button]:text-[var(--text)]",
  insightActions: "flex shrink-0 flex-wrap items-center justify-end gap-2",
  queueItem:
    "flex min-w-0 items-center justify-between gap-3 rounded-med border border-[var(--border)] bg-[var(--surface)] p-3 max-[560px]:items-stretch max-[560px]:flex-col",
  queueActions:
    "flex shrink-0 flex-wrap items-center justify-end gap-2 [&_button]:rounded-med [&_button]:border [&_button]:border-[var(--border)] [&_button]:bg-[var(--card)] [&_button]:px-3 [&_button]:py-2 [&_button]:text-[12px] [&_button]:font-bold [&_button]:text-[var(--text)] [&_button:last-child]:border-[var(--primary)] [&_button:last-child]:bg-[var(--primary)] [&_button:last-child]:text-white",
  checkItem:
    "flex min-w-0 items-center gap-3 rounded-med border border-[var(--border)] bg-[var(--surface)] p-3 max-[560px]:flex-wrap [&_p]:m-0 [&_p]:min-w-0 [&_p]:flex-1 [&_p]:break-words [&_p]:text-[13px] [&_p]:font-bold [&_p]:text-[var(--text)] [&_strong]:shrink-0 [&_strong]:font-bold [&_strong]:text-[var(--text)] [&_button]:ml-auto [&_button]:rounded-med [&_button]:border [&_button]:border-[var(--border)] [&_button]:bg-[var(--card)] [&_button]:px-3 [&_button]:py-2 [&_button]:text-[12px] [&_button]:font-bold",
  pipelineRow:
    "grid min-w-0 grid-cols-[92px_minmax(0,1fr)_32px] items-center gap-2 text-[12px] max-[420px]:grid-cols-1 [&_span]:font-bold [&_span]:capitalize [&_span]:text-[var(--muted)] [&_strong]:font-bold [&_strong]:text-[var(--text)]",
  tableWrap:
    "min-w-0 overflow-x-auto rounded-med border border-[var(--border)] max-[720px]:overflow-visible",
  table:
    "w-full min-w-[760px] border-collapse text-left text-[12px] max-[720px]:min-w-0 max-[720px]:block [&_th]:border-b [&_th]:border-[var(--border)] [&_th]:bg-[var(--surface)] [&_th]:px-3 [&_th]:py-3 [&_th]:text-[10px] [&_th]:font-black [&_th]:uppercase [&_th]:tracking-[0.06em] [&_th]:text-[var(--muted)] [&_td]:border-b [&_td]:border-[var(--border)] [&_td]:px-3 [&_td]:py-3 max-[720px]:[&_thead]:hidden max-[720px]:[&_tbody]:block max-[720px]:[&_tr]:mb-3 max-[720px]:[&_tr]:block max-[720px]:[&_tr]:rounded-med max-[720px]:[&_tr]:border max-[720px]:[&_tr]:border-[var(--border)] max-[720px]:[&_tr]:bg-[var(--card)] max-[720px]:[&_td]:grid max-[720px]:[&_td]:grid-cols-[96px_minmax(0,1fr)] max-[720px]:[&_td]:gap-3 max-[720px]:[&_td]:border-b max-[720px]:[&_td]:px-3 max-[720px]:[&_td]:py-2.5 max-[720px]:[&_td:last-child]:border-b-0 max-[720px]:[&_td::before]:text-[10px] max-[720px]:[&_td::before]:font-black max-[720px]:[&_td::before]:uppercase max-[720px]:[&_td::before]:tracking-[0.06em] max-[720px]:[&_td::before]:text-[var(--muted)] max-[720px]:[&_td:nth-child(1)::before]:content-['Name'] max-[720px]:[&_td:nth-child(2)::before]:content-['Type'] max-[720px]:[&_td:nth-child(3)::before]:content-['Verification'] max-[720px]:[&_td:nth-child(4)::before]:content-['Status'] max-[720px]:[&_td:nth-child(5)::before]:content-['Actions']",
  userCell: "flex min-w-0 items-center gap-3",
  name: "break-words font-bold text-[var(--text)]",
  meta: "break-words text-[12px] text-[var(--muted)]",
  rowActions:
    "flex flex-wrap items-center gap-2 [&_button]:rounded-med [&_button]:border [&_button]:border-[var(--border)] [&_button]:bg-[var(--surface)] [&_button]:px-3 [&_button]:py-2 [&_button]:text-[12px] [&_button]:font-bold [&_button]:text-[var(--text)] [&_button:hover:not(:disabled)]:border-[var(--subtle)] [&_button:disabled]:cursor-not-allowed [&_button:disabled]:opacity-60",
  actionCard: "rounded-med border border-[var(--border)] bg-[var(--card)] p-4",
  heroText: "min-w-0",
  tableCard: "rounded-med border border-[var(--border)] bg-[var(--card)] p-0",
  orderGrid:
    "grid min-w-0 grid-cols-[minmax(0,1fr)] gap-3 lg:grid-cols-[repeat(auto-fit,minmax(280px,420px))] lg:justify-start",
  orderCard:
    "min-w-0 rounded-med border border-[var(--border)] bg-[var(--surface)] p-3",
  previousOrderCard:
    "border-[var(--primary-border)] bg-[var(--card)] opacity-90",
  orderTop:
    "flex min-w-0 items-start justify-between gap-3 [&_h3]:m-0 [&_h3]:break-words [&_h3]:text-[14px] [&_h3]:font-bold [&_h3]:text-[var(--text)] [&_p]:mt-1 [&_p]:break-words [&_p]:text-[12px] [&_p]:text-[var(--muted)]",
  price: "shrink-0 font-display text-[16px] font-bold text-[var(--primary)]",
  deliveryAddress:
    "mt-3 break-words rounded-med border border-[var(--border)] bg-[var(--card)] p-2.5 text-[12px] leading-relaxed text-[var(--muted)]",
  orderItems: "mt-3 flex min-w-0 flex-col gap-2",
  orderItem:
    "flex min-w-0 items-center justify-between gap-2 rounded-med border border-[var(--border)] bg-[var(--card)] p-2 text-[12px] max-[420px]:items-start max-[420px]:flex-col [&_span]:break-words [&_span]:font-bold [&_strong]:shrink-0 [&_strong]:rounded-med [&_strong]:px-2 [&_strong]:py-1 [&_strong]:text-[10px] [&_strong]:font-black",
  orderMetaGrid:
    "mt-3 grid min-w-0 grid-cols-1 gap-2 sm:grid-cols-2 [&_label]:flex [&_label]:min-w-0 [&_label]:flex-col [&_label]:gap-1.5 [&_label]:text-[11px] [&_label]:font-black [&_label]:text-[var(--muted)] [&_select]:min-h-[38px] [&_select]:min-w-0 [&_select]:rounded-med [&_select]:border [&_select]:border-[var(--border)] [&_select]:bg-[var(--card)] [&_select]:px-2.5 [&_select]:text-[13px] [&_select]:text-[var(--text)] [&_select:disabled]:cursor-not-allowed [&_select:disabled]:bg-[var(--surface)] [&_select:disabled]:text-[var(--muted)]",
  deliveryActions:
    "mt-3 grid grid-cols-3 gap-2 max-[420px]:grid-cols-1 [&_button]:min-h-[36px] [&_button]:rounded-med [&_button]:border [&_button]:border-[var(--border)] [&_button]:bg-[var(--card)] [&_button]:px-2 [&_button]:text-[12px] [&_button]:font-bold [&_button:last-child]:border-[var(--primary)] [&_button:last-child]:bg-[var(--primary)] [&_button:last-child]:text-white [&_button:disabled]:cursor-not-allowed [&_button:disabled]:opacity-55",
  medicineForm:
    "flex min-w-0 flex-col gap-3 rounded-med border border-[var(--border)] bg-[var(--surface)] p-3",
  formGrid:
    "grid min-w-0 grid-cols-1 gap-3 sm:grid-cols-2 xl:grid-cols-3 [&_label]:flex [&_label]:min-w-0 [&_label]:flex-col [&_label]:gap-1.5 [&_label]:text-[11px] [&_label]:font-black [&_label]:uppercase [&_label]:tracking-[0.04em] [&_label]:text-[var(--muted)] [&_input]:min-h-[38px] [&_input]:min-w-0 [&_input]:rounded-med [&_input]:border [&_input]:border-[var(--border)] [&_input]:bg-[var(--card)] [&_input]:px-2.5 [&_input]:text-[13px] [&_input]:text-[var(--text)]",
  formActions: "flex flex-wrap items-center justify-end gap-2",
  medicineGrid: "grid min-w-0 grid-cols-1 gap-3 lg:grid-cols-2 xl:grid-cols-3",
  medicineCard:
    "flex min-w-0 flex-col gap-3 rounded-med border border-[var(--border)] bg-[var(--surface)] p-3",
  medicineTop:
    "flex min-w-0 items-start justify-between gap-3 [&_h3]:m-0 [&_h3]:break-words [&_h3]:text-[15px] [&_h3]:font-bold [&_h3]:text-[var(--text)] [&_p]:mt-1 [&_p]:break-words [&_p]:text-[12px] [&_p]:text-[var(--muted)]",
  medicineStats:
    "grid min-w-0 grid-cols-3 gap-2 max-[420px]:grid-cols-1 [&_span]:min-w-0 [&_span]:rounded-med [&_span]:border [&_span]:border-[var(--border)] [&_span]:bg-[var(--card)] [&_span]:p-2 [&_span]:text-[11px] [&_span]:text-[var(--muted)] [&_strong]:mt-1 [&_strong]:block [&_strong]:break-words [&_strong]:text-[13px] [&_strong]:text-[var(--text)]",
  switchRow:
    "flex min-w-0 flex-wrap items-center gap-3 [&_label]:inline-flex [&_label]:min-w-0 [&_label]:items-center [&_label]:gap-2 [&_label]:text-[12px] [&_label]:font-bold [&_label]:text-[var(--text)] [&_input]:h-4 [&_input]:w-4 [&_input]:shrink-0 [&_input]:accent-[var(--primary)]",
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
    "min-w-0 rounded-med border border-[var(--border)] bg-[var(--surface)] p-3 [&_span]:block [&_span]:text-[10px] [&_span]:font-black [&_span]:uppercase [&_span]:tracking-[0.06em] [&_span]:text-[var(--muted)] [&_strong]:mt-1 [&_strong]:block [&_strong]:break-words [&_strong]:text-[13px] [&_strong]:font-bold [&_strong]:text-[var(--text)]",
  verifyBox:
    "flex min-w-0 items-center justify-between gap-3 rounded-med border border-[var(--primary-border)] bg-[var(--primary-dim)] p-3 max-[560px]:items-stretch max-[560px]:flex-col [&_strong]:block [&_strong]:text-[14px] [&_strong]:font-bold [&_strong]:text-[var(--text)] [&_span]:mt-1 [&_span]:block [&_span]:text-[12px] [&_span]:text-[var(--muted)]",
  closeBtn:
    "shrink-0 rounded-med border border-[var(--border)] bg-[var(--surface)] px-3 py-2 text-[12px] font-bold text-[var(--text)] hover:bg-[var(--card2)]",
});

export const dashboardStyles = createStyles({
  ...dashboardGeneratedStyles,
  greeting: greetingBlock,
});
export const doctorDashboardStyles = createStyles({
  ...doctorDashboardGeneratedStyles,
  header,
});
export const doctorListStyles = createStyles({
  ...doctorListGeneratedStyles,
  greeting: greetingBlock,
  filtersBar:
    "flex flex-wrap items-center gap-2 rounded-med border border-[var(--border)] bg-[var(--surface)] p-3",
  toggle:
    "inline-flex min-h-[36px] items-center gap-2 rounded-med border border-[var(--border)] bg-[var(--card)] px-3 py-2 text-[12px] font-black text-[var(--muted)] transition hover:border-[var(--primary-border)] hover:text-[var(--text)]",
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
    "group relative flex min-h-[226px] w-full max-w-[300px] min-w-0 flex-col gap-2.5 overflow-hidden rounded-med border border-[var(--border)] bg-[linear-gradient(180deg,rgba(255,255,255,0.98),rgba(248,251,255,0.94))] p-3.5 shadow-[0_8px_22px_rgba(16,32,51,0.045)] transition hover:-translate-y-0.5 hover:border-[var(--primary-border)] hover:shadow-[0_14px_32px_rgba(16,32,51,0.09)] max-[560px]:max-w-none",
  cardTop: "flex min-w-0 items-start justify-between gap-3",
  doctorIdentity: "flex min-w-0 items-center gap-2.5",
  photo:
    "flex h-11 w-11 shrink-0 items-center justify-center rounded-med border border-[var(--primary-border)] bg-[linear-gradient(135deg,rgba(15,159,127,0.16),rgba(37,99,235,0.12))] text-[14px] font-black text-[var(--primary)] shadow-sm",
  identityCopy: "min-w-0",
  name: "truncate text-[14px] font-black text-[var(--text)]",
  spec: "mt-0.5 truncate text-[11px] font-bold text-[var(--muted)]",
  statusWrap:
    "shrink-0 [&_span]:rounded-med [&_span]:px-2 [&_span]:py-1 [&_span]:text-[10px] [&_span]:font-black",
  doctorSummary:
    "mt-3 line-clamp-2 min-h-[38px] text-[12px] leading-relaxed text-[var(--muted)]",
  cardMetaRow:
    "mt-2 grid grid-cols-[minmax(0,1fr)_auto] items-center gap-2",
  rating:
    "inline-flex min-w-0 items-center gap-1.5 truncate rounded-med bg-sky-50 px-2.5 py-1.5 text-[11px] font-black text-sky-700 [&_span]:truncate [&_span]:font-bold [&_span]:text-[var(--muted)]",
  price:
    "whitespace-nowrap rounded-med border border-[var(--primary-border)] bg-[var(--primary-dim)] px-2.5 py-1.5 text-[11px] font-black text-[var(--primary)]",
  cardActions:
    "mt-auto grid grid-cols-2 gap-2 border-t border-[var(--border)] pt-2.5 max-[520px]:grid-cols-1",
  cardButton:
    "min-h-[38px] w-full rounded-med px-3 text-[12px] font-black shadow-none",
  consultButton:
    "!border !border-[var(--primary)] !bg-[var(--primary)] !text-white shadow-[0_10px_22px_rgba(15,159,127,0.18)] hover:!opacity-100 hover:shadow-[0_12px_26px_rgba(15,159,127,0.24)]",
  appointmentButton:
    "!border !border-[var(--primary-border)] !bg-[var(--card)] !text-[var(--primary)] hover:!bg-[var(--primary-dim)]",
  unavailableButton:
    "!border !border-[var(--border)] !bg-[var(--surface)] !text-[var(--muted)]",
});
export const doctorPatientsStyles = createStyles({
  ...doctorPatientsGeneratedStyles,
  header,
});
export const doctorPrescriptionsStyles = createStyles({
  ...doctorPrescriptionsGeneratedStyles,
  header,
});
export const consultationListStyles = createStyles({
  ...consultationListGeneratedStyles,
  header,
});
export const createPrescriptionStyles = createStyles({
  ...createPrescriptionGeneratedStyles,
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
    "grid min-w-0 grid-cols-[minmax(150px,1.45fr)_minmax(104px,0.9fr)_minmax(116px,1fr)_minmax(96px,0.8fr)_38px] items-end gap-2 rounded-med border border-[var(--border)] bg-[var(--card)] p-2.5 max-[1100px]:grid-cols-2 max-[560px]:grid-cols-1 [&_input]:min-h-[38px] [&_input]:min-w-0 [&_input]:rounded-med [&_input]:border [&_input]:border-[var(--border)] [&_input]:bg-[var(--surface)] [&_input]:px-2.5 [&_input]:py-2 [&_input]:text-[13px] [&_input]:text-[var(--text)] [&_select]:min-h-[38px] [&_select]:min-w-0 [&_select]:rounded-med [&_select]:border [&_select]:border-[var(--border)] [&_select]:bg-[var(--surface)] [&_select]:px-2.5 [&_select]:py-2 [&_select]:text-[13px] [&_select]:text-[var(--text)]",
  inputFull: "min-w-0 max-[1100px]:col-span-2 max-[560px]:col-span-1",
  inputSelect: "min-w-0",
  inputSmall: "min-w-0",
  removeBtn:
    "flex h-[38px] w-[38px] items-center justify-center rounded-med border border-[var(--accent-border)] bg-[var(--accent-dim)] text-[13px] font-bold text-[var(--accent)] hover:bg-sky-50 max-[1100px]:w-full",
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
    "flex min-w-0 flex-col gap-2 [&_h3]:m-0 [&_h3]:text-[11px] [&_h3]:font-black [&_h3]:uppercase [&_h3]:tracking-[0.04em] [&_h3]:text-[var(--muted)] [&_p]:m-0 [&_p]:text-[13px] [&_p]:text-[var(--text)]",
  reviewMedicine:
    "rounded-med border border-[var(--border)] bg-[var(--card)] p-3 [&_strong]:text-[13px] [&_strong]:font-bold [&_strong]:text-[var(--text)]",
  actions:
    "flex flex-wrap items-center justify-end gap-2 border-t border-[var(--border)] pt-3 max-[520px]:justify-end [&_button]:min-h-[38px] [&_button]:max-w-full",
});
export const appointmentsStyles = createStyles({
  ...appointmentsGeneratedStyles,
  header,
});
export const prescriptionStyles = createStyles({
  ...prescriptionGeneratedStyles,
  greeting: greetingBlock,
  card:
    "mx-auto w-full max-w-[920px] min-w-0 overflow-hidden rounded-med border border-[var(--border)] bg-[var(--card)] shadow-[0_12px_34px_rgba(16,32,51,0.08)]",
  rxHeader:
    "grid min-w-0 grid-cols-[minmax(0,1fr)_auto_auto] items-start gap-3 border-b border-[var(--border)] bg-[linear-gradient(135deg,rgba(15,159,127,0.12),rgba(37,99,235,0.10)),var(--card)] p-4 max-[760px]:grid-cols-1 max-[560px]:p-3",
  tableWrap:
    "min-w-0 overflow-x-auto p-4 max-[620px]:overflow-visible max-[560px]:p-3",
  table:
    "min-w-[720px] w-full border-collapse text-left text-[12px] [&_th]:bg-[var(--surface)] [&_th]:px-3 [&_th]:py-3 [&_th]:font-black [&_td]:border-t [&_td]:border-[var(--border)] [&_td]:px-3 [&_td]:py-3",
  actions:
    "!flex flex-wrap items-center justify-end gap-2 border-t border-[var(--border)] bg-[var(--surface)] p-3 max-[680px]:justify-stretch [&_button]:min-h-[38px] [&_button]:max-w-full max-[680px]:[&_button]:w-full",
});
export const prescriptionListStyles = createStyles({
  ...prescriptionListGeneratedStyles,
  header,
  prescriptionsList: "grid min-w-0 grid-cols-1 gap-3 xl:grid-cols-2",
  card:
    "min-w-0 overflow-hidden rounded-med border border-[var(--border)] bg-[var(--card)] shadow-[0_8px_24px_rgba(16,32,51,0.05)] transition hover:border-[var(--primary-border)]",
  cardHeader:
    "flex min-w-0 items-start justify-between gap-3 border-b border-[var(--border)] p-3 max-[640px]:flex-col",
  cardContent: "min-w-0 p-3",
  actions:
    "flex flex-wrap items-center justify-end gap-2 border-t border-[var(--border)] bg-[var(--surface)] p-3 max-[640px]:justify-stretch [&_button]:min-h-[38px] [&_button]:max-w-full max-[640px]:[&_button]:w-full",
});
export const healthRecordsStyles = createStyles({
  ...healthRecordsGeneratedStyles,
  greeting: greetingBlock,
  layout: "flex min-w-0 flex-col gap-4",
  mainContent: "min-w-0 space-y-4",
  healthSidebar:
    "min-w-0 rounded-med border border-[var(--border)] bg-[var(--card)] p-4",
  trendGrid: "grid min-w-0 grid-cols-1 gap-3 lg:grid-cols-2 xl:grid-cols-3",
  summaryGrid: "grid min-w-0 grid-cols-1 gap-3 sm:grid-cols-2 xl:grid-cols-3",
  chartCard: "min-w-0 rounded-med border border-[var(--border)] bg-[var(--card)] p-4",
  bars: "mt-3 flex h-36 min-w-0 items-end gap-2",
  barGroup: "flex min-w-0 flex-1 flex-col items-center gap-2",
  bar: "w-full min-w-[12px] rounded-t-med border border-transparent transition",
  barLabel: "text-[10px] font-bold text-[var(--muted)]",
});
export const ordersStyles = createStyles({
  ...ordersGeneratedStyles,
  hero: merge(topPanel, topCopy, "flex min-w-0 items-center justify-between gap-3 max-[900px]:items-stretch max-[900px]:flex-col"),
});
export const sosStyles = createStyles({
  ...sosGeneratedStyles,
  alert:
    "rounded-med bg-red-50 px-3 py-1 text-[11px] font-black uppercase tracking-[0.08em] text-red-700",
  ring:
    "mx-auto flex h-44 w-44 items-center justify-center rounded-full border border-red-200 bg-red-50 shadow-[0_0_0_10px_rgba(239,68,68,0.08),0_22px_50px_rgba(239,68,68,0.22)]",
  inner:
    "flex h-32 w-32 items-center justify-center rounded-full bg-[linear-gradient(135deg,#ef4444,#b91c1c)] text-xl font-black text-white shadow-[0_16px_34px_rgba(185,28,28,0.35)]",
  connecting: "text-center font-bold text-red-700",
  helplineNumber: "font-display text-[24px] font-bold text-red-700",
});
export const patientReportsStyles = createStyles({
  ...patientReportsGeneratedStyles,
  header,
});
export const patientVitalsStyles = createStyles({
  ...patientVitalsGeneratedStyles,
  header,
});
export const profileStyles = createStyles({
  ...profileGeneratedStyles,
  header,
  greeting: "min-w-0",
  logoutBtn: merge(logoutButton, "mt-2.5 w-full"),
});
export const loginStyles = createStyles(loginGeneratedStyles);
export const errorPageStyles = createStyles(errorPageGeneratedStyles);
