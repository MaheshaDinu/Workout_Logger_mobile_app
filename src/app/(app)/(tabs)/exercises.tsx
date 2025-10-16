import { View, Text, TextInput, TouchableOpacity, FlatList, RefreshControl, Alert, Modal } from 'react-native'
import React, { useEffect, useState, useRef } from 'react'
import { SafeAreaView } from 'react-native-safe-area-context'
import Ionicons from '@expo/vector-icons/Ionicons'
import { useRouter } from 'expo-router'
import ExerciseCard from '@/app/components/ExerciseCard'
import { Exercise } from '@/app/constants/types'
import { fetchAllExercises, addExercise, updateExercise, deleteExercise } from '@/app/services/exercise.service'

const difficulties = ['Beginner', 'Intermediate', 'Advanced'];
const muscleGroups = ['Chest', 'Back', 'Legs', 'Shoulders', 'Arms', 'Core', 'Cardio'];

const Excersices = () => {
  const [searchQuery, setSearchQuery] = useState('')
  const [exercises, setExercises] = useState<Exercise[]>([])
  const [filteredExercises, setFilteredExercises] = useState<Exercise[]>([])
  const router = useRouter()
  const [refreshing, setRefreshing] = useState(false)
  const [isFormModalVisible, setIsFormModalVisible] = useState(false)
  const [isDifficultyPickerVisible, setIsDifficultyPickerVisible] = useState(false);
  const [isMuscleGroupPickerVisible, setIsMuscleGroupPickerVisible] = useState(false);
  const [selectedExercise, setSelectedExercise] = useState<Exercise | null>(null)
  
  // Use a ref to track if the component is mounted
  const isMounted = useRef(false);

  const loadExercises = async (): Promise<void> => {
    const fetchedExercises = await fetchAllExercises();
    // Only update state if the component is still mounted
    if (isMounted.current) {
      setExercises(fetchedExercises);
      setFilteredExercises(fetchedExercises);
    }
  };

  useEffect(() => {
    isMounted.current = true; // Set to true when component mounts
    loadExercises()
    
    // Cleanup function to set isMounted to false when component unmounts
    return () => {
      isMounted.current = false;
    };
  }, [])

  useEffect(() => {
    const filtered = exercises.filter((exercise: Exercise) =>
      exercise.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      exercise.muscle_group.toLowerCase().includes(searchQuery.toLowerCase())
    )
    setFilteredExercises(filtered)
  }, [searchQuery, exercises])

  const onRefresh = async () => {
    setRefreshing(true)
    await loadExercises()
    setRefreshing(false)
  }

  const handleAddOrEditExercise = (exercise: Exercise | null = null) => {
    setSelectedExercise(exercise)
    setIsFormModalVisible(true)
  }

  const handleDeleteExercise = async (id: string) => {
    Alert.alert(
      "Confirm Deletion",
      "Are you sure you want to delete this exercise? This action cannot be undone.",
      [
        {
          text: "Cancel",
          style: "cancel"
        },
        {
          text: "Delete",
          style: "destructive",
          onPress: async () => {
            const success = await deleteExercise(id);
            if (success) {
              loadExercises();
            } else {
              Alert.alert("Error", "Failed to delete exercise. Please try again.");
            }
          }
        }
      ]
    );
  };

  const handleSaveForm = async (exerciseData: Omit<Exercise, 'id' | 'created_at'>) => {
    if (selectedExercise && selectedExercise.id) {
      // Edit existing exercise
      const updatedExercise = await updateExercise(selectedExercise.id, exerciseData);
      if (updatedExercise) {
        Alert.alert("Success", "Exercise updated successfully.");
        loadExercises();
      } else {
        Alert.alert("Error", "Failed to update exercise.");
      }
    } else {
      // Add new exercise
      const newExercise = await addExercise(exerciseData);
      if (newExercise) {
        Alert.alert("Success", "Exercise added successfully.");
        loadExercises();
      } else {
        Alert.alert("Error", "Failed to add exercise.");
      }
    }
    setIsFormModalVisible(false);
  }

  const renderItem = ({ item }: { item: Exercise }) => (
    <View className='flex-row items-center justify-between'>
      <View className='flex-1'>
        <ExerciseCard
          item={item}
          onPress={() => router.push(`/exercise-details?id=${item.id}`)}
          showChevron={true}
        />
      </View>
      <View className='flex-row items-center ml-2'>
        <TouchableOpacity
          onPress={() => handleAddOrEditExercise(item)}
          className='p-2'
        >
          <Ionicons name='pencil-outline' size={24} color='#3B82F6' />
        </TouchableOpacity>
        <TouchableOpacity
          onPress={() => handleDeleteExercise(item.id)}
          className='p-2'
        >
          <Ionicons name='trash-outline' size={24} color='#EF4444' />
        </TouchableOpacity>
      </View>
    </View>
  )

  return (
    <SafeAreaView className='flex-1 bg-gray-50'>
      <View className='px-6 py-4 bg-white border-b border-gray-200'>
        <Text className='text-2xl font-bold text-gray-900'>Exercises Library</Text>
        <Text className='text-gray-600 mt-1'>Browse and manage exercises in your library</Text>

        {/* Search Bar */}
        <View className='flex-row items-center bg-gray-100 rounded-xl px-4 py-3 mt-4'>
          <Ionicons name='search' size={20} color='#9CA3AF' />
          <TextInput
            className='flex-1 ml-3 text-gray-800'
            placeholder='Search Exercises...'
            placeholderTextColor={'#9CA3AF'}
            value={searchQuery}
            onChangeText={setSearchQuery}
          />
          {searchQuery.length > 0 && (
            <TouchableOpacity onPress={() => setSearchQuery("")}>
              <Ionicons name='close-circle' size={20} color='#9CA3AF' />
            </TouchableOpacity>
          )}
        </View>
      </View>
      
      {/* Add New Exercise Button */}
      <View className='px-6 py-4'>
        <TouchableOpacity
          onPress={() => handleAddOrEditExercise(null)}
          className='flex-row items-center justify-center bg-blue-500 rounded-xl py-3'
        >
          <Ionicons name='add-circle-outline' size={24} color='white' />
          <Text className='ml-2 text-white font-semibold'>Add New Exercise</Text>
        </TouchableOpacity>
      </View>

      {/* Exercises List */}
      <FlatList
        data={searchQuery ? filteredExercises : exercises}
        keyExtractor={(item) => item.id}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingHorizontal: 24, paddingBottom: 24 }}
        renderItem={renderItem}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={onRefresh}
            colors={["#3B82F6"]}
            tintColor="#3B82F6"
            title='Pull to refresh'
            titleColor="#6B7280"
          />
        }
        ListEmptyComponent={
          <View className='bg-white rounded-2xl p-8 items-center'>
            <Ionicons name='fitness-outline' size={40} color='#3B82F6' />
            <Text className='text-xl font-semibold text-gray-900 mt-4'>
              {searchQuery ? "No Exercises Found" : "Loading Exercises..."}
            </Text>
            <Text className='text-center text-gray-600 mt-2'>
              {searchQuery ? "Try a different search term" : "Please wait a moment while we load the exercises for you"}
            </Text>
          </View>
        }
      />

      {/* Add/Edit Exercise Modal */}
      <Modal
        visible={isFormModalVisible}
        onRequestClose={() => setIsFormModalVisible(false)}
        animationType="slide"
        transparent={true}
      >
        <View className='flex-1 justify-end items-center bg-black/50'>
          <View className='bg-white rounded-t-2xl p-6 w-full'>
            <View className='flex-row justify-between items-center mb-4'>
              <Text className='text-2xl font-bold'>{selectedExercise ? 'Edit Exercise' : 'Add New Exercise'}</Text>
              <TouchableOpacity onPress={() => setIsFormModalVisible(false)}>
                <Ionicons name='close-outline' size={32} color='#9CA3AF' />
              </TouchableOpacity>
            </View>
            
            <TextInput
              className='bg-gray-100 rounded-lg p-4 mb-3 text-gray-800'
              placeholder='Exercise Name'
              value={selectedExercise?.name}
              onChangeText={(text) => setSelectedExercise(prev => prev ? { ...prev, name: text } : { id: '', name: text, muscle_group: '', instructions: '', difficulty: '' })}
            />
            {/* Muscle Group Dropdown */}
            <TouchableOpacity
                className='bg-gray-100 rounded-lg p-4 mb-3 flex-row justify-between items-center'
                onPress={() => setIsMuscleGroupPickerVisible(true)}
            >
                <Text className='text-gray-800'>{selectedExercise?.muscle_group || 'Select Muscle Group'}</Text>
                <Ionicons name='chevron-down' size={20} color='#9CA3AF' />
            </TouchableOpacity>
            {/* Difficulty Dropdown */}
            <TouchableOpacity
                className='bg-gray-100 rounded-lg p-4 mb-3 flex-row justify-between items-center'
                onPress={() => setIsDifficultyPickerVisible(true)}
            >
                <Text className='text-gray-800'>{selectedExercise?.difficulty || 'Select Difficulty'}</Text>
                <Ionicons name='chevron-down' size={20} color='#9CA3AF' />
            </TouchableOpacity>
            <TextInput
              className='bg-gray-100 rounded-lg p-4 h-32 mb-4 text-gray-800'
              placeholder='Instructions'
              multiline
              textAlignVertical='top'
              value={selectedExercise?.instructions}
              onChangeText={(text) => setSelectedExercise(prev => prev ? { ...prev, instructions: text } : { id: '', name: '', muscle_group: '', instructions: text, difficulty: '' })}
            />

            <TouchableOpacity
              onPress={() => handleSaveForm(selectedExercise as Omit<Exercise, 'id' | 'created_at'>)}
              className='bg-blue-500 rounded-lg py-4 items-center mb-2'
            >
              <Text className='text-white font-bold text-lg'>{selectedExercise ? 'Save Changes' : 'Add Exercise'}</Text>
            </TouchableOpacity>
            
            {selectedExercise && (
              <TouchableOpacity
                onPress={() => handleDeleteExercise(selectedExercise.id)}
                className='bg-red-500 rounded-lg py-4 items-center'
              >
                <Text className='text-white font-bold text-lg'>Delete Exercise</Text>
              </TouchableOpacity>
            )}

          </View>
        </View>
      </Modal>

      {/* Difficulty Picker Modal */}
      <Modal
          visible={isDifficultyPickerVisible}
          onRequestClose={() => setIsDifficultyPickerVisible(false)}
          animationType="fade"
          transparent={true}
      >
          <View className='flex-1 justify-center items-center bg-black/50'>
              <View className='bg-white rounded-xl p-4 w-3/4'>
                  <Text className='text-lg font-bold mb-4'>Select Difficulty</Text>
                  <FlatList
                      data={difficulties}
                      keyExtractor={(item) => item}
                      renderItem={({ item }) => (
                          <TouchableOpacity
                              className='p-3 border-b border-gray-200'
                              onPress={() => {
                                  setSelectedExercise(prev => prev ? { ...prev, difficulty: item } : { id: '', name: '', muscle_group: '', instructions: '', difficulty: item });
                                  setIsDifficultyPickerVisible(false);
                              }}
                          >
                              <Text>{item}</Text>
                          </TouchableOpacity>
                      )}
                  />
                  <TouchableOpacity 
                      onPress={() => setIsDifficultyPickerVisible(false)}
                      className='mt-4 p-3 items-center bg-gray-200 rounded-lg'
                  >
                      <Text>Cancel</Text>
                  </TouchableOpacity>
              </View>
          </View>
      </Modal>

      {/* Muscle Group Picker Modal */}
      <Modal
          visible={isMuscleGroupPickerVisible}
          onRequestClose={() => setIsMuscleGroupPickerVisible(false)}
          animationType="fade"
          transparent={true}
      >
          <View className='flex-1 justify-center items-center bg-black/50'>
              <View className='bg-white rounded-xl p-4 w-3/4'>
                  <Text className='text-lg font-bold mb-4'>Select Muscle Group</Text>
                  <FlatList
                      data={muscleGroups}
                      keyExtractor={(item) => item}
                      renderItem={({ item }) => (
                          <TouchableOpacity
                              className='p-3 border-b border-gray-200'
                              onPress={() => {
                                  setSelectedExercise(prev => prev ? { ...prev, muscle_group: item } : { id: '', name: '', muscle_group: item, instructions: '', difficulty: '' });
                                  setIsMuscleGroupPickerVisible(false);
                              }}
                          >
                              <Text>{item}</Text>
                          </TouchableOpacity>
                      )}
                  />
                  <TouchableOpacity 
                      onPress={() => setIsMuscleGroupPickerVisible(false)}
                      className='mt-4 p-3 items-center bg-gray-200 rounded-lg'
                  >
                      <Text>Cancel</Text>
                  </TouchableOpacity>
              </View>
          </View>
      </Modal>

    </SafeAreaView>
  )
}

export default Excersices
