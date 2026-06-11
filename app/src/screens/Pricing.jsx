import { useState } from 'react';
import { Button, Card, Badge } from '../components/ui.jsx';

const PLANS = {
  creador: {
    label: "Para creadores",
    free: {
      name: "Creador", price: 0,
      tagline: "Para empezar a recibir invitaciones.",
      features: [
        ["Perfil en el directorio", true],
        ["Hasta 3 proyectos en portafolio", true],
        ["Recibe invitaciones a eventos", true],
        ["Chat una vez hay match", true],
        ["5 propuestas al mes", true],
        ["Perfil destacado en la búsqueda", false],
        ["Acceso anticipado a eventos nuevos", false],
        ["Estadísticas de tu perfil", false],
      ],
    },
    pro: {
      name: "Creador Pro", price: 12, priceYear: 96,
      tagline: "Para destacar y cerrar más.",
      features: [
        ["Todo lo del plan gratis", true],
        ["Portafolio ilimitado", true],
        ["Perfil destacado + insignia Pro", true],
        ["Propuestas ilimitadas", true],
        ["Acceso anticipado a eventos (24–48h)", true],
        ["Ves el % de match y el porqué", true],
        ["Estadísticas: quién vio tu perfil", true],
        ["Verificación prioritaria", true],
      ],
    },
  },
  productor: {
    label: "Para productores",
    free: {
      name: "Productor", price: 0,
      tagline: "Para publicar tu primer evento.",
      features: [
        ["1 evento activo", true],
        ["Recibe propuestas de creadores", true],
        ["Filtros básicos (formato + pueblo)", true],
        ["Chat una vez hay match", true],
        ["Eventos activos ilimitados", false],
        ["Buscar y contactar creadores directo", false],
        ["Filtros avanzados (gear, nivel, isla)", false],
        ["Lista de coincidencias con % y porqué", false],
      ],
    },
    pro: {
      name: "Productor Pro", price: 29, priceYear: 240,
      tagline: "Para producir sin límites.",
      features: [
        ["Todo lo del plan gratis", true],
        ["Eventos activos ilimitados + destacados", true],
        ["Buscar y contactar creadores directo", true],
        ["Filtros avanzados (gear, nivel, isla)", true],
        ["Coincidencias con % y porqué", true],
        ["Invitaciones ilimitadas", true],
        ["Evento urgente / boost incluido", true],
        ["Soporte prioritario", true],
      ],
    },
  },
};

const BOOSTS = [
  { icon: "↑", name: "Destacar", price: "$9", note: "Tu evento o perfil arriba por 7 días." },
  { icon: "✦", name: "Verificación", price: "$19", note: "Insignia de verificación una sola vez." },
  { icon: "⚡", name: "Urgente", price: "$5", note: "Empuja tu evento al tope para fechas próximas." },
];

function PlanCard({ plan, year, pro, onPick }) {
  const price = year ? plan.priceYear : plan.price;
  const per = year ? "/año" : "/mes";
  return (
    <div style={{
      background: "var(--panel)", borderRadius: "var(--r-xl)", padding: "clamp(24px,3vw,34px)",
      border: pro ? "2px solid var(--accent)" : "1px solid var(--line)",
      boxShadow: pro ? "var(--shadow-lg)" : "var(--shadow-sm)", position: "relative",
      display: "flex", flexDirection: "column",
    }}>
      {pro && <div style={{ position: "absolute", top: -12, left: 28 }}><Badge tone="accent">★ Recomendado</Badge></div>}
      <div style={{ fontWeight: 700, fontSize: 18 }}>{plan.name}</div>
      <p style={{ fontSize: 13.5, color: "var(--ink-faint)", marginTop: 4 }}>{plan.tagline}</p>
      <div style={{ display: "flex", alignItems: "baseline", gap: 6, marginTop: 18 }}>
        <span className="serif" style={{ fontSize: 46, lineHeight: 1 }}>${price}</span>
        {price > 0 && <span style={{ fontSize: 14, color: "var(--ink-faint)" }}>{per}</span>}
      </div>
      {year && plan.priceYear > 0 && (
        <div style={{ fontSize: 12.5, color: "var(--accent)", marginTop: 6, fontWeight: 600 }}>
          ≈ 2 meses gratis vs. mensual
        </div>
      )}
      <Button full variant={pro ? "primary" : "ghost"} size="lg" style={{ marginTop: 20 }} onClick={onPick}>
        {price === 0 ? "Empezar gratis" : "Hazte Pro"}
      </Button>
      <div style={{ display: "flex", flexDirection: "column", gap: 11, marginTop: 24 }}>
        {plan.features.map(([f, on], i) => (
          <div key={i} style={{ display: "flex", gap: 10, alignItems: "flex-start",
            fontSize: 13.5, color: on ? "var(--ink)" : "var(--ink-faint)" }}>
            <span style={{ flexShrink: 0, marginTop: 1, fontWeight: 700, color: on ? "var(--accent)" : "var(--line)" }}>
              {on ? "✓" : "—"}
            </span>
            <span style={{ opacity: on ? 1 : 0.7 }}>{f}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

export function Pricing({ go }) {
  const [role, setRole] = useState("creador");
  const [year, setYear] = useState(false);
  const block = PLANS[role];

  return (
    <div className="fade-in" style={{ maxWidth: 1080, margin: "0 auto", padding: "48px clamp(20px,4vw,40px) 80px" }}>
      <div style={{ textAlign: "center", maxWidth: 640, margin: "0 auto" }}>
        <div className="eyebrow" style={{ marginBottom: 14 }}>Planes</div>
        <h1 className="display" style={{ fontSize: "clamp(34px,5vw,62px)" }}>
          Empieza gratis. <em>Hazte Pro</em> cuando rinda.
        </h1>
        <p style={{ fontSize: 17, color: "var(--ink-soft)", marginTop: 18, lineHeight: 1.55 }}>
          Aparecer y recibir es gratis, siempre. Lo Pro es para destacar, buscar sin límites y cerrar más rápido.
        </p>
      </div>

      <div style={{ display: "flex", justifyContent: "center", gap: 16, marginTop: 34, flexWrap: "wrap", alignItems: "center" }}>
        <div style={{ display: "flex", background: "var(--canvas-2)", borderRadius: 99, padding: 4, gap: 2 }}>
          {Object.entries(PLANS).map(([k, v]) => (
            <button key={k} onClick={() => setRole(k)}
              style={{ padding: "9px 20px", borderRadius: 99, fontSize: 14, fontWeight: 600,
                background: role === k ? "var(--panel)" : "transparent",
                color: role === k ? "var(--ink)" : "var(--ink-faint)",
                boxShadow: role === k ? "var(--shadow-sm)" : "none", transition: "all 0.18s ease" }}>
              {v.label}
            </button>
          ))}
        </div>
        <div style={{ display: "flex", alignItems: "center", gap: 10, fontSize: 13.5 }}>
          <span style={{ color: year ? "var(--ink-faint)" : "var(--ink)", fontWeight: 600 }}>Mensual</span>
          <button onClick={() => setYear(!year)}
            style={{ width: 44, height: 26, borderRadius: 99, padding: 3,
              background: year ? "var(--accent)" : "var(--line)", transition: "background 0.2s ease" }}>
            <span style={{ display: "block", width: 20, height: 20, borderRadius: 99, background: "var(--panel)",
              transform: year ? "translateX(18px)" : "none", transition: "transform 0.2s ease",
              boxShadow: "var(--shadow-sm)" }} />
          </button>
          <span style={{ color: year ? "var(--ink)" : "var(--ink-faint)", fontWeight: 600 }}>Anual</span>
        </div>
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 22, marginTop: 34, maxWidth: 760, marginInline: "auto" }} className="how-grid">
        <PlanCard plan={block.free} year={year} onPick={() => go(role === "creador" ? "creator" : "event")} />
        <PlanCard plan={block.pro} year={year} pro onPick={() => go(role === "creador" ? "creator" : "event")} />
      </div>

      <div style={{ marginTop: 56 }}>
        <div style={{ textAlign: "center", marginBottom: 22 }}>
          <div className="eyebrow" style={{ marginBottom: 8 }}>Sin suscripción</div>
          <h2 className="display" style={{ fontSize: "clamp(24px,3vw,34px)" }}>Impulsos puntuales</h2>
        </div>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(3,1fr)", gap: 16 }} className="how-grid">
          {BOOSTS.map(b => (
            <Card key={b.name} pad style={{ "--pad": "22px", textAlign: "center" }}>
              <div style={{ width: 44, height: 44, borderRadius: 12, margin: "0 auto", display: "grid", placeItems: "center",
                background: "var(--accent-wash)", color: "var(--accent-ink)", fontSize: 20 }}>{b.icon}</div>
              <div style={{ fontWeight: 700, fontSize: 16, marginTop: 14 }}>{b.name}</div>
              <div className="serif" style={{ fontSize: 26, marginTop: 4 }}>{b.price}</div>
              <p style={{ fontSize: 13, color: "var(--ink-faint)", marginTop: 8, lineHeight: 1.5 }}>{b.note}</p>
            </Card>
          ))}
        </div>
      </div>

      <p style={{ textAlign: "center", fontSize: 13, color: "var(--ink-faint)", marginTop: 40 }}>
        Precios de demostración en USD. Sin permanencia — cancela cuando quieras.
      </p>
    </div>
  );
}
