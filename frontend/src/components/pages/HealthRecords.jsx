import { useMemo, useState, useEffect } from "react";
import { Spinner } from "../ui/UI";
import {
  patients as patientsApi,
  prescriptionCache,
} from "../../services/api";
import { healthRecordsStyles as styles } from "../../styles/tailwindStyles";

const TABS = ["Reports", "Vitals", "Prescriptions"];

const formatDate = (value, options = {}) => {
  if (!value) return "No date";
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return "No date";
  return date.toLocaleDateString("en-IN", {
    day: "numeric",
    month: "short",
    year: "numeric",
    ...options,
  });
};

const formatShortDate = (value) => {
  if (!value) return "No date";
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return "No date";
  return date.toLocaleDateString("en-IN", {
    day: "numeric",
    month: "short",
  });
};

const getDoctorName = (record) =>
  record?.doctor?.userId?.name || record?.createdBy?.userId?.name || "Doctor";

const numberOrNull = (value) => {
  const number = Number(value);
  return Number.isFinite(number) ? number : null;
};

const formatVitalValue = (value, suffix = "") => {
  const number = numberOrNull(value);
  if (number === null) return "—";
  return `${Number.isInteger(number) ? number : number.toFixed(1)}${suffix}`;
};

const getStatusClassName = (status) =>
  ({
    active: styles.badgeActive,
    expired: styles.badgeExpired,
    revoked: styles.badgeCancelled,
    cancelled: styles.badgeCancelled,
    normal: styles.badgeNormal,
    low: styles.badgeLow,
    high: styles.badgeHigh,
    critical: styles.badgeHigh,
  })[status] || styles.badgeDefault;

const getVitalDetails = (vital) => {
  const rows = [];
  if (vital.bloodPressure?.systolic && vital.bloodPressure?.diastolic) {
    rows.push([
      "Blood Pressure",
      `${vital.bloodPressure.systolic}/${vital.bloodPressure.diastolic} mmHg`,
    ]);
  }
  if (vital.heartRate) rows.push(["Heart Rate", `${vital.heartRate} bpm`]);
  if (vital.temperature?.value) {
    rows.push([
      "Temperature",
      `${vital.temperature.value} ${vital.temperature.unit === "Fahrenheit" ? "°F" : "°C"}`,
    ]);
  }
  if (vital.weight) rows.push(["Weight", `${vital.weight} kg`]);
  if (vital.height) rows.push(["Height", `${vital.height} cm`]);
  if (vital.oxygenSaturation) {
    rows.push(["Oxygen Saturation", `${vital.oxygenSaturation}%`]);
  }
  if (vital.respiratoryRate) {
    rows.push(["Respiratory Rate", `${vital.respiratoryRate} breaths/min`]);
  }
  return rows;
};

const buildLatestSeries = (items, getter, suffix = "") =>
  [...items]
    .filter((item) => numberOrNull(getter(item)) !== null)
    .sort((a, b) => new Date(a.createdAt) - new Date(b.createdAt))
    .slice(-6)
    .map((item) => ({
      label: formatShortDate(item.createdAt),
      value: numberOrNull(getter(item)),
      display: formatVitalValue(getter(item), suffix),
    }));

const buildMonthBuckets = (items, dateGetter) => {
  const now = new Date();
  const buckets = Array.from({ length: 6 }, (_, index) => {
    const date = new Date(now.getFullYear(), now.getMonth() - (5 - index), 1);
    return {
      key: `${date.getFullYear()}-${date.getMonth()}`,
      label: date.toLocaleDateString("en-IN", { month: "short" }),
      value: 0,
      display: "0",
    };
  });

  items.forEach((item) => {
    const date = new Date(dateGetter(item));
    if (Number.isNaN(date.getTime())) return;
    const key = `${date.getFullYear()}-${date.getMonth()}`;
    const bucket = buckets.find((entry) => entry.key === key);
    if (bucket) {
      bucket.value += 1;
      bucket.display = String(bucket.value);
    }
  });

  return buckets;
};

export default function HealthRecords() {
  const [tab, setTab] = useState("Reports");
  const [rxList, setRxList] = useState([]);
  const [profile, setProfile] = useState(null);
  const [reports, setReports] = useState([]);
  const [vitals, setVitals] = useState([]);
  const [consultations, setConsultations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    (async () => {
      setLoading(true);
      setError("");
      try {
        const [rxRes, profRes, reportRes, vitalRes, consultationRes] =
          await Promise.all([
            patientsApi.getPrescriptions({ limit: 100 }),
            patientsApi.getProfile(),
            patientsApi.getReports({ limit: 100 }),
            patientsApi.getVitals({ limit: 100 }),
            patientsApi.getConsultations({ limit: 100 }),
          ]);

        const prescriptions = rxRes.data || [];
        setRxList(prescriptions);
        prescriptionCache.saveList(prescriptions);
        setProfile(profRes.data);
        setReports(reportRes.data || []);
        setVitals(vitalRes.data || []);
        setConsultations(consultationRes.data || []);
      } catch (err) {
        setError(err.message || "Unable to load health records");
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  const summary = useMemo(() => {
    const latestVital = vitals[0];
    const latestReport = reports[0];
    const activePrescriptions = rxList.filter((rx) => rx.status === "active").length;
    const criticalReports = reports.filter((report) => report.isCritical).length;

    return {
      reports: reports.length,
      vitals: vitals.length,
      activePrescriptions,
      criticalReports,
      latestVital: latestVital ? formatDate(latestVital.createdAt) : "None",
      latestReport: latestReport ? formatDate(latestReport.date || latestReport.createdAt) : "None",
    };
  }, [reports, rxList, vitals]);

  const chartData = useMemo(
    () => ({
      systolic: buildLatestSeries(
        vitals,
        (vital) => vital.bloodPressure?.systolic,
        " mmHg",
      ),
      heartRate: buildLatestSeries(vitals, (vital) => vital.heartRate, " bpm"),
      reportsByMonth: buildMonthBuckets(reports, (report) => report.date || report.createdAt),
      consultationsByMonth: buildMonthBuckets(
        consultations,
        (consultation) => consultation.createdAt,
      ),
    }),
    [consultations, reports, vitals],
  );

  return (
    <div className={styles.page}>
      <div className={styles.greeting}>
        <h1>Health Records</h1>
        <p>Your complete medical history in one place</p>
      </div>

      {loading ? (
        <div className={styles.loadingWrap}>
          <Spinner size={32} />
        </div>
      ) : error ? (
        <div className={styles.empty}>
          <strong>Unable to load records</strong>
          <span>{error}</span>
        </div>
      ) : (
        <>
          <SummaryGrid summary={summary} />

          <div className={styles.tabs}>
            {TABS.map((t) => (
              <button
                key={t}
                className={`${styles.tab} ${tab === t ? styles.activeTab : ""}`}
                onClick={() => setTab(t)}
                type="button"
              >
                {t}
              </button>
            ))}
          </div>

          <div className={styles.layout}>
            <div className={styles.mainContent}>
              {tab === "Reports" && <ReportsTab reports={reports} />}
              {tab === "Vitals" && <VitalsTab profile={profile} vitals={vitals} />}
              {tab === "Prescriptions" && <PrescriptionsTab rxList={rxList} />}
            </div>

            <TrendGraphs
              chartData={chartData}
              profile={profile}
              reports={reports}
              vitals={vitals}
            />
          </div>
        </>
      )}
    </div>
  );
}

function SummaryGrid({ summary }) {
  return (
    <div className={styles.summaryGrid}>
      <div className={styles.summaryCard}>
        <span>Reports</span>
        <strong>{summary.reports}</strong>
      </div>
      <div className={styles.summaryCard}>
        <span>Vitals Logged</span>
        <strong>{summary.vitals}</strong>
      </div>
      <div className={styles.summaryCard}>
        <span>Active Prescriptions</span>
        <strong>{summary.activePrescriptions}</strong>
      </div>
      <div className={styles.summaryCard}>
        <span>Critical Reports</span>
        <strong>{summary.criticalReports}</strong>
      </div>
      <div className={styles.summaryCard}>
        <span>Latest Vital</span>
        <strong>{summary.latestVital}</strong>
      </div>
      <div className={styles.summaryCard}>
        <span>Latest Report</span>
        <strong>{summary.latestReport}</strong>
      </div>
    </div>
  );
}

function PrescriptionsTab({ rxList }) {
  return (
    <div>
      <h2 className={styles.colTitle}>My Prescriptions</h2>
      <div className={styles.recordsList}>
        {rxList.length === 0 && (
          <p className={styles.emptyText}>No prescriptions found.</p>
        )}

        {rxList.map((rx) => (
          <div key={rx._id} className={styles.recordCard}>
            <div className={styles.recordHeader}>
              <div>
                <div className={styles.recordTitle}>{rx.diagnosis || "Prescription"}</div>
                <div className={styles.recordMeta}>
                  {formatDate(rx.createdAt)} • Prescribed by Dr.{" "}
                  {getDoctorName(rx).replace("Dr. ", "")}
                </div>
              </div>
              <div
                className={`${styles.badge} ${getStatusClassName(rx.status)}`}
              >
                {rx.status || "active"}
              </div>
            </div>

            <div className={styles.cardSection}>
              <div className={styles.sectionLabel}>Medicines</div>
              <div className={styles.stackList}>
                {(rx.medicines || []).map((m, i) => (
                  <div key={`${m.name}-${i}`} className={styles.itemRow}>
                    <div className={styles.itemPrimary}>{m.name}</div>
                    <div className={styles.itemSecondary}>
                      {[m.dosage, m.frequency, m.duration].filter(Boolean).join(" • ")}
                    </div>
                  </div>
                ))}
              </div>

              <div className={styles.inlineMetaRow}>
                <span className={styles.inlineMetaLabel}>Expires:</span>
                <span>{rx.expiresAt ? formatDate(rx.expiresAt) : "—"}</span>
              </div>
            </div>

            {rx.advice && (
              <div className={styles.instructionsBox}>
                <strong>Instructions:</strong> {rx.advice}
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}

function ReportsTab({ reports }) {
  return (
    <div>
      <h2 className={styles.colTitle}>Lab Reports & Test Results</h2>
      <div className={styles.recordsList}>
        {reports.length === 0 ? (
          <p className={styles.emptyText}>No reports found.</p>
        ) : (
          reports.map((report) => (
            <div key={report._id} className={styles.recordCard}>
              <div className={styles.recordHeader}>
                <div>
                  <div className={styles.recordTitle}>{report.title}</div>
                  <div className={styles.recordMeta}>
                    {formatDate(report.date || report.createdAt)} • {report.type} • Dr.{" "}
                    {getDoctorName(report).replace("Dr. ", "")}
                  </div>
                </div>
                <div
                  className={`${styles.badge} ${
                    report.isCritical
                      ? getStatusClassName("critical")
                      : getStatusClassName("normal")
                  }`}
                >
                  {report.isCritical ? "Critical" : "Normal"}
                </div>
              </div>

              {(report.description || report.results) && (
                <div className={styles.resultList}>
                  {report.description && (
                    <div className={styles.resultRow}>
                      <span className={styles.parameter}>Description</span>
                      <span className={styles.resultValue}>{report.description}</span>
                    </div>
                  )}
                  {report.results && (
                    <div className={styles.resultRow}>
                      <span className={styles.parameter}>Results</span>
                      <span className={styles.resultValue}>{report.results}</span>
                    </div>
                  )}
                </div>
              )}
            </div>
          ))
        )}
      </div>
    </div>
  );
}

function VitalsTab({ profile, vitals }) {
  return (
    <div>
      <h2 className={styles.colTitle}>Vital Signs History</h2>
      <div className={styles.timeline}>
        {vitals.length === 0 && profile && (
          <div className={styles.timelineItem}>
            <div className={styles.tlLine}>
              <div className={styles.tlDot} />
              <div className={styles.tlStem} />
            </div>
            <div className={styles.tlContent}>
              <div className={styles.tlDate}>Current</div>
              <div className={styles.tlTitle}>Health Profile</div>
              <div className={styles.tlDetail}>
                {profile.weight && <div>Weight: {profile.weight} kg</div>}
                {profile.height && <div>Height: {profile.height} cm</div>}
                {profile.bmi && <div>BMI: {profile.bmi}</div>}
                {profile.bloodGroup && <div>Blood Group: {profile.bloodGroup}</div>}
              </div>
            </div>
          </div>
        )}

        {vitals.length === 0 ? (
          <p className={`${styles.timelineNote} ${profile ? styles.timelineNoteIndented : ""}`}>
            No vitals have been logged yet.
          </p>
        ) : (
          vitals.map((vital) => {
            const details = getVitalDetails(vital);
            return (
              <div className={styles.timelineItem} key={vital._id}>
                <div className={styles.tlLine}>
                  <div className={styles.tlDot} />
                  <div className={styles.tlStem} />
                </div>
                <div className={styles.tlContent}>
                  <div className={styles.tlDate}>{formatDate(vital.createdAt)}</div>
                  <div className={styles.tlTitle}>Recorded by Dr. {getDoctorName(vital).replace("Dr. ", "")}</div>
                  <div className={styles.tlDetail}>
                    {details.map(([label, value]) => (
                      <div key={label}>
                        {label}: {value}
                      </div>
                    ))}
                    {vital.notes && <div>Notes: {vital.notes}</div>}
                  </div>
                </div>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
}

function TrendGraphs({ chartData, profile, reports, vitals }) {
  const latestVital = vitals[0];
  const latestRows = [
    [
      "Blood Group",
      profile?.bloodGroup || "—",
      "normal",
    ],
    [
      "Weight",
      latestVital?.weight
        ? `${Math.round(latestVital.weight)} kg`
        : profile?.weight
          ? `${Math.round(profile.weight)} kg`
          : "—",
      "normal",
    ],
    [
      "Blood Pressure",
      latestVital?.bloodPressure?.systolic && latestVital?.bloodPressure?.diastolic
        ? `${latestVital.bloodPressure.systolic}/${latestVital.bloodPressure.diastolic}`
        : "—",
      "normal",
    ],
    [
      "Allergies",
      profile?.allergies?.length > 0 ? profile.allergies.join(", ") : "None",
      profile?.allergies?.length > 0 ? "warn" : "normal",
    ],
  ];

  return (
    <div className={styles.healthSidebar}>
      <div className={styles.sidebarHeader}>
        <h3>Health Trends</h3>
      </div>

      <div className={styles.trendGrid}>
        <BarChart
          title="Blood Pressure"
          data={chartData.systolic}
          colorClass={styles.barPrimary}
          emptyText="No blood pressure records yet."
        />
        <BarChart
          title="Heart Rate"
          data={chartData.heartRate}
          colorClass={styles.barBlue}
          emptyText="No heart rate records yet."
        />
        <BarChart
          title="Reports Added"
          data={chartData.reportsByMonth}
          colorClass={styles.barPrimary}
          emptyText="No report activity yet."
        />
        <BarChart
          title="Consultations"
          data={chartData.consultationsByMonth}
          colorClass={styles.barBlue}
          emptyText="No consultation activity yet."
        />

        <div className={styles.summaryCard}>
          <div className={styles.summaryTitle}>Current Status</div>
          {latestRows.map(([k, v, c]) => (
            <div key={k} className={styles.summaryRow}>
              <span>{k}</span>
              <span className={c === "warn" ? styles.warn : styles.normal}>
                {v}
              </span>
            </div>
          ))}
        </div>

        <div className={styles.summaryCard}>
          <div className={styles.summaryTitle}>Report Mix</div>
          {reports.length === 0 ? (
            <div className={styles.emptyText}>No reports added yet.</div>
          ) : (
            Object.entries(
              reports.reduce((counts, report) => {
                const type = report.type || "Other";
                counts[type] = (counts[type] || 0) + 1;
                return counts;
              }, {}),
            ).map(([type, count]) => (
              <div key={type} className={styles.summaryRow}>
                <span>{type}</span>
                <span className={styles.normal}>{count}</span>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}

function BarChart({ title, data, colorClass, emptyText }) {
  const max = Math.max(...data.map((entry) => entry.value), 0);
  const hasData = data.some((entry) => entry.value > 0);

  return (
    <div className={styles.chartCard}>
      <div className={styles.chartTitle}>{title}</div>
      {hasData ? (
        <>
          <div className={styles.bars}>
            {data.map((entry) => {
              const height = max > 0 ? Math.max((entry.value / max) * 100, 8) : 0;
              return (
                <div key={`${entry.label}-${entry.value}`} className={styles.barGroup}>
                  <div
                    className={`${styles.bar} ${colorClass}`}
                    style={{ height: `${height}%` }}
                    title={entry.display}
                  />
                  <span className={styles.barLabel}>{entry.label}</span>
                </div>
              );
            })}
          </div>
          <div className={styles.chartSub}>
            Latest: {data[data.length - 1]?.display || "—"}
          </div>
        </>
      ) : (
        <div className={styles.emptyText}>{emptyText}</div>
      )}
    </div>
  );
}
