import { supabase } from '@/app/services/superbasse'

import { Exercise, Workout } from '@/app/constants/types'

export interface WorkoutStats {
  totalWorkouts: number
  totalSets: number
  totalReps: number
  totalMinutes: number
  averageWorkoutDuration: number
  averageSetsPerWorkout: number
  averageRepsPerWorkout: number
}

// 🏋️ Fetch all exercises
export const fetchAllExercises = async (): Promise<Exercise[]> => {
  try {
    console.log('📋 Fetching exercises from Supabase...')
    
    const { data, error } = await supabase
      .from('exercises')
      .select('*')
      .order('name')
    
    if (error) {
      console.error('❌ Error fetching exercises:', error)
      return []
    }
    
    console.log('✅ Fetched exercises:', data?.length || 0)
    return data || []
  } catch (error) {
    console.error('❌ Unexpected error:', error)
    return []
  }
}

// 💪 Fetch exercises by muscle group
export const fetchExercisesByMuscleGroup = async (muscleGroup: string): Promise<Exercise[]> => {
  try {
    console.log(`🔍 Fetching ${muscleGroup} exercises...`)
    
    const { data, error } = await supabase
      .from('exercises')
      .select('*')
      .eq('muscle_group', muscleGroup)
      .order('name')
    
    if (error) {
      console.error('❌ Error fetching exercises:', error)
      return []
    }
    
    console.log(`✅ Fetched ${data?.length || 0} ${muscleGroup} exercises`)
    return data || []
  } catch (error) {
    console.error('❌ Unexpected error:', error)
    return []
  }
}

// 💾 Save workout to Supabase
export const saveWorkout = async (workoutData: {
  exercises: any[]
  duration: number
  totalSets: number
  totalReps: number
  date: string
}, clerkUserId: string | null) => {
  
    console.log("clerkUserId",clerkUserId)
  if (!clerkUserId) {
    throw new Error('User must be authenticated to save workout')
  }

  try {
    console.log('💾 Saving workout to Supabase...')
    
    const { data, error } = await supabase
      .from('workouts')
      .insert({
        clerk_user_id: clerkUserId,
        exercises: workoutData.exercises,
        duration: workoutData.duration,
        total_sets: workoutData.totalSets,
        total_reps: workoutData.totalReps,
        workout_date: workoutData.date,
      })
      .select()
      .single()
    
    if (error) {
      console.error('❌ Error saving workout:', error)
      throw error
    }
    
    console.log('✅ Workout saved successfully:', data?.id)
    return data
  } catch (error) {
    console.error('❌ Failed to save workout:', error)
    throw error
  }
}

// ✏️ Update an existing workout
export const updateExistingWorkout = async (workoutId: string, workoutData: any) => {
  try {
    console.log(`✏️ Updating workout with ID: ${workoutId}`)
    const { data, error } = await supabase
      .from('workouts')
      .update(workoutData)
      .eq('id', workoutId)
      .select()
      .single();

    if (error) {
      console.error('❌ Error updating workout:', error);
      throw error;
    }
    console.log('✅ Workout updated successfully:', data?.id);
    return data;
  } catch (error) {
    console.error('❌ Failed to update workout:', error);
    throw error;
  }
};

// 🗑️ Delete a workout
export const deleteExistingWorkout = async (workoutId: string) => {
  try {
    console.log(`🗑️ Deleting workout with ID: ${workoutId}`)
    const { error } = await supabase
      .from('workouts')
      .delete()
      .eq('id', workoutId);
      
    if (error) {
      console.error('❌ Error deleting workout:', error);
      throw error;
    }
    console.log('✅ Workout deleted successfully');
  } catch (error) {
    console.error('❌ Failed to delete workout:', error);
    throw error;
  }
};

// 📊 Fetch user's workout history
export const fetchUserWorkouts = async (clerkUserId: string | null): Promise<Workout[]> => {
  if (!clerkUserId) {
    console.log('❌ No user ID provided')
    return []
  }

  try {
    console.log('📊 Fetching user workouts...')
    
    const { data, error } = await supabase
      .from('workouts')
      .select('*')
      .eq('clerk_user_id', clerkUserId)
      .order('created_at', { ascending: false })
    
    if (error) {
      console.error('❌ Error fetching workouts:', error)
      return []
    }
    
    console.log(`✅ Fetched ${data?.length || 0} workouts`)
    return data || []
  } catch (error) {
    console.error('❌ Unexpected error:', error)
    return []
  }
}

// 🆕 Fetch recent workouts
export const fetchRecentWorkouts = async (clerkUserId: string | null): Promise<Workout[]> => {
  if (!clerkUserId) {
    console.log('❌ No user ID provided for recent workouts')
    return []
  }

  try {
    console.log('🆕 Fetching recent workouts...')
    
    const { data, error } = await supabase
      .from('workouts')
      .select('*')
      .eq('clerk_user_id', clerkUserId)
      .order('created_at', { ascending: false })
      .limit(5)
    
    if (error) {
      console.error('❌ Error fetching recent workouts:', error)
      return []
    }
    
    console.log(`✅ Fetched ${data?.length || 0} recent workouts`)
    return data || []
  } catch (error) {
    console.error('❌ Unexpected error:', error)
    return []
  }
}

// 📈 Get comprehensive workout statistics
export const getWorkoutStats = async (clerkUserId: string | null): Promise<WorkoutStats | null> => {
  if (!clerkUserId) {
    console.log('❌ No user ID provided for stats')
    return null
  }

  try {
    console.log('📈 Calculating workout statistics...')
    
    const { data, error } = await supabase
      .from('workouts')
      .select('total_sets, total_reps, duration, workout_date')
      .eq('clerk_user_id', clerkUserId)
    
    if (error || !data) {
      console.error('❌ Error fetching workout stats:', error)
      return null
    }

    if (data.length === 0) {
      return {
        totalWorkouts: 0,
        totalSets: 0,
        totalReps: 0,
        totalMinutes: 0,
        averageWorkoutDuration: 0,
        averageSetsPerWorkout: 0,
        averageRepsPerWorkout: 0
      }
    }
    
    const stats = data.reduce((acc, workout) => ({
      totalWorkouts: acc.totalWorkouts + 1,
      totalSets: acc.totalSets + (workout.total_sets || 0),
      totalReps: acc.totalReps + (workout.total_reps || 0),
      totalMinutes: acc.totalMinutes + (workout.duration || 0),
    }), { 
      totalWorkouts: 0, 
      totalSets: 0, 
      totalReps: 0, 
      totalMinutes: 0 
    })

    // Calculate averages
    const averageWorkoutDuration = Math.round(stats.totalMinutes / stats.totalWorkouts)
    const averageSetsPerWorkout = Math.round(stats.totalSets / stats.totalWorkouts)
    const averageRepsPerWorkout = Math.round(stats.totalReps / stats.totalWorkouts)
    
    const finalStats: WorkoutStats = {
      ...stats,
      averageWorkoutDuration,
      averageSetsPerWorkout,
      averageRepsPerWorkout
    }

    console.log('✅ Workout stats calculated:', finalStats)
    return finalStats
  } catch (error) {
    console.error('❌ Error calculating stats:', error)
    return null
  }
}

// 🗓️ Get workouts by date range
export const getWorkoutsByDateRange = async (
  clerkUserId: string | null,
  startDate: string,
  endDate: string
): Promise<Workout[]> => {
  if (!clerkUserId) return []

  try {
    const { data, error } = await supabase
      .from('workouts')
      .select('*')
      .eq('clerk_user_id', clerkUserId)
      .gte('workout_date', startDate)
      .lte('workout_date', endDate)
      .order('workout_date', { ascending: false })

    if (error) {
      console.error('❌ Error fetching workouts by date:', error)
      return []
    }

    return data || []
  } catch (error) {
    console.error('❌ Unexpected error:', error)
    return []
  }
}

// 🏆 Get workout streaks and achievements
export const getWorkoutAchievements = async (clerkUserId: string | null) => {
  if (!clerkUserId) return null

  try {
    const { data, error } = await supabase
      .from('workouts')
      .select('workout_date')
      .eq('clerk_user_id', clerkUserId)
      .order('workout_date', { ascending: false })

    if (error || !data) return null

    // Calculate current streak
    const dates = data.map(w => w.workout_date).sort()
    let currentStreak = 0
    let maxStreak = 0
    let tempStreak = 1

    for (let i = 1; i < dates.length; i++) {
      const prevDate = new Date(dates[i - 1])
      const currDate = new Date(dates[i])
      const diffDays = Math.abs((currDate.getTime() - prevDate.getTime()) / (1000 * 3600 * 24))

      if (diffDays <= 1) {
        tempStreak++
      } else {
        maxStreak = Math.max(maxStreak, tempStreak)
        tempStreak = 1
      }
    }

    maxStreak = Math.max(maxStreak, tempStreak)

    // Check if last workout was yesterday or today
    if (dates.length > 0) {
      const lastWorkout = new Date(dates[dates.length - 1])
      const today = new Date()
      const diffDays = Math.abs((today.getTime() - lastWorkout.getTime()) / (1000 * 3600 * 24))
      currentStreak = diffDays <= 1 ? tempStreak : 0
    }

    return {
      currentStreak,
      maxStreak,
      totalWorkoutDays: dates.length,
      lastWorkoutDate: dates[dates.length - 1]
    }
  } catch (error) {
    console.error('❌ Error calculating achievements:', error)
    return null
  }
}
