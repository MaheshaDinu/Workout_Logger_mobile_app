import { useSignIn } from '@clerk/clerk-expo'
import { Link, useRouter } from 'expo-router'
import { Text, TextInput, TouchableOpacity, View, KeyboardAvoidingView, Platform, Image } from 'react-native'
import React, { useState } from 'react'
import { SafeAreaView } from 'react-native-safe-area-context'
import Ionicons from '@expo/vector-icons/Ionicons';
import { LinearGradient } from 'expo-linear-gradient';
import GoogleSignIn from '../components/GoogleSignIn'


export default function Page() {
    const { signIn, setActive, isLoaded } = useSignIn()
    const router = useRouter()

    const [emailAddress, setEmailAddress] = useState('')
    const [password, setPassword] = useState('')
    const [isLoding, setIsLoading] = useState<boolean>(false);

    // Handle the submission of the sign-in form
    const onSignInPress = async () => {
        if (!isLoaded) return

        // Start the sign-in process using the email and password provided
        try {
            const signInAttempt = await signIn.create({
                identifier: emailAddress,
                password,
            })

            // If sign-in process is complete, set the created session as active
            // and redirect the user
            if (signInAttempt.status === 'complete') {
                await setActive({ session: signInAttempt.createdSessionId })
                router.replace('/')
            } else {
                // If the status isn't complete, check why. User might need to
                // complete further steps.
                console.error(JSON.stringify(signInAttempt, null, 2))
            }
        } catch (err) {
            // See https://clerk.com/docs/custom-flows/error-handling
            // for more info on error handling
            console.error(JSON.stringify(err, null, 2))
        }
    }

    return (
        <SafeAreaView className='flex-1'>
            <KeyboardAvoidingView behavior={Platform.OS === "ios" ? "padding" : "height"} className='flex-1 '>
                <View className='flex-1 px-6'>
                    {/* Header section */}
                    <View className='flex-1 justify-center'>
                        <View className='items-center mb-8 px-4'>
                            <LinearGradient
                                className='w-40 h-40 justify-center items-center mt-6'
                                colors={['#D1FAE5', '#34D399', '#065F46']} // Light green to teal to dark green gradient
                                style={{ borderRadius: 100, padding: 15, }}
                                start={{ x: 0, y: 0 }} // Top-left
                                end={{ x: 1, y: 1 }} // Bottom-right
                            >
                                <Image
                                    source={require('../../../assets/Logo.png')} // Adjust the path
                                    className='mt-10 '
                                    style={{ width: 275, height: 275, marginTop: 50 }}
                                    resizeMode="contain"
                                />
                            </LinearGradient>
                            <Text className='text-3xl font-bold text-gray-900 mt-4 mb-2'>Workout Logger</Text>
                            <Text className='text-lg text-center text-gray-600 max-w-md'>Track your workouts, crush your goals, and stay motivated!</Text>
                        </View>
                    </View>
                    {/* body section */}
                    <View className='bg-white rounded-2xl p-3 shadow-sm border border-gray-200 mb-6  items-center'>
                        <Text className='text-3xl font-bold text-blue-900'>Welcome Back</Text>

                        <View className='mb-4 px-4 space-y-6 mt-6 w-full'>
                            <Text className='text-sm font-medium text-gray-700 mb-2 '>Email</Text>
                            <View className='flex-row items-center bg-gray-50 rounded-xl'>
                                <Ionicons name="mail-outline" size={20} color="#9CA3AF" className='ml-3' />
                                <TextInput
                                    autoCapitalize="none"
                                    value={emailAddress}
                                    placeholder="Enter your email"
                                    placeholderTextColor={"#9CA3AF"}
                                    className='flex-1 ml-3 text-gray-900'
                                    onChangeText={setEmailAddress}
                                    editable={!isLoding}
                                />
                            </View>
                        </View>


                        <View className='mb-4 px-4 space-y-4 w-full'>
                            <Text className='text-sm font-medium text-gray-700 mb-2 ml-1'>Password</Text>
                            <View className='flex-row items-center bg-gray-50 rounded-xl'>
                                <Ionicons name="lock-closed-outline" size={20} color="#9CA3AF" className='ml-3' />
                                <TextInput
                                    autoCapitalize="none"
                                    value={password}
                                    placeholder="Enter your password"
                                    placeholderTextColor={"#9CA3AF"}
                                    secureTextEntry={true}
                                    className='flex-1 ml-3 text-gray-900'
                                    onChangeText={setPassword}
                                    editable={!isLoding}
                                />
                            </View>
                        </View>
                        <TouchableOpacity onPress={onSignInPress}
                            disabled={isLoding}
                            className={`mx-4 w-full rounded-xl py-3 shadow-sm ${isLoding ? ' bg-gray-600' : `bg-blue-700`}`} activeOpacity={0.8} >
                            <View className='flex-row justify-center items-center '>
                                {isLoding ? (
                                    <Ionicons name="refresh" size={24} color="white" className='text-center' />
                                ) : (
                                    <Ionicons name="log-in-outline" size={24} color="white" className='text-center' />
                                )}
                                <Text className='text-center text-lg text-white font-semibold'>{isLoding ? ' Loading...' : ' Sign In'}</Text>
                            </View>
                        </TouchableOpacity>

                        <View className='flex-row items-center my-4'>
                            <View className='flex-1 h-px bg-gray-200 mx-4' />
                            <Text className='px-4 text-sm text-gray-500'>or</Text>
                            <View className='flex-1 h-px bg-gray-200 mx-4' />
                        </View>

                        <GoogleSignIn />


                        <View className='flex-row justify-center mt-6 '>
                            <Text className='text-gray-700'>New to Workout Logger? </Text>
                            <Link href="/sign-up">
                                <Text className='text-blue-700 font-semibold'>Create an account</Text>
                            </Link>
                        </View>
                    </View>



                    {/* {footer} */}
                    <View className='pb-6 mt-6'>
                        <Text className='text-center text-sm text-gray-500'>Start your fitness journey with us</Text>
                    </View>

                </View>
            </KeyboardAvoidingView>

        </SafeAreaView>
    )
}