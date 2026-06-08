# Framer Motion & ShadCN/UI Integration Plan

## Phase 1: Setup & Dependencies
- [x] Framer Motion already installed (^12.40.0)
- [ ] Install ShadCN/UI dependencies:
  - `@radix-ui/react-slot`
  - `@radix-ui/react-dialog`
  - `@radix-ui/react-dropdown-menu`
  - `@radix-ui/react-toast`
  - `@radix-ui/react-tabs`
  - `@radix-ui/react-accordion`
  - `@radix-ui/react-separator`
  - `@radix-ui/react-popover`
  - `class-variance-authority`
  - `clsx`
  - `tailwind-merge`

## Phase 2: Animation System
- [ ] Create `src/lib/animations.ts` - Centralized animation variants
- [ ] Create `src/lib/animation-presets.ts` - Reusable animation presets
- [ ] Create `src/components/motion/MotionWrapper.tsx` - Reusable motion wrapper

## Phase 3: ShadCN Component Installation
- [ ] Update existing Button component
- [ ] Add Dialog component
- [ ] Add Dropdown Menu component
- [ ] Add Tabs component
- [ ] Add Accordion component
- [ ] Add Toast component
- [ ] Add Separator component
- [ ] Add Card component
- [ ] Add Skeleton component
- [ ] Add Popover component

## Phase 4: UI Conversions
- [ ] MainLayout.jsx - Add page transitions
- [ ] Navbar.jsx - Add dropdown animations
- [ ] PlayerBar.jsx - Add motion to player controls
- [ ] Sidebar.jsx - Add slide-in animations
- [ ] SongRow.jsx - Add stagger animations
- [ ] Modal/Dialog conversions

## Phase 5: Page Animations
- [ ] Home.jsx - Add page transition and card stagger
- [ ] Search.jsx - Add fade-in for results
- [ ] Library.jsx - Add animations
- [ ] LikedSongs.jsx - Add animations
- [ ] Login.jsx - Add form animations
- [ ] AddSong.jsx - Add upload animations
- [ ] ManageSongs.jsx - Add animations

## Phase 6: Animation Features
- [ ] Page transitions with layout animations
- [ ] Hover animations on cards
- [ ] Button interaction animations
- [ ] Modal open/close animations
- [ ] Loading states with skeleton loaders
- [ ] Toast notifications system
- [ ] Staggered list animations
- [ ] Smooth route transitions

## Phase 7: Accessibility & Performance
- [ ] Add prefers-reduced-motion support
- [ ] Optimize animation performance
- [ ] Ensure keyboard accessibility
- [ ] Test on all devices
- [ ] Verify no breaking changes

## Current Status
- Framer Motion: ✓ Installed
- React Router: ✓ Configured
- Tailwind CSS: ✓ Configured
- TypeScript: ✓ Configured
- Next: Install ShadCN/UI dependencies
