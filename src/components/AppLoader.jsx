export default function AppLoader({ loading }) {
  if (!loading) return null;

  return (
    <div className="app-loader" role="status" aria-live="polite">
      <div className="loader-content">
        <div className="logo-wrapper">
          <img src="/images/Logo.png" className="logo" alt="ProScience" />
        </div>

        <p className="loading-title">Cargando información</p>

        <div className="progress-bar">
          <div className="progress-fill" />
        </div>
      </div>
    </div>
  );
}
