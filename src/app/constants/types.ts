export  interface Exercise {
  id: string
  name: string
  muscle_group: string
  instructions: string
  difficulty: string
  created_at?: string
}

export  interface Workout {
  id: string
  clerk_user_id: string
  exercises: any[]
  duration: number
  total_sets: number
  total_reps: number
  workout_date: string
  created_at: string
}