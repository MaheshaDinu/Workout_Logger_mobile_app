import React, { useState, useCallback  } from "react";
import { Text, View, TouchableOpacity, ScrollView, ActivityIndicator, Image } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Link, useRouter, useFocusEffect } from "expo-router";
import { useUser } from "@clerk/clerk-expo";
import Ionicons from "@expo/vector-icons/Ionicons";
import { getWorkoutStats, getWorkoutAchievements, WorkoutStats, fetchUserWorkouts, fetchRecentWorkouts } from "@/app/services/workout.service";
import { Workout } from "@/app/constants/types";

// Component to display a single workout stat
const StatCard = ({ label, value, icon }: { label: string; value: string; icon: keyof typeof Ionicons.glyphMap }) => (
  <View className="flex-1 bg-white p-4 rounded-xl shadow-sm items-center m-1 border border-gray-100">
    <Ionicons name={icon} size={24} color="#3B82F6" />
    <Text className="text-2xl font-bold text-gray-800 mt-2">{value}</Text>
    <Text className="text-gray-500 text-sm mt-1">{label}</Text>
  </View>
);
// Component to display a single recent workout
const RecentWorkoutCard = ({ workout }: { workout: Workout }) => (
  <View className="bg-white p-4 rounded-xl shadow-sm border border-gray-100 mb-3">
    <Text className="text-lg font-bold text-gray-900 mb-1">Workout on {new Date(workout.workout_date).toLocaleDateString()}</Text>
    <View className="flex-row items-center mb-1">
      <Ionicons name="barbell-outline" size={16} color="#6B7280" />
      <Text className="text-sm text-gray-600 ml-2">{workout.total_sets} Sets</Text>
    </View>
    <View className="flex-row items-center">
      <Ionicons name="time-outline" size={16} color="#6B7280" />
      <Text className="text-sm text-gray-600 ml-2">{workout.duration} minutes</Text>
    </View>
  </View>
);

export default function Page() {
  const { user } = useUser();
  const router = useRouter();

  const [stats, setStats] = useState<WorkoutStats | null>(null);
  const [achievements, setAchievements] = useState<{ currentStreak: number } | null>(null);
  const [recentWorkouts, setRecentWorkouts] = useState<Workout[]>([]);
  const [loading, setLoading] = useState(true);

  useFocusEffect(
    useCallback(() => {
      const fetchData = async () => {
        if (!user?.id) return;
        setLoading(true);
        try {
          const [statsData, achievementsData, recentWorkoutsData] = await Promise.all([
            getWorkoutStats(user.id),
            getWorkoutAchievements(user.id),
            fetchRecentWorkouts(user.id),
          ]);
          setStats(statsData);
          setAchievements(achievementsData);
          setRecentWorkouts(recentWorkoutsData);
        } catch (error) {
          console.error("Failed to fetch data:", error);
        } finally {
          setLoading(false);
        }
      };

      fetchData();
    }, [user?.id])
  );
FragmentDirective                                            
  return (
    <SafeAreaView className="flex flex-1 bg-gray-50">
      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingBottom: 24 }}>
        {/* Header Section */}
        <View className="px-6 py-4 flex-row justify-between items-center bg-white border-b border-gray-200">
          <View className="flex-row items-center">
            {user?.imageUrl ? (
              <Image source={{ uri: user.imageUrl }} className="w-12 h-12 rounded-full mr-3" />
            ) : (
              <View className="w-12 h-12 rounded-full bg-gray-200 items-center justify-center mr-3">
                <Ionicons name="person-outline" size={30} color="#6B7280" />
              </View>
            )}
            <View>
              <Text className="text-gray-500 text-base">Welcome back,</Text>
              <Text className="text-xl font-bold text-gray-900">{user?.firstName}</Text>
            </View>
          </View>
          <Link href="/profile" asChild>
            <TouchableOpacity className="p-3">
              <Ionicons name="settings-outline" size={24} color="#4B5563" />
            </TouchableOpacity>
          </Link>
        </View>

        {/* Main Content */}
        <View className="p-6">
          <Text className="text-2xl font-bold text-gray-900 mb-4">Your Progress</Text>
          
          {loading ? (
            <View className="items-center justify-center p-8">
              <ActivityIndicator size="large" color="#3B82F6" />
              <Text className="mt-4 text-gray-500">Loading your stats...</Text>
            </View>
          ) : (
            <View className="flex-row flex-wrap justify-between -m-1 mb-6">
              <StatCard label="Workouts" value={stats?.totalWorkouts.toString() || "0"} icon="trophy-outline" />
              <StatCard label="Minutes" value={stats?.totalMinutes.toString() || "0"} icon="time-outline" />
              <StatCard label="Sets" value={stats?.totalSets.toString() || "0"} icon="barbell-outline" />
              <StatCard label="Streak" value={achievements?.currentStreak.toString() || "0"} icon="flame-outline" />
            </View>
          )}

          {/* Start New Workout Button */}
          <TouchableOpacity
            className="bg-blue-500 rounded-xl p-4 shadow-md items-center"
            activeOpacity={0.8}
            onPress={() => router.push('/workout')}
          >
            <Ionicons name="add-circle-outline" size={32} color="white" />
            <Text className="text-white font-bold text-xl mt-2">Start a New Workout</Text>
          </TouchableOpacity>
        </View>
        {/* Recent Workouts Section */}
          <View className="mt-8">
            <Text className="text-2xl font-bold text-gray-900 mb-4">Recent Workouts</Text>
            {recentWorkouts.length > 0 ? (
              recentWorkouts.map(workout => (
                <RecentWorkoutCard key={workout.id} workout={workout} />
              ))
            ) : (
              <View className="bg-white p-6 rounded-xl shadow-sm items-center">
                <Ionicons name="calendar-outline" size={40} color="#9CA3AF" />
                <Text className="mt-4 text-center text-gray-600">No recent workouts found. Tap "Start a New Workout" to get started!</Text>
              </View>
            )}
          </View>
      </ScrollView>
    </SafeAreaView>
  );
}
