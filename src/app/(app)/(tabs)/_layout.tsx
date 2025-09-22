import { View, Text, Image } from 'react-native'
import React from 'react'
import { Tabs } from 'expo-router'
import MaterialCommunityIcons from '@expo/vector-icons/MaterialCommunityIcons';
import { useUser } from '@clerk/clerk-expo';

const Layout = () => {
    const {user} = useUser();
  return (
    <Tabs>
        <Tabs.Screen name="index" options={{headerShown: false, title: 'Home',
            tabBarIcon:({color, size}) => (
                <MaterialCommunityIcons name="home" color={color} size={size} />
            )
        }} />
        <Tabs.Screen name="exercises" options={{headerShown: false, title: 'Exercises',
            tabBarIcon:({color, size}) => (
                <MaterialCommunityIcons name="book" color={color} size={size} />
            )
        }} />
        <Tabs.Screen name='workout' options={{headerShown: false, title: 'workout',
            tabBarIcon:({color, size}) => (
                <MaterialCommunityIcons name="dumbbell" color={color} size={size} />
            )
        }} />
        <Tabs.Screen name='progress' options={{headerShown: false, title: 'Progress',
            tabBarIcon:({color, size}) => (
                <MaterialCommunityIcons name="progress-check" color={color} size={size} />
            ),
            href: null
        }} />
        <Tabs.Screen name="history" options={{headerShown: false, title: 'History',
            tabBarIcon:({color, size}) => (
                <MaterialCommunityIcons name="history" color={color} size={size} />
            )
        }} />
        <Tabs.Screen name="profile" options={{headerShown: false, title: 'Profile',
            tabBarIcon:({color, size}) => (
                <Image source={{uri:user?.imageUrl ?? user?.externalAccounts[0]?.imageUrl}} className="w-6 h-6 rounded-full" />
            )
        }} />
    </Tabs>
  )
}

export default Layout