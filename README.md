# N1che — App

React Native / Expo frontend for N1che — a mobile app for discovering independent shops curated by niche community.

## Stack

- **Expo SDK 54** (managed workflow)
- **React Navigation v7** — native stack
- **Redux Toolkit** — global state (selected niche, selected shop, auth)
- **React Query + Axios** — data fetching
- **react-native-maps** — Google Maps with custom polaroid markers
- **AWS Amplify** — Cognito auth (email, Google, Apple)

## Getting Started

```bash
npm install
```

Create a `.env.local` file in this directory:

```
GOOGLE_MAPS_API_KEY=your_key_here
```

Then start the dev server:

```bash
npx expo start
```

Press `i` for iOS simulator, `a` for Android emulator, or scan the QR code with Expo Go.

## Environment Variables

| Variable | Required | Purpose |
|---|---|---|
| `GOOGLE_MAPS_API_KEY` | Yes | Maps rendering + Places API |
| `API_BASE_URL` | No (mock data in dev) | Backend API base URL |
| `COGNITO_USER_POOL_ID` | No (auth stubbed in dev) | AWS Cognito pool |
| `COGNITO_CLIENT_ID` | No | AWS Cognito app client |
| `COGNITO_REGION` | No | AWS region |
| `SENTRY_DSN` | No | Error tracking |

For production builds, set these as EAS Secrets (`eas secret:create`).

## Project Structure

```
src/
├── screens/        # Thin view files — layout + navigation only
├── components/     # Reusable UI (Polaroid, CorkBoard, MapMarker, ShopCard)
├── navigation/     # RootNavigator, AppNavigator, type definitions
├── store/          # Redux slices (niche, shop, auth)
├── services/       # Axios client + API functions (shops, votes, routes)
├── hooks/          # React Query wrappers (useNearbyShops, useVote, useLocation)
├── theme/          # colors, typography, spacing tokens
└── mocks/          # Fixture data used during development
```

## Builds

```bash
eas build --platform ios
eas build --platform android
```

## Type Checking

```bash
npx tsc --noEmit
```
