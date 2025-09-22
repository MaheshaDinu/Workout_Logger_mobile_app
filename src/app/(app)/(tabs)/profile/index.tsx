import React from "react";
import { Alert, Text, TouchableOpacity, View,Image } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import Ionicons from "@expo/vector-icons/Ionicons";
import { useAuth, useUser } from "@clerk/clerk-expo";

export default function ProfilePage() {
  const { signOut } = useAuth();
  const { user } = useUser();

  const handleSignOut = () => {
    Alert.alert("Sign Out", "Are you sure you want to sign out?", [
      { text: "Cancel", style: "cancel" },
      { text: "Sign Out", style: "destructive", onPress: () => signOut() },
    ]);
  };

  return (
    <SafeAreaView className="flex-1 bg-gray-50">
      <View className="flex-1">
        {/* Profile Header Section */}
        <View className="p-6 items-center border-b border-gray-200 bg-white">
          <View className="w-24 h-24 rounded-full bg-gray-200 justify-center items-center overflow-hidden">
            {user?.imageUrl ? (
              <Image 
                source={{ uri: user.imageUrl }} 
                className="w-full h-full" 
                resizeMode="cover"
              />
            ) : (
              <Ionicons name="person-outline" size={60} color="#6B7280" />
            )}
          </View>
          <Text className="text-2xl font-bold text-gray-900 mt-4">
            {user?.firstName} {user?.lastName}
          </Text>
          <Text className="text-sm text-gray-500 mt-1">
            {user?.emailAddresses[0]?.emailAddress}
          </Text>
        </View>

        {/* Action Buttons Section */}
        <View className="flex-1 p-6">
          <TouchableOpacity
            onPress={() => {}}
            className="flex-row items-center p-4 rounded-xl mb-3 bg-white shadow-sm border border-gray-100"
            activeOpacity={0.8}
          >
            <Ionicons name="settings-outline" size={24} color="#3B82F6" />
            <Text className="flex-1 ml-4 text-gray-700 font-semibold text-base">
              Settings
            </Text>
            <Ionicons name="chevron-forward-outline" size={20} color="#9CA3AF" />
          </TouchableOpacity>

          <TouchableOpacity
            onPress={() => {}}
            className="flex-row items-center p-4 rounded-xl mb-3 bg-white shadow-sm border border-gray-100"
            activeOpacity={0.8}
          >
            <Ionicons name="information-circle-outline" size={24} color="#3B82F6" />
            <Text className="flex-1 ml-4 text-gray-700 font-semibold text-base">
              About App
            </Text>
            <Ionicons name="chevron-forward-outline" size={20} color="#9CA3AF" />
          </TouchableOpacity>
        </View>

        {/* Sign Out Button Section */}
        <View className="px-6 mb-8">
          <TouchableOpacity
            onPress={handleSignOut}
            className="bg-red-500 rounded-xl p-4 shadow-sm"
            activeOpacity={0.8}
          >
            <View className="flex-row justify-center items-center">
              <Ionicons name="log-out-outline" size={20} color="white" />
              <Text className="text-white font-semibold text-base ml-2">
                Sign Out
              </Text>
            </View>
          </TouchableOpacity>
        </View>
      </View>
    </SafeAreaView>
  );
}
