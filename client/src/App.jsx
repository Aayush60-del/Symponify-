import { useEffect, useState } from 'react'
import { Navigate, Route, Routes } from 'react-router-dom'
import MainLayout from './components/MainLayout'
import AddSong from './pages/AddSong'
import Home from './pages/Home'
import Library from './pages/Library'
import LikedSongs from './pages/LikedSongs'
import ManageSongs from './pages/ManageSongs'
import Login from './pages/Login'
import Search from './pages/Search'

function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(Boolean(localStorage.getItem('token')))
  const [isGuest, setIsGuest] = useState(localStorage.getItem('guestAccess') === 'true')
  const [isAdmin, setIsAdmin] = useState(() => {
    try {
      return Boolean(JSON.parse(localStorage.getItem('user') || 'null')?.isAdmin)
    } catch {
      return false
    }
  })

  useEffect(() => {
    const syncAuth = () => {
      setIsLoggedIn(Boolean(localStorage.getItem('token')))
      setIsGuest(localStorage.getItem('guestAccess') === 'true')
      try {
        setIsAdmin(Boolean(JSON.parse(localStorage.getItem('user') || 'null')?.isAdmin))
      } catch {
        setIsAdmin(false)
      }
    }

    window.addEventListener('storage', syncAuth)
    window.addEventListener('authchange', syncAuth)

    return () => {
      window.removeEventListener('storage', syncAuth)
      window.removeEventListener('authchange', syncAuth)
    }
  }, [])

  const canAccessApp = isLoggedIn || isGuest

  return (
    <Routes>
      <Route path="/login" element={canAccessApp ? <Navigate to="/" replace /> : <Login />} />
      <Route path="/" element={canAccessApp ? <MainLayout /> : <Navigate to="/login" replace />}>
        <Route index element={<Home />} />
        <Route path="add-song" element={isAdmin ? <AddSong /> : <Navigate to="/" replace />} />
        <Route path="manage-songs" element={isAdmin ? <ManageSongs /> : <Navigate to="/" replace />} />
        <Route path="liked" element={<LikedSongs />} />
        <Route path="search" element={<Search />} />
        <Route path="library" element={<Library />} />
      </Route>
      <Route path="*" element={<Navigate to={canAccessApp ? '/' : '/login'} replace />} />
    </Routes>
  )
}

export default App
