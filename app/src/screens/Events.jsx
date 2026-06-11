import { useState } from 'react';
import {
  Avatar, Button, Card, Chip, Badge, Field, TextInput, TextArea, LocationSelect,
  inputStyle,
} from '../components/ui.jsx';
import { EVENTS, CREATORS, CATEGORIES, catLabel, modeOf, eventById, creatorById, tierOf } from '../data.js';

function evPaid(e) { return e.payType && e.payType.length ? e.payType.includes("pago") : (e.budget && e.budget !== "Sin pago"); }
function evFree(e) { return e.payType && e.payType.length ? e.payType.includes("nopago") : (e.budget === "Sin pago"); }

const selStyle = {
  padding: "10px 14px", borderRadius: 99, border: "1px solid var(--line)",
  background: "var(--panel)", fontSize: 13.5, fontWeight: 500, color: "var(--ink)", cursor: "pointer",
};

export function EventCard({ e, onClick }) {
  return (
    <Card hover onClick={onClick} pad style={{ "--pad": "22px", display: "flex", flexDirection: "column" }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", gap: 10 }}>
        <Badge tone="neutral">{e.type}</Badge>
        <span style={{ fontSize: 12.5, color: "var(--ink-faint)" }}>{e.posted}</span>
      </div>
      <h3 className="serif" style={{ fontSize: 23, marginTop: 14, lineHeight: 1.12 }}>{e.title}</h3>
      <div style={{ fontSize: 13.5, color: "var(--ink-faint)", marginTop: 5 }}>
        {e.org} · {e.city}{e.location ? ` · ${e.location}` : ""}
      </div>
      <div style={{ marginTop: 16 }}>
        <div style={{ fontSize: 12, fontWeight: 600, color: "var(--ink-faint)", marginBottom: 8, letterSpacing: "0.04em" }}>NECESITA</div>
        <div style={{ display: "flex", gap: 7, flexWrap: "wrap" }}>
          {e.needs.map(n => <Chip key={n}>{catLabel(n)}</Chip>)}
        </div>
      </div>
      <div style={{ display: "flex", gap: 6, flexWrap: "wrap", marginTop: 12 }}>
        {e.mode === "ambas"
          ? <Badge tone="accent">◑ Colab o exclusivo</Badge>
          : e.mode && <Badge tone={e.mode === "colab" ? "accent" : "neutral"}>{modeOf(e.mode).icon} {modeOf(e.mode).label}</Badge>}
        {evPaid(e) && <Badge tone="green">◆ Pagado</Badge>}
        {evFree(e) && <Badge>○ No pagado</Badge>}
      </div>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginTop: 18, paddingTop: 16,
        borderTop: "1px solid var(--line-soft)" }}>
        <span style={{ fontSize: 13.5, color: "var(--ink-faint)" }}>{e.date}{e.time ? ` · ${e.time}` : ""}</span>
        <span style={{ fontWeight: 700, fontSize: 14 }}>{evFree(e) && !evPaid(e) ? "Sin pago" : e.budget}</span>
      </div>
    </Card>
  );
}

export function EventsExplore({ go }) {
  const [need, setNeed] = useState("all");
  const [city, setCity] = useState("all");
  const [pay,  setPay]  = useState("all");
  const [mode, setMode] = useState("all");

  const list = EVENTS.filter(e =>
    (need === "all" || e.needs.includes(need)) &&
    (city === "all" || e.city === city) &&
    (mode === "all" || e.mode === mode) &&
    (pay  === "all" || (pay === "pago" ? evPaid(e) : evFree(e))));

  return (
    <div className="fade-in" style={{ maxWidth: "var(--maxw)", margin: "0 auto", padding: "40px clamp(20px,4vw,40px) 80px" }}>
      <div style={{ marginBottom: 28 }}>
        <div className="eyebrow" style={{ marginBottom: 12 }}>Explorar eventos</div>
        <h1 className="display" style={{ fontSize: "clamp(32px,4.4vw,56px)" }}>
          {list.length} eventos buscando {need !== "all" ? catLabel(need).toLowerCase() : "creadores"}
        </h1>
      </div>

      <div style={{ display: "flex", gap: 8, flexWrap: "wrap", alignItems: "center", marginBottom: 18 }}>
        <Chip active={need === "all"} onClick={() => setNeed("all")}>Todo lo que buscan</Chip>
        {CATEGORIES.map(c => <Chip key={c.id} active={need === c.id} onClick={() => setNeed(c.id)}>{c.icon} {c.label}</Chip>)}
      </div>
      <div style={{ display: "flex", gap: 10, alignItems: "center", marginBottom: 30, flexWrap: "wrap" }}>
        <select value={pay} onChange={e => setPay(e.target.value)} style={selStyle}>
          <option value="all">Pago: todos</option>
          <option value="pago">Eventos con pago</option>
          <option value="nopago">Eventos sin pago</option>
        </select>
        <select value={mode} onChange={e => setMode(e.target.value)} style={selStyle}>
          <option value="all">Toda modalidad</option>
          <option value="colab">Colaboración</option>
          <option value="exclusivo">Uso exclusivo</option>
        </select>
        <LocationSelect value={city} onChange={setCity} includeAll allLabel="Toda ubicación" style={selStyle} />
        <span style={{ marginLeft: "auto", fontSize: 13.5, color: "var(--ink-faint)" }}>{list.length} resultados</span>
      </div>

      {list.length === 0 ? (
        <div style={{ padding: "60px 20px", textAlign: "center", color: "var(--ink-faint)" }}>
          No hay eventos con esos filtros todavía.
        </div>
      ) : (
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(300px, 1fr))", gap: "var(--gap)" }}>
          {list.map(e => <EventCard key={e.id} e={e} onClick={() => go("eventDetail", e.id)} />)}
        </div>
      )}
    </div>
  );
}

export function EventDetail({ id, go, onPropose }) {
  const e = eventById(id) || EVENTS[0];
  const suggested = CREATORS.filter(c =>
    c.formats.some(f => e.needs.includes(f)) && (!e.mode || e.mode === "ambas" || c.modes.includes(e.mode))).slice(0, 4);
  return (
    <div className="fade-in" style={{ maxWidth: 980, margin: "0 auto", padding: "32px clamp(20px,4vw,40px) 80px" }}>
      <Button variant="link" onClick={() => go("events")} style={{ marginBottom: 22 }}>← Volver a eventos</Button>

      <div style={{ display: "grid", gridTemplateColumns: "1.5fr 1fr", gap: 40, alignItems: "start" }} className="profile-grid">
        <div>
          <div style={{ display: "flex", gap: 8, flexWrap: "wrap", marginBottom: 14 }}>
            <Badge tone="neutral">{e.type}</Badge>
            {e.mode === "ambas"
              ? <Badge tone="accent">◑ Colab o exclusivo</Badge>
              : e.mode && <Badge tone={e.mode === "colab" ? "accent" : "neutral"}>{modeOf(e.mode).icon} {modeOf(e.mode).label}</Badge>}
            {evPaid(e) && <Badge tone="green">◆ Pagado</Badge>}
            {evFree(e) && <Badge>○ No pagado</Badge>}
          </div>
          <h1 className="display" style={{ fontSize: "clamp(30px,4vw,46px)" }}>{e.title}</h1>
          <div style={{ color: "var(--ink-soft)", fontSize: 16, marginTop: 8 }}>
            {e.org} · {e.city}{e.location ? ` · ${e.location}` : ""}
          </div>

          <div style={{ display: "flex", gap: 28, marginTop: 26, flexWrap: "wrap" }}>
            {[
              ["Fecha",      `${e.date}${e.time ? ` · ${e.time}` : ""}`],
              ["Presupuesto", evFree(e) && !evPaid(e) ? "Sin pago" : e.budget],
              ["Postulados",  `${e.applicants}`],
            ].map(([k, v]) => (
              <div key={k}>
                <div className="eyebrow" style={{ marginBottom: 4 }}>{k}</div>
                <div className="serif" style={{ fontSize: 20 }}>{v}</div>
              </div>
            ))}
          </div>

          <h3 style={{ fontSize: 20, marginTop: 36, marginBottom: 12 }}>Qué necesita</h3>
          <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
            {e.needs.map(n => <Chip key={n}>{CATEGORIES.find(x => x.id === n)?.icon} {catLabel(n)}</Chip>)}
          </div>

          {e.brief && (
            <>
              <h3 style={{ fontSize: 20, marginTop: 32, marginBottom: 10 }}>Brief</h3>
              <p style={{ fontSize: 16, lineHeight: 1.6, color: "var(--ink-soft)", maxWidth: 560 }}>{e.brief}</p>
            </>
          )}
        </div>

        <div style={{ position: "sticky", top: 24 }}>
          <Card pad style={{ "--pad": "22px" }}>
            <Button full size="lg" onClick={() => onPropose && onPropose(e.id)}>Enviar propuesta</Button>
            <Button full variant="ghost" style={{ marginTop: 10 }} onClick={() => go("dashboard")}>Enviar mensaje</Button>
            <div style={{ fontSize: 12.5, color: "var(--ink-faint)", marginTop: 14, textAlign: "center" }}>
              El productor verá tu perfil y tu propuesta.
            </div>
          </Card>
          {suggested.length > 0 && (
            <div style={{ marginTop: 22 }}>
              <div className="eyebrow" style={{ marginBottom: 12 }}>Creadores que encajan</div>
              <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
                {suggested.map(c => (
                  <button key={c.id} onClick={() => go("profile", c.id)}
                    style={{ display: "flex", gap: 11, alignItems: "center", padding: "10px 12px", borderRadius: "var(--r)",
                      background: "var(--panel)", border: "1px solid var(--line-soft)", textAlign: "left" }}>
                    <Avatar name={c.name} hue={c.accent} size={38} src={c.photo} />
                    <div style={{ flex: 1, minWidth: 0 }}>
                      <div style={{ fontWeight: 600, fontSize: 13.5 }}>{c.name}</div>
                      <div style={{ fontSize: 12, color: "var(--ink-faint)" }}>{tierOf(c.tier).label} · {c.city}</div>
                    </div>
                    <span style={{ color: "var(--ink-faint)" }}>→</span>
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export function ProposalModal({ eventId, onClose, onSubmit }) {
  const e = eventById(eventId) || EVENTS[0];
  const [amount,   setAmount]   = useState("");
  const [includes, setIncludes] = useState(e.needs ? [...e.needs] : []);
  const [mode,     setMode]     = useState(e.mode === "ambas" ? "colab" : (e.mode || "colab"));
  const [note,     setNote]     = useState("");
  const [sent,     setSent]     = useState(false);
  const toggleInc = id => setIncludes(includes.includes(id) ? includes.filter(x => x !== id) : [...includes, id]);

  const paid = evPaid(e);
  const submit = () => {
    const incLabels = includes.map(catLabel).join(", ");
    const composed = `${incLabels ? "Incluye: " + incLabels : ""}${incLabels && note ? " · " : ""}${note}`.trim() || "Propuesta enviada.";
    setSent(true);
    setTimeout(() => onSubmit({ eventId, amount: paid ? amount : "Colaboración", mode, note: composed }), 850);
  };

  return (
    <div onClick={onClose} style={{ position: "fixed", inset: 0, zIndex: 200, background: "oklch(0.2 0.01 75 / 0.45)",
      backdropFilter: "blur(4px)", display: "grid", placeItems: "center", padding: 20 }}>
      <div onClick={ev => ev.stopPropagation()} className="fade-in" style={{ background: "var(--panel)", borderRadius: "var(--r-xl)",
        boxShadow: "var(--shadow-lg)", width: "min(520px, 100%)", maxHeight: "90vh", overflowY: "auto",
        padding: "clamp(24px,4vw,36px)", position: "relative" }}>
        <button onClick={onClose} aria-label="Cerrar" style={{ position: "absolute", top: 18, right: 20, fontSize: 22, color: "var(--ink-faint)", lineHeight: 1 }}>×</button>

        {sent ? (
          <div style={{ textAlign: "center", padding: "30px 10px" }}>
            <div style={{ width: 56, height: 56, borderRadius: 99, margin: "0 auto 18px", background: "var(--accent)",
              color: "var(--on-accent)", display: "grid", placeItems: "center", fontSize: 26 }}>✓</div>
            <h2 className="display" style={{ fontSize: 26 }}>¡Propuesta enviada!</h2>
            <p style={{ color: "var(--ink-soft)", marginTop: 8, fontSize: 14.5 }}>
              {e.org} la verá en su panel. Te avisamos cuando responda.
            </p>
          </div>
        ) : (
          <>
            <div className="eyebrow" style={{ marginBottom: 10 }}>Enviar propuesta</div>
            <h2 className="display" style={{ fontSize: 26, lineHeight: 1.1 }}>{e.title}</h2>
            <div style={{ fontSize: 13.5, color: "var(--ink-faint)", marginTop: 5 }}>
              {e.org} · {e.city} · {e.date}{e.time ? ` · ${e.time}` : ""}
            </div>
            <div style={{ display: "flex", gap: 6, flexWrap: "wrap", marginTop: 10 }}>
              {paid ? <Badge tone="green">◆ Pagado · {e.budget}</Badge> : <Badge>○ No pagado</Badge>}
            </div>

            <div style={{ display: "flex", flexDirection: "column", gap: 18, marginTop: 22 }}>
              {paid && (
                <Field label="Tu tarifa para este evento" hint={e.budget ? `Presupuesto del productor: ${e.budget}` : undefined}>
                  <TextInput value={amount} onChange={setAmount} placeholder="Ej. $1.500" />
                </Field>
              )}
              <Field label="Qué incluye tu propuesta" hint="Marca lo que entregarías.">
                <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
                  {(e.needs || []).map(n => (
                    <Chip key={n} active={includes.includes(n)} onClick={() => toggleInc(n)}>{catLabel(n)}</Chip>
                  ))}
                  {(!e.needs || e.needs.length === 0) && CATEGORIES.slice(0, 4).map(c => (
                    <Chip key={c.id} active={includes.includes(c.id)} onClick={() => toggleInc(c.id)}>{c.label}</Chip>
                  ))}
                </div>
              </Field>
              {e.mode === "ambas" && (
                <Field label="Modalidad de entrega">
                  <div style={{ display: "flex", gap: 8 }}>
                    {[["colab", "Colaboración"], ["exclusivo", "Uso exclusivo"]].map(([k, lbl]) => (
                      <Chip key={k} active={mode === k} onClick={() => setMode(k)}>{lbl}</Chip>
                    ))}
                  </div>
                </Field>
              )}
              <Field label="Mensaje para el productor" hint="Preséntate y cuéntale por qué encajas.">
                <TextArea value={note} onChange={setNote} rows={3}
                  placeholder="Hola, me encantaría cubrir este evento. Entrego en 72h y…" />
              </Field>
            </div>

            <div style={{ display: "flex", gap: 10, marginTop: 24 }}>
              <Button variant="ghost" onClick={onClose}>Cancelar</Button>
              <Button full onClick={submit}>Enviar propuesta →</Button>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
