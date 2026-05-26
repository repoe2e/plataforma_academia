import { Navigate, Route, Routes } from 'react-router-dom'
import { useApp } from './context/AppContext'
import { Layout, PublicLayout } from './components/layout/Layout'
import { Login } from './pages/Login'
import { Dashboard } from './pages/Dashboard'
import { Students } from './pages/Students'
import { StudentDetail } from './pages/StudentDetail'
import { Workouts } from './pages/Workouts'
import { Evolution } from './pages/Evolution'
import { Frequency } from './pages/Frequency'
import { Agenda } from './pages/Agenda'
import { CheckIn } from './pages/CheckIn'
import { MyWorkout } from './pages/MyWorkout'
import { History } from './pages/History'
import { Profile } from './pages/Profile'
import { Notifications } from './pages/Notifications'
import { Reports } from './pages/Reports'

function ProtectedRoute({ children, roles }: { children: React.ReactNode; roles?: ('profissional' | 'aluno')[] }) {
  const { currentUser } = useApp()
  if (!currentUser) return <Navigate to="/login" replace />
  if (roles && !roles.includes(currentUser.role)) return <Navigate to="/dashboard" replace />
  return <>{children}</>
}

export default function App() {
  const { currentUser } = useApp()

  return (
    <Routes>
      <Route element={<PublicLayout />}>
        <Route
          path="/login"
          element={currentUser ? <Navigate to="/dashboard" replace /> : <Login />}
        />
      </Route>

      <Route
        element={
          <ProtectedRoute>
            <Layout />
          </ProtectedRoute>
        }
      >
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/perfil" element={<Profile />} />
        <Route path="/notificacoes" element={<Notifications />} />
        <Route path="/evolucao" element={<Evolution />} />
        <Route path="/agenda" element={<Agenda />} />

        <Route
          path="/alunos"
          element={
            <ProtectedRoute roles={['profissional']}>
              <Students />
            </ProtectedRoute>
          }
        />
        <Route
          path="/alunos/:id"
          element={
            <ProtectedRoute roles={['profissional']}>
              <StudentDetail />
            </ProtectedRoute>
          }
        />
        <Route
          path="/treinos"
          element={
            <ProtectedRoute roles={['profissional']}>
              <Workouts />
            </ProtectedRoute>
          }
        />
        <Route
          path="/frequencia"
          element={
            <ProtectedRoute roles={['profissional']}>
              <Frequency />
            </ProtectedRoute>
          }
        />
        <Route
          path="/relatorios"
          element={
            <ProtectedRoute roles={['profissional']}>
              <Reports />
            </ProtectedRoute>
          }
        />

        <Route
          path="/meu-treino"
          element={
            <ProtectedRoute roles={['aluno']}>
              <MyWorkout />
            </ProtectedRoute>
          }
        />
        <Route
          path="/check-in"
          element={
            <ProtectedRoute roles={['aluno']}>
              <CheckIn />
            </ProtectedRoute>
          }
        />
        <Route
          path="/historico"
          element={
            <ProtectedRoute roles={['aluno']}>
              <History />
            </ProtectedRoute>
          }
        />
      </Route>

      <Route path="*" element={<Navigate to={currentUser ? '/dashboard' : '/login'} replace />} />
    </Routes>
  )
}
