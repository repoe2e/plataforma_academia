import { useState } from 'react'
import { Dumbbell, Link2, Plus, Trash2, Edit } from 'lucide-react'
import { useApp } from '../context/AppContext'
import type { Exercise, Workout } from '../types'
import {
  Button,
  ConfirmDialog,
  EmptyState,
  Input,
  Modal,
  PageHeader,
  Select,
  Textarea,
} from '../components/ui/UI'
import './Workouts.css'

const emptyExercise = (): Exercise => ({
  id: `ex${Date.now()}`,
  name: '',
  sets: 3,
  reps: '12',
  rest: '60s',
})

export function Workouts() {
  const { workouts, students, addWorkout, updateWorkout, deleteWorkout, assignWorkout, showToast } = useApp()
  const [modal, setModal] = useState<'create' | 'edit' | 'assign' | null>(null)
  const [editId, setEditId] = useState<string | null>(null)
  const [deleteId, setDeleteId] = useState<string | null>(null)
  const [name, setName] = useState('')
  const [description, setDescription] = useState('')
  const [exercises, setExercises] = useState<Exercise[]>([emptyExercise()])
  const [assignWorkoutId, setAssignWorkoutId] = useState('')
  const [assignStudentId, setAssignStudentId] = useState('')

  const openCreate = () => {
    setName('')
    setDescription('')
    setExercises([emptyExercise()])
    setEditId(null)
    setModal('create')
  }

  const openEdit = (w: Workout) => {
    setName(w.name)
    setDescription(w.description || '')
    setExercises([...w.exercises])
    setEditId(w.id)
    setModal('edit')
  }

  const handleSave = () => {
    if (!name.trim()) {
      showToast('Nome do treino é obrigatório')
      return
    }
    const validExercises = exercises.filter((e) => e.name.trim())
    if (validExercises.length === 0) {
      showToast('Adicione pelo menos um exercício')
      return
    }
    const data = { name, description, exercises: validExercises, isTemplate: true }
    if (modal === 'create') {
      addWorkout(data)
      showToast('Treino cadastrado com sucesso!')
    } else if (editId) {
      updateWorkout(editId, data)
      showToast('Treino atualizado!')
    }
    setModal(null)
  }

  const handleDelete = () => {
    if (deleteId) {
      deleteWorkout(deleteId)
      showToast('Treino excluído.')
      setDeleteId(null)
    }
  }

  const handleAssign = () => {
    if (assignWorkoutId && assignStudentId) {
      assignWorkout(assignStudentId, assignWorkoutId)
      showToast('Treino associado ao aluno!')
      setModal(null)
    }
  }

  const updateExercise = (idx: number, field: keyof Exercise, value: string | number) => {
    setExercises((prev) =>
      prev.map((ex, i) => (i === idx ? { ...ex, [field]: value } : ex))
    )
  }

  return (
    <div className="workouts-page">
      <PageHeader
        title="Biblioteca de Treinos"
        subtitle="Crie, edite e associe treinos aos alunos"
        action={
          <div className="workouts-actions">
            <Button variant="outline" onClick={() => { setAssignWorkoutId(''); setAssignStudentId(''); setModal('assign') }}>
              <Link2 size={18} /> Associar
            </Button>
            <Button onClick={openCreate}><Plus size={18} /> Novo treino</Button>
          </div>
        }
      />

      {workouts.length === 0 ? (
        <EmptyState icon={<Dumbbell size={28} />} title="Nenhum treino" description="Cadastre seu primeiro treino na biblioteca." />
      ) : (
        <div className="workouts-grid">
          {workouts.map((w) => (
            <div key={w.id} className="workout-card">
              <div className="workout-card__icon"><Dumbbell size={22} /></div>
              <h3>{w.name}</h3>
              {w.description && <p>{w.description}</p>}
              <span className="workout-card__count">{w.exercises.length} exercícios</span>
              <ul className="workout-card__exercises">
                {w.exercises.slice(0, 3).map((ex) => (
                  <li key={ex.id}>{ex.name} — {ex.sets}x{ex.reps}</li>
                ))}
                {w.exercises.length > 3 && <li>+{w.exercises.length - 3} mais...</li>}
              </ul>
              <div className="workout-card__actions">
                <Button variant="outline" size="sm" onClick={() => openEdit(w)}><Edit size={14} /> Editar</Button>
                <Button variant="ghost" size="sm" onClick={() => setDeleteId(w.id)}><Trash2 size={14} /></Button>
              </div>
            </div>
          ))}
        </div>
      )}

      <Modal open={modal === 'create' || modal === 'edit'} onClose={() => setModal(null)} title={modal === 'create' ? 'Criar treino' : 'Editar treino'} wide>
        <div className="workout-form">
          <Input label="Nome do treino" value={name} onChange={(e) => setName(e.target.value)} />
          <Textarea label="Descrição" value={description} onChange={(e) => setDescription(e.target.value)} />
          <div className="exercises-section">
            <div className="exercises-section__header">
              <h4>Exercícios</h4>
              <Button variant="outline" size="sm" onClick={() => setExercises([...exercises, emptyExercise()])}>
                <Plus size={14} /> Adicionar
              </Button>
            </div>
            {exercises.map((ex, idx) => (
              <div key={ex.id} className="exercise-row">
                <Input label="Exercício" value={ex.name} onChange={(e) => updateExercise(idx, 'name', e.target.value)} />
                <Input label="Séries" type="number" value={ex.sets} onChange={(e) => updateExercise(idx, 'sets', +e.target.value)} />
                <Input label="Repetições" value={ex.reps} onChange={(e) => updateExercise(idx, 'reps', e.target.value)} />
                <Input label="Descanso" value={ex.rest || ''} onChange={(e) => updateExercise(idx, 'rest', e.target.value)} />
                {exercises.length > 1 && (
                  <Button variant="ghost" size="sm" onClick={() => setExercises(exercises.filter((_, i) => i !== idx))}>
                    <Trash2 size={14} />
                  </Button>
                )}
              </div>
            ))}
          </div>
        </div>
        <div className="modal-actions">
          <Button variant="ghost" onClick={() => setModal(null)}>Cancelar</Button>
          <Button onClick={handleSave}>Salvar treino</Button>
        </div>
      </Modal>

      <Modal open={modal === 'assign'} onClose={() => setModal(null)} title="Associar treino ao aluno">
        <Select
          label="Aluno"
          value={assignStudentId}
          onChange={(e) => setAssignStudentId(e.target.value)}
          options={[
            { value: '', label: 'Selecione o aluno' },
            ...students.filter((s) => s.status === 'ativo').map((s) => ({ value: s.id, label: s.name })),
          ]}
        />
        <Select
          label="Treino"
          value={assignWorkoutId}
          onChange={(e) => setAssignWorkoutId(e.target.value)}
          options={[
            { value: '', label: 'Selecione o treino' },
            ...workouts.map((w) => ({ value: w.id, label: w.name })),
          ]}
        />
        <div className="modal-actions">
          <Button variant="ghost" onClick={() => setModal(null)}>Cancelar</Button>
          <Button onClick={handleAssign}>Associar</Button>
        </div>
      </Modal>

      <ConfirmDialog
        open={!!deleteId}
        title="Excluir treino"
        message="Tem certeza que deseja excluir este treino?"
        onConfirm={handleDelete}
        onCancel={() => setDeleteId(null)}
        confirmLabel="Excluir"
        danger
      />
    </div>
  )
}
