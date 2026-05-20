---
name: Bienestar Laboral Warm
colors:
  primary: "#7B9E6B"
  secondary: "#C4A962"
  surface: "#F5F0E8"
  surface-variant: "#FFFFFF"
  surface-warm: "#EDE8DB"
  header: "rgba(255, 255, 255, 0.8)"
  on-surface: "#1A1A1A"
  on-surface-variant: "#6B6B6B"
  on-dark: "#FFFFFF"
  error: "#C45B5B"
  warning: "#D4826A"
typography:
  body-md:
    fontFamily: Inter
    fontSize: 16px
    fontWeight: 400
  title-lg:
    fontFamily: Inter
    fontSize: 24px
    fontWeight: 800
rounded:
  xl: 24px
---

# Design System — Red de Bienestar Laboral

## Overview
A warm, minimal, and elegant interface for the Dashboard and platform.
It uses a warm cream background, organic shapes, and a clean top navigation header to create a professional yet welcoming environment.

## Colors
- **Primary** (#7B9E6B): Accent Green. Used for active navigation indicators, task checks, and positive progress.
- **Secondary** (#C4A962): Accent Gold. Used for highlights, stars, and AI analytics.
- **Surface** (#F5F0E8): Main Dashboard background (warm cream).
- **Surface-Variant** (#FFFFFF): Standard cards and containers.
- **Surface-Warm** (#EDE8DB): Cards with a warm beige tone.
- **Header** (rgba(255,255,255,0.8)): White with transparency for the glassmorphism top navigation.
- **On-surface** (#1A1A1A): Primary text (soft black) on light backgrounds.
- **On-surface-variant** (#6B6B6B): Secondary text.
- **On-dark** (#FFFFFF): Text on dark backgrounds.
- **Error** (#C45B5B): Low progress, red alerts.
- **Warning** (#D4826A): Coral/Orange for alerts and mid-level progress.

## Typography
- **Headlines**: Inter, extra-bold or black (800-900), tight tracking.
- **Body**: Inter, regular to medium (400-500), 14–16px.
- **Labels**: Inter, bold (700), 12px, uppercase, wide tracking.

## Components
- **Cards**: Heavily rounded corners (24px). Soft, warm shadows (`shadow-sm`). Borders are almost invisible (`1px solid rgba(0,0,0,0.04)`). Generous padding (`p-6` to `p-8`).
- **Header**: Sticky top navigation with glassmorphism effect (`backdrop-blur-md bg-white/80`). Links are gray (`text-gray-600`), and hover/active states use the primary green (`hover:text-brand-sage`).
- **Hero Card (User)**: Large card where the user's photo covers most of it, with the name overlaying at the bottom. Uses the 24px rounded corners.

## Do's and Don'ts
- **Do** use warm tones (cream, beige, sage) for the main areas.
- **Do** use large, organic card shapes (24px border radius) without aggressive borders.
- **Do** apply smooth transitions (`transition-all duration-300`) to interactive elements.
- **Don't** use cold grays or generic blues anywhere except where strictly necessary.
- **Don't** clutter the UI. Rely on elegant minimalism with ample whitespace.
