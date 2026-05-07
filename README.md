# MovieStream - React Native Expo App

## Setup Instructions

```bash
cd MovieStream

# Install dependencies
npx expo install

# Or manually:
npm install

# Start the app
npx expo start

# Run on Android
npx expo start --android

# Run on iOS
npx expo start --ios
```

## Features
- Netflix-style dark UI
- Animated splash screen
- Bollywood & Hollywood categories
- Debounced search
- Infinite scroll pagination
- Movie detail with video player
- Favorites with AsyncStorage
- Recently watched
- Skeleton loading
- Pull to refresh
- Haptic feedback
- Fullscreen video with orientation lock
- m3u8 streaming support

## Tech Stack
- Expo SDK 50 + Expo Router
- TypeScript
- React Native Reanimated
- TanStack Query
- Zustand
- Expo AV
- expo-linear-gradient

## Folder Structure
```
├── app/           # Expo Router screens
├── api/           # API service layer
├── components/    # Reusable components
├── constants/     # Theme, colors, config
├── hooks/         # Custom hooks
├── store/         # Zustand state management
├── types/         # TypeScript interfaces
```
