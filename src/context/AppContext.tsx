import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from 'react'
import {
  DEMO_USERS,
  INITIAL_CHECKINS,
  INITIAL_EVOLUTION,
  INITIAL_HISTORY,
  INITIAL_NOTIFICATIONS,
  INITIAL_SCHEDULE,
  INITIAL_STUDENTS,
  INITIAL_WORKOUTS,
} from '../data/mockData'
import { load, save } from '../services/storage'
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

interface AppState {
  students: Student[]
  workouts: Workout[]
  evolution: EvolutionRecord[]
  checkins: CheckIn[]
  schedule: ScheduleEvent[]
  notifications: Notification[]
  history: WorkoutHistory[]
}

interface AppContextValue extends AppState {
  currentUser: User | null
  login: (email: string, password: string) => boolean
  logout: () => void
  updateProfile: (data: Partial<User>) => void
  addStudent: (student: Omit<Student, 'id' | 'createdAt'>) => Student
  updateStudent: (id: string, data: Partial<Student>) => void
  deleteStudent: (id: string) => void
  addWorkout: (workout: Omit<Workout, 'id' | 'createdAt'>) => Workout
  updateWorkout: (id: string, data: Partial<Workout>) => void
  deleteWorkout: (id: string) => void
  assignWorkout: (studentId: string, workoutId: string) => void
  addEvolution: (record: Omit<EvolutionRecord, 'id'>) => void
  addCheckIn: (studentId: string) => { ok: boolean; message: string }
  addSchedule: (event: Omit<ScheduleEvent, 'id'>) => void
  updateSchedule: (id: string, data: Partial<ScheduleEvent>) => void
  deleteSchedule: (id: string) => void
  markNotificationRead: (id: string) => void
  sendNotification: (userId: string, title: string, message: string) => void
  addHistory: (entry: Omit<WorkoutHistory, 'id'>) => void
  toast: string | null
  showToast: (msg: string) => void
  clearToast: () => void
}

const AppContext = createContext<AppContextValue | null>(null)

function initState(): AppState {
  return {
    students: load('students', INITIAL_STUDENTS),
    workouts: load('workouts', INITIAL_WORKOUTS),
    evolution: load('evolution', INITIAL_EVOLUTION),
    checkins: load('checkins', INITIAL_CHECKINS),
    schedule: load('schedule', INITIAL_SCHEDULE),
    notifications: load('notifications', INITIAL_NOTIFICATIONS),
    history: load('history', INITIAL_HISTORY),
  }
}

export function AppProvider({ children }: { children: ReactNode }) {
  const [state, setState] = useState<AppState>(initState)
  const [currentUser, setCurrentUser] = useState<User | null>(() =>
    load<User | null>('currentUser', null)
  )
  const [toast, setToast] = useState<string | null>(null)

  useEffect(() => {
    save('students', state.students)
    save('workouts', state.workouts)
    save('evolution', state.evolution)
    save('checkins', state.checkins)
    save('schedule', state.schedule)
    save('notifications', state.notifications)
    save('history', state.history)
  }, [state])

  useEffect(() => {
    save('currentUser', currentUser)
  }, [currentUser])

  const showToast = useCallback((msg: string) => {
    setToast(msg)
    setTimeout(() => setToast(null), 3500)
  }, [])

  const clearToast = useCallback(() => setToast(null), [])

  const login = useCallback((email: string, _password: string) => {
    const user = DEMO_USERS.find((u) => u.email.toLowerCase() === email.toLowerCase())
    if (user) {
      setCurrentUser(user)
      return true
    }
    return false
  }, [])

  const logout = useCallback(() => setCurrentUser(null), [])

  const updateProfile = useCallback(
    (data: Partial<User>) => {
      if (!currentUser) return
      const updated = { ...currentUser, ...data }
      setCurrentUser(updated)
      if (currentUser.studentId) {
        setState((s) => ({
          ...s,
          students: s.students.map((st) =>
            st.id === currentUser.studentId
              ? {
                  ...st,
                  name: data.name ?? st.name,
                  email: data.email ?? st.email,
                  whatsapp: data.phone ?? st.whatsapp,
                  birthDate: data.birthDate ?? st.birthDate,
                }
              : st
          ),
        }))
      }
    },
    [currentUser]
  )

  const addStudent = useCallback((data: Omit<Student, 'id' | 'createdAt'>) => {
    const student: Student = {
      ...data,
      id: `s${Date.now()}`,
      createdAt: new Date().toISOString().slice(0, 10),
    }
    setState((s) => ({ ...s, students: [...s.students, student] }))
    return student
  }, [])

  const updateStudent = useCallback((id: string, data: Partial<Student>) => {
    setState((s) => ({
      ...s,
      students: s.students.map((st) => (st.id === id ? { ...st, ...data } : st)),
    }))
  }, [])

  const deleteStudent = useCallback((id: string) => {
    setState((s) => ({ ...s, students: s.students.filter((st) => st.id !== id) }))
  }, [])

  const addWorkout = useCallback((data: Omit<Workout, 'id' | 'createdAt'>) => {
    const workout: Workout = {
      ...data,
      id: `w${Date.now()}`,
      createdAt: new Date().toISOString().slice(0, 10),
    }
    setState((s) => ({ ...s, workouts: [...s.workouts, workout] }))
    return workout
  }, [])

  const updateWorkout = useCallback((id: string, data: Partial<Workout>) => {
    setState((s) => ({
      ...s,
      workouts: s.workouts.map((w) => (w.id === id ? { ...w, ...data } : w)),
    }))
  }, [])

  const deleteWorkout = useCallback((id: string) => {
    setState((s) => ({ ...s, workouts: s.workouts.filter((w) => w.id !== id) }))
  }, [])

  const assignWorkout = useCallback((studentId: string, workoutId: string) => {
    setState((s) => ({
      ...s,
      students: s.students.map((st) =>
        st.id === studentId ? { ...st, assignedWorkoutId: workoutId } : st
      ),
    }))
  }, [])

  const addEvolution = useCallback((record: Omit<EvolutionRecord, 'id'>) => {
    const entry: EvolutionRecord = { ...record, id: `ev${Date.now()}` }
    setState((s) => ({ ...s, evolution: [...s.evolution, entry] }))
  }, [])

  const addCheckIn = useCallback(
    (studentId: string) => {
      const today = new Date().toISOString().slice(0, 10)
      const now = new Date().toTimeString().slice(0, 5)
      const existing = state.checkins.find(
        (c) => c.studentId === studentId && c.date === today
      )
      if (existing) {
        return { ok: false, message: 'Você já realizou check-in hoje.' }
      }
      const checkin: CheckIn = {
        id: `c${Date.now()}`,
        studentId,
        date: today,
        time: now,
      }
      setState((s) => ({ ...s, checkins: [...s.checkins, checkin] }))
      return { ok: true, message: `Check-in registrado às ${now}` }
    },
    [state.checkins]
  )

  const addSchedule = useCallback((event: Omit<ScheduleEvent, 'id'>) => {
    const entry: ScheduleEvent = { ...event, id: `sch${Date.now()}` }
    setState((s) => ({ ...s, schedule: [...s.schedule, entry] }))
  }, [])

  const updateSchedule = useCallback((id: string, data: Partial<ScheduleEvent>) => {
    setState((s) => ({
      ...s,
      schedule: s.schedule.map((e) => (e.id === id ? { ...e, ...data } : e)),
    }))
  }, [])

  const deleteSchedule = useCallback((id: string) => {
    setState((s) => ({ ...s, schedule: s.schedule.filter((e) => e.id !== id) }))
  }, [])

  const markNotificationRead = useCallback((id: string) => {
    setState((s) => ({
      ...s,
      notifications: s.notifications.map((n) =>
        n.id === id ? { ...n, read: true } : n
      ),
    }))
  }, [])

  const sendNotification = useCallback(
    (userId: string, title: string, message: string) => {
      const n: Notification = {
        id: `n${Date.now()}`,
        userId,
        title,
        message,
        read: false,
        createdAt: new Date().toISOString(),
      }
      setState((s) => ({ ...s, notifications: [n, ...s.notifications] }))
    },
    []
  )

  const addHistory = useCallback((entry: Omit<WorkoutHistory, 'id'>) => {
    const h: WorkoutHistory = { ...entry, id: `h${Date.now()}` }
    setState((s) => ({ ...s, history: [h, ...s.history] }))
  }, [])

  const value = useMemo<AppContextValue>(
    () => ({
      ...state,
      currentUser,
      login,
      logout,
      updateProfile,
      addStudent,
      updateStudent,
      deleteStudent,
      addWorkout,
      updateWorkout,
      deleteWorkout,
      assignWorkout,
      addEvolution,
      addCheckIn,
      addSchedule,
      updateSchedule,
      deleteSchedule,
      markNotificationRead,
      sendNotification,
      addHistory,
      toast,
      showToast,
      clearToast,
    }),
    [
      state,
      currentUser,
      login,
      logout,
      updateProfile,
      addStudent,
      updateStudent,
      deleteStudent,
      addWorkout,
      updateWorkout,
      deleteWorkout,
      assignWorkout,
      addEvolution,
      addCheckIn,
      addSchedule,
      updateSchedule,
      deleteSchedule,
      markNotificationRead,
      sendNotification,
      addHistory,
      toast,
      showToast,
      clearToast,
    ]
  )

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>
}

export function useApp() {
  const ctx = useContext(AppContext)
  if (!ctx) throw new Error('useApp must be used within AppProvider')
  return ctx
}
