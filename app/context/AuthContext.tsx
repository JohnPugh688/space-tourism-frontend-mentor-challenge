import { createContext, useContext, useEffect, useState, useCallback, useRef } from 'react'
import type { User, Session } from '@supabase/supabase-js'
import { supabase } from '~/utils/supabase'
import { useFetcher } from 'react-router';

interface AuthContextType {
  user: User | null
  session: Session | null
  loading: boolean
  signOut: () => Promise<void>
}

const AuthContext = createContext<AuthContextType>({
  user: null,
  session: null,
  loading: true,
  signOut: async () => {},
})

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [session, setSession] = useState<Session | null>(null)
  const [loading, setLoading] = useState(true)
  const fetcher = useFetcher()
  const syncTimeoutRef = useRef<ReturnType<typeof setTimeout> | undefined>(undefined)
  const lastSyncRef = useRef<string>('')

  const syncSession = useCallback(
    async (event: string, currentSession: Session | null) => {
      // Prevent duplicate syncs
      const syncKey = `${event}-${currentSession?.access_token}`
      if (syncKey === lastSyncRef.current) {
        return
      }
      lastSyncRef.current = syncKey

      // Clear any pending sync
      if (syncTimeoutRef.current) {
        clearTimeout(syncTimeoutRef.current)
      }

      // Debounce sync to prevent rapid consecutive calls
      syncTimeoutRef.current = setTimeout(() => {
        try {
          fetcher.submit(
            {
              event,
              session: currentSession ? JSON.stringify(currentSession) : null,
            },
            {
              method: 'post',
              action: '/auth/sync',
            },
          )
        } catch (error) {
          console.error('Error syncing session:', error)
        }
      }, 100)
    },
    [fetcher],
  )

  useEffect(() => {
    let mounted = true

    const initializeAuth = async () => {
      try {
        const {
          data: { session: initialSession },
          error: sessionError,
        } = await supabase.auth.getSession()

        if (sessionError) {
          console.error('Error getting session:', sessionError)
          return
        }

        if (mounted) {
          if (initialSession) {
            setSession(initialSession)
            setUser(initialSession.user)
            await syncSession('INITIAL_SESSION', initialSession)
          }
          setLoading(false)
        }
      } catch (error) {
        console.error('Error initializing auth:', error)
        if (mounted) {
          setUser(null)
          setSession(null)
          setLoading(false)
        }
      }
    }

    initializeAuth()

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange(async (event, currentSession) => {
      if (!mounted) return

      console.log('AuthContext - Auth State Change:', {
        event,
        hasSession: !!currentSession,
        userId: currentSession?.user?.id,
        email: currentSession?.user?.email,
        accessToken: currentSession?.access_token ? '[EXISTS]' : '[MISSING]',
        refreshToken: currentSession?.refresh_token ? '[EXISTS]' : '[MISSING]',
      })

      if (currentSession) {
        setSession(currentSession)
        setUser(currentSession.user)
        await syncSession(event, currentSession)
      } else {
        setSession(null)
        setUser(null)
        if (event === 'SIGNED_OUT') {
          await syncSession('SIGNED_OUT', null)
        }
      }
      setLoading(false)
    })

    return () => {
      mounted = false
      subscription.unsubscribe()
      if (syncTimeoutRef.current) {
        clearTimeout(syncTimeoutRef.current)
      }
    }
  }, [syncSession])

  const signOut = async () => {
    try {
      const { error } = await supabase.auth.signOut()
      if (error) {
        console.error('Error signing out:', error)
      } else {
        setUser(null)
        setSession(null)
        await syncSession('SIGNED_OUT', null)
      }
    } catch (error) {
      console.error('Error signing out:', error)
    }
  }

  return <AuthContext.Provider value={{ user, session, loading, signOut }}>{children}</AuthContext.Provider>
}

export function useAuth() {
  return useContext(AuthContext)
}
