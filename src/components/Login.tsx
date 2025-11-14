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
  const [fullName, setFullName] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [info, setInfo] = useState('')

  const validate = () => {
    const cleanEmail = email.trim().normalize("NFKC")

    if (!cleanEmail || !cleanEmail.includes('@')) {
      return 'Ingresa un email válido'
    }

    if ((mode === 'login' || mode === 'register') && password.length < 6)
      return 'La contraseña debe tener al menos 6 caracteres'

    if (mode === 'register' && !fullName.trim())
      return 'Ingresa tu nombre'

    return ''
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    setInfo('')

    const validationMessage = validate()
    if (validationMessage) {
      setError(validationMessage)
      return
    }

    const cleanEmail = email.trim().normalize("NFKC")
    console.log("➡️ Email limpio:", cleanEmail)

    setLoading(true)

    try {
      // LOGIN
      if (mode === 'login') {
        const { error } = await supabase.auth.signInWithPassword({
          email: cleanEmail,
          password,
        })

        console.log("🔍 Resultado login:", error || "OK")

        if (error) throw error
        onLoginSuccess()
      }

      // REGISTER
      if (mode === 'register') {
        console.log("➡️ Intentando registrar:", cleanEmail, fullName)

        const result = await supabase.auth.signUp({
          email: cleanEmail,
          password,
          options: {
            data: { full_name: fullName },
            emailRedirectTo: `${window.location.origin}/auth/callback`,
          },
        })

        console.log("🔍 Resultado Signup JSON:", JSON.stringify(result, null, 2))

        if (result.error) throw result.error

        setInfo('Registro enviado. Revisa tu correo para confirmar la cuenta.')
        setMode('login')
        setPassword('')
      }

      // FORGOT PASSWORD
      if (mode === 'forgot') {
        const { error } = await supabase.auth.resetPasswordForEmail(cleanEmail, {
          redirectTo: `${window.location.origin}/reset-password`,
        })

        console.log("🔍 Resultado reset:", error || "OK")

        if (error) throw error
        setInfo('Te enviamos un email para restablecer la contraseña.')
        setMode('login')
      }

    } catch (err: any) {
      const errorMessage = `
🔥 ERROR SUPABASE:
${err?.message ?? "Sin mensaje"}
-----------------------------------
OBJETO COMPLETO:
${JSON.stringify(err, null, 2)}
      `

      console.log(errorMessage)
      setError(errorMessage) // ← MOSTRAR EN PANTALLA
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center px-4" style={{ backgroundColor: '#F8FAFC' }}>
      <div className="w-full max-w-md">

        {/* HEADER */}
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

        {/* CARD */}
        <div className="bg-white rounded-lg shadow-lg p-8" style={{ border: '1px solid #E2E8F0' }}>
          <form onSubmit={handleSubmit} className="space-y-6">

            {/* Nombre */}
            {mode === 'register' && (
              <div>
                <Label htmlFor="full_name">Nombre</Label>
                <Input
                  id="full_name"
                  placeholder="Tu nombre"
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                />
              </div>
            )}

            {/* Email */}
            <div>
              <Label htmlFor="email">Correo electrónico</Label>
              <div className="relative mt-2">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5" />
                <Input
                  id="email"
                  type="email"
                  placeholder="correo@ejemplo.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>

            {/* Password */}
            {mode !== 'forgot' && (
              <div>
                <Label htmlFor="password">Contraseña</Label>
                <div className="relative mt-2">
                  <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5" />
                  <Input
                    id="password"
                    type="password"
                    placeholder="••••••••"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="pl-10"
                  />
                </div>
              </div>
            )}

            {/* MENSAJES */}
            {error && (
              <div className="p-3 rounded-lg" style={{ backgroundColor: '#FEE2E2', whiteSpace: "pre-wrap" }}>
                <p style={{ color: '#991B1B' }}>{error}</p>
              </div>
            )}

            {info && (
              <div className="p-3 rounded-lg" style={{ backgroundColor: '#DCFCE7' }}>
                <p style={{ color: '#166534' }}>{info}</p>
              </div>
            )}

            <Button type="submit" className="w-full" disabled={loading}>
              {loading
                ? 'Procesando...'
                : mode === 'login'
                  ? 'Iniciar Sesión'
                  : mode === 'register'
                    ? 'Crear cuenta'
                    : 'Enviar enlace'}
            </Button>

            {/* LINKS */}
            <div className="text-center space-y-2">
              {mode === 'login' && (
                <>
                  <button type="button" className="text-sm hover:underline"
                    onClick={() => setMode('forgot')}>
                    ¿Olvidaste tu contraseña?
                  </button>
                  <div />
                  <button type="button" className="text-sm hover:underline"
                    onClick={() => setMode('register')}>
                    ¿No tienes una cuenta? Regístrate
                  </button>
                </>
              )}

              {mode !== 'login' && (
                <button type="button" className="text-sm hover:underline"
                  onClick={() => { setMode('login'); setInfo(''); setError('') }}>
                  ← Volver a iniciar sesión
                </button>
              )}
            </div>

          </form>
        </div>

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
