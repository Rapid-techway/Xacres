We are building a modern land discovery web application.

Project name: Xacres

Xacres is a platform where users can discover agricultural land listings in Haryana, India using an interactive map and filter-based search.

This is NOT a text-based search engine like Google. Instead, the discovery system is based on structured filters such as:

• District (Haryana districts)
• Price demand
• Land size in acres

The goal is to create a premium, consumer-grade interface similar to Airbnb’s discovery experience but focused on farmland.

Important: This prompt is only for providing context about the / (home) and /lands routes. We will build the UI component-by-component after this.

--------------------------------------------------

CORE PRODUCT PHILOSOPHY

The UI must feel modern, premium, and simple.

Design inspiration:
• Airbnb
• Linear
• Vercel dashboard
• Notion

Avoid generic dashboard layouts.

The interface should feel like a consumer product, not an admin panel.

Focus on:

• clean hierarchy
• generous spacing
• minimal color usage
• smooth interactions
• modern typography

--------------------------------------------------

THEME

Light theme only.

We are NOT implementing dark mode.

Color palette should be minimal:

Primary accent: soft red (#ff4d5a)
Background: white
Borders: subtle grey
Shadows: soft and minimal

Use shadcn/ui components for UI elements.

--------------------------------------------------

TECH STACK

Framework: Next.js (App Router)

UI components: shadcn/ui  
Styling: TailwindCSS

State management: Zustand

Mapping library:
Leaflet

Map tiles:
ESRI satellite tiles

The map should be optimized and avoid unnecessary re-renders.

Zustand will manage all global states such as:

• selected district
• price filter
• size filter
• selected property
• map bounds
• UI states (drawers, filters)

--------------------------------------------------

MAP BEHAVIOR

The map is the central part of the application.

The map must:

• focus only on Haryana, India
• default zoom centered on Haryana
• restrict excessive zoom out
• display property markers
• support smooth panning and zooming

Map markers represent land listings.

Markers should display price labels like:

₹12L / acre

Clicking a marker should open property details.

--------------------------------------------------

ROUTES OVERVIEW

We are designing two main routes:

/ (Home page)
/lands (Land discovery page)

--------------------------------------------------

/ ROUTE (HOME PAGE)

Purpose:
Entry page to explore lands in Haryana.

Layout structure:

1. Top Navigation Bar (fixed)

Left:
Xacres logo

Center:
Large search bar similar to Airbnb.

Search filters include:

• WHERE → Haryana district selector
• PRICE → price range filter
• SIZE → land size in acres

Right side:
• "List your land" button
• profile / account icon

Search bar must be visually centered in the navbar.

2. Map Section

Full width map preview showing Haryana.

Property markers displayed.

3. Discovery Section

Below the map we can show:

• featured lands
• recently added lands
• lands by district

Displayed using card grids.

--------------------------------------------------

/lands ROUTE (DISCOVERY PAGE)

Purpose:
Primary land discovery experience.

Layout is map-focused.

Structure:

Top:
Same navbar with search filters.

Main content:

Large full-screen map with property markers.

Map overlays:

• filter button
• map controls
• toggle between Map / Lands

Property listings should appear as price markers on the map.

Example marker style:

rounded white pill
₹12L / acre

--------------------------------------------------

PROPERTY INTERACTION

When a marker is clicked:

A property drawer or card should appear.

The property UI should include:

• land image
• price per acre
• total acres
• district
• short description
• "view details" button

Drawer should feel smooth and modern.

--------------------------------------------------

RESPONSIVENESS

The application must work well on:

• Desktop
• Tablet
• Mobile

Mobile behavior:

Search bar becomes expandable.

Property cards may appear in a bottom sheet.

Map interaction should remain smooth on mobile.

--------------------------------------------------

CODE ARCHITECTURE

Code must be scalable and maintainable.

Use a component-based architecture.

Example structure:

components/
   navbar/
   search/
   map/
   property/
   filters/

Each component must be modular.

Avoid large monolithic components.

--------------------------------------------------

DEVELOPMENT APPROACH

We will NOT design the entire UI at once.

Instead, we will work component-by-component.

Example workflow:

1. Navbar
2. Search bar
3. Map component
4. Property markers
5. Property drawer
6. Filter UI
7. Mobile behavior

Each component should be designed carefully with good UX and clean code structure.

--------------------------------------------------

Next step:

Start with designing the Navbar component.