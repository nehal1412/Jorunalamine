// src/App.jsx
import { Routes, Route } from "react-router-dom";
import CalendarPage from "./CalendarPage";
import AnalyticsStandalone from "./Pages/AnalyticsStandalone.jsx";

const theme = `
:root{
  --overlay: linear-gradient(180deg, rgba(3, 7, 18, 0.45) 0%, rgba(3, 7, 18, 0.35) 40%, rgba(3, 7, 18, 0.30) 100%);
  --ink: #e5e7eb;
  --brand: #60a5fa;
  --border: rgba(255,255,255,0.1);
}
html, body, #root { height: 100%; }
body {
  margin: 0;
  color: var(--ink);
  font-family: ui-sans-serif, system-ui, -apple-system, "Segoe UI", Roboto, Inter, Arial;
  background: var(--overlay), url("/bg.jpg") center/cover no-repeat fixed;
}

/* Full-viewport app shell */
.app-shell {
  min-height: 100vh;
  width: 100vw;             /* full width */
  display: flex;
  flex-direction: column;
}

/* The routing area fills remaining space */
.app-main {
  flex: 1 1 auto;
  display: block;
  width: 100%;
  height: 100%;
  /* If child pages have their own max-widths, you can override here */
}
`;

export default function App() {
  return (
    <div className="app-shell">
      <style>{theme}</style>

      <main className="app-main">
        <Routes>
          <Route path="/" element={<CalendarPage />} />
          <Route path="/analytics" element={<AnalyticsStandalone />} />
        </Routes>
      </main>
    </div>
  );
}
