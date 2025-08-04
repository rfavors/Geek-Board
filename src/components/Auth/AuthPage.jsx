import React, { useState } from 'react'
import { useAuth } from '../../contexts/AuthContext'
import Login from './Login'
import SignUp from './SignUp'
import { ArrowLeft, Play } from 'lucide-react'
import toast from 'react-hot-toast'

const AuthPage = () => {
  const [mode, setMode] = useState('login') // 'login', 'signup', 'forgot'
  const [email, setEmail] = useState('')
  const { resetPassword, loading, enterDemoMode } = useAuth()

  const handleForgotPassword = () => {
    setMode('forgot')
  }

  const handleResetPassword = async (e) => {
    e.preventDefault()
    if (!email) {
      toast.error('Please enter your email address')
      return
    }
    
    const result = await resetPassword(email)
    if (result.success) {
      setMode('login')
      setEmail('')
    }
  }

  const renderForgotPassword = () => (
    <div className="w-full max-w-md mx-auto">
      <div className="bg-dark-800 rounded-lg shadow-xl p-8">
        <div className="flex items-center mb-6">
          <button
            onClick={() => setMode('login')}
            className="text-dark-400 hover:text-white transition-colors duration-200 mr-3"
          >
            <ArrowLeft className="w-5 h-5" />
          </button>
          <h1 className="text-2xl font-bold text-white">Reset Password</h1>
        </div>

        <p className="text-dark-400 mb-6">
          Enter your email address and we'll send you a link to reset your password.
        </p>

        <form onSubmit={handleResetPassword} className="space-y-6">
          <div>
            <label htmlFor="reset-email" className="block text-sm font-medium text-dark-300 mb-2">
              Email Address
            </label>
            <input
              id="reset-email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-4 py-3 bg-dark-700 border border-dark-600 rounded-lg text-white placeholder-dark-400 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
              placeholder="Enter your email"
              required
            />
          </div>

          <button
            type="submit"
            disabled={loading || !email}
            className="w-full bg-primary-600 hover:bg-primary-700 disabled:bg-dark-600 disabled:cursor-not-allowed text-white font-medium py-3 px-4 rounded-lg transition-colors duration-200"
          >
            {loading ? (
              <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin mx-auto" />
            ) : (
              'Send Reset Link'
            )}
          </button>
        </form>
      </div>
    </div>
  )

  return (
    <div className="min-h-screen bg-dark-900 flex items-center justify-center p-4">
      <div className="w-full max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-8 items-center">
        {/* Left side - Branding */}
        <div className="text-center lg:text-left">
          <h1 className="text-5xl lg:text-6xl font-bold text-white mb-4">
            The <span className="text-primary-500">Geek-Board</span>
          </h1>
          <p className="text-xl text-dark-300 mb-8">
            A lightweight, modern online whiteboard for creative minds.
          </p>
          <div className="space-y-4 text-dark-400">
            <div className="flex items-center justify-center lg:justify-start gap-3">
              <div className="w-2 h-2 bg-primary-500 rounded-full"></div>
              <span>Freehand drawing with multiple colors</span>
            </div>
            <div className="flex items-center justify-center lg:justify-start gap-3">
              <div className="w-2 h-2 bg-primary-500 rounded-full"></div>
              <span>Export as PNG, JPG, and PDF</span>
            </div>
            <div className="flex items-center justify-center lg:justify-start gap-3">
              <div className="w-2 h-2 bg-primary-500 rounded-full"></div>
              <span>Auto-save to local storage</span>
            </div>
            <div className="flex items-center justify-center lg:justify-start gap-3">
              <div className="w-2 h-2 bg-primary-500 rounded-full"></div>
              <span>PWA installable on mobile</span>
            </div>
          </div>
        </div>

        {/* Right side - Auth forms */}
        <div className="flex flex-col items-center space-y-6">
          {/* Demo Mode Button */}
          <div className="w-full max-w-md">
            <button
              onClick={enterDemoMode}
              className="w-full bg-primary-600 hover:bg-primary-700 text-white font-medium py-4 px-6 rounded-lg transition-colors duration-200 flex items-center justify-center gap-3 shadow-lg"
            >
              <Play className="w-5 h-5" />
              Try Demo Mode (No Account Required)
            </button>
            <p className="text-dark-400 text-sm text-center mt-2">
              Start drawing immediately without creating an account
            </p>
          </div>

          {/* Divider */}
          <div className="w-full max-w-md flex items-center">
            <div className="flex-1 border-t border-dark-600"></div>
            <span className="px-4 text-dark-400 text-sm">or</span>
            <div className="flex-1 border-t border-dark-600"></div>
          </div>

          {/* Auth Forms */}
          <div className="w-full flex justify-center">
            {mode === 'login' && (
              <Login
                onToggleMode={() => setMode('signup')}
                onForgotPassword={handleForgotPassword}
              />
            )}
            {mode === 'signup' && (
              <SignUp onToggleMode={() => setMode('login')} />
            )}
            {mode === 'forgot' && renderForgotPassword()}
          </div>
        </div>
      </div>

      {/* Footer */}
      <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2">
        <p className="text-dark-500 text-sm text-center">
          Powered by{' '}
          <a
            href="https://thegeektrepreneur.com"
            target="_blank"
            rel="noopener noreferrer"
            className="text-primary-400 hover:text-primary-300 transition-colors duration-200"
          >
            The Geektrepreneur
          </a>
        </p>
      </div>
    </div>
  )
}

export default AuthPage