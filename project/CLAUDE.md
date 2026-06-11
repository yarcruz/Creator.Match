# COLLAB LINK — Notas de producto

Plataforma (tipo marketplace) que conecta **creadores de contenido de eventos** con **productores/promotores** en **Puerto Rico**. El creador NO produce el evento: lo **cubre** (promociones/teasers, cobertura en vivo, entrevistas, recaps/aftermovie, streaming, full package, contenido a medida). Entrega en **colaboración** (ambas redes) o **uso exclusivo** (solo redes del productor).

Marca de trabajo en el código: "Convoca" (cambiable en Tweaks → Marca). El proyecto se llama COLLAB LINK.

## Núcleo GRATIS (activo)
Explorar creadores y eventos · registro de creador · publicar evento · enviar propuesta · aceptar propuesta · chat. Ubicaciones = zonas + pueblos de PR ("Toda la isla" solo para creadores). Registros y propuestas persisten en localStorage.

## Decisiones de monetización
- **Reviews = SIEMPRE gratis y desde el inicio.** Son infraestructura de confianza, no un perk. Se desbloquean solo tras un **acuerdo confirmado** (gate de autenticidad, no de dinero). En Pro solo se vende la capa de arriba: analíticas de reseñas, responder públicamente, destacar la mejor, insignia "trato verificado".
- **No cobrar a ambas partes al cerrar el trato** (riesgo de fuga/disintermediación). El cierre debe ser gratis; monetizar con Pro + boosts, o un "acuerdo protegido" opcional con valor real (mediación).

## Pendiente para "Pro / luego" (NO construir hasta que se pida)
Interruptor maestro: `MONETIZATION_ENABLED` en app.jsx (false por defecto) + toggle "Premium" en Tweaks para previsualizar.

Ya construido pero oculto: página de Planes, insignia Pro en tarjetas, banner "Hazte Pro" en Panel, impulsos puntuales (Destacar/Verificación/Urgente).

Anotado, NO construido:
- Límites del plan gratis (3 piezas de portafolio / 1 evento activo). El portafolio ya está blindado: piezas contables (subir o embed de 1 pieza), enlaces de carpeta/bucket bloqueados.
- Bloqueos de filtros Pro para el productor.
- **Cierre del trato**: botón "Confirmar acuerdo" (ambas partes) → **certificado de acuerdo** → **reviews** desbloqueadas (las reviews van en el núcleo gratis).
- Cobro opcional ($5) "acuerdo protegido".
- Comisión por transacción (cuando haya pagos integrados).

## Otros pendientes
- Publicar en línea (archivo autocontenido → Netlify/Vercel).
- Matching inteligente del Panel (cruce pago↔preferencia, nivel sencilla/pro/ambas, zona).
- Fijar el logo a "COLLAB LINK" (hoy muestra "Convoca").
