import { View, Text } from 'react-native'
import React from 'react'
import { Tabs } from 'expo-router'
import MaterialCommunityIcons from '@expo/vector-icons/MaterialCommunityIcons';

const Layout = () => {
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
                <MaterialCommunityIcons name="account" color={color} size={size} />
            )
        }} />
    </Tabs>
  )
}

export default Layout