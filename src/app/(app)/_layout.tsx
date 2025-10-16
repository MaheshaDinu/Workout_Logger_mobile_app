import React from 'react'
import { Stack } from 'expo-router'
import { useAuth } from '@clerk/clerk-expo'
import { ActivityIndicator } from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context'
import { NavigationContainer } from '@react-navigation/native'

const Layout = () => {
     const { isLoaded, isSignedIn, userId, sessionId, getToken } = useAuth()

     console.log("isSignedIn",isSignedIn," userId: ",userId)

     if (!isLoaded) {
        <SafeAreaView className='flex-1 justify-center items-center'>
            <ActivityIndicator size="large" color="#0000ff" />
        </SafeAreaView>
     }
  return (
      
          <Stack>
              <Stack.Protected guard={isSignedIn}>
                  <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
                  <Stack.Screen name='exercise-details' options={{ headerShown: false, title: 'Exercise Details' , presentation: "modal", gestureEnabled: true, animationTypeForReplace:"push"}} />
              </Stack.Protected>

              <Stack.Protected guard={!isSignedIn}>
                  <Stack.Screen name="sign-in" options={{ headerShown: false, title: 'Sign In' }} />
                  <Stack.Screen name="sign-up" options={{ headerShown: false, title: 'Sign Up' }} />
              </Stack.Protected>
          </Stack>
      
    
  )
}

export default Layout