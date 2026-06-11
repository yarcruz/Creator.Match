import { useState } from 'react';
import {
  Avatar, Button, Card, Chip, Stars, Badge, LocationSelect, inputStyleSelect,
} from '../components/ui.jsx';
import {
  CREATORS, CATEGORIES, MODALITIES, TIERS,
  catLabel, modeOf, tierOf, payPrefLabel, creatorById,
} from '../data.js';

const selStyle = {
  padding: "10px 14px", borderRadius: 99, border: "1px solid var(--line)",
  background: "var(--panel)", fontSize: 13.5, fontWeight: 500, color: "var(--ink)", cursor: "pointer",
};

export function ModeBadges({ modes }) {
  return (
    <span style={{ display: "inline-flex", gap: 6, flexWrap: "wrap" }}>
      {modes.map(m => (
        <Badge key={m} tone={m === "colab" ? "accent" : "neutral"}>{modeOf(m).icon} {modeOf(m).label}</Badge>
      ))}
    </span>
  );
}

export function CreatorCard({ c, onClick, cardStyle = "bordered", monetize }) {
  if (cardStyle === "row") {
    return (
      <Card hover onClick={onClick} style={{ display: "flex", gap: 18, alignItems: "center", padding: "18px 20px" }}>
        <Avatar name={c.name} hue={c.accent} size={56} src={c.photo} />
        <div style={{ flex: 1, minWidth: 0 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
            <span style={{ fontWeight: 700, fontSize: 16 }}>{c.name}</span>
            {c.verified && <span title="Verificado" style={{ color: "var(--accent)", fontSize: 13 }}>✦</span>}
            {c.mine && <Badge tone="accent">Tú</Badge>}
          </div>
          <div style={{ fontSize: 13.5, color: "var(--ink-soft)" }}>{c.role} · {c.city}</div>
          <div style={{ display: "flex", gap: 6, marginTop: 8, flexWrap: "wrap" }}>
            {c.formats.slice(0, 3).map(f => <Chip key={f}>{catLabel(f)}</Chip>)}
          </div>
        </div>
        <div style={{ textAlign: "right", flexShrink: 0 }}>
          <Stars value={c.rating} count={c.reviews} />
          <div style={{ marginTop: 8, display: "flex", gap: 6, justifyContent: "flex-end", flexWrap: "wrap" }}>
            <Badge tone={c.tier === "pro" ? "accent" : "neutral"}>{tierOf(c.tier).icon} {tierOf(c.tier).label}</Badge>
            <ModeBadges modes={c.modes} />
          </div>
          <div style={{ fontWeight: 700, fontSize: 14, marginTop: 8 }}>{c.rate}</div>
        </div>
      </Card>
    );
  }

  const imageForward = cardStyle === "image";
  return (
    <Card hover onClick={onClick} style={{ overflow: "hidden", display: "flex", flexDirection: "column" }}>
      {imageForward && (
        <div className="ph" style={{ height: 168, position: "relative" }}>
          <span>portafolio · {catLabel(c.formats[0]).toLowerCase()}</span>
          {c.top && <div style={{ position: "absolute", top: 12, left: 12 }}><Badge tone="accent">★ Top rated</Badge></div>}
          {monetize && c.top && <div style={{ position: "absolute", top: 12, right: 12 }}><Badge tone="accent">Pro</Badge></div>}
        </div>
      )}
      <div style={{ padding: 22, display: "flex", flexDirection: "column", flex: 1 }}>
        <div style={{ display: "flex", gap: 13, alignItems: "center" }}>
          <Avatar name={c.name} hue={c.accent} size={imageForward ? 44 : 52} ring={!imageForward} src={c.photo} />
          <div style={{ minWidth: 0 }}>
            <div style={{ display: "flex", alignItems: "center", gap: 7 }}>
              <span style={{ fontWeight: 700, fontSize: 15.5 }}>{c.name}</span>
              {c.verified && <span title="Verificado" style={{ color: "var(--accent)", fontSize: 12 }}>✦</span>}
              {c.mine && <Badge tone="accent">Tú</Badge>}
            </div>
            <div style={{ fontSize: 13, color: "var(--ink-faint)" }}>{c.role}</div>
          </div>
        </div>
        {!imageForward && (
          <div className="ph" style={{ height: 116, borderRadius: 12, marginTop: 16 }}><span>portafolio</span></div>
        )}
        <p style={{ fontSize: 13.5, color: "var(--ink-soft)", marginTop: 14, lineHeight: 1.5,
          display: "-webkit-box", WebkitLineClamp: 2, WebkitBoxOrient: "vertical", overflow: "hidden" }}>{c.bio}</p>
        <div style={{ display: "flex", gap: 6, marginTop: 14, flexWrap: "wrap" }}>
          {c.formats.slice(0, 3).map(f => <Chip key={f}>{catLabel(f)}</Chip>)}
        </div>
        <div style={{ marginTop: 12, display: "flex", gap: 6, flexWrap: "wrap", alignItems: "center" }}>
          <Badge tone={c.tier === "pro" ? "accent" : "neutral"}>{tierOf(c.tier).icon} {tierOf(c.tier).label}</Badge>
          <ModeBadges modes={c.modes} />
        </div>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginTop: 16, paddingTop: 16,
          borderTop: "1px solid var(--line-soft)" }}>
          <Stars value={c.rating} count={c.reviews} />
          <span style={{ fontWeight: 700, fontSize: 14 }}>{c.rate}</span>
        </div>
      </div>
    </Card>
  );
}

export function Explore({ go, t, highlight, monetize }) {
  const [cat,  setCat]  = useState("all");
  const [city, setCity] = useState("all");
  const [mode, setMode] = useState("all");
  const [tier, setTier] = useState("all");
  const [pay,  setPay]  = useState("all");
  const [sort, setSort] = useState("relevancia");
  const justAdded = highlight && creatorById(highlight);

  let list = CREATORS.filter(c =>
    (cat  === "all" || c.formats.includes(cat)) &&
    (city === "all" || c.city === city || c.city === "Toda la isla") &&
    (mode === "all" || c.modes.includes(mode)) &&
    (tier === "all" || c.tier === tier || c.tier === "ambas") &&
    (pay  === "all" || c.payPref === pay));
  if (sort === "rating")  list = [...list].sort((a, b) => b.rating - a.rating);
  if (sort === "precio")  list = [...list].sort((a, b) => (a.tier === "sencilla" ? 0 : 1) - (b.tier === "sencilla" ? 0 : 1));

  return (
    <div className="fade-in" style={{ maxWidth: "var(--maxw)", margin: "0 auto", padding: "40px clamp(20px,4vw,40px) 80px" }}>
      {justAdded && (
        <div style={{ display: "flex", alignItems: "center", gap: 12, padding: "14px 18px", marginBottom: 22,
          borderRadius: "var(--r)", background: "var(--accent-wash)", color: "var(--accent-ink)", border: "1px solid var(--accent)" }}>
          <span style={{ width: 26, height: 26, borderRadius: 99, background: "var(--accent)", color: "var(--on-accent)",
            display: "grid", placeItems: "center", flexShrink: 0, fontWeight: 700 }}>✓</span>
          <span style={{ fontWeight: 600, fontSize: 14.5 }}>¡Tu perfil de {justAdded.name} ya está publicado!</span>
          <Button size="sm" variant="soft" style={{ marginLeft: "auto" }} onClick={() => go("profile", justAdded.id)}>Ver mi perfil</Button>
        </div>
      )}
      <div style={{ marginBottom: 28 }}>
        <div className="eyebrow" style={{ marginBottom: 12 }}>Explorar creadores</div>
        <h1 className="display" style={{ fontSize: "clamp(32px,4.4vw,56px)" }}>
          {list.length} creadores que cubren {cat !== "all" ? catLabel(cat).toLowerCase() : "tu evento"}
        </h1>
      </div>

      <div style={{ display: "flex", gap: 8, flexWrap: "wrap", alignItems: "center", marginBottom: 18 }}>
        <Chip active={cat === "all"} onClick={() => setCat("all")}>Todos los formatos</Chip>
        {CATEGORIES.map(c => <Chip key={c.id} active={cat === c.id} onClick={() => setCat(c.id)}>{c.icon} {c.label}</Chip>)}
      </div>
      <div style={{ display: "flex", gap: 10, alignItems: "center", marginBottom: 30, flexWrap: "wrap" }}>
        <select value={tier} onChange={e => setTier(e.target.value)} style={selStyle}>
          <option value="all">Cobertura: todas</option>
          <option value="sencilla">Cobertura sencilla</option>
          <option value="pro">Cobertura pro</option>
          <option value="ambas">Cobertura ambas</option>
        </select>
        <select value={pay} onChange={e => setPay(e.target.value)} style={selStyle}>
          <option value="all">Preferencia de pago: todas</option>
          <option value="pago">Solo eventos con pago</option>
          <option value="todos">Todos los eventos</option>
          <option value="sinpago">Solo eventos sin pago</option>
        </select>
        <LocationSelect value={city} onChange={setCity} includeAll allLabel="Disponibles en: toda ubicación" style={selStyle} />
        <select value={mode} onChange={e => setMode(e.target.value)} style={selStyle}>
          <option value="all">Toda modalidad</option>
          <option value="colab">Colaboración</option>
          <option value="exclusivo">Uso exclusivo</option>
        </select>
        <select value={sort} onChange={e => setSort(e.target.value)} style={selStyle}>
          <option value="relevancia">Ordenar: relevancia</option>
          <option value="rating">Ordenar: mejor valorados</option>
          <option value="precio">Ordenar: más económicos</option>
        </select>
        <span style={{ marginLeft: "auto", fontSize: 13.5, color: "var(--ink-faint)" }}>{list.length} resultados</span>
      </div>

      {t.cardStyle === "row" ? (
        <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
          {list.map(c => <CreatorCard key={c.id} c={c} cardStyle="row" monetize={monetize} onClick={() => go("profile", c.id)} />)}
        </div>
      ) : (
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(280px, 1fr))", gap: "var(--gap)" }}>
          {list.map(c => <CreatorCard key={c.id} c={c} cardStyle={t.cardStyle} monetize={monetize} onClick={() => go("profile", c.id)} />)}
        </div>
      )}
    </div>
  );
}

export function CreatorProfile({ id, go }) {
  const c = creatorById(id) || CREATORS[0];
  return (
    <div className="fade-in" style={{ maxWidth: 980, margin: "0 auto", padding: "32px clamp(20px,4vw,40px) 80px" }}>
      <Button variant="link" onClick={() => go("explore")} style={{ marginBottom: 22 }}>← Volver a explorar</Button>

      <div className="ph" style={{ height: 220, borderRadius: "var(--r-lg)" }}><span>cover · trabajo destacado</span></div>

      <div style={{ display: "grid", gridTemplateColumns: "1.6fr 1fr", gap: 40, marginTop: -50, position: "relative", alignItems: "start" }} className="profile-grid">
        <div>
          <div style={{ display: "flex", gap: 18, alignItems: "flex-end", padding: "0 4px" }}>
            <Avatar name={c.name} hue={c.accent} size={104} ring src={c.photo} />
            <div style={{ paddingBottom: 6 }}>
              <div style={{ display: "flex", alignItems: "center", gap: 9, flexWrap: "wrap" }}>
                <h1 className="display" style={{ fontSize: 38 }}>{c.name}</h1>
                {c.verified && <Badge tone="accent">✦ Verificado</Badge>}
                <Badge tone={c.tier === "pro" ? "accent" : "neutral"}>{tierOf(c.tier).icon} Cobertura {tierOf(c.tier).label}</Badge>
              </div>
              <div style={{ color: "var(--ink-soft)", fontSize: 16, marginTop: 4 }}>{c.role} · {c.city}</div>
            </div>
          </div>

          <p style={{ fontSize: 17, lineHeight: 1.6, color: "var(--ink-soft)", marginTop: 28, maxWidth: 540 }}>{c.bio}</p>

          <div style={{ marginTop: 24 }}>
            <div className="eyebrow" style={{ marginBottom: 10 }}>Qué cubro</div>
            <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
              {c.formats.map(f => <Chip key={f}>{CATEGORIES.find(x => x.id === f)?.icon} {catLabel(f)}</Chip>)}
            </div>
          </div>
          <div style={{ marginTop: 18 }}>
            <div className="eyebrow" style={{ marginBottom: 10 }}>Modalidad de entrega</div>
            <ModeBadges modes={c.modes} />
          </div>
          {c.gear && c.gear.length > 0 && (
            <div style={{ marginTop: 18 }}>
              <div className="eyebrow" style={{ marginBottom: 10 }}>Equipo (gear)</div>
              <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
                {c.gear.map((g, i) => (
                  <span key={i} style={{ fontSize: 13, fontWeight: 500, padding: "6px 12px", borderRadius: 8,
                    background: "var(--canvas-2)", color: "var(--ink-soft)", display: "inline-flex", alignItems: "center", gap: 6 }}>
                    <span style={{ color: "var(--accent)" }}>▪</span>{g}
                  </span>
                ))}
              </div>
            </div>
          )}
          <div style={{ display: "flex", gap: 8, flexWrap: "wrap", marginTop: 18 }}>
            {c.tags.map(tg => <Chip key={tg}>{tg}</Chip>)}
          </div>

          <h3 style={{ fontSize: 22, marginTop: 40, marginBottom: 16 }}>Portafolio y proyectos</h3>
          {c.projects && c.projects.length > 0 ? (
            <div style={{ display: "grid", gridTemplateColumns: "repeat(2,1fr)", gap: 14 }}>
              {c.projects.map((p, i) => {
                const isLink = p.type !== "img";
                const s = isLink ? linkSource(p.url) : null;
                const inner = (
                  <>
                    {isLink
                      ? <div className="ph" style={{ height: 116, position: "relative" }}>
                          <span>{s.icon} {s.label}</span>
                          <span style={{ position: "absolute", top: 10, right: 10, fontSize: 13, color: "var(--ink-faint)" }}>↗</span>
                        </div>
                      : <img src={p.src} alt={p.title} style={{ width: "100%", height: 150, objectFit: "cover", display: "block" }} />}
                    <div style={{ padding: "12px 14px" }}>
                      <div style={{ fontWeight: 600, fontSize: 14, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{p.title}</div>
                      <div style={{ fontSize: 12, color: "var(--ink-faint)", marginTop: 2 }}>{isLink ? `Abrir en ${s.label}` : "Foto"}</div>
                    </div>
                  </>
                );
                const boxStyle = { display: "block", borderRadius: 14, overflow: "hidden", border: "1px solid var(--line)",
                  background: "var(--panel)", transition: "box-shadow 0.2s, transform 0.2s" };
                const hov = e => { e.currentTarget.style.boxShadow = "var(--shadow-lg)"; e.currentTarget.style.transform = "translateY(-2px)"; };
                const out = e => { e.currentTarget.style.boxShadow = "none"; e.currentTarget.style.transform = "none"; };
                return isLink
                  ? <a key={i} href={p.url} target="_blank" rel="noreferrer" style={boxStyle} onMouseEnter={hov} onMouseLeave={out}>{inner}</a>
                  : <div key={i} style={boxStyle} onMouseEnter={hov} onMouseLeave={out}>{inner}</div>;
              })}
            </div>
          ) : (
            <div style={{ display: "grid", gridTemplateColumns: "repeat(2,1fr)", gap: 14 }}>
              {["cobertura en vivo", "aftermovie", "entrevista", "reel del evento"].map((p, i) => (
                <div key={i} className="ph" style={{ height: 150, borderRadius: 14 }}><span>{p}</span></div>
              ))}
            </div>
          )}
        </div>

        <div style={{ position: "sticky", top: 24 }}>
          <Card pad style={{ "--pad": "24px" }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline" }}>
              <span className="serif" style={{ fontSize: 26 }}>{c.rate}</span>
            </div>
            <div style={{ display: "flex", gap: 14, marginTop: 14, fontSize: 13.5, color: "var(--ink-soft)" }}>
              <Stars value={c.rating} count={c.reviews} />
              <span>· {c.jobs} eventos</span>
            </div>
            <div style={{ marginTop: 18, padding: "12px 14px", borderRadius: 12, background: "var(--accent-wash)",
              color: "var(--accent-ink)", fontSize: 13.5, fontWeight: 600, display: "flex", alignItems: "center", gap: 8 }}>
              <span style={{ width: 8, height: 8, borderRadius: 99, background: "var(--accent)" }} />
              {c.available}
            </div>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginTop: 16, fontSize: 13.5 }}>
              <span style={{ color: "var(--ink-faint)" }}>Modalidad</span>
              <ModeBadges modes={c.modes} />
            </div>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginTop: 12, fontSize: 13.5 }}>
              <span style={{ color: "var(--ink-faint)" }}>Acepta</span>
              <span style={{ fontWeight: 600 }}>{payPrefLabel(c.payPref)}</span>
            </div>
            <div style={{ display: "flex", flexDirection: "column", gap: 10, marginTop: 18 }}>
              <Button full size="lg" onClick={() => go("dashboard")}>Enviar mensaje</Button>
              <Button full variant="ghost" onClick={() => go("dashboard")}>Invitar a un evento</Button>
            </div>
            <div style={{ fontSize: 12.5, color: "var(--ink-faint)", marginTop: 14, textAlign: "center" }}>{c.response} · sin compromiso</div>
          </Card>
        </div>
      </div>
    </div>
  );
}

// local helper (only used in this file)
function linkSource(url) {
  const u = (url || "").toLowerCase();
  if (/youtu\.?be/.test(u))                return { label: "YouTube", icon: "▶" };
  if (/vimeo/.test(u))                      return { label: "Vimeo",   icon: "▶" };
  if (/drive\.google|docs\.google/.test(u)) return { label: "Google Drive", icon: "◇" };
  if (/instagram/.test(u))                  return { label: "Instagram", icon: "◎" };
  if (/tiktok/.test(u))                     return { label: "TikTok",   icon: "♪" };
  return { label: "Enlace", icon: "↗" };
}
