import React from "react";
import {  Alert, Text, TouchableOpacity, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import Ionicons from "@expo/vector-icons/Ionicons";
import { useAuth } from "@clerk/clerk-expo";

export default function ProfilePage() {
  const { signOut} = useAuth();

  const handleSignOut = () => {
    Alert.alert("Sign Out", "Are you sure you want to sign out?", [
      { text: "Cancel", style: "cancel" },
      { text: "Sign Out", style: "destructive", onPress:() => signOut() }
    ]);
  }
  return (
    <SafeAreaView className="flex flex-1">
      <Text>Profile</Text>

      <View className="px-6 mb-8 ">
        <TouchableOpacity 
        onPress={handleSignOut}
        className="bg-red-500 rounded-2xl p-4 shadow-sm "
        activeOpacity={0.8}>

          <View className="flex-row justify-center items-center">
            <Ionicons name="log-out-outline" size={30} color="white" className="mr-2" />
            <Text className="text-white font-semibold text-lg">Sign Out</Text>
          </View>

        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}
