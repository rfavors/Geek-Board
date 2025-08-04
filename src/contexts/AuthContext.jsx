import React, { createContext, useContext, useEffect, useState } from 'react'
import { auth } from '../lib/supabase'
import toast from 'react-hot-toast'

const AuthContext = createContext({})

export const useAuth = () => {
  const context = useContext(AuthContext)
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider')
  }
  return context
}

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)
  const [session, setSession] = useState(null)
  const [demoMode, setDemoMode] = useState(false)

  useEffect(() => {
    // Check if demo mode is enabled
    const savedDemoMode = localStorage.getItem('geekboard_demo_mode')
    if (savedDemoMode === 'true') {
      setDemoMode(true)
      setUser({ id: 'demo-user', email: 'demo@geekboard.com' })
      setLoading(false)
      return
    }

    // Get initial session
    auth.getCurrentUser().then(({ data: { user } }) => {
      setUser(user)
      setLoading(false)
    }).catch(() => {
      // If Supabase is not configured, don't show errors
      setLoading(false)
    })

    // Listen for auth changes
    try {
      const { data: { subscription } } = auth.onAuthStateChange((event, session) => {
        setSession(session)
        setUser(session?.user ?? null)
        setLoading(false)
        
        if (event === 'SIGNED_IN') {
          toast.success('Welcome to The Geek-Board!')
        } else if (event === 'SIGNED_OUT') {
          toast.success('Signed out successfully')
        }
      })

      return () => subscription.unsubscribe()
    } catch (error) {
      // If Supabase is not configured, don't show errors
      setLoading(false)
    }
  }, [])

  const signUp = async (email, password) => {
    try {
      setLoading(true)
      const { data, error } = await auth.signUp(email, password)
      
      if (error) {
        toast.error(error.message)
        return { success: false, error }
      }
      
      if (data.user && !data.user.email_confirmed_at) {
        toast.success('Check your email for the confirmation link!')
      }
      
      return { success: true, data }
    } catch (error) {
      toast.error('An unexpected error occurred')
      return { success: false, error }
    } finally {
      setLoading(false)
    }
  }

  const signIn = async (email, password) => {
    try {
      setLoading(true)
      const { data, error } = await auth.signIn(email, password)
      
      if (error) {
        toast.error(error.message)
        return { success: false, error }
      }
      
      return { success: true, data }
    } catch (error) {
      toast.error('An unexpected error occurred')
      return { success: false, error }
    } finally {
      setLoading(false)
    }
  }

  const signOut = async () => {
    try {
      setLoading(true)
      const { error } = await auth.signOut()
      
      if (error) {
        toast.error(error.message)
        return { success: false, error }
      }
      
      return { success: true }
    } catch (error) {
      toast.error('An unexpected error occurred')
      return { success: false, error }
    } finally {
      setLoading(false)
    }
  }

  const resetPassword = async (email) => {
    try {
      setLoading(true)
      const { data, error } = await auth.resetPassword(email)
      
      if (error) {
        toast.error(error.message)
        return { success: false, error }
      }
      
      toast.success('Password reset email sent!')
      return { success: true, data }
    } catch (error) {
      toast.error('An unexpected error occurred')
      return { success: false, error }
    } finally {
      setLoading(false)
    }
  }

  const enterDemoMode = () => {
    localStorage.setItem('geekboard_demo_mode', 'true')
    setDemoMode(true)
    setUser({ id: 'demo-user', email: 'demo@geekboard.com' })
    toast.success('Welcome to The Geek-Board Demo!')
  }

  const exitDemoMode = () => {
    localStorage.removeItem('geekboard_demo_mode')
    setDemoMode(false)
    setUser(null)
    toast.success('Demo mode disabled')
  }

  const value = {
    user,
    session,
    loading,
    demoMode,
    signUp,
    signIn,
    signOut,
    resetPassword,
    enterDemoMode,
    exitDemoMode
  }

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  )
}