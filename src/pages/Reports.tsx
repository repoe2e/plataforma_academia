import {
  Bar,
  BarChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts'
import { useMemo } from 'react'
import { useApp } from '../context/AppContext'
import { Card, PageHeader, StatCard } from '../components/ui/UI'
import { Activity, TrendingUp, Users } from 'lucide-react'

export function Reports() {
  const { students, checkins, evolution } = useApp()

  const activeStudents = students.filter((s) => s.status === 'ativo').length
  const avgCheckins = checkins.length / Math.max(activeStudents, 1)

  const checkinsByMonth = useMemo(() => {
    const map: Record<string, number> = {}
    checkins.forEach((c) => {
      const month = c.date.slice(0, 7)
      map[month] = (map[month] || 0) + 1
    })
    return Object.entries(map)
      .sort(([a], [b]) => a.localeCompare(b))
      .map(([month, total]) => ({
        month: new Date(month + '-01').toLocaleDateString('pt-BR', { month: 'short', year: '2-digit' }),
        checkins: total,
      }))
  }, [checkins])

  const topStudents = useMemo(() => {
    const counts: Record<string, number> = {}
    checkins.forEach((c) => {
      counts[c.studentId] = (counts[c.studentId] || 0) + 1
    })
    return Object.entries(counts)
      .map(([id, total]) => ({
        name: students.find((s) => s.id === id)?.name?.split(' ')[0] || 'Aluno',
        checkins: total,
      }))
      .sort((a, b) => b.checkins - a.checkins)
      .slice(0, 5)
  }, [checkins, students])

  return (
    <div>
      <PageHeader title="Relatórios" subtitle="Indicadores e métricas de desempenho" />

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: 16, marginBottom: 24 }}>
        <StatCard label="Alunos ativos" value={activeStudents} icon={<Users size={22} />} color="primary" />
        <StatCard label="Total check-ins" value={checkins.length} icon={<Activity size={22} />} color="secondary" />
        <StatCard label="Média check-ins/aluno" value={avgCheckins.toFixed(1)} icon={<TrendingUp size={22} />} color="accent" />
        <StatCard label="Registros evolução" value={evolution.length} icon={<TrendingUp size={22} />} color="gold" />
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: 20 }}>
        <Card>
          <h3 style={{ marginBottom: 16, color: 'var(--text-muted)', fontSize: '0.95rem' }}>Check-ins por mês</h3>
          <ResponsiveContainer width="100%" height={240}>
            <BarChart data={checkinsByMonth}>
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(139,157,201,0.15)" />
              <XAxis dataKey="month" tick={{ fill: '#8b9dc9', fontSize: 11 }} />
              <YAxis tick={{ fill: '#8b9dc9', fontSize: 11 }} />
              <Tooltip contentStyle={{ background: '#1a2447', border: '1px solid rgba(0,245,212,0.2)', borderRadius: 8 }} />
              <Bar dataKey="checkins" fill="#00f5d4" radius={[6, 6, 0, 0]} name="Check-ins" />
            </BarChart>
          </ResponsiveContainer>
        </Card>

        <Card>
          <h3 style={{ marginBottom: 16, color: 'var(--text-muted)', fontSize: '0.95rem' }}>Top alunos (check-ins)</h3>
          <ResponsiveContainer width="100%" height={240}>
            <BarChart data={topStudents} layout="vertical">
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(139,157,201,0.15)" />
              <XAxis type="number" tick={{ fill: '#8b9dc9', fontSize: 11 }} />
              <YAxis dataKey="name" type="category" width={80} tick={{ fill: '#8b9dc9', fontSize: 11 }} />
              <Tooltip contentStyle={{ background: '#1a2447', border: '1px solid rgba(255,0,110,0.2)', borderRadius: 8 }} />
              <Bar dataKey="checkins" fill="#ff006e" radius={[0, 6, 6, 0]} name="Check-ins" />
            </BarChart>
          </ResponsiveContainer>
        </Card>
      </div>
    </div>
  )
}
