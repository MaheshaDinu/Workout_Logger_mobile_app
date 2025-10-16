import { View, Text, ImageSourcePropType, Image, TouchableOpacity, ScrollView, ActivityIndicator } from 'react-native'
import React, { useEffect, useState } from 'react'
import { useLocalSearchParams, useRouter } from 'expo-router'
import { Exercise } from '@/app/constants/types'
import { supabase } from '@/app/services/superbasse'
import { SafeAreaView } from 'react-native-safe-area-context'
import { Ionicons } from '@expo/vector-icons';


const ExerciseDetails = () => {
  const { id } = useLocalSearchParams<{ id: string }>()
  const [exercise, setExercise] = useState<Exercise | null>(null)
  const [loading, setLoading] = useState(true)
  const router = useRouter()

  useEffect(() => {
    if (id) {
      fetchExerciseDetails()
    }
  }, [id])

  const fetchExerciseDetails = async () => {
    try {
      setLoading(true)
      const { data, error } = await supabase
        .from('exercises')
        .select('*')
        .eq('id', id)
        .single()

      if (error) {
        console.error('❌ Error fetching exercise:', error)
        return
      }
      setExercise(data)
    } catch (error) {
      console.error('❌ Unexpected error:', error)
    } finally {
      setLoading(false)
    }
  }
  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty.toLowerCase()) {
      case 'beginner':
        return 'text-green-600 bg-green-100'
      case 'intermediate':
        return 'text-yellow-600 bg-yellow-100'
      case 'advanced':
        return 'text-red-600 bg-red-100'
      default:
        return 'text-gray-600 bg-gray-100'
    }
  }
  
  const MUSCLE_GROUP_ICONS: { [key:string]: ImageSourcePropType } = {
    chest: require('../../../assets/muscle_groups/chest.png'),
    back: require('../../../assets/muscle_groups/back.png'),
    legs: require('../../../assets/muscle_groups/legs.png'),
    shoulders: require('../../../assets/muscle_groups/shoulders.png'),
    arms: require('../../../assets/muscle_groups/arms.png'),
    core: require('../../../assets/muscle_groups/abs.png'),
    cardio: require('../../../assets/muscle_groups/cardio.png'),
  };
  const getMuscleGroupIconSource = (muscleGroup: string) => {
    const iconName = muscleGroup.toLowerCase();
    return MUSCLE_GROUP_ICONS[iconName] || MUSCLE_GROUP_ICONS.cardio;
  };

  if (loading) {
    return (
      // ✨ Styled loading state
      <View className="flex-1 justify-center items-center bg-slate-50">
        <ActivityIndicator size="large" color="#475569" />
        <Text className="text-lg text-slate-500 mt-3">Loading Exercise...</Text>
      </View>
    )
  }

  if (!exercise) {
    return (
      // ✨ Styled error state
      <SafeAreaView className="flex-1 justify-center items-center p-6 bg-slate-50">
        <Text className="text-xl font-bold text-red-500 text-center">Exercise Not Found</Text>
        <Text className="text-slate-500 mt-2 text-center">Could not find details for the requested exercise.</Text>
        <TouchableOpacity onPress={() => router.back()} className='mt-8 bg-slate-600 px-6 py-3 rounded-lg'>
          <Text className='text-white font-semibold'>Go Back</Text>
        </TouchableOpacity>
      </SafeAreaView>
    )
  }

  return (
    // ✨ Use a light background for the entire screen
    <SafeAreaView className="flex-1 bg-slate-50">
      <ScrollView>
        {/* ✨ Close button is styled and positioned more cleanly */}
        <View className='w-full items-end px-4 pt-4'>
            <TouchableOpacity onPress={() => router.back()} className='w-10 h-10 rounded-full bg-gray-200 justify-center items-center'>
                <Ionicons name="close" size={24} color="#475569" />
            </TouchableOpacity>
        </View>

        <View className="px-6 pb-8">
            {/* ✨ Title with improved typography for hierarchy */}
            <Text className="text-3xl font-extrabold text-slate-800 mb-2 tracking-tight">
                {exercise.name}
            </Text>

            {/* ✨ Muscle group styled as a "pill" or "chip" for a modern look */}
            <View className='flex-row items-center bg-slate-200 self-start rounded-full px-3 py-1.5 mb-6'>
                <Image source={getMuscleGroupIconSource(exercise.muscle_group)} className="w-6 h-6 mr-2" />
                <Text className="text-base font-semibold text-slate-700 capitalize">
                    {exercise.muscle_group}
                </Text>
            </View>

            {/* ✨ Instructions section with a clear header and improved readability */}
            <View className="mb-6">
                <Text className="text-xl font-bold text-slate-700 mb-2">
                    Instructions
                </Text>
                <Text className="text-base text-slate-600 leading-relaxed">
                    {exercise.instructions}
                </Text>
            </View>

            {/* ✨ A subtle divider line to separate content */}
            <View className="border-b border-gray-200 my-4" />
            
            {/* ✨ Details are laid out cleanly */}
            <View className="flex-row justify-between items-center">
                <Text className="text-base font-medium text-slate-500">
                    Difficulty
                </Text>
                <Text className={`text-base font-bold capitalize ${getDifficultyColor(exercise.difficulty)} px-3 py-1 rounded-full`}>
                    {exercise.difficulty}
                </Text>
            </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  )
}

export default ExerciseDetails