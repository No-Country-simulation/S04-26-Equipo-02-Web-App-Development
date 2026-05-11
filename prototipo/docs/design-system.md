# 🎨 Design System — Red de Bienestar Laboral

Guía de referencia visual y paleta de colores para el Dashboard y toda la plataforma.

## Imagen de Referencia
![Referencia NL Corp Dashboard](/original-.webp)

---

## Paleta de Colores Principal

### Fondos
| Token               | Hex       | Uso                                      |
|---------------------|-----------|------------------------------------------|
| `--bg-main`         | `#F5F0E8` | Fondo principal del dashboard (crema cálido) |
| `--bg-card`         | `#FFFFFF` | Cards y contenedores                     |
| `--bg-card-warm`    | `#EDE8DB` | Cards con tono cálido (beige)            |
| `--bg-card-accent`  | `#D4C9A8` | Cards destacadas (dorado suave)          |
| `--bg-sidebar`      | `#2C2C2C` | Sidebar oscuro (gris grafito)            |

### Textos
| Token               | Hex       | Uso                                      |
|---------------------|-----------|------------------------------------------|
| `--text-primary`    | `#1A1A1A` | Títulos y texto principal (negro suave)  |
| `--text-secondary`  | `#6B6B6B` | Texto secundario                         |
| `--text-muted`      | `#9B9B9B` | Texto auxiliar / placeholders            |
| `--text-on-dark`    | `#FFFFFF` | Texto sobre fondos oscuros               |
| `--text-sidebar`    | `#B8B8B8` | Links sidebar inactivos                  |

### Acentos
| Token               | Hex       | Uso                                      |
|---------------------|-----------|------------------------------------------|
| `--accent-green`    | `#7B9E6B` | Indicador activo sidebar, check de tareas |
| `--accent-olive`    | `#8B9A6B` | Badges completados, progreso verde       |
| `--accent-gold`     | `#C4A962` | Estrella, highlights, AI analytics       |
| `--accent-coral`    | `#D4826A` | Progreso naranja, alertas                |
| `--accent-sage`     | `#A8B89E` | Tags, badges suaves                      |

### Progreso / Gráficos
| Token               | Hex       | Uso                                      |
|---------------------|-----------|------------------------------------------|
| `--chart-green`     | `#7B9E6B` | Barra de progreso verde                  |
| `--chart-yellow`    | `#D4C36A` | Barra de progreso amarillo               |
| `--chart-coral`     | `#D4826A` | Barra de progreso naranja/coral          |
| `--chart-red`       | `#C45B5B` | Barra de progreso rojo (bajo)            |

---

## Tipografía

- **Font principal**: `Inter` o `DM Sans` (Google Fonts)
- **Títulos grandes**: `font-weight: 800-900`, `tracking-tight`
- **Subtítulos**: `font-weight: 600`, `text-sm`
- **Labels**: `font-weight: 700`, `text-xs`, `uppercase`, `tracking-widest`
- **Body**: `font-weight: 400-500`, `text-sm/base`

---

## Estilo de Cards

- **Border radius**: `24px` (`rounded-3xl`)
- **Shadow**: Sutil, `shadow-sm` con tono cálido
- **Border**: `1px solid rgba(0,0,0,0.04)` — casi invisible
- **Padding**: `p-6` a `p-8`
- **Sin bordes agresivos** — todo suave y orgánico

---

## Card Principal del Usuario (Hero Card)

Basada en la referencia de "Helen Vasilovsky":

```
┌─────────────────────────────┐
│                             │
│    [FOTO DEL USUARIO]       │
│    (cubre la mayor parte    │
│     del card, ~200px alto)  │
│                             │
│  ┌───────────────────────┐  │
│  │ Nombre Completo       │  │
│  │ Profesión / Título    │  │
│  └───────────────────────┘  │
└─────────────────────────────┘
```

- La foto ocupa la mayor parte del card
- El nombre aparece en overlay semi-transparente abajo
- Si no hay foto → imagen genérica profesional
- Esquinas redondeadas `rounded-3xl`

---

## Sidebar

- Fondo: Gris oscuro (`#2C2C2C`) — NO azul
- Links: Gris claro (`#B8B8B8`), activo → Blanco con indicador verde
- Logo en la parte superior
- Avatar + nombre del usuario abajo
- Minimalista, sin iconos ruidosos

---

## Layout del Dashboard

Inspirado en la referencia:

```
┌──────────────────────────────────────────────────────┐
│  Hello, [Nombre] 👋                                 │
│  subtitle / breadcrumb                               │
├──────────┬──────────┬──────────────────────────────────┤
│  CARD    │  CARD    │  CARD                            │
│  FOTO    │  CHART   │  TAREAS                          │
│  USUARIO │  PROGRESO│  ONBOARDING                      │
│          │          │                                  │
├──────────┴──────────┤──────────────────────────────────┤
│  CALENDARIO         │  (más cards)                     │
│                     │                                  │
├─────────┬───────────┼───────────┬──────────────────────┤
│  STAT 1 │  STAT 2   │  STAT 3   │  STAT 4             │
└─────────┴───────────┴───────────┴──────────────────────┘
```

---

## Principios de Diseño

1. **Tonos cálidos**: Crema, beige, sage — NO grises fríos
2. **Minimalismo elegante**: Espacios amplios, poco ruido visual
3. **Cards orgánicas**: Bordes muy redondeados, sombras sutiles
4. **Foto prominente**: El usuario se ve a sí mismo como protagonista
5. **Datos claros**: Métricas grandes, labels pequeños
6. **Transiciones suaves**: Todo con `transition-all duration-300`
