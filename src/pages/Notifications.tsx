import { useState } from 'react'
import { Bell, Send } from 'lucide-react'
import { useApp } from '../context/AppContext'
import { DEMO_USERS } from '../data/mockData'
import { Button, Card, EmptyState, Input, Modal, PageHeader, Select, Textarea } from '../components/ui/UI'
import './Notifications.css'

export function Notifications() {
  const { currentUser, notifications, markNotificationRead, sendNotification, showToast } = useApp()
  const isPro = currentUser?.role === 'profissional'
  const [sendModal, setSendModal] = useState(false)
  const [sendForm, setSendForm] = useState({ userId: '', title: '', message: '' })

  const myNotifications = notifications
    .filter((n) => n.userId === currentUser?.id)
    .sort((a, b) => b.createdAt.localeCompare(a.createdAt))

  const unread = myNotifications.filter((n) => !n.read).length

  const handleSend = () => {
    if (!sendForm.userId || !sendForm.title || !sendForm.message) {
      showToast('Preencha todos os campos')
      return
    }
    sendNotification(sendForm.userId, sendForm.title, sendForm.message)
    showToast('Notificação enviada!')
    setSendModal(false)
    setSendForm({ userId: '', title: '', message: '' })
  }

  return (
    <div className="notifications-page">
      <PageHeader
        title="Notificações"
        subtitle={unread > 0 ? `${unread} não lida(s)` : 'Todas lidas'}
        action={
          isPro ? (
            <Button onClick={() => setSendModal(true)}><Send size={18} /> Enviar</Button>
          ) : undefined
        }
      />

      {myNotifications.length === 0 ? (
        <EmptyState icon={<Bell size={28} />} title="Sem notificações" description="Você não possui notificações no momento." />
      ) : (
        <div className="notifications-list">
          {myNotifications.map((n) => (
            <Card
              key={n.id}
              className={`notification-item ${!n.read ? 'notification-item--unread' : ''}`}
              onClick={() => !n.read && markNotificationRead(n.id)}
            >
              <div className="notification-item__dot" />
              <div>
                <h4>{n.title}</h4>
                <p>{n.message}</p>
                <time>{new Date(n.createdAt).toLocaleString('pt-BR')}</time>
              </div>
            </Card>
          ))}
        </div>
      )}

      {isPro && (
        <Modal open={sendModal} onClose={() => setSendModal(false)} title="Enviar notificação">
          <Select
            label="Destinatário"
            value={sendForm.userId}
            onChange={(e) => setSendForm({ ...sendForm, userId: e.target.value })}
            options={[
              { value: '', label: 'Selecione' },
              ...DEMO_USERS.filter((u) => u.role === 'aluno').map((u) => ({ value: u.id, label: u.name })),
            ]}
          />
          <Input label="Título" value={sendForm.title} onChange={(e) => setSendForm({ ...sendForm, title: e.target.value })} />
          <Textarea label="Mensagem" value={sendForm.message} onChange={(e) => setSendForm({ ...sendForm, message: e.target.value })} />
          <div className="modal-actions">
            <Button variant="ghost" onClick={() => setSendModal(false)}>Cancelar</Button>
            <Button onClick={handleSend}>Enviar</Button>
          </div>
        </Modal>
      )}
    </div>
  )
}
