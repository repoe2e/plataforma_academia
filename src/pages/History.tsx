import { History as HistoryIcon } from 'lucide-react'
import { useApp } from '../context/AppContext'
import { Card, EmptyState, PageHeader } from '../components/ui/UI'

export function History() {
  const { currentUser, history } = useApp()
  const myHistory = history
    .filter((h) => h.studentId === currentUser?.studentId)
    .sort((a, b) => b.completedAt.localeCompare(a.completedAt))

  return (
    <div>
      <PageHeader title="Histórico" subtitle="Treinos realizados" />
      {myHistory.length === 0 ? (
        <EmptyState
          icon={<HistoryIcon size={28} />}
          title="Sem histórico"
          description="Seu histórico será preenchido ao realizar check-ins."
        />
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
          {myHistory.map((h) => (
            <Card key={h.id}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <div>
                  <strong style={{ display: 'block', marginBottom: 4 }}>{h.workoutName}</strong>
                  <span style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>
                    {new Date(h.completedAt + 'T12:00').toLocaleDateString('pt-BR', {
                      weekday: 'long',
                      day: 'numeric',
                      month: 'long',
                      year: 'numeric',
                    })}
                  </span>
                </div>
                {h.duration && (
                  <span style={{ color: 'var(--primary)', fontWeight: 600 }}>{h.duration}</span>
                )}
              </div>
            </Card>
          ))}
        </div>
      )}
    </div>
  )
}
