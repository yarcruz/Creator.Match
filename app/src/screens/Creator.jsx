import { useState, useRef } from 'react';
import {
  Button, Card, Chip, Avatar, Badge, Field, TextInput, TextArea,
  OptionTile, Stepper, PhotoUpload, LocationSelect, inputStyleSelect,
} from '../components/ui.jsx';
import {
  CATEGORIES, EVENT_TYPES, MODALITIES, TIERS, PAY_PREFS, CREATOR_STEPS, CREATOR_TAGS,
  catLabel, modeOf, tierOf, payPrefLabel, linkSource, isBucketLink,
} from '../data.js';

const selStyle = {
  padding: "10px 14px", borderRadius: "var(--r)", border: "1px solid var(--line)",
  background: "var(--canvas)", fontSize: 14.5, color: "var(--ink)", cursor: "pointer",
};

function FlowShell({ steps, current, title, kicker, children, onBack, onNext, nextLabel, backLabel, preview, canNext = true }) {
  return (
    <div className="fade-in" style={{ maxWidth: 1080, margin: "0 auto", padding: "32px clamp(20px,4vw,40px) 60px" }}>
      <div style={{ marginBottom: 30 }}><Stepper steps={steps} current={current} /></div>
      <div style={{ display: "grid", gridTemplateColumns: preview ? "1.25fr 1fr" : "1fr", gap: 44, alignItems: "start" }} className="flow-grid">
        <div>
          <div className="eyebrow" style={{ marginBottom: 12 }}>{kicker}</div>
          <h1 className="display" style={{ fontSize: "clamp(28px,3.6vw,42px)", marginBottom: 28 }}>{title}</h1>
          <div style={{ display: "flex", flexDirection: "column", gap: 22 }}>{children}</div>
          <div style={{ display: "flex", gap: 12, marginTop: 36, alignItems: "center" }}>
            <Button variant="ghost" onClick={onBack}>{backLabel || "Atrás"}</Button>
            <Button onClick={onNext} style={{ opacity: canNext ? 1 : 0.5, pointerEvents: canNext ? "auto" : "none" }}>
              {nextLabel || "Continuar →"}
            </Button>
            <span style={{ marginLeft: "auto", fontSize: 13, color: "var(--ink-faint)" }}>
              Paso {current + 1} de {steps.length}
            </span>
          </div>
        </div>
        {preview && <div style={{ position: "sticky", top: 24 }}>{preview}</div>}
      </div>
    </div>
  );
}

export function CreatorPreviewCard({ data, large }) {
  const hue = 264;
  const pay = PAY_PREFS.find(p => p.id === data.payPref);
  const role = data.types && data.types.length ? catLabel(data.types[0]) : "Creador de contenido";
  return (
    <div>
      {!large && <div className="eyebrow" style={{ marginBottom: 12 }}>Vista previa en vivo</div>}
      <Card style={{ overflow: "hidden" }}>
        <div className="ph" style={{ height: 120 }}><span>cover</span></div>
        <div style={{ padding: 22 }}>
          <div style={{ display: "flex", gap: 13, alignItems: "center", marginTop: -44 }}>
            <Avatar name={data.name || "Tu Nombre"} hue={hue} size={64} ring src={data.photo} />
          </div>
          <div style={{ marginTop: 14 }}>
            <div style={{ fontWeight: 700, fontSize: 17 }}>{data.name || "Tu nombre"}</div>
            <div style={{ fontSize: 13.5, color: "var(--ink-faint)" }}>{role} · {data.city}</div>
          </div>
          {(data.types && data.types.length > 0 || data.tier) && (
            <div style={{ display: "flex", gap: 6, flexWrap: "wrap", marginTop: 14 }}>
              {data.tier && <Badge tone={data.tier === "pro" ? "accent" : "neutral"}>{tierOf(data.tier).icon} Cobertura {tierOf(data.tier).label}</Badge>}
              {data.types && data.types.slice(0, 3).map(f => <Chip key={f}>{catLabel(f)}</Chip>)}
            </div>
          )}
          {(data.modes && data.modes.length > 0 || pay) && (
            <div style={{ display: "flex", gap: 6, flexWrap: "wrap", marginTop: 10 }}>
              {data.modes && data.modes.map(m => <Badge key={m} tone={m === "colab" ? "accent" : "neutral"}>{modeOf(m).icon} {modeOf(m).label}</Badge>)}
              {pay && pay.id !== "sinpago" && <Badge tone="green">$ {pay.id === "pago" ? "Con pago" : "Pago / colab"}</Badge>}
              {pay && pay.id === "sinpago" && <Badge>Colaboraciones</Badge>}
            </div>
          )}
          {data.bio && <p style={{ fontSize: 13.5, color: "var(--ink-soft)", marginTop: 14, lineHeight: 1.5 }}>{data.bio}</p>}
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginTop: 18,
            paddingTop: 16, borderTop: "1px solid var(--line-soft)" }}>
            <span style={{ fontSize: 13.5, color: "var(--ink-faint)" }}>{data.avail}</span>
            <span style={{ fontWeight: 700 }}>{data.payPref === "sinpago" ? "Sin costo" : (data.rate ? `${data.rate} / ${data.rateUnit}` : "Tarifa")}</span>
          </div>
        </div>
      </Card>
    </div>
  );
}

function PortfolioBuilder({ value, onChange, monetize }) {
  const [url,   setUrl]   = useState("");
  const [title, setTitle] = useState("");
  const [err,   setErr]   = useState("");
  const fileRef = useRef(null);
  const list = value || [];
  const FREE_LIMIT = 3;

  const addImage = (e) => {
    const files = [...(e.target.files || [])];
    let next = [...list];
    let pending = files.length;
    files.forEach(file => {
      const reader = new FileReader();
      reader.onload = (ev) => {
        const img = new Image();
        img.onload = () => {
          const W = 480, scale = Math.min(1, W / img.width);
          const canvas = document.createElement("canvas");
          canvas.width = img.width * scale; canvas.height = img.height * scale;
          canvas.getContext("2d").drawImage(img, 0, 0, canvas.width, canvas.height);
          next = [...next, { type: "img", src: canvas.toDataURL("image/jpeg", 0.78), title: file.name.replace(/\.[^.]+$/, "") }];
          if (--pending === 0) onChange(next);
          else onChange(next);
        };
        img.src = ev.target.result;
      };
      reader.readAsDataURL(file);
    });
    if (fileRef.current) fileRef.current.value = "";
  };

  const addLink = () => {
    const u = url.trim();
    if (!u) return;
    if (isBucketLink(u)) {
      setErr("Ese es un enlace de carpeta (Drive, Dropbox, WeTransfer…). Sube las piezas o enlaza un solo video/post — así cada trabajo cuenta por separado.");
      return;
    }
    if (!/^https?:\/\//i.test(u)) { setErr("Pega un enlace válido que empiece con https://"); return; }
    setErr("");
    const t = title.trim() || (linkSource(u).label + " · pieza");
    onChange([...list, { type: "link", url: u, title: t }]);
    setUrl(""); setTitle("");
  };
  const remove = i => onChange(list.filter((_, j) => j !== i));

  return (
    <div>
      {list.length > 0 && (
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(120px,1fr))", gap: 10, marginBottom: 14 }}>
          {list.map((p, i) => {
            const s = p.type === "link" ? linkSource(p.url) : null;
            const over = monetize && i >= FREE_LIMIT;
            return (
              <div key={i} style={{ position: "relative", borderRadius: 12, overflow: "hidden",
                border: `1px solid ${over ? "var(--accent)" : "var(--line)"}`, background: "var(--canvas)" }}>
                {p.type === "img"
                  ? <img src={p.src} alt={p.title} style={{ width: "100%", height: 84, objectFit: "cover", display: "block" }} />
                  : <div className="ph" style={{ height: 84 }}><span>{s.icon} {s.label}</span></div>}
                <div style={{ padding: "7px 9px", fontSize: 11.5, fontWeight: 600, overflow: "hidden",
                  textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{p.title}</div>
                {over && <div style={{ position: "absolute", top: 6, left: 6 }}><Badge tone="accent">Pro</Badge></div>}
                <button onClick={() => remove(i)} title="Quitar" style={{ position: "absolute", top: 5, right: 6,
                  width: 22, height: 22, borderRadius: 99, background: "oklch(0.2 0.01 75 / 0.55)", color: "#fff",
                  fontSize: 14, lineHeight: 1, display: "grid", placeItems: "center" }}>×</button>
              </div>
            );
          })}
        </div>
      )}
      <div style={{ display: "flex", gap: 10, flexWrap: "wrap", alignItems: "center" }}>
        <Button variant="ghost" onClick={() => fileRef.current && fileRef.current.click()}>＋ Subir fotos / clips</Button>
        <input ref={fileRef} type="file" accept="image/*" multiple onChange={addImage} style={{ display: "none" }} />
        <span style={{ fontSize: 12.5, color: "var(--ink-faint)" }}>o enlaza una sola pieza ↓</span>
      </div>
      <div style={{ display: "flex", gap: 10, flexWrap: "wrap", marginTop: 10 }}>
        <div style={{ flex: "1 1 150px" }}>
          <input value={title} onChange={e => setTitle(e.target.value)} placeholder="Título (opcional)"
            style={{ width: "100%", padding: "12px 14px", borderRadius: "var(--r)", background: "var(--canvas)",
              color: "var(--ink)", border: "1px solid var(--line)", outline: "none", fontSize: 14.5 }} />
        </div>
        <div style={{ flex: "2 1 220px" }}>
          <input value={url} onChange={e => { setUrl(e.target.value); setErr(""); }}
            placeholder="https://youtu.be/… o vimeo.com/…"
            style={{ width: "100%", padding: "12px 14px", borderRadius: "var(--r)", background: "var(--canvas)",
              color: "var(--ink)", border: "1px solid var(--line)", outline: "none", fontSize: 14.5 }} />
        </div>
        <Button variant="soft" onClick={addLink}>Añadir pieza</Button>
      </div>
      {err && <div style={{ fontSize: 12.5, color: "oklch(0.52 0.16 25)", marginTop: 8, lineHeight: 1.4 }}>⚠ {err}</div>}
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginTop: 12, fontSize: 12.5, color: "var(--ink-faint)" }}>
        <span>{list.length} pieza{list.length === 1 ? "" : "s"}</span>
        <span>Gratis: hasta {FREE_LIMIT} piezas · Pro: ilimitadas</span>
      </div>
    </div>
  );
}

export function CreatorFlow({ go, onPublish, monetize }) {
  const [step, setStep] = useState(0);
  const [data, setData] = useState({
    name: "", email: "", phone: "", city: "Zona Metro", social: "", photo: "",
    eventTypes: [], types: [], modes: [], tier: "", gear: "", tags: [], bio: "", projects: [],
    payPref: "", rate: "", rateUnit: "evento", avail: "Esta semana", message: "",
  });
  const set = (k, v) => setData(d => ({ ...d, [k]: v }));
  const toggleArr = (k, v) => setData(d => ({ ...d, [k]: d[k].includes(v) ? d[k].filter(x => x !== v) : [...d[k], v] }));

  const MODE_CHOICES = [
    { id: "colab",    label: "Colaboración",  icon: "⇄", sub: "Se publica en tus redes y las del productor.", modes: ["colab"] },
    { id: "exclusivo",label: "Uso exclusivo", icon: "●", sub: "Contenido solo para las redes del productor.", modes: ["exclusivo"] },
    { id: "ambas",    label: "Ambas",         icon: "◑", sub: "Acepto colaboración o uso exclusivo.",         modes: ["colab", "exclusivo"] },
  ];
  const modeChoice = data.modes.length === 2 ? "ambas" : data.modes[0];

  const next = () => step < CREATOR_STEPS.length - 1 ? setStep(step + 1) : (onPublish ? onPublish(data) : go("dashboard"));
  const back = () => step === 0 ? go("landing") : setStep(step - 1);

  const preview = <CreatorPreviewCard data={data} />;

  if (step === 0) return (
    <FlowShell steps={CREATOR_STEPS} current={0} kicker="Registro de creador" title="Empecemos por tus datos"
      onBack={back} onNext={next} backLabel="Cancelar" preview={preview}
      canNext={data.name.length > 1 && data.email.includes("@")}>
      <Field label="Foto de perfil" hint="Cuadrada se ve mejor. Es lo primero que ve el productor.">
        <PhotoUpload value={data.photo} onChange={v => set("photo", v)} name={data.name} />
      </Field>
      <Field label="Nombre o nombre artístico">
        <TextInput value={data.name} onChange={v => set("name", v)} placeholder="Ej. Mariana Restrepo" />
      </Field>
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16 }}>
        <Field label="Correo electrónico">
          <TextInput type="email" value={data.email} onChange={v => set("email", v)} placeholder="hola@correo.com" />
        </Field>
        <Field label="Teléfono">
          <TextInput value={data.phone} onChange={v => set("phone", v)} placeholder="+1 787 000 0000" />
        </Field>
      </div>
      <Field label="Disponible para trabajar en" hint="Tu zona o pueblo base, o toda la isla.">
        <LocationSelect value={data.city} onChange={v => set("city", v)} includeIsla style={{ ...inputStyleSelect() }} />
      </Field>
      <Field label="Social links" hint="Instagram, TikTok, portafolio, YouTube… separa con comas.">
        <TextInput value={data.social} onChange={v => set("social", v)} placeholder="instagram.com/tucuenta, tiktok.com/@tucuenta" />
      </Field>
    </FlowShell>
  );

  if (step === 1) return (
    <FlowShell steps={CREATOR_STEPS} current={1} kicker="Qué cubres" title="¿Qué tipo de contenido haces?"
      onBack={back} onNext={next} preview={preview} canNext={data.types.length > 0 && data.modes.length > 0 && !!data.tier}>
      <Field label="Formatos que cubres" hint="Elige todos los que ofreces. «Full package» cubre el evento entero: antes, durante y después, con promo del próximo.">
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10 }}>
          {CATEGORIES.map(c => (
            <OptionTile key={c.id} icon={c.icon} label={c.label}
              active={data.types.includes(c.id)} onClick={() => toggleArr("types", c.id)} />
          ))}
        </div>
      </Field>
      <Field label="Tipos de evento que cubres" hint="¿Qué clase de eventos te interesan?">
        <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
          {EVENT_TYPES.map(t => <Chip key={t} active={data.eventTypes.includes(t)} onClick={() => toggleArr("eventTypes", t)}>{t}</Chip>)}
        </div>
      </Field>
      <Field label="Nivel de cobertura" hint="Sencilla (económica), Pro (profesional) o ambas.">
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 10 }}>
          {Object.values(TIERS).map(tr => (
            <OptionTile key={tr.id} icon={tr.icon} label={tr.label}
              sub={tr.id === "sencilla" ? "Económica" : tr.id === "pro" ? "Profesional" : "Según el evento"}
              active={data.tier === tr.id} onClick={() => set("tier", tr.id)} />
          ))}
        </div>
      </Field>
      <Field label="Modalidad de entrega" hint="Colaboración, uso exclusivo o ambas.">
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 10 }}>
          {MODE_CHOICES.map(m => (
            <OptionTile key={m.id} icon={m.icon} label={m.label} sub={m.sub}
              active={modeChoice === m.id} onClick={() => set("modes", m.modes)} />
          ))}
        </div>
      </Field>
      <Field label="Gear (equipo)" hint="Sepáralo con comas — se mostrará como lista en tu perfil.">
        <TextArea value={data.gear} onChange={v => set("gear", v)} rows={2}
          placeholder="Sony A7IV, 24-70 f2.8, drone DJI Mini 4, micrófono Rode, kit de luces LED" />
      </Field>
      <Field label="Etiquetas que te definen" hint="Ayudan a que los productores te encuentren.">
        <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
          {CREATOR_TAGS.map(tg => <Chip key={tg} active={data.tags.includes(tg)} onClick={() => toggleArr("tags", tg)}>{tg}</Chip>)}
        </div>
      </Field>
    </FlowShell>
  );

  if (step === 2) return (
    <FlowShell steps={CREATOR_STEPS} current={2} kicker="Portafolio" title="Enlaza tu mejor trabajo"
      onBack={back} onNext={next} preview={preview}>
      <Field label="Piezas de portafolio" hint="Sube fotos o clips, o pega el enlace de UNA pieza (un video de YouTube/Vimeo, un post). Cada pieza cuenta por separado.">
        <PortfolioBuilder value={data.projects} onChange={v => set("projects", v)} monetize={monetize} />
      </Field>
      <Field label="Sobre ti" hint="Un par de líneas sobre cómo trabajas.">
        <TextArea value={data.bio} onChange={v => set("bio", v)} rows={4}
          placeholder="Cubro eventos con una mirada editorial y entrego una galería curada en 72h…" />
      </Field>
    </FlowShell>
  );

  if (step === 3) return (
    <FlowShell steps={CREATOR_STEPS} current={3} kicker="Preferencias" title="¿Qué eventos quieres recibir?"
      onBack={back} onNext={next} preview={preview} canNext={!!data.payPref}>
      <Field label="Preferencia de eventos" hint="Filtramos las invitaciones según lo que elijas.">
        <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
          {PAY_PREFS.map(p => (
            <OptionTile key={p.id} icon={p.icon} label={p.label} sub={p.sub}
              active={data.payPref === p.id} onClick={() => set("payPref", p.id)} />
          ))}
        </div>
      </Field>
      {data.payPref !== "sinpago" && (
        <Field label="Tarifa base" hint={data.payPref === "todos" ? "Para los eventos remunerados." : undefined}>
          <div style={{ display: "flex", gap: 10 }}>
            <div style={{ flex: 1 }}><TextInput value={data.rate} onChange={v => set("rate", v)} placeholder="$480" /></div>
            <select value={data.rateUnit} onChange={e => set("rateUnit", e.target.value)} style={{ ...selStyle }}>
              <option value="evento">por evento</option>
              <option value="hora">por hora</option>
              <option value="dia">por día</option>
              <option value="cotizacion">a cotizar</option>
            </select>
          </div>
        </Field>
      )}
      <Field label="Disponibilidad actual">
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10 }}>
          {["Esta semana", "Este mes", "Fines de semana", "Con 3 semanas"].map(a => (
            <OptionTile key={a} label={a} active={data.avail === a} onClick={() => set("avail", a)} />
          ))}
        </div>
      </Field>
      <Field label="Mensaje para el productor" hint="Lo verán quienes te inviten. Cuéntales cómo trabajas o qué te interesa.">
        <TextArea value={data.message} onChange={v => set("message", v)} rows={3}
          placeholder="Me encanta cubrir eventos de marca y bodas. Entrego rápido y soy fácil de coordinar…" />
      </Field>
    </FlowShell>
  );

  const payLabel = (PAY_PREFS.find(p => p.id === data.payPref) || {}).label;
  return (
    <FlowShell steps={CREATOR_STEPS} current={4} kicker="Casi listo" title="Revisa cómo te verán los productores"
      onBack={back} onNext={next} nextLabel="Publicar mi perfil ✓">
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 20 }} className="flow-grid">
        <CreatorPreviewCard data={data} large />
        <div>
          <h3 style={{ fontSize: 20, marginBottom: 14 }}>Antes de publicar</h3>
          {[
            ["Contacto",   data.email ? "Correo y teléfono" : "Falta correo",                    !!data.email],
            ["Qué cubres", data.types.length ? `${data.types.length} formato(s)` : "Pendiente",  data.types.length > 0],
            ["Cobertura",  data.tier ? tierOf(data.tier).label : "Pendiente",                    !!data.tier],
            ["Modalidad",  data.modes.length ? data.modes.map(m => modeOf(m).label).join(" + ") : "Pendiente", data.modes.length > 0],
            ["Preferencia",payLabel || "Pendiente",                                               !!data.payPref],
          ].map(([k, v, ok]) => (
            <div key={k} style={{ display: "flex", justifyContent: "space-between", alignItems: "center",
              padding: "13px 0", borderBottom: "1px solid var(--line-soft)" }}>
              <span style={{ fontWeight: 600, fontSize: 14 }}>{k}</span>
              <Badge tone={ok ? "green" : "amber"}>{ok ? "✓ " : "• "}{v}</Badge>
            </div>
          ))}
          <p style={{ fontSize: 13.5, color: "var(--ink-faint)", marginTop: 18, lineHeight: 1.5 }}>
            Podrás editar todo después. Al publicar empezarás a recibir invitaciones a eventos que coincidan contigo.
          </p>
        </div>
      </div>
    </FlowShell>
  );
}
