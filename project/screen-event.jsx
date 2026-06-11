// screen-event.jsx — multi-step "publish an event" flow
// Fields mirror the real Event Submission Form:
// Event Name, Producer Name, Organizer Contact, Event Date, Event Time, Event Location,
// Selección múltiple (No pagado / Pagado), Payment Amount, Message to Creators.
const { useState: useStateV } = React;

const PAY_TYPES = [
  { id: "pago",   label: "Pagado",     icon: "◆" },
  { id: "nopago", label: "No pagado",  icon: "○" },
];

function EventFlow({ go, onPublish }) {
  const [step, setStep] = useStateV(0);
  const [data, setData] = useStateV({
    title: "", producer: "", contact: "", type: "Corporativo",
    date: "", time: "", city: "Zona Metro", location: "",
    needs: [], mode: "", payType: [], amount: "", message: "",
  });
  const set = (k, v) => setData(d => ({ ...d, [k]: v }));
  const toggleArr = (k, v) => setData(d => ({ ...d, [k]: d[k].includes(v) ? d[k].filter(x => x !== v) : [...d[k], v] }));

  const next = () => step < EVENT_STEPS.length - 1 ? setStep(step + 1) : (onPublish ? onPublish(data) : go("dashboard"));
  const back = () => step === 0 ? go("landing") : setStep(step - 1);

  const preview = <EventPreviewCard data={data} />;
  const MODE_CHOICES = [
    { id: "colab", label: "Colaboración", icon: "⇄", sub: "Se publica en ambas redes." },
    { id: "exclusivo", label: "Uso exclusivo", icon: "●", sub: "Solo para tus redes." },
    { id: "ambas", label: "Ambas", icon: "◑", sub: "Abierto a cualquiera." },
  ];

  // 0 — Tu evento
  if (step === 0) return (
    <FlowShell steps={EVENT_STEPS} current={0} kicker="Publicar un evento" title="Cuéntanos qué estás produciendo"
      onBack={back} onNext={next} backLabel="Cancelar" preview={preview} canNext={data.title.length > 2}>
      <Field label="Nombre del evento">
        <TextInput value={data.title} onChange={v => set("title", v)} placeholder="Ej. Lanzamiento de marca — colección cápsula" />
      </Field>
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16 }}>
        <Field label="Productor / empresa">
          <TextInput value={data.producer} onChange={v => set("producer", v)} placeholder="Ej. Atelier Norte" />
        </Field>
        <Field label="Contacto del organizador" hint="Correo o teléfono.">
          <TextInput value={data.contact} onChange={v => set("contact", v)} placeholder="hola@atelier.com" />
        </Field>
      </div>
      <Field label="Tipo de evento">
        <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
          {EVENT_TYPES.map(tp => <Chip key={tp} active={data.type === tp} onClick={() => set("type", tp)}>{tp}</Chip>)}
        </div>
      </Field>
    </FlowShell>
  );

  // 1 — Fecha y lugar
  if (step === 1) return (
    <FlowShell steps={EVENT_STEPS} current={1} kicker="Fecha y lugar" title="¿Cuándo y dónde sucede?"
      onBack={back} onNext={next} preview={preview} canNext={!!data.date}>
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16 }}>
        <Field label="Fecha del evento">
          <TextInput type="date" value={data.date} onChange={v => set("date", v)} />
        </Field>
        <Field label="Hora">
          <TextInput type="time" value={data.time} onChange={v => set("time", v)} />
        </Field>
      </div>
      <Field label="Busca creadores disponibles en" hint="Zona o pueblo de Puerto Rico donde sucede el evento.">
        <LocationSelect value={data.city} onChange={v => set("city", v)} style={{ ...inputStyleSelect() }} />
      </Field>
      <Field label="Lugar / dirección" hint="Venue, salón o dirección donde será.">
        <TextInput value={data.location} onChange={v => set("location", v)} placeholder="Ej. Coliseo, Ave. Pri" />
      </Field>
    </FlowShell>
  );

  // 2 — Qué necesitas
  if (step === 2) return (
    <FlowShell steps={EVENT_STEPS} current={2} kicker="Qué necesitas" title="¿Qué contenido necesitas?"
      onBack={back} onNext={next} preview={preview} canNext={data.needs.length > 0 && !!data.mode}>
      <Field label="Formatos de contenido" hint="Elige todo lo que quieres que se cubra. «Full package» cubre el evento entero: antes, durante y después, con promo del próximo.">
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10 }}>
          {CATEGORIES.map(c => (
            <OptionTile key={c.id} icon={c.icon} label={c.label}
              active={data.needs.includes(c.id)} onClick={() => toggleArr("needs", c.id)} />
          ))}
        </div>
      </Field>
      <Field label="¿Cómo se usará el contenido?" hint="Colaboración, uso exclusivo o ambas.">
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 10 }}>
          {MODE_CHOICES.map(m => (
            <OptionTile key={m.id} icon={m.icon} label={m.label} sub={m.sub}
              active={data.mode === m.id} onClick={() => set("mode", m.id)} />
          ))}
        </div>
      </Field>
    </FlowShell>
  );

  // 3 — Pago (Selección múltiple + Payment Amount + Message to Creators)
  if (step === 3) return (
    <FlowShell steps={EVENT_STEPS} current={3} kicker="Pago" title="Pon las cartas sobre la mesa"
      onBack={back} onNext={next} preview={preview} canNext={data.payType.length > 0}>
      <Field label="Tipo de evento (selección múltiple)" hint="Elige todas las opciones que apliquen.">
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10 }}>
          {PAY_TYPES.map(p => (
            <OptionTile key={p.id} icon={p.icon} label={p.label}
              active={data.payType.includes(p.id)} onClick={() => toggleArr("payType", p.id)} />
          ))}
        </div>
      </Field>
      {data.payType.includes("pago") && (
        <Field label="Monto de pago" hint="¿No sabes cuánto ofrecer? Toca una sugerencia para empezar.">
          <TextInput value={data.amount} onChange={v => set("amount", v)} placeholder="Ej. $1.500 o $1.2k – $2k" />
          <div style={{ display: "flex", gap: 8, flexWrap: "wrap", marginTop: 10 }}>
            {PAY_SUGGESTIONS.map(s => (
              <button key={s.label} onClick={() => set("amount", s.label)} title={s.note}
                style={{ fontSize: 13, fontWeight: 600, padding: "7px 13px", borderRadius: 99, cursor: "pointer",
                  background: data.amount === s.label ? "var(--accent-wash)" : "var(--canvas)",
                  color: data.amount === s.label ? "var(--accent-ink)" : "var(--ink-soft)",
                  border: `1px solid ${data.amount === s.label ? "var(--accent)" : "var(--line)"}` }}>
                {s.label}
              </button>
            ))}
          </div>
          {data.amount && PAY_SUGGESTIONS.find(s => s.label === data.amount) && (
            <div style={{ fontSize: 12.5, color: "var(--ink-faint)", marginTop: 8 }}>
              ⤳ {PAY_SUGGESTIONS.find(s => s.label === data.amount).note}
            </div>
          )}
        </Field>
      )}
      <Field label="Mensaje para los creadores" hint="Describe el ambiente, el estilo y qué esperas del contenido.">
        <TextArea value={data.message} onChange={v => set("message", v)} rows={5}
          placeholder="80 invitados, evento de prensa al atardecer. Buscamos cobertura y reels para publicar el mismo día…" />
      </Field>
    </FlowShell>
  );

  // 4 — publish + instant matches (the differentiator)
  const matches = CREATORS.filter(c =>
    (data.needs.length === 0 || c.formats.some(f => data.needs.includes(f))) &&
    (!data.mode || data.mode === "ambas" || c.modes.includes(data.mode))).slice(0, 3);
  return (
    <FlowShell steps={EVENT_STEPS} current={4} kicker="Listo para publicar" title="Ya tienes coincidencias esperando"
      onBack={back} onNext={next} nextLabel="Publicar evento ✓">
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 20 }} className="flow-grid">
        <EventPreviewCard data={data} large />
        <div>
          <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 6 }}>
            <h3 style={{ fontSize: 20 }}>Coincidencias instantáneas</h3>
            <Badge tone="accent">{matches.length}</Badge>
          </div>
          <p style={{ fontSize: 13.5, color: "var(--ink-faint)", marginBottom: 16 }}>
            Al publicar, estos creadores recibirán tu invitación. Verán tu mensaje y tú verás sus propuestas.
          </p>
          <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
            {matches.map(c => (
              <div key={c.id} style={{ display: "flex", gap: 12, alignItems: "center", padding: "12px 14px",
                background: "var(--panel)", border: "1px solid var(--line-soft)", borderRadius: "var(--r)" }}>
                <Avatar name={c.name} hue={c.accent} size={42} />
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ fontWeight: 600, fontSize: 14 }}>{c.name}</div>
                  <div style={{ fontSize: 12.5, color: "var(--ink-faint)" }}>{c.role}</div>
                </div>
                <Badge tone="green">{90 + (c.id.charCodeAt(1) % 9)}% match</Badge>
              </div>
            ))}
          </div>
        </div>
      </div>
    </FlowShell>
  );
}

function EventPreviewCard({ data, large }) {
  const producer = data.producer || data.org;
  const message = data.message || data.brief;
  const amount = data.amount || data.budget;
  const paid = data.payType ? data.payType : (data.budget ? ["pago"] : []);
  return (
    <div>
      {!large && <div className="eyebrow" style={{ marginBottom: 12 }}>Vista previa en vivo</div>}
      <Card pad style={{ "--pad": "24px" }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", gap: 10 }}>
          <Badge tone="neutral">{data.type}</Badge>
          <span style={{ fontSize: 12.5, color: "var(--ink-faint)" }}>recién publicado</span>
        </div>
        <h3 className="serif" style={{ fontSize: 24, marginTop: 14, lineHeight: 1.12 }}>
          {data.title || "Nombre de tu evento"}
        </h3>
        <div style={{ fontSize: 13.5, color: "var(--ink-faint)", marginTop: 5 }}>
          {(producer || "Productor")} · {data.city}{data.location ? ` · ${data.location}` : ""}
        </div>
        {data.needs && data.needs.length > 0 && (
          <div style={{ marginTop: 16 }}>
            <div style={{ fontSize: 12, fontWeight: 600, color: "var(--ink-faint)", marginBottom: 8, letterSpacing: "0.04em" }}>NECESITA</div>
            <div style={{ display: "flex", gap: 7, flexWrap: "wrap" }}>
              {data.needs.map(n => <Chip key={n}>{catLabel(n)}</Chip>)}
            </div>
          </div>
        )}
        <div style={{ display: "flex", gap: 6, flexWrap: "wrap", marginTop: 12, alignItems: "center" }}>
          {data.mode === "ambas"
            ? <Badge tone="accent">◑ Colab o exclusivo</Badge>
            : data.mode && <Badge tone={data.mode === "colab" ? "accent" : "neutral"}>{modeOf(data.mode).icon} {modeOf(data.mode).label}</Badge>}
          {paid.includes("pago") && <Badge tone="green">◆ Pagado</Badge>}
          {paid.includes("nopago") && <Badge>○ No pagado</Badge>}
        </div>
        {message && <p style={{ fontSize: 13.5, color: "var(--ink-soft)", marginTop: 16, lineHeight: 1.55 }}>{message}</p>}
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginTop: 18,
          paddingTop: 16, borderTop: "1px solid var(--line-soft)" }}>
          <span style={{ fontSize: 13.5, color: "var(--ink-faint)" }}>
            {data.date || "Fecha por definir"}{data.time ? ` · ${data.time}` : ""}
          </span>
          <span style={{ fontWeight: 700 }}>
            {paid.length && !paid.includes("pago") ? "Sin pago" : (amount || "Monto")}
          </span>
        </div>
      </Card>
    </div>
  );
}

Object.assign(window, { EventFlow, EventPreviewCard, PAY_TYPES });
