import { Dumbbell, Timer } from 'lucide-react'
import { useApp } from '../context/AppContext'
import { Card, EmptyState, PageHeader } from '../components/ui/UI'
import './MyWorkout.css'

export function MyWorkout() {
  const { currentUser, students, workouts } = useApp()
  const student = students.find((s) => s.id === currentUser?.studentId)
  const workout = workouts.find((w) => w.id === student?.assignedWorkoutId)

  if (!workout) {
    return (
      <div>
        <PageHeader title="Meu Treino" subtitle="Treino personalizado pelo profissional" />
        <EmptyState
          icon={<Dumbbell size={28} />}
          title="Nenhum treino atribuído"
          description="Aguarde seu profissional associar um treino à sua conta."
        />
      </div>
    )
  }

  return (
    <div className="my-workout-page">
      <PageHeader title="Meu Treino" subtitle={workout.description || 'Treino personalizado'} />

      <Card className="workout-hero" glow>
        <div className="workout-hero__icon"><Dumbbell size={32} /></div>
        <h2>{workout.name}</h2>
        <p>{workout.exercises.length} exercícios • Criado em {new Date(workout.createdAt + 'T12:00').toLocaleDateString('pt-BR')}</p>
      </Card>

      <div className="exercises-list">
        {workout.exercises.map((ex, idx) => (
          <Card key={ex.id} className="exercise-item">
            <div className="exercise-item__num">{idx + 1}</div>
            <div className="exercise-item__content">
              <h3>{ex.name}</h3>
              <div className="exercise-item__meta">
                <span><strong>{ex.sets}</strong> séries</span>
                <span><strong>{ex.reps}</strong> reps</span>
                {ex.rest && (
                  <span className="exercise-item__rest">
                    <Timer size={14} /> {ex.rest}
                  </span>
                )}
              </div>
              {ex.notes && <p className="exercise-item__notes">{ex.notes}</p>}
            </div>
          </Card>
        ))}
      </div>
    </div>
  )
}
