// src/pages/GrowthPage.jsx
import { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";

const styles = `
@import url('https://fonts.googleapis.com/css2?family=Playfair+Display:wght@700;900&display=swap');
:root{
  --beige: #f5e9d4;
  --beige-soft: #e9d6b8;
  --glass: rgba(255,255,255,0.06);
  --glass-b: rgba(255,255,255,0.12);
}

/* Background */
.bg-stage{ position: fixed; inset: 0; z-index: -2; overflow: hidden; background: #0a0f1c; }
.bg-video{ position: absolute; inset: 0; width: 100%; height: 100%; object-fit: cover; object-position: center; filter: saturate(110%) contrast(105%) brightness(80%); }
.bg-video::-webkit-media-controls{ display:none !important; }

/* Page */
html,body,#root{ height:100%; }
body{ margin:0; }
.growth-wrap{ min-height:100vh; width:100vw; position:relative; z-index:0; padding:24px 0 32px; }

/* Card */
.growth-card{
  width:100vw;
  margin-left:calc(50% - 50vw); margin-right:calc(50% - 50vw);
  background: linear-gradient(180deg, rgba(10,15,28,0.50), rgba(10,15,28,0.42));
  border:1px solid rgba(255,255,255,0.12);
  box-shadow: 0 28px 90px rgba(0,0,0,0.48), inset 0 0 0 1px rgba(255,255,255,0.06);
}
.card-inner{ width:min(1240px,96vw); margin:0 auto; padding:26px 20px 26px; }

/* Header */
.header{ display:flex; align-items:center; justify-content:space-between; gap:12px; margin-bottom:10px; }
.kicker{ color:var(--beige-soft); letter-spacing:1.6px; text-transform:uppercase; font-weight:800; font-size:12px; }
.growth-title{
  font-family:"Playfair Display", ui-serif, Georgia, Cambria, "Times New Roman", serif;
  color:var(--beige); font-weight:900; letter-spacing:0;
  font-size:clamp(28px, 5vw, 56px); line-height:1.05;
  text-shadow:0 2px 18px rgba(245,233,212,0.16);
}
.link-btn{
  border:1px solid rgba(255,255,255,0.16);
  background:rgba(255,255,255,0.10); color:var(--beige);
  padding:10px 14px; border-radius:999px; font-weight:800; text-decoration:none;
  transition:all .18s ease; letter-spacing:.2px;
}
.link-btn:hover{ background:rgba(255,255,255,0.14); transform:translateY(-1px); }

/* Columns grid */
.columns{ display:grid; grid-template-columns:repeat(3,1fr); gap:16px; margin-top:18px; align-items:start; }
@media (max-width:1024px){ .columns{ grid-template-columns:1fr; } }

/* Column (fixed height) */
.col{
  background:var(--glass); border:1px solid var(--glass-b);
  border-radius:16px; padding:14px; box-shadow:0 14px 36px rgba(0,0,0,0.22);
  display:grid; grid-template-rows:auto auto 1fr; gap:10px;
  height:460px; overflow:hidden;
}
@media (max-width:1024px){ .col{ height:520px; } }

.col-head{
  display:flex; align-items:center; justify-content:space-between; gap:8px;
  border-bottom:1px solid rgba(255,255,255,0.08); padding-bottom:8px; flex-wrap:wrap; row-gap:6px;
}
.col-title{ color:var(--beige); font-weight:800; letter-spacing:.2px; font-size:14px; text-transform:uppercase; }

/* Buttons */
.btn-chip{
  border:1px solid rgba(255,255,255,0.16);
  background:rgba(255,255,255,0.10); color:var(--beige);
  padding:8px 12px; border-radius:999px; font-weight:800; cursor:pointer;
  transition:all .18s ease; letter-spacing:.2px; font-size:12px;
}
.btn-chip:hover{ background:rgba(255,255,255,0.14); transform:translateY(-1px); }

/* Reserved slot for add form */
.add-slot{ height:140px; overflow:hidden; position:relative; border-bottom:1px solid rgba(255,255,255,0.06); }
.add-panel{ position:absolute; inset:0; max-height:0; overflow:hidden; transition:max-height .25s ease, padding-top .25s ease; padding-top:0; }
.add-panel.open{ max-height:140px; padding-top:6px; }

/* Add form grid */
.add-grid{ display:grid; grid-template-columns: 84px minmax(320px,1fr) 170px 160px auto; gap:10px; align-items:end; }

/* Inputs */
.name-input, .id-field, .select, .date-field, .num{
  height:42px; border-radius:10px; border:1px solid rgba(255,255,255,0.14);
  background:rgba(255,255,255,0.06); padding:0 12px; color:#e5e7eb; font-size:14px;
}
.id-field, .date-field{ background:rgba(255,255,255,0.04); }

/* List (scrolls) */
.list-wrap{ overflow:auto; padding-right:4px; }
.section-subtitle{ color:var(--beige); font-weight:700; font-size:13px; margin:4px 2px 6px; opacity:.9; }
.goals{ display:grid; gap:8px; }
.goal{
  display:flex; gap:12px;
  background:rgba(255,255,255,0.07); border:1px solid rgba(255,255,255,0.14);
  border-radius:12px; padding:12px;
}
.goal-main{ flex:1; display:flex; flex-direction:column; gap:6px; }
.goal-title{ font-weight:700; }
.goal-meta{ font-size:12px; opacity:.9; display:flex; gap:12px; flex-wrap:wrap; }

/* Complete editor */
.edit-line{ display:grid; grid-template-columns:1fr 1fr auto auto; gap:8px; margin-top:8px; align-items:center; }
`;

function toYMD(d = new Date()) {
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, "0");
  const day = String(d.getDate()).padStart(2, "0");
  return `${y}-${m}-${day}`;
}
function formatLong(date) {
  return date.toLocaleDateString("en-IN", { weekday: "long", month: "long", day: "numeric", year: "numeric" });
}
function formatDateTime(d = new Date()) {
  const date = toYMD(d);
  const time = d.toLocaleTimeString("en-IN", { hour: "2-digit", minute: "2-digit" });
  return { date, time };
}

function CompleteEditorHM({ onSave, onCancel }) {
  const [eh, setEh] = useState(""); // est hours
  const [em, setEm] = useState(""); // est mins
  const [rh, setRh] = useState(""); // req hours
  const [rm, setRm] = useState(""); // req mins
  const toMinutes = (h, m) => (Number(h)||0)*60 + (Number(m)||0);

  return (
    <div className="edit-line" style={{ gridTemplateColumns: "1fr 1fr 1fr 1fr auto auto" }}>
      <input className="num" type="number" min="0" placeholder="Est hrs" value={eh} onChange={e=>setEh(e.target.value)} />
      <input className="num" type="number" min="0" placeholder="Est mins" value={em} onChange={e=>setEm(e.target.value)} />
      <input className="num" type="number" min="0" placeholder="Req hrs" value={rh} onChange={e=>setRh(e.target.value)} />
      <input className="num" type="number" min="0" placeholder="Req mins" value={rm} onChange={e=>setRm(e.target.value)} />
      <button className="btn-chip" onClick={()=>onSave(toMinutes(eh,em), toMinutes(rh,rm))}>Save</button>
      <button className="btn-chip" onClick={onCancel}>Cancel</button>
    </div>
  );
}

function Column({ label, goals, setGoals, nextId, setNextId }) {
  const [openAdd, setOpenAdd] = useState(true);
  const [name, setName] = useState("");
  const [category, setCategory] = useState("Expense");
  const { date: createdDate, time: createdTime } = formatDateTime(new Date());

  const create = async () => {
    if (!name.trim()) return;
    const newGoal = {
      id: nextId,
      name: name.trim(),
      category,
      createdDate,
      createdTime,
      done: false,
      estTime: null,
      reqTime: null,
      editing: false
    };
    setGoals(g => [newGoal, ...g]);
    setNextId(n => n + 1);
    setName("");
  };

  const startComplete = id => setGoals(g => g.map(it => it.id===id ? { ...it, editing:true } : it));
  const cancelComplete = id => setGoals(g => g.map(it => it.id===id ? { ...it, editing:false } : it));
  const saveComplete = (id, estMin, reqMin) =>
    setGoals(g => g.map(it => it.id===id ? { ...it, done:true, estTime:estMin, reqTime:reqMin, editing:false } : it));
  const remove = id => setGoals(g => g.filter(it => it.id !== id));

  const active = goals.filter(x=>!x.done);
  const completed = goals.filter(x=>x.done);

  const showMinutes = (m) => {
    const h = Math.floor((m||0)/60), rem = (m||0)%60;
    return `${h}h ${rem}m`;
  };

  return (
    <section className="col">
      <div className="col-head">
        <div className="col-title">{label}</div>
        <button className="btn-chip" onClick={()=>setOpenAdd(v=>!v)}>{openAdd ? "Close" : "+ Add goal"}</button>
      </div>

      <div className="add-slot">
        <div className={`add-panel ${openAdd ? "open" : ""}`}>
          <div className="add-grid">
            <input className="id-field" value={nextId} readOnly aria-label={`${label} next id`} />
            <input className="name-input" placeholder="Goal name" value={name} onChange={(e)=>setName(e.target.value)} />
            <select className="select" value={category} onChange={(e)=>setCategory(e.target.value)}>
              <option>Expense</option>
              <option>Fitness</option>
              <option>Career</option>
            </select>
            <input className="date-field" value={`${createdDate} ${createdTime}`} readOnly aria-label="Created date and time" />
            <button className="btn-chip" onClick={create}>Create</button>
          </div>
        </div>
      </div>

      <div className="list-wrap">
        <div className="section-subtitle">Active</div>
        <div className="goals">
          {active.length===0 && <div style={{opacity:.85,fontSize:13}}>No active goals.</div>}
          {active.map(g=>(
            <div key={g.id} className="goal">
              <div className="goal-main">
                <div className="goal-title">#{g.id} — {g.name}</div>
                <div className="goal-meta">
                  <span>Category: {g.category}</span>
                  <span>Created: {g.createdDate} • {g.createdTime}</span>
                </div>
                {g.editing && (
                  <CompleteEditorHM
                    onSave={(estMin, reqMin)=>saveComplete(g.id, estMin, reqMin)}
                    onCancel={()=>cancelComplete(g.id)}
                  />
                )}
              </div>
              <div className="controls">
                {!g.editing && <button className="btn-chip" onClick={()=>startComplete(g.id)}>Complete</button>}
                <button className="btn-chip" onClick={()=>remove(g.id)}>Remove</button>
              </div>
            </div>
          ))}
        </div>

        {completed.length>0 && (
          <>
            <div className="section-subtitle">Completed</div>
            <div className="goals">
              {completed.map(g=>(
                <div key={g.id} className="goal">
                  <div className="goal-main">
                    <div className="goal-title">#{g.id} — {g.name}</div>
                    <div className="goal-meta">
                      <span>Category: {g.category}</span>
                      <span>Created: {g.createdDate} • {g.createdTime}</span>
                      <span>Estimated: {showMinutes(g.estTime)}</span>
                      <span>Required: {showMinutes(g.reqTime)}</span>
                      <span>Status: Done</span>
                    </div>
                  </div>
                  <div className="controls">
                    <button className="btn-chip" onClick={()=>remove(g.id)}>Remove</button>
                  </div>
                </div>
              ))}
            </div>
          </>
        )}
      </div>
    </section>
  );
}

export default function GrowthPage(){
  const [now] = useState(()=>new Date());
  const dateLabel = useMemo(()=>formatLong(now),[now]);

  const [weeklyGoals,setWeeklyGoals] = useState([]);
  const [weeklyNextId,setWeeklyNextId] = useState(1);
  const [monthlyGoals,setMonthlyGoals] = useState([]);
  const [monthlyNextId,setMonthlyNextId] = useState(1);
  const [longGoals,setLongGoals] = useState([]);
  const [longNextId,setLongNextId] = useState(1);

  useEffect(()=>{
    const { date: seedDate, time: seedTime } = formatDateTime(new Date());
    const seed = [
      { id: 1, name: "DSA practice 2 hrs", category:"Career", createdDate: seedDate, createdTime: seedTime, done:false, estTime:null, reqTime:null, editing:false },
      { id: 2, name: "30m run", category:"Fitness", createdDate: seedDate, createdTime: seedTime, done:false, estTime:null, reqTime:null, editing:false },
    ];
    setWeeklyGoals(seed);
    setWeeklyNextId(3);
    setMonthlyGoals([{ id: 1, name: "Read 2 books", category:"Career", createdDate: seedDate, createdTime: seedTime, done:false, estTime:null, reqTime:null, editing:false }]);
    setMonthlyNextId(2);
    setLongGoals([{ id: 1, name: "Save ₹1L emergency fund", category:"Expense", createdDate: seedDate, createdTime: seedTime, done:false, estTime:null, reqTime:null, editing:false }]);
    setLongNextId(2);
  },[]);

  return (
    <div className="growth-wrap">
      <style>{styles}</style>

      <div className="bg-stage" aria-hidden="true">
        <video className="bg-video" autoPlay muted loop playsInline preload="auto">
          <source src="/Growthbackground.mp4" type="video/mp4" />
        </video>
      </div>

      <div className="growth-card">
        <div className="card-inner">
          <div className="header">
            <div>
              <div className="kicker">Planner</div>
              <div className="growth-title">Growth for {dateLabel}</div>
            </div>
            <Link to="/analytics" className="link-btn">Analytics Page</Link>
          </div>

          <div className="columns">
            <Column label="Weekly" goals={weeklyGoals} setGoals={setWeeklyGoals} nextId={weeklyNextId} setNextId={setWeeklyNextId} />
            <Column label="Monthly" goals={monthlyGoals} setGoals={setMonthlyGoals} nextId={monthlyNextId} setNextId={setMonthlyNextId} />
            <Column label="Long Term" goals={longGoals} setGoals={setLongGoals} nextId={longNextId} setNextId={setLongNextId} />
          </div>
        </div>
      </div>
    </div>
  );
}

export { toYMD, formatLong, formatDateTime };
