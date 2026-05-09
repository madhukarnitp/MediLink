import { useEffect, useRef, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { useApp } from "../../context/AppContext";
import { Button } from "../../components/ui/UI";
import { loginStyles as styles } from "../../styles/tailwindStyles";
import logo from "../../assets/logo.png";

const SPECIALIZATIONS = [
  "General Physician",
  "Cardiologist",
  "Dermatologist",
  "Neurologist",
  "Orthopedic",
  "Pediatrician",
  "Psychiatrist",
  "Gynecologist",
  "Urologist",
  "Oncologist",
  "ENT Specialist",
];

const getRouteParts = (location) => {
  const route =
    location.hash.replace(/^#\/?/, "") || location.pathname.replace(/^\/+/, "");
  return route.split(/[?#]/)[0].split("/").filter(Boolean);
};

export default function Register() {
  const { login } = useApp();
  const location = useLocation();
  const navigate = useNavigate();
  const query = new URLSearchParams(location.search);
  const initialVerifyEmail = query.get("verify") || "";
  const [role, setRole] = useState("patient");
  const [email, setEmail] = useState(initialVerifyEmail);
  const [phone, setPhone] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [specialization, setSpecialization] = useState("");
  const [qualification, setQualification] = useState("");
  const [regNo, setRegNo] = useState("");
  const [price, setPrice] = useState("");
  const [verificationCode, setVerificationCode] = useState("");
  const [verificationEmail, setVerificationEmail] = useState(initialVerifyEmail);
  const [verificationModalOpen, setVerificationModalOpen] = useState(Boolean(initialVerifyEmail));
  const [notice, setNotice] = useState(
    initialVerifyEmail ? "Enter the OTP sent to your inbox." : "",
  );
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const handledVerificationTokenRef = useRef("");

  useEffect(() => {
    const parts = getRouteParts(location);
    if (parts[0] !== "verify-email" || !parts[1]) return;

    const verificationToken = decodeURIComponent(parts[1]);
    if (
      !verificationToken ||
      handledVerificationTokenRef.current === verificationToken
    ) {
      return;
    }

    handledVerificationTokenRef.current = verificationToken;
    setError("");
    setNotice("Checking your verification link...");
    setVerificationModalOpen(true);

    (async () => {
      setLoading(true);
      try {
        const { auth } = await import("../../services/api");
        const result = await auth.verifyEmailToken(verificationToken);
        const verifiedEmail = result?.data?.email || result?.email || "";
        if (verifiedEmail) {
          const normalizedEmail = verifiedEmail.trim().toLowerCase();
          setVerificationEmail(normalizedEmail);
          setEmail(normalizedEmail);
        }
        setVerificationCode("");
        setNotice("Email verified. You can now login.");
        navigate("/", { replace: true });
      } catch (err) {
        setError(err.message || "Verification failed");
        setNotice("This verification link is invalid or expired. Request a new OTP below.");
        navigate("/register", { replace: true });
      } finally {
        setLoading(false);
      }
    })();
  }, [location, navigate]);

  const openVerificationModal = () => {
    setError("");
    setNotice("Enter the OTP sent to your inbox.");
    if (!verificationEmail && email) {
      setVerificationEmail(email.trim().toLowerCase());
    }
    setVerificationModalOpen(true);
  };

  const handleRegister = async (e) => {
    e && e.preventDefault();
    setError("");
    if (!name || !email || !phone || !password || !confirmPassword) {
      setError("All required fields must be filled");
      return;
    }
    if (password !== confirmPassword) {
      setError("Passwords do not match");
      return;
    }
    if (password.length < 6) {
      setError("Password must be at least 6 characters");
      return;
    }
    if (
      role === "doctor" &&
      (!specialization || !qualification || !regNo || !price)
    ) {
      setError("All doctor fields are required");
      return;
    }
    setLoading(true);
    try {
      const { auth } = await import("../../services/api");
      const payload = {
        name: name.trim(),
        email: email.trim().toLowerCase(),
        phone: phone.trim(),
        password,
        role,
      };
      if (role === "doctor") {
        Object.assign(payload, {
          specialization,
          qualification: qualification.trim(),
          regNo: regNo.trim(),
          price: parseFloat(price),
        });
      }
      const registered = await auth.register(payload);
      const needsVerification =
        registered?.user?.isVerified === false ||
        registered?.user?.emailVerified === false ||
        registered?.requiresVerification !== false;
      if (needsVerification) {
        setVerificationEmail(payload.email);
        setVerificationCode("");
        setEmail(payload.email);
        setVerificationModalOpen(true);
        setNotice(
          role === "doctor"
            ? "Account created. Verify your email first. Admin approval is required after verification."
            : "Account created. Verify your email to activate login.",
        );
      } else {
        await login(payload.email, password);
      }
    } catch (err) {
      setError(err.message || "Registration failed");
    } finally {
      setLoading(false);
    }
  };

  const handleVerifyEmail = async (e) => {
    e && e.preventDefault();
    setError("");
    setNotice("");
    if (!verificationEmail || !verificationCode) {
      setError("Enter email and verification code");
      return;
    }
    setLoading(true);
    try {
      const { auth } = await import("../../services/api");
      await auth.verifyEmail(
        verificationEmail.trim().toLowerCase(),
        verificationCode.trim(),
      );
      setNotice("Email verified. You can now login.");
      setVerificationCode("");
      setVerificationModalOpen(false);
      navigate("/", { replace: true });
    } catch (err) {
      setError(err.message || "Verification failed");
    } finally {
      setLoading(false);
    }
  };

  const resendVerification = async () => {
    setError("");
    if (!verificationEmail && !email) {
      setError("Enter your email first");
      return;
    }
    setLoading(true);
    try {
      const targetEmail = (verificationEmail || email).trim().toLowerCase();
      const { auth } = await import("../../services/api");
      await auth.requestVerification(targetEmail);
      setVerificationEmail(targetEmail);
      setNotice("Verification code and activation link sent.");
    } catch (err) {
      setError(err.message || "Could not send verification code");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={styles.registerPage}>
      <div className={styles.background} />
      <section className={styles.registerShell}>
        <aside className={styles.registerHero}>
          <img src={logo} alt="MediLink logo" className={styles.registerLogo} />
          <h1>Create your MediLink account</h1>
          <p>
            Complete the required details, verify your email with OTP, and then
            continue to secure care workflows.
          </p>
          <div className={styles.registerSteps}>
            <span>Required details</span>
            <span>Email OTP verification</span>
            <span>Doctor admin approval</span>
          </div>
        </aside>

        <div className={styles.registerPanel}>
          <img src={logo} alt="MediLink logo" className={styles.registerMobileLogo} />
          <div className={styles.registerPanelTop}>
            <div>
              <span>Registration</span>
              <h2>Required account details</h2>
            </div>
            <button onClick={() => navigate("/")} type="button">
              Login
            </button>
          </div>

          {notice && !verificationModalOpen && (
            <div className={styles.notice}>{notice}</div>
          )}

          <form onSubmit={handleRegister} className={styles.registerForm}>
            <section className={styles.formSection}>
              <div className={styles.formSectionTitle}>
                <strong>Account type</strong>
                <span>Required</span>
              </div>
              <div className={styles.roleSelector}>
                <label
                  className={`${styles.roleOption} ${role === "patient" ? styles.active : ""}`}
                >
                  <input
                    type="radio"
                    value="patient"
                    checked={role === "patient"}
                    onChange={(e) => setRole(e.target.value)}
                    required
                  />
                  <span>Patient</span>
                </label>
                <label
                  className={`${styles.roleOption} ${role === "doctor" ? styles.active : ""}`}
                >
                  <input
                    type="radio"
                    value="doctor"
                    checked={role === "doctor"}
                    onChange={(e) => setRole(e.target.value)}
                    required
                  />
                  <span>Doctor</span>
                </label>
              </div>
            </section>

            <section className={styles.formSection}>
              <div className={styles.formSectionTitle}>
                <strong>Identity and access</strong>
                <span>All fields required</span>
              </div>
              <div className={styles.registerGrid}>
                <div className={styles.inputGroup}>
                  <label>Full Name *</label>
                  <input
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="Your full name"
                    disabled={loading}
                    autoComplete="name"
                    required
                  />
                </div>
                <div className={styles.inputGroup}>
                  <label>Email *</label>
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="Email address"
                    disabled={loading}
                    autoComplete="email"
                    required
                  />
                </div>
                <div className={styles.inputGroup}>
                  <label>Phone *</label>
                  <input
                    type="tel"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    placeholder="Phone number"
                    disabled={loading}
                    autoComplete="tel"
                    required
                  />
                </div>
                <div className={styles.inputGroup}>
                  <label>Password *</label>
                  <input
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="Min 6 characters"
                    disabled={loading}
                    autoComplete="new-password"
                    minLength={6}
                    required
                  />
                </div>
                <div className={styles.inputGroup}>
                  <label>Confirm Password *</label>
                  <input
                    type="password"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    placeholder="Repeat password"
                    disabled={loading}
                    autoComplete="new-password"
                    minLength={6}
                    required
                  />
                </div>
              </div>
            </section>

            {role === "doctor" && (
              <section className={styles.formSection}>
                <div className={styles.formSectionTitle}>
                  <strong>Doctor verification details</strong>
                  <span>All fields required</span>
                </div>
                <div className={styles.registerGrid}>
                  <div className={styles.inputGroup}>
                    <label>Specialization *</label>
                    <select
                      value={specialization}
                      onChange={(e) => setSpecialization(e.target.value)}
                      disabled={loading}
                      required={role === "doctor"}
                    >
                      <option value="">Select specialization</option>
                      {SPECIALIZATIONS.map((s) => (
                        <option key={s} value={s}>
                          {s}
                        </option>
                      ))}
                    </select>
                  </div>
                  <div className={styles.inputGroup}>
                    <label>Qualification *</label>
                    <input
                      type="text"
                      value={qualification}
                      onChange={(e) => setQualification(e.target.value)}
                      placeholder="e.g. MBBS, MD"
                      disabled={loading}
                      required={role === "doctor"}
                    />
                  </div>
                  <div className={styles.inputGroup}>
                    <label>Registration No. *</label>
                    <input
                      type="text"
                      value={regNo}
                      onChange={(e) => setRegNo(e.target.value)}
                      placeholder="Medical council reg. no."
                      disabled={loading}
                      required={role === "doctor"}
                    />
                  </div>
                  <div className={styles.inputGroup}>
                    <label>Consultation Price (Rs) *</label>
                    <input
                      type="number"
                      value={price}
                      onChange={(e) => setPrice(e.target.value)}
                      placeholder="e.g. 500"
                      min="0"
                      disabled={loading}
                      required={role === "doctor"}
                    />
                  </div>
                </div>
              </section>
            )}

            {error && !verificationModalOpen && (
              <div className={styles.error}>{error}</div>
            )}

            <div className={styles.registerActions}>
              <Button
                variant="primary"
                className={styles.loginBtn}
                disabled={loading}
                type="submit"
              >
                {loading ? "Creating account..." : "Create Account"}
              </Button>
              <button
                className={styles.secondaryAction}
                disabled={loading}
                onClick={openVerificationModal}
                type="button"
              >
                Verify existing account
              </button>
            </div>
          </form>
        </div>
      </section>

      {verificationModalOpen && (
        <div className={styles.verifyModalBackdrop} role="presentation">
          <section className={styles.verifyModal} role="dialog" aria-modal="true">
            <div className={styles.verifyModalHeader}>
              <span>Email verification</span>
              <h2>Activate your account</h2>
              <p>
                Enter the OTP sent to your inbox, or use the activation link
                from the same email.
              </p>
            </div>
            <form onSubmit={handleVerifyEmail} className={styles.verifyModalBody}>
              <div className={styles.inputGroup}>
                <label>Email *</label>
                <input
                  type="email"
                  value={verificationEmail}
                  onChange={(e) => setVerificationEmail(e.target.value)}
                  placeholder="Email to verify"
                  disabled={loading}
                  required
                />
              </div>
              <div className={styles.inputGroup}>
                <label>OTP code *</label>
                <input
                  value={verificationCode}
                  onChange={(e) => setVerificationCode(e.target.value)}
                  placeholder="Enter verification code"
                  disabled={loading}
                  inputMode="numeric"
                  autoComplete="one-time-code"
                  required
                />
              </div>

              {error && <div className={styles.error}>{error}</div>}
              {notice && <div className={styles.notice}>{notice}</div>}

              <div className={styles.verifyModalActions}>
                <Button
                  variant="primary"
                  className={styles.loginBtn}
                  disabled={loading}
                  type="submit"
                >
                  {loading ? "Verifying..." : "Verify OTP"}
                </Button>
                <button
                  className={styles.secondaryAction}
                  disabled={loading}
                  onClick={resendVerification}
                  type="button"
                >
                  Resend OTP/link
                </button>
                <button
                  className={styles.linkBtn}
                  disabled={loading}
                  onClick={() => navigate("/")}
                  type="button"
                >
                  Back to login
                </button>
              </div>
            </form>
          </section>
        </div>
      )}
    </div>
  );
}
