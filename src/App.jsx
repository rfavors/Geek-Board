import React from 'react'
import { Toaster } from 'react-hot-toast'
import { AuthProvider, useAuth } from './contexts/AuthContext'
import AuthPage from './components/Auth/AuthPage'
import Whiteboard from './components/Whiteboard/Whiteboard'
import './index.css'

const AppContent = () => {
  const { user, loading } = useAuth()

  if (loading) {
    return (
      <div className="min-h-screen bg-dark-900 flex items-center justify-center">
        <div className="text-center">
          <div className="w-12 h-12 border-4 border-primary-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-white text-lg">Loading The Geek-Board...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-dark-900">
      {user ? <Whiteboard /> : <AuthPage />}
    </div>
  )
}

const App = () => {
  return (
    <AuthProvider>
      <AppContent />
      <Toaster
        position="top-right"
        toastOptions={{
          duration: 4000,
          style: {
            background: '#374151',
            color: '#ffffff',
            border: '1px solid #4b5563'
          },
          success: {
            iconTheme: {
              primary: '#10b981',
              secondary: '#ffffff'
            }
          },
          error: {
            iconTheme: {
              primary: '#ef4444',
              secondary: '#ffffff'
            }
          }
        }}
      />
    </AuthProvider>
  )
}

export default App