# DrivePlay v1 Implementation Plan

## Project Overview
Building a mobile-first web application for 2-6 people to play games during road trips using a single phone passed around.

## Core Features
1. **Talk Dice** - Random conversation prompts
2. **Ito-like Game** - Secret numbers (1-100) with theme-based word matching and cooperative ordering

## Implementation Plan

### Phase 1: Project Setup & Architecture
- [ ] Create Next.js 14 app with App Router
- [ ] Set up Tailwind CSS and basic mobile-first styling
- [ ] Configure PWA settings for offline support
- [ ] Set up state management (Zustand or React Context)
- [ ] Create basic routing structure
- [ ] Set up localStorage persistence

### Phase 2: Player Setup (US-01)
- [ ] Create player count selection (2-6 players)
- [ ] Optional nickname input for each player
- [ ] Persist player data in localStorage

### Phase 3: Talk Dice Game (US-02)
- [ ] Create talk_topics.json with 200+ prompts (Japanese + English)
- [ ] Build Talk Dice UI with large tap-friendly buttons
- [ ] Implement random topic selection
- [ ] Add "Next" button for progression
- [ ] Add custom topic input (stretch goal)

### Phase 4: Ito Game Setup (US-03)
- [ ] Theme input interface
- [ ] Secret number assignment (1-100) for each player
- [ ] Individual player number reveal screen
- [ ] Pass-device flow with privacy screens

### Phase 5: Ito Game Play (US-04)
- [ ] Word/phrase input for each player (60-second timer)
- [ ] Duplicate word validation
- [ ] Card-based drag & drop ordering interface
- [ ] Alternative button-based ordering for accessibility

### Phase 6: Ito Game Results (US-05)
- [ ] Reveal numbers and calculate accuracy
- [ ] Score display with percentage
- [ ] Confetti animation for 80%+ success
- [ ] Game restart functionality

### Phase 7: PWA & Offline Support
- [ ] Configure service worker
- [ ] Add manifest.json
- [ ] Implement offline caching strategy
- [ ] Add install prompt

### Phase 8: Testing & Quality
- [ ] Unit tests with Vitest (70%+ coverage)
- [ ] E2E tests with Playwright
- [ ] Mobile responsiveness testing
- [ ] Dark mode support
- [ ] Accessibility improvements

### Phase 9: Deployment & Documentation
- [ ] Deploy to Vercel
- [ ] Create comprehensive README
- [ ] Set up CI/CD pipeline
- [ ] Create architecture diagram
- [ ] Set up GitHub Projects board

### Phase 10: Stretch Goals
- [ ] Voice commands for "next topic"
- [ ] Statistics page (topic count, Ito accuracy)
- [ ] Multi-game score aggregation

## Technical Architecture

### Frontend Stack
- Next.js 14 (App Router)
- React 18
- Tailwind CSS
- Zustand for state management
- PWA capabilities

### Data Storage
- localStorage for game state persistence
- JSON files for static content (topics)

### Testing
- Vitest for unit tests
- Playwright for E2E tests

### Deployment
- Vercel for hosting
- GitHub Actions for CI/CD

## Success Criteria
- Mobile-first responsive design
- < 2s initial load time on 4G
- Offline functionality
- Smooth single-device passing experience
- 70%+ test coverage
- Accessible UI with large touch targets
