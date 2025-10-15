// src/pages/components/AnalyticsPanel.jsx
import React from "react";

export default function AnalyticsPanel(props) {
  const {
    analyticsScope, setAnalyticsScope,
    analyticsDate, setAnalyticsDate,
    analyticsWeek, setAnalyticsWeek,
    analyticsMonth, setAnalyticsMonth,
    mfdi, setMfdi,
    motion, setMotion,
    presence, setPresence,
    monthlyHours,
    addHours, setAddHours,
    clampPct, pctStyle,
    formatWeekLabel, monthLabel,
    saveAnalyticsForSelection,
    commitAddHours
  } = props;

  return (
    <div className="mount-enter">
      <div className="section-title">Analytics</div>

      {/* Control strip */}
      <div className="actions control-strip" style={{ justifyContent: "flex-start", marginBottom: 8, gap: 12 }}>
        {["Daily", "Weekly", "Monthly"].map((g) => (
          <button
            key={g}
            className={`btn small ${analyticsScope === g ? "primary" : ""}`}
            onClick={() => setAnalyticsScope(g)}
          >
            {g}
          </button>
        ))}

        {analyticsScope === "Daily" && (
          <label className="btn small input-chip" style={{ cursor: "default" }}>
            <span style={{ marginRight: 8 }}>Date</span>
            <input
              type="date"
              value={analyticsDate}
              onChange={(e) => setAnalyticsDate(e.target.value)}
            />
          </label>
        )}

        {analyticsScope === "Weekly" && (
          <label className="btn small input-chip" style={{ cursor: "default" }}>
            <span style={{ marginRight: 8 }}>Week</span>
            <input
              type="week"
              value={analyticsWeek}
              onChange={(e) => setAnalyticsWeek(e.target.value)}
            />
          </label>
        )}

        {analyticsScope === "Monthly" && (
          <label className="btn small input-chip" style={{ cursor: "default" }}>
            <span style={{ marginRight: 8 }}>Month</span>
            <input
              type="month"
              value={analyticsMonth}
              onChange={(e) => setAnalyticsMonth(e.target.value)}
            />
          </label>
        )}

        <div className="btn small" style={{ cursor: "default" }}>
          {analyticsScope === "Daily" && `Selected: ${new Date(analyticsDate).toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" })}`}
          {analyticsScope === "Weekly" && `Selected: ${formatWeekLabel(analyticsWeek)}`}
          {analyticsScope === "Monthly" && `Selected: ${monthLabel(analyticsMonth)}`}
        </div>
      </div>

      <div className="list">
        {/* MFDI */}
        <div className="row">
          <div className="toggle-cluster" style={{ alignItems: "center" }}>
            <span className="label-chip">MFDI (%)</span>
          </div>
          <div className="field compact-col">
            <input
              type="number"
              min="0"
              max="100"
              step="1"
              value={mfdi}
              onChange={(e) => setMfdi(clampPct(e.target.value))}
              placeholder="0 – 100"
            />
          </div>
          <div className="area" style={{ display: "flex", alignItems: "center" }}>
            <div className="progress-track" aria-label="MFDI progress">
              <div className="progress-fill" style={pctStyle(mfdi)} />
            </div>
          </div>
          <div className="cell-actions inline-actions">
            <span className="time-chip">{clampPct(mfdi)}%</span>
          </div>
        </div>

        {/* Motion */}
        <div className="row">
          <div className="toggle-cluster" style={{ alignItems: "center" }}>
            <span className="label-chip">Motion (%)</span>
          </div>
          <div className="field compact-col">
            <input
              type="number"
              min="0"
              max="100"
              step="1"
              value={motion}
              onChange={(e) => setMotion(clampPct(e.target.value))}
              placeholder="0 – 100"
            />
          </div>
          <div className="area" style={{ display: "flex", alignItems: "center" }}>
            <div className="progress-track" aria-label="Motion progress">
              <div className="progress-fill" style={pctStyle(motion)} />
            </div>
          </div>
          <div className="cell-actions inline-actions">
            <span className="time-chip">{clampPct(motion)}%</span>
          </div>
        </div>

        {/* Presence */}
        <div className="row">
          <div className="toggle-cluster" style={{ alignItems: "center" }}>
            <span className="label-chip">Presence (%)</span>
          </div>
          <div className="field compact-col">
            <input
              type="number"
              min="0"
              max="100"
              step="1"
              value={presence}
              onChange={(e) => setPresence(clampPct(e.target.value))}
              placeholder="0 – 100"
            />
          </div>
          <div className="area" style={{ display: "flex", alignItems: "center" }}>
            <div className="progress-track" aria-label="Presence progress">
              <div className="progress-fill" style={pctStyle(presence)} />
            </div>
          </div>
          <div className="cell-actions inline-actions">
            <span className="time-chip">{clampPct(presence)}%</span>
          </div>
        </div>

        {/* Monthly hours accumulator */}
        <div className="row">
          <div className="toggle-cluster" style={{ alignItems: "center" }}>
            <span className="label-chip">Monthly hours</span>
          </div>
          <div className="field compact-col">
            <input
              type="number"
              min="0"
              step="0.25"
              value={addHours}
              onChange={(e) => setAddHours(e.target.value)}
              placeholder="Add hours (e.g., 1.5)"
            />
          </div>
          <div className="area" style={{ display: "flex", alignItems: "center" }}>
            <button className="btn small" onClick={commitAddHours}>Add to total</button>
          </div>
          <div className="cell-actions inline-actions">
            <span className="time-chip">{monthlyHours.toFixed(2)} h</span>
          </div>
        </div>

        {/* Save analytics changes for current selection */}
        <div className="actions" style={{ justifyContent: "flex-start" }}>
          <button className="btn primary small" onClick={saveAnalyticsForSelection}>
            Save analytics for selected period
          </button>
        </div>
      </div>
    </div>
  );
}
