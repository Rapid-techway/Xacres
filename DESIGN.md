# Design System Document: High-End Land Discovery Admin

## 1. Overview & Creative North Star
**Creative North Star: "The Aerial Curator"**
This design system moves beyond the standard "SaaS Dashboard" aesthetic to create an editorial, map-centric experience for land discovery. The goal is to evoke the feeling of high-end architectural plans and premium real estate journals. 

We break the "template" look by rejecting rigid grid lines in favor of **Tonal Topography**. By utilizing varying shades of white and soft greys (Surface Tiers), we create a sense of depth and hierarchy that feels organic and fluid. The interface should feel like a light, airy studio space where the data is the art.

---

## 2. Colors & Surface Philosophy
The palette is rooted in a monochromatic base to allow the land imagery and the `primary` blue accent to command attention with surgical precision.

### The "No-Line" Rule
**Strict Mandate:** Prohibit the use of 1px solid borders for sectioning or layout containment. Structural boundaries must be defined solely through background color shifts or subtle tonal transitions. For example, a `surface-container-low` sidebar sitting against a `surface-lowest` main canvas.

### Surface Hierarchy & Nesting
Treat the UI as a physical stack of fine paper. Use the following tiers to define depth without shadows:
- **Base Layer:** `surface` (#f8f9fa) – The primary "ground" of the application.
- **Structural Insets:** `surface-container-low` (#f1f4f6) – Used for sidebars or secondary navigation.
- **Actionable Cards:** `surface-container-lowest` (#ffffff) – Reserved for the highest level of focus (e.g., active stat cards or data tables).
- **Interactive Modals:** `surface-bright` (#f8f9fa) – Used for floating elements to ensure they pop against the background.

### Signature Textures: Glass & Gradients
To avoid a "flat" appearance, use **Glassmorphism** for floating map controls and search bars. Apply `surface_container_lowest` at 80% opacity with a `20px` backdrop-blur. 
For primary CTAs, use a subtle linear gradient: `primary` (#0053db) to `primary_dim` (#0048c1) at a 135-degree angle to provide a "jewel" effect.

---

## 3. Typography: Editorial Authority
The typography system utilizes two distinct sans-serifs to balance technical precision with high-end editorial flair.

*   **Display & Headlines (Manrope):** Used for large data points and page titles. The wide apertures of Manrope convey openness and modernity.
    *   *Display-LG (3.5rem):* For hero land valuations or total acreage stats.
    *   *Headline-SM (1.5rem):* For section headers.
*   **Body & Labels (Inter):** Used for all functional UI, data tables, and descriptions. Inter’s high x-height ensures legibility at small sizes.
    *   *Title-SM (1rem, Medium weight):* For card titles and navigation items.
    *   *Label-MD (0.75rem, Semi-bold):* For "status" indicators and metadata.

---

## 4. Elevation & Depth
Traditional drop shadows are largely banned. Hierarchy is achieved through **Tonal Layering**.

*   **The Layering Principle:** Place a `surface-container-lowest` card on a `surface-container-low` section. This create a "soft lift" that feels architectural rather than digital.
*   **Ambient Shadows:** When a floating element (like a dropdown) is required, use a "Ghost Shadow": `0px 12px 32px rgba(43, 52, 55, 0.04)`. The shadow color is derived from `on-surface` (#2b3437) at 4% opacity, mimicking natural light.
*   **The Ghost Border:** If a boundary is required for accessibility in forms, use `outline-variant` (#abb3b7) at **15% opacity**. Never use 100% opaque borders.

---

## 5. Components

### Sidebar & Navigation
- **Styling:** `surface-container-low` background with no right-hand border.
- **Active State:** Use a `primary_container` (#dbe1ff) pill background with `on_primary_container` (#0048bf) text.
- **Icons:** Use 20px "Light" weight stroke icons. Avoid filled icons unless active.

### Premium Stat Cards
- **Construction:** Background `surface-container-lowest`, Corner Radius `xl` (1.5rem).
- **Layout:** Use `spacing-6` (1.5rem) padding. 
- **Detail:** Place a subtle 4px vertical accent bar of `primary` blue on the far left of the card to denote "active" or "trend up" status.

### Rounded Search & Map Controls
- **Styling:** Fully rounded `full` (9999px) search bars.
- **Visuals:** Use the "Glassmorphism" rule (80% opacity + blur).
- **Interaction:** On focus, transition background to `surface-container-lowest` (100% opaque) with a `ghost border`.

### Form Elements
- **Inputs:** Background `surface-container-high`. No border. Radius `md` (0.75rem).
- **Focus:** Transition background to `surface-container-lowest` and add a 1px `primary` ghost border (20% opacity).
- **Spacing:** Use `spacing-4` (1rem) for internal padding.

### Map Containers
- **Visuals:** Map containers should have a `lg` (1rem) radius. 
- **Treatment:** Inset the map slightly within a `surface-container-low` frame to make the map feel like a "viewfinder" into the land.

---

## 6. Do’s and Don’ts

### Do
*   **Do** use whitespace as a separator. If you feel the need to add a line, increase the spacing by `spacing-8` instead.
*   **Do** use `primary` color sparingly. It should be a "signal," not a "theme."
*   **Do** nest containers. A white card on a light grey background is the signature look of this system.

### Don’t
*   **Don’t** use pure black (#000000) for text. Always use `on-surface` (#2b3437) to maintain a soft, premium feel.
*   **Don’t** use standard 4px or 8px border radii. This system demands the "squircle" feel of `12-16px` (md to lg) for a modern, friendly hand-feel.
*   **Don’t** use "Drop Shadows" from a default library. If it looks like a shadow, it’s probably too dark.