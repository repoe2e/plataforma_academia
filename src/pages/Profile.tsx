import { useState } from 'react'
import { Save, User } from 'lucide-react'
import { useApp } from '../context/AppContext'
import { Button, Card, Input, PageHeader } from '../components/ui/UI'
import './Profile.css'

export function Profile() {
  const { currentUser, updateProfile, showToast } = useApp()
  const [form, setForm] = useState({
    name: currentUser?.name || '',
    email: currentUser?.email || '',
    phone: currentUser?.phone || '',
    birthDate: currentUser?.birthDate || '',
  })

  const handleSave = () => {
    if (!form.name.trim()) {
      showToast('Nome é obrigatório')
      return
    }
    updateProfile(form)
    showToast('Perfil atualizado com sucesso!')
  }

  return (
    <div className="profile-page">
      <PageHeader title="Meu Perfil" subtitle="Visualize e edite suas informações" />

      <Card className="profile-card">
        <div className="profile-avatar">
          <User size={40} />
        </div>
        <div className="profile-role">
          {currentUser?.role === 'profissional' ? 'Profissional' : 'Aluno'}
        </div>

        <div className="profile-form">
          <Input label="Nome completo" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} />
          <Input label="E-mail" type="email" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} />
          <Input label="Telefone / WhatsApp" value={form.phone} onChange={(e) => setForm({ ...form, phone: e.target.value })} />
          <Input label="Data de nascimento" type="date" value={form.birthDate} onChange={(e) => setForm({ ...form, birthDate: e.target.value })} />
        </div>

        <Button onClick={handleSave} className="profile-save">
          <Save size={18} /> Salvar alterações
        </Button>
      </Card>
    </div>
  )
}
