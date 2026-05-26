import { useMemo } from 'react'
import { Activity, Calendar } from 'lucide-react'
import { useApp } from '../context/AppContext'
import { Card, PageHeader, StatCard } from '../components/ui/UI'
import './Frequency.css'

export function Frequency() {
  const { students, checkins } = useApp()

  const stats = useMemo(() => {
    const today = new Date().toISOString().slice(0, 10)
    const weekAgo = new Date()
    weekAgo.setDate(weekAgo.getDate() - 7)
    const weekStr = weekAgo.toISOString().slice(0, 10)

    return {
      today: checkins.filter((c) => c.date === today).length,
      week: checkins.filter((c) => c.date >= weekStr).length,
      total: checkins.length,
    }
  }, [checkins])

  const byStudent = useMemo(() => {
    return students
      .filter((s) => s.status === 'ativo')
      .map((s) => {
        const studentCheckins = checkins.filter((c) => c.studentId === s.id)
        const last = studentCheckins.sort((a, b) => b.date.localeCompare(a.date))[0]
        return { student: s, count: studentCheckins.length, last }
      })
      .sort((a, b) => b.count - a.count)
  }, [students, checkins])

  return (
    <div className="frequency-page">
      <PageHeader title="Frequência" subtitle="Controle de presença dos alunos" />

      <div className="frequency-stats">
        <StatCard label="Check-ins hoje" value={stats.today} icon={<Activity size={22} />} color="primary" />
        <StatCard label="Esta semana" value={stats.week} icon={<Calendar size={22} />} color="secondary" />
        <StatCard label="Total registrado" value={stats.total} icon={<Activity size={22} />} color="accent" />
      </div>

      <Card>
        <h3>Presença por aluno</h3>
        <div className="frequency-table-wrap">
          <table className="frequency-table">
            <thead>
              <tr>
                <th>Aluno</th>
                <th>Total check-ins</th>
                <th>Último check-in</th>
              </tr>
            </thead>
            <tbody>
              {byStudent.map(({ student, count, last }) => (
                <tr key={student.id}>
                  <td>
                    <div className="frequency-student">
                      <span className="frequency-avatar">{student.name.charAt(0)}</span>
                      {student.name}
                    </div>
                  </td>
                  <td><strong>{count}</strong></td>
                  <td>
                    {last
                      ? `${new Date(last.date + 'T12:00').toLocaleDateString('pt-BR')} às ${last.time}`
                      : '—'}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>

      <Card className="frequency-recent">
        <h3>Check-ins recentes</h3>
        <ul className="frequency-list">
          {[...checkins]
            .sort((a, b) => `${b.date}${b.time}`.localeCompare(`${a.date}${a.time}`))
            .slice(0, 15)
            .map((c) => {
              const student = students.find((s) => s.id === c.studentId)
              return (
                <li key={c.id}>
                  <span className="frequency-avatar">{student?.name.charAt(0) || '?'}</span>
                  <div>
                    <strong>{student?.name || 'Aluno'}</strong>
                    <span>{new Date(c.date + 'T12:00').toLocaleDateString('pt-BR')} — {c.time}</span>
                  </div>
                </li>
              )
            })}
        </ul>
      </Card>
    </div>
  )
}
