# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

### Development
- `npm start` - Start development server on http://localhost:3000
- `npm test` - Run tests in interactive watch mode
- `npm run build` - Create production build

### Environment Variables Required
The application requires Firebase and Supabase environment variables:
- `REACT_APP_FIREBASE_API_KEY`
- `REACT_APP_FIREBASE_AUTH_DOMAIN`
- `REACT_APP_FIREBASE_PROJECT_ID`
- `REACT_APP_FIREBASE_STORAGE_BUCKET`
- `REACT_APP_FIREBASE_MESSAGE_SENDER_ID`
- `REACT_APP_FIREBASE_SENDER_ID`
- `REACT_APP_SUPABASE_URL`
- `REACT_APP_SUPABASE_ANON_KEY`

## Architecture

### Tech Stack
- React 18 with TypeScript
- Mantine v7 UI components
- Firebase Authentication (Google OAuth)
- Supabase as backend database
- CSV data loading with PapaParse

### Core Components Architecture

#### Authentication System
- `AuthContext.tsx` - Main authentication context provider
- `useUserRegistration.tsx` - Handles Firebase to Supabase user sync
- Uses Firebase for Google OAuth, syncs with Supabase users table

#### Data Management
- `UsePokemonData.tsx` - Custom hook for Pokemon data and user registrations
- Fetches Pokemon data from Supabase `pokemon_data` table
- Manages user's registered Pokemon in `pokemon_user` table
- Implements registration/unregistration toggle functionality

#### Main Features
- `FeaturesCards.tsx` - Main Pokemon gallery with registration system
- `PokemonGallery.tsx` - Alternative Pokemon display component
- `GiftCard.tsx` - Individual Pokemon card component
- `App.tsx` - CSV data loader for external Pokemon data

### Database Schema (Supabase)
- `users` table: Maps Firebase UIDs to Supabase user IDs
- `pokemon_data` table: Contains Pokemon information (number, name, form_name, img)
- `pokemon_user` table: Junction table for user's registered Pokemon

### Data Flow
1. User authenticates with Google via Firebase
2. Firebase UID is registered/retrieved in Supabase users table
3. Pokemon data is fetched from Supabase
4. User's registered Pokemon are loaded and displayed
5. Registration toggles update the pokemon_user junction table

### File Structure Notes
- Mixed JS/TS files (firebase.js, UserStore.js alongside .tsx files)
- CSS modules used for component styling
- Context providers centralize authentication and data state
- Custom hooks abstract data fetching and state management