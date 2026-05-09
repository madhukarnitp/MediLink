import { useEffect, useMemo, useState } from "react";
import { useLocation } from "react-router-dom";
import { getHomePage, useApp, PAGES } from "../../context/AppContext";
import { Button, PageSkeleton, ErrorMsg } from "../../components/ui/UI";
import {
  prescriptions as rxApi,
  patients as patientsApi,
  prescriptionCache,
  prescriptionSelection,
} from "../../services/api";
import {
  formatPrescriptionDate,
  generatePrescriptionPdf,
} from "../../services/prescriptionPdf";
import medilinkLogo from "../../assets/logo.png";
import { prescriptionStyles as styles } from "../../styles/tailwindStyles";

const getPrescriptionIdFromLocation = (location) => {
  try {
    const parts = getRouteParts(location);

    if (
      parts[0] === "verify" &&
      (parts[1] === "prescription" || parts[1] === "rx") &&
      parts[2]
    ) {
      return decodeURIComponent(parts[2]);
    }

    if (parts[0] === "verify" && parts[1]) {
      return decodeURIComponent(parts[1]);
    }

    if (parts[0] === "prescription" && parts[1]) {
      return decodeURIComponent(parts[1]);
    }

    const lastPart = parts.at(-1) || "";
    return /^[a-f0-9]{24}$/i.test(lastPart)
      ? decodeURIComponent(lastPart)
      : "";
  } catch {
    return "";
  }
};

const getRouteParts = (location) => {
  const hash =
    location?.hash ??
    (typeof window !== "undefined" ? window.location.hash : "");
  const pathname =
    location?.pathname ??
    (typeof window !== "undefined" ? window.location.pathname : "");
  const rawHash = hash.replace(/^#\/?/, "");
  const source = rawHash || pathname.replace(/^\/+/, "");
  const [route] = source.split(/[?#]/);
  return route.split("/").filter(Boolean);
};

const isPublicPrescriptionRoute = (location) => {
  const parts = getRouteParts(location);
  return parts[0] === "prescription" && Boolean(parts[1]);
};

const getVerificationTokenFromLocation = (location) => {
  const hash = location?.hash ?? (typeof window !== "undefined" ? window.location.hash : "");
  const search =
    location?.search ?? (typeof window !== "undefined" ? window.location.search : "");
  const hashQuery = hash.includes("?") ? hash.split("?")[1].split("#")[0] : "";
  return new URLSearchParams(hashQuery || search).get("token") || "";
};

const hasItems = (items) => Array.isArray(items) && items.length > 0;

const getPublicPrescriptionUrl = (id, token = "") => {
  const query = token ? `?token=${encodeURIComponent(token)}` : "";
  return `${window.location.origin}/#/verify/prescription/${id}${query}`;
};

const createQrCodeDataUrl = async (id, token = "", width = 120) => {
  const QRCode = (await import("qrcode")).default;
  return QRCode.toDataURL(getPublicPrescriptionUrl(id, token), {
    width,
    margin: 1,
    color: {
      dark: "#000000",
      light: "#FFFFFF",
    },
  });
};

const statusDisplay = (s) =>
  ({
    active: {
      text: "Active",
      badgeClassName: styles.statusActive,
      valueClassName: styles.valueActive,
    },
    expired: {
      text: "Expired",
      badgeClassName: styles.statusExpired,
      valueClassName: styles.valueExpired,
    },
    cancelled: {
      text: "Cancelled",
      badgeClassName: styles.statusCancelled,
      valueClassName: styles.valueCancelled,
    },
  })[s] || {
    text: "Active",
    badgeClassName: styles.statusActive,
    valueClassName: styles.valueActive,
  };

export default function Prescription() {
  const location = useLocation();
  const {
    navigate,
    activePage,
    pageParams,
    selectedPrescriptionId,
    setSelectedPrescriptionId,
    showToast,
    user,
  } = useApp();
  const routePrescriptionId = useMemo(
    () => getPrescriptionIdFromLocation(location),
    [location],
  );
  const routeVerificationToken = useMemo(
    () => getVerificationTokenFromLocation(location),
    [location],
  );
  const prescriptionId =
    [
      routePrescriptionId,
      pageParams?.prescriptionId,
      selectedPrescriptionId,
      prescriptionSelection.get(),
    ]
      .map((id) => String(id || "").trim())
      .find(Boolean) || "";
  const verificationToken =
    pageParams?.verificationToken || routeVerificationToken || "";
  const routePrescription = pageParams?.prescription || null;
  const [rx, setRx] = useState(
    () => routePrescription || prescriptionCache.getById(prescriptionId),
  );
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [qrCodeUrl, setQrCodeUrl] = useState("");
  const isVerificationView =
    activePage === PAGES.PRESCRIPTION_VERIFY ||
    pageParams?.publicVerification === true;
  const routePublicDetailView = isPublicPrescriptionRoute(location);
  const isPublicDetailView =
    routePublicDetailView ||
    pageParams?.publicDetail === true ||
    (!user && !isVerificationView);

  const goBackToPrescriptions = () => {
    if (!user) {
      window.location.href = "/login";
      return;
    }
    if (isVerificationView && user) {
      navigate(
        getHomePage(user.role),
        {},
        { updateUrl: true, replace: true },
      );
      return;
    }
    prescriptionSelection.clear();
    navigate(
      user.role === "doctor"
        ? PAGES.DOCTOR_PRESCRIPTIONS
        : PAGES.PRESCRIPTION_LIST,
    );
  };

  useEffect(() => {
    if (prescriptionId && prescriptionId !== selectedPrescriptionId) {
      setSelectedPrescriptionId(prescriptionId);
    }
    if (prescriptionId) {
      prescriptionSelection.set(prescriptionId);
    }
  }, [prescriptionId, selectedPrescriptionId, setSelectedPrescriptionId]);

  useEffect(() => {
    if (!prescriptionId) {
      setRx(null);
      setLoading(false);
      return;
    }

    const cachedPrescription =
      routePrescription || prescriptionCache.getById(prescriptionId);
    const canUseCachedPrescription =
      cachedPrescription && !isVerificationView && !isPublicDetailView;
    setRx(cachedPrescription);
    setLoading(!cachedPrescription);
    let ignore = false;
    setError("");
    setQrCodeUrl("");

    if (canUseCachedPrescription) {
      (async () => {
        try {
          const qrUrl = await createQrCodeDataUrl(
            cachedPrescription._id,
            cachedPrescription.publicVerification?.token,
          );
          if (!ignore) setQrCodeUrl(qrUrl);
        } catch {}
      })();
      return () => {
        ignore = true;
      };
    }

    (async () => {
      try {
        const r = isVerificationView
          ? await rxApi.verify(prescriptionId, verificationToken)
          : await rxApi.getPublicById(prescriptionId);
        if (ignore) return;
        setRx(r.data);
        if (!isVerificationView && !isPublicDetailView && user) {
          prescriptionCache.saveItem(r.data);
        }

        const qrUrl = await createQrCodeDataUrl(
          r.data._id,
          r.data.publicVerification?.token,
        );
        if (!ignore) setQrCodeUrl(qrUrl);

        if (!isVerificationView && !isPublicDetailView && user?.role) {
          try {
            const privateResponse =
              user.role === "doctor"
                ? await rxApi.getById(prescriptionId)
                : user.role === "patient"
                  ? await patientsApi.getPrescriptionById(prescriptionId)
                  : null;
            if (!ignore && privateResponse?.data) {
              setRx(privateResponse.data);
              prescriptionCache.saveItem(privateResponse.data);
            }
          } catch {}
        }
      } catch (e) {
        if (!ignore) {
          setError(e.message);
          setRx((current) => current || cachedPrescription || null);
        }
      } finally {
        if (!ignore) setLoading(false);
      }
    })();

    return () => {
      ignore = true;
    };
  }, [
    isVerificationView,
    isPublicDetailView,
    prescriptionId,
    routePrescription,
    user?.role,
    verificationToken,
  ]);

  useEffect(() => {
    if (!user || prescriptionId || loading) return;
    goBackToPrescriptions();
  }, [loading, prescriptionId, user]);

  if (loading)
    return (
      <div className={styles.page}>
        <PageSkeleton />
      </div>
    );
  if (error && !rx && (isVerificationView || isPublicDetailView))
    return (
      <PublicVerificationState
        message={error}
        onHome={() => {
          window.location.href = "/login";
        }}
      />
    );
  if (error && !rx)
    return (
      <div className={styles.page}>
        <ErrorMsg message={error} onRetry={goBackToPrescriptions} />
      </div>
    );
  if (!rx) {
    if (isVerificationView || isPublicDetailView) {
      return (
        <PublicVerificationState
          message="Prescription not found"
          onHome={() => {
            window.location.href = "/login";
          }}
        />
      );
    }
    return (
      <div className={styles.page}>
        <div className={styles.empty}>
          Prescription not found.
          <br />
          <button
            className={styles.emptyBackButton}
            onClick={goBackToPrescriptions}
          >
            ← Go back
          </button>
        </div>
      </div>
    );
  }

  const sd = statusDisplay(rx.status);
  const verification = rx.verification;
  const isVerified = Boolean(verification?.verified);
  const docName =
    rx.createdBy?.userId?.name ||
    rx.doctor?.userId?.name ||
    rx.doctor?.name ||
    "Doctor";
  const patName =
    rx.createdFor?.userId?.name ||
    rx.patient?.userId?.name ||
    rx.patient?.name ||
    (user?.role === "patient" ? user?.name : "Patient");
  const verificationUrl = getPublicPrescriptionUrl(
    rx._id,
    rx.publicVerification?.token,
  );

  const handleCopyVerificationLink = async () => {
    try {
      await navigator.clipboard.writeText(verificationUrl);
      showToast("Verification link copied");
    } catch {
      showToast("Could not copy link automatically", "warning");
    }
  };

  const issuedLabel = formatPrescriptionDate(rx.createdAt);
  const expiryLabel = formatPrescriptionDate(rx.expiresAt, "Not set");

  const handleDownloadPDF = async () => {
    try {
      await generatePrescriptionPdf({
        rx,
        docName,
        patName,
        statusText: sd.text,
        verificationUrl,
        qrCodeUrl,
        logoUrl: medilinkLogo,
        userRole: user?.role,
      });
    } catch (e) {
      showToast(e.message || "Could not generate the PDF", "error");
    }
  };

  return (
    <div
      className={
        isVerificationView || isPublicDetailView
          ? `${styles.page} ${styles.publicSuccessPage}`
          : `${styles.page} ${styles.detailPage}`
      }
    >
      {(isVerificationView || isPublicDetailView) && (
        <section
          className={`${styles.publicHero} ${
            isVerified ? styles.publicHeroValid : styles.publicHeroInvalid
          }`}
        >
          <div className={styles.publicHeroMark}>
            {isVerified ? "OK" : "!"}
          </div>
          <div className={styles.publicHeroContent}>
            <span className={styles.verifyEyebrow}>
              Prescription verification
            </span>
            <h1>
              {isVerified
                ? "Verified MediLink prescription"
                : "Prescription record found"}
            </h1>
            <p>
              {verification?.reason ||
                "MediLink checked this prescription against the issuing doctor and prescription status."}
            </p>
          </div>
          <div className={styles.publicHeroMeta}>
            <span>Checked</span>
            <strong>
              {verification?.checkedAt
                ? new Date(verification.checkedAt).toLocaleString("en-IN", {
                    day: "numeric",
                    month: "short",
                    hour: "2-digit",
                    minute: "2-digit",
                  })
                : "Just now"}
            </strong>
          </div>
        </section>
      )}
      <div className={styles.greeting}>
        <div className={styles.backBtn}>
          <button
            onClick={goBackToPrescriptions}
          >
            {isVerificationView || isPublicDetailView ? "Go to MediLink" : "← Back"}
          </button>
        </div>
        <div>
          <h1>{isVerificationView ? "Prescription Verification" : "Prescription"}</h1>
          <p>
            Issued by {docName} · Issued {issuedLabel} · Expires {expiryLabel}
          </p>
          <div className={styles.headerChips}>
            <span className={styles.headerChip}>{rx.rxId || "MediLink Rx"}</span>
            <span className={styles.headerChip}>{sd.text}</span>
            <span className={styles.headerChip}>Expires {expiryLabel}</span>
            <span className={styles.headerChip}>QR verification ready</span>
          </div>
        </div>
      </div>
      <div className={styles.card} id="prescription-card">
        <div className={styles.rxHeader}>
          <div>
            <div className={styles.rxBrand}>
              <img
                className={styles.rxLogoImage}
                src={medilinkLogo}
                alt="MediLink Logo"
              />
              <div>
                <div className={styles.rxLogo}>
                  <span className={styles.brandWord}>
                    <span className={styles.brandMedi}>Medi</span>
                    <span className={styles.brandLink}>Link</span>
                  </span>
                </div>
                <div className={styles.rxBrandSub}>Digital prescription</div>
              </div>
            </div>
            <div className={styles.rxId}>{rx.rxId}</div>
          </div>
          <div className={styles.rxDate}>
            <div className={styles.rxDateGroup}>
              <div className={styles.rxDateLabel}>Issued</div>
              <div className={styles.rxDateVal}>{issuedLabel}</div>
            </div>
            <div className={styles.rxDateGroup}>
              <div className={styles.rxDateLabel}>Expires</div>
              <div className={styles.rxDateVal}>{expiryLabel}</div>
            </div>
          </div>
          <div className={styles.qrSection}>
            <div className={styles.qrCode}>
              {qrCodeUrl && <img src={qrCodeUrl} alt="Prescription QR Code" />}
            </div>
            <div className={styles.qrLabel}>Scan to verify</div>
            <div className={styles.qrId}>ID: {rx.rxId || rx._id}</div>
          </div>
          <div className={`${styles.statusBadge} ${sd.badgeClassName}`}>
            {sd.text}
          </div>
        </div>
        {verification && (
          <div className={isVerified ? styles.successBanner : styles.warningBanner}>
            {isVerified ? "Verified" : "Verification notice"}:{" "}
            {verification.reason || "Prescription record was checked."}
          </div>
        )}
        {rx.status === "expired" && (
          <div className={styles.warningBanner}>
            ⚠️ This prescription has expired. Please consult your doctor for a
            new one.
          </div>
        )}
        <div className={styles.parties}>
          <div className={styles.party}>
            <div className={styles.partyLabel}>Prescribed by</div>
            <div className={styles.partyName}>{docName}</div>
            <div className={styles.partyDetail}>
              {rx.createdBy?.qualification || ""}
              <br />
              Reg. No: {rx.createdBy?.regNo || "—"}
              <br />
              <span className={styles.verified}>✓ Verified</span>
            </div>
          </div>
          <div className={styles.party}>
            <div className={styles.partyLabel}>Patient</div>
            <div className={styles.partyName}>{patName}</div>
            <div className={styles.partyDetail}>
              {rx.createdFor?.age ? `Age: ${rx.createdFor.age}` : ""}
            </div>
          </div>
        </div>
        <div className={styles.validityBox}>
          <div className={styles.validityItem}>
            <span className={styles.label}>Issued</span>
            <span className={styles.value}>
              {issuedLabel}
            </span>
          </div>
          <div className={styles.validityItem}>
            <span className={styles.label}>Expires</span>
            <span className={`${styles.value} ${styles.expiryValue}`}>
              {expiryLabel}
            </span>
          </div>
          <div className={styles.validityItem}>
            <span className={styles.label}>Status</span>
            <span className={`${styles.value} ${sd.valueClassName}`}>
              {sd.text}
            </span>
          </div>
        </div>
        <div className={styles.tableWrap}>
          <div className={styles.diagnosis}>Diagnosis: {rx.diagnosis}</div>
          {hasItems(rx.symptoms) && (
            <DetailList title="Symptoms" items={rx.symptoms} />
          )}
          <table className={styles.table}>
            <thead>
              <tr>
                <th>Medicine</th>
                <th>Dosage</th>
                <th>Frequency</th>
                <th>Duration</th>
                <th>Instructions</th>
              </tr>
            </thead>
            <tbody>
              {(rx.medicines || []).map((m, i) => (
                <tr key={i}>
                  <td className="break-words">{m.name}</td>
                  <td className="break-words">{m.dosage}</td>
                  <td className="break-words">{m.frequency}</td>
                  <td className="break-words">{m.duration}</td>
                  <td className="break-words whitespace-pre-wrap">
                    {m.instructions || "—"}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          {hasItems(rx.labTests) && (
            <DetailList title="Recommended Lab Tests" items={rx.labTests} />
          )}
          {rx.advice && (
            <div className={styles.instructions}>
              <div className={styles.instructionsLabel}>Instructions</div>
              <div className={`${styles.instructionsText} break-words whitespace-pre-wrap`}>
                {rx.advice}
              </div>
            </div>
          )}
          {rx.followUpDate && (
            <div className={styles.followUp}>
              <span className={styles.followUpIcon}>📅</span>
              <span>
                Follow-up:{" "}
                {formatPrescriptionDate(rx.followUpDate)}
              </span>
            </div>
          )}
          {rx.notes && user?.role === "doctor" && (
            <div className={styles.notes}>
              <div className={styles.notesLabel}>Doctor Notes</div>
              <div className={styles.notesText}>{rx.notes}</div>
            </div>
          )}
        </div>
        <div className={styles.actions} id="pdf-actions">
          <Button variant="outline" onClick={handleDownloadPDF}>
            Download PDF
          </Button>
          <Button variant="outline" onClick={handleCopyVerificationLink}>
            Copy Verification Link
          </Button>
          {rx.status === "active" && user?.role === "patient" && (
            <Button variant="primary" onClick={() => navigate(PAGES.ORDERS)}>
              Order Medicines
            </Button>
          )}
        </div>
      </div>
    </div>
  );
}

function DetailList({ title, items }) {
  return (
    <div className={styles.detailBlock}>
      <div className={styles.detailTitle}>{title}</div>
      <div className={styles.detailPills}>
        {items.map((item, index) => (
          <span key={`${item}-${index}`} className={styles.detailPill}>
            {item}
          </span>
        ))}
      </div>
    </div>
  );
}

function PublicVerificationState({ message, onHome }) {
  const isNotFound = /not found/i.test(message || "");

  return (
    <div className={styles.publicPage}>
      <section className={styles.verifyPanel}>
        <div className={styles.verifyMarkError}>{isNotFound ? "404" : "!"}</div>
        <div className={styles.verifyContent}>
          <span className={styles.verifyEyebrow}>Prescription verification</span>
          <h1>{isNotFound ? "Prescription not found" : "Verification failed"}</h1>
          <p>
            {isNotFound
              ? "This prescription link does not match a MediLink prescription record."
              : "MediLink could not verify this prescription right now. Check the QR code or try again."}
          </p>
          <div className={styles.verifyReason}>
            <span>Status</span>
            <strong>{message || "Unable to verify prescription"}</strong>
          </div>
          <div className={styles.verifyActions}>
            <button onClick={() => window.location.reload()} type="button">
              Try again
            </button>
            <button onClick={onHome} type="button">
              Go to MediLink
            </button>
          </div>
        </div>
      </section>
    </div>
  );
}
