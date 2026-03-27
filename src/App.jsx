import { useState } from "react";
import Sidebar from "./components/Sidebar";

export default function App() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [inModule, setInModule] = useState(false);

  const toggleSidebar = () => setSidebarOpen(!sidebarOpen);

  return (
    <div>
      <div className="header">
        <button
          className={`hamburger ${sidebarOpen ? "open" : ""}`}
          onClick={toggleSidebar}
        >
          ☰
        </button>

        {inModule && !sidebarOpen && <button className="back">←</button>}

        <h1>Huntsville Civic Investigator</h1>
      </div>

      <Sidebar open={sidebarOpen} />

      <main></main>
    </div>
  );
}
