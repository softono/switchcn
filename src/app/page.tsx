"use client";

import { useState } from "react";
import { ThemeSwitcher } from "@/components/switchcn";

// ─── SVG path helper ──────────────────────────────────────────────────────────
function makePath(pts: [number, number][]): string {
  if (pts.length < 2) return "";
  let d = `M ${pts[0][0]},${pts[0][1]}`;
  for (let i = 1; i < pts.length; i++) {
    const [x0, y0] = pts[i - 1];
    const [x1, y1] = pts[i];
    const mx = (x0 + x1) / 2;
    d += ` C ${mx},${y0} ${mx},${y1} ${x1},${y1}`;
  }
  return d;
}

// ─── Primitives ──────────────────────────────────────────────────────────────
function Card({ children, className = "" }: { children: React.ReactNode; className?: string }) {
  return (
    <div className={`bg-card border border-border rounded-xl ${className}`}>
      {children}
    </div>
  );
}

function Inp({
  placeholder, type = "text", value, onChange, className = "", readOnly,
}: {
  placeholder?: string; type?: string; value: string;
  onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void;
  className?: string; readOnly?: boolean;
}) {
  return (
    <input
      type={type} value={value} onChange={onChange} placeholder={placeholder}
      readOnly={readOnly}
      className={`w-full bg-background border border-input rounded-lg px-3 py-2 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring/50 transition-colors ${className}`}
    />
  );
}

function Toggle({ on, setOn }: { on: boolean; setOn: () => void }) {
  return (
    <button onClick={setOn} role="switch" aria-checked={on}
      className="relative inline-flex h-5 w-9 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors focus:outline-none focus:ring-2 focus:ring-ring/50"
      style={{ background: on ? "var(--primary)" : "var(--muted)" }}>
      <span className="pointer-events-none block h-4 w-4 rounded-full bg-white shadow ring-0 transition-transform"
        style={{ transform: on ? "translateX(16px)" : "translateX(0)" }} />
    </button>
  );
}

function Checkbox({ on, setOn, label }: { on: boolean; setOn: () => void; label: string }) {
  return (
    <label className="flex items-center gap-2 cursor-pointer select-none text-sm" onClick={setOn}>
      <span className="h-4 w-4 rounded border flex items-center justify-center shrink-0 transition-colors"
        style={{ background: on ? "var(--primary)" : "var(--background)", borderColor: on ? "var(--primary)" : "var(--input)" }}>
        {on && (
          <svg width="10" height="8" viewBox="0 0 10 8" fill="none">
            <path d="M1 4l3 3 5-6" stroke="var(--primary-foreground)" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        )}
      </span>
      {label}
    </label>
  );
}

function Sel({ value, onChange, opts }: { value: string; onChange: (v: string) => void; opts: string[] }) {
  return (
    <select value={value} onChange={e => onChange(e.target.value)}
      className="w-full bg-background border border-input rounded-lg px-3 py-2 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-ring/50">
      {opts.map(o => <option key={o}>{o}</option>)}
    </select>
  );
}

// ─── Charts ───────────────────────────────────────────────────────────────────
function Sparkline({ pts, h = 50 }: { pts: [number, number][]; h?: number }) {
  const w = pts[pts.length - 1][0];
  return (
    <svg viewBox={`0 0 ${w} ${h}`} width="100%" height={h} fill="none" className="overflow-visible">
      <path d={makePath(pts)} stroke="var(--primary)" strokeWidth="2" strokeLinecap="round" />
      {pts.map(([x, y], i) => <circle key={i} cx={x} cy={y} r="3" fill="var(--primary)" />)}
    </svg>
  );
}

function AreaChart({ pts, h = 80 }: { pts: [number, number][]; h?: number }) {
  const w = pts[pts.length - 1][0];
  const line = makePath(pts);
  const area = `${line} L ${w},${h} L 0,${h} Z`;
  return (
    <svg viewBox={`0 0 ${w} ${h}`} width="100%" height={h} fill="none" className="overflow-visible">
      <defs>
        <linearGradient id="ag" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="var(--primary)" stopOpacity="0.25" />
          <stop offset="100%" stopColor="var(--primary)" stopOpacity="0" />
        </linearGradient>
      </defs>
      <path d={area} fill="url(#ag)" />
      <path d={line} stroke="var(--primary)" strokeWidth="2" strokeLinecap="round" />
    </svg>
  );
}

function LineChart({ pts, labels, w = 460, h = 110 }: {
  pts: [number, number][]; labels: string[]; w?: number; h?: number;
}) {
  return (
    <div className="w-full overflow-hidden">
      <svg viewBox={`0 0 ${w} ${h + 24}`} width="100%" fill="none">
        {[0, 0.33, 0.66, 1].map(t => (
          <line key={t} x1="0" y1={t * h} x2={w} y2={t * h} stroke="var(--border)" strokeWidth="1" />
        ))}
        <path d={makePath(pts)} stroke="var(--primary)" strokeWidth="2" strokeLinecap="round" />
        {pts.map(([x, y], i) => (
          <circle key={i} cx={x} cy={y} r="4" fill="var(--card)" stroke="var(--primary)" strokeWidth="2" />
        ))}
        {labels.map((lbl, i) => {
          const x = (i / (labels.length - 1)) * w;
          return <text key={i} x={x} y={h + 18} textAnchor="middle" fontSize="11" fill="var(--muted-foreground)">{lbl}</text>;
        })}
      </svg>
    </div>
  );
}

function BarChart({ vals }: { vals: number[] }) {
  const max = Math.max(...vals);
  const bw = 18, gap = 5, h = 60;
  const tw = vals.length * (bw + gap) - gap;
  return (
    <svg viewBox={`0 0 ${tw} ${h}`} width="100%" fill="none">
      {vals.map((v, i) => {
        const bh = (v / max) * h;
        return (
          <rect key={i} x={i * (bw + gap)} y={h - bh} width={bw} height={bh} rx="3"
            fill={i >= 4 ? "var(--primary)" : "var(--muted)"}
            opacity={i >= 4 ? 1 : 0.55} />
        );
      })}
    </svg>
  );
}

// ─── Calendar ─────────────────────────────────────────────────────────────────
const WEEKS = [
  [1, 2, 3, 4, 5, 6, 7],
  [8, 9, 10, 11, 12, 13, 14],
  [15, 16, 17, 18, 19, 20, 21],
  [22, 23, 24, 25, 26, 27, 28],
  [29, 30, 0, 0, 0, 0, 0],
];

function Calendar({ sel, setSel }: { sel: number; setSel: (d: number) => void }) {
  return (
    <Card className="p-4">
      <div className="flex items-center justify-between mb-2">
        <button className="p-1 rounded hover:bg-muted text-muted-foreground hover:text-foreground transition-colors">
          <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
            <path d="M10 12L6 8l4-4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </button>
        <span className="text-sm font-semibold">June 2025</span>
        <button className="p-1 rounded hover:bg-muted text-muted-foreground hover:text-foreground transition-colors">
          <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
            <path d="M6 4l4 4-4 4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </button>
      </div>
      <div className="grid grid-cols-7 mb-1">
        {["Su","Mo","Tu","We","Th","Fr","Sa"].map(d => (
          <div key={d} className="text-center text-xs text-muted-foreground py-1 font-medium">{d}</div>
        ))}
      </div>
      {WEEKS.map((wk, wi) => (
        <div key={wi} className="grid grid-cols-7">
          {wk.map((day, di) =>
            day === 0 ? <div key={di} /> : (
              <button key={di} onClick={() => setSel(day)}
                className="aspect-square flex items-center justify-center text-sm rounded-full transition-colors hover:bg-muted"
                style={{
                  background: sel === day ? "var(--primary)" : "transparent",
                  color: sel === day ? "var(--primary-foreground)" : "var(--foreground)",
                  fontWeight: sel === day ? 600 : 400,
                }}>
                {day}
              </button>
            )
          )}
        </div>
      ))}
    </Card>
  );
}

// ─── Data ─────────────────────────────────────────────────────────────────────
const revPts: [number, number][] = [[0,42],[28,38],[56,44],[84,36],[112,40],[140,32],[168,26],[196,20],[220,14]];
const subPts: [number, number][] = [[0,68],[35,60],[70,72],[100,55],[130,30],[160,48],[190,55],[220,50]];
const exPts:  [number, number][] = [[0,70],[77,88],[154,26],[231,52],[308,65],[385,60],[462,66]];
const exLbls = ["Mon","Tue","Wed","Thu","Fri","Sat","Sun"];
const barVals = [42,55,38,62,80,75,50];

const PAYMENTS = [
  { status:"Success",    email:"ken99@example.com",       amount:"$316.00" },
  { status:"Success",    email:"abe45@example.com",        amount:"$242.00" },
  { status:"Processing", email:"monserrat44@example.com",  amount:"$837.00" },
  { status:"Failed",     email:"carmella@example.com",     amount:"$721.00" },
  { status:"Pending",    email:"jason78@example.com",      amount:"$450.00" },
  { status:"Success",    email:"sarah23@example.com",      amount:"$1,280.00" },
];

const STATUS_COLOR: Record<string, string> = {
  Success:    "oklch(0.60 0.15 145)",
  Processing: "oklch(0.60 0.15 255)",
  Failed:     "var(--destructive)",
  Pending:    "oklch(0.65 0.14 60)",
};

const CHAT = [
  { from:"agent", text:"Hi, how can I help you today?" },
  { from:"user",  text:"Hey, I'm having trouble with my account." },
  { from:"agent", text:"What seems to be the problem?" },
  { from:"user",  text:"I can't log in." },
];

const TABS = ["Dashboard"];

// ─── Page ─────────────────────────────────────────────────────────────────────
export default function Home() {
  const [tab,      setTab]      = useState("Cards");
  const [selDay,   setSelDay]   = useState(13);
  const [kcal,     setKcal]     = useState(350);
  const [plan,     setPlan]     = useState("starter");
  const [strict,   setStrict]   = useState(true);
  const [func,     setFunc]     = useState(false);
  const [terms,    setTerms]    = useState(false);
  const [emails,   setEmails]   = useState(true);
  const [msg,      setMsg]      = useState("");
  const [modal,    setModal]    = useState(false);
  const [copied,   setCopied]   = useState(false);
  const [name,     setName]     = useState("");
  const [email,    setEmail]    = useState("");
  const [cardN,    setCardN]    = useState("");
  const [cardE,    setCardE]    = useState("");
  const [cardC,    setCardC]    = useState("");
  const [notes,    setNotes]    = useState("");
  const [cEmail,   setCEmail]   = useState("");
  const [cPass,    setCPass]    = useState("");
  const [rArea,    setRArea]    = useState("Billing");
  const [rSev,     setRSev]     = useState("Severity 2");
  const [rSubj,    setRSubj]    = useState("");
  const [rDesc,    setRDesc]    = useState("");

  const copy = () => { setCopied(true); setTimeout(() => setCopied(false), 2000); };

  return (
    <div className="min-h-screen bg-background text-foreground font-sans">

      {/* ── Navbar ─────────────────────────────────────────────────────────── */}
      <nav className="sticky top-0 z-40 border-b border-border bg-background/90 backdrop-blur-sm">
        <div className="flex items-center gap-0.5 px-3 h-12">
          
          
          <div className="flex-1" />
          <div className="flex items-center gap-2 mr-1">
            <span className="text-sm text-muted-foreground hidden sm:block">Theme</span>
          </div>
          <ThemeSwitcher size="large" />
        </div>
      </nav>

      {/* ── 3-column grid ──────────────────────────────────────────────────── */}
      <div className="grid grid-cols-[1fr_1fr_1.55fr] gap-3 p-3 max-w-[1150px] mx-auto">

        {/* ══ LEFT COLUMN ═══════════════════════════════════════════════════ */}
        <div className="space-y-3">

          {/* Total Revenue */}
          <Card className="p-4">
            <p className="text-xs text-muted-foreground">Total Revenue</p>
            <p className="text-3xl font-bold my-1">$15,231.89</p>
            <p className="text-xs text-muted-foreground mb-3">+20.1% from last month</p>
            <Sparkline pts={revPts} h={48} />
          </Card>

          {/* Upgrade Subscription */}
          <Card className="p-4">
            <h3 className="font-semibold">Upgrade your subscription</h3>
            <p className="text-xs text-muted-foreground mt-1 mb-4">
              You are currently on the free plan. Upgrade to the pro plan to get access to all features.
            </p>

            <div className="grid grid-cols-2 gap-2 mb-3">
              <div>
                <label className="text-xs text-muted-foreground mb-1 block">Name</label>
                <Inp placeholder="Evil Rabbit" value={name} onChange={e => setName(e.target.value)} />
              </div>
              <div>
                <label className="text-xs text-muted-foreground mb-1 block">Email</label>
                <Inp placeholder="example@acme.com" value={email} onChange={e => setEmail(e.target.value)} />
              </div>
            </div>

            <div className="mb-3">
              <label className="text-xs text-muted-foreground mb-1 block">Card Number</label>
              <div className="grid grid-cols-[1fr_68px_54px] gap-1.5">
                <Inp placeholder="1234 1234 1234 1234" value={cardN} onChange={e => setCardN(e.target.value)} />
                <Inp placeholder="MM/YY" value={cardE} onChange={e => setCardE(e.target.value)} />
                <Inp placeholder="CVC" value={cardC} onChange={e => setCardC(e.target.value)} />
              </div>
            </div>

            <div className="mb-3">
              <label className="text-xs text-muted-foreground mb-1 block">Plan</label>
              <p className="text-xs text-muted-foreground mb-2">Select the plan that best fits your needs.</p>
              <div className="grid grid-cols-2 gap-2">
                {[
                  { id:"starter", title:"Starter Plan", desc:"Perfect for\nsmall businesses." },
                  { id:"pro",     title:"Pro Plan",     desc:"More features\nand storage." },
                ].map(p => (
                  <button key={p.id} onClick={() => setPlan(p.id)}
                    className="text-left p-3 rounded-lg border transition-colors"
                    style={{
                      borderColor: plan === p.id ? "var(--primary)" : "var(--border)",
                      background: plan === p.id ? "color-mix(in oklch,var(--primary) 12%,var(--background))" : "transparent",
                    }}>
                    <div className="flex items-center gap-2 mb-1">
                      <div className="w-3 h-3 rounded-full border-2 flex items-center justify-center shrink-0"
                        style={{ borderColor: plan === p.id ? "var(--primary)" : "var(--muted-foreground)" }}>
                        {plan === p.id && <div className="w-1.5 h-1.5 rounded-full" style={{ background:"var(--primary)" }} />}
                      </div>
                      <span className="text-xs font-semibold leading-tight">{p.title}</span>
                    </div>
                    <p className="text-xs text-muted-foreground pl-5 whitespace-pre-line leading-snug">{p.desc}</p>
                  </button>
                ))}
              </div>
            </div>

            <div className="mb-3">
              <label className="text-xs text-muted-foreground mb-1 block">Notes</label>
              <textarea value={notes} onChange={e => setNotes(e.target.value)} placeholder="Enter notes" rows={3}
                className="w-full bg-background border border-input rounded-lg px-3 py-2 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring/50 resize-y" />
            </div>

            <div className="space-y-2 mb-4">
              <Checkbox on={terms}  setOn={() => setTerms(!terms)}   label="I agree to the terms and conditions" />
              <Checkbox on={emails} setOn={() => setEmails(!emails)} label="Allow us to send you emails" />
            </div>

            <div className="flex gap-2">
              <button className="flex-1 py-2 rounded-lg border border-border text-sm hover:bg-muted transition-colors">
                Cancel
              </button>
              <button className="flex-1 py-2 rounded-lg text-sm font-semibold transition-colors"
                style={{ background:"var(--primary)", color:"var(--primary-foreground)" }}>
                Upgrade Plan
              </button>
            </div>
          </Card>

          {/* Team Members */}
          <Card className="p-4">
            <h3 className="font-semibold">Team Members</h3>
            <p className="text-xs text-muted-foreground mt-1 mb-4">Invite your team members to collaborate.</p>
            <div className="space-y-3">
              {[
                { i:"S", name:"Sofia Davis",     mail:"m@example.com", role:"Owner" },
                { i:"J", name:"Jackson Lee",     mail:"p@example.com", role:"Developer" },
                { i:"I", name:"Isabella Nguyen", mail:"i@example.com", role:"Billing" },
              ].map(m => (
                <div key={m.name} className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-full flex items-center justify-center text-sm font-semibold shrink-0 bg-muted">{m.i}</div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium truncate">{m.name}</p>
                    <p className="text-xs text-muted-foreground truncate">{m.mail}</p>
                  </div>
                  <select className="bg-background border border-input rounded-md px-2 py-1 text-xs focus:outline-none">
                    <option>{m.role}</option>
                    <option>Owner</option><option>Developer</option><option>Billing</option>
                  </select>
                </div>
              ))}
            </div>
          </Card>

          {/* Cookie Settings */}
          <Card className="p-4">
            <h3 className="font-semibold">Cookie Settings</h3>
            <p className="text-xs text-muted-foreground mt-1 mb-4">Manage your cookie settings here.</p>
            <div className="space-y-4">
              <div className="flex items-start justify-between gap-3">
                <div>
                  <p className="text-sm font-medium">Strictly Necessary</p>
                  <p className="text-xs text-muted-foreground mt-0.5">These cookies are essential in order to use the website and use its features.</p>
                </div>
                <Toggle on={strict} setOn={() => setStrict(!strict)} />
              </div>
              <div className="flex items-start justify-between gap-3">
                <div>
                  <p className="text-sm font-medium">Functional Cookies</p>
                  <p className="text-xs text-muted-foreground mt-0.5">These cookies allow the website to provide personalized functionality.</p>
                </div>
                <Toggle on={func} setOn={() => setFunc(!func)} />
              </div>
            </div>
            <button className="mt-4 w-full py-2 rounded-lg border border-border text-sm hover:bg-muted transition-colors">
              Save preferences
            </button>
          </Card>

          {/* Date picker display */}
          <Card className="p-4">
            <h3 className="font-semibold">Date picker with range</h3>
            <p className="text-xs text-muted-foreground mt-1 mb-3">Select a date range.</p>
            <div className="flex items-center gap-2 px-3 py-2 rounded-lg border border-border text-sm text-muted-foreground">
              <svg width="14" height="14" viewBox="0 0 16 16" fill="none">
                <rect x="2" y="3" width="12" height="11" rx="1.5" stroke="currentColor" strokeWidth="1.5"/>
                <path d="M5 1v3M11 1v3M2 7h12" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
              </svg>
              Jan 20, 2022 – Feb 09, 2022
            </div>
          </Card>
        </div>

        {/* ══ MIDDLE COLUMN ═════════════════════════════════════════════════ */}
        <div className="space-y-3">

          {/* Subscriptions */}
          <Card className="p-4">
            <p className="text-xs text-muted-foreground">Subscriptions</p>
            <p className="text-3xl font-bold my-1">+2,350</p>
            <p className="text-xs text-muted-foreground mb-3">+180.1% from last month</p>
            <AreaChart pts={subPts} h={80} />
          </Card>

          {/* Create account */}
          <Card className="p-4">
            <h3 className="text-xl font-bold">Create an account</h3>
            <p className="text-xs text-muted-foreground mt-1 mb-4">Enter your email below to create your account</p>
            <div className="grid grid-cols-2 gap-2 mb-4">
              <button className="flex items-center justify-center gap-2 py-2 rounded-lg border border-border text-sm hover:bg-muted transition-colors">
                <svg width="15" height="15" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M12 2C6.48 2 2 6.48 2 12c0 4.42 2.87 8.17 6.84 9.49.5.09.68-.22.68-.48v-1.7c-2.78.6-3.37-1.34-3.37-1.34-.46-1.16-1.11-1.47-1.11-1.47-.91-.62.07-.61.07-.61 1 .07 1.53 1.03 1.53 1.03.89 1.52 2.34 1.08 2.91.83.09-.65.35-1.09.63-1.34-2.22-.25-4.56-1.11-4.56-4.94 0-1.09.39-1.98 1.03-2.68-.1-.25-.45-1.27.1-2.64 0 0 .84-.27 2.75 1.02A9.58 9.58 0 0 1 12 6.84c.85 0 1.71.11 2.5.33 1.91-1.29 2.75-1.02 2.75-1.02.55 1.37.2 2.39.1 2.64.64.7 1.03 1.59 1.03 2.68 0 3.84-2.34 4.68-4.57 4.93.36.31.68.92.68 1.85v2.74c0 .27.18.58.69.48C19.13 20.16 22 16.42 22 12c0-5.52-4.48-10-10-10z" />
                </svg>
                GitHub
              </button>
              <button className="flex items-center justify-center gap-2 py-2 rounded-lg border border-border text-sm hover:bg-muted transition-colors">
                <svg width="15" height="15" viewBox="0 0 24 24">
                  <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                  <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                  <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l3.66-2.84z"/>
                  <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
                </svg>
                Google
              </button>
            </div>
            <div className="relative my-3">
              <div className="absolute inset-0 flex items-center"><div className="w-full border-t border-border" /></div>
              <div className="relative flex justify-center">
                <span className="bg-card px-3 text-xs text-muted-foreground uppercase tracking-wider">OR CONTINUE WITH</span>
              </div>
            </div>
            <div className="space-y-3 mb-4">
              <div>
                <label className="text-sm mb-1 block">Email</label>
                <Inp placeholder="m@example.com" value={cEmail} onChange={e => setCEmail(e.target.value)} />
              </div>
              <div>
                <label className="text-sm mb-1 block">Password</label>
                <Inp type="password" value={cPass} onChange={e => setCPass(e.target.value)} />
              </div>
            </div>
            <button className="w-full py-2.5 rounded-lg text-sm font-semibold transition-colors"
              style={{ background:"var(--primary)", color:"var(--primary-foreground)" }}>
              Create account
            </button>
          </Card>

          {/* Chat widget */}
          <Card className="overflow-hidden">
            <div className="flex items-center justify-between px-4 py-3 border-b border-border">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-full bg-muted flex items-center justify-center text-sm font-semibold">S</div>
                <div>
                  <p className="text-sm font-medium leading-tight">Sofia Davis</p>
                  <p className="text-xs text-muted-foreground">m@example.com</p>
                </div>
              </div>
              <button className="w-6 h-6 rounded-full border border-border flex items-center justify-center text-muted-foreground hover:text-foreground">
                <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
                  <path d="M6 1v10M1 6h10" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
                </svg>
              </button>
            </div>
            <div className="p-4 space-y-3">
              {CHAT.map((m, i) => (
                <div key={i} className={`flex ${m.from==="user" ? "justify-end" : "justify-start"}`}>
                  <div className="max-w-[85%] px-3 py-2 rounded-xl text-sm leading-snug"
                    style={{
                      background: m.from==="user" ? "var(--primary)" : "var(--muted)",
                      color:      m.from==="user" ? "var(--primary-foreground)" : "var(--foreground)",
                    }}>
                    {m.text}
                  </div>
                </div>
              ))}
            </div>
            <div className="px-4 pb-4 flex items-center gap-2">
              <input value={msg} onChange={e => setMsg(e.target.value)} placeholder="Type your message..."
                className="flex-1 bg-background border border-input rounded-lg px-3 py-2 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring/50"
                onKeyDown={e => { if (e.key==="Enter") setMsg(""); }} />
              <button onClick={() => setMsg("")}
                className="w-8 h-8 rounded-full flex items-center justify-center shrink-0"
                style={{ background:"var(--primary)" }}>
                <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
                  <path d="M7 11V3M3 7l4-4 4 4" stroke="var(--primary-foreground)" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              </button>
            </div>
          </Card>

          {/* tweakcn repo card */}
          <Card className="p-4">
            <div className="flex items-start justify-between mb-2">
              <div className="flex items-center gap-2">
                <svg viewBox="0 0 256 256" width="20" height="20" className="text-foreground shrink-0">
                  <path fill="none" d="M0 0h256v256H0z"/>
                  <path stroke="currentColor" strokeLinecap="round" strokeWidth="24" d="m208 128-.2.2M168.2 167.8 128 208M192 40l-76.2 76.2M76.2 155.8 40 192"/>
                  <circle cx="188" cy="148" r="24" fill="none" stroke="currentColor" strokeWidth="24"/>
                  <circle cx="96" cy="136" r="24" fill="none" stroke="currentColor" strokeWidth="24"/>
                </svg>
                <span className="font-semibold text-sm">tweakcn</span>
              </div>
              <button className="flex items-center gap-1.5 px-3 py-1 rounded-md border border-border text-xs hover:bg-muted transition-colors">
                <svg width="12" height="12" viewBox="0 0 16 16" fill="none">
                  <path d="M8 1l2 4 4.5.65-3.25 3.17.77 4.48L8 11.1l-4.02 2.2.77-4.48L1.5 5.65 6 5z" stroke="currentColor" strokeWidth="1.3" fill="none" strokeLinejoin="round"/>
                </svg>
                Star
              </button>
            </div>
            <p className="text-xs text-muted-foreground mb-3 leading-relaxed">
              A visual editor for shadcn/ui components with beautiful themes. Accessible. Customizable. Open Source.
            </p>
            <div className="flex items-center gap-4 text-xs text-muted-foreground">
              <span className="flex items-center gap-1.5">
                <span className="w-2.5 h-2.5 rounded-full inline-block" style={{ background:"#3178c6" }} />
                TypeScript
              </span>
              <span className="flex items-center gap-1">
                <svg width="11" height="11" viewBox="0 0 16 16" fill="none">
                  <path d="M8 1l2 4 4.5.65-3.25 3.17.77 4.48L8 11.1l-4.02 2.2.77-4.48L1.5 5.65 6 5z" stroke="currentColor" strokeWidth="1.3" fill="none" strokeLinejoin="round"/>
                </svg>
                20k
              </span>
              <span>Updated April 2023</span>
            </div>
          </Card>

          {/* Date picker with range */}
          <Card className="p-4">
            <h3 className="font-semibold">Date picker with range</h3>
            <p className="text-xs text-muted-foreground mt-1 mb-3">Select a date range.</p>
            <div className="flex items-center gap-2 px-3 py-2 rounded-lg border border-border text-sm text-muted-foreground">
              <svg width="14" height="14" viewBox="0 0 16 16" fill="none">
                <rect x="2" y="3" width="12" height="11" rx="1.5" stroke="currentColor" strokeWidth="1.5"/>
                <path d="M5 1v3M11 1v3M2 7h12" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
              </svg>
              Jan 20, 2022 – Feb 09, 2022
            </div>
          </Card>

          {/* Report an issue */}
          <Card className="p-4">
            <h3 className="font-semibold">Report an issue</h3>
            <p className="text-xs text-muted-foreground mt-1 mb-3">What area are you having problems with?</p>
            <button onClick={() => setModal(true)}
              className="px-4 py-2 rounded-lg border border-border text-sm hover:bg-muted transition-colors">
              Open report form
            </button>
          </Card>
        </div>

        {/* ══ RIGHT COLUMN ══════════════════════════════════════════════════ */}
        <div className="space-y-3">

          {/* Calendar */}
          <Calendar sel={selDay} setSel={setSelDay} />

          {/* Move Goal */}
          <Card className="p-4">
            <h3 className="font-semibold">Move Goal</h3>
            <p className="text-xs text-muted-foreground mt-1 mb-4">Set your daily activity goal.</p>
            <div className="flex items-center justify-center gap-8 mb-4">
              <button onClick={() => setKcal(c => Math.max(50, c - 10))}
                className="w-8 h-8 rounded-full border border-border flex items-center justify-center hover:bg-muted transition-colors">
                <svg width="12" height="2" viewBox="0 0 12 2" fill="none">
                  <path d="M1 1h10" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
                </svg>
              </button>
              <div className="text-center">
                <p className="text-5xl font-bold leading-none">{kcal}</p>
                <p className="text-[10px] text-muted-foreground uppercase tracking-widest mt-1">CALORIES/DAY</p>
              </div>
              <button onClick={() => setKcal(c => c + 10)}
                className="w-8 h-8 rounded-full border border-border flex items-center justify-center hover:bg-muted transition-colors">
                <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
                  <path d="M1 6h10M6 1v10" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
                </svg>
              </button>
            </div>
            <BarChart vals={barVals} />
            <button className="mt-4 w-full py-2 rounded-lg border border-border text-sm hover:bg-muted transition-colors">
              Set Goal
            </button>
          </Card>

          {/* Exercise Minutes */}
          <Card className="p-4">
            <h3 className="font-semibold">Exercise Minutes</h3>
            <p className="text-xs text-muted-foreground mt-1 mb-4">
              Your exercise minutes are ahead of where you normally are.
            </p>
            <LineChart pts={exPts} labels={exLbls} w={460} h={110} />
          </Card>

          {/* Payments */}
          <Card className="overflow-hidden">
            <div className="px-4 pt-4 pb-3">
              <h3 className="font-semibold">Payments</h3>
              <p className="text-xs text-muted-foreground mt-0.5">Manage your payments.</p>
            </div>
            <table className="w-full">
              <thead>
                <tr className="border-t border-b border-border">
                  <th className="text-left px-4 py-2.5 text-xs font-medium text-muted-foreground">Status</th>
                  <th className="text-left px-4 py-2.5 text-xs font-medium text-muted-foreground">Email</th>
                  <th className="text-right px-4 py-2.5 text-xs font-medium text-muted-foreground">Amount</th>
                  <th className="px-4 py-2.5 w-8" />
                </tr>
              </thead>
              <tbody>
                {PAYMENTS.map((p, i) => (
                  <tr key={i} className="border-b border-border last:border-0 hover:bg-muted/30 transition-colors">
                    <td className="px-4 py-3">
                      <span className="text-sm" style={{ color: STATUS_COLOR[p.status] }}>{p.status}</span>
                    </td>
                    <td className="px-4 py-3 text-sm text-muted-foreground">{p.email}</td>
                    <td className="px-4 py-3 text-sm text-right">{p.amount}</td>
                    <td className="px-4 py-3 text-muted-foreground text-center text-xs">···</td>
                  </tr>
                ))}
              </tbody>
            </table>
            <div className="px-4 py-3 border-t border-border flex items-center justify-between">
              <span className="text-xs text-muted-foreground">0 of 6 row(s) selected.</span>
              <div className="flex gap-2">
                <button className="px-3 py-1 rounded border border-border text-xs hover:bg-muted transition-colors">Previous</button>
                <button className="px-3 py-1 rounded border border-border text-xs hover:bg-muted transition-colors">Next</button>
              </div>
            </div>
          </Card>

          {/* Share document */}
          <Card className="p-4">
            <h3 className="font-semibold">Share this document</h3>
            <p className="text-xs text-muted-foreground mt-1 mb-4">Anyone with the link can view this document.</p>
            <div className="flex gap-2 mb-4">
              <Inp readOnly value="http://example.com/link/to/document" onChange={() => {}} className="text-muted-foreground" />
              <button onClick={copy}
                className="shrink-0 px-3 py-2 rounded-lg border border-border text-sm hover:bg-muted transition-colors whitespace-nowrap">
                {copied ? "Copied!" : "Copy Link"}
              </button>
            </div>
            <p className="text-sm font-medium mb-3">People with access</p>
            <div className="space-y-3">
              {[
                { i:"O", name:"Olivia Martin",   mail:"m@example.com" },
                { i:"I", name:"Isabella Nguyen", mail:"b@example.com" },
                { i:"S", name:"Sofia Davis",     mail:"p@example.com" },
                { i:"E", name:"Ethan Thompson",  mail:"e@example.com" },
              ].map(p => (
                <div key={p.name} className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-full bg-muted flex items-center justify-center text-sm font-semibold shrink-0">{p.i}</div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium truncate">{p.name}</p>
                    <p className="text-xs text-muted-foreground truncate">{p.mail}</p>
                  </div>
                  <select className="bg-background border border-input rounded-md px-2 py-1 text-xs focus:outline-none">
                    <option>Can edit</option><option>Can view</option>
                  </select>
                </div>
              ))}
            </div>
          </Card>
        </div>
      </div>

      {/* ── Report Issue Modal ──────────────────────────────────────────────── */}
      {modal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4"
          style={{ background:"rgba(0,0,0,0.55)" }}
          onClick={e => { if (e.target === e.currentTarget) setModal(false); }}>
          <div className="bg-card border border-border rounded-xl p-6 w-full max-w-md shadow-2xl">
            <div className="flex items-center justify-between mb-1">
              <h3 className="font-semibold text-lg">Report an issue</h3>
              <button onClick={() => setModal(false)}
                className="w-7 h-7 flex items-center justify-center rounded-md text-muted-foreground hover:text-foreground hover:bg-muted transition-colors">
                <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
                  <path d="M1 1l12 12M13 1L1 13" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
                </svg>
              </button>
            </div>
            <p className="text-sm text-muted-foreground mb-5">What area are you having problems with?</p>
            <div className="grid grid-cols-2 gap-3 mb-4">
              <div>
                <label className="text-sm font-medium mb-1.5 block">Area</label>
                <Sel value={rArea} onChange={setRArea} opts={["Billing","Technical","Account","Other"]} />
              </div>
              <div>
                <label className="text-sm font-medium mb-1.5 block">Security Level</label>
                <Sel value={rSev} onChange={setRSev} opts={["Severity 1","Severity 2","Severity 3"]} />
              </div>
            </div>
            <div className="mb-4">
              <label className="text-sm font-medium mb-1.5 block">Subject</label>
              <Inp placeholder="I need help with..." value={rSubj} onChange={e => setRSubj(e.target.value)} />
            </div>
            <div className="mb-5">
              <label className="text-sm font-medium mb-1.5 block">Description</label>
              <textarea value={rDesc} onChange={e => setRDesc(e.target.value)} rows={4}
                placeholder="Please include all information relevant to your issue."
                className="w-full bg-background border border-input rounded-lg px-3 py-2 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring/50 resize-none"/>
            </div>
            <div className="flex gap-3">
              <button onClick={() => setModal(false)}
                className="flex-1 py-2 rounded-lg border border-border text-sm hover:bg-muted transition-colors">
                Cancel
              </button>
              <button onClick={() => setModal(false)}
                className="flex-1 py-2 rounded-lg text-sm font-semibold transition-colors"
                style={{ background:"var(--primary)", color:"var(--primary-foreground)" }}>
                Submit
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
