import React, { useState, useEffect, useRef } from 'react';
import {
  View,
  Text,
  SafeAreaView,
  TouchableOpacity,
  FlatList,
  Modal,
  TextInput,
  Alert,
  ScrollView,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useAuth } from '@clerk/clerk-expo';
import {
  fetchAllExercises,
  saveWorkout,
  updateExistingWorkout,
  deleteExistingWorkout,
} from '@/app/services/workout.service';
import { Exercise, Workout as WorkoutType } from '@/app/constants/types';
import { useNavigation } from '@react-navigation/native';

interface WorkoutExercise {
  id: string;
  name: string;
  reps?: number[];
  sets: number;
  notes?: string;
  duration?: string;
  restTime?: string;
}

const WorkoutPage = () => {
  const navigation = useNavigation();
  const { userId, isLoaded } = useAuth();
  const [currentWorkout, setCurrentWorkout] = useState<WorkoutExercise[]>([]);
  const [allExercises, setAllExercises] = useState<Exercise[]>([]);
  const [isAddModalVisible, setIsAddModalVisible] = useState(false);
  const [isEditModalVisible, setIsEditModalVisible] = useState(false);
  const [selectedExercise, setSelectedExercise] = useState<WorkoutExercise | null>(null);
  const [loading, setLoading] = useState(false);
  const [timer, setTimer] = useState(0);
  const timerRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    if (isLoaded && userId) {
      loadAllExercises();
      startWorkoutTimer();
    }
    return () => stopWorkoutTimer();
  }, [isLoaded, userId]);

  const startWorkoutTimer = () => {
    timerRef.current = setInterval(() => {
      setTimer(prevTimer => prevTimer + 1);
    }, 1000);
  };

  const stopWorkoutTimer = () => {
    if (timerRef.current) {
      clearInterval(timerRef.current);
    }
  };

  const loadAllExercises = async () => {
    setLoading(true);
    const exercises = await fetchAllExercises();
    setAllExercises(exercises);
    setLoading(false);
  };

  const addExerciseToWorkout = (exercise: Exercise) => {
    setIsAddModalVisible(false);
    const newWorkoutExercise: WorkoutExercise = {
      id: exercise.id,
      name: exercise.name,
      sets: 3,
      reps: [10, 10, 10],
      restTime: '60s',
    };
    setCurrentWorkout(prev => [...prev, newWorkoutExercise]);
  };

  const handleEditPress = (exercise: WorkoutExercise) => {
    setSelectedExercise(exercise);
    setIsEditModalVisible(true);
  };

  const saveEditedExercise = (editedData: WorkoutExercise) => {
    const updatedWorkout = currentWorkout.map(ex =>
      ex.id === editedData.id ? editedData : ex
    );
    setCurrentWorkout(updatedWorkout);
    setIsEditModalVisible(false);
    setSelectedExercise(null);
  };

  const deleteExerciseFromWorkout = () => {
    if (!selectedExercise) return;
    Alert.alert(
      "Confirm Delete",
      `Are you sure you want to remove ${selectedExercise.name} from your workout?`,
      [
        { text: "Cancel", style: "cancel" },
        {
          text: "Delete",
          style: "destructive",
          onPress: () => {
            const updatedWorkout = currentWorkout.filter(ex => ex.id !== selectedExercise.id);
            setCurrentWorkout(updatedWorkout);
            setIsEditModalVisible(false);
            setSelectedExercise(null);
          },
        },
      ]
    );
  };

  const calculateWorkoutStats = () => {
    let totalSets = 0;
    let totalReps = 0;
    currentWorkout.forEach(exercise => {
      totalSets += exercise.sets || 0;
      totalReps += exercise.reps?.reduce((sum, current) => sum + current, 0) || 0;
    });
    return { totalSets, totalReps, duration: Math.floor(timer / 60) };
  };

  const handleSaveWorkout = async () => {
    if (currentWorkout.length === 0) {
      Alert.alert("Cannot Save", "Add at least one exercise to save the workout.");
      return;
    }
    setLoading(true);
    stopWorkoutTimer();
    try {
      const stats = calculateWorkoutStats();
      const workoutData = {
        exercises: currentWorkout,
        duration: stats.duration,
        totalSets: stats.totalSets,
        totalReps: stats.totalReps,
        date: new Date().toISOString().split('T')[0],
      };
      await saveWorkout(workoutData, userId);
      Alert.alert("Success", "Workout saved successfully!");
      setCurrentWorkout([]);
      setTimer(0);
      startWorkoutTimer();
      navigation.goBack();
    } catch (error) {
      console.error('Failed to save workout:', error);
      Alert.alert("Error", "Failed to save workout. Please try again.");
      startWorkoutTimer(); // Restart timer on failure
    } finally {
      setLoading(false);
    }
  };

  const formatTimer = (seconds: number) => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes}:${remainingSeconds < 10 ? '0' : ''}${remainingSeconds}`;
  };

  const renderWorkoutItem = ({ item }: { item: WorkoutExercise }) => (
    <TouchableOpacity
      onPress={() => handleEditPress(item)}
      className="bg-white mx-4 mb-3 p-4 rounded-xl shadow-sm border border-gray-100"
    >
      <View className="flex-row justify-between items-center">
        <View className="flex-1">
          <Text className="text-lg font-bold text-gray-900">{item.name}</Text>
          <Text className="text-sm text-gray-500">
            {item.sets} sets • {item.reps?.join('-')} reps
          </Text>
        </View>
        <Ionicons name="create-outline" size={24} color="#6B7280" />
      </View>
    </TouchableOpacity>
  );

  return (
    <SafeAreaView className="flex-1 bg-gray-50">
      <View className="flex-1">
        {/* Header and Timer */}
        <View className="px-4 py-2 bg-white border-b border-gray-100 flex-row justify-between items-center">
          <View>
            <Text className="text-2xl font-bold text-gray-900">Current Workout</Text>
            <Text className="text-sm text-gray-600">Track your progress in real-time</Text>
          </View>
          <View className="bg-blue-500 rounded-full px-4 py-2">
            <Text className="text-white font-bold">{formatTimer(timer)}</Text>
          </View>
        </View>

        {/* Workout List */}
        {currentWorkout.length === 0 ? (
          <View className="flex-1 justify-center items-center">
            <Ionicons name="barbell-outline" size={64} color="#9CA3AF" />
            <Text className="text-xl font-semibold text-gray-900 mt-4 text-center">
              Start your workout
            </Text>
            <Text className="text-center text-gray-600 mt-2">
              Tap the button below to add your first exercise
            </Text>
          </View>
        ) : (
          <FlatList
            data={currentWorkout}
            renderItem={renderWorkoutItem}
            keyExtractor={(item) => item.id}
            contentContainerStyle={{ paddingVertical: 16 }}
          />
        )}

        {/* Action Buttons */}
        <View className="p-4 bg-white border-t border-gray-100 flex-row justify-between items-center">
          <TouchableOpacity
            className="flex-1 bg-blue-500 px-6 py-3 rounded-lg mr-2"
            onPress={() => setIsAddModalVisible(true)}
          >
            <Text className="text-white font-semibold text-center">Add Exercise</Text>
          </TouchableOpacity>
          <TouchableOpacity
            className={`flex-1 px-6 py-3 rounded-lg ml-2 ${currentWorkout.length === 0 ? 'bg-gray-300' : 'bg-green-500'}`}
            onPress={handleSaveWorkout}
            disabled={currentWorkout.length === 0 || loading}
          >
            <Text className="text-white font-semibold text-center">
              {loading ? 'Saving...' : 'Save Workout'}
            </Text>
          </TouchableOpacity>
        </View>
      </View>

      {/* Add Exercise Modal */}
      <Modal
        visible={isAddModalVisible}
        animationType="slide"
        onRequestClose={() => setIsAddModalVisible(false)}
      >
        <SafeAreaView className="flex-1 bg-gray-50">
          <View className="flex-row items-center justify-between p-4 bg-white border-b border-gray-100">
            <TouchableOpacity onPress={() => setIsAddModalVisible(false)}>
              <Ionicons name="close-outline" size={32} color="#4B5563" />
            </TouchableOpacity>
            <Text className="text-xl font-bold text-gray-900">Add Exercise</Text>
            <View className="w-8" />
          </View>
          <FlatList
            data={allExercises}
            keyExtractor={(item) => item.id}
            renderItem={({ item }) => (
              <TouchableOpacity
                onPress={() => addExerciseToWorkout(item)}
                className="bg-white mx-4 my-2 p-4 rounded-xl shadow-sm border border-gray-100"
              >
                <Text className="text-lg font-bold text-gray-900">{item.name}</Text>
                <Text className="text-sm text-gray-500">{item.muscle_group}</Text>
              </TouchableOpacity>
            )}
            contentContainerStyle={{ paddingVertical: 16 }}
            ListEmptyComponent={() => (
              <View className="flex-1 justify-center items-center p-8">
                <Text className="text-gray-500">Loading exercises...</Text>
              </View>
            )}
          />
        </SafeAreaView>
      </Modal>

      {/* Edit Exercise Modal */}
      <Modal
        visible={isEditModalVisible}
        animationType="slide"
        onRequestClose={() => setIsEditModalVisible(false)}
      >
        <SafeAreaView className="flex-1 bg-gray-50">
          <View className="flex-row items-center justify-between p-4 bg-white border-b border-gray-100">
            <TouchableOpacity onPress={() => setIsEditModalVisible(false)}>
              <Ionicons name="close-outline" size={32} color="#4B5563" />
            </TouchableOpacity>
            <Text className="text-xl font-bold text-gray-900">Edit Exercise</Text>
            <TouchableOpacity onPress={deleteExerciseFromWorkout}>
              <Ionicons name="trash-outline" size={24} color="#EF4444" />
            </TouchableOpacity>
          </View>
          {selectedExercise && (
            <ScrollView className="p-4">
              <Text className="text-2xl font-bold text-gray-900 mb-4">{selectedExercise.name}</Text>
              <View className="mb-4">
                <Text className="text-sm text-gray-600 mb-1">Sets</Text>
                <TextInput
                  className="bg-white p-3 rounded-lg border border-gray-300"
                  keyboardType="numeric"
                  placeholder="e.g., 3"
                  value={selectedExercise.sets?.toString()}
                  onChangeText={(text) =>
                    setSelectedExercise({
                      ...selectedExercise,
                      sets: parseInt(text) || 0,
                    })
                  }
                />
              </View>
              <View className="mb-4">
                <Text className="text-sm text-gray-600 mb-1">Reps (separated by commas)</Text>
                <TextInput
                  className="bg-white p-3 rounded-lg border border-gray-300"
                  placeholder="e.g., 12,10,8"
                  value={selectedExercise.reps?.join(',')}
                  onChangeText={(text) =>
                    setSelectedExercise({
                      ...selectedExercise,
                      reps: text.split(',').map(rep => parseInt(rep.trim()) || 0),
                    })
                  }
                />
              </View>
              <View className="mb-4">
                <Text className="text-sm text-gray-600 mb-1">Notes</Text>
                <TextInput
                  className="bg-white p-3 rounded-lg border border-gray-300"
                  placeholder="e.g., Good form maintained"
                  value={selectedExercise.notes}
                  onChangeText={(text) =>
                    setSelectedExercise({ ...selectedExercise, notes: text })
                  }
                />
              </View>
              <View className="mb-4">
                <Text className="text-sm text-gray-600 mb-1">Rest Time</Text>
                <TextInput
                  className="bg-white p-3 rounded-lg border border-gray-300"
                  placeholder="e.g., 60s"
                  value={selectedExercise.restTime}
                  onChangeText={(text) =>
                    setSelectedExercise({ ...selectedExercise, restTime: text })
                  }
                />
              </View>
              <TouchableOpacity
                className="bg-blue-500 px-6 py-3 rounded-lg"
                onPress={() => saveEditedExercise(selectedExercise)}
              >
                <Text className="text-white font-semibold text-center">Save Changes</Text>
              </TouchableOpacity>
            </ScrollView>
          )}
        </SafeAreaView>
      </Modal>
    </SafeAreaView>
  );
};

export default WorkoutPage;