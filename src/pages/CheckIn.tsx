import { useMemo } from 'react'
import { CheckCircle2, Clock, Zap } from 'lucide-react'
import { useApp } from '../context/AppContext'
import { Button, Card, PageHeader } from '../components/ui/UI'
import './CheckIn.css'

export function CheckIn() {
  const { currentUser, checkins, addCheckIn, showToast, addHistory, workouts, students } = useApp()
  const studentId = currentUser?.studentId || ''
  const today = new Date().toISOString().slice(0, 10)

  const todayCheckin = checkins.find((c) => c.studentId === studentId && c.date === today)
  const myCheckins = checkins.filter((c) => c.studentId === studentId).sort((a, b) => b.date.localeCompare(a.date))

  const student = students.find((s) => s.id === studentId)
  const workout = workouts.find((w) => w.id === student?.assignedWorkoutId)

  const streak = useMemo(() => {
    let count = 0
    const d = new Date()
    for (let i = 0; i < 30; i++) {
      const dateStr = d.toISOString().slice(0, 10)
      if (myCheckins.some((c) => c.date === dateStr)) {
        count++
        d.setDate(d.getDate() - 1)
      } else if (i > 0) break
      else d.setDate(d.getDate() - 1)
    }
    return count
  }, [myCheckins])

  const handleCheckIn = () => {
    const result = addCheckIn(studentId)
    if (result.ok) {
      showToast(result.message)
      if (workout) {
        addHistory({
          studentId,
          workoutName: workout.name,
          completedAt: today,
        })
      }
    } else {
      showToast(result.message)
    }
  }

  return (
    <div className="checkin-page">
      <PageHeader title="Check-in" subtitle="Registre sua presença no treino" />

      <Card className={`checkin-card ${todayCheckin ? 'checkin-card--done' : ''}`}>
        <div className="checkin-card__icon">
          {todayCheckin ? <CheckCircle2 size={48} /> : <Zap size={48} />}
        </div>
        {todayCheckin ? (
          <>
            <h2>Check-in realizado!</h2>
            <p>Você registrou presença hoje às <strong>{todayCheckin.time}</strong></p>
            <p className="checkin-card__hint">Apenas um check-in por dia é permitido.</p>
          </>
        ) : (
          <>
            <h2>Pronto para treinar?</h2>
            <p>Registre sua presença agora. Não é possível fazer múltiplos check-ins no mesmo dia.</p>
            <Button size="lg" onClick={handleCheckIn} className="checkin-btn">
              <Zap size={20} /> Fazer check-in
            </Button>
          </>
        )}
      </Card>

      <div className="checkin-stats">
        <Card className="checkin-stat">
          <Clock size={20} />
          <div>
            <span>Total de check-ins</span>
            <strong>{myCheckins.length}</strong>
          </div>
        </Card>
        <Card className="checkin-stat">
          <Zap size={20} />
          <div>
            <span>Sequência atual</span>
            <strong>{streak} dias</strong>
          </div>
        </Card>
      </div>

      <Card>
        <h3>Histórico de check-ins</h3>
        <ul className="checkin-history">
          {myCheckins.length === 0 ? (
            <li className="checkin-history__empty">Nenhum check-in registrado</li>
          ) : (
            myCheckins.map((c) => (
              <li key={c.id}>
                <span>{new Date(c.date + 'T12:00').toLocaleDateString('pt-BR', { weekday: 'long', day: 'numeric', month: 'long' })}</span>
                <strong>{c.time}</strong>
              </li>
            ))
          )}
        </ul>
      </Card>
    </div>
  )
}
