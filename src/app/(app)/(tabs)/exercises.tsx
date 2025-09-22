import { View, Text, TextInput, TouchableOpacity, FlatList, RefreshControl } from 'react-native'
import React, { useEffect, useState } from 'react'
import { SafeAreaView } from 'react-native-safe-area-context'
import Ionicons from '@expo/vector-icons/Ionicons'
import { useRouter } from 'expo-router'
import ExerciseCard from '@/app/components/ExerciseCard'
import { Exercise } from '@/app/constants/types'
import { supabase } from '@/app/services/superbasse'


const Excersices = () => {
  const [searchQuery, setSearchQuery] = useState('')
  const [excersices, setExcersices] = useState<Exercise[]>([])
  const [filteredExcersices, setFilteredExcersices] = useState<Exercise[]>([])
  const router = useRouter()
  const [refreshing, setRefreshing] = useState(false)

  const fetchExcersices = async ():Promise<Exercise[]> => {
    // Fetch excersices from supabase
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
    const exercisesList = data || []
    setExcersices(data || [])
    setFilteredExcersices(data || [])
    return exercisesList
  } catch (error) {
    console.error('❌ Unexpected error:', error)
    return []
  }

  }

  useEffect(() =>{
    fetchExcersices()
  },[])

  useEffect(() => {
    const filtered = excersices.filter((excersice: Exercise) => 
      excersice.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      excersice.muscle_group.toLowerCase().includes(searchQuery.toLowerCase()) 
  )
  setFilteredExcersices(filtered)
  }, [searchQuery, excersices])

  const onRefresh = async() => {
    setRefreshing(true)
    await fetchExcersices().then(() => setRefreshing(false))
  }

  return (
    <SafeAreaView className='flex-1 bg-gray-50 '>
      <View className='px-6 py-4 bg-white border-b border-gray-200'>
        <Text className='text-2xl font-bold text-gray-900'>Excersices Library</Text>
        <Text className='text-gray-600 mt-1'>Browse and select excersices to add to your workout</Text>

        {/* Search Bar */}
        <View className='flex-row items-center bg-gray-100 rounded-xl px-4 py-3 mt-4'>
          <Ionicons name='search' size={20} color='#9CA3AF' />
          <TextInput
          className='flex-1 ml-3 text-gray-800'
          placeholder='Search Excersices...'
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
    {/* Excersices List */}
    <FlatList
  data={searchQuery ? filteredExcersices : excersices}
  keyExtractor={(item) => item.id}
  showsVerticalScrollIndicator={false}
  contentContainerStyle={{padding: 24}}
  renderItem={({item}) => (
    <ExerciseCard 
      item={item}
      onPress={() => router.push(`/exercise-details?id=${item.id}`)} // ← Removed the extra $
      showChevron={true}
    />
  )}
  refreshControl={
    <RefreshControl
      refreshing={refreshing}
      onRefresh={onRefresh}
      colors={["#3B82F6"]}
      tintColor="#3B82F6"
      title='pull to refresh'
      titleColor="#6B7280"
    />
  }
  ListEmptyComponent={
    <View className='bg-white rounded-2xl p-8 items-center'>
      <Ionicons name='fitness-outline' size={40} color='#3B82F6'/>
      <Text className='text-xl font-semibold text-gray-900 mt-4'>
        {searchQuery ? "No Excersices Found" : "Loading Excersices..."}
      </Text>
      <Text className='text-center text-gray-600 mt-2'>
        {searchQuery ? "Try a different search term" : "Please wait a moment while we load the excersices for you"}
      </Text>
    </View>
  }
/>
      
    </SafeAreaView>
  )
}

export default Excersices