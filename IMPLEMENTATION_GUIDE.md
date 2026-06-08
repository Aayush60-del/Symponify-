# Framer Motion + ShadCN/UI Implementation Guide

## Quick Reference for Remaining Components

### Pattern 1: Animated Page with Skeleton Loading

**Use for:** Home, Search, Library, LikedSongs pages

```javascript
import { useEffect, useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { pageVariants } from '../lib/animations'
import { useReducedMotion } from '../lib/animation-utils'
import { SkeletonWrapper, SongRowSkeleton } from '../components/Skeleton'
import { useToast } from '../context/ToastContext'

export default function HomePage() {
  const [songs, setSongs] = useState([])
  const [loading, setLoading] = useState(true)
  const prefersReducedMotion = useReducedMotion()
  const { error } = useToast()

  useEffect(() => {
    const fetchSongs = async () => {
      try {
        setLoading(true)
        const response = await fetch('/api/songs')
        const data = await response.json()
        setSongs(data)
      } catch (err) {
        error('Failed to load songs')
      } finally {
        setLoading(false)
      }
    }
    fetchSongs()
  }, [error])

  const pageVariantsWithAccessibility = prefersReducedMotion
    ? { initial: {}, animate: {}, exit: {} }
    : pageVariants

  return (
    <motion.div
      variants={pageVariantsWithAccessibility}
      initial="initial"
      animate="animate"
      exit="exit"
    >
      <SkeletonWrapper
        isLoading={loading}
        skeleton={<SongRowSkeleton />}
      >
        {songs.map((song) => (
          <SongRow key={song._id} song={song} />
        ))}
      </SkeletonWrapper>
    </motion.div>
  )
}
```

### Pattern 2: Form with Toast Notifications

**Use for:** Login, AddSong pages

```javascript
import { useState } from 'react'
import { motion } from 'framer-motion'
import { Button } from '../components/ui/button'
import { Input } from '../components/ui/input'
import { useToast } from '../context/ToastContext'

export default function LoginPage() {
  const [formData, setFormData] = useState({ email: '', password: '' })
  const [loading, setLoading] = useState(false)
  const { success, error } = useToast()

  const handleSubmit = async (e) => {
    e.preventDefault()
    try {
      setLoading(true)
      const response = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      })
      if (!response.ok) throw new Error('Login failed')
      success('Login successful!')
      // redirect or update auth state
    } catch (err) {
      error(err.message)
    } finally {
      setLoading(false)
    }
  }

  return (
    <motion.form
      onSubmit={handleSubmit}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <Input
        type="email"
        placeholder="Email"
        value={formData.email}
        onChange={(e) => setFormData({ ...formData, email: e.target.value })}
      />
      <Input
        type="password"
        placeholder="Password"
        value={formData.password}
        onChange={(e) => setFormData({ ...formData, password: e.target.value })}
      />
      <Button type="submit" disabled={loading}>
        {loading ? 'Logging in...' : 'Login'}
      </Button>
    </motion.form>
  )
}
```

### Pattern 3: Animated List with Stagger

**Use for:** Manage Songs, Library pages

```javascript
import { motion } from 'framer-motion'
import { AnimatedList, AnimatedListItem } from '../components/motion/MotionWrappers'

export default function ManageSongsPage({ songs }) {
  return (
    <AnimatedList>
      {songs.map((song) => (
        <AnimatedListItem key={song._id}>
          <SongRow song={song} onEdit={handleEdit} onDelete={handleDelete} />
        </AnimatedListItem>
      ))}
    </AnimatedList>
  )
}
```

### Pattern 4: Modal/Dialog with Animation

**Use for:** Edit/Delete confirmations

```javascript
import { motion, AnimatePresence } from 'framer-motion'
import { modalVariants, backdropVariants } from '../lib/animations'

export default function ConfirmDialog({ isOpen, onConfirm, onCancel, title }) {
  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div
            variants={backdropVariants}
            initial="initial"
            animate="animate"
            exit="exit"
            onClick={onCancel}
            style={{
              position: 'fixed',
              inset: 0,
              background: 'rgba(0,0,0,0.5)',
              zIndex: 40,
            }}
          />
          <motion.div
            variants={modalVariants}
            initial="initial"
            animate="animate"
            exit="exit"
            style={{
              position: 'fixed',
              top: '50%',
              left: '50%',
              transform: 'translate(-50%, -50%)',
              background: 'white',
              padding: '24px',
              borderRadius: '12px',
              zIndex: 50,
            }}
          >
            <h2>{title}</h2>
            <div style={{ marginTop: '24px', display: 'flex', gap: '12px' }}>
              <Button variant="outline" onClick={onCancel}>
                Cancel
              </Button>
              <Button variant="destructive" onClick={onConfirm}>
                Confirm
              </Button>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  )
}
```

### Pattern 5: Hover Effects on Cards

**Use for:** Album cards, Featured cards

```javascript
import { motion } from 'framer-motion'
import { cardHoverVariants } from '../lib/animations'

export default function AlbumCard({ album }) {
  return (
    <motion.div
      variants={cardHoverVariants}
      whileHover="hover"
      whileTap="tap"
      onClick={() => handleAlbumClick(album)}
      style={{
        cursor: 'pointer',
        borderRadius: '12px',
        overflow: 'hidden',
      }}
    >
      <img src={album.coverUrl} alt={album.title} style={{ width: '100%' }} />
      <div>
        <h3>{album.title}</h3>
        <p>{album.artist}</p>
      </div>
    </motion.div>
  )
}
```

### Pattern 6: Loading Button with Spinner

**Use for:** Submit buttons during upload/save

```javascript
import { motion } from 'framer-motion'
import { Button } from '../components/ui/button'
import { rotateVariants } from '../lib/animations'

export default function SubmitButton({ loading, children }) {
  return (
    <Button disabled={loading}>
      {loading ? (
        <motion.div
          variants={rotateVariants}
          animate="animate"
          style={{ display: 'inline-block', marginRight: '8px' }}
        >
          ⏳
        </motion.div>
      ) : null}
      {children}
    </Button>
  )
}
```

### Pattern 7: Fade In Text/Content

**Use for:** Empty states, success messages

```javascript
import { motion } from 'framer-motion'
import { fadeInVariants } from '../lib/animations'

export default function EmptyState() {
  return (
    <motion.div
      variants={fadeInVariants}
      initial="initial"
      animate="animate"
      textAlign="center"
    >
      <p style={{ fontSize: '18px', color: 'var(--text-3)' }}>
        No songs yet. Add one to get started!
      </p>
    </motion.div>
  )
}
```

## Common Imports Checklist

For **Pages**:
```javascript
import { motion, AnimatePresence } from 'framer-motion'
import { pageVariants, containerVariants, itemVariants } from '../lib/animations'
import { useReducedMotion } from '../lib/animation-utils'
import { useToast } from '../context/ToastContext'
import { SkeletonWrapper, SongRowSkeleton } from '../components/Skeleton'
```

For **Components**:
```javascript
import { motion } from 'framer-motion'
import { 
  hoverScaleVariants, 
  listItemVariants, 
  cardHoverVariants,
  rotateVariants 
} from '../lib/animations'
import { useReducedMotion } from '../lib/animation-utils'
import { Button, Input, Card } from '../components/ui'
```

## Implementation Priority by Page

### ⭐ High Priority (Most Used)
1. **Home.jsx** - Featured songs/albums, heavy user traffic
2. **Search.jsx** - User searches frequently, important for UX
3. **Library.jsx** - User collection display

### ⭐⭐ Medium Priority
4. **LikedSongs.jsx** - User favorites display
5. **ManageSongs.jsx** - Admin panel
6. **PlayerBar.jsx** - Always visible component

### ⭐⭐⭐ Lower Priority
7. **Login.jsx** - One-time per session
8. **AddSong.jsx** - Admin upload

## Tips & Best Practices

1. **Always check accessibility first**
   ```javascript
   const prefersReducedMotion = useReducedMotion()
   const variants = prefersReducedMotion ? { initial: {}, animate: {} } : myVariants
   ```

2. **Use `whileHover` and `whileTap` for interactive feedback**
   ```javascript
   <motion.button whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }} />
   ```

3. **Wrap lists with `AnimatePresence` when items change**
   ```javascript
   <AnimatePresence>
     {items.map(item => <motion.div key={item.id} ... />)}
   </AnimatePresence>
   ```

4. **Add unique `key` props for proper animation tracking**
   - Use stable IDs from backend, not array indices

5. **Test animations on slower devices**
   - Use DevTools throttling
   - Check performance on actual mobile devices

6. **Use consistent timing across app**
   - Fast: 0.2-0.3s (hover, tap)
   - Normal: 0.3-0.5s (page transitions)
   - Slow: 0.5-1s (modal opening)

## Testing Animations

### Test prefers-reduced-motion
```bash
# DevTools → More tools → Rendering → Emulate CSS media feature prefers-reduced-motion
# Check that animations are disabled/instant
```

### Performance Testing
```bash
# Chrome DevTools → Performance tab
# Record animations, check for 60fps smooth performance
```

### Mobile Testing
- Use Chrome DevTools device emulation
- Test on real devices (iOS Safari, Android Chrome)
- Verify touch interactions (tap, swipe)

---

**Last Updated:** Integration Phase 1-2 Complete
**Next Phase:** Apply patterns to remaining pages (Home, Search, Library, etc.)
