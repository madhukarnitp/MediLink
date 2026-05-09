import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useApp } from "../../context/AppContext";
import { Button } from "../../components/ui/UI";
import { loginStyles as styles } from "../../styles/tailwindStyles";
import logo from "../../assets/logo.png";

export default function Login() {
  const { login } = useApp();
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [notice, setNotice] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleLogin = async (e) => {
    e && e.preventDefault();
    setError("");
    setNotice("");
    if (!email || !password) {
      setError("Please enter email and password");
      return;
    }
    setLoading(true);
    try {
      await login(email.trim().toLowerCase(), password);
    } catch (err) {
      if (err.code === "EMAIL_NOT_VERIFIED") {
        const nextEmail = email.trim().toLowerCase();
        setNotice(
          "Verify your email before logging in. We sent a fresh code to your inbox.",
        );
        try {
          const { auth } = await import("../../services/api");
          await auth.requestVerification(nextEmail);
        } catch {}
        navigate(`/register?verify=${encodeURIComponent(nextEmail)}`);
      } else if (err.code === "ACCOUNT_NOT_VERIFIED") {
        setError(err.message || "Your account is pending admin verification.");
        setNotice(
          "Your account is waiting for admin approval. You can login once verification is completed.",
        );
      } else if (err.code === "ACCOUNT_BLOCKED") {
        setError(err.message || "Your account has been blocked.");
        setNotice("Please contact support if you believe this is a mistake.");
      } else {
        setError(err.message || "Invalid credentials");
      }
      setPassword("");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={styles.container}>
      <div className={styles.background} />
      <div className={styles.card}>
        <div className={styles.header}>
          <img src={logo} alt="MediLink logo" className={styles.logoImage} />
          <h1>Welcome to MediLink</h1>
          <p>Healthcare made simple and accessible</p>
        </div>

        {notice && <div className={styles.notice}>{notice}</div>}

        <form onSubmit={handleLogin} className={styles.form}>
          <div className={styles.inputGroup}>
            <label>Email</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Enter your email"
              disabled={loading}
              autoComplete="email"
            />
          </div>
          <div className={styles.inputGroup}>
            <label>Password</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Enter your password"
              disabled={loading}
              autoComplete="current-password"
            />
          </div>
          {error && <div className={styles.error}>{error}</div>}
          <Button
            variant="primary"
            className={styles.loginBtn}
            disabled={loading}
            type="submit"
          >
            {loading ? "Logging in..." : "Login"}
          </Button>
        </form>

        <div className={styles.authSwitch}>
          <span>New to MediLink?</span>
          <button onClick={() => navigate("/register")} type="button">
            Create an account
          </button>
        </div>
      </div>
    </div>
  );
}
