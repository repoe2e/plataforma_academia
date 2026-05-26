import { useMemo, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Edit, Eye, Plus, Search, UserMinus, Users } from 'lucide-react'
import { useApp } from '../context/AppContext'
import type { Student, StudentStatus } from '../types'
import {
  Badge,
  Button,
  ConfirmDialog,
  EmptyState,
  Input,
  Modal,
  PageHeader,
  Select,
} from '../components/ui/UI'
import './Students.css'

const emptyForm = { name: '', email: '', whatsapp: '', birthDate: '', status: 'ativo' as StudentStatus }

export function Students() {
  const { students, addStudent, updateStudent, showToast } = useApp()
  const navigate = useNavigate()
  const [search, setSearch] = useState('')
  const [filter, setFilter] = useState<'todos' | StudentStatus>('todos')
  const [modal, setModal] = useState<'create' | 'edit' | null>(null)
  const [form, setForm] = useState(emptyForm)
  const [editId, setEditId] = useState<string | null>(null)
  const [inactivateId, setInactivateId] = useState<string | null>(null)
  const [errors, setErrors] = useState<Record<string, string>>({})

  const filtered = useMemo(() => {
    return students.filter((s) => {
      const matchSearch =
        s.name.toLowerCase().includes(search.toLowerCase()) ||
        s.email.toLowerCase().includes(search.toLowerCase())
      const matchFilter = filter === 'todos' || s.status === filter
      return matchSearch && matchFilter
    })
  }, [students, search, filter])

  const validate = () => {
    const e: Record<string, string> = {}
    if (!form.name.trim()) e.name = 'Nome completo é obrigatório'
    if (!form.whatsapp.trim()) e.whatsapp = 'WhatsApp é obrigatório'
    if (!form.birthDate) e.birthDate = 'Data de nascimento é obrigatória'
    if (!form.email.trim()) e.email = 'E-mail é obrigatório'
    else if (students.some((s) => s.email === form.email && s.id !== editId))
      e.email = 'E-mail já cadastrado'
    setErrors(e)
    return Object.keys(e).length === 0
  }

  const openCreate = () => {
    setForm(emptyForm)
    setEditId(null)
    setErrors({})
    setModal('create')
  }

  const openEdit = (s: Student) => {
    setForm({
      name: s.name,
      email: s.email,
      whatsapp: s.whatsapp,
      birthDate: s.birthDate,
      status: s.status,
    })
    setEditId(s.id)
    setErrors({})
    setModal('edit')
  }

  const handleSave = () => {
    if (!validate()) return
    if (modal === 'create') {
      addStudent(form)
      showToast('Aluno cadastrado com sucesso!')
    } else if (editId) {
      updateStudent(editId, form)
      showToast('Dados do aluno atualizados!')
    }
    setModal(null)
  }

  const handleInactivate = () => {
    if (inactivateId) {
      updateStudent(inactivateId, { status: 'inativo' })
      showToast('Aluno inativado com sucesso.')
      setInactivateId(null)
    }
  }

  const statusBadge = (status: StudentStatus) => {
    const map = { ativo: 'success', inativo: 'warning', bloqueado: 'danger' } as const
    return <Badge variant={map[status]}>{status}</Badge>
  }

  return (
    <div className="students-page">
      <PageHeader
        title="Alunos"
        subtitle="Gerencie cadastros, status e evolução"
        action={
          <Button onClick={openCreate}>
            <Plus size={18} /> Novo aluno
          </Button>
        }
      />

      <div className="students-toolbar">
        <div className="students-search">
          <Search size={18} />
          <input
            placeholder="Buscar por nome ou e-mail..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
        <div className="students-filters">
          {(['todos', 'ativo', 'inativo', 'bloqueado'] as const).map((f) => (
            <button
              key={f}
              className={`filter-chip ${filter === f ? 'filter-chip--active' : ''}`}
              onClick={() => setFilter(f)}
            >
              {f === 'todos' ? 'Todos' : f}
            </button>
          ))}
        </div>
      </div>

      {filtered.length === 0 ? (
        <EmptyState
          icon={<Users size={28} />}
          title="Nenhum aluno encontrado"
          description="Cadastre um novo aluno ou ajuste os filtros de busca."
        />
      ) : (
        <div className="students-grid">
          {filtered.map((s) => (
            <div key={s.id} className="student-card">
              <div className="student-card__header">
                <div className="student-card__avatar">{s.name.charAt(0)}</div>
                <div>
                  <h3>{s.name}</h3>
                  <p>{s.email}</p>
                </div>
                {statusBadge(s.status)}
              </div>
              <div className="student-card__info">
                <span>WhatsApp: {s.whatsapp}</span>
                <span>Nasc.: {new Date(s.birthDate + 'T12:00').toLocaleDateString('pt-BR')}</span>
              </div>
              <div className="student-card__actions">
                <Button variant="ghost" size="sm" onClick={() => navigate(`/alunos/${s.id}`)}>
                  <Eye size={16} /> Detalhes
                </Button>
                <Button variant="outline" size="sm" onClick={() => openEdit(s)}>
                  <Edit size={16} /> Editar
                </Button>
                {s.status === 'ativo' && (
                  <Button variant="ghost" size="sm" onClick={() => setInactivateId(s.id)}>
                    <UserMinus size={16} />
                  </Button>
                )}
              </div>
            </div>
          ))}
        </div>
      )}

      <Modal
        open={modal !== null}
        onClose={() => setModal(null)}
        title={modal === 'create' ? 'Cadastrar aluno' : 'Editar aluno'}
      >
        <div className="form-grid">
          <Input label="Nome completo *" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} error={errors.name} />
          <Input label="E-mail *" type="email" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} error={errors.email} />
          <Input label="WhatsApp *" value={form.whatsapp} onChange={(e) => setForm({ ...form, whatsapp: e.target.value })} error={errors.whatsapp} />
          <Input label="Data de nascimento *" type="date" value={form.birthDate} onChange={(e) => setForm({ ...form, birthDate: e.target.value })} error={errors.birthDate} />
          {modal === 'edit' && (
            <Select
              label="Status"
              value={form.status}
              onChange={(e) => setForm({ ...form, status: e.target.value as StudentStatus })}
              options={[
                { value: 'ativo', label: 'Ativo' },
                { value: 'inativo', label: 'Inativo' },
                { value: 'bloqueado', label: 'Bloqueado' },
              ]}
            />
          )}
        </div>
        <div className="modal-actions">
          <Button variant="ghost" onClick={() => setModal(null)}>Cancelar</Button>
          <Button onClick={handleSave}>Salvar</Button>
        </div>
      </Modal>

      <ConfirmDialog
        open={!!inactivateId}
        title="Inativar aluno"
        message="Deseja realmente inativar este aluno? Ele não aparecerá mais nas listagens ativas."
        onConfirm={handleInactivate}
        onCancel={() => setInactivateId(null)}
        confirmLabel="Inativar"
        danger
      />
    </div>
  )
}
