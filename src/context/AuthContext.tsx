// src/context/AuthContext.tsx
import { createContext, useContext, useState, useEffect, useCallback } from 'react'
import { useLocation } from 'wouter'
import { login as apiLogin, getProfile, logout as apiLogout, type Player } from '@/lib/api'

interface AuthContextType {
  player: Player | null
  loading: boolean
  modal: 'login' | 'signup' | null
  openLogin: () => void
  openSignup: () => void
  closeModal: () => void
  login: (username: string, password: string) => Promise<void>
  logout: () => void
  setPlayer: (p: Player | null) => void
}

const AuthContext = createContext<AuthContextType | null>(null)

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [player, setPlayer] = useState<Player | null>(null)
  const [loading, setLoading] = useState(true)
  const [modal, setModal] = useState<'login' | 'signup' | null>(null)
  const [, navigate] = useLocation()

  useEffect(() => {
    getProfile()
      .then(p => setPlayer(p))
      .finally(() => setLoading(false))
  }, [])

  const login = useCallback(async (username: string, password: string) => {
    const p = await apiLogin(username, password)
    setPlayer(p)
    setModal(null)
    navigate('/profile')
  }, [navigate])

  const logout = useCallback(() => {
    apiLogout()
    setPlayer(null)
  }, [])

  return (
    <AuthContext.Provider value={{
      player,
      loading,
      modal,
      openLogin:  () => setModal('login'),
      openSignup: () => setModal('signup'),
      closeModal: () => setModal(null),
      login,
      logout,
      setPlayer,
    }}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const ctx = useContext(AuthContext)
  if (!ctx) throw new Error('useAuth must be used inside AuthProvider')
  return ctx
}
