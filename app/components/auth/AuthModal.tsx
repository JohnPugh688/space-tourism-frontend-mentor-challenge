import { useState } from 'react'
import { supabase } from '~/utils/supabase'
import { useNavigate } from 'react-router';

interface AuthModalProps {
  isOpen: boolean
  onClose: () => void
}

export default function AuthModal({ isOpen, onClose }: AuthModalProps) {
  const navigate = useNavigate()
  const [isLogin, setIsLogin] = useState(true)
  const [isForgotPassword, setIsForgotPassword] = useState(false)
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [successMessage, setSuccessMessage] = useState<string | null>(null)
  const [showConfirmationInstructions, setShowConfirmationInstructions] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError(null)
    setSuccessMessage(null)
    setShowConfirmationInstructions(false)

    try {
      if (isForgotPassword) {
        const { error } = await supabase.auth.resetPasswordForEmail(email, {
          redirectTo: `${window.location.origin}/reset-password`,
        })
        if (error) throw error
        setSuccessMessage('Password reset instructions have been sent to your email')
      } else if (isLogin) {
        console.log('Attempting login with:', { email })
        const { data, error } = await supabase.auth.signInWithPassword({
          email,
          password,
        })
        if (error) throw error

        console.log('Login successful:', {
          hasSession: !!data.session,
          userId: data.session?.user?.id,
        })

        // If login successful and we have a session, redirect to mission control
        if (data.session) {
          onClose()
          navigate('/mission-control')
        } else {
          throw new Error('No session after login')
        }
      } else {
        const { data, error } = await supabase.auth.signUp({
          email,
          password,
          options: {
            emailRedirectTo: `${window.location.origin}/auth/callback`,
          },
        })
        if (error) throw error

        // Check if email confirmation is required
        if (data.session) {
          // If we have a session, user can proceed immediately
          onClose()
          navigate('/mission-control')
        } else {
          // Otherwise show confirmation instructions
          setShowConfirmationInstructions(true)
        }
      }
    } catch (err) {
      console.error('Auth error:', err)
      setError(err instanceof Error ? err.message : 'An error occurred')
    } finally {
      setLoading(false)
    }
  }

  const resetForm = () => {
    setError(null)
    setSuccessMessage(null)
    setShowConfirmationInstructions(false)
    setEmail('')
    setPassword('')
  }

  if (!isOpen) return null

  // If showing confirmation instructions, display a different view
  if (showConfirmationInstructions) {
    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center">
        <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" onClick={onClose} />
        <div className="relative w-full max-w-md mx-4 backdrop-blur-2xl bg-white/[0.04] rounded-lg overflow-hidden">
          <div className="p-6">
            <h2 className="text-2xl text-white font-bellefair mb-6 text-center">Check Your Email</h2>
            <div className="text-center mb-6">
              <div className="text-[#D0D6F9] mb-4">
                We've sent a confirmation link to:
                <div className="text-white font-bold mt-2">{email}</div>
              </div>
              <p className="text-[#D0D6F9] text-sm">
                Please check your email and click the confirmation link to activate your account. The email might take a
                few minutes to arrive.
              </p>
            </div>
            <button
              onClick={onClose}
              className="w-full bg-white/10 hover:bg-white/20 text-white font-barlow-condensed
                     tracking-[2.7px] py-3 rounded transition-colors"
            >
              CLOSE
            </button>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      {/* Backdrop */}
      <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" onClick={onClose} />

      {/* Modal */}
      <div className="relative w-full max-w-md mx-4 backdrop-blur-2xl bg-white/[0.04] rounded-lg overflow-hidden">
        <div className="p-6">
          {/* Title */}
          <h2 className="text-2xl text-white font-bellefair mb-6 text-center">
            {isForgotPassword ? 'Reset Password' : isLogin ? 'Welcome Back' : 'Join the Mission'}
          </h2>

          {/* Success Message */}
          {successMessage && (
            <div className="mb-4 p-3 bg-green-500/10 border border-green-500/20 rounded text-green-400 text-sm">
              {successMessage}
            </div>
          )}

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-[#D0D6F9] font-barlow-condensed tracking-[2.7px] mb-2">EMAIL</label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full bg-white/5 border border-white/20 rounded px-4 py-2 text-white font-barlow
                         focus:outline-none focus:border-white transition-colors"
                required
              />
            </div>

            {!isForgotPassword && (
              <div>
                <label className="block text-[#D0D6F9] font-barlow-condensed tracking-[2.7px] mb-2">PASSWORD</label>
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full bg-white/5 border border-white/20 rounded px-4 py-2 text-white font-barlow
                           focus:outline-none focus:border-white transition-colors"
                  required
                  autoComplete="current-password"
                />
              </div>
            )}

            {error && <div className="text-red-400 text-sm font-barlow">{error}</div>}

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-white/10 hover:bg-white/20 text-white font-barlow-condensed
                     tracking-[2.7px] py-3 rounded transition-colors"
            >
              {loading ? 'PROCESSING...' : isForgotPassword ? 'SEND RESET INSTRUCTIONS' : isLogin ? 'LOGIN' : 'SIGN UP'}
            </button>
          </form>

          {/* Toggle and Forgot Password */}
          <div className="mt-4 flex flex-col items-center gap-2">
            {isLogin && !isForgotPassword && (
              <button
                onClick={() => {
                  setIsForgotPassword(true)
                  resetForm()
                }}
                className="text-[#D0D6F9] hover:text-white font-barlow text-sm transition-colors"
              >
                Forgot your password?
              </button>
            )}
            <button
              onClick={() => {
                if (isForgotPassword) {
                  setIsForgotPassword(false)
                } else {
                  setIsLogin(!isLogin)
                }
                resetForm()
              }}
              className="text-[#D0D6F9] hover:text-white font-barlow text-sm transition-colors"
            >
              {isForgotPassword
                ? '← Back to login'
                : isLogin
                ? 'Need an account? Sign up'
                : 'Already have an account? Log in'}
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
