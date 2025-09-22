import React, { useState, useEffect } from "react";
import { 
  Text, 
  View, 
  FlatList, 
  TouchableOpacity, 
  RefreshControl,
  Alert
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useAuth } from "@clerk/clerk-expo";
import { Ionicons } from "@expo/vector-icons";
import { fetchUserWorkouts, getWorkoutStats } from "@/app/services/workout.service";
import { Workout } from "@/app/constants/types";

export default function HistoryPage() {
  const { userId, isLoaded } = useAuth();
  const [workouts, setWorkouts] = useState<Workout[]>([]);
  const [stats, setStats] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  useEffect(() => {
    if (isLoaded && userId) {
      loadWorkoutHistory();
    }
  }, [isLoaded, userId]);

  const loadWorkoutHistory = async () => {
    try {
      setLoading(true);
      const [workoutData, statsData] = await Promise.all([
        fetchUserWorkouts(userId),
        getWorkoutStats(userId)
      ]);
      setWorkouts(workoutData);
      setStats(statsData);
    } catch (error) {
      console.error('Failed to load workout history:', error);
      Alert.alert('Error', 'Failed to load workout history');
    } finally {
      setLoading(false);
    }
  };

  const onRefresh = async () => {
    setRefreshing(true);
    await loadWorkoutHistory();
    setRefreshing(false);
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      weekday: 'short',
      month: 'short',
      day: 'numeric',
      year: 'numeric'
    });
  };

  const getWorkoutTypeIcon = (exercises: any[]) => {
    if (!exercises || exercises.length === 0) return 'fitness-outline';
    
    const exerciseNames = exercises.map(ex => ex.name?.toLowerCase() || '').join(' ');
    
    if (exerciseNames.includes('run') || exerciseNames.includes('cardio')) {
      return 'heart-outline';
    } else if (exerciseNames.includes('squat') || exerciseNames.includes('deadlift')) {
      return 'barbell-outline';
    } else if (exerciseNames.includes('push') || exerciseNames.includes('bench')) {
      return 'body-outline';
    }
    return 'fitness-outline';
  };

  const WorkoutCard = ({ item }: { item: Workout }) => (
    <TouchableOpacity 
      className="bg-white mx-4 mb-3 p-4 rounded-xl shadow-sm border border-gray-100"
      activeOpacity={0.7}
    >
      {/* Header */}
      <View className="flex-row justify-between items-start mb-3">
        <View className="flex-1">
          <Text className="text-lg font-bold text-gray-900 mb-1">
            {formatDate(item.workout_date)}
          </Text>
          <Text className="text-sm text-gray-500">
            {item.exercises?.length || 0} exercises • {item.duration} min
          </Text>
        </View>
        <View className="bg-blue-50 p-2 rounded-full">
          <Ionicons 
            name={getWorkoutTypeIcon(item.exercises) as any} 
            size={24} 
            color="#3B82F6" 
          />
        </View>
      </View>

      {/* Exercise List */}
      <View className="mb-3">
        {item.exercises?.slice(0, 3).map((exercise: any, index: number) => (
          <View key={index} className="flex-row items-center mb-1">
            <View className="w-2 h-2 bg-blue-500 rounded-full mr-3" />
            <Text className="text-sm text-gray-700 flex-1" numberOfLines={1}>
              {exercise.name}
            </Text>
            {exercise.sets && (
              <Text className="text-xs text-gray-500">
                {exercise.sets} sets
              </Text>
            )}
          </View>
        ))}
        {(item.exercises?.length || 0) > 3 && (
          <Text className="text-xs text-gray-500 ml-5">
            +{(item.exercises?.length || 0) - 3} more exercises
          </Text>
        )}
      </View>

      {/* Stats */}
      <View className="flex-row justify-between pt-3 border-t border-gray-100">
        <View className="items-center">
          <Text className="text-lg font-bold text-blue-600">{item.total_sets}</Text>
          <Text className="text-xs text-gray-500">Sets</Text>
        </View>
        <View className="items-center">
          <Text className="text-lg font-bold text-green-600">{item.total_reps}</Text>
          <Text className="text-xs text-gray-500">Reps</Text>
        </View>
        <View className="items-center">
          <Text className="text-lg font-bold text-purple-600">{item.duration}</Text>
          <Text className="text-xs text-gray-500">Min</Text>
        </View>
        <View className="items-center">
          <Text className="text-lg font-bold text-orange-600">
            {Math.round((item.total_reps || 0) / (item.duration || 1))}
          </Text>
          <Text className="text-xs text-gray-500">Rep/Min</Text>
        </View>
      </View>
    </TouchableOpacity>
  );

  const StatsHeader = () => (
    <View className="bg-white mx-4 mb-4 p-6 rounded-xl shadow-sm border border-gray-100">
      <Text className="text-xl font-bold text-gray-900 mb-4">📊 Your Stats</Text>
      
      {stats ? (
        <View className="flex-row justify-between">
          <View className="items-center">
            <Text className="text-2xl font-bold text-blue-600">{stats.totalWorkouts}</Text>
            <Text className="text-sm text-gray-500">Workouts</Text>
          </View>
          <View className="items-center">
            <Text className="text-2xl font-bold text-green-600">{stats.totalSets}</Text>
            <Text className="text-sm text-gray-500">Total Sets</Text>
          </View>
          <View className="items-center">
            <Text className="text-2xl font-bold text-purple-600">{stats.totalReps}</Text>
            <Text className="text-sm text-gray-500">Total Reps</Text>
          </View>
          <View className="items-center">
            <Text className="text-2xl font-bold text-orange-600">
              {Math.round(stats.totalMinutes / 60)}h
            </Text>
            <Text className="text-sm text-gray-500">Total Time</Text>
          </View>
        </View>
      ) : (
        <Text className="text-center text-gray-500">Loading stats...</Text>
      )}
    </View>
  );

  const EmptyState = () => (
    <View className="bg-white mx-4 p-8 rounded-xl items-center">
      <Ionicons name="barbell-outline" size={64} color="#9CA3AF" />
      <Text className="text-xl font-semibold text-gray-900 mt-4 text-center">
        No Workouts Yet
      </Text>
      <Text className="text-center text-gray-600 mt-2">
        Start your fitness journey by completing your first workout!
      </Text>
      <TouchableOpacity className="bg-blue-500 px-6 py-3 rounded-lg mt-4">
        <Text className="text-white font-semibold">Start Working Out</Text>
      </TouchableOpacity>
    </View>
  );

  if (!isLoaded || loading) {
    return (
      <SafeAreaView className="flex-1 bg-gray-50">
        <View className="flex-1 justify-center items-center">
          <Ionicons name="fitness-outline" size={48} color="#9CA3AF" />
          <Text className="text-lg text-gray-600 mt-4">Loading workout history...</Text>
        </View>
      </SafeAreaView>
    );
  }

  if (!userId) {
    return (
      <SafeAreaView className="flex-1 bg-gray-50">
        <View className="flex-1 justify-center items-center px-8">
          <Ionicons name="person-outline" size={48} color="#9CA3AF" />
          <Text className="text-xl font-semibold text-gray-900 mt-4 text-center">
            Sign In Required
          </Text>
          <Text className="text-center text-gray-600 mt-2">
            Please sign in to view your workout history
          </Text>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView className="flex-1 bg-gray-50">
      {/* Header */}
      <View className="px-4 py-2 bg-white border-b border-gray-100">
        <Text className="text-2xl font-bold text-gray-900">🏋️ Workout History</Text>
        <Text className="text-sm text-gray-600">
          Track your fitness journey and progress
        </Text>
      </View>

      <FlatList
        data={workouts}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => <WorkoutCard item={item} />}
        ListHeaderComponent={workouts.length > 0 ? StatsHeader : undefined}
        ListEmptyComponent={EmptyState}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={onRefresh}
            colors={["#3B82F6"]}
            tintColor="#3B82F6"
            title="Pull to refresh"
            titleColor="#6B7280"
          />
        }
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ 
          paddingVertical: 16,
          flexGrow: 1 
        }}
      />
    </SafeAreaView>
  );
}
