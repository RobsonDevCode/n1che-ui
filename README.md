# N1che — iOS

Discover independent fashion shops by aesthetic niche. Walk curated routes between them. Built in SwiftUI for iOS.

---

## What it does

Users pick a style niche (goth, vintage, streetwear, etc.), see nearby independent shops pinned on a map, and can follow or build walking routes between them with turn-by-turn navigation.

---

## Tech stack

| Concern | Solution |
|---|---|
| Framework | SwiftUI (iOS 17+) |
| Maps | MapKit (`MKMapView` via `UIViewRepresentable`) |
| Routing | Google Routes API |
| Auth | AWS Amplify + Cognito (email, Apple, Google) |
| Backend | Go / Gin API (see `n1che-api/`) |
| Error tracking | Sentry iOS SDK |

---

## Project structure

```
n1che-ui/
├── n1che-ui/               # Xcode project
│   ├── Theme/              # Colors, Typography, Spacing, Palette
│   ├── Models/             # Data models (one struct per file)
│   ├── Store/              # @Observable state (Auth, Niche, Shop)
│   ├── Components/         # Reusable UI components
│   ├── Screens/            # App screens
│   ├── Services/           # API + Auth clients
│   ├── ViewModels/         # Screen-level state and logic
│   └── Fonts/              # Bebas Neue, Special Elite, Oswald, IM Fell, DM Mono
└── README.md
```

---

## Getting started

### Prerequisites

- Xcode 16+
- iOS 17+ simulator or device
- A `Config.xcconfig` file in the project root (not committed — see below)

### Config

Create `n1che-ui/Config.xcconfig` with the following keys:

```
API_BASE_URL = https://your-api-url
COGNITO_USER_POOL_ID = eu-west-2_xxxxxxx
COGNITO_CLIENT_ID = xxxxxxxxxxxxxxxxxxxxxxxxxx
COGNITO_REGION = eu-west-2
GOOGLE_ROUTES_API_KEY = AIza...
SENTRY_DSN = https://...
```

### Build & run

```bash
# Open in Xcode
open n1che-ui.xcodeproj

# Or build from the command line
xcodebuild -scheme n1che-ui -destination 'platform=iOS Simulator,name=iPhone 16' build
```

---

## Design system

Newsprint / zine aesthetic — ink on paper, halftone dots, torn edges, mixed typefaces.

| Token | Value |
|---|---|
| Background | `#F0EDE6` (paper) |
| Primary text | `#111111` (ink) |
| Accent | `#000000` (pop) |
| Fonts | Bebas Neue · Special Elite · Oswald · IM Fell English · DM Mono |

All spacing and font sizes are defined in `Theme/Spacing.swift` and `Theme/Typography.swift`. All colours live in `Theme/Colors.swift` — no hex literals in component files.

---

## Conventions

- One type per file (`struct`, `class`, `enum`)
- No magic numbers — use `private static let` constants scoped to the struct, or reference `Spacing.*` / `FontSize.*`
- No hex literals in components — add colours to `Theme/Colors.swift` first
- Don't over-abstract inside a view — inline simple ternaries, only extract when logic is genuinely non-trivial
- Mock data has `// TODO:` comments marking every API swap point

---

## Reference

The React Native prototype in `n1che-ui-prototype/` is the authoritative design reference. When something looks wrong, check the corresponding file in `src/screens/` or `src/components/`.
