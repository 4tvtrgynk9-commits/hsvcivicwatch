export default function Sidebar({ open }) {
  return (
    <div className={`sidebar ${open ? "open" : ""}`}>
      <div className="section-title">Systems: Harm & Change</div>

      <div className="blueprint-card">
        ✨ A Better Huntsville: The Blueprint
      </div>
    </div>
  );
}
