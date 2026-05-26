import { useParams, useNavigate } from 'react-router-dom'
import { ArrowLeft, Dumbbell, TrendingUp, Activity } from 'lucide-react'
import { useApp } from '../context/AppContext'
import { Badge, Button, Card, PageHeader } from '../components/ui/UI'
import './Students.css'

export function StudentDetail() {
  const { id } = useParams<{ id: string }>()
  const navigate = useNavigate()
  const { students, workouts, evolution, checkins, history } = useApp()

  const student = students.find((s) => s.id === id)
  if (!student) {
    return (
      <div>
        <p>Aluno não encontrado.</p>
        <Button onClick={() => navigate('/alunos')}>Voltar</Button>
      </div>
    )
  }

  const workout = workouts.find((w) => w.id === student.assignedWorkoutId)
  const studentEvolution = evolution.filter((e) => e.studentId === id).sort((a, b) => b.date.localeCompare(a.date))
  const studentCheckins = checkins.filter((c) => c.studentId === id).sort((a, b) => b.date.localeCompare(a.date))
  const studentHistory = history.filter((h) => h.studentId === id)

  return (
    <div className="student-detail">
      <Button variant="ghost" onClick={() => navigate('/alunos')} className="back-btn">
        <ArrowLeft size={18} /> Voltar
      </Button>
      <PageHeader title={student.name} subtitle={student.email} />

      <div className="detail-grid">
        <Card>
          <h3>Dados pessoais</h3>
          <dl className="detail-list">
            <dt>WhatsApp</dt><dd>{student.whatsapp}</dd>
            <dt>Nascimento</dt><dd>{new Date(student.birthDate + 'T12:00').toLocaleDateString('pt-BR')}</dd>
            <dt>Status</dt><dd><Badge variant={student.status === 'ativo' ? 'success' : 'warning'}>{student.status}</Badge></dd>
            <dt>Cadastro</dt><dd>{new Date(student.createdAt + 'T12:00').toLocaleDateString('pt-BR')}</dd>
          </dl>
        </Card>

        <Card>
          <h3><Dumbbell size={18} /> Treino atribuído</h3>
          {workout ? (
            <>
              <p className="detail-highlight">{workout.name}</p>
              <ul className="detail-exercises">
                {workout.exercises.map((ex) => (
                  <li key={ex.id}>{ex.name} — {ex.sets}x{ex.reps}</li>
                ))}
              </ul>
            </>
          ) : (
            <p className="detail-empty">Nenhum treino associado</p>
          )}
        </Card>

        <Card>
          <h3><TrendingUp size={18} /> Evolução ({studentEvolution.length})</h3>
          {studentEvolution.length === 0 ? (
            <p className="detail-empty">Sem registros</p>
          ) : (
            <ul className="detail-timeline">
              {studentEvolution.slice(0, 5).map((e) => (
                <li key={e.id}>
                  <span>{new Date(e.date + 'T12:00').toLocaleDateString('pt-BR')}</span>
                  <span>{e.weight && `${e.weight}kg`} {e.bodyFat && `• ${e.bodyFat}% gordura`}</span>
                </li>
              ))}
            </ul>
          )}
        </Card>

        <Card>
          <h3><Activity size={18} /> Frequência ({studentCheckins.length} check-ins)</h3>
          {studentCheckins.length === 0 ? (
            <p className="detail-empty">Sem check-ins</p>
          ) : (
            <ul className="detail-timeline">
              {studentCheckins.slice(0, 8).map((c) => (
                <li key={c.id}>
                  <span>{new Date(c.date + 'T12:00').toLocaleDateString('pt-BR')}</span>
                  <span>{c.time}</span>
                </li>
              ))}
            </ul>
          )}
        </Card>

        {studentHistory.length > 0 && (
          <Card>
            <h3>Histórico de treinos</h3>
            <ul className="detail-timeline">
              {studentHistory.map((h) => (
                <li key={h.id}>
                  <span>{h.workoutName}</span>
                  <span>{new Date(h.completedAt + 'T12:00').toLocaleDateString('pt-BR')}</span>
                </li>
              ))}
            </ul>
          </Card>
        )}
      </div>
    </div>
  )
}
