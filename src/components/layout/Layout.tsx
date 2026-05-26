import { useState } from 'react'
import { NavLink, Outlet, useNavigate } from 'react-router-dom'
import {
  Activity,
  BarChart3,
  Bell,
  Calendar,
  ClipboardList,
  Dumbbell,
  History,
  LayoutDashboard,
  LogOut,
  Menu,
  TrendingUp,
  UserCircle,
  Users,
  X,
  Zap,
} from 'lucide-react'
import { useApp } from '../../context/AppContext'
import { Toast } from '../ui/UI'
import './Layout.css'

const PRO_MENU = [
  { to: '/dashboard', icon: LayoutDashboard, label: 'Dashboard' },
  { to: '/alunos', icon: Users, label: 'Alunos' },
  { to: '/treinos', icon: Dumbbell, label: 'Treinos' },
  { to: '/evolucao', icon: TrendingUp, label: 'Evolução' },
  { to: '/frequencia', icon: Activity, label: 'Frequência' },
  { to: '/agenda', icon: Calendar, label: 'Agenda' },
  { to: '/relatorios', icon: BarChart3, label: 'Relatórios' },
  { to: '/notificacoes', icon: Bell, label: 'Notificações' },
  { to: '/perfil', icon: UserCircle, label: 'Perfil' },
]

const ALUNO_MENU = [
  { to: '/dashboard', icon: LayoutDashboard, label: 'Dashboard' },
  { to: '/meu-treino', icon: Dumbbell, label: 'Meu Treino' },
  { to: '/evolucao', icon: TrendingUp, label: 'Evolução' },
  { to: '/check-in', icon: Zap, label: 'Check-in' },
  { to: '/agenda', icon: Calendar, label: 'Agenda' },
  { to: '/historico', icon: History, label: 'Histórico' },
  { to: '/notificacoes', icon: Bell, label: 'Notificações' },
  { to: '/perfil', icon: UserCircle, label: 'Perfil' },
]

export function Layout() {
  const { currentUser, logout, notifications, toast, clearToast } = useApp()
  const navigate = useNavigate()
  const [sidebarOpen, setSidebarOpen] = useState(false)

  const menu = currentUser?.role === 'profissional' ? PRO_MENU : ALUNO_MENU
  const unread = notifications.filter(
    (n) => n.userId === currentUser?.id && !n.read
  ).length

  const handleLogout = () => {
    logout()
    navigate('/login')
  }

  return (
    <div className="layout">
      <div
        className={`sidebar-overlay ${sidebarOpen ? 'sidebar-overlay--open' : ''}`}
        onClick={() => setSidebarOpen(false)}
      />
      <aside className={`sidebar ${sidebarOpen ? 'sidebar--open' : ''}`}>
        <div className="sidebar__brand">
          <div className="sidebar__logo">
            <Activity size={22} />
          </div>
          <div>
            <span className="sidebar__name">FitFlow</span>
            <span className="sidebar__tag">Gestão de Treinos</span>
          </div>
          <button
            className="sidebar__close"
            onClick={() => setSidebarOpen(false)}
            aria-label="Fechar menu"
          >
            <X size={20} />
          </button>
        </div>
        <nav className="sidebar__nav">
          {menu.map(({ to, icon: Icon, label }) => (
            <NavLink
              key={to}
              to={to}
              className={({ isActive }) =>
                `sidebar__link ${isActive ? 'sidebar__link--active' : ''}`
              }
              onClick={() => setSidebarOpen(false)}
            >
              <Icon size={18} />
              <span>{label}</span>
              {label === 'Notificações' && unread > 0 && (
                <span className="sidebar__badge">{unread}</span>
              )}
            </NavLink>
          ))}
        </nav>
        <div className="sidebar__footer">
          <div className="sidebar__user">
            <div className="sidebar__avatar">
              {currentUser?.name.charAt(0)}
            </div>
            <div>
              <span className="sidebar__user-name">{currentUser?.name}</span>
              <span className="sidebar__user-role">
                {currentUser?.role === 'profissional' ? 'Profissional' : 'Aluno'}
              </span>
            </div>
          </div>
          <button className="sidebar__logout" onClick={handleLogout}>
            <LogOut size={18} />
            Sair
          </button>
        </div>
      </aside>

      <div className="layout__main">
        <header className="header">
          <button
            className="header__menu"
            onClick={() => setSidebarOpen(true)}
            aria-label="Abrir menu"
          >
            <Menu size={22} />
          </button>
          <div className="header__info">
            <span className="header__greeting">
              Olá, <strong>{currentUser?.name.split(' ')[0]}</strong>
            </span>
          </div>
          <NavLink to="/notificacoes" className="header__notif">
            <Bell size={20} />
            {unread > 0 && <span className="header__notif-badge">{unread}</span>}
          </NavLink>
        </header>
        <main className="content animate-in">
          <Outlet />
        </main>
      </div>

      {toast && <Toast message={toast} onClose={clearToast} />}
    </div>
  )
}

export function PublicLayout() {
  return (
    <div className="public-layout">
      <Outlet />
    </div>
  )
}
