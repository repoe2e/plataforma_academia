import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Activity, Eye, EyeOff, Lock, Mail } from 'lucide-react'
import { useApp } from '../context/AppContext'
import { Button, Input } from '../components/ui/UI'
import './Login.css'

export function Login() {
  const { login, showToast } = useApp()
  const navigate = useNavigate()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [showPass, setShowPass] = useState(false)
  const [recovery, setRecovery] = useState(false)
  const [recoveryEmail, setRecoveryEmail] = useState('')

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault()
    if (!email.trim()) return
    if (login(email, password)) {
      showToast('Login realizado com sucesso!')
      navigate('/dashboard')
    } else {
      showToast('E-mail ou senha inválidos.')
    }
  }

  const handleRecovery = (e: React.FormEvent) => {
    e.preventDefault()
    showToast(`Link de recuperação enviado para ${recoveryEmail}`)
    setRecovery(false)
  }

  return (
    <div className="login-page">
      <div className="login-page__bg" />
      <div className="login-card animate-in">
        <div className="login-card__brand">
          <div className="login-card__logo">
            <Activity size={28} />
          </div>
          <h1>FitFlow</h1>
          <p>Gestão inteligente de treinos</p>
        </div>

        {!recovery ? (
          <>
            <form onSubmit={handleLogin} className="login-form">
              <Input
                label="E-mail"
                type="email"
                placeholder="seu@email.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
              <div className="login-form__pass">
                <Input
                  label="Senha"
                  type={showPass ? 'text' : 'password'}
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />
                <button
                  type="button"
                  className="login-form__toggle"
                  onClick={() => setShowPass(!showPass)}
                  aria-label="Mostrar senha"
                >
                  {showPass ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
              <button
                type="button"
                className="login-form__forgot"
                onClick={() => setRecovery(true)}
              >
                Esqueceu a senha?
              </button>
              <Button type="submit" size="lg" className="login-form__submit">
                Entrar
              </Button>
            </form>
            <div className="login-demo">
              <p>Contas de demonstração:</p>
              <button
                type="button"
                onClick={() => {
                  setEmail('profissional@fitflow.com')
                  setPassword('123')
                }}
              >
                <Mail size={14} /> Profissional
              </button>
              <button
                type="button"
                onClick={() => {
                  setEmail('aluno@fitflow.com')
                  setPassword('123')
                }}
              >
                <Lock size={14} /> Aluno
              </button>
            </div>
          </>
        ) : (
          <form onSubmit={handleRecovery} className="login-form">
            <p className="login-recovery-text">
              Informe seu e-mail para receber o link de recuperação de senha.
            </p>
            <Input
              label="E-mail"
              type="email"
              value={recoveryEmail}
              onChange={(e) => setRecoveryEmail(e.target.value)}
              required
            />
            <Button type="submit" size="lg" className="login-form__submit">
              Enviar link
            </Button>
            <Button type="button" variant="ghost" onClick={() => setRecovery(false)}>
              Voltar ao login
            </Button>
          </form>
        )}
      </div>
    </div>
  )
}
