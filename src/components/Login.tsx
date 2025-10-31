import React, { useState } from 'react'
import { Button } from './ui/button'
import { Input } from './ui/input'
import { Label } from './ui/label'
import { BookOpen, Lock, Mail } from 'lucide-react'
import { supabase } from '../lib/supabase'

interface LoginProps {
  onLoginSuccess: () => void
}

type Mode = 'login' | 'register' | 'forgot'

export function Login({ onLoginSuccess }: LoginProps) {
  const [mode, setMode] = useState<Mode>('login')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [fullName, setFullName] = useState('') // NEW
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [info, setInfo] = useState('')

  const validate = () => {
    if (!email || !email.includes('@')) return 'Ingresa un email válido'
    if ((mode === 'login' || mode === 'register') && password.length < 6)
      return 'La contraseña debe tener al menos 6 caracteres'
    if (mode === 'register' && !fullName.trim()) // NEW
      return 'Ingresa tu nombre'
    return ''
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    setInfo('')
    const v = validate()
    if (v) { setError(v); return }

    setLoading(true)
    try {
      if (mode === 'login') {
        const { error } = await supabase.auth.signInWithPassword({ email, password })
        if (error) throw error
        onLoginSuccess()
      }

      if (mode === 'register') {
        const { error } = await supabase.auth.signUp({
          email,
          password,
          options: {
            data: { full_name: fullName }, // NEW -> esto alimenta el trigger y guarda el perfil
            emailRedirectTo: `${window.location.origin}/auth/callback`,
          },
        })
        if (error) throw error
        setInfo('Registro enviado. Revisa tu correo para confirmar la cuenta.')
        setMode('login')
        setPassword('')
      }

      if (mode === 'forgot') {
        const { error } = await supabase.auth.resetPasswordForEmail(email, {
          redirectTo: `${window.location.origin}/reset-password`,
        })
        if (error) throw error
        setInfo('Te enviamos un email para restablecer tu contraseña.')
        setMode('login')
      }
    } catch (err: any) {
      setError(err.message || 'Ocurrió un error')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center px-4" style={{ backgroundColor: '#F8FAFC' }}>
      <div className="w-full max-w-md">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-full mb-4" style={{ backgroundColor: '#3B82F6' }}>
            <BookOpen className="w-8 h-8 text-white" />
          </div>
          <h1 className="mb-2" style={{ color: '#1E293B' }}>
            {mode === 'login' && 'Bienvenido de vuelta'}
            {mode === 'register' && 'Crea tu cuenta'}
            {mode === 'forgot' && 'Recuperar contraseña'}
          </h1>
          <p style={{ color: '#64748B' }}>
            {mode === 'login' && 'Continúa tu aprendizaje en metodologías ágiles'}
            {mode === 'register' && 'Regístrate para comenzar'}
            {mode === 'forgot' && 'Te enviaremos un enlace de restablecimiento'}
          </p>
        </div>

        {/* Card */}
        <div className="bg-white rounded-lg shadow-lg p-8" style={{ border: '1px solid #E2E8F0' }}>
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Nombre (solo en registro) - NEW */}
            {mode === 'register' && (
              <div>
                <Label htmlFor="full_name" style={{ color: '#1E293B' }}>
                  Nombre
                </Label>
                <Input
                  id="full_name"
                  placeholder="Tu nombre"
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  style={{ backgroundColor: '#F8FAFC', borderColor: '#E2E8F0', color: '#1E293B' }}
                />
              </div>
            )}

            {/* Email */}
            <div>
              <Label htmlFor="email" style={{ color: '#1E293B' }}>
                Correo electrónico
              </Label>
              <div className="relative mt-2">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5" style={{ color: '#64748B' }} />
                <Input
                  id="email"
                  type="email"
                  placeholder="tu@email.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="pl-10"
                  style={{ backgroundColor: '#F8FAFC', borderColor: '#E2E8F0', color: '#1E293B' }}
                />
              </div>
            </div>

            {/* Password (oculto en modo forgot) */}
            {mode !== 'forgot' && (
              <div>
                <Label htmlFor="password" style={{ color: '#1E293B' }}>
                  Contraseña
                </Label>
                <div className="relative mt-2">
                  <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5" style={{ color: '#64748B' }} />
                  <Input
                    id="password"
                    type="password"
                    placeholder="••••••••"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="pl-10"
                    style={{ backgroundColor: '#F8FAFC', borderColor: '#E2E8F0', color: '#1E293B' }}
                  />
                </div>
              </div>
            )}

            {/* Messages */}
            {error && (
              <div className="p-3 rounded-lg" style={{ backgroundColor: '#FEE2E2' }}>
                <p className="text-sm" style={{ color: '#991B1B' }}>{error}</p>
              </div>
            )}
            {info && (
              <div className="p-3 rounded-lg" style={{ backgroundColor: '#DCFCE7' }}>
                <p className="text-sm" style={{ color: '#166534' }}>{info}</p>
              </div>
            )}

            {/* Submit */}
            <Button type="submit" className="w-full" disabled={loading}
              style={{ backgroundColor: '#3B82F6', color: 'white', opacity: loading ? 0.8 : 1 }}>
              {loading
                ? 'Procesando...'
                : mode === 'login'
                  ? 'Iniciar Sesión'
                  : mode === 'register'
                    ? 'Crear cuenta'
                    : 'Enviar enlace'}
            </Button>

            {/* Links */}
            <div className="text-center space-y-2">
              {mode === 'login' && (
                <>
                  <button type="button" className="text-sm hover:underline" style={{ color: '#3B82F6' }}
                    onClick={() => setMode('forgot')}>
                    ¿Olvidaste tu contraseña?
                  </button>
                  <div />
                  <button type="button" className="text-sm hover:underline" style={{ color: '#3B82F6' }}
                    onClick={() => setMode('register')}>
                    ¿No tienes una cuenta? Regístrate
                  </button>
                </>
              )}

              {mode !== 'login' && (
                <button type="button" className="text-sm hover:underline" style={{ color: '#3B82F6' }}
                  onClick={() => { setMode('login'); setInfo(''); setError('') }}>
                  ← Volver a iniciar sesión
                </button>
              )}
            </div>
          </form>
        </div>

        {/* Hint */}
        <div className="mt-6 p-4 rounded-lg" style={{ backgroundColor: '#FEF3C7' }}>
          <p className="text-sm text-center" style={{ color: '#92400E' }}>
            {mode === 'login'
              ? 'Usa un usuario existente o regístrate para continuar.'
              : mode === 'register'
              ? 'Recibirás un correo de confirmación si está activado.'
              : 'Revisa tu correo para restablecer la contraseña.'}
          </p>
        </div>
      </div>
    </div>
  )
}
