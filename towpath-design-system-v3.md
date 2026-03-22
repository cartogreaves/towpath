# Towpath — Design System v3

> A map-centric social network for continuous cruisers of the UK canal network.
> **URL:** alongthetowpath.com
> **Stack:** React (Next.js) · Tailwind CSS · Mapbox GL JS · Mobile-first

---

## 1. Brand identity

### Name & voice

**Towpath** — named for the paths that run alongside Britain's canals, where boaters walk, cycle, and connect. The brand voice is calm, practical, and community-minded. Think a knowledgeable fellow boater, not a tech startup. Language should feel grounded and unhurried — like canal life itself.

**Tagline suggestions:** "Life along the cut" · "Your canal community" · "Navigate together"

### Personality traits

- Warm but not saccharine
- Helpful and practical — like a good neighbour on the towpath
- Understated, never flashy
- Community-first, not engagement-first
- Respectful of the slow pace of canal living

---

## 2. Competitive context

Towpath sits between two existing tools that each do one thing well but leave large gaps.

### CanalPlan AC

The gold standard for canal route planning. Deep data on locks (dimensions, rise/fall, paired/single), distances, bridge numbers, and journey timing estimates. However: the interface is text-heavy and dated, not mobile-friendly, has no interactive map, no user accounts, and no community features. The data is comprehensive but static — there's no way for users to report that a lock is broken or a water point is dry.

**What Towpath should learn from it:** CanalPlan's route timing model is excellent. Towpath's route planner should aim for the same depth — lock count, estimated time with configurable pace, bridge clearances, tunnel dimensions. Consider whether CanalPlan's data is available under any open licence, or plan to build an equivalent dataset. Don't try to compete on route data quality at launch — link out to CanalPlan where Towpath's own data is thinner.

### OpenCanalMap

An OpenStreetMap-based interactive map focused on canal infrastructure. Shows locks, bridges, winding holes, and services pulled from OSM data. Has a proper interactive map (the thing CanalPlan lacks) but limited routing, no journey timing, no user accounts, and no community layer. Data quality depends on OSM contributors.

**What Towpath should learn from it:** The map presentation is clean and canal-focused. Towpath should match this level of canal network visibility on the map — canals and rivers as the primary visual feature, not roads. OSM data is available under ODbL and could seed Towpath's initial POI database, especially for locks, bridges, and winding holes.

### Where Towpath differentiates

1. **Modern mobile-first map** — the best of CanalPlan's data depth with OpenCanalMap's visual clarity, in a mobile-native Mapbox experience.
2. **Live community intelligence** — crowd-sourced status reports on services (working/broken/dry), mooring availability, and conditions. This replaces the scattered Facebook groups and word of mouth that cruisers currently rely on.
3. **Continuous cruiser focus** — 14-day mooring timers, cruising log tracking, and tools designed for the nomadic lifestyle rather than marina-based boating.
4. **Social connection** — friend locations (opt-in), events, groups, and WhatsApp messaging. The social layer the canal community doesn't have in one place.

---

## 3. User tiers & information architecture

### Tier philosophy

The map and navigation data are the hook — they must be immediately useful with zero friction. The account gate only appears when a user tries to *participate* (report, comment, plan, connect), not when they're *consuming*. This means the open site is genuinely valuable on its own, and account creation feels like a natural next step rather than a wall.

### Open tier (no account required)

Everything a cruiser needs for day-to-day navigation. No sign-up, no login, no friction.

**Map + navigation:**
- Full canal network on an interactive Mapbox map
- Canal routes with distances (miles and locks)
- Route planning A→B with estimated journey time
- Lock data: count, rise/fall, dimensions, type (wide/narrow, paired/single)
- Bridges (number, clearance, swing/lift), tunnels, aqueducts
- CRT stoppage notices and planned closures shown on map
- Water level warnings and winter restrictions

**Services directory:**
- Water points, Elsan disposal, pump-out stations, rubbish/recycling
- Moorings: visitor, 48hr, 14-day, long-term (with any known restrictions)
- Boatyards, chandleries, diesel, coal, gas
- Nearby amenities: pubs, shops, launderettes, post offices
- Read community status reports (but cannot submit or comment)

**Events (read-only):**
- Browse community events pinned to map locations
- Canal festivals, boater meets, floating markets
- See attendee count and details
- Cannot RSVP or create (prompts account creation)

### Account tier (free — with future paid potential)

Unlocked by creating a free account. The gate appears contextually when a user tries to participate: reporting a service issue, commenting, saving a route, RSVPing to an event, or messaging someone.

**Profile + cruising log:**
- Boat name, photo, colour, type (narrowboat, widebeam, etc.)
- "Continuous cruiser" or home mooring designation
- Cruising log: miles travelled, locks worked, waterways visited
- Stats and history (personal, not public by default)
- 14-day mooring timer with reminders

**Service reports + comments:**
- Report service status: working, broken, dry, closed
- Add comments with details and photos ("left tap broken, right one fine")
- Upvote/confirm existing reports
- Trust score builds over time (more confirmed reports = higher trust)
- Notifications when service status changes on your saved routes

**Route planning (saved):**
- Save and name planned routes
- Set travel pace: relaxed (3-4 hrs/day), steady (5-6 hrs), pushing (7+ hrs)
- Day-by-day breakdown with suggested overnight mooring spots
- Share route with friends
- See friends' planned routes overlaid on map

**Friends + location sharing:**
- Add friends by handle or QR code
- Share approximate location (opt-in, mutual only)
- See friends on map with freshness decay (see section 6)
- Message friends via WhatsApp deep link
- Location sharing can be paused/hidden at any time

**Events + groups:**
- Create events pinned to map locations
- RSVP to events, see who's going
- Create or join groups (geographic: "Oxford Canal cruisers", interest: "solo boaters")
- Group WhatsApp link integration (link to existing WhatsApp groups)

**Notifications:**
- Service status changes on saved/recent routes
- New CRT stoppages affecting your area or planned routes
- Friend location updates (if sharing is mutual and enabled)
- Event reminders
- 14-day mooring timer alerts

### Future paid tier (not in v1)

Keep this in mind architecturally but don't build the paywall yet. Potential paid features: advanced route planning (multi-day itinerary builder with detailed overnight stops), historical cruising data and analytics, premium map layers (depth data, mooring reviews), boat maintenance log.

---

## 4. Color palette

The palette draws from the English canal landscape: silty water, weathered lock gates, hedgerow greens, towpath earth, and the warm light on a narrowboat cabin. Everything is earthy, muted, and grounded — no bright saturated tech colors.

### Backgrounds (warm whites)

| Token | Name | Hex | Usage |
|-------|------|-----|-------|
| `bg-primary` | Oatmeal | `#F3F0E8` | Page background, app shell |
| `bg-surface` | White | `#FFFFFF` | Cards, modals, inputs, bottom sheets |
| `bg-elevated` | Parchment | `#FAF8F5` | Elevated surfaces, hover states on oatmeal |
| `bg-recessed` | Clay | `#EDE9E0` | Recessed areas, disabled surfaces, divider bands |
| `bg-tinted` | Pale moss | `#E8EBE2` | Tinted surfaces, selected states, tag backgrounds |

### Muddy green (primary text & brand color)

This single ramp handles headings, body text, links, muted labels, and tinted fills. It is the backbone of the entire UI.

| Token | Name | Hex | Usage |
|-------|------|-----|-------|
| `green-900` | Dark loam | `#222E20` | Maximum contrast (rare, logos) |
| `green-800` | Deep moss | `#2C3A2A` | Headings, display text, nav backgrounds |
| `green-700` | Forest floor | `#3A4830` | Body text, primary readable content |
| `green-600` | Bracken | `#4A5A3A` | Secondary text, button fills, strong labels |
| `green-500` | Fern | `#5E7048` | Links, interactive elements, icons |
| `green-400` | Lichen | `#7A8E66` | Placeholder text, tertiary content |
| `green-300` | Sage | `#8A9A74` | Muted metadata, timestamps, distances |
| `green-200` | Pale sage | `#A8B596` | Borders, subtle dividers |
| `green-100` | Willow | `#C5CCBA` | Borders on light surfaces, disabled text |
| `green-50` | Mist | `#E8EBE2` | Tinted backgrounds, chip fills, selected rows |

### Canal water (secondary accent)

For water-related features, map elements, and informational states.

| Token | Name | Hex | Usage |
|-------|------|-----|-------|
| `water-50` | Pale canal | `#E3EEE8` | Info backgrounds |
| `water-300` | Shallow | `#8DBBA8` | Info borders, map water tint |
| `water-500` | Canal | `#4A8B6E` | Info text, water point markers, map highlights |
| `water-700` | Deep cut | `#2E6B50` | Strong info accent |

### Towpath (warm neutral accent)

For earthy, warm-toned elements — locks, paths, structure.

| Token | Name | Hex | Usage |
|-------|------|-----|-------|
| `earth-50` | Pale sand | `#F3EDE5` | Warm card backgrounds |
| `earth-300` | Dried mud | `#C8B89E` | Warm borders, avatar rings |
| `earth-500` | Towpath | `#8A7558` | Lock markers, warm metadata |
| `earth-700` | Dark earth | `#6B5A42` | Strong warm accent |

### Rust (warm highlight)

For warm alerts, pubs/food, and narrowboat detailing.

| Token | Name | Hex | Usage |
|-------|------|-----|-------|
| `rust-50` | Pale rust | `#F5E8E0` | Warning backgrounds |
| `rust-500` | Iron oxide | `#C4704A` | Pub markers, warm warnings |
| `rust-700` | Dark rust | `#8B4A2E` | Strong warning text |

### Semantic colors

| Token | Hex | Usage |
|-------|-----|-------|
| `success` | `#4A8B6E` (= water-500) | Available, working, open |
| `warning` | `#C4704A` (= rust-500) | Caution, limited, closing soon |
| `danger` | `#B5403A` | Errors, closed, broken, urgent |
| `danger-light` | `#F8ECEA` | Error backgrounds |
| `info` | `#4A8B6E` (= water-500) | Informational highlights |

---

## 5. Typography

### Font stack

| Role | Font | Weights | Tailwind class |
|------|------|---------|----------------|
| Display / headings | **Averia Serif Libre** | 400, 700 | `font-display` |
| Body / UI | **Karla** | 400, 500, 600 | `font-sans` |
| Mono / data | **DM Mono** | 400 | `font-mono` |

**Why Averia Serif Libre:** It has a hand-drawn, slightly weathered character — like painted lettering on a narrowboat cabin or a hand-chalked pub sign. Use it for display headings, the app logo/wordmark, boat names, and section titles — not for body text or UI labels.

**Why Karla:** Geometric but friendly. Clean enough for UI contexts but with enough character to feel intentional alongside Averia. Excellent readability at small sizes on mobile.

**Import:** Google Fonts — `Averia+Serif+Libre:wght@400;700` and `Karla:wght@400;500;600`

### Type scale

| Level | Font | Size | Weight | Line height | Letter spacing | Tailwind |
|-------|------|------|--------|-------------|----------------|----------|
| Display | Averia Serif Libre | 28px / 1.75rem | 700 | 1.2 | -0.01em | `text-display` |
| H1 | Averia Serif Libre | 24px / 1.5rem | 700 | 1.25 | -0.01em | `text-h1` |
| H2 | Averia Serif Libre | 20px / 1.25rem | 400 | 1.3 | 0 | `text-h2` |
| H3 | Karla | 17px / 1.0625rem | 600 | 1.4 | 0 | `text-h3` |
| Body | Karla | 15px / 0.9375rem | 400 | 1.6 | 0 | `text-body` |
| Body small | Karla | 13px / 0.8125rem | 400 | 1.5 | 0.01em | `text-sm` |
| Caption | Karla | 11px / 0.6875rem | 400 | 1.4 | 0.02em | `text-xs` |
| Label | Karla | 12px / 0.75rem | 500 | 1.3 | 0.04em | `text-label` |

### Usage rules

- **Averia Serif Libre** is for display only: app name, page titles, boat names on cards, section headings, empty state messages, onboarding headlines. Never for buttons, inputs, labels, metadata, or body paragraphs.
- **Karla** is for everything else: body text, UI controls, navigation labels, form fields, metadata, timestamps, map popups.
- Boat names in cards and profiles use Averia at body size (15px, weight 700) as a special case.

---

## 6. Spacing & layout

### Spacing scale

| Token | Value | Usage |
|-------|-------|-------|
| `space-1` | 4px | Tight gaps (icon + label) |
| `space-2` | 8px | Internal component padding |
| `space-3` | 12px | Between related elements |
| `space-4` | 16px | Standard component padding |
| `space-5` | 20px | Between sections in a card |
| `space-6` | 24px | Between cards / major sections |
| `space-8` | 32px | Page-level section spacing |
| `space-10` | 40px | Major page divisions |

### Border radius

| Token | Value | Usage |
|-------|-------|-------|
| `rounded-sm` | 4px | Badges, small pills |
| `rounded-md` | 8px | Buttons, inputs, chips |
| `rounded-lg` | 12px | Cards, modals, bottom sheets |
| `rounded-xl` | 16px | Map overlays, featured cards |
| `rounded-full` | 9999px | Avatars, floating action buttons |

### Borders

Default border: `1px solid green-100` (#C5CCBA) on cards and inputs against oatmeal background. Use `green-200` (#A8B596) for stronger separation. Use `green-50` (#E8EBE2) for subtle internal dividers within cards.

### Layout patterns

**Mobile (default, < 768px):**
- Map fills the full viewport as the base layer
- UI overlays from bottom (bottom sheet) or top (search bar)
- Bottom sheet: three snap points — peek (80px), half (50vh), full (calc(100vh - 64px))
- Bottom navigation: 56px tall, 4 items (open tier) or 5 items (logged in)
- No sidebar — everything is overlay or full-screen transition

**Tablet (768px – 1024px):**
- Map fills viewport
- Left panel (360px) slides in for services/search/routes
- Bottom nav moves to left rail

**Desktop (> 1024px):**
- Map fills right portion
- Persistent left panel (400px) for services/search/routes
- Optional right panel (320px) for POI detail or route breakdown
- Top navigation replaces bottom nav

---

## 7. Components

### Navigation — tiered

Navigation changes based on whether the user is logged in.

**Bottom nav — open tier (no account):**
- 4 items: Map, Services, Routes, Search
- All items fully functional without login

**Bottom nav — logged in:**
- 5 items: Map, Services, Routes, Events, Profile
- Search moves to a floating bar on the map or within the bottom sheet

**Styling (both):**
- Height: 56px + safe area inset
- Background: `bg-surface` with top border `green-100`
- Active: `green-600` (#4A5A3A) icon + Karla 500 label
- Inactive: `green-300` (#8A9A74) icon, no label
- Icons: 24px, line style, stroke 1.5px

**Top nav (desktop):**
- Height: 56px
- Background: `green-800` (#2C3A2A)
- Logo: "Towpath" in Averia Serif Libre 700, `bg-elevated` (#FAF8F5) colour
- Nav items: `green-100` (#C5CCBA) text, white on hover/active
- Right side: "Sign in" link (open tier) or user avatar 32px circle (logged in)

### Account gate prompt

When an anonymous user triggers a gated action (report, comment, save route, RSVP, message), show a contextual prompt rather than a generic login wall.

```
┌─────────────────────────────────┐
│                                 │
│  Create a free account to       │
│  report this water point        │  ← contextual to action
│                                 │
│  Join the community helping     │
│  cruisers across the network.   │
│                                 │
│  [Create account]  [Sign in]    │
│                                 │
└─────────────────────────────────┘
```

- Appears as a bottom sheet modal or inline prompt, not a full-page redirect
- Copy changes based on the action: "...to report this water point" / "...to save this route" / "...to RSVP to this event" / "...to message this boater"
- Background: `bg-surface`, border `green-100`, `rounded-xl`
- Primary button: `green-600` fill
- After sign-up, return user directly to the action they were attempting

### Map markers

**Boat marker (user/friend location):**
- Shape: simplified narrowboat silhouette, top-down view, 32x12px
- Fill: user's chosen boat colour, with `green-800` (#2C3A2A) stroke
- Active/selected: scale to 1.2x with subtle pulse animation
- Direction: rotated to match heading when GPS is active
- Only visible to friends (mutual location sharing)

**Point of interest markers:**
- Shape: rounded pin, 24x32px
- Interior icon: 16px Lucide icon, stroke 1.5px, `bg-elevated` (#FAF8F5) stroke on coloured fill
- Light pin fills use `bg-elevated` (#FAF8F5) icon stroke; the one exception is winding hole (pale `earth-300` fill) which uses `green-700` (#3A4830) icon stroke for contrast
- All icons from Lucide React — no custom SVGs needed

| Category | Lucide icon | Pin fill | Icon stroke |
|----------|------------|----------|-------------|
| Water point | `Droplets` | `water-500` (#4A8B6E) | #FAF8F5 |
| Mooring | `Anchor` | `green-600` (#4A5A3A) | #FAF8F5 |
| Lock | `BetweenVerticalStart` | `earth-500` (#8A7558) | #FAF8F5 |
| Winding hole | `RotateCcw` | `earth-300` (#C8B89E) | #3A4830 |
| Pub / food | `Beer` | `rust-500` (#C4704A) | #FAF8F5 |
| Waste services | `WavesArrowDown` | `green-400` (#7A8E66) | #FAF8F5 |
| Shop / services | `Store` | `green-500` (#5E7048) | #FAF8F5 |
| Boatyard / fuel | `Wrench` | `earth-700` (#6B5A42) | #FAF8F5 |
| Event | `Calendar` | `green-600` (#4A5A3A) | #FAF8F5 |

**Status overlay on POI markers:**
When a service has community status reports, overlay a small status dot (6px) on the bottom-right of the pin:
- Working/available: `water-500` green dot
- Issue reported: `rust-500` orange dot
- Closed/broken: `danger` (#B5403A) red dot
- No reports: no dot

**Stoppage markers:**
- CRT stoppage notices: red dashed line overlay on affected canal section
- Planned closures: orange dashed line
- Tap on affected section to see notice details

**Cluster markers:**
- Circle, 36px diameter
- Fill: `green-50` (#E8EBE2) with `green-500` (#5E7048) border
- Interior: count number in `green-800`, Karla 500

**Event markers:**
- Shape: rounded pin with calendar icon, 24x32px
- Fill: `green-600` (#4A5A3A)
- Shows date badge (e.g. "15 Mar") below pin

### Cards

All cards: `bg-surface` (#FFFFFF), border `1px green-100` (#C5CCBA), `rounded-lg` (12px), padding 16px. On mobile over the map, add shadow `0 1px 3px rgba(44,58,42,0.08)`.

**Service card (POI detail — available to all):**
```
┌─────────────────────────────────┐
│ [Pin icon]  Water point (Averia)│
│             Braunston Turn      │
│                                 │
│ ● Working  · 3 reports          │
│ Last updated 2h ago             │
│                                 │
│ "Good pressure, both taps..."   │
│ — @narrowboat_adventures · 1d   │
│                                 │
│ "Left tap dripping but usable"  │
│ — @the_little_dipper · 4d       │
│                                 │
│ [Navigate]  [Report status] *   │
│             * requires account  │
└─────────────────────────────────┘
```

**Boat card (friend — logged in only):**
```
┌─────────────────────────────────┐
│ [Avatar 40px]  Boat Name (Averia)
│                @handle · 2.3mi  │
│                                 │
│ Near Braunston Turn             │
│ Updated 3h ago                  │
│                                 │
│ [WhatsApp]  [View on map]       │
└─────────────────────────────────┘
```

**Route card (logged in only):**
```
┌─────────────────────────────────┐
│ Braunston → Banbury    (Averia) │
│                                 │
│ 26.4 mi · 37 locks · ~3 days   │
│ Pace: steady                    │
│                                 │
│ Day 1: Braunston → Napton (9mi) │
│ Day 2: Napton → Fenny C. (10mi)│
│ Day 3: Fenny C. → Banbury (7mi)│
│                                 │
│ [View on map]  [Share]  [Edit]  │
└─────────────────────────────────┘
```

**Event card:**
```
┌─────────────────────────────────┐
│ 15 Mar                          │
│ Braunston Boat Jumble  (Averia) │
│ Braunston Marina                │
│                                 │
│ 10:00 – 15:00 · 23 going       │
│                                 │
│ [RSVP] *  [Navigate]  [Share]   │
│ * requires account              │
└─────────────────────────────────┘
```

### Bottom sheet

The primary mobile interaction for all content below the map.

- Background: `bg-surface` (#FFFFFF) with `rounded-xl` on top corners only
- Handle: 32x4px rounded pill in `green-200` (#A8B596), centred, 8px from top
- Backdrop: `rgba(44,58,42,0.12)` at half or full height
- Transition: spring physics, `cubic-bezier(0.32, 0.72, 0, 1)`, ~300ms

**Peek state content varies by context:**
- Default: search bar + quick filter chips (Water, Moorings, Locks, Services, Events)
- POI selected: service card summary (name, status, distance)
- Route active: next waypoint summary + progress
- Friend selected: boat card summary

### Buttons

| Variant | Background | Text | Border | Usage |
|---------|-----------|------|--------|-------|
| Primary | `green-600` (#4A5A3A) | `bg-elevated` (#FAF8F5) | none | Main CTAs |
| Primary hover | `green-500` (#5E7048) | `bg-elevated` | none | — |
| Secondary | `bg-surface` | `green-600` (#4A5A3A) | 1px `green-200` | Secondary actions |
| Secondary hover | `bg-elevated` (#FAF8F5) | `green-600` | 1px `green-200` | — |
| Ghost | transparent | `green-500` (#5E7048) | none | Tertiary, nav |
| WhatsApp | `#25D366` | white | none | WhatsApp message links |
| Danger | `#B5403A` | white | none | Destructive |
| Disabled | `bg-recessed` (#EDE9E0) | `green-300` (#8A9A74) | none | Inactive |

**Sizing:**
- Default: height 40px, padding 0 16px, Karla 14px/500, `rounded-md`
- Small: height 32px, padding 0 12px, Karla 13px/500
- Large: height 48px, padding 0 20px, Karla 15px/500
- All: transition 150ms ease

### Inputs

- Height: 40px (default), 48px (large / mobile-prominent)
- Background: `bg-surface` (#FFFFFF)
- Border: 1px `green-200` (#A8B596), on focus `water-500` (#4A8B6E) with ring `0 0 0 3px rgba(74,139,110,0.15)`
- Placeholder: `green-300` (#8A9A74)
- Text: `green-700` (#3A4830), Karla 15px
- Radius: `rounded-md`
- Error: border `#B5403A`, helper text in `#B5403A`

### Search bar

Floating over the map or pinned at the top of the bottom sheet peek.

- Height: 44px
- Background: `bg-surface`
- Border: 1px `green-100`, radius `rounded-lg`
- Shadow: `0 2px 8px rgba(44,58,42,0.08)` when floating
- Left icon: search (16px, `green-300`)
- Placeholder: "Search the cut..." in `green-300` (#8A9A74), Karla 400
- Right: filter icon button
- Searches: place names, canal names, services, boat names (logged in), events

### Filter chips

Horizontal scrolling row below the search bar in the bottom sheet peek state.

- Height: 32px, `rounded-full`, padding 0 12px
- Default: `bg-elevated` (#FAF8F5) fill, `green-500` text, no border
- Active: `green-600` (#4A5A3A) fill, `bg-elevated` text
- Chips: Water · Moorings · Locks · Fuel · Pubs · Events · Stoppages

### Status badges

For service report status on POI cards and map markers.

| Status | Background | Text | Dot colour |
|--------|-----------|------|------------|
| Working | `water-50` | `water-700` | `water-500` |
| Issue reported | `rust-50` | `rust-700` | `rust-500` |
| Closed / broken | `danger-light` | `danger` | `danger` |
| Unknown / no reports | `bg-recessed` | `green-400` | none |

### Avatars

- Sizes: 24px (inline), 32px (nav), 36px (list items), 40px (cards), 64px (profile)
- Shape: circle (`rounded-full`)
- Border: 2px `bg-surface` when overlapping map/images
- Fallback: initials in Averia Serif Libre 700, `green-600` text on `green-50` background
- Boat avatar option: narrowboat silhouette in user's chosen colour

---

## 8. Map-specific patterns

### Mapbox style

Base on `mapbox://styles/mapbox/outdoors-v12` with these overrides:

- Water fills: `water-300` (#8DBBA8) at 30% opacity
- Land: `bg-primary` (#F3F0E8) — the oatmeal tone
- Parks / green spaces: `green-50` (#E8EBE2)
- Roads: `green-100` (#C5CCBA) with `green-200` casings
- Labels: `green-800` (#2C3A2A) with `bg-elevated` halos
- Canal / river lines: `water-500` (#4A8B6E), 2px — most prominent linear features
- Buildings: `earth-50` (#F3EDE5)

### Map overlay controls

- Float top-right of map viewport
- Background: `bg-surface`, `rounded-lg`, shadow `0 2px 8px rgba(44,58,42,0.1)`
- Cluster: zoom +/−, compass, GPS/locate, layer toggle
- Each button: 40x40px, `green-600` icons (20px), separated by 1px `green-50` dividers

### Canal route highlighting

When a user plans or views a route:

- Route line: 4px, `water-500` (#4A8B6E), opacity 0.8
- Direction chevrons: small arrows along the route every ~100px screen distance
- Start marker: 12px circle, `water-500`
- End marker: 12px circle, `green-600`
- Lock positions along route: small diamond markers in `earth-500`
- Suggested overnight moorings (saved routes): 10px circle, `green-400`, dashed border

### Location freshness (friends — logged in only)

Continuous cruisers move regularly — location is always approximate and time-decayed.

| Freshness | Marker opacity | Status dot |
|-----------|---------------|------------|
| Fresh (< 6h) | 100% | `water-500` (green) |
| Recent (6–24h) | 70% | `rust-500` (orange) |
| Stale (1–7d) | 40% | `green-300` (grey-green) |
| Old (> 7d) | Hidden by default | — |

### Data sources

Initial POI data can be seeded from OpenStreetMap (ODbL licence) for locks, bridges, winding holes, and basic services. CRT (Canal & River Trust) publishes stoppage notices that can be consumed via their feeds. Community-reported status data layers on top of this baseline.

---

## 9. Dark mode

### Approach

Dark mode should feel like the canal at dusk — deep warm greens, not harsh black. Many users will check the app in low light on their boats.

### Colour mapping

| Light mode | Dark mode | Token |
|------------|-----------|-------|
| `#F3F0E8` (oatmeal bg) | `#1E2620` (dark moss) | `bg-primary` |
| `#FFFFFF` (cards) | `#273029` (deep cabin) | `bg-surface` |
| `#FAF8F5` (elevated) | `#2E382F` (twilight moss) | `bg-elevated` |
| `#EDE9E0` (recessed) | `#1A201C` (midnight green) | `bg-recessed` |
| `#2C3A2A` (headings) | `#D8DDD2` (moonlit sage) | `green-800` |
| `#3A4830` (body) | `#BCC5B2` (evening lichen) | `green-700` |
| `#5E7048` (links) | `#8AA676` (bright fern) | `green-500` |
| `#C5CCBA` (borders) | `#3A4538` (dark border) | `green-100` |
| `#4A8B6E` (water accent) | `#5EA882` (bright canal) | `water-500` |
| `#C4704A` (rust accent) | `#D88A64` (warm rust) | `rust-500` |

### Map in dark mode

- Switch to `mapbox://styles/mapbox/dark-v11` base with canal palette overrides
- Canal lines: `water-500` dark variant (#5EA882), 2px
- Water fills: `water-700` at 20% opacity
- Markers: add `0 0 4px rgba(0,0,0,0.5)` shadow for visibility
- POI icon interiors: white (same as light mode)

---

## 10. Motion & animation

### Principles

Motion should feel like water: smooth, unhurried, natural. Use easing curves that decelerate gently. Never bounce or elastic. Always respect `prefers-reduced-motion`.

### Timing

| Pattern | Duration | Easing |
|---------|----------|--------|
| Button press | 100ms | ease-out |
| Card appear | 200ms | ease-out |
| Bottom sheet slide | 300ms | cubic-bezier(0.32, 0.72, 0, 1) |
| Map marker appear | 250ms | ease-out (fade + scale 0.6→1.0) |
| Page transition | 250ms | ease-in-out |
| Marker pulse (selected) | 2000ms | ease-in-out, infinite |
| Marker stagger | 30ms per marker | — |
| Filter chip toggle | 150ms | ease-out |
| Account gate prompt | 300ms | ease-out (slide up) |

---

## 11. Iconography

### Style

- Line icons, stroke 1.5px, rounded caps and joins
- 24px default grid, 16px for inline / compact
- Base set: Lucide icon library
- Icon colour defaults to `green-500` (#5E7048), or `green-300` when muted

### Canal-specific custom icons needed

Only ONE custom icon is required — the narrowboat silhouette for friend location markers on the map. Everything else uses standard Lucide icons.

| Asset | Description |
|-------|-------------|
| Narrowboat marker | Top-down simplified silhouette, slightly tapered bow, 32x12px. Fill is parameterised (user's chosen boat colour). Stroke `green-800`. |

### Lucide icon mapping (complete)

**Map POI markers** (16px inside pin, stroke 1.5px):

| Category | Lucide icon | Pin fill | Icon stroke |
|----------|------------|----------|-------------|
| Water point | `Droplets` | `water-500` (#4A8B6E) | #FAF8F5 |
| Mooring | `Anchor` | `green-600` (#4A5A3A) | #FAF8F5 |
| Lock | `BetweenVerticalStart` | `earth-500` (#8A7558) | #FAF8F5 |
| Winding hole | `RotateCcw` | `earth-300` (#C8B89E) | #3A4830 |
| Pub / food | `Beer` | `rust-500` (#C4704A) | #FAF8F5 |
| Waste services | `WavesArrowDown` | `green-400` (#7A8E66) | #FAF8F5 |
| Shop / services | `Store` | `green-500` (#5E7048) | #FAF8F5 |
| Boatyard / fuel | `Wrench` | `earth-700` (#6B5A42) | #FAF8F5 |
| Event | `Calendar` | `green-600` (#4A5A3A) | #FAF8F5 |

**UI icons** (24px, stroke 1.5px, `green-500` default):

| Context | Lucide icon |
|---------|------------|
| Search | `Search` |
| Filter | `SlidersHorizontal` |
| Navigate / directions | `Navigation` |
| Route / plan | `Route` |
| Map view | `Map` |
| Profile | `User` |
| Friends | `Users` |
| Events | `Calendar` |
| Services | `Wrench` |
| Notifications | `Bell` |
| Settings | `Settings` |
| WhatsApp message | `MessageCircle` (with WhatsApp brand colour) |
| Share | `Share2` |
| Report issue | `Flag` |
| Status: working | `CircleCheck` |
| Status: issue | `AlertTriangle` |
| Status: closed | `CircleX` |
| 14-day timer | `Timer` |
| Cruising log | `BookOpen` |
| Add friend | `UserPlus` |
| Location sharing | `MapPin` |
| QR code | `QrCode` |

---

## 12. Backend — Supabase + PostGIS

### Overview

Towpath uses Supabase (hosted Postgres + PostGIS + Auth + Storage + Edge Functions) as its backend. This gives us spatial queries for map data, row-level security for the open/account tier split, built-in auth, photo storage for service reports, and edge functions for background tasks like CRT stoppage ingestion.

### Setup

1. Create a Supabase project
2. Enable the PostGIS extension: Dashboard → Database → Extensions → search "postgis" → Enable
3. Enable Row Level Security on every table
4. Set up auth providers: email/magic link at minimum, Google/Apple OAuth optional for v2
5. Create a storage bucket `photos` for service report images (public read, authenticated upload)

### Schema

#### Extensions and types

```sql
-- Enable PostGIS (do this first)
CREATE EXTENSION IF NOT EXISTS postgis;

-- Enum types
CREATE TYPE poi_type AS ENUM (
  'water_point', 'mooring', 'lock', 'winding_hole',
  'waste_services', 'pump_out', 'pub', 'shop',
  'boatyard', 'fuel', 'launderette', 'post_office'
);

CREATE TYPE service_status AS ENUM (
  'working', 'issue_reported', 'closed', 'unknown'
);

CREATE TYPE boat_type AS ENUM (
  'narrowboat', 'widebeam', 'cruiser', 'dutch_barge',
  'tug', 'butty', 'other'
);

CREATE TYPE friendship_status AS ENUM ('pending', 'accepted');

CREATE TYPE stoppage_type AS ENUM (
  'closure', 'restriction', 'maintenance', 'emergency'
);

CREATE TYPE route_pace AS ENUM ('relaxed', 'steady', 'pushing');
```

#### Core canal data (open read)

```sql
-- Canal/waterway linestrings
CREATE TABLE canals (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  alternate_names TEXT[],           -- e.g. "the Oxford", "the cut"
  geometry GEOGRAPHY(LineString, 4326) NOT NULL,
  length_mi NUMERIC(6,2),
  navigation_authority TEXT DEFAULT 'CRT',
  created_at TIMESTAMPTZ DEFAULT now()
);
CREATE INDEX idx_canals_geometry ON canals USING GIST (geometry);

-- Points of interest
CREATE TABLE pois (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  type poi_type NOT NULL,
  location GEOGRAPHY(Point, 4326) NOT NULL,
  canal_id UUID REFERENCES canals(id),
  mile_marker NUMERIC(6,2),        -- distance along canal from start
  metadata JSONB DEFAULT '{}',     -- type-specific: opening_hours, phone, etc.
  osm_id BIGINT,                   -- source tracking if imported from OSM
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);
CREATE INDEX idx_pois_location ON pois USING GIST (location);
CREATE INDEX idx_pois_type ON pois (type);
CREATE INDEX idx_pois_canal ON pois (canal_id);

-- Lock-specific data (extends POI)
CREATE TABLE locks (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  poi_id UUID NOT NULL REFERENCES pois(id) ON DELETE CASCADE,
  rise_ft NUMERIC(4,1),
  width_ft NUMERIC(4,1),
  length_ft NUMERIC(5,1),
  type TEXT CHECK (type IN ('narrow', 'wide', 'broad')),
  paired BOOLEAN DEFAULT false,
  staircase INTEGER DEFAULT 1,     -- number of chambers if staircase lock
  notes TEXT
);

-- CRT stoppage notices
CREATE TABLE stoppages (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  canal_id UUID REFERENCES canals(id),
  title TEXT NOT NULL,
  description TEXT,
  type stoppage_type NOT NULL,
  start_point GEOGRAPHY(Point, 4326),
  end_point GEOGRAPHY(Point, 4326),
  affected_geometry GEOGRAPHY(LineString, 4326),  -- the stretch that's closed
  starts_at TIMESTAMPTZ,
  ends_at TIMESTAMPTZ,
  source_url TEXT,                  -- link to CRT notice
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);
CREATE INDEX idx_stoppages_active ON stoppages (is_active) WHERE is_active = true;
CREATE INDEX idx_stoppages_geometry ON stoppages USING GIST (affected_geometry);
```

#### User data (authenticated)

```sql
-- User profiles (id = auth.users.id)
CREATE TABLE profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  handle TEXT UNIQUE NOT NULL,
  boat_name TEXT,
  boat_colour TEXT DEFAULT '#C93B3B',  -- hex colour for map marker
  boat_type boat_type DEFAULT 'narrowboat',
  is_cc BOOLEAN DEFAULT true,          -- continuous cruiser flag
  bio TEXT,
  whatsapp_number TEXT,                -- encrypted, nullable, opt-in only
  whatsapp_enabled BOOLEAN DEFAULT false,
  avatar_url TEXT,
  trust_score INTEGER DEFAULT 0,       -- incremented by confirmed reports
  total_miles NUMERIC(8,1) DEFAULT 0,
  total_locks INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);
CREATE INDEX idx_profiles_handle ON profiles (handle);

-- Boat location (for friend sharing)
CREATE TABLE boat_locations (
  user_id UUID PRIMARY KEY REFERENCES profiles(id) ON DELETE CASCADE,
  location GEOGRAPHY(Point, 4326) NOT NULL,
  heading NUMERIC(5,1),               -- degrees, nullable
  accuracy_m NUMERIC(6,1),
  updated_at TIMESTAMPTZ DEFAULT now()
);
CREATE INDEX idx_boat_locations_geo ON boat_locations USING GIST (location);
CREATE INDEX idx_boat_locations_fresh ON boat_locations (updated_at);

-- Friendships (bidirectional, mutual)
CREATE TABLE friendships (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  requester_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  addressee_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  status friendship_status DEFAULT 'pending',
  share_location BOOLEAN DEFAULT false,   -- both must enable independently
  created_at TIMESTAMPTZ DEFAULT now(),
  UNIQUE (requester_id, addressee_id),
  CHECK (requester_id != addressee_id)
);
CREATE INDEX idx_friendships_users ON friendships (requester_id, addressee_id);
```

#### Community content (open read, auth write)

```sql
-- Service status reports
CREATE TABLE status_reports (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  poi_id UUID NOT NULL REFERENCES pois(id) ON DELETE CASCADE,
  user_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  status service_status NOT NULL,
  comment TEXT,
  photos TEXT[],                        -- array of storage bucket paths
  confirmation_count INTEGER DEFAULT 0, -- denormalized for performance
  created_at TIMESTAMPTZ DEFAULT now()
);
CREATE INDEX idx_reports_poi ON status_reports (poi_id, created_at DESC);
CREATE INDEX idx_reports_user ON status_reports (user_id);

-- Report confirmations (upvotes)
CREATE TABLE report_confirmations (
  report_id UUID NOT NULL REFERENCES status_reports(id) ON DELETE CASCADE,
  user_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  created_at TIMESTAMPTZ DEFAULT now(),
  PRIMARY KEY (report_id, user_id)
);

-- Events
CREATE TABLE events (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  creator_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  description TEXT,
  location GEOGRAPHY(Point, 4326) NOT NULL,
  location_name TEXT,                   -- human-readable: "Braunston Marina"
  canal_id UUID REFERENCES canals(id),
  starts_at TIMESTAMPTZ NOT NULL,
  ends_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT now()
);
CREATE INDEX idx_events_location ON events USING GIST (location);
CREATE INDEX idx_events_date ON events (starts_at) WHERE starts_at > now();

-- Event RSVPs
CREATE TABLE event_rsvps (
  event_id UUID NOT NULL REFERENCES events(id) ON DELETE CASCADE,
  user_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  created_at TIMESTAMPTZ DEFAULT now(),
  PRIMARY KEY (event_id, user_id)
);

-- Groups
CREATE TABLE groups (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  description TEXT,
  whatsapp_url TEXT,                    -- link to existing WhatsApp group
  creator_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  created_at TIMESTAMPTZ DEFAULT now()
);

-- Group memberships
CREATE TABLE group_members (
  group_id UUID NOT NULL REFERENCES groups(id) ON DELETE CASCADE,
  user_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  joined_at TIMESTAMPTZ DEFAULT now(),
  PRIMARY KEY (group_id, user_id)
);
```

#### Personal tracking (auth own only)

```sql
-- Saved routes
CREATE TABLE saved_routes (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  geometry GEOGRAPHY(LineString, 4326) NOT NULL,
  pace route_pace DEFAULT 'steady',
  total_miles NUMERIC(6,1),
  total_locks INTEGER,
  estimated_days INTEGER,
  day_breakdown JSONB,                -- [{day: 1, from: "Braunston", to: "Napton", miles: 9, locks: 12}]
  shared BOOLEAN DEFAULT false,       -- visible to friends
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);
CREATE INDEX idx_routes_user ON saved_routes (user_id);

-- 14-day mooring timer
CREATE TABLE mooring_timers (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  started_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  location GEOGRAPHY(Point, 4326) NOT NULL,
  location_name TEXT,
  notified_day_12 BOOLEAN DEFAULT false,  -- 2-day warning
  notified_day_14 BOOLEAN DEFAULT false,  -- time's up
  is_active BOOLEAN DEFAULT true
);
CREATE INDEX idx_timers_active ON mooring_timers (user_id, is_active) WHERE is_active = true;

-- Cruising log entries
CREATE TABLE cruising_log (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  date DATE NOT NULL,
  miles NUMERIC(5,1),
  locks_worked INTEGER DEFAULT 0,
  canal_id UUID REFERENCES canals(id),
  from_location TEXT,
  to_location TEXT,
  notes TEXT,
  created_at TIMESTAMPTZ DEFAULT now()
);
CREATE INDEX idx_log_user_date ON cruising_log (user_id, date DESC);
```

### Row-level security policies

```sql
-- POIs: everyone reads, no direct user writes (admin/import only)
ALTER TABLE pois ENABLE ROW LEVEL SECURITY;
CREATE POLICY "pois_read" ON pois FOR SELECT USING (true);

-- Canals: everyone reads
ALTER TABLE canals ENABLE ROW LEVEL SECURITY;
CREATE POLICY "canals_read" ON canals FOR SELECT USING (true);

-- Locks: everyone reads
ALTER TABLE locks ENABLE ROW LEVEL SECURITY;
CREATE POLICY "locks_read" ON locks FOR SELECT USING (true);

-- Stoppages: everyone reads
ALTER TABLE stoppages ENABLE ROW LEVEL SECURITY;
CREATE POLICY "stoppages_read" ON stoppages FOR SELECT USING (true);

-- Profiles: everyone reads public fields, owner updates own
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
CREATE POLICY "profiles_read" ON profiles FOR SELECT USING (true);
CREATE POLICY "profiles_update" ON profiles FOR UPDATE USING (auth.uid() = id);
CREATE POLICY "profiles_insert" ON profiles FOR INSERT WITH CHECK (auth.uid() = id);

-- Status reports: everyone reads, authenticated users create, owner deletes
ALTER TABLE status_reports ENABLE ROW LEVEL SECURITY;
CREATE POLICY "reports_read" ON status_reports FOR SELECT USING (true);
CREATE POLICY "reports_insert" ON status_reports FOR INSERT
  WITH CHECK (auth.uid() = user_id);
CREATE POLICY "reports_delete" ON status_reports FOR DELETE
  USING (auth.uid() = user_id);

-- Report confirmations: authenticated users only
ALTER TABLE report_confirmations ENABLE ROW LEVEL SECURITY;
CREATE POLICY "confirmations_read" ON report_confirmations FOR SELECT USING (true);
CREATE POLICY "confirmations_insert" ON report_confirmations FOR INSERT
  WITH CHECK (auth.uid() = user_id);
CREATE POLICY "confirmations_delete" ON report_confirmations FOR DELETE
  USING (auth.uid() = user_id);

-- Events: everyone reads, authenticated create, owner updates/deletes
ALTER TABLE events ENABLE ROW LEVEL SECURITY;
CREATE POLICY "events_read" ON events FOR SELECT USING (true);
CREATE POLICY "events_insert" ON events FOR INSERT
  WITH CHECK (auth.uid() = creator_id);
CREATE POLICY "events_update" ON events FOR UPDATE
  USING (auth.uid() = creator_id);
CREATE POLICY "events_delete" ON events FOR DELETE
  USING (auth.uid() = creator_id);

-- Event RSVPs: authenticated users
ALTER TABLE event_rsvps ENABLE ROW LEVEL SECURITY;
CREATE POLICY "rsvps_read" ON event_rsvps FOR SELECT USING (true);
CREATE POLICY "rsvps_insert" ON event_rsvps FOR INSERT
  WITH CHECK (auth.uid() = user_id);
CREATE POLICY "rsvps_delete" ON event_rsvps FOR DELETE
  USING (auth.uid() = user_id);

-- Boat locations: only visible to mutual friends with location sharing enabled
ALTER TABLE boat_locations ENABLE ROW LEVEL SECURITY;
CREATE POLICY "locations_read" ON boat_locations FOR SELECT USING (
  auth.uid() = user_id  -- can see own
  OR EXISTS (
    SELECT 1 FROM friendships
    WHERE status = 'accepted'
      AND share_location = true
      AND (
        (requester_id = auth.uid() AND addressee_id = boat_locations.user_id)
        OR (addressee_id = auth.uid() AND requester_id = boat_locations.user_id)
      )
  )
);
CREATE POLICY "locations_upsert" ON boat_locations FOR INSERT
  WITH CHECK (auth.uid() = user_id);
CREATE POLICY "locations_update" ON boat_locations FOR UPDATE
  USING (auth.uid() = user_id);

-- Friendships: participants only
ALTER TABLE friendships ENABLE ROW LEVEL SECURITY;
CREATE POLICY "friendships_read" ON friendships FOR SELECT USING (
  auth.uid() IN (requester_id, addressee_id)
);
CREATE POLICY "friendships_insert" ON friendships FOR INSERT
  WITH CHECK (auth.uid() = requester_id);
CREATE POLICY "friendships_update" ON friendships FOR UPDATE USING (
  auth.uid() IN (requester_id, addressee_id)
);
CREATE POLICY "friendships_delete" ON friendships FOR DELETE USING (
  auth.uid() IN (requester_id, addressee_id)
);

-- Saved routes: owner only (unless shared, then friends can read)
ALTER TABLE saved_routes ENABLE ROW LEVEL SECURITY;
CREATE POLICY "routes_read" ON saved_routes FOR SELECT USING (
  auth.uid() = user_id
  OR (shared = true AND EXISTS (
    SELECT 1 FROM friendships
    WHERE status = 'accepted'
      AND (
        (requester_id = auth.uid() AND addressee_id = saved_routes.user_id)
        OR (addressee_id = auth.uid() AND requester_id = saved_routes.user_id)
      )
  ))
);
CREATE POLICY "routes_insert" ON saved_routes FOR INSERT
  WITH CHECK (auth.uid() = user_id);
CREATE POLICY "routes_update" ON saved_routes FOR UPDATE
  USING (auth.uid() = user_id);
CREATE POLICY "routes_delete" ON saved_routes FOR DELETE
  USING (auth.uid() = user_id);

-- Mooring timers: owner only
ALTER TABLE mooring_timers ENABLE ROW LEVEL SECURITY;
CREATE POLICY "timers_read" ON mooring_timers FOR SELECT
  USING (auth.uid() = user_id);
CREATE POLICY "timers_insert" ON mooring_timers FOR INSERT
  WITH CHECK (auth.uid() = user_id);
CREATE POLICY "timers_update" ON mooring_timers FOR UPDATE
  USING (auth.uid() = user_id);

-- Cruising log: owner only
ALTER TABLE cruising_log ENABLE ROW LEVEL SECURITY;
CREATE POLICY "log_read" ON cruising_log FOR SELECT
  USING (auth.uid() = user_id);
CREATE POLICY "log_insert" ON cruising_log FOR INSERT
  WITH CHECK (auth.uid() = user_id);
CREATE POLICY "log_update" ON cruising_log FOR UPDATE
  USING (auth.uid() = user_id);
CREATE POLICY "log_delete" ON cruising_log FOR DELETE
  USING (auth.uid() = user_id);

-- Groups: everyone reads, authenticated create
ALTER TABLE groups ENABLE ROW LEVEL SECURITY;
CREATE POLICY "groups_read" ON groups FOR SELECT USING (true);
CREATE POLICY "groups_insert" ON groups FOR INSERT
  WITH CHECK (auth.uid() = creator_id);
CREATE POLICY "groups_update" ON groups FOR UPDATE
  USING (auth.uid() = creator_id);

-- Group members: members can see, authenticated join/leave
ALTER TABLE group_members ENABLE ROW LEVEL SECURITY;
CREATE POLICY "members_read" ON group_members FOR SELECT USING (true);
CREATE POLICY "members_insert" ON group_members FOR INSERT
  WITH CHECK (auth.uid() = user_id);
CREATE POLICY "members_delete" ON group_members FOR DELETE
  USING (auth.uid() = user_id);
```

### Key spatial queries

**POIs in map viewport** (called on every pan/zoom — debounce to 300ms client-side):

```sql
SELECT p.*, 
  (SELECT json_build_object('status', sr.status, 'count', COUNT(*), 'latest', MAX(sr.created_at))
   FROM status_reports sr WHERE sr.poi_id = p.id
   GROUP BY sr.status ORDER BY COUNT(*) DESC LIMIT 1
  ) AS current_status
FROM pois p
WHERE ST_Within(p.location, ST_MakeEnvelope($lng1, $lat1, $lng2, $lat2, 4326))
  AND ($type_filter IS NULL OR p.type = $type_filter);
```

**POIs along a canal stretch** (for route planning):

```sql
SELECT p.*, l.rise_ft, l.width_ft, l.type AS lock_type, l.paired
FROM pois p
LEFT JOIN locks l ON l.poi_id = p.id
WHERE ST_DWithin(p.location, (SELECT geometry FROM canals WHERE id = $canal_id), 200)
ORDER BY p.mile_marker;
```

**Nearest service of a type:**

```sql
SELECT p.*,
  ST_Distance(p.location, ST_Point($lng, $lat)::geography) AS distance_m
FROM pois p
WHERE p.type = $poi_type
ORDER BY p.location <-> ST_Point($lng, $lat)::geography
LIMIT 5;
```

**Latest status for a POI** (aggregated from reports):

```sql
SELECT sr.status,
  COUNT(*) AS report_count,
  MAX(sr.created_at) AS latest_report,
  json_agg(json_build_object(
    'id', sr.id, 'comment', sr.comment, 'photos', sr.photos,
    'user_handle', p.handle, 'created_at', sr.created_at,
    'confirmations', sr.confirmation_count
  ) ORDER BY sr.created_at DESC) AS reports
FROM status_reports sr
JOIN profiles p ON p.id = sr.user_id
WHERE sr.poi_id = $poi_id
  AND sr.created_at > now() - interval '30 days'
GROUP BY sr.status
ORDER BY COUNT(*) DESC;
```

**Friends with locations** (authenticated, mutual only):

```sql
SELECT bl.location, bl.heading, bl.updated_at,
  p.handle, p.boat_name, p.boat_colour, p.boat_type
FROM boat_locations bl
JOIN profiles p ON p.id = bl.user_id
WHERE bl.updated_at > now() - interval '7 days'
  AND EXISTS (
    SELECT 1 FROM friendships f
    WHERE f.status = 'accepted' AND f.share_location = true
      AND (
        (f.requester_id = auth.uid() AND f.addressee_id = bl.user_id)
        OR (f.addressee_id = auth.uid() AND f.requester_id = bl.user_id)
      )
  );
```

**Active stoppages affecting a route:**

```sql
SELECT s.*
FROM stoppages s
WHERE s.is_active = true
  AND ST_Intersects(s.affected_geometry, $route_geometry);
```

### Database functions

```sql
-- Confirm a report (increments count + updates trust score)
CREATE OR REPLACE FUNCTION confirm_report(p_report_id UUID)
RETURNS void AS $$
BEGIN
  INSERT INTO report_confirmations (report_id, user_id)
  VALUES (p_report_id, auth.uid())
  ON CONFLICT DO NOTHING;
  
  UPDATE status_reports
  SET confirmation_count = confirmation_count + 1
  WHERE id = p_report_id;
  
  -- Increment trust score of the report author
  UPDATE profiles
  SET trust_score = trust_score + 1
  WHERE id = (SELECT user_id FROM status_reports WHERE id = p_report_id);
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Get aggregated POI status (for map markers)
CREATE OR REPLACE FUNCTION get_poi_status(p_poi_id UUID)
RETURNS TABLE(status service_status, report_count BIGINT, latest TIMESTAMPTZ) AS $$
  SELECT sr.status, COUNT(*), MAX(sr.created_at)
  FROM status_reports sr
  WHERE sr.poi_id = p_poi_id
    AND sr.created_at > now() - interval '30 days'
  GROUP BY sr.status
  ORDER BY COUNT(*) DESC
  LIMIT 1;
$$ LANGUAGE sql STABLE;

-- Update boat location (upsert)
CREATE OR REPLACE FUNCTION update_boat_location(
  p_lat DOUBLE PRECISION,
  p_lng DOUBLE PRECISION,
  p_heading DOUBLE PRECISION DEFAULT NULL,
  p_accuracy DOUBLE PRECISION DEFAULT NULL
) RETURNS void AS $$
BEGIN
  INSERT INTO boat_locations (user_id, location, heading, accuracy_m, updated_at)
  VALUES (
    auth.uid(),
    ST_Point(p_lng, p_lat)::geography,
    p_heading,
    p_accuracy,
    now()
  )
  ON CONFLICT (user_id) DO UPDATE SET
    location = ST_Point(p_lng, p_lat)::geography,
    heading = COALESCE(p_heading, boat_locations.heading),
    accuracy_m = p_accuracy,
    updated_at = now();
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;
```

### Edge functions (Supabase Edge Functions / Deno)

| Function | Trigger | Purpose |
|----------|---------|---------|
| `ingest-stoppages` | Cron (daily) | Fetch CRT stoppage notices feed, upsert into `stoppages` table, mark resolved ones inactive |
| `mooring-reminders` | Cron (hourly) | Check `mooring_timers` for day 12 and day 14, send push/email notification |
| `update-cruising-stats` | On INSERT to `cruising_log` | Recalculate `profiles.total_miles` and `profiles.total_locks` |
| `cleanup-old-reports` | Cron (weekly) | Archive status reports older than 90 days, recalculate POI statuses |

### Storage buckets

| Bucket | Access | Max file size | Transforms |
|--------|--------|---------------|------------|
| `avatars` | Public read, auth upload (own path) | 2MB | Resize to 256px on upload |
| `report-photos` | Public read, auth upload | 5MB | Resize to 1200px wide, generate 400px thumbnail |
| `boat-photos` | Public read, auth upload (own path) | 5MB | Resize to 1200px wide |

Storage path convention: `{bucket}/{user_id}/{filename}` — RLS policy checks that the upload path starts with the user's own ID.

### Client integration (Next.js)

```bash
npm install @supabase/supabase-js @supabase/ssr
```

Environment variables:

```env
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJ...
```

The anon key is safe to expose client-side — RLS policies enforce access control. Authenticated requests use the user's JWT automatically after sign-in.

**Client-side query pattern (viewport POIs):**

```typescript
const { data: pois } = await supabase
  .from('pois')
  .select('*, locks(*)')
  .filter('location', 'within', mapBounds)  // PostGIS via RPC for complex spatial
```

For complex spatial queries (viewport, distance), call the SQL functions via `supabase.rpc()` rather than using the REST API filters — PostGIS operators aren't fully exposed through the auto-generated REST layer.

### Performance considerations

- **Debounce viewport queries** to 300ms on map pan/zoom — don't fire on every frame
- **Cache POI data client-side** — static infrastructure (locks, bridges, winding holes) rarely changes. Cache aggressively with SWR/React Query, revalidate every 10 minutes
- **Status reports are the hot path** — these change frequently. Use Supabase Realtime subscriptions on `status_reports` filtered by viewport or canal_id for live updates
- **Simplify canal geometries** on import — run `ST_Simplify(geometry, 0.0001)` on OSM linestrings to reduce coordinate density. Raw OSM canals have sub-metre precision you don't need for display
- **Consider Mapbox vector tiles** for static POI display at low zoom levels — serve a pre-built tileset of all POIs rather than querying Supabase for every viewport change. Switch to live Supabase queries at zoom 12+ where the user is looking at a specific stretch
- **Spatial index maintenance** — run `REINDEX INDEX idx_pois_location` periodically if you're bulk-importing data

### Free tier budget estimate

| Resource | Free tier limit | Estimated Towpath usage (soft launch) |
|----------|----------------|--------------------------------------|
| Database | 500 MB | ~100MB (canals + POIs + user data) |
| Storage | 1 GB | ~200MB (photos, growing) |
| Auth users | 50,000 | Plenty for early community |
| Edge function invocations | 500,000/month | ~50k (daily cron + report triggers) |
| Realtime connections | 200 concurrent | Fine for < 500 active users |
| API requests | No hard cap (fair use) | Monitor — debounce + caching keeps this manageable |

You'll likely need to move to the Pro tier ($25/month) once you have a few hundred active users regularly uploading photos, but the free tier is sufficient to build, test, and launch.

---

## 13. Tailwind configuration

```js
// tailwind.config.js
module.exports = {
  content: ['./src/**/*.{js,ts,jsx,tsx}'],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        bg: {
          primary: '#F3F0E8',
          surface: '#FFFFFF',
          elevated: '#FAF8F5',
          recessed: '#EDE9E0',
          tinted: '#E8EBE2',
        },
        green: {
          50: '#E8EBE2',
          100: '#C5CCBA',
          200: '#A8B596',
          300: '#8A9A74',
          400: '#7A8E66',
          500: '#5E7048',
          600: '#4A5A3A',
          700: '#3A4830',
          800: '#2C3A2A',
          900: '#222E20',
        },
        water: {
          50: '#E3EEE8',
          300: '#8DBBA8',
          500: '#4A8B6E',
          700: '#2E6B50',
        },
        earth: {
          50: '#F3EDE5',
          300: '#C8B89E',
          500: '#8A7558',
          700: '#6B5A42',
        },
        rust: {
          50: '#F5E8E0',
          500: '#C4704A',
          700: '#8B4A2E',
        },
        danger: {
          DEFAULT: '#B5403A',
          light: '#F8ECEA',
        },
        whatsapp: '#25D366',
      },
      fontFamily: {
        display: ['"Averia Serif Libre"', 'Georgia', 'serif'],
        sans: ['Karla', 'system-ui', 'sans-serif'],
        mono: ['"DM Mono"', 'ui-monospace', 'monospace'],
      },
      borderRadius: {
        sm: '4px',
        md: '8px',
        lg: '12px',
        xl: '16px',
      },
      fontSize: {
        display: ['1.75rem', { lineHeight: '1.2', letterSpacing: '-0.01em', fontWeight: '700' }],
        h1: ['1.5rem', { lineHeight: '1.25', letterSpacing: '-0.01em', fontWeight: '700' }],
        h2: ['1.25rem', { lineHeight: '1.3', fontWeight: '400' }],
        h3: ['1.0625rem', { lineHeight: '1.4', fontWeight: '600' }],
        body: ['0.9375rem', { lineHeight: '1.6' }],
        sm: ['0.8125rem', { lineHeight: '1.5', letterSpacing: '0.01em' }],
        xs: ['0.6875rem', { lineHeight: '1.4', letterSpacing: '0.02em' }],
        label: ['0.75rem', { lineHeight: '1.3', letterSpacing: '0.04em', fontWeight: '500' }],
      },
      boxShadow: {
        card: '0 1px 3px rgba(44,58,42,0.08)',
        float: '0 2px 8px rgba(44,58,42,0.08)',
        overlay: '0 4px 16px rgba(44,58,42,0.12)',
      },
    },
  },
  plugins: [],
}
```

---

## 14. WhatsApp integration

WhatsApp is the messaging layer at launch rather than building in-app chat.

**User-to-user messaging:**
- "Message" button on boat cards opens `https://wa.me/{number}?text=Hi%20from%20Towpath!`
- WhatsApp number is opt-in in profile settings
- Users without WhatsApp linked show a disabled message button with tooltip "This boater hasn't enabled messaging"

**Group integration:**
- Groups can link to an existing WhatsApp group invite URL
- Displayed as a "Join WhatsApp group" button on the group page
- Towpath doesn't manage the WhatsApp group — just links to it

**Privacy:**
- WhatsApp number sharing is strictly opt-in
- Number is never displayed directly — only the "Message" button appears
- Users can revoke at any time in settings

---

## 15. Prompt templates

### For Google Stitch

```
Design a mobile-first web app called "Towpath" — a map-centric tool
and social network for continuous cruisers on the UK canal network.

The app has two tiers:
- OPEN (no account): Full interactive canal map with navigation data,
  services directory (water points, locks, moorings, pubs), route
  planning with distance/time estimates, CRT stoppage notices, and
  read-only access to community status reports and events.
- ACCOUNT (free): Adds the ability to report service status, comment,
  save routes with day-by-day breakdowns, create/RSVP to events,
  build a profile with cruising log, add friends with location
  sharing, and message via WhatsApp.

There is NO feed/timeline screen. The map IS the home screen.

Visual style: Warm, earthy, and minimal. Inspired by the English
canal landscape.

Background: warm oatmeal white (#F3F0E8) for the page, pure white
for cards and surfaces.

Primary color ramp (text + brand): muddy green scale — #2C3A2A for
headings, #3A4830 for body text, #5E7048 for links and interactive
elements, #8A9A74 for muted metadata, #C5CCBA for borders, #E8EBE2
for tinted surfaces.

Secondary accents: canal water green (#4A8B6E) for info/water
features, towpath brown (#8A7558) for locks and earthy elements,
rust (#C4704A) for pubs and warm warnings.

Typography: "Averia Serif Libre" (700) for display headings, the app
name, boat names — hand-drawn narrowboat lettering quality. "Karla"
(400/500/600) for all body text and UI — clean and geometric.

Primary interaction: full-viewport Mapbox map with bottom sheet
overlay (mobile) or side panel (desktop). Bottom sheet has peek
(search bar + filter chips), half, and full snap points.

Mobile bottom nav: 4 items when logged out (Map, Services, Routes,
Search), 5 when logged in (Map, Services, Routes, Events, Profile).

Cards are white with 1px #C5CCBA borders, 12px radius, 16px padding.
Buttons 40px tall, 8px radius. Primary CTA is #4A5A3A with off-white
text. WhatsApp buttons use #25D366.

Motion: smooth and calm — ease-out, 200-300ms, no bounce.

Dark mode: deep warm greens (#1E2620 bg, #273029 cards) — canal at
dusk, not harsh black.

Design the following screens: [specify screens needed]
```

### For Claude Code

```
You are building "Towpath" — a Next.js (App Router) web app with
Tailwind CSS and Mapbox GL JS. It's a map-centric tool and social
network for continuous cruisers on the UK canal network.

## Architecture

Two tiers — the app works WITHOUT an account for core navigation:
- Open: Full map, services, route planning, stoppages, read-only
  community reports. No login required.
- Account (free): Report service status, comment, save routes, events,
  profile + cruising log, friends, WhatsApp messaging.

There is no feed/timeline. The map is the home screen. The account
gate appears contextually when users try to participate (report,
save, RSVP, message) — never as a wall.

## Design system

Use the following Tailwind config:
[paste the Tailwind config from section 12 above]

Import fonts from Google Fonts:
- Averia Serif Libre (400, 700) — display headings and boat names
- Karla (400, 500, 600) — all body text and UI

## Visual direction

Warm, earthy, minimal. Oatmeal (#F3F0E8) page background, white
cards. All text uses the muddy green ramp — no grays. #2C3A2A for
headings, #3A4830 for body, #5E7048 for interactive, #8A9A74 muted.

## Key patterns

- Mobile-first: map fills viewport, UI overlays via bottom sheet
- Bottom sheet: 3 snap points (peek 80px, half 50vh, full)
- Peek state: search bar + horizontal filter chips
- Spring transition: cubic-bezier(0.32, 0.72, 0, 1)
- Desktop: persistent left panel (400px) + map filling rest
- Cards: bg-white border border-green-100 rounded-lg p-4
- Primary buttons: bg-green-600 text-bg-elevated rounded-md h-10
- WhatsApp buttons: bg-whatsapp text-white rounded-md
- Inputs: h-10 border border-green-200 rounded-md, focus water-500
- Headings: font-display (Averia Serif Libre)
- Everything else: font-sans (Karla)

## Navigation

- Mobile logged out: 4-item bottom nav (Map, Services, Routes, Search)
- Mobile logged in: 5-item bottom nav (Map, Services, Routes, Events,
  Profile) — search moves to floating bar
- Desktop: top nav bar, green-800 background

## Map setup

- Mapbox GL JS, custom style based on outdoors-v12
- Land tinted to oatmeal (#F3F0E8)
- Canal lines: water-500 (#4A8B6E), 2px, most prominent features
- Custom narrowboat SVG for friend boats (only custom icon needed)
- POI pins use standard Lucide icons (16px, stroke 1.5px):
  Water=Droplets, Mooring=Anchor, Lock=BetweenVerticalStart,
  Winding=RotateCcw, Pub=Beer, Waste=WavesArrowDown,
  Shop=Store, Boatyard=Wrench, Event=Calendar
- POI markers get status dot overlay (green/orange/red)
- CRT stoppages: red dashed overlay on affected canal sections
- Seed initial POI data from OpenStreetMap (ODbL)

## Account gate

When anonymous user tries a gated action, show contextual prompt:
- Slides up as bottom sheet modal
- Copy adapts: "Create a free account to [report/save/RSVP/message]"
- After sign-up, return to the attempted action
- Never a full-page redirect or generic login wall

## Component conventions

- Icons: Lucide React, 24px, stroke 1.5px, color green-500
- Avatars: rounded-full, initials in Averia Serif Libre
- No feed — services directory and route list replace it
- Bottom nav: 56px, white bg, active=green-600, inactive=green-300
- Shadows: only on elements floating over map (shadow-card/float)
- Status badges: working (water-50/water-700), issue (rust-50/rust-700),
  closed (danger-light/danger)
- Motion: ease-out, 200-300ms, respect prefers-reduced-motion

## Dark mode

Tailwind dark: variant, class strategy. Warm green-blacks (#1E2620
page, #273029 cards). Text lightens (#D8DDD2 headings, #BCC5B2 body).
Mapbox switches to dark-v11 base.

## Backend — Supabase

- Supabase for database (Postgres + PostGIS), auth, storage, edge fns
- Install: @supabase/supabase-js + @supabase/ssr
- Auth: email/magic link, user ID = profiles.id
- PostGIS enabled for all spatial queries (viewport, distance, along-route)
- RLS: anonymous users get SELECT on pois/canals/stoppages/events/reports.
  Authenticated users can INSERT reports/events/routes, UPDATE own content.
- Boat locations: RLS checks mutual friendship + share_location = true
- Storage buckets: avatars (256px), report-photos (1200px + 400px thumb)
- Use supabase.rpc() for complex spatial queries, not REST filters
- Debounce viewport queries 300ms, cache static POI data with SWR
- See section 12 of the design system doc for full schema + RLS policies

Build [specify what to build].
```

---

## 16. File & asset checklist

- [ ] Averia Serif Libre + Karla font files (or Google Fonts link)
- [ ] Custom Mapbox style (outdoors-v12 base, oatmeal land, green labels)
- [ ] Dark mode Mapbox style (dark-v11 base)
- [ ] Narrowboat marker SVG (top-down, parameterised fill colour — the only custom icon)
- [ ] Pin marker base SVG (rounded pin shape, parameterised fill, 24x32px)
- [ ] Lucide React installed (`npm i lucide-react`) — all POI and UI icons covered
- [ ] Stoppage/closure overlay style for canal line segments
- [ ] "Towpath" wordmark in Averia Serif Libre (green-800 and white variants)
- [ ] Favicon and PWA icons (192px, 512px)
- [ ] Open Graph image for social sharing
- [ ] Account gate prompt copy variants (per gated action)
- [ ] WhatsApp button icon (official brand asset)
