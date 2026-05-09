import { getHomePage, useApp } from "../../context/AppContext";
import { errorPageStyles as styles } from "../../styles/tailwindStyles";

export default function ErrorPage({
  code = "404",
  title = "Page not found",
  message,
}) {
  const { isAuthenticated, navigate, pageParams, user } = useApp();
  const homePage = getHomePage(user?.role);
  const attemptedPath = pageParams?.attemptedPath;
  const body =
    message ||
    "This link does not match any MediLink page. Check the address or return to a known page.";

  const goHome = () => {
    if (isAuthenticated) {
      navigate(homePage, {}, { updateUrl: true, replace: true });
      return;
    }
    window.location.href = "/";
  };

  const goBack = () => {
    if (window.history.length > 1) {
      window.history.back();
      return;
    }
    goHome();
  };

  return (
    <div className={styles.page}>
      <section className={styles.panel}>
        <div className={styles.code}>{code}</div>
        <div className={styles.copy}>
          <span className={styles.eyebrow}>MediLink route check</span>
          <h1>{title}</h1>
          <p>{body}</p>
          {attemptedPath && (
            <div className={styles.path}>
              <span>Requested path</span>
              <strong>{attemptedPath}</strong>
            </div>
          )}
          <div className={styles.actions}>
            <button className={styles.primaryBtn} onClick={goHome} type="button">
              Go to home
            </button>
            <button
              className={styles.secondaryBtn}
              onClick={goBack}
              type="button"
            >
              Go back
            </button>
          </div>
        </div>
      </section>
    </div>
  );
}
