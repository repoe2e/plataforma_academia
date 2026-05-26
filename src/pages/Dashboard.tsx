import { Link } from 'react-router-dom'
import {
  Activity,
  Calendar,
  Dumbbell,
  TrendingUp,
  Users,
  Zap,
} from 'lucide-react'
import {
  Area,
  AreaChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts'
import { useApp } from '../context/AppContext'
import { Card, PageHeader, StatCard } from '../components/ui/UI'
import './Dashboard.css'

export function Dashboard() {
  const { currentUser, students, checkins, schedule, evolution, workouts } = useApp()
  const isPro = currentUser?.role === 'profissional'
  const studentId = currentUser?.studentId

  const activeStudents = students.filter((s) => s.status === 'ativo').length
  const todayCheckins = checkins.filter(
    (c) => c.date === new Date().toISOString().slice(0, 10)
  ).length
  const upcoming = schedule
    .filter((e) => e.date >= new Date().toISOString().slice(0, 10))
    .slice(0, 3)

  const myEvolution = evolution
    .filter((e) => e.studentId === studentId)
    .sort((a, b) => a.date.localeCompare(b.date))
    .map((e) => ({
      date: new Date(e.date).toLocaleDateString('pt-BR', { month: 'short', day: 'numeric' }),
      peso: e.weight,
      gordura: e.bodyFat,
    }))

  const myWorkout = workouts.find(
    (w) => w.id === students.find((s) => s.id === studentId)?.assignedWorkoutId
  )

  if (isPro) {
    return (
      <div className="dashboard">
        <PageHeader
          title="Dashboard"
          subtitle="Visão geral das atividades da academia"
        />
        <div className="dashboard__stats">
          <StatCard label="Alunos ativos" value={activeStudents} icon={<Users size={22} />} color="primary" trend="+2 este mês" />
          <StatCard label="Check-ins hoje" value={todayCheckins} icon={<Zap size={22} />} color="secondary" />
          <StatCard label="Treinos cadastrados" value={workouts.length} icon={<Dumbbell size={22} />} color="accent" />
          <StatCard label="Aulas agendadas" value={schedule.length} icon={<Calendar size={22} />} color="gold" />
        </div>
        <div className="dashboard__grid">
          <Card className="dashboard__card">
            <h3>Próximas aulas</h3>
            {upcoming.length === 0 ? (
              <p className="dashboard__empty">Nenhuma aula agendada</p>
            ) : (
              <ul className="dashboard__list">
                {upcoming.map((e) => (
                  <li key={e.id}>
                    <span className="dashboard__list-date">
                      {new Date(e.date + 'T12:00').toLocaleDateString('pt-BR', { weekday: 'short', day: 'numeric', month: 'short' })}
                    </span>
                    <div>
                      <strong>{e.title}</strong>
                      <span>{e.startTime} – {e.endTime}</span>
                    </div>
                  </li>
                ))}
              </ul>
            )}
            <Link to="/agenda" className="dashboard__link">Ver agenda completa →</Link>
          </Card>
          <Card className="dashboard__card">
            <h3>Alunos recentes</h3>
            <ul className="dashboard__list">
              {students.filter((s) => s.status === 'ativo').slice(0, 4).map((s) => (
                <li key={s.id}>
                  <span className="dashboard__avatar">{s.name.charAt(0)}</span>
                  <div>
                    <strong>{s.name}</strong>
                    <span>{s.email}</span>
                  </div>
                </li>
              ))}
            </ul>
            <Link to="/alunos" className="dashboard__link">Gerenciar alunos →</Link>
          </Card>
        </div>
        <div className="dashboard__quick">
          <h3>Acesso rápido</h3>
          <div className="dashboard__quick-grid">
            <Link to="/alunos" className="quick-action"><Users size={20} /> Alunos</Link>
            <Link to="/treinos" className="quick-action"><Dumbbell size={20} /> Treinos</Link>
            <Link to="/evolucao" className="quick-action"><TrendingUp size={20} /> Evolução</Link>
            <Link to="/frequencia" className="quick-action"><Activity size={20} /> Frequência</Link>
          </div>
        </div>
      </div>
    )
  }

  const myCheckins = checkins.filter((c) => c.studentId === studentId).length

  return (
    <div className="dashboard">
      <PageHeader title="Meu Dashboard" subtitle="Acompanhe seu progresso" />
      <div className="dashboard__stats">
        <StatCard label="Check-ins totais" value={myCheckins} icon={<Zap size={22} />} color="primary" />
        <StatCard label="Exercícios no treino" value={myWorkout?.exercises.length ?? 0} icon={<Dumbbell size={22} />} color="secondary" />
        <StatCard label="Registros de evolução" value={myEvolution.length} icon={<TrendingUp size={22} />} color="accent" />
      </div>
      <div className="dashboard__grid">
        {myWorkout && (
          <Card className="dashboard__card dashboard__workout-preview">
            <h3>Treino atual</h3>
            <p className="dashboard__workout-name">{myWorkout.name}</p>
            <p className="dashboard__workout-desc">{myWorkout.description}</p>
            <ul className="dashboard__exercises-mini">
              {myWorkout.exercises.slice(0, 3).map((ex) => (
                <li key={ex.id}>{ex.name} — {ex.sets}x{ex.reps}</li>
              ))}
            </ul>
            <Link to="/meu-treino" className="dashboard__link">Ver treino completo →</Link>
          </Card>
        )}
        {myEvolution.length > 0 && (
          <Card className="dashboard__card dashboard__chart-card">
            <h3>Minha evolução</h3>
            <ResponsiveContainer width="100%" height={200}>
              <AreaChart data={myEvolution}>
                <defs>
                  <linearGradient id="colorPeso" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#00f5d4" stopOpacity={0.3} />
                    <stop offset="95%" stopColor="#00f5d4" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(139,157,201,0.15)" />
                <XAxis dataKey="date" tick={{ fill: '#8b9dc9', fontSize: 11 }} />
                <YAxis tick={{ fill: '#8b9dc9', fontSize: 11 }} />
                <Tooltip contentStyle={{ background: '#1a2447', border: '1px solid rgba(0,245,212,0.2)', borderRadius: 8 }} />
                <Area type="monotone" dataKey="peso" stroke="#00f5d4" fill="url(#colorPeso)" name="Peso (kg)" />
              </AreaChart>
            </ResponsiveContainer>
            <Link to="/evolucao" className="dashboard__link">Ver evolução completa →</Link>
          </Card>
        )}
      </div>
      <Link to="/check-in" className="dashboard__checkin-cta">
        <Zap size={24} />
        <span>Realizar check-in agora</span>
      </Link>
    </div>
  )
}
