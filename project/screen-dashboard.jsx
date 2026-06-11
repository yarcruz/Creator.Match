// screen-dashboard.jsx — the connection hub (role-switchable)
const { useState: useStateD } = React;

function Dashboard({ go, t, onAccept }) {
  const init = window.__dashInit || {};
  const [role, setRole] = useStateD(init.role || "productor"); // productor | creador
  const [tab, setTab] = useStateD(init.tab || "resumen");
  const [msgCreator, setMsgCreator] = useStateD(null);
  React.useEffect(() => { window.__dashInit = null; }, []);
  const openChat = (creatorId) => { setMsgCreator(creatorId); setTab("mensajes"); };

  return (
    <div className="fade-in" style={{ maxWidth: "var(--maxw)", margin: "0 auto", padding: "32px clamp(20px,4vw,40px) 80px" }}>
      {window.__monetize && (
        <div style={{ display: "flex", alignItems: "center", gap: 14, padding: "14px 18px", marginBottom: 22,
          borderRadius: "var(--r-lg)", background: "var(--ink)", color: "var(--canvas)", flexWrap: "wrap" }}>
          <span style={{ width: 30, height: 30, borderRadius: 8, background: "var(--accent)", color: "var(--on-accent)",
            display: "grid", placeItems: "center", flexShrink: 0, fontWeight: 700 }}>★</span>
          <span style={{ fontSize: 14.5, fontWeight: 600 }}>
            {role === "productor" ? "Desbloquea filtros avanzados y contacta creadores directo." : "Destácate y recibe eventos antes que nadie."}
          </span>
          <Button size="sm" style={{ marginLeft: "auto" }} onClick={() => go("pricing")}>Hazte Pro</Button>
        </div>
      )}
      {/* header */}
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-end", flexWrap: "wrap", gap: 16, marginBottom: 26 }}>
        <div>
          <div className="eyebrow" style={{ marginBottom: 10 }}>Tu panel</div>
          <h1 className="display" style={{ fontSize: "clamp(30px,4vw,48px)" }}>
            {role === "productor" ? "Hola, Atelier Norte" : "Hola, Mariana"}
          </h1>
          <p style={{ color: "var(--ink-soft)", marginTop: 8, fontSize: 15.5 }}>
            {role === "productor"
              ? "Tienes 1 evento activo y 4 coincidencias nuevas."
              : "Tienes 3 invitaciones nuevas y 2 propuestas en curso."}
          </p>
        </div>
        {/* role switch — both audiences, one product */}
        <div style={{ display: "flex", background: "var(--canvas-2)", borderRadius: 99, padding: 4, gap: 2 }}>
          {[["productor", "Productor"], ["creador", "Creador"]].map(([k, lbl]) => (
            <button key={k} onClick={() => { setRole(k); setTab("resumen"); }}
              style={{ padding: "8px 18px", borderRadius: 99, fontSize: 13.5, fontWeight: 600,
                background: role === k ? "var(--panel)" : "transparent",
                color: role === k ? "var(--ink)" : "var(--ink-faint)",
                boxShadow: role === k ? "var(--shadow-sm)" : "none", transition: "all 0.18s ease" }}>
              {lbl}
            </button>
          ))}
        </div>
      </div>

      {/* stat row */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(4,1fr)", gap: "var(--gap)", marginBottom: 28 }} className="how-grid">
        {(role === "productor"
          ? [["1", "evento activo"], ["4", "coincidencias nuevas"], ["3", "propuestas recibidas"], ["$680", "ya comprometido"]]
          : [["3", "invitaciones nuevas"], ["2", "propuestas en curso"], ["214", "eventos hechos"], ["4.9★", "tu valoración"]]
        ).map(([a, b]) => (
          <Card pad key={b} style={{ "--pad": "20px" }}>
            <div className="serif" style={{ fontSize: 32 }}>{a}</div>
            <div style={{ fontSize: 13, color: "var(--ink-faint)", marginTop: 2 }}>{b}</div>
          </Card>
        ))}
      </div>

      <ActiveProjects role={role} onOpenChat={openChat} />

      {/* tabs */}
      <div style={{ display: "flex", gap: 4, borderBottom: "1px solid var(--line)", marginBottom: 28 }}>
        {(role === "productor"
          ? [["resumen", "Coincidencias"], ["propuestas", "Propuestas"], ["mensajes", "Mensajes"]]
          : [["resumen", "Invitaciones"], ["propuestas", "Mis propuestas"], ["mensajes", "Mensajes"]]
        ).map(([k, lbl]) => (
          <button key={k} onClick={() => setTab(k)}
            style={{ padding: "10px 16px", fontSize: 14.5, fontWeight: 600, position: "relative",
              color: tab === k ? "var(--ink)" : "var(--ink-faint)" }}>
            {lbl}
            {tab === k && <span style={{ position: "absolute", left: 16, right: 16, bottom: -1, height: 2, background: "var(--accent)" }} />}
          </button>
        ))}
      </div>

      {tab === "resumen" && <MatchesTab role={role} go={go} />}
      {tab === "propuestas" && <ProposalsTab role={role} onAccept={onAccept} onMessage={openChat} />}
      {tab === "mensajes" && <MessagesTab go={go} initialCreator={msgCreator} />}
    </div>
  );
}

function ActiveProjects({ role, onOpenChat }) {
  const open = PROPOSALS.filter(p => p.status === "aceptada");
  if (open.length === 0) return null;
  return (
    <div style={{ marginBottom: 28 }}>
      <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 14 }}>
        <h3 style={{ fontSize: 18 }}>Proyectos activos</h3>
        <Badge tone="green">{open.length} en curso</Badge>
      </div>
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(300px,1fr))", gap: "var(--gap)" }}>
        {open.map(p => {
          const c = creatorById(p.creator); const e = eventById(p.event);
          return (
            <Card key={p.id} pad style={{ "--pad": "20px", display: "flex", flexDirection: "column", gap: 12,
              borderLeft: "3px solid oklch(0.62 0.13 150)" }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", gap: 10 }}>
                <Badge tone="green">● En curso</Badge>
                <span className="serif" style={{ fontSize: 20 }}>{p.amount}</span>
              </div>
              <div>
                <div className="serif" style={{ fontSize: 19, lineHeight: 1.12 }}>{e.title}</div>
                <div style={{ fontSize: 13, color: "var(--ink-faint)", marginTop: 4 }}>
                  {e.date}{e.time ? ` · ${e.time}` : ""} · {e.city}
                </div>
              </div>
              <div style={{ display: "flex", alignItems: "center", gap: 10, paddingTop: 12, borderTop: "1px solid var(--line-soft)" }}>
                <Avatar name={c.name} hue={c.accent} size={34} src={c.photo} />
                <div style={{ flex: 1, minWidth: 0, fontSize: 13 }}>
                  <div style={{ fontWeight: 600 }}>{role === "productor" ? c.name : e.org}</div>
                  <div style={{ color: "var(--ink-faint)", fontSize: 12 }}>{role === "productor" ? "Creador" : "Productor"}</div>
                </div>
                <Button size="sm" variant="soft" onClick={() => onOpenChat(p.creator)}>Abrir chat →</Button>
              </div>
            </Card>
          );
        })}
      </div>
    </div>
  );
}

function MatchesTab({ role, go }) {
  return (
    <div style={{ display: "grid", gridTemplateColumns: "1.5fr 1fr", gap: 28 }} className="profile-grid">
      <div>
        <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 16 }}>
          <h3 style={{ fontSize: 21 }}>{role === "productor" ? "Creadores que encajan" : "Eventos para ti"}</h3>
          <Badge tone="accent">ordenado por match</Badge>
        </div>
        <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
          {MATCHES.map(m => {
            const c = creatorById(m.creator); const e = eventById(m.event);
            return (
              <Card key={m.id} hover onClick={() => go(role === "productor" ? "profile" : "dashboard", m.creator)}
                style={{ padding: "16px 18px", display: "flex", gap: 14, alignItems: "center" }}>
                {role === "productor"
                  ? <Avatar name={c.name} hue={c.accent} size={48} />
                  : <div style={{ width: 48, height: 48, borderRadius: 12, background: "var(--accent-wash)", display: "grid", placeItems: "center", color: "var(--accent-ink)", fontSize: 20, flexShrink: 0 }}>◆</div>}
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                    <span style={{ fontWeight: 700, fontSize: 15 }}>
                      {role === "productor" ? c.name : e.title}
                    </span>
                    {m.status === "nuevo" && <span style={{ width: 7, height: 7, borderRadius: 99, background: "var(--accent)" }} />}
                  </div>
                  <div style={{ fontSize: 13, color: "var(--ink-soft)", marginTop: 2 }}>
                    {role === "productor" ? `${c.role} · ${c.city}` : `${e.org} · ${e.date}`}
                  </div>
                  <div style={{ fontSize: 12.5, color: "var(--ink-faint)", marginTop: 6, display: "flex", alignItems: "center", gap: 6 }}>
                    <span style={{ color: "var(--accent)" }}>↳</span> {m.why}
                  </div>
                </div>
                <div style={{ textAlign: "right", flexShrink: 0 }}>
                  <div className="serif" style={{ fontSize: 26, color: "var(--accent)" }}>{m.score}<span style={{ fontSize: 14 }}>%</span></div>
                  <div style={{ fontSize: 11, color: "var(--ink-faint)" }}>match</div>
                </div>
              </Card>
            );
          })}
        </div>
      </div>

      {/* active event/profile context */}
      <div>
        <h3 style={{ fontSize: 21, marginBottom: 16 }}>{role === "productor" ? "Tu evento activo" : "Tu perfil"}</h3>
        {role === "productor"
          ? <EventPreviewCard data={{ ...EVENTS[0], budgetMin: "$1.2k", budgetMax: "$2k", needs: EVENTS[0].needs, brief: EVENTS[0].brief, guests: "80" }} large />
          : <CreatorPreviewCard data={{ name: "Mariana Restrepo", headline: "Fotógrafa de cobertura",
              city: "Medellín", types: ["cobertura", "previa", "entrevista"], modes: ["colab", "exclusivo"], tier: "pro",
              tags: ["Bodas", "Corporativo", "Editorial"], rate: "$480", rateUnit: "evento",
              avail: "Disponible esta semana", bio: CREATORS[0].bio }} large />}
        <Button full variant="ghost" style={{ marginTop: 14 }} onClick={() => go(role === "productor" ? "event" : "creator")}>
          {role === "productor" ? "Editar evento" : "Editar perfil"}
        </Button>
      </div>
    </div>
  );
}

function ProposalsTab({ role, onAccept, onMessage }) {
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
      {PROPOSALS.map(p => {
        const c = creatorById(p.creator); const e = eventById(p.event);
        const tone = p.status === "aceptada" ? "green" : "amber";
        return (
          <Card key={p.id} pad style={{ "--pad": "20px", display: "flex", gap: 16, alignItems: "center", flexWrap: "wrap" }}>
            <Avatar name={c.name} hue={c.accent} size={46} />
            <div style={{ flex: 1, minWidth: 180 }}>
              <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                <span style={{ fontWeight: 700, fontSize: 15 }}>{role === "productor" ? c.name : e.title}</span>
                {p.mine && <Badge tone="accent">Enviada por ti</Badge>}
              </div>
              <div style={{ fontSize: 13, color: "var(--ink-faint)", marginTop: 2 }}>
                Para “{e.title}” · {p.when}
              </div>
              <div style={{ fontSize: 13.5, color: "var(--ink-soft)", marginTop: 6 }}>{p.note}</div>
            </div>
            <div style={{ textAlign: "right" }}>
              <div className="serif" style={{ fontSize: 24 }}>{p.amount}</div>
              <Badge tone={tone}>{p.status === "aceptada" ? "✓ Aceptada" : "Pendiente"}</Badge>
            </div>
            {role === "productor" && (
              <div style={{ display: "flex", gap: 8, width: "100%", justifyContent: "flex-end" }}>
                <Button size="sm" variant="ghost" onClick={() => onMessage && onMessage(p.creator)}>Mensaje</Button>
                {p.status === "pendiente"
                  ? <Button size="sm" onClick={() => onAccept && onAccept(p.id)}>Aceptar propuesta</Button>
                  : <Button size="sm" variant="soft" onClick={() => onMessage && onMessage(p.creator)}>Abrir chat →</Button>}
              </div>
            )}
            {role === "creador" && p.status === "aceptada" && (
              <div style={{ display: "flex", gap: 8, width: "100%", justifyContent: "flex-end", alignItems: "center", flexWrap: "wrap" }}>
                <Badge tone="green">✓ ¡Es un match! El productor aceptó</Badge>
                <Button size="sm" variant="soft" onClick={() => onMessage && onMessage(p.creator)}>Abrir chat →</Button>
              </div>
            )}
          </Card>
        );
      })}
    </div>
  );
}

function MessagesTab({ go, initialCreator }) {
  // Ensure a thread exists for the requested creator (e.g. just-accepted proposal).
  const threads = [...MESSAGES];
  if (initialCreator && !threads.some(m => m.creator === initialCreator)) {
    const nc = creatorById(initialCreator);
    if (nc) threads.unshift({ id: "new-" + initialCreator, creator: initialCreator,
      last: "Propuesta aceptada — ¡coordinemos los detalles!", time: "ahora", unread: 0 });
  }
  const startId = initialCreator ? (threads.find(m => m.creator === initialCreator) || threads[0]).id : threads[0].id;
  const [active, setActive] = useStateD(startId);
  const thread = threads.find(m => m.id === active) || threads[0];
  const c = creatorById(thread.creator);
  // Si hay una propuesta aceptada con este creador, el hilo abre con el mensaje de match.
  const accepted = PROPOSALS.find(p => p.creator === thread.creator && p.status === "aceptada");
  const accEvent = accepted ? eventById(accepted.event) : null;
  const convo = [];
  if (accepted) {
    convo.push({ system: true, text: `🎉 ¡Es un match! Propuesta aceptada para “${accEvent ? accEvent.title : "el evento"}”. ¡Felicitaciones — coordinen los detalles por aquí!` });
  }
  convo.push({ me: false, text: "¡Hola! Vi tu evento y me encantaría participar. ¿Sigue abierta la fecha?" });
  convo.push({ me: true, text: "¡Hola " + c.name.split(" ")[0] + "! Sí, seguimos buscando. ¿Tienes disponibilidad?" });
  if (accepted) {
    convo.push({ me: true, text: "¡Listo, acepto tu propuesta! Quedamos en " + accepted.amount + ". ¿Arrancamos?" });
    convo.push({ me: false, text: "¡Excelente! Mil gracias, ahí coordinamos todo. 🙌" });
  } else {
    convo.push({ me: false, text: thread.last });
  }
  return (
    <div style={{ display: "grid", gridTemplateColumns: "320px 1fr", gap: 20, height: 520 }} className="msg-grid">
      <div style={{ display: "flex", flexDirection: "column", gap: 6, overflowY: "auto" }}>
        {threads.map(m => {
          const mc = creatorById(m.creator);
          return (
            <button key={m.id} onClick={() => setActive(m.id)}
              style={{ display: "flex", gap: 12, alignItems: "center", padding: "12px 14px", borderRadius: "var(--r)", textAlign: "left",
                background: active === m.id ? "var(--accent-wash)" : "transparent", transition: "background 0.15s ease" }}>
              <Avatar name={mc.name} hue={mc.accent} size={42} />
              <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{ display: "flex", justifyContent: "space-between" }}>
                  <span style={{ fontWeight: 600, fontSize: 14 }}>{mc.name}</span>
                  <span style={{ fontSize: 11.5, color: "var(--ink-faint)" }}>{m.time}</span>
                </div>
                <div style={{ fontSize: 12.5, color: "var(--ink-soft)", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{m.last}</div>
              </div>
              {m.unread > 0 && <span style={{ background: "var(--accent)", color: "var(--on-accent)", fontSize: 11, fontWeight: 700,
                minWidth: 19, height: 19, borderRadius: 99, display: "grid", placeItems: "center", padding: "0 5px" }}>{m.unread}</span>}
            </button>
          );
        })}
      </div>
      <Card style={{ display: "flex", flexDirection: "column" }}>
        <div style={{ display: "flex", gap: 12, alignItems: "center", padding: "16px 20px", borderBottom: "1px solid var(--line-soft)" }}>
          <Avatar name={c.name} hue={c.accent} size={40} />
          <div>
            <div style={{ fontWeight: 700, fontSize: 14.5 }}>{c.name}</div>
            <div style={{ fontSize: 12.5, color: "var(--ink-faint)" }}>{c.role} · {c.response}</div>
          </div>
          <Button size="sm" variant="ghost" style={{ marginLeft: "auto" }} onClick={() => go("profile", c.id)}>Ver perfil</Button>
        </div>
        <div style={{ flex: 1, overflowY: "auto", padding: 20, display: "flex", flexDirection: "column", gap: 12 }}>
          {convo.map((msg, i) => (
            msg.system
              ? <div key={i} style={{ alignSelf: "center", maxWidth: "88%", textAlign: "center", margin: "2px 0",
                  padding: "10px 16px", borderRadius: 12, fontSize: 13, fontWeight: 600,
                  background: "var(--accent-wash)", color: "var(--accent-ink)", lineHeight: 1.45 }}>
                  {msg.text}
                </div>
              : <div key={i} style={{ alignSelf: msg.me ? "flex-end" : "flex-start", maxWidth: "72%",
                  padding: "11px 15px", borderRadius: 16, fontSize: 14, lineHeight: 1.45,
                  background: msg.me ? "var(--accent)" : "var(--canvas-2)",
                  color: msg.me ? "var(--on-accent)" : "var(--ink)",
                  borderBottomRightRadius: msg.me ? 4 : 16, borderBottomLeftRadius: msg.me ? 16 : 4 }}>
                  {msg.text}
                </div>
          ))}
        </div>
        <div style={{ padding: 16, borderTop: "1px solid var(--line-soft)", display: "flex", gap: 10 }}>
          <input placeholder="Escribe un mensaje…" style={{ ...inputStyle(false), borderRadius: 99 }} />
          <Button>Enviar</Button>
        </div>
      </Card>
    </div>
  );
}

Object.assign(window, { Dashboard });
