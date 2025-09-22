import { View, Text } from 'react-native'
import React, { useEffect, useState } from 'react'
import { useLocalSearchParams } from 'expo-router'
import { Exercise } from '@/app/constants/types'
import { supabase } from '@/app/services/superbasse'


const ExerciseDetails = () => {
  const { id } = useLocalSearchParams<{ id: string }>() // ← Correct way to get params
  const [exercise, setExercise] = useState<Exercise | null>(null)
  const [loading, setLoading] = useState(true)

  console.log("Exercise ID:", id) // This should now show the correct ID

  useEffect(() => {
    if (id) {
      fetchExerciseDetails()
    }
  }, [id])

  const fetchExerciseDetails = async () => {
    try {
      setLoading(true)
      console.log('🔍 Fetching exercise details for ID:', id)
      
      const { data, error } = await supabase
        .from('exercises')
        .select('*')
        .eq('id', id)
        .single()

      if (error) {
        console.error('❌ Error fetching exercise:', error)
        return
      }

      console.log('✅ Exercise details:', data)
      setExercise(data)
    } catch (error) {
      console.error('❌ Unexpected error:', error)
    } finally {
      setLoading(false)
    }
  }
  const getMuscleGroupEmoji = (muscleGroup: string) => {
    switch (muscleGroup.toLowerCase()) {
      case 'chest':
        return '💪'
      case 'back':
        return '🏋️'
      case 'legs':
        return '🦵'
      case 'shoulders':
        return '💪'
      case 'arms':
        return '💪'
      case 'core':
        return '🔥'
      case 'cardio':
        return '❤️'
      default:
        return '🏃'
    }
  }


  if (loading) {
    return (
      <View className="flex-1 justify-center items-center">
        <Text className="text-lg">Loading exercise details...</Text>
      </View>
    )
  }

  if (!exercise) {
    return (
      <View className="flex-1 justify-center items-center">
        <Text className="text-lg text-red-600">Exercise not found</Text>
        <Text className="text-gray-600 mt-2">ID: {id}</Text>
      </View>
    )
  }

  return (
    <View className="flex-1 p-4">
      <Text className="text-2xl font-bold mb-2">{exercise.name}</Text>
      <View className='flex-row items-center mb-4'>
        <Text className="text-lg mr-2">
          {getMuscleGroupEmoji(exercise.muscle_group)}
        </Text>
        <Text className="text-lg text-gray-600 mb-4">{exercise.muscle_group}</Text>
      </View>

      <Text className="text-base">{exercise.instructions}</Text>
      <Text className="text-sm text-gray-500 mt-4">Difficulty: {exercise.difficulty}</Text>
    </View>
  )
}

export default ExerciseDetails