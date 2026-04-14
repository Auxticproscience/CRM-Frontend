import { useEffect, useState } from "react";

export default function AppLoader({ loading }) {
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    if (!loading) return;

    const interval = setInterval(() => {
      setProgress((prev) => (prev < 90 ? prev + Math.random() * 5 : prev));
    }, 120);

    return () => clearInterval(interval);
  }, [loading]);

  useEffect(() => {
    if (!loading) {
      let i = progress;
      const finish = setInterval(() => {
        i++;
        setProgress(i);
        if (i >= 100) clearInterval(finish);
      }, 15);
    }
  }, [loading]);

  if (!loading) return null;

  return (
    <div className="app-loader">
      <div className="loader-content">

        <div className="logo-wrapper">
          <img src="/images/Logo.png" className="logo" />
        </div>

        <p className="loading-title">Cargando CRM</p>

        <div className="progress-bar">
          <div
            className="progress-fill"
            style={{ width: `${progress}%` }}
          />
        </div>

        <span className="progress-text">{Math.floor(progress)}%</span>
      </div>
    </div>
  );
}