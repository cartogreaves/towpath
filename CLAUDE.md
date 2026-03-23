# Towpath — Claude Code Guide

## What this is

Towpath is a map-centric social network for continuous cruisers of the UK canal network. It helps boaters find services (water points, moorings, pubs, fuel, etc.), share live status reports, connect with other boaters, plan routes, and post community asks/offers.

**Live Supabase project:** `cjsvqyjrjmyeiijykpru`
**Mapbox token:** in `.env.local` as `NEXT_PUBLIC_MAPBOX_TOKEN`

---

## Stack

| Layer | Technology |
|---|---|
| Framework | Next.js 15, App Router, TypeScript |
| Styling | Tailwind CSS (custom design tokens — see `tailwind.config.ts`) |
| Map | Mapbox GL JS v3 — dynamic import, client-only |
| Database | Supabase (PostgreSQL + PostGIS) |
| Auth | Supabase magic link (OTP email, no passwords) |
| Data fetching | TanStack Query v5 (`useQuery`, `keepPreviousData`) |
| Animations | Framer Motion (`AnimatePresence`, `motion`, `layout`) |
| Icons | Lucide React (24px, strokeWidth 1.5) |

---

## Key architectural decisions

### Route group `app/(map)/`
All four bottom-nav pages (Map, Routes, Community, Profile) live inside this route group. The group layout (`app/(map)/layout.tsx`) mounts `MapShell` once. Next.js does not remount layouts when navigating within the same group — this is how the map persists without re-initialising across tab switches.

### MapShell + MapContext
`MapShell` is the single source of truth for all map UI state: snap position, active filter, selected POI, selected community post, map bounds, search query. It renders the `BottomSheet`, `BottomNav`, and the dynamic `MapCanvas`. Children (pages) provide only the bottom sheet's scroll content.

### Tab-aware map layers
`MapLayer` (inside `MapShell`) reads `usePathname()` and only passes data for the active tab to `MapCanvas`. Inactive tabs get empty arrays — their Mapbox sources are cleared but the layers remain in the style. This avoids unnecessary fetches and visual clutter.

| Pathname | Map shows |
|---|---|
| `/` | POI pins + clusters |
| `/routes` | Saved route LineStrings |
| `/community` | Pinned community posts (amber=ask, teal=offer) |
| `/profile` | Own boat + friends' boats (narrowboat SVG, heading rotation) |

### BottomSheet snap points
Three snaps — `quarter` (236px visible above nav), `half` (50vh), `full` (nav top). Non-draggable: handle tap-only toggles quarter↔half. Mapbox bottom padding matches snap height via `map.easeTo({ padding })` so the map centre stays in the visible area above the sheet.

### Data hooks pattern
All data hooks use TanStack Query with `staleTime` and `keepPreviousData` so lists never blank out during refetches. Hooks that are tab-specific accept `{ enabled }` to avoid firing when off-screen.

---

## Project structure

```
app/
  layout.tsx                 Root layout — fonts, QueryProvider
  globals.css                Tailwind base + custom CSS (poi-pulse, boat-marker, sheet-transition)
  (map)/
    layout.tsx               Thin wrapper — mounts MapShell
    MapShell.tsx             Persistent shell: MapContext, BottomSheet, BottomNav, MapLayer
    MapContext.tsx           React Context for all map UI state
    page.tsx                 Map tab — animated POI card list
    routes/page.tsx          Routes tab — saved routes list
    community/page.tsx       Community tab — asks/offers timeline
    profile/page.tsx         Profile tab — inline auth gate if logged out
  auth/
    sign-in/                 Magic link sign-in
    sign-up/                 New account (email + handle + boat_name)
    callback/route.ts        Auth exchange handler
    sign-out/route.ts        POST sign-out
  friends/
    page.tsx                 Friends list (pending + accepted)
    add/page.tsx             Search by handle to add friend
  profile/edit/page.tsx      Edit profile (handle, boat, colour, bio, WhatsApp)
  search/page.tsx            POI text search
  settings/page.tsx          Account/appearance/privacy settings menu

components/
  map/
    MapCanvas.tsx            Mapbox GL — all layers, markers, events
  ui/
    BottomSheet.tsx          Snap-point sheet (quarter/half/full)
    BottomNav.tsx            4-item fixed nav (Map/Routes/Community/Profile)
    FilterChips.tsx          Horizontal scrolling POI type filter
    ServiceCard.tsx          POI card (icon, status, report count)
    PostCard.tsx             Community post card (ask/offer, visibility, pin)
    EventCard.tsx            Event card (date, RSVP, description)
    BoatCard.tsx             Friend boat card (distance, WhatsApp link)
    StatusBadge.tsx          working/issue_reported/closed/unknown badge
    AccountGate.tsx          Contextual auth prompt modal
    Button/Input/Avatar/SearchBar  Base UI primitives
  forms/
    CreatePostForm.tsx       New community post (type, visibility, location)

lib/
  supabase/client.ts         Browser Supabase client
  supabase/server.ts         Server Supabase client (cookie-based)
  types/database.ts          All TypeScript types (hand-maintained)
  hooks/
    usePOIs.ts               Viewport POIs via pois_in_bbox RPC
    useCommunityPosts.ts     All unresolved community posts (with author join)
    useSavedRoutes.ts        Saved routes with GeoJSON via get_saved_routes_geojson RPC
    useFriendLocations.ts    Own + friends' boats via get_visible_boat_locations RPC
    useEvents.ts             Upcoming events (legacy — may be repurposed)
    useProfile.ts            Current user profile (auth-subscribed)
  actions/
    reportStatus.ts          Submit/confirm service status reports
    updateLocation.ts        Update own boat location
    rsvpEvent.ts             Toggle event RSVP
    addLogEntry.ts           Cruising log + mooring timer start
  providers/
    QueryProvider.tsx        TanStack Query setup (60s staleTime, 1 retry)
```

---

## Database (Supabase — PostGIS enabled)

### Key tables
- `canals` — LineString geometries, navigation authority
- `pois` — Point geography, type enum, metadata JSONB, canal_id
- `profiles` — linked to `auth.users` via `handle_new_user` trigger
- `community_posts` — ask/offer, visibility (public/friends), optional Point geography
- `boat_locations` — Point geography, heading, updated_at
- `friendships` — requester/addressee, status (pending/accepted), share_location
- `status_reports` — poi_id, status enum, confirmation_count
- `saved_routes` — LineString geometry, pace enum, day_breakdown JSONB
- `events` — Point geography, starts_at (retained but Community tab has replaced Events nav item)

### Key RPCs
- `pois_in_bbox(p_lng1, p_lat1, p_lng2, p_lat2, p_type?)` — returns POIs with current status
- `get_visible_boat_locations()` — own + accepted/sharing friends' locations with profile data
- `get_saved_routes_geojson()` — caller's routes with `ST_AsGeoJSON` geometry
- `confirm_report(p_report_id)` — increments confirmation count + trust score
- `update_boat_location(p_lat, p_lng, p_heading, p_accuracy)` — upsert own location

### Auth
Magic link only. On first sign-in the `handle_new_user` DB trigger inserts a row into `profiles`. RLS is enabled on all tables.

---

## Design tokens (quick reference)

Fonts: `font-display` (Averia Serif Libre — headings only), `font-sans` (Karla — everything else)

Key colours:
- `green-800` `#2C3A2A` — headings
- `green-700` `#3A4830` — body text
- `green-400` `#7A8E66` — muted/metadata
- `water-500` `#4A8B6E` — water points, route lines, success
- `rust-500` `#C4704A` — pubs, warnings, asks
- `bg-primary` `#F3F0E8` — oatmeal page background
- `bg-surface` `#FFFFFF` — cards, sheet, inputs

See `tailwind.config.ts` for full token definitions. See `towpath-design-system-v3.md` for brand rationale.

---

## What is built ✓

- [x] Full DB schema (8 migrations) with PostGIS, RLS, enums
- [x] Next.js app shell with persistent map (route group pattern)
- [x] Mapbox GL map with POI pins, clusters, status dots
- [x] Tab-aware map layers (POIs / routes / community pins / boat locations)
- [x] BottomSheet (quarter/half/full snap, non-draggable, scrollable, padding-aware map)
- [x] 4-item unified BottomNav (no login/logged-out split)
- [x] POI list with Framer Motion transitions, keepPreviousData
- [x] Map ↔ drawer linking (fly-to + pulse ring on POI select)
- [x] Service cards with status badges
- [x] Filter chips (Water/Moorings/Locks/Fuel/Pubs)
- [x] Community tab — asks/offers timeline, create post, visibility (public/friends)
- [x] Community pins on map (amber=ask, teal=offer), click-to-select
- [x] Boat location markers (own + friends' shared, SVG narrowboat, heading)
- [x] Saved routes on map (LineString, auto-fit bounds)
- [x] Magic link auth (sign-in, sign-up, callback, sign-out)
- [x] Profile page (inline auth gate, stats, mooring timer, cruising log)
- [x] Friends system (add by handle, pending/accepted, share_location)
- [x] Seed data (7 users, 28 POIs, events, friendships, boat locations, log entries)
- [x] TanStack Query throughout (keepPreviousData, staleTime, refetchInterval)
- [x] AccountGate contextual modal
- [x] Server actions (reportStatus, updateLocation, rsvpEvent, addLogEntry)

---

## What is left to build

### High priority
- [ ] **Report status form** — `ServiceCard` has a "Report" button with TODO comment. Needs `ReportStatusForm` component wired to `reportStatus` server action. Confirmation button on existing reports.
- [ ] **GPS location pinning for community posts** — `CreatePostForm` has the toggle but doesn't call `navigator.geolocation`. Should call `updateLocation` action and store `ST_MakePoint` on the post.
- [ ] **RSVP on EventCard** — button renders but doesn't call `rsvpEvent` server action.

### Medium priority
- [ ] **Route creation** — `/routes/new` page doesn't exist. User picks start/end on map, names the route, sets pace. Saves via `saveRoute` server action.
- [ ] **"View on map" for routes** — Routes page has placeholder button. Should set `savedRoutes` data and switch to map view.
- [ ] **Mooring timer UI** — timer is stored in DB and displayed on profile, but no start/stop/extend controls.
- [ ] **Community post GPS pinning** — complete the location capture flow in `CreatePostForm`.
- [ ] **Friends — unfriend action** — `/friends` page lists friends but has no remove button.

### Lower priority
- [ ] **Settings sub-pages** — `/settings/location`, `/settings/notifications`, `/settings/appearance`, `/settings/privacy` are linked but don't exist.
- [ ] **Photo uploads on reports** — `reportStatus` action has a TODO for photo upload to Supabase Storage `report-photos` bucket.
- [ ] **Stoppage layer** — `stoppages` table and types exist but no map layer renders them.
- [ ] **CRT stoppage ingestion edge function** — designed in plan but not deployed.
- [ ] **Mooring reminder edge function** — designed in plan but not deployed.
- [ ] **Event creation page** — `/events/create` is referenced but doesn't exist (Community has replaced Events as nav item — decide if events are part of Community tab or separate).
- [ ] **Desktop layout** — tablet/desktop responsive (left panel, top nav) not yet implemented.
- [ ] **QR code for friend adding** — profile page references this but no QR component exists.
- [ ] **Groups** — table exists in DB but no UI.

---

## Conventions

- Use `useMapContext()` to read/set shared map state — do not add local state that duplicates it
- Mutations go in `lib/actions/` as server actions (`'use server'`, return `{ error }` or `{ data }`)
- New data hooks go in `lib/hooks/`, always use TanStack Query, always set `staleTime` and `keepPreviousData`
- Map layers are always present after `style.load` — control visibility by setting source data to empty FeatureCollection, not by toggling layer visibility
- Framer Motion `AnimatePresence mode="popLayout"` + `layout` prop on list items for smooth list updates
- Never use `any` except where Supabase query result shapes are untyped (cast explicitly, add a comment)
- All PostGIS inserts use `ST_SetSRID(ST_MakePoint(lng, lat), 4326)::geography`
