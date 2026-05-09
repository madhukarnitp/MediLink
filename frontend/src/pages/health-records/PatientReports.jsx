import { useEffect, useState } from "react";
import { useApp, PAGES } from "../../context/AppContext";
import { Button, ErrorMsg, PageSkeleton, Modal } from "../../components/ui/UI";
import { reports as reportsApi } from "../../services/api";
import { patientReportsStyles as styles } from "../../styles/tailwindStyles";

const REPORT_TYPES = [
  "Blood Test",
  "X-Ray",
  "MRI",
  "CT Scan",
  "Ultrasound",
  "ECG",
  "Other",
];

const EMPTY_REPORT_FORM = {
  type: "Blood Test",
  title: "",
  description: "",
  results: "",
  date: "",
  isCritical: false,
};

const formatDate = (value) => {
  if (!value) return "No date";
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return "No date";
  return date.toLocaleDateString("en-IN", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });
};

export default function PatientReports() {
  const { navigate, pageParams } = useApp();
  const patientId = pageParams.patientId;
  const [reports, setReports] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [showAddModal, setShowAddModal] = useState(false);
  const [editingReportId, setEditingReportId] = useState("");
  const [saving, setSaving] = useState(false);
  const [formData, setFormData] = useState(EMPTY_REPORT_FORM);

  const loadReports = async () => {
    setLoading(true);
    setError("");
    try {
      const response = await reportsApi.getForPatient(patientId);
      setReports(response.data || []);
    } catch (err) {
      setError(err.message || "Unable to load reports");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (patientId) {
      loadReports();
    } else {
      setLoading(false);
      setError("Patient ID is required");
    }
  }, [patientId]);

  const openAddModal = () => {
    setEditingReportId("");
    setFormData(EMPTY_REPORT_FORM);
    setShowAddModal(true);
  };

  const openEditModal = (report) => {
    setEditingReportId(report._id);
    setFormData({
      type: report.type || "Blood Test",
      title: report.title || "",
      description: report.description || "",
      results: report.results || "",
      date: report.date ? new Date(report.date).toISOString().slice(0, 10) : "",
      isCritical: Boolean(report.isCritical),
    });
    setShowAddModal(true);
  };

  const closeModal = () => {
    setShowAddModal(false);
    setEditingReportId("");
    setFormData(EMPTY_REPORT_FORM);
  };

  const handleSaveReport = async () => {
    setSaving(true);
    try {
      const reportData = {
        ...formData,
        date: formData.date || new Date().toISOString(),
      };

      if (editingReportId) {
        await reportsApi.update(editingReportId, reportData);
      } else {
        await reportsApi.addForPatient(patientId, reportData);
      }
      closeModal();
      loadReports();
    } catch (err) {
      setError(err.message || "Unable to save report");
    } finally {
      setSaving(false);
    }
  };

  const handleDeleteReport = async (reportId) => {
    if (!window.confirm("Delete this report?")) return;
    try {
      await reportsApi.delete(reportId);
      loadReports();
    } catch (err) {
      setError(err.message || "Unable to delete report");
    }
  };

  if (loading) {
    return (
      <div className={styles.page}>
        <PageSkeleton />
      </div>
    );
  }

  if (error) {
    return (
      <div className={styles.page}>
        <ErrorMsg message={error} onRetry={loadReports} />
      </div>
    );
  }

  return (
    <div className={styles.page}>
      <div className={styles.header}>
        <div>
          <h1 className={styles.headerTitle}>Patient Reports</h1>
          <p className={styles.headerSubtitle}>
            Manage medical reports, test results, and diagnostic documents.
          </p>
        </div>
        <div className={styles.headerActions}>
          <Button
            variant="outline"
            onClick={() =>
              navigate(PAGES.DOCTOR_PATIENTS, {}, { updateUrl: true, replace: true })
            }
          >
            Back
          </Button>
          <Button variant="primary" onClick={openAddModal}>
            Add Report
          </Button>
        </div>
      </div>

      <div className={styles.list}>
        {reports.length === 0 ? (
          <div className={styles.empty}>
            <strong>No reports found</strong>
            <span>Add medical reports and test results for this patient.</span>
          </div>
        ) : (
          reports.map((report) => (
            <div className={styles.reportCard} key={report._id}>
              <div className={styles.reportHeader}>
                <div className={styles.reportMeta}>
                  <h3>{report.title}</h3>
                  <span className={styles.reportType}>{report.type}</span>
                  {report.isCritical && <span className={styles.critical}>Critical</span>}
                </div>
                <div className={styles.reportDate}>
                  {formatDate(report.date)}
                </div>
              </div>
              <div className={styles.cardActions}>
                <Button variant="outline" onClick={() => openEditModal(report)}>
                  Edit
                </Button>
                <Button variant="danger" onClick={() => handleDeleteReport(report._id)}>
                  Delete
                </Button>
              </div>
              {report.description && (
                <div className={styles.description}>
                  <strong>Description:</strong> {report.description}
                </div>
              )}
              {report.results && (
                <div className={styles.results}>
                  <strong>Results:</strong>
                  <div className={styles.resultsContent}>{report.results}</div>
                </div>
              )}
              <div className={styles.reportFooter}>
                <span>Added on {formatDate(report.createdAt)}</span>
              </div>
            </div>
          ))
        )}
      </div>

      {showAddModal && (
        <Modal onClose={closeModal}>
          <div className={styles.modalContent}>
            <h2>{editingReportId ? "Update Medical Report" : "Add Medical Report"}</h2>
            <div className={styles.form}>
              <div className={styles.formRow}>
                <label>
                  Report Type
                  <select
                    value={formData.type}
                    onChange={(e) => setFormData({ ...formData, type: e.target.value })}
                  >
                    {REPORT_TYPES.map((type) => (
                      <option key={type} value={type}>
                        {type}
                      </option>
                    ))}
                  </select>
                </label>
              </div>
              <div className={styles.formRow}>
                <label>
                  Title
                  <input
                    type="text"
                    value={formData.title}
                    onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                    placeholder="Report title"
                    required
                  />
                </label>
              </div>
              <div className={styles.formRow}>
                <label>
                  Date
                  <input
                    type="date"
                    value={formData.date}
                    onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                  />
                </label>
              </div>
              <div className={styles.formRow}>
                <label>
                  Description
                  <textarea
                    value={formData.description}
                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                    placeholder="Brief description of the report"
                    rows={2}
                  />
                </label>
              </div>
              <div className={styles.formRow}>
                <label>
                  Results
                  <textarea
                    value={formData.results}
                    onChange={(e) => setFormData({ ...formData, results: e.target.value })}
                    placeholder="Detailed test results or findings"
                    rows={4}
                  />
                </label>
              </div>
              <div className={styles.formRow}>
                <label className={styles.checkboxLabel}>
                  <input
                    type="checkbox"
                    checked={formData.isCritical}
                    onChange={(e) => setFormData({ ...formData, isCritical: e.target.checked })}
                  />
                  Mark as critical
                </label>
              </div>
              <div className={styles.modalActions}>
                <Button disabled={saving} variant="outline" onClick={closeModal}>
                  Cancel
                </Button>
                <Button disabled={saving} variant="primary" onClick={handleSaveReport}>
                  {saving ? "Saving..." : editingReportId ? "Update Report" : "Add Report"}
                </Button>
              </div>
            </div>
          </div>
        </Modal>
      )}
    </div>
  );
}
