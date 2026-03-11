import { useState } from 'react'
import { useAuth } from '../context/AuthContext'

export default function Login() {
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState('')
    const [isSignup, setIsSignup] = useState(false)
    const { login, signup } = useAuth()

    const handleSubmit = async (e) => {
        e.preventDefault()
        setLoading(true)
        setError('')

        try {
            if (isSignup) {
                await signup(email, password)
                alert('Cuenta creada! Por favor inicia sesión.')
                setIsSignup(false)
            } else {
                await login(email, password)
            }
        } catch (err) {
            setError(err.message)
        } finally {
            setLoading(false)
        }
    }

    return (
        <div className="min-h-screen bg-background-main flex items-center justify-center p-4">
            <div className="bg-background-card rounded-xl shadow-card w-full max-w-md p-8">
                {/* Logo / Título */}
                <div className="text-center mb-8">
                    <h1 className="text-2xl font-semibold text-text-primary">Mi Sistema</h1>
                    <p className="text-sm text-text-secondary mt-2">
                        {isSignup ? 'Crea tu cuenta' : 'Inicia sesión para continuar'}
                    </p>
                </div>

                {/* Error */}
                {error && (
                    <div className="mb-6 p-3 bg-red-50 border border-red-200 rounded-lg text-sm text-danger">
                        {error}
                    </div>
                )}

                {/* Formulario */}
                <form onSubmit={handleSubmit} className="space-y-4">
                    <div>
                        <label className="block text-sm font-medium text-text-secondary mb-1.5">
                            Email
                        </label>
                        <input
                            type="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            required
                            className="w-full px-4 py-2.5 border border-gray-200 rounded-lg 
                focus:outline-none focus:ring-2 focus:ring-accent-light focus:border-accent
                text-sm text-text-primary"
                            placeholder="tu@email.com"
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-text-secondary mb-1.5">
                            Contraseña
                        </label>
                        <input
                            type="password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            required
                            minLength={6}
                            className="w-full px-4 py-2.5 border border-gray-200 rounded-lg 
                focus:outline-none focus:ring-2 focus:ring-accent-light focus:border-accent
                text-sm text-text-primary"
                            placeholder="••••••••"
                        />
                    </div>

                    <button
                        type="submit"
                        disabled={loading}
                        className="w-full bg-accent hover:bg-accent-hover text-white px-4 py-2.5 
              rounded-lg text-sm font-medium transition disabled:opacity-50"
                    >
                        {loading ? 'Cargando...' : isSignup ? 'Crear Cuenta' : 'Iniciar Sesión'}
                    </button>
                </form>

                {/* Toggle Login/Signup */}
                <div className="mt-6 text-center">
                    <button
                        onClick={() => {
                            setIsSignup(!isSignup)
                            setError('')
                        }}
                        className="text-sm text-accent hover:text-accent-hover font-medium"
                    >
                        {isSignup ? '¿Ya tienes cuenta? Inicia sesión' : '¿No tienes cuenta? Crea una'}
                    </button>
                </div>
            </div>
        </div>
    )
}