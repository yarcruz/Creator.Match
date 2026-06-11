import { useState, useEffect } from 'react';
import { Logo, Button, Avatar } from './components/ui.jsx';
import {
  TweaksPanel, TweakSection, TweakToggle, TweakRadio, TweakSelect, TweakText, TweakColor, TweakButton,
  useTweaks,
} from './components/TweaksPanel.jsx';
import { CREATORS, EVENTS, PROPOSALS, AGREEMENTS, REVIEWS, CATEGORIES, catLabel } from './data.js';
import { Landing } from './screens/Landing.jsx';
import { Explore, CreatorProfile } from './screens/Explore.jsx';
import { EventsExplore, EventDetail, ProposalModal } from './screens/Events.jsx';
import { CreatorFlow } from './screens/Creator.jsx';
import { EventFlow } from './screens/Event.jsx';
import { Dashboard } from './screens/Dashboard.jsx';
import { Pricing } from './screens/Pricing.jsx';

const MONETIZATION_ENABLED = false;

const TWEAK_DEFAULTS = {
  brandName: "CreatorMatch",
  premium: false,
  theme: "behance",
  accent: "azul",
  dark: false,
  heroLayout: "split",
  cardStyle: "image",
  navStyle: "top",
  density: "regular",
};

const ACCENTS = {
  azul:      { h: 264, c: 0.22, l: 0.52 },
  aqua:      { h: 215, c: 0.13, l: 0.66, grad: ["#06b6d4", "#3b82f6"] },
  esmeralda: { h: 162, c: 0.17, l: 0.62 },
  violeta:   { h: 292, c: 0.17, l: 0.58 },
};

const DENSITY = {
  compact: { gap: "16px", pad: "20px", maxw: "1120px" },
  regular: { gap: "24px", pad: "28px", maxw: "1200px" },
  comfy:   { gap: "32px", pad: "34px", maxw: "1280px" },
};

const NAV_BASE = [
  ["explore",   "Explorar creadores"],
  ["events",    "Explorar eventos"],
  ["dashboard", "Panel"],
];
function navItems(monetize) {
  return monetize ? [...NAV_BASE.slice(0, 2), ["pricing", "Planes"], NAV_BASE[2]] : NAV_BASE;
}

// ─── localStorage helpers ─────────────────────────────────────────────────────
const LS_C = "cc_my_creators";
const LS_E = "cc_my_events";
const LS_P = "cc_my_proposals";
const LS_A = "cc_agreements";
const LS_R = "cc_reviews";
function loadLS(k) { try { return JSON.parse(localStorage.getItem(k) || "[]"); } catch { return []; } }
function loadLSObj(k) { try { return JSON.parse(localStorage.getItem(k) || "{}"); } catch { return {}; } }
function saveLS(k, v) { try { localStorage.setItem(k, JSON.stringify(v)); } catch {} }

// Hydrate runtime state from localStorage once.
(function hydrate() {
  const sc = loadLS(LS_C);
  for (let i = sc.length - 1; i >= 0; i--) if (!CREATORS.some(x => x.id === sc[i].id)) CREATORS.unshift(sc[i]);
  const se = loadLS(LS_E);
  for (let i = se.length - 1; i >= 0; i--) if (!EVENTS.some(x => x.id === se[i].id)) EVENTS.unshift(se[i]);
  const sp = loadLS(LS_P);
  for (let i = sp.length - 1; i >= 0; i--) if (!PROPOSALS.some(x => x.id === sp[i].id)) PROPOSALS.unshift(sp[i]);
  const sa = loadLSObj(LS_A);
  Object.assign(AGREEMENTS, sa);
  const sr = loadLS(LS_R);
  sr.forEach(r => { if (!REVIEWS.some(x => x.id === r.id)) REVIEWS.push(r); });
})();

function buildCreator(d) {
  return {
    id: "u" + Date.now(),
    name: d.name || "Nuevo creador",
    handle: "@" + (d.name || "creador").toLowerCase().replace(/[^a-z0-9]+/g, ""),
    role: d.types && d.types.length ? catLabel(d.types[0]) : "Creador de contenido",
    city: d.city,
    rate: d.payPref === "sinpago" ? "Colaboraciones" : (d.rate ? `Desde ${d.rate} / ${d.rateUnit}` : "A convenir"),
    rating: 5.0, reviews: 0, jobs: 0,
    formats: d.types && d.types.length ? d.types : ["cobertura"],
    modes: d.modes && d.modes.length ? d.modes : ["colab"],
    tier: d.tier || "sencilla",
    payPref: d.payPref || "todos",
    eventTypes: d.eventTypes || [],
    gear: (d.gear || "").split(/[,\n]/).map(s => s.trim()).filter(Boolean),
    tags: d.tags || [],
    photo: d.photo || "",
    projects: d.projects || [],
    available: (d.avail || "").startsWith("Esta") ? "Disponible esta semana" : (d.avail || "Agenda abierta"),
    bio: d.bio || d.message || "Nuevo creador en la plataforma.",
    accent: 264, response: "Nuevo aquí", verified: false, top: false, mine: true,
  };
}

function buildEvent(d) {
  const paid = d.payType && d.payType.includes("pago");
  return {
    id: "ue" + Date.now(),
    title: d.title || "Evento sin título",
    org: d.producer || "Productor",
    type: d.type, city: d.city,
    date: d.date || "Por definir",
    budget: paid ? (d.amount || "A convenir") : "Sin pago",
    needs: d.needs && d.needs.length ? d.needs : ["cobertura"],
    mode: d.mode || "colab",
    posted: "recién", applicants: 0,
    brief: d.message || "",
    payType: d.payType || [], time: d.time, location: d.location, mine: true,
  };
}

// ─── ChooserModal ─────────────────────────────────────────────────────────────
function ChooserModal({ onClose, go, title, subtitle, options, footer }) {
  const pick = (screen) => { onClose(); go(screen); };
  return (
    <div onClick={onClose} style={{ position: "fixed", inset: 0, zIndex: 200, background: "oklch(0.2 0.01 75 / 0.45)",
      backdropFilter: "blur(4px)", display: "grid", placeItems: "center", padding: 20 }}>
      <div onClick={e => e.stopPropagation()} className="fade-in"
        style={{ background: "var(--panel)", borderRadius: "var(--r-xl)", boxShadow: "var(--shadow-lg)",
          width: "min(460px, 100%)", padding: "clamp(28px,4vw,40px)", position: "relative" }}>
        <button onClick={onClose} aria-label="Cerrar"
          style={{ position: "absolute", top: 18, right: 20, fontSize: 22, color: "var(--ink-faint)", lineHeight: 1 }}>×</button>
        <div style={{ textAlign: "center", marginBottom: 26 }}>
          <h2 className="display" style={{ fontSize: 30 }}>{title}</h2>
          <p style={{ color: "var(--ink-soft)", marginTop: 8, fontSize: 14.5 }}>{subtitle}</p>
        </div>
        <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
          {options.map((o, i) => (
            <button key={i} onClick={() => pick(o.screen)}
              style={{ display: "flex", alignItems: "center", gap: 16, padding: "18px 20px", borderRadius: "var(--r-lg)",
                border: "1px solid var(--line)", background: "var(--canvas)", textAlign: "left" }}
              onMouseEnter={e => { e.currentTarget.style.borderColor = "var(--accent)"; e.currentTarget.style.background = "var(--accent-wash)"; }}
              onMouseLeave={e => { e.currentTarget.style.borderColor = "var(--line)"; e.currentTarget.style.background = "var(--canvas)"; }}>
              <span style={{ width: 46, height: 46, borderRadius: 13, flexShrink: 0, display: "grid", placeItems: "center",
                background: o.dark ? "var(--ink)" : "var(--accent)", color: o.dark ? "var(--canvas)" : "var(--on-accent)", fontSize: 20 }}>{o.icon}</span>
              <span style={{ flex: 1 }}>
                <div style={{ fontWeight: 700, fontSize: 16 }}>{o.label}</div>
                <div style={{ fontSize: 13, color: "var(--ink-faint)", marginTop: 2 }}>{o.desc}</div>
              </span>
              <span style={{ color: "var(--ink-faint)" }}>→</span>
            </button>
          ))}
        </div>
        {footer && (
          <div style={{ textAlign: "center", marginTop: 22, fontSize: 13, color: "var(--ink-faint)" }}>
            {footer.text}{" "}
            <button onClick={() => pick(footer.screen)} style={{ color: "var(--accent)", fontWeight: 600 }}>{footer.action}</button>
          </div>
        )}
      </div>
    </div>
  );
}

const ROLE_OPTIONS = [
  { screen: "creator", icon: "◎", label: "Soy creador", desc: "Cubro eventos y publico contenido." },
  { screen: "event",   icon: "◈", dark: true, label: "Soy promotor / productor", desc: "Publico eventos y busco creadores." },
];
const PUBLISH_OPTIONS = [
  { screen: "event",   icon: "◈", dark: true, label: "Publicar un evento", desc: "Publica tu evento y recibe propuestas de creadores." },
  { screen: "creator", icon: "◎", label: "Publicar anuncio como creador", desc: "Crea tu perfil para que los productores te encuentren." },
];

// ─── Navigation ──────────────────────────────────────────────────────────────
function TopNav({ route, go, brand, monetize, onLogin, onPublish }) {
  const prominent = [["explore", "Explorar creadores"], ["events", "Explorar eventos"]];
  const secondary = monetize ? [["pricing", "Planes"], ["dashboard", "Panel"]] : [["dashboard", "Panel"]];
  return (
    <header style={{ position: "sticky", top: 0, zIndex: 50 }}>
      <div style={{ background: "var(--panel)", borderBottom: "1px solid var(--line)" }}>
        <div style={{ maxWidth: "var(--maxw)", margin: "0 auto", padding: "14px clamp(20px,4vw,40px)",
          display: "flex", alignItems: "center", gap: 22 }}>
          <Logo name={brand} onClick={() => go("landing")} />
          <nav style={{ display: "flex", gap: 10, marginLeft: 8 }} className="topnav-links">
            {prominent.map(([k, lbl]) => {
              const active = route.screen === k;
              return (
                <button key={k} onClick={() => go(k)}
                  style={{ padding: "11px 20px", borderRadius: 99, fontSize: 16, fontWeight: 700, whiteSpace: "nowrap",
                    color: active ? "var(--on-accent)" : "var(--accent-ink)",
                    background: active ? "var(--accent)" : "var(--accent-wash)" }}>
                  {lbl}
                </button>
              );
            })}
          </nav>
          <div style={{ marginLeft: "auto", display: "flex", gap: 8, alignItems: "center" }}>
            <nav style={{ display: "flex", gap: 2 }} className="topnav-links">
              {secondary.map(([k, lbl]) => (
                <button key={k} onClick={() => go(k)}
                  style={{ padding: "8px 12px", borderRadius: 99, fontSize: 14, fontWeight: 600, whiteSpace: "nowrap",
                    color: route.screen === k ? "var(--accent-ink)" : "var(--ink-soft)",
                    background: route.screen === k ? "var(--accent-wash)" : "transparent" }}>
                  {lbl}
                </button>
              ))}
            </nav>
            <Button variant="link" onClick={onLogin}>Entrar</Button>
            <Button onClick={onPublish}>Publicar</Button>
          </div>
        </div>
      </div>
    </header>
  );
}

function RailNav({ route, go, brand, monetize, onLogin, onPublish }) {
  const base = [["landing", "Inicio", "◇"], ["explore", "Creadores", "◎"], ["events", "Eventos", "◈"], ["dashboard", "Panel", "▦"]];
  const items = monetize ? [...base.slice(0, 3), ["pricing", "Planes", "✦"], base[3]] : base;
  return (
    <aside className="rail" style={{ position: "sticky", top: 0, height: "100vh", width: 230, flexShrink: 0,
      borderRight: "1px solid var(--line)", background: "var(--panel)", padding: "22px 16px",
      display: "flex", flexDirection: "column", gap: 4 }}>
      <div style={{ padding: "4px 8px 22px" }}><Logo name={brand} onClick={() => go("landing")} /></div>
      {items.map(([k, lbl, ic]) => (
        <button key={k} onClick={() => go(k)}
          style={{ display: "flex", alignItems: "center", gap: 12, padding: "11px 14px", borderRadius: 12,
            textAlign: "left", fontSize: 14.5, fontWeight: 600,
            color: route.screen === k ? "var(--accent-ink)" : "var(--ink-soft)",
            background: route.screen === k ? "var(--accent-wash)" : "transparent" }}>
          <span style={{ fontSize: 16, width: 20, textAlign: "center" }}>{ic}</span>{lbl}
        </button>
      ))}
      <div style={{ marginTop: "auto" }}>
        <Button full onClick={onPublish}>＋ Publicar</Button>
        <Button full variant="ghost" style={{ marginTop: 8 }} onClick={onLogin}>Entrar</Button>
        <div style={{ display: "flex", gap: 10, alignItems: "center", marginTop: 16, padding: "8px" }}>
          <Avatar name="Atelier Norte" hue={264} size={34} />
          <div style={{ fontSize: 13, lineHeight: 1.2 }}>
            <div style={{ fontWeight: 600 }}>Atelier Norte</div>
            <div style={{ color: "var(--ink-faint)", fontSize: 12 }}>Productor</div>
          </div>
        </div>
      </div>
    </aside>
  );
}

function Footer({ go, brand }) {
  const col = { display: "flex", flexDirection: "column", gap: 11 };
  const lnk = { fontSize: 13.5, color: "var(--ink-soft)", textAlign: "left", cursor: "pointer", whiteSpace: "nowrap" };
  const head = { fontSize: 12, fontWeight: 700, letterSpacing: "0.08em", textTransform: "uppercase", color: "var(--ink-faint)", marginBottom: 3 };
  return (
    <footer style={{ borderTop: "1px solid var(--line)", marginTop: 60, background: "var(--canvas-2)" }}>
      <div style={{ maxWidth: "var(--maxw)", margin: "0 auto", padding: "52px clamp(20px,4vw,40px) 28px",
        display: "grid", gridTemplateColumns: "1.4fr 1fr 1.6fr 1fr", gap: 40 }} className="footer-grid">
        <div>
          <Logo name={brand} onClick={() => go("landing")} />
          <p style={{ fontSize: 13.5, color: "var(--ink-faint)", marginTop: 14, maxWidth: 240, lineHeight: 1.5 }}>
            La cobertura de tu evento, en las manos correctas. Hecho en Puerto Rico.
          </p>
        </div>
        <div style={col}>
          <div style={head}>Explorar</div>
          <button style={lnk} onClick={() => go("explore")}>Explorar creadores</button>
          <button style={lnk} onClick={() => go("events")}>Explorar eventos</button>
          <button style={lnk} onClick={() => go("creator")}>Ser creador</button>
          <button style={lnk} onClick={() => go("event")}>Publicar evento</button>
        </div>
        <div style={col}>
          <div style={head}>Por tipo de cobertura</div>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "11px 18px" }}>
            {CATEGORIES.map(c => (
              <button key={c.id} style={lnk} onClick={() => go("explore", c.id)}>{c.label}</button>
            ))}
          </div>
        </div>
        <div style={col}>
          <div style={head}>Plataforma</div>
          <button style={lnk} onClick={() => go("landing")}>Cómo funciona</button>
          <span style={{ ...lnk, cursor: "default" }}>Para creadores</span>
          <span style={{ ...lnk, cursor: "default" }}>Para productores</span>
          <span style={{ ...lnk, cursor: "default" }}>Soporte</span>
        </div>
      </div>
      <div style={{ maxWidth: "var(--maxw)", margin: "0 auto", padding: "22px clamp(20px,4vw,40px) 40px",
        display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: 12,
        borderTop: "1px solid var(--line)" }}>
        <span style={{ fontSize: 13, color: "var(--ink-faint)" }}>© 2026 {brand}</span>
        <span style={{ fontSize: 13, color: "var(--ink-faint)" }}>Términos · Privacidad</span>
      </div>
    </footer>
  );
}

// ─── App ──────────────────────────────────────────────────────────────────────
export default function App() {
  const [t, setTweak] = useTweaks(TWEAK_DEFAULTS);
  const [route, setRoute] = useState({ screen: "landing", param: null });
  const [, setVersion] = useState(0);
  const [showLogin, setShowLogin] = useState(false);
  const [showPublish, setShowPublish] = useState(false);
  const [proposalEvent, setProposalEvent] = useState(null);
  const [dashInit, setDashInit] = useState(null);

  const go = (screen, param = null) => {
    setRoute({ screen, param });
    window.scrollTo({ top: 0, behavior: "instant" });
  };

  const publishCreator = (d) => {
    const c = buildCreator(d);
    CREATORS.unshift(c);
    const saved = loadLS(LS_C); saved.unshift(c); saveLS(LS_C, saved);
    setVersion(v => v + 1);
    go("explore", c.id);
  };

  const publishEvent = (d) => {
    const e = buildEvent(d);
    EVENTS.unshift(e);
    const saved = loadLS(LS_E); saved.unshift(e); saveLS(LS_E, saved);
    setVersion(v => v + 1);
    go("dashboard");
  };

  const resetRecords = () => {
    saveLS(LS_C, []); saveLS(LS_E, []); saveLS(LS_P, []);
    saveLS(LS_A, {}); saveLS(LS_R, []);
    for (let i = CREATORS.length - 1; i >= 0; i--) if (CREATORS[i].mine) CREATORS.splice(i, 1);
    for (let i = EVENTS.length - 1; i >= 0; i--) if (EVENTS[i].mine) EVENTS.splice(i, 1);
    for (let i = PROPOSALS.length - 1; i >= 0; i--) if (PROPOSALS[i].mine) PROPOSALS.splice(i, 1);
    Object.keys(AGREEMENTS).forEach(k => delete AGREEMENTS[k]);
    REVIEWS.length = 0;
    setVersion(v => v + 1);
  };

  const publishProposal = (p) => {
    const prop = {
      id: "up" + Date.now(), creator: "c1", event: p.eventId,
      amount: p.amount || "A convenir", note: p.note, status: "pendiente", when: "recién", mine: true,
    };
    PROPOSALS.unshift(prop);
    const saved = loadLS(LS_P); saved.unshift(prop); saveLS(LS_P, saved);
    setProposalEvent(null);
    setVersion(v => v + 1);
    setDashInit({ role: "creador", tab: "propuestas" });
    go("dashboard");
  };

  const acceptProposal = (id) => {
    const p = PROPOSALS.find(x => x.id === id);
    if (p) p.status = "aceptada";
    setVersion(v => v + 1);
  };

  const confirmAgreement = (pid, party) => {
    const a = AGREEMENTS[pid] || { prod: false, creator: false };
    a[party] = true;
    if (a.prod && a.creator && !a.cert) {
      a.cert = "CM-" + Math.random().toString(36).slice(2, 7).toUpperCase();
      a.at = Date.now();
    }
    AGREEMENTS[pid] = a;
    saveLS(LS_A, AGREEMENTS);
    setVersion(v => v + 1);
  };

  const submitReview = (r) => {
    const rev = { id: "r" + Date.now(), at: Date.now(), ...r };
    REVIEWS.unshift(rev);
    saveLS(LS_R, REVIEWS);
    setVersion(v => v + 1);
  };

  // Apply tweaks to CSS vars
  useEffect(() => {
    document.documentElement.dataset.theme = t.theme || "behance";
  }, [t.theme]);

  useEffect(() => {
    const r = document.documentElement.style;
    const a = ACCENTS[t.accent] || ACCENTS.azul;
    const L = a.l || 0.55;
    r.setProperty("--accent",      `oklch(${L} ${a.c} ${a.h})`);
    r.setProperty("--accent-ink",  `oklch(${Math.min(L, 0.46)} ${a.c * 0.92} ${a.h})`);
    r.setProperty("--accent-wash", `oklch(0.95 ${a.c * 0.22} ${a.h})`);
    r.setProperty("--on-accent",   `oklch(0.99 0.01 ${a.h})`);
    if (a.grad) r.setProperty("--accent-grad", `linear-gradient(135deg, ${a.grad[0]}, ${a.grad[1]})`);
    else r.removeProperty("--accent-grad");
    document.documentElement.dataset.mode = t.dark ? "dark" : "light";
    const d = DENSITY[t.density] || DENSITY.regular;
    r.setProperty("--gap",  d.gap);
    r.setProperty("--pad",  d.pad);
    r.setProperty("--maxw", d.maxw);
  }, [t.accent, t.density, t.dark]);

  const brand = t.brandName || "CreatorMatch";
  const monetize = MONETIZATION_ENABLED || !!t.premium;
  const rail = t.navStyle === "rail";

  let screen;
  switch (route.screen) {
    case "explore":     screen = <Explore go={go} t={t} highlight={route.param} monetize={monetize} />; break;
    case "events":      screen = <EventsExplore go={go} />; break;
    case "eventDetail": screen = <EventDetail id={route.param} go={go} onPropose={(id) => setProposalEvent(id)} />; break;
    case "profile":     screen = <CreatorProfile id={route.param} go={go} monetize={monetize} />; break;
    case "creator":     screen = <CreatorFlow go={go} onPublish={publishCreator} monetize={monetize} />; break;
    case "event":       screen = <EventFlow go={go} onPublish={publishEvent} />; break;
    case "dashboard":   screen = <Dashboard go={go} t={t} onAccept={acceptProposal} monetize={monetize}
                          onConfirmAgree={confirmAgreement} onReview={submitReview} dashInit={dashInit} />; break;
    case "pricing":     screen = <Pricing go={go} />; break;
    default:            screen = <Landing go={go} t={t} brand={brand} monetize={monetize} />;
  }

  const showFooter = ["landing", "explore", "events"].includes(route.screen);

  return (
    <div style={{ display: rail ? "flex" : "block", minHeight: "100vh" }}>
      {rail
        ? <RailNav route={route} go={go} brand={brand} monetize={monetize} onLogin={() => setShowLogin(true)} onPublish={() => setShowPublish(true)} />
        : <TopNav  route={route} go={go} brand={brand} monetize={monetize} onLogin={() => setShowLogin(true)} onPublish={() => setShowPublish(true)} />}
      <div style={{ flex: 1, minWidth: 0 }}>
        <main key={route.screen + (route.param || "")}>{screen}</main>
        {showFooter && <Footer go={go} brand={brand} />}
      </div>

      {showLogin && (
        <ChooserModal onClose={() => setShowLogin(false)} go={go}
          title="Entrar a tu cuenta" subtitle="¿Cómo quieres continuar?" options={ROLE_OPTIONS}
          footer={{ text: "¿Ya tienes cuenta?", action: "Ir a mi panel", screen: "dashboard" }} />
      )}
      {showPublish && (
        <ChooserModal onClose={() => setShowPublish(false)} go={go}
          title="¿Qué quieres publicar?" subtitle="Elige cómo participar en COLLAB LINK." options={PUBLISH_OPTIONS} />
      )}
      {proposalEvent && (
        <ProposalModal eventId={proposalEvent} onClose={() => setProposalEvent(null)} onSubmit={publishProposal} />
      )}

      <TweaksPanel title="Tweaks">
        <TweakSection label="Estilo visual" />
        <TweakToggle label="Premium (mostrar Planes/Pro)" value={!!t.premium} onChange={v => setTweak("premium", v)} />
        <TweakRadio label="Tema" value={t.theme}
          options={[
            { value: "behance",   label: "Behance" },
            { value: "premium",   label: "Premium" },
            { value: "fiverr",    label: "Marketplace" },
            { value: "editorial", label: "Editorial" },
            { value: "moderno",   label: "Moderno" },
          ]}
          onChange={v => setTweak("theme", v)} />
        <TweakRadio label="Modo" value={t.dark ? "night" : "day"}
          options={[{ value: "day", label: "☀ Día" }, { value: "night", label: "☽ Noche" }]}
          onChange={v => setTweak("dark", v === "night")} />

        <TweakSection label="Marca" />
        <TweakText label="Nombre" value={t.brandName} onChange={v => setTweak("brandName", v)} />
        <TweakColor label="Acento"
          value={ACCENTS[t.accent] ? `oklch(${ACCENTS[t.accent].l || 0.55} ${ACCENTS[t.accent].c} ${ACCENTS[t.accent].h})` : ""}
          options={Object.keys(ACCENTS).map(k => `oklch(${ACCENTS[k].l || 0.55} ${ACCENTS[k].c} ${ACCENTS[k].h})`)}
          onChange={(v) => {
            const key = Object.keys(ACCENTS).find(k => `oklch(${ACCENTS[k].l || 0.55} ${ACCENTS[k].c} ${ACCENTS[k].h})` === v);
            if (key) setTweak("accent", key);
          }} />

        <TweakSection label="Estructura y layout" />
        <TweakRadio label="Navegación" value={t.navStyle} options={["top", "rail"]}
          onChange={v => setTweak("navStyle", v)} />
        <TweakRadio label="Hero (landing)" value={t.heroLayout} options={["split", "centered"]}
          onChange={v => setTweak("heroLayout", v)} />
        <TweakSelect label="Tarjetas de creador" value={t.cardStyle}
          options={[{ value: "image", label: "Con imagen" }, { value: "bordered", label: "Compacta" }, { value: "row", label: "Lista / fila" }]}
          onChange={v => setTweak("cardStyle", v)} />
        <TweakRadio label="Densidad" value={t.density} options={["compact", "regular", "comfy"]}
          onChange={v => setTweak("density", v)} />

        <TweakSection label="Registros de prueba" />
        <TweakButton label="Borrar mis registros" onClick={resetRecords} />
      </TweaksPanel>
    </div>
  );
}
