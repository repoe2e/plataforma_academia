import { useMemo, useState } from 'react'
import {
  Line,
  LineChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
  Legend,
} from 'recharts'
import { Plus, TrendingUp } from 'lucide-react'
import { useApp } from '../context/AppContext'
import { Button, Card, Input, Modal, PageHeader, Select } from '../components/ui/UI'
import './Evolution.css'

export function Evolution() {
  const { currentUser, students, evolution, addEvolution, showToast } = useApp()
  const isPro = currentUser?.role === 'profissional'
  const studentId = isPro ? undefined : currentUser?.studentId
  const [modal, setModal] = useState(false)
  const [selectedStudent, setSelectedStudent] = useState(studentId || '')
  const [form, setForm] = useState({
    date: new Date().toISOString().slice(0, 10),
    weight: '',
    bodyFat: '',
    waist: '',
    hip: '',
    chest: '',
    notes: '',
  })
  const [period, setPeriod] = useState<'3m' | '6m' | 'all'>('all')

  const activeStudentId = isPro ? selectedStudent : studentId

  const records = useMemo(() => {
    let list = evolution.filter((e) =>
      activeStudentId ? e.studentId === activeStudentId : true
    )
    if (period !== 'all') {
      const months = period === '3m' ? 3 : 6
      const cutoff = new Date()
      cutoff.setMonth(cutoff.getMonth() - months)
      list = list.filter((e) => new Date(e.date) >= cutoff)
    }
    return list.sort((a, b) => a.date.localeCompare(b.date))
  }, [evolution, activeStudentId, period])

  const chartData = records.map((e) => ({
    date: new Date(e.date + 'T12:00').toLocaleDateString('pt-BR', { month: 'short', day: 'numeric' }),
    peso: e.weight,
    gordura: e.bodyFat,
    cintura: e.waist,
  }))

  const handleSave = () => {
    const sid = isPro ? selectedStudent : studentId
    if (!sid) {
      showToast('Selecione um aluno')
      return
    }
    addEvolution({
      studentId: sid,
      date: form.date,
      weight: form.weight ? +form.weight : undefined,
      bodyFat: form.bodyFat ? +form.bodyFat : undefined,
      waist: form.waist ? +form.waist : undefined,
      hip: form.hip ? +form.hip : undefined,
      chest: form.chest ? +form.chest : undefined,
      notes: form.notes || undefined,
    })
    showToast('Evolução registrada com sucesso!')
    setModal(false)
  }

  return (
    <div className="evolution-page">
      <PageHeader
        title="Evolução Física"
        subtitle={isPro ? 'Registre e acompanhe medidas dos alunos' : 'Acompanhe seu progresso'}
        action={
          isPro ? (
            <Button onClick={() => setModal(true)}><Plus size={18} /> Registrar</Button>
          ) : null
        }
      />

      {isPro && (
        <div className="evolution-filters">
          <Select
            label="Aluno"
            value={selectedStudent}
            onChange={(e) => setSelectedStudent(e.target.value)}
            options={[
              { value: '', label: 'Todos os alunos' },
              ...students.filter((s) => s.status === 'ativo').map((s) => ({ value: s.id, label: s.name })),
            ]}
          />
        </div>
      )}

      <div className="period-tabs">
        {(['3m', '6m', 'all'] as const).map((p) => (
          <button
            key={p}
            className={`period-tab ${period === p ? 'period-tab--active' : ''}`}
            onClick={() => setPeriod(p)}
          >
            {p === '3m' ? '3 meses' : p === '6m' ? '6 meses' : 'Todo período'}
          </button>
        ))}
      </div>

      {records.length === 0 ? (
        <Card>
          <div className="evolution-empty">
            <TrendingUp size={40} />
            <p>Nenhum registro de evolução encontrado</p>
          </div>
        </Card>
      ) : (
        <>
          <Card className="evolution-chart">
            <h3>Gráfico de progresso</h3>
            <ResponsiveContainer width="100%" height={280}>
              <LineChart data={chartData}>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(139,157,201,0.15)" />
                <XAxis dataKey="date" tick={{ fill: '#8b9dc9', fontSize: 11 }} />
                <YAxis tick={{ fill: '#8b9dc9', fontSize: 11 }} />
                <Tooltip contentStyle={{ background: '#1a2447', border: '1px solid rgba(0,245,212,0.2)', borderRadius: 8 }} />
                <Legend />
                <Line type="monotone" dataKey="peso" stroke="#00f5d4" strokeWidth={2} name="Peso (kg)" dot={{ fill: '#00f5d4' }} />
                <Line type="monotone" dataKey="gordura" stroke="#ff006e" strokeWidth={2} name="Gordura (%)" dot={{ fill: '#ff006e' }} />
                <Line type="monotone" dataKey="cintura" stroke="#b388ff" strokeWidth={2} name="Cintura (cm)" dot={{ fill: '#b388ff' }} />
              </LineChart>
            </ResponsiveContainer>
          </Card>

          <div className="evolution-history">
            <h3>Histórico</h3>
            <div className="evolution-table-wrap">
              <table className="evolution-table">
                <thead>
                  <tr>
                    <th>Data</th>
                    <th>Peso</th>
                    <th>Gordura</th>
                    <th>Cintura</th>
                    <th>Quadril</th>
                  </tr>
                </thead>
                <tbody>
                  {[...records].reverse().map((e) => (
                    <tr key={e.id}>
                      <td>{new Date(e.date + 'T12:00').toLocaleDateString('pt-BR')}</td>
                      <td>{e.weight ? `${e.weight} kg` : '—'}</td>
                      <td>{e.bodyFat ? `${e.bodyFat}%` : '—'}</td>
                      <td>{e.waist ? `${e.waist} cm` : '—'}</td>
                      <td>{e.hip ? `${e.hip} cm` : '—'}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </>
      )}

      {isPro && (
        <Modal open={modal} onClose={() => setModal(false)} title="Registrar evolução" wide>
          <div className="form-grid">
            <Select
              label="Aluno"
              value={selectedStudent}
              onChange={(e) => setSelectedStudent(e.target.value)}
              options={[
                { value: '', label: 'Selecione' },
                ...students.filter((s) => s.status === 'ativo').map((s) => ({ value: s.id, label: s.name })),
              ]}
            />
            <Input label="Data" type="date" value={form.date} onChange={(e) => setForm({ ...form, date: e.target.value })} />
            <Input label="Peso (kg)" type="number" step="0.1" value={form.weight} onChange={(e) => setForm({ ...form, weight: e.target.value })} />
            <Input label="Gordura (%)" type="number" step="0.1" value={form.bodyFat} onChange={(e) => setForm({ ...form, bodyFat: e.target.value })} />
            <Input label="Cintura (cm)" type="number" value={form.waist} onChange={(e) => setForm({ ...form, waist: e.target.value })} />
            <Input label="Quadril (cm)" type="number" value={form.hip} onChange={(e) => setForm({ ...form, hip: e.target.value })} />
            <Input label="Peito (cm)" type="number" value={form.chest} onChange={(e) => setForm({ ...form, chest: e.target.value })} />
            <Input label="Observações" value={form.notes} onChange={(e) => setForm({ ...form, notes: e.target.value })} />
          </div>
          <div className="modal-actions">
            <Button variant="ghost" onClick={() => setModal(false)}>Cancelar</Button>
            <Button onClick={handleSave}>Salvar</Button>
          </div>
        </Modal>
      )}
    </div>
  )
}
