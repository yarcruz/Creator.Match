// data.jsx — mock data for Convoca (event-content coverage marketplace)

// What a creator covers / what a producer requests — content formats, NOT vendor services.
const CATEGORIES = [
  { id: "previa",     label: "Teasers y promociones", icon: "◔" },
  { id: "cobertura",  label: "Cobertura en vivo",   icon: "◉" },
  { id: "reels",      label: "Reels & short-form",  icon: "▸" },
  { id: "aftermovie", label: "Recaps / aftermovie",  icon: "▶" },
  { id: "entrevista", label: "Entrevistas",         icon: "◆" },
  { id: "stream",     label: "Streaming / charlas", icon: "✦" },
  { id: "fullpage",   label: "Full package (todo el proyecto: antes, durante y después)", icon: "▤" },
  { id: "otro",       label: "Contenido a medida",  icon: "✎" },
];

// Event types — shared by creator (qué cubre) and producer (qué publica)
const EVENT_TYPES = [
  "Corporativo", "Boda", "Festival", "Concierto", "Obra de teatro",
  "Marca / Lanzamiento", "Privado", "Otro",
];

// Delivery modality — the core "what each side offers" clarity
const MODALITIES = {
  colab:     { id: "colab",     label: "Colaboración", short: "Colab",      icon: "⇄",
               desc: "Se publica en las redes del creador y del productor." },
  exclusivo: { id: "exclusivo", label: "Uso exclusivo", short: "Exclusivo", icon: "●",
               desc: "Contenido solo para las redes del productor." },
};

// Coverage tier — lets economical "sencilla" options coexist with "pro"
const TIERS = {
  sencilla: { id: "sencilla", label: "Sencilla", short: "Sencilla", icon: "○",
              desc: "1 persona, equipo esencial, entrega estándar. Más económico." },
  pro:      { id: "pro", label: "Pro", short: "Pro", icon: "◆",
              desc: "Equipo profesional: multi-cámara, dron y edición avanzada." },
  ambas:    { id: "ambas", label: "Sencilla y Pro", short: "Ambas", icon: "◑",
              desc: "Ofrezco tanto cobertura sencilla como pro, según el evento." },
};

// Puerto Rico — zonas + pueblos (ubicación de trabajo / del evento)
const PR_ZONES = ["Zona Metro", "Zona Oeste", "Zona Noreste", "Zona Suroeste", "Zona Este"];
const PR_TOWNS = [
  "Adjuntas", "Aguada", "Aguadilla", "Aguas Buenas", "Aibonito", "Añasco", "Arecibo", "Arroyo",
  "Barceloneta", "Barranquitas", "Bayamón", "Cabo Rojo", "Caguas", "Camuy", "Canóvanas", "Carolina",
  "Cataño", "Cayey", "Ceiba", "Ciales", "Cidra", "Coamo", "Comerío", "Corozal", "Culebra", "Dorado",
  "Fajardo", "Florida", "Guánica", "Guayama", "Guayanilla", "Guaynabo", "Gurabo", "Hatillo",
  "Hormigueros", "Humacao", "Isabela", "Jayuya", "Juana Díaz", "Juncos", "Lajas", "Lares",
  "Las Marías", "Las Piedras", "Loíza", "Luquillo", "Manatí", "Maricao", "Maunabo", "Mayagüez",
  "Moca", "Morovis", "Naguabo", "Naranjito", "Orocovis", "Patillas", "Peñuelas", "Ponce",
  "Quebradillas", "Rincón", "Río Grande", "Sabana Grande", "Salinas", "San Germán", "San Juan",
  "San Lorenzo", "San Sebastián", "Santa Isabel", "Toa Alta", "Toa Baja", "Trujillo Alto", "Utuado",
  "Vega Alta", "Vega Baja", "Vieques", "Villalba", "Yabucoa", "Yauco",
];
const LOCATIONS = [...PR_ZONES, ...PR_TOWNS];
const CITIES = LOCATIONS; // back-compat alias

// Suggested pay ranges — for producers who don't know what to offer
const PAY_SUGGESTIONS = [
  { label: "$150 – $300", note: "Cobertura sencilla, evento corto" },
  { label: "$300 – $600", note: "Cobertura + reels el mismo día" },
  { label: "$600 – $1.2k", note: "Pro: aftermovie + entrega completa" },
  { label: "$1.2k – $2.5k", note: "Full page o multi-cámara" },
];

const CREATORS = [
  {
    id: "c1", name: "Mariana Restrepo", handle: "@marirestrepo",
    role: "Fotógrafa de cobertura", city: "San Juan",
    rate: "Desde $480 / evento", rating: 4.9, reviews: 128, jobs: 214,
    formats: ["cobertura", "previa", "entrevista"], modes: ["colab", "exclusivo"],
    tier: "pro", payPref: "pago",
    gear: ["Sony A7 IV", "24-70mm f2.8", "85mm f1.4", "Iluminación LED", "Backup dual"],
    projects: [
      { type: "link", title: "Reel destacado 2025", url: "https://vimeo.com/789012" },
      { type: "link", title: "Boda en finca", url: "https://youtu.be/abc123" },
      { type: "link", title: "Lanzamiento de marca", url: "https://www.instagram.com/p/Cxyz/" },
    ],
    tags: ["Bodas", "Corporativo", "Editorial"], available: "Disponible esta semana",
    bio: "Cubro eventos con mirada editorial y entrego una galería curada en 72h, lista para publicar.",
    accent: 264, response: "Responde en ~2h", verified: true, top: true,
  },
  {
    id: "c2", name: "Diego Salcedo", handle: "@diegoshoots",
    role: "Videógrafo · aftermovie & reels", city: "Ponce",
    rate: "Desde $650 / evento", rating: 4.8, reviews: 86, jobs: 142,
    formats: ["aftermovie", "reels", "cobertura"], modes: ["exclusivo", "colab"],
    tier: "pro", payPref: "pago",
    gear: ["Sony FX3", "Gimbal DJI RS3", "Drone DJI Air 3", "Audio Rode", "Edición DaVinci"],
    projects: [
      { type: "link", title: "Aftermovie festival", url: "https://youtu.be/diego1" },
      { type: "link", title: "Reel de marca", url: "https://www.instagram.com/reel/Cab/" },
    ],
    tags: ["Aftermovie", "Reels", "Marca"], available: "Agenda abierta en junio",
    bio: "Aftermovies con ritmo y reels verticales listos para publicar el mismo día del evento.",
    accent: 145, response: "Responde en ~4h", verified: true, top: false,
  },
  {
    id: "c3", name: "Valentina Cruz", handle: "@valcreates",
    role: "Creadora de reels en vivo", city: "Mayagüez",
    rate: "Desde $420 / evento", rating: 5.0, reviews: 64, jobs: 98,
    formats: ["reels", "cobertura", "previa"], modes: ["colab"],
    tier: "sencilla", payPref: "todos",
    gear: ["iPhone 15 Pro", "Gimbal", "Micrófono de solapa", "Ring light", "Edición móvil"],
    projects: [
      { type: "link", title: "TikTok de evento", url: "https://www.tiktok.com/@valcreates/video/123" },
      { type: "link", title: "Reel destacado", url: "https://vimeo.com/445566" },
    ],
    tags: ["Short-form", "Trends", "Marca"], available: "Disponible fines de semana",
    bio: "Convierto tu evento en short-form que rinde: trends, ritmo y publicación en colaboración.",
    accent: 32, response: "Responde en ~1h", verified: true, top: true,
  },
  {
    id: "c4", name: "Studio Hábito", handle: "@studiohabito",
    role: "Estudio de aftermovie & film", city: "Caguas",
    rate: "Cotización por evento", rating: 4.9, reviews: 51, jobs: 73,
    formats: ["aftermovie", "cobertura", "fullpage"], modes: ["exclusivo"],
    tier: "pro", payPref: "pago",
    gear: ["Multi-cámara (3)", "Drone DJI Mavic 3", "Grúa / slider", "Set de luces", "Suite de edición"],
    tags: ["Cinemático", "Marca", "Multi-cámara"], available: "Reservas con 3 semanas",
    bio: "Piezas cinemáticas de evento: dirección, multi-cámara y entrega para uso exclusivo de marca.",
    accent: 320, response: "Responde en ~6h", verified: false, top: false,
  },
  {
    id: "c5", name: "Lucas Fernández", handle: "@lucasonair",
    role: "Entrevistas & contenido en vivo", city: "Bayamón",
    rate: "Desde $390 / evento", rating: 4.7, reviews: 39, jobs: 61,
    formats: ["entrevista", "cobertura", "stream"], modes: ["colab", "exclusivo"],
    tier: "ambas", payPref: "todos",
    gear: ["Cámara + micrófono de mano", "Trípode", "Luz portátil", "Kit de streaming"],
    tags: ["Bilingüe", "Corporativo", "En vivo"], available: "Disponible esta semana",
    bio: "Entrevistas a invitados y ponentes con guion a medida, listas para tus canales o en colaboración.",
    accent: 200, response: "Responde en ~3h", verified: true, top: false,
  },
  {
    id: "c6", name: "Camila Ortega", handle: "@camsocial",
    role: "Cobertura social en vivo", city: "Carolina",
    rate: "Desde $300 / evento", rating: 4.8, reviews: 44, jobs: 88,
    formats: ["cobertura", "reels", "previa"], modes: ["colab"],
    tier: "sencilla", payPref: "sinpago",
    gear: ["Smartphone Pro", "Estabilizador", "Ring light", "Edición en el celular"],
    tags: ["Stories en vivo", "TikTok", "Cobertura"], available: "Agenda abierta",
    bio: "Cobertura en tiempo real: stories, reels y carrusel publicados antes de que termine el evento.",
    accent: 264, response: "Responde en ~2h", verified: true, top: true,
  },
];

const EVENTS = [
  {
    id: "e1", title: "Lanzamiento de marca — colección cápsula",
    org: "Atelier Norte", type: "Marca / Lanzamiento", city: "Mayagüez",
    date: "14 jun 2026", budget: "$1.2k – $2k", needs: ["cobertura", "reels", "previa"],
    mode: "exclusivo", posted: "hace 2 días", applicants: 9,
    brief: "Evento de prensa para 80 invitados. Necesitamos cobertura y reels para nuestras redes el mismo día — uso exclusivo de marca.",
  },
  {
    id: "e2", title: "Boda íntima en finca",
    org: "Paula & Andrés", type: "Boda", city: "Rincón",
    date: "28 jun 2026", budget: "$2k – $3.5k", needs: ["cobertura", "aftermovie"],
    mode: "exclusivo", posted: "hace 5 horas", applicants: 3,
    brief: "60 invitados, ceremonia al atardecer. Queremos cobertura documental y un aftermovie para nosotros — sin pose forzada.",
  },
  {
    id: "e3", title: "Conferencia anual de producto",
    org: "Nodo Labs", type: "Corporativo", city: "San Juan",
    date: "9 jul 2026", budget: "$3k – $5k", needs: ["stream", "entrevista", "aftermovie"],
    mode: "colab", posted: "hace 1 día", applicants: 12,
    brief: "300 asistentes, 2 escenarios. Streaming de charlas, entrevistas a ponentes y aftermovie — abiertos a publicar en colaboración.",
  },
  {
    id: "e4", title: "Festival gastronómico de barrio",
    org: "Mercado Sur", type: "Festival", city: "Ponce",
    date: "2 ago 2026", budget: "$1.5k – $2.5k", needs: ["cobertura", "reels", "previa"],
    mode: "colab", posted: "hace 3 días", applicants: 6,
    brief: "Evento abierto, 10 puestos de comida. Buscamos adelantos, cobertura cálida y mucho short-form — publicación en colaboración.",
  },
];

// dashboard data
const MATCHES = [
  { id: "m1", creator: "c1", event: "e2", score: 96, why: "Cobertura documental + aftermovie, disponible la fecha", status: "nuevo" },
  { id: "m2", creator: "c2", event: "e2", score: 91, why: "Aftermovie cinemático, uso exclusivo", status: "nuevo" },
  { id: "m3", creator: "c2", event: "e1", score: 94, why: "Reels el mismo día, experiencia con marcas", status: "visto" },
  { id: "m4", creator: "c6", event: "e1", score: 89, why: "Cobertura social en vivo + adelantos", status: "visto" },
];

const PROPOSALS = [
  { id: "p1", creator: "c2", event: "e1", amount: "$1.45k", note: "Cobertura + aftermovie + 6 reels · uso exclusivo", status: "pendiente", when: "hace 1h" },
  { id: "p2", creator: "c6", event: "e1", amount: "$680", note: "Cobertura social en vivo · publicación en colaboración", status: "aceptada", when: "ayer" },
  { id: "p3", creator: "c1", event: "e2", amount: "$1.9k", note: "Cobertura editorial + galería en 72h · uso exclusivo", status: "pendiente", when: "hace 3h" },
];

const MESSAGES = [
  { id: "t1", creator: "c1", last: "Perfecto, te confirmo la hora de llegada mañana.", time: "12:04", unread: 2 },
  { id: "t2", creator: "c2", last: "¿El aftermovie lo quieres horizontal y vertical?", time: "Ayer", unread: 0 },
  { id: "t3", creator: "c6", last: "Te paso el moodboard de stories esta tarde.", time: "Lun", unread: 1 },
];

const CREATOR_STEPS = ["Contacto", "Qué cubres", "Portafolio", "Preferencias", "Revisión"];
const EVENT_STEPS = ["Tu evento", "Fecha y lugar", "Qué necesitas", "Pago", "Publicar"];

const CREATOR_TAGS = ["Bodas", "Corporativo", "Editorial", "Festivales", "Cinemático",
  "Short-form", "Bilingüe", "En vivo", "Marca", "Documental"];

const PAY_PREFS = [
  { id: "pago",   label: "Solo eventos con pago", sub: "Solo me llegan eventos remunerados.", icon: "◆" },
  { id: "todos",  label: "Todos los eventos",     sub: "Pagos y colaboraciones por exposición.", icon: "◇" },
  { id: "sinpago",label: "Solo eventos sin pago", sub: "Busco portafolio y colaboraciones.", icon: "○" },
];

function creatorById(id) { return CREATORS.find(c => c.id === id); }
function eventById(id) { return EVENTS.find(e => e.id === id); }
function catLabel(id) { const c = CATEGORIES.find(x => x.id === id); return c ? c.label : id; }
function modeOf(id) { return MODALITIES[id] || MODALITIES.colab; }
function tierOf(id) { return TIERS[id] || TIERS.sencilla; }
function payPrefLabel(id) { const p = PAY_PREFS.find(x => x.id === id); return p ? p.label : "Todos los eventos"; }
function modesLabel(modes) {
  if (!modes || !modes.length) return "";
  if (modes.includes("colab") && modes.includes("exclusivo")) return "Colaboración y exclusivo";
  return modeOf(modes[0]).label;
}
function linkSource(url) {
  const u = (url || "").toLowerCase();
  if (/youtu\.?be/.test(u)) return { label: "YouTube", icon: "▶" };
  if (/vimeo/.test(u)) return { label: "Vimeo", icon: "▶" };
  if (/drive\.google|docs\.google/.test(u)) return { label: "Google Drive", icon: "◇" };
  if (/dropbox/.test(u)) return { label: "Dropbox", icon: "▣" };
  if (/instagram/.test(u)) return { label: "Instagram", icon: "◎" };
  if (/behance/.test(u)) return { label: "Behance", icon: "❖" };
  if (/tiktok/.test(u)) return { label: "TikTok", icon: "♪" };
  if (/wetransfer/.test(u)) return { label: "WeTransfer", icon: "↑" };
  return { label: "Enlace", icon: "↗" };
}
// Bucket / folder links hold unlimited content → not allowed as a single portfolio piece.
// Single-item embeds (one video / one post) are fine and countable.
function isBucketLink(url) {
  const u = (url || "").toLowerCase();
  if (/drive\.google\.[^/]*\/drive\/folders/.test(u)) return true; // Drive folder
  if (/drive\.google\.[^/]*\/(open|file).*folders/.test(u)) return true;
  if (/dropbox\.com\/(sh|scl\/fo)/.test(u)) return true;           // Dropbox shared folder
  if (/wetransfer\.com|we\.tl/.test(u)) return true;               // WeTransfer
  if (/mega\.(nz|io)\/folder/.test(u)) return true;                // MEGA folder
  if (/photos\.app\.goo\.gl|photos\.google/.test(u)) return true;  // Google Photos album
  if (/icloud\.com\/(sharedalbum|photos)/.test(u)) return true;    // iCloud shared album
  return false;
}
function isSingleItemLink(url) {
  const u = (url || "").toLowerCase();
  return /youtu\.?be|vimeo\.com\/\d|instagram\.com\/(p|reel|tv)\/|tiktok\.com\/.*\/video\//.test(u);
}

Object.assign(window, {
  CATEGORIES, EVENT_TYPES, MODALITIES, TIERS, CITIES, PR_ZONES, PR_TOWNS, LOCATIONS, PAY_SUGGESTIONS,
  CREATORS, EVENTS, MATCHES, PROPOSALS, MESSAGES,
  CREATOR_STEPS, EVENT_STEPS, CREATOR_TAGS, PAY_PREFS,
  creatorById, eventById, catLabel, modeOf, tierOf, payPrefLabel, modesLabel, linkSource, isBucketLink, isSingleItemLink,
});
