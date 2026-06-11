// ui.jsx — shared primitives for Convoca
const { useState, useEffect, useRef } = React;

/* ---------- Brand wordmark (styled brand name in copy) ---------- */
function Brand({ name }) {
  const b = name || window.__brand || "Convoca";
  return <span className="brand-mark">{b}</span>;
}

/* ---------- Logo ---------- */
function Logo({ name = "Convoca", onClick, light = false }) {
  return (
    <button onClick={onClick} style={{ display: "flex", alignItems: "center", gap: 9 }}>
      <span style={{
        width: 26, height: 26, borderRadius: 8, background: "var(--accent)",
        display: "grid", placeItems: "center", flexShrink: 0,
        boxShadow: "inset 0 0 0 1px oklch(1 0 0 / 0.18)",
      }}>
        <span style={{
          width: 9, height: 9, borderRadius: 99,
          border: "2.5px solid var(--on-accent)",
        }} />
      </span>
      <span className="serif" style={{
        fontSize: 21, letterSpacing: "-0.02em", fontWeight: 500,
        color: light ? "var(--on-accent)" : "var(--ink)",
      }}>{name}</span>
    </button>
  );
}

/* ---------- Button ---------- */
function Button({ children, variant = "primary", size = "md", onClick, full, type, style }) {
  const [h, setH] = useState(false);
  const sizes = {
    sm: { padding: "8px 14px", fontSize: 13 },
    md: { padding: "11px 20px", fontSize: 14.5 },
    lg: { padding: "15px 26px", fontSize: 16 },
  };
  const base = {
    fontFamily: "var(--sans)", fontWeight: 600, borderRadius: 99,
    display: "inline-flex", alignItems: "center", justifyContent: "center", gap: 8,
    transition: "all 0.18s ease", whiteSpace: "nowrap", letterSpacing: "0.005em",
    width: full ? "100%" : "auto", ...sizes[size],
  };
  const variants = {
    primary: {
      background: h ? "var(--accent-ink)" : "var(--accent)", color: "var(--on-accent)",
      boxShadow: h ? "var(--shadow)" : "none", transform: h ? "translateY(-1px)" : "none",
    },
    dark: {
      background: h ? "oklch(0.30 0.006 75)" : "var(--ink)", color: "var(--canvas)",
      transform: h ? "translateY(-1px)" : "none",
    },
    ghost: {
      background: h ? "var(--canvas-2)" : "transparent", color: "var(--ink)",
      boxShadow: "inset 0 0 0 1px var(--line)",
    },
    soft: {
      background: h ? "oklch(0.92 0.04 264)" : "var(--accent-wash)", color: "var(--accent-ink)",
    },
    link: { background: "transparent", color: "var(--ink)", padding: "4px 0", textDecoration: h ? "underline" : "none", textUnderlineOffset: 4 },
  };
  return (
    <button type={type} onClick={onClick} onMouseEnter={() => setH(true)} onMouseLeave={() => setH(false)}
      style={{ ...base, ...variants[variant], ...style }}>
      {children}
    </button>
  );
}

/* ---------- Chip ---------- */
function Chip({ children, active, onClick, accent }) {
  const [h, setH] = useState(false);
  const clickable = !!onClick;
  return (
    <button onClick={onClick} onMouseEnter={() => setH(true)} onMouseLeave={() => setH(false)}
      style={{
        fontSize: 13, fontWeight: 500, padding: "6px 13px", borderRadius: 99,
        fontFamily: "var(--sans)", transition: "all 0.15s ease",
        cursor: clickable ? "pointer" : "default",
        background: active ? "var(--ink)" : (h && clickable ? "var(--canvas-2)" : "var(--panel)"),
        color: active ? "var(--canvas)" : "var(--ink-soft)",
        boxShadow: active ? "none" : "inset 0 0 0 1px var(--line)",
      }}>
      {children}
    </button>
  );
}

/* ---------- Avatar placeholder (or uploaded photo) ---------- */
function Avatar({ name, hue = 264, size = 44, ring, src }) {
  const initials = name.split(" ").map(w => w[0]).slice(0, 2).join("");
  const ringStyle = ring ? `0 0 0 3px var(--panel), 0 0 0 4px oklch(0.88 0.05 ${hue})` : "none";
  if (src) {
    return (
      <img src={src} alt={name} style={{
        width: size, height: size, borderRadius: 99, flexShrink: 0, objectFit: "cover",
        boxShadow: ringStyle,
      }} />
    );
  }
  return (
    <div style={{
      width: size, height: size, borderRadius: 99, flexShrink: 0,
      background: `oklch(0.93 0.05 ${hue})`,
      color: `oklch(0.45 0.16 ${hue})`,
      display: "grid", placeItems: "center",
      fontFamily: "var(--serif)", fontSize: size * 0.4, fontWeight: 500,
      boxShadow: ringStyle,
    }}>{initials}</div>
  );
}

/* ---------- Profile photo uploader (downscales to a small dataURL) ---------- */
function PhotoUpload({ value, onChange, size = 84, name = "" }) {
  const inputRef = useRef(null);
  const onFile = (e) => {
    const file = e.target.files && e.target.files[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (ev) => {
      const img = new Image();
      img.onload = () => {
        const s = 256, canvas = document.createElement("canvas");
        canvas.width = s; canvas.height = s;
        const ctx = canvas.getContext("2d");
        const scale = Math.max(s / img.width, s / img.height);
        const w = img.width * scale, h = img.height * scale;
        ctx.drawImage(img, (s - w) / 2, (s - h) / 2, w, h);
        onChange(canvas.toDataURL("image/jpeg", 0.8));
      };
      img.src = ev.target.result;
    };
    reader.readAsDataURL(file);
  };
  return (
    <div style={{ display: "flex", alignItems: "center", gap: 14 }}>
      <button type="button" onClick={() => inputRef.current && inputRef.current.click()}
        style={{ position: "relative", borderRadius: 99, padding: 0, lineHeight: 0 }}>
        {value
          ? <Avatar name={name || "Tú"} src={value} size={size} ring />
          : <span className="ph" style={{ width: size, height: size, borderRadius: 99, border: "1.5px dashed var(--line)" }}>
              <span>foto</span>
            </span>}
      </button>
      <div>
        <Button size="sm" variant="ghost" onClick={() => inputRef.current && inputRef.current.click()}>
          {value ? "Cambiar foto" : "Subir foto de perfil"}
        </Button>
        {value && <Button size="sm" variant="link" onClick={() => onChange("")} style={{ marginLeft: 8 }}>Quitar</Button>}
      </div>
      <input ref={inputRef} type="file" accept="image/*" onChange={onFile} style={{ display: "none" }} />
    </div>
  );
}

/* ---------- Card ---------- */
function Card({ children, style, hover, onClick, pad }) {
  const [h, setH] = useState(false);
  const interactive = hover || onClick;
  return (
    <div onClick={onClick} onMouseEnter={() => setH(true)} onMouseLeave={() => setH(false)}
      style={{
        background: "var(--panel)", borderRadius: "var(--r-lg)",
        boxShadow: interactive && h ? "var(--shadow-lg)" : "var(--shadow-sm)",
        border: "1px solid var(--line-soft)",
        transform: interactive && h ? "translateY(-3px)" : "none",
        transition: "all 0.22s cubic-bezier(0.2,0.7,0.2,1)",
        cursor: onClick ? "pointer" : "default",
        padding: pad ? "var(--pad)" : 0,
        ...style,
      }}>
      {children}
    </div>
  );
}

/* ---------- Stars ---------- */
function Stars({ value, count }) {
  return (
    <span style={{ display: "inline-flex", alignItems: "center", gap: 6, fontSize: 13.5 }}>
      <span style={{ color: "var(--accent)", fontWeight: 700 }}>★ {value.toFixed(1)}</span>
      {count != null && <span style={{ color: "var(--ink-faint)" }}>({count})</span>}
    </span>
  );
}

/* ---------- Field ---------- */
function Field({ label, hint, children }) {
  return (
    <label style={{ display: "block" }}>
      {label && <div style={{ fontSize: 13.5, fontWeight: 600, marginBottom: 7, color: "var(--ink)" }}>{label}</div>}
      {children}
      {hint && <div style={{ fontSize: 12.5, color: "var(--ink-faint)", marginTop: 6 }}>{hint}</div>}
    </label>
  );
}

function inputStyle(focus) {
  return {
    width: "100%", padding: "12px 14px", borderRadius: "var(--r)",
    background: "var(--canvas)", color: "var(--ink)",
    border: `1px solid ${focus ? "var(--accent)" : "var(--line)"}`,
    boxShadow: focus ? "0 0 0 3px var(--accent-wash)" : "none",
    outline: "none", fontSize: 14.5, transition: "all 0.15s ease",
  };
}

function TextInput({ value, onChange, placeholder, type = "text" }) {
  const [f, setF] = useState(false);
  return (
    <input type={type} value={value} placeholder={placeholder}
      onChange={e => onChange && onChange(e.target.value)}
      onFocus={() => setF(true)} onBlur={() => setF(false)}
      style={inputStyle(f)} />
  );
}

function TextArea({ value, onChange, placeholder, rows = 4 }) {
  const [f, setF] = useState(false);
  return (
    <textarea value={value} placeholder={placeholder} rows={rows}
      onChange={e => onChange && onChange(e.target.value)}
      onFocus={() => setF(true)} onBlur={() => setF(false)}
      style={{ ...inputStyle(f), resize: "vertical", lineHeight: 1.5 }} />
  );
}

/* ---------- Selectable option tile ---------- */
function OptionTile({ label, sub, icon, active, onClick }) {
  const [h, setH] = useState(false);
  return (
    <button onClick={onClick} onMouseEnter={() => setH(true)} onMouseLeave={() => setH(false)}
      style={{
        display: "flex", alignItems: "center", gap: 12, textAlign: "left",
        padding: "14px 16px", borderRadius: "var(--r)", width: "100%",
        background: active ? "var(--accent-wash)" : (h ? "var(--canvas-2)" : "var(--panel)"),
        border: `1px solid ${active ? "var(--accent)" : "var(--line)"}`,
        transition: "all 0.15s ease",
      }}>
      {icon && <span style={{
        width: 38, height: 38, borderRadius: 10, flexShrink: 0,
        display: "grid", placeItems: "center", fontSize: 17,
        background: active ? "var(--accent)" : "var(--canvas-2)",
        color: active ? "var(--on-accent)" : "var(--ink-soft)",
      }}>{icon}</span>}
      <span>
        <div style={{ fontWeight: 600, fontSize: 14.5, color: active ? "var(--accent-ink)" : "var(--ink)" }}>{label}</div>
        {sub && <div style={{ fontSize: 12.5, color: "var(--ink-faint)", marginTop: 1 }}>{sub}</div>}
      </span>
      <span style={{ marginLeft: "auto", color: active ? "var(--accent)" : "transparent", fontWeight: 700 }}>✓</span>
    </button>
  );
}

/* ---------- Badge ---------- */
function Badge({ children, tone = "neutral" }) {
  const tones = {
    neutral: { bg: "var(--canvas-2)", fg: "var(--ink-soft)" },
    accent:  { bg: "var(--accent-wash)", fg: "var(--accent-ink)" },
    green:   { bg: "oklch(0.94 0.05 150)", fg: "oklch(0.42 0.12 150)" },
    amber:   { bg: "oklch(0.95 0.06 75)", fg: "oklch(0.48 0.1 70)" },
  };
  const t = tones[tone] || tones.neutral;
  return (
    <span style={{
      fontSize: 11.5, fontWeight: 600, padding: "3px 9px", borderRadius: 99,
      background: t.bg, color: t.fg, letterSpacing: "0.01em", whiteSpace: "nowrap",
      display: "inline-flex", alignItems: "center", gap: 5,
    }}>{children}</span>
  );
}

/* ---------- Step progress ---------- */
function Stepper({ steps, current }) {
  return (
    <div style={{ display: "flex", alignItems: "center", gap: 0 }}>
      {steps.map((s, i) => (
        <div key={s} style={{ display: "flex", alignItems: "center", flex: i < steps.length - 1 ? 1 : "0 0 auto" }}>
          <div style={{ display: "flex", alignItems: "center", gap: 9 }}>
            <span style={{
              width: 26, height: 26, borderRadius: 99, flexShrink: 0,
              display: "grid", placeItems: "center", fontSize: 12.5, fontWeight: 700,
              background: i < current ? "var(--accent)" : (i === current ? "var(--ink)" : "var(--panel)"),
              color: i <= current ? "var(--on-accent)" : "var(--ink-faint)",
              boxShadow: i > current ? "inset 0 0 0 1px var(--line)" : "none",
              transition: "all 0.2s ease",
            }}>{i < current ? "✓" : i + 1}</span>
            <span style={{
              fontSize: 13, fontWeight: i === current ? 600 : 500,
              color: i === current ? "var(--ink)" : "var(--ink-faint)",
              whiteSpace: "nowrap",
            }}>{s}</span>
          </div>
          {i < steps.length - 1 && (
            <div style={{ flex: 1, height: 1.5, margin: "0 14px",
              background: i < current ? "var(--accent)" : "var(--line)", transition: "all 0.2s ease" }} />
          )}
        </div>
      ))}
    </div>
  );
}

/* ---------- Location select (Puerto Rico: zonas + pueblos) ---------- */
function LocationSelect({ value, onChange, includeAll, allLabel = "Toda ubicación", includeIsla, style }) {
  return (
    <select value={value} onChange={e => onChange && onChange(e.target.value)} style={style || { ...inputStyleSelect() }}>
      {includeAll && <option value="all">{allLabel}</option>}
      {includeIsla && <option value="Toda la isla">Toda la isla</option>}
      <optgroup label="Por zona">
        {PR_ZONES.map(z => <option key={z} value={z}>{z}</option>)}
      </optgroup>
      <optgroup label="Pueblos">
        {PR_TOWNS.map(t => <option key={t} value={t}>{t}</option>)}
      </optgroup>
    </select>
  );
}
function inputStyleSelect() {
  return {
    width: "100%", padding: "12px 14px", borderRadius: "var(--r)",
    background: "var(--canvas)", color: "var(--ink)", border: "1px solid var(--line)",
    outline: "none", fontSize: 14.5, cursor: "pointer",
  };
}

Object.assign(window, {
  Logo, Brand, Button, Chip, Avatar, PhotoUpload, Card, Stars, Field, TextInput, TextArea,
  OptionTile, Badge, Stepper, inputStyle, LocationSelect, inputStyleSelect,
});
