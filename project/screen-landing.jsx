// screen-landing.jsx
const { useState: useStateL } = React;

function HeroSplit({ go }) {
  return (
    <div style={{ display: "grid", gridTemplateColumns: "1.05fr 0.95fr", gap: 56, alignItems: "center" }} className="hero-grid">
      <div>
        <div className="eyebrow" style={{ marginBottom: 22 }}>Cobertura · Contenido · Puerto Rico</div>
        <h1 className="display" style={{ fontSize: "clamp(40px, 5.4vw, 78px)" }}>
          La cobertura de tu evento,<br /><em>en las manos correctas.</em>
        </h1>
        <p style={{ fontSize: 18.5, color: "var(--ink-soft)", maxWidth: 470, marginTop: 24, lineHeight: 1.55 }}>
          <Brand /> conecta a productores de eventos con creadores que cubren tu evento
          de principio a fin: promociones, cobertura en vivo, entrevistas y recaps —
          en colaboración o para tu uso exclusivo. Del primer mensaje a la entrega, en un mismo lugar.
        </p>
        <div style={{ display: "flex", gap: 12, marginTop: 34, flexWrap: "wrap" }}>
          <Button size="lg" onClick={() => go("creator")}>Regístrate como creador →</Button>
          <Button size="lg" variant="ghost" onClick={() => go("event")}>Publica un evento</Button>
        </div>
        <div style={{ display: "flex", alignItems: "center", gap: 18, marginTop: 32, fontSize: 13.5, color: "var(--ink-faint)" }}>
          <span style={{ display: "flex", alignItems: "center" }}>
            {CREATORS.slice(0, 4).map((c, i) => (
              <span key={c.id} style={{ marginLeft: i ? -10 : 0 }}><Avatar name={c.name} hue={c.accent} size={30} ring /></span>
            ))}
          </span>
          <span>+1.800 creadores verificados en toda la isla</span>
        </div>
      </div>
      <HeroPanel />
    </div>
  );
}

function HeroCentered({ go }) {
  return (
    <div style={{ textAlign: "center", maxWidth: 860, margin: "0 auto" }}>
      <div className="eyebrow" style={{ marginBottom: 22 }}>Creadores · Productores · Puerto Rico</div>
      <h1 className="display" style={{ fontSize: "clamp(42px, 6.6vw, 92px)" }}>
        La cobertura de tu evento,<br /><em>en las manos correctas.</em>
      </h1>
      <p style={{ fontSize: 19, color: "var(--ink-soft)", maxWidth: 560, margin: "26px auto 0", lineHeight: 1.55 }}>
        Conecta con creadores que cubren tu evento de principio a fin: promociones, cobertura en vivo,
        entrevistas y recaps — en colaboración o para tu uso exclusivo. La persona indicada para cada fecha.
      </p>
      <div style={{ display: "flex", gap: 12, marginTop: 34, justifyContent: "center", flexWrap: "wrap" }}>
        <Button size="lg" onClick={() => go("creator")}>Regístrate como creador →</Button>
        <Button size="lg" variant="ghost" onClick={() => go("event")}>Publica un evento</Button>
      </div>
      <div style={{ marginTop: 56 }}><HeroPanel wide /></div>
    </div>
  );
}

// A composed "product peek" panel — two facing cards = the two sides connecting
function HeroPanel({ wide }) {
  const c = CREATORS[0];
  const e = EVENTS[1];
  return (
    <div style={{ position: "relative", display: "grid", gridTemplateColumns: wide ? "1fr 1fr" : "1fr", gap: 16 }} className={wide ? "hero-panel-wide" : ""}>
      <Card pad style={{ "--pad": "22px" }}>
        <Badge tone="accent">Creador</Badge>
        <div style={{ display: "flex", gap: 13, marginTop: 14, alignItems: "center" }}>
          <Avatar name={c.name} hue={c.accent} size={50} />
          <div>
            <div style={{ fontWeight: 700, fontSize: 15 }}>{c.name}</div>
            <div style={{ fontSize: 13, color: "var(--ink-faint)" }}>{c.role}</div>
          </div>
        </div>
        <div className="ph" style={{ height: 92, borderRadius: 12, marginTop: 14 }}><span>portafolio</span></div>
        <div style={{ display: "flex", gap: 6, flexWrap: "wrap", marginTop: 12 }}>
          {c.formats.slice(0, 3).map(f => <Chip key={f}>{catLabel(f)}</Chip>)}
        </div>
        <div style={{ display: "flex", justifyContent: "space-between", marginTop: 14, fontSize: 13 }}>
          <Stars value={c.rating} count={c.reviews} />
          <span style={{ fontWeight: 600 }}>{c.rate}</span>
        </div>
      </Card>

      {/* connector */}
      {!wide && (
        <div style={{ position: "absolute", left: "50%", top: "100%", transform: "translate(-50%,-50%)", zIndex: 2,
          width: 40, height: 40, borderRadius: 99, background: "var(--accent)", color: "var(--on-accent)",
          display: "grid", placeItems: "center", fontSize: 18, boxShadow: "var(--shadow)", border: "3px solid var(--canvas)" }}>⇄</div>
      )}

      <Card pad style={{ "--pad": "22px" }}>
        <Badge>Evento</Badge>
        <div style={{ marginTop: 14 }}>
          <div className="serif" style={{ fontSize: 19, lineHeight: 1.15 }}>{e.title}</div>
          <div style={{ fontSize: 13, color: "var(--ink-faint)", marginTop: 4 }}>{e.org} · {e.city}</div>
        </div>
        <div style={{ display: "flex", gap: 7, flexWrap: "wrap", marginTop: 14 }}>
          {e.needs.map(n => <Chip key={n}>{catLabel(n)}</Chip>)}
        </div>
        <div style={{ display: "flex", justifyContent: "space-between", marginTop: 16, fontSize: 13, alignItems: "center" }}>
          <span style={{ color: "var(--ink-faint)" }}>{e.date}</span>
          <span style={{ fontWeight: 700 }}>{e.budget}</span>
        </div>
      </Card>
    </div>
  );
}

function HowItWorks() {
  const steps = [
    { n: "01", t: "Muestra lo que ofreces", d: "Los creadores arman su perfil con portafolio, formatos que cubren y modalidad. Los productores publican el brief de cobertura del evento." },
    { n: "02", t: (<><Brand /> hace el match</>), d: "No buscas a ciegas: te mostramos solo los creadores que encajan con tu evento por formato, zona, pago y fecha — con el porqué de cada coincidencia." },
    { n: "03", t: "Cubre y publica", d: "El creador cubre el evento y entrega: en colaboración en ambas redes, o para tu uso exclusivo. Todo en un solo lugar." },
  ];
  return (
    <section style={{ marginTop: 110 }}>
      <div style={{ display: "flex", alignItems: "flex-end", justifyContent: "space-between", flexWrap: "wrap", gap: 16, marginBottom: 40 }}>
        <h2 className="display" style={{ fontSize: "clamp(30px,3.6vw,46px)" }}>Cómo funciona</h2>
        <p style={{ color: "var(--ink-soft)", maxWidth: 360, fontSize: 15.5 }}>
          Encontrar a la persona correcta debería ser la parte fácil de producir un evento.
        </p>
      </div>
      <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: "var(--gap)" }} className="how-grid">
        {steps.map(s => (
          <div key={s.n} style={{ borderTop: "2px solid var(--ink)", paddingTop: 20 }}>
            <div className="serif" style={{ fontSize: 15, color: "var(--accent)", fontWeight: 500 }}>{s.n}</div>
            <h3 style={{ fontSize: 24, marginTop: 10 }}>{s.t}</h3>
            <p style={{ color: "var(--ink-soft)", marginTop: 10, fontSize: 15, lineHeight: 1.55 }}>{s.d}</p>
          </div>
        ))}
      </div>
    </section>
  );
}

function FeaturedCreators({ go, cardStyle }) {
  return (
    <section style={{ marginTop: 110 }}>
      <div style={{ display: "flex", alignItems: "flex-end", justifyContent: "space-between", marginBottom: 32, flexWrap: "wrap", gap: 12 }}>
        <div>
          <div className="eyebrow" style={{ marginBottom: 12 }}>Talento destacado</div>
          <h2 className="display" style={{ fontSize: "clamp(30px,3.6vw,46px)" }}>Creadores listos para tu próxima fecha</h2>
        </div>
        <Button variant="link" onClick={() => go("explore")}>Ver todos →</Button>
      </div>
      <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: "var(--gap)" }} className="how-grid">
        {CREATORS.slice(0, 3).map(c => <CreatorCard key={c.id} c={c} cardStyle={cardStyle} onClick={() => go("profile", c.id)} />)}
      </div>
    </section>
  );
}

function ClosingCTA({ go }) {
  return (
    <section style={{ marginTop: 120, marginBottom: 40 }}>
      <div style={{
        background: "var(--ink)", borderRadius: "var(--r-xl)", padding: "clamp(40px,6vw,80px)",
        color: "var(--canvas)", position: "relative", overflow: "hidden",
      }}>
        <div style={{ position: "relative", zIndex: 1, maxWidth: 620 }}>
          <h2 className="display" style={{ fontSize: "clamp(32px,4.4vw,58px)", color: "var(--canvas)" }}>
            Tu evento merece el talento <em style={{ color: "var(--accent)" }}>correcto</em>.
          </h2>
          <p style={{ fontSize: 17, opacity: 0.8, marginTop: 20, maxWidth: 440 }}>
            Únete gratis. Crea tu perfil o publica tu evento en menos de cinco minutos.
          </p>
          <div style={{ display: "flex", gap: 12, marginTop: 30, flexWrap: "wrap" }}>
            <Button size="lg" onClick={() => go("creator")}>Regístrate como creador</Button>
            <Button size="lg" variant="ghost" onClick={() => go("event")}
              style={{ boxShadow: "inset 0 0 0 1px oklch(1 0 0 / 0.25)", color: "var(--canvas)", background: "transparent" }}>
              Publica un evento
            </Button>
          </div>
        </div>
        <div aria-hidden style={{ position: "absolute", right: -80, top: -80, width: 360, height: 360, borderRadius: 99,
          border: "1px solid oklch(1 0 0 / 0.12)" }} />
        <div aria-hidden style={{ position: "absolute", right: 40, bottom: -120, width: 260, height: 260, borderRadius: 99,
          background: "oklch(0.52 0.2 264 / 0.35)", filter: "blur(40px)" }} />
      </div>
    </section>
  );
}

function Landing({ go, t }) {
  return (
    <div className="fade-in" style={{ maxWidth: "var(--maxw)", margin: "0 auto", padding: "48px clamp(20px,4vw,40px) 0" }}>
      {t.heroLayout === "centered" ? <HeroCentered go={go} /> : <HeroSplit go={go} />}
      {/* logos / stat band */}
      <div style={{ display: "flex", gap: 40, flexWrap: "wrap", justifyContent: "space-between", marginTop: 80,
        padding: "26px 0", borderTop: "1px solid var(--line)", borderBottom: "1px solid var(--line)" }}>
        {[["1.800+", "creadores verificados"], ["78", "pueblos cubiertos"], ["4.9★", "satisfacción media"], ["48h", "para cerrar un match"]].map(([a, b]) => (
          <div key={b}>
            <div className="serif" style={{ fontSize: 34 }}>{a}</div>
            <div style={{ fontSize: 13, color: "var(--ink-faint)", marginTop: 2 }}>{b}</div>
          </div>
        ))}
      </div>
      <HowItWorks />
      <FeaturedCreators go={go} cardStyle={t.cardStyle} />
      <ClosingCTA go={go} />
    </div>
  );
}

Object.assign(window, { Landing });
