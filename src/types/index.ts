export type UserRole = 'profissional' | 'aluno'
export type StudentStatus = 'ativo' | 'inativo' | 'bloqueado'

export interface User {
  id: string
  name: string
  email: string
  role: UserRole
  phone?: string
  birthDate?: string
  avatar?: string
  studentId?: string
}

export interface Student {
  id: string
  name: string
  email: string
  whatsapp: string
  birthDate: string
  status: StudentStatus
  createdAt: string
  assignedWorkoutId?: string
}

export interface Exercise {
  id: string
  name: string
  sets: number
  reps: string
  rest?: string
  notes?: string
}

export interface Workout {
  id: string
  name: string
  description?: string
  exercises: Exercise[]
  createdAt: string
  isTemplate?: boolean
}

export interface EvolutionRecord {
  id: string
  studentId: string
  date: string
  weight?: number
  height?: number
  bodyFat?: number
  chest?: number
  waist?: number
  hip?: number
  arm?: number
  thigh?: number
  notes?: string
  photoUrl?: string
}

export interface CheckIn {
  id: string
  studentId: string
  date: string
  time: string
}

export interface ScheduleEvent {
  id: string
  title: string
  date: string
  startTime: string
  endTime: string
  studentIds: string[]
  professionalId: string
  notes?: string
}

export interface Notification {
  id: string
  userId: string
  title: string
  message: string
  read: boolean
  createdAt: string
}

export interface WorkoutHistory {
  id: string
  studentId: string
  workoutName: string
  completedAt: string
  duration?: string
}
