import type {
  CheckIn,
  EvolutionRecord,
  Notification,
  ScheduleEvent,
  Student,
  User,
  Workout,
  WorkoutHistory,
} from '../types'

export const DEMO_USERS: User[] = [
  {
    id: 'u1',
    name: 'Carlos Mendes',
    email: 'profissional@fitflow.com',
    role: 'profissional',
    phone: '(11) 98765-4321',
    birthDate: '1985-03-15',
  },
  {
    id: 'u2',
    name: 'Ana Silva',
    email: 'aluno@fitflow.com',
    role: 'aluno',
    phone: '(11) 91234-5678',
    birthDate: '1998-07-22',
    studentId: 's1',
  },
  {
    id: 'u3',
    name: 'Bruno Costa',
    email: 'bruno@email.com',
    role: 'aluno',
    phone: '(11) 99876-5432',
    birthDate: '1995-11-08',
    studentId: 's2',
  },
]

export const INITIAL_STUDENTS: Student[] = [
  {
    id: 's1',
    name: 'Ana Silva',
    email: 'aluno@fitflow.com',
    whatsapp: '(11) 91234-5678',
    birthDate: '1998-07-22',
    status: 'ativo',
    createdAt: '2025-01-10',
    assignedWorkoutId: 'w1',
  },
  {
    id: 's2',
    name: 'Bruno Costa',
    email: 'bruno@email.com',
    whatsapp: '(11) 99876-5432',
    birthDate: '1995-11-08',
    status: 'ativo',
    createdAt: '2025-02-05',
    assignedWorkoutId: 'w2',
  },
  {
    id: 's3',
    name: 'Mariana Lima',
    email: 'mariana@email.com',
    whatsapp: '(11) 97654-3210',
    birthDate: '2000-04-18',
    status: 'inativo',
    createdAt: '2024-11-20',
  },
  {
    id: 's4',
    name: 'Pedro Santos',
    email: 'pedro@email.com',
    whatsapp: '(11) 96543-2109',
    birthDate: '1992-09-30',
    status: 'ativo',
    createdAt: '2025-03-01',
    assignedWorkoutId: 'w1',
  },
]

export const INITIAL_WORKOUTS: Workout[] = [
  {
    id: 'w1',
    name: 'Hipertrofia — Membros Superiores',
    description: 'Foco em peito, costas e ombros',
    isTemplate: true,
    createdAt: '2025-01-05',
    exercises: [
      { id: 'e1', name: 'Supino reto', sets: 4, reps: '10-12', rest: '90s' },
      { id: 'e2', name: 'Remada curvada', sets: 4, reps: '10-12', rest: '90s' },
      { id: 'e3', name: 'Desenvolvimento militar', sets: 3, reps: '12', rest: '60s' },
      { id: 'e4', name: 'Crucifixo', sets: 3, reps: '15', rest: '60s' },
    ],
  },
  {
    id: 'w2',
    name: 'Força — Membros Inferiores',
    description: 'Agachamento e levantamento terra',
    isTemplate: true,
    createdAt: '2025-01-08',
    exercises: [
      { id: 'e5', name: 'Agachamento livre', sets: 5, reps: '5', rest: '120s' },
      { id: 'e6', name: 'Levantamento terra', sets: 4, reps: '6', rest: '120s' },
      { id: 'e7', name: 'Leg press', sets: 4, reps: '12', rest: '90s' },
      { id: 'e8', name: 'Cadeira extensora', sets: 3, reps: '15', rest: '60s' },
    ],
  },
  {
    id: 'w3',
    name: 'Full Body Iniciante',
    description: 'Treino completo para adaptação',
    isTemplate: true,
    createdAt: '2025-02-01',
    exercises: [
      { id: 'e9', name: 'Esteira', sets: 1, reps: '15 min', rest: '-' },
      { id: 'e10', name: 'Leg press', sets: 3, reps: '12', rest: '60s' },
      { id: 'e11', name: 'Puxada frontal', sets: 3, reps: '12', rest: '60s' },
    ],
  },
]

export const INITIAL_EVOLUTION: EvolutionRecord[] = [
  { id: 'ev1', studentId: 's1', date: '2025-01-15', weight: 62, bodyFat: 24, waist: 72, hip: 98 },
  { id: 'ev2', studentId: 's1', date: '2025-02-15', weight: 61, bodyFat: 22, waist: 70, hip: 97 },
  { id: 'ev3', studentId: 's1', date: '2025-03-15', weight: 60, bodyFat: 20, waist: 68, hip: 96 },
  { id: 'ev4', studentId: 's1', date: '2025-04-15', weight: 59.5, bodyFat: 19, waist: 67, hip: 95 },
  { id: 'ev5', studentId: 's2', date: '2025-02-10', weight: 85, bodyFat: 18, waist: 82, hip: 100 },
  { id: 'ev6', studentId: 's2', date: '2025-03-10', weight: 84, bodyFat: 17, waist: 81, hip: 99 },
  { id: 'ev7', studentId: 's2', date: '2025-04-10', weight: 83, bodyFat: 16, waist: 80, hip: 98 },
]

export const INITIAL_CHECKINS: CheckIn[] = [
  { id: 'c1', studentId: 's1', date: '2025-05-20', time: '07:15' },
  { id: 'c2', studentId: 's1', date: '2025-05-22', time: '18:30' },
  { id: 'c3', studentId: 's1', date: '2025-05-24', time: '07:00' },
  { id: 'c4', studentId: 's2', date: '2025-05-21', time: '19:00' },
  { id: 'c5', studentId: 's2', date: '2025-05-23', time: '18:45' },
]

export const INITIAL_SCHEDULE: ScheduleEvent[] = [
  {
    id: 'sch1',
    title: 'Musculação — Ana',
    date: '2025-05-26',
    startTime: '07:00',
    endTime: '08:00',
    studentIds: ['s1'],
    professionalId: 'u1',
  },
  {
    id: 'sch2',
    title: 'Musculação — Bruno',
    date: '2025-05-26',
    startTime: '19:00',
    endTime: '20:00',
    studentIds: ['s2'],
    professionalId: 'u1',
  },
  {
    id: 'sch3',
    title: 'Avaliação física — Pedro',
    date: '2025-05-27',
    startTime: '10:00',
    endTime: '11:00',
    studentIds: ['s4'],
    professionalId: 'u1',
  },
  {
    id: 'sch4',
    title: 'Musculação — Ana',
    date: '2025-05-28',
    startTime: '07:00',
    endTime: '08:00',
    studentIds: ['s1'],
    professionalId: 'u1',
  },
]

export const INITIAL_NOTIFICATIONS: Notification[] = [
  {
    id: 'n1',
    userId: 'u2',
    title: 'Novo treino disponível',
    message: 'Seu treino de hipertrofia foi atualizado pelo profissional.',
    read: false,
    createdAt: '2025-05-24T10:00:00',
  },
  {
    id: 'n2',
    userId: 'u2',
    title: 'Lembrete de aula',
    message: 'Você tem aula amanhã às 07:00.',
    read: false,
    createdAt: '2025-05-25T08:00:00',
  },
  {
    id: 'n3',
    userId: 'u1',
    title: 'Check-in registrado',
    message: 'Ana Silva realizou check-in hoje às 07:00.',
    read: true,
    createdAt: '2025-05-24T07:05:00',
  },
]

export const INITIAL_HISTORY: WorkoutHistory[] = [
  { id: 'h1', studentId: 's1', workoutName: 'Hipertrofia — Membros Superiores', completedAt: '2025-05-20' },
  { id: 'h2', studentId: 's1', workoutName: 'Hipertrofia — Membros Superiores', completedAt: '2025-05-22' },
  { id: 'h3', studentId: 's2', workoutName: 'Força — Membros Inferiores', completedAt: '2025-05-21' },
]
