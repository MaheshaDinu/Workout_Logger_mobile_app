import { View, Text, TouchableOpacity, Image, ImageSourcePropType } from 'react-native'
import React from 'react'
import { Exercise } from '../constants/types'



interface ExerciseCardProps {
  item: Exercise
  onPress: () => void
  showChevron?: boolean
}

const ExerciseCard = ({ item, onPress, showChevron = true }: ExerciseCardProps) => {
  // Helper function to get difficulty color
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

  // Helper function to get muscle group emoji
  const MUSCLE_GROUP_ICONS: { [key: string]: ImageSourcePropType } = {
  chest: require('../../../assets/muscle_groups/chest.png'),
  back: require('../../../assets/muscle_groups/back.png'),
  legs: require('../../../assets/muscle_groups/legs.png'),
  shoulders: require('../../../assets/muscle_groups/shoulders.png'),
  arms: require('../../../assets/muscle_groups/arms.png'),
  core: require('../../../assets/muscle_groups/abs.png'),
  cardio: require('../../../assets/muscle_groups/cardio.png'),
};
  const getMuscleGroupiconSource = (muscleGroup: string) => {
    const iconName = muscleGroup.toLowerCase();
    return MUSCLE_GROUP_ICONS[iconName] || MUSCLE_GROUP_ICONS.cardio;
  };

  return (
    <TouchableOpacity
      onPress={onPress}
      className="bg-white rounded-xl p-4 mb-3 mx-4 shadow-sm border border-gray-100"
      activeOpacity={0.7}
    >
      {/* Header Row */}
      <View className="flex-row justify-between items-start mb-3">
        <View className="flex-1 pr-3">
          <Text className="text-lg font-bold text-gray-900 mb-1" numberOfLines={2}>
            {item.name}
          </Text>
          
          {/* Muscle Group */}
          <View className="flex-row items-center mb-2">
            <Image source={getMuscleGroupiconSource(item.muscle_group)} className="w-6 h-6 mr-2" />
            <Text className="text-sm font-medium text-gray-600 capitalize">
              {item.muscle_group}
            </Text>
          </View>
        </View>

        {/* Chevron Icon */}
        {showChevron && (
          <View className="bg-gray-50 rounded-full p-2 ml-2">
            <Text className="text-gray-400 text-lg">›</Text>
          </View>
        )}
      </View>

      {/* Instructions Preview */}
      {item.instructions && (
        <Text className="text-sm text-gray-500 mb-3 leading-5" numberOfLines={2}>
          {item.instructions}
        </Text>
      )}

      {/* Bottom Row */}
      <View className="flex-row justify-between items-center">
        {/* Difficulty Badge */}
        <View className={`px-3 py-1 rounded-full ${getDifficultyColor(item.difficulty)}`}>
          <Text className={`text-xs font-semibold ${getDifficultyColor(item.difficulty).split(' ')[0]}`}>
            {item.difficulty}
          </Text>
        </View>

        {/* Additional Info */}
        <View className="flex-row items-center">
          <View className="w-2 h-2 bg-blue-500 rounded-full mr-2" />
          <Text className="text-xs text-gray-400 uppercase tracking-wide">
            Exercise
          </Text>
        </View>
      </View>

      {/* Subtle Border Bottom */}
      <View className="absolute bottom-0 left-4 right-4 h-px bg-gradient-to-r from-transparent via-gray-200 to-transparent" />
    </TouchableOpacity>
  )
}

export default ExerciseCard