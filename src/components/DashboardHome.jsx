export default function DashboardHome() {
  return (
    <div className="page">
      <section className="section payclock-container">
        <h2>Live Pay Clocks — Since You Opened This Page</h2>
        <div className="payclock-card-grid"></div>
      </section>

      <div className="acronym-box">
        <strong>Acronym Key</strong>
        <p>TVA = Tennessee Valley Authority</p>
        <p>HHHS = Huntsville Hospital Health System</p>
        <p>HU = Huntsville Utilities</p>
      </div>

      <section>
        <h2>Key Numbers — Huntsville 2026</h2>
        <div className="key-grid"></div>
      </section>

      <section>
        <h2>Investigations</h2>
        <div className="module-grid"></div>
      </section>
    </div>
  );
}
