import React, { useState } from 'react'
import { useAuth } from '../../contexts/AuthContext'
import { Mail, Lock, Eye, EyeOff, LogIn } from 'lucide-react'

const Login = ({ onToggleMode, onForgotPassword }) => {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const { signIn, loading } = useAuth()

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!email || !password) return
    
    await signIn(email, password)
  }

  return (
    <div className="w-full max-w-md mx-auto">
      <div className="bg-dark-800 rounded-lg shadow-xl p-8">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-white mb-2">Welcome Back</h1>
          <p className="text-dark-400">Sign in to your Geek-Board account</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label htmlFor="email" className="block text-sm font-medium text-dark-300 mb-2">
              Email Address
            </label>
            <div className="relative">
              <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-dark-400 w-5 h-5" />
              <input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full pl-10 pr-4 py-3 bg-dark-700 border border-dark-600 rounded-lg text-white placeholder-dark-400 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                placeholder="Enter your email"
                required
              />
            </div>
          </div>

          <div>
            <label htmlFor="password" className="block text-sm font-medium text-dark-300 mb-2">
              Password
            </label>
            <div className="relative">
              <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-dark-400 w-5 h-5" />
              <input
                id="password"
                type={showPassword ? 'text' : 'password'}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full pl-10 pr-12 py-3 bg-dark-700 border border-dark-600 rounded-lg text-white placeholder-dark-400 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                placeholder="Enter your password"
                required
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 transform -translate-y-1/2 text-dark-400 hover:text-dark-300"
              >
                {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
              </button>
            </div>
          </div>

          <button
            type="submit"
            disabled={loading || !email || !password}
            className="w-full bg-primary-600 hover:bg-primary-700 disabled:bg-dark-600 disabled:cursor-not-allowed text-white font-medium py-3 px-4 rounded-lg transition-colors duration-200 flex items-center justify-center gap-2"
          >
            {loading ? (
              <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
            ) : (
              <>
                <LogIn className="w-5 h-5" />
                Sign In
              </>
            )}
          </button>
        </form>

        <div className="mt-6 text-center">
          <button
            onClick={onForgotPassword}
            className="text-primary-400 hover:text-primary-300 text-sm transition-colors duration-200"
          >
            Forgot your password?
          </button>
        </div>

        <div className="mt-6 pt-6 border-t border-dark-600 text-center">
          <p className="text-dark-400 text-sm">
            Don't have an account?{' '}
            <button
              onClick={onToggleMode}
              className="text-primary-400 hover:text-primary-300 font-medium transition-colors duration-200"
            >
              Sign up
            </button>
          </p>
        </div>
      </div>
    </div>
  )
}

export default Login