import * as React from 'react';
  import { Text, TextInput, TouchableOpacity, View, KeyboardAvoidingView, Platform, Image, StyleSheet, Alert } from 'react-native';
  import { useSignUp } from '@clerk/clerk-expo';
  import { Link, useRouter } from 'expo-router';
  import { SafeAreaView } from 'react-native-safe-area-context';
  import Ionicons from '@expo/vector-icons/Ionicons';
  import { LinearGradient } from 'expo-linear-gradient';

  export default function SignUpScreen() {
    const { isLoaded, signUp, setActive } = useSignUp();
    const router = useRouter();

    const [emailAddress, setEmailAddress] = React.useState('');
    const [password, setPassword] = React.useState('');
    const [pendingVerification, setPendingVerification] = React.useState(false);
    const [code, setCode] = React.useState('');
    const [isLoading, setIsLoading] = React.useState(false);

    const onSignUpPress = async () => {
      if (!isLoaded) return;

      setIsLoading(true);
      try {
        await signUp.create({
          emailAddress,
          password,
        });

        await signUp.prepareEmailAddressVerification({ strategy: 'email_code' });
        setPendingVerification(true);
      } catch (err) {
        Alert.alert("Error", err.message || "An error occurred during sign up.");
        console.error(JSON.stringify(err, null, 2));
      } finally {
        setIsLoading(false);
      }
    };

    const onVerifyPress = async () => {
      if (!isLoaded) return;

      setIsLoading(true);
      try {
        const signUpAttempt = await signUp.attemptEmailAddressVerification({ code });
        if (signUpAttempt.status === 'complete') {
          await setActive({ session: signUpAttempt.createdSessionId });
          router.replace('/');
        } else {
          console.error(JSON.stringify(signUpAttempt, null, 2));
        }
      } catch (err) {
        console.error(JSON.stringify(err, null, 2));
      } finally {
        setIsLoading(false);
      }
    };

    if (pendingVerification) {
      return (
        <SafeAreaView className='flex-1'>
          <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : 'height'} className='flex-1'>
            <View className='flex-1 px-6'>
              <View className='flex-1 justify-center items-center'>
                <Text style={styles.headerText}>Verify your email</Text>
              </View>
              <View className='bg-white rounded-2xl p-3 shadow-sm border border-gray-200 mb-6 items-center'>
                <TextInput
                  autoCapitalize='none'
                  value={code}
                  placeholder='Enter your verification code'
                  placeholderTextColor='#9CA3AF'
                  className='w-full mb-4 px-4 py-3 bg-gray-50 rounded-xl text-gray-900'
                  onChangeText={setCode}
                  editable={!isLoading}
                />
                <TouchableOpacity
                  onPress={onVerifyPress}
                  disabled={isLoading}
                  className={`w-full rounded-xl py-3 shadow-sm ${isLoading ? 'bg-gray-600' : 'bg-green-700'}`}
                  activeOpacity={0.8}
                >
                  <View className='flex-row justify-center items-center'>
                    {isLoading ? (
                      <Ionicons name='refresh' size={24} color='white' />
                    ) : (
                      <Text style={styles.buttonText}>Verify</Text>
                    )}
                  </View>
                </TouchableOpacity>
                <View className='flex-row justify-center mt-6'>
                  <Text style={styles.linkText}>Didn’t receive a code?</Text>
                  <Link href='/resend-code'>
                    <Text style={styles.linkAction}> Resend</Text>
                  </Link>
                </View>
              </View>
            </View>
          </KeyboardAvoidingView>
        </SafeAreaView>
      );
    }

    return (
      <SafeAreaView className='flex-1'>
        <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : 'height'} className='flex-1'>
          <View className='flex-1 px-6'>
            <View className='flex-1 justify-center'>
              <View className='items-center mb-8 px-4'>
                <LinearGradient
                  colors={['rgba(209, 250, 229, 0)', '#34D399', '#065F46', 'rgba(6, 95, 70, 0)']}
                  locations={[0, 0.2, 0.8, 1]}
                  style={styles.gradientContainer}
                  start={{ x: 0.3, y: 0}}
                  end={{ x: 1.2, y: 1.2 }}
                >
                  <Image
                    source={require('../../../assets/Logo.png')}
                    style={styles.image}
                    resizeMode='contain'
                  />
                </LinearGradient>
                <Text style={styles.title}>Join Workout Logger</Text>
                <Text style={styles.subtitle}>Join us to track your workouts and achieve your goals!</Text>
              </View>
            </View>
            <View className='bg-white rounded-2xl p-3 shadow-sm border border-gray-200 mb-6 items-center'>
              <Text style={styles.welcomeText}>Create Your Account</Text>
              <View className='mb-4 px-4 space-y-6 mt-6 w-full'>
                <Text style={styles.labelText}>Email</Text>
                <View className='flex-row items-center bg-gray-50 rounded-xl'>
                  <Ionicons name='mail-outline' size={20} color='#9CA3AF' className='ml-3' />
                  <TextInput
                    autoCapitalize='none'
                    value={emailAddress}
                    placeholder='Enter email'
                    placeholderTextColor='#9CA3AF'
                    className='flex-1 ml-3 text-gray-900'
                    onChangeText={setEmailAddress}
                    editable={!isLoading}
                  />
                </View>
              </View>
              <View className='mb-4 px-4 space-y-4 w-full'>
                <Text style={styles.labelText}>Password</Text>
                <View className='flex-row items-center bg-gray-50 rounded-xl'>
                  <Ionicons name='lock-closed-outline' size={20} color='#9CA3AF' className='ml-3' />
                  <TextInput
                    value={password}
                    placeholder='Enter password'
                    secureTextEntry={true}
                    placeholderTextColor='#9CA3AF'
                    className='flex-1 ml-3 text-gray-900'
                    onChangeText={setPassword}
                    editable={!isLoading}
                  />
                </View>
              </View>
              <TouchableOpacity
                onPress={onSignUpPress}
                disabled={isLoading}
                className={`w-full rounded-xl py-3 shadow-sm ${isLoading ? 'bg-gray-600' : 'bg-blue-700'}`}
                activeOpacity={0.8}
              >
                <View className='flex-row justify-center items-center'>
                  {isLoading ? (
                    <Ionicons name='refresh' size={24} color='white' />
                  ) : (
                    <Text style={styles.buttonText}>Continue</Text>
                  )}
                </View>
              </TouchableOpacity>
              <View className='flex-row justify-center mt-6'>
                <Text style={styles.linkText}>Already have an account?</Text>
                <Link href='/sign-in'>
                  <Text style={styles.linkAction}>Sign in</Text>
                </Link>
              </View>
            </View>

            <View className='pb-6 mt-4'>
                  <Text className='text-gray-500 text sm text-center'>Ready to get started?</Text>
            </View>
          </View>
        </KeyboardAvoidingView>
      </SafeAreaView>
    );
  }

  const styles = StyleSheet.create({
    gradientContainer: {
      width: 160,
      height: 160,
      borderRadius: 80,
      padding: 20,
      justifyContent: 'center',
      alignItems: 'center',
    },
    image: {
      width: 275,
      height: 275,
      marginTop: 50,
    },
    title: {
      fontSize: 24,
      fontWeight: 'bold',
      color: '#1F2937',
      marginTop: 16,
      marginBottom: 8,
    },
    subtitle: {
      fontSize: 18,
      color: '#4B5563',
      textAlign: 'center',
      maxWidth: 240,
    },
    welcomeText: {
      fontSize: 24,
      fontWeight: 'bold',
      color: '#1E40AF',
      marginBottom: 16,
    },
    labelText: {
      fontSize: 14,
      fontWeight: '500',
      color: '#4B5563',
      marginBottom: 4,
    },
    buttonText: {
      fontSize: 16,
      fontWeight: '600',
      color: 'white',
      textAlign: 'center',
    },
    linkText: {
      fontSize: 14,
      color: '#4B5563',
    },
    linkAction: {
      fontSize: 14,
      color: '#1E40AF',
      fontWeight: '600',
    },
    headerText: {
      fontSize: 24,
      fontWeight: 'bold',
      color: '#1F2937',
      textAlign: 'center',
      marginBottom: 16,
    },
  });