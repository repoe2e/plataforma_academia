import { useMemo, useState } from 'react'
import { Calendar, Plus, Trash2, Edit } from 'lucide-react'
import { useApp } from '../context/AppContext'
import { Button, Card, ConfirmDialog, Input, Modal, PageHeader, Select, Textarea } from '../components/ui/UI'
import './Agenda.css'

export function Agenda() {
  const { currentUser, students, schedule, addSchedule, updateSchedule, deleteSchedule, showToast } = useApp()
  const isPro = currentUser?.role === 'profissional'
  const studentId = currentUser?.studentId
  const [modal, setModal] = useState(false)
  const [editId, setEditId] = useState<string | null>(null)
  const [deleteId, setDeleteId] = useState<string | null>(null)
  const [form, setForm] = useState({
    title: '',
    date: '',
    startTime: '07:00',
    endTime: '08:00',
    studentIds: [] as string[],
    notes: '',
  })

  const events = useMemo(() => {
    let list = [...schedule].sort((a, b) => a.date.localeCompare(b.date) || a.startTime.localeCompare(b.startTime))
    if (!isPro && studentId) {
      list = list.filter((e) => e.studentIds.includes(studentId))
    }
    return list
  }, [schedule, isPro, studentId])

  const grouped = useMemo(() => {
    const map: Record<string, typeof events> = {}
    events.forEach((e) => {
      if (!map[e.date]) map[e.date] = []
      map[e.date].push(e)
    })
    return map
  }, [events])

  const openCreate = () => {
    setForm({ title: '', date: '', startTime: '07:00', endTime: '08:00', studentIds: [], notes: '' })
    setEditId(null)
    setModal(true)
  }

  const openEdit = (id: string) => {
    const e = schedule.find((s) => s.id === id)
    if (!e) return
    setForm({
      title: e.title,
      date: e.date,
      startTime: e.startTime,
      endTime: e.endTime,
      studentIds: e.studentIds,
      notes: e.notes || '',
    })
    setEditId(id)
    setModal(true)
  }

  const handleSave = () => {
    if (!form.title || !form.date) {
      showToast('Preencha título e data')
      return
    }
    const data = {
      ...form,
      professionalId: currentUser?.id || 'u1',
      studentIds: form.studentIds.length ? form.studentIds : [],
    }
    if (editId) {
      updateSchedule(editId, data)
      showToast('Horário atualizado!')
    } else {
      addSchedule(data)
      showToast('Horário cadastrado!')
    }
    setModal(false)
  }

  const handleDelete = () => {
    if (deleteId) {
      deleteSchedule(deleteId)
      showToast('Horário removido.')
      setDeleteId(null)
    }
  }

  const toggleStudent = (id: string) => {
    setForm((f) => ({
      ...f,
      studentIds: f.studentIds.includes(id)
        ? f.studentIds.filter((s) => s !== id)
        : [...f.studentIds, id],
    }))
  }

  return (
    <div className="agenda-page">
      <PageHeader
        title="Agenda"
        subtitle={isPro ? 'Gerencie horários de aula' : 'Seus horários de treino'}
        action={isPro ? <Button onClick={openCreate}><Plus size={18} /> Novo horário</Button> : undefined}
      />

      {events.length === 0 ? (
        <Card>
          <div className="agenda-empty">
            <Calendar size={40} />
            <p>Nenhum evento agendado</p>
          </div>
        </Card>
      ) : (
        <div className="agenda-timeline">
          {Object.entries(grouped).map(([date, dayEvents]) => (
            <div key={date} className="agenda-day">
              <div className="agenda-day__header">
                <span className="agenda-day__date">
                  {new Date(date + 'T12:00').toLocaleDateString('pt-BR', {
                    weekday: 'long',
                    day: 'numeric',
                    month: 'long',
                  })}
                </span>
              </div>
              {dayEvents.map((e) => (
                <div key={e.id} className="agenda-event">
                  <div className="agenda-event__time">
                    <span>{e.startTime}</span>
                    <span className="agenda-event__sep">—</span>
                    <span>{e.endTime}</span>
                  </div>
                  <div className="agenda-event__content">
                    <h4>{e.title}</h4>
                    <p>
                      {e.studentIds
                        .map((sid) => students.find((s) => s.id === sid)?.name)
                        .filter(Boolean)
                        .join(', ') || 'Sem aluno vinculado'}
                    </p>
                    {e.notes && <p className="agenda-event__notes">{e.notes}</p>}
                  </div>
                  {isPro && (
                    <div className="agenda-event__actions">
                      <Button variant="ghost" size="sm" onClick={() => openEdit(e.id)}><Edit size={14} /></Button>
                      <Button variant="ghost" size="sm" onClick={() => setDeleteId(e.id)}><Trash2 size={14} /></Button>
                    </div>
                  )}
                </div>
              ))}
            </div>
          ))}
        </div>
      )}

      {isPro && (
        <Modal open={modal} onClose={() => setModal(false)} title={editId ? 'Editar horário' : 'Novo horário'} wide>
          <div className="form-grid">
            <Input label="Título" value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} />
            <Input label="Data" type="date" value={form.date} onChange={(e) => setForm({ ...form, date: e.target.value })} />
            <Input label="Início" type="time" value={form.startTime} onChange={(e) => setForm({ ...form, startTime: e.target.value })} />
            <Input label="Fim" type="time" value={form.endTime} onChange={(e) => setForm({ ...form, endTime: e.target.value })} />
            <Textarea label="Observações" value={form.notes} onChange={(e) => setForm({ ...form, notes: e.target.value })} />
          </div>
          <div className="agenda-students-select">
            <span className="field__label">Alunos</span>
            <div className="agenda-chips">
              {students.filter((s) => s.status === 'ativo').map((s) => (
                <button
                  key={s.id}
                  type="button"
                  className={`agenda-chip ${form.studentIds.includes(s.id) ? 'agenda-chip--active' : ''}`}
                  onClick={() => toggleStudent(s.id)}
                >
                  {s.name}
                </button>
              ))}
            </div>
          </div>
          <div className="modal-actions">
            <Button variant="ghost" onClick={() => setModal(false)}>Cancelar</Button>
            <Button onClick={handleSave}>Salvar</Button>
          </div>
        </Modal>
      )}

      <ConfirmDialog
        open={!!deleteId}
        title="Excluir horário"
        message="Deseja remover este horário da agenda?"
        onConfirm={handleDelete}
        onCancel={() => setDeleteId(null)}
        confirmLabel="Excluir"
        danger
      />
    </div>
  )
}
