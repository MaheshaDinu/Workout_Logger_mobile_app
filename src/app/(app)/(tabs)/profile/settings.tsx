
import React from "react";
import { Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Stack } from "expo-router";

export default function SettingsPage() {
  return (
    <SafeAreaView className="flex-1 bg-gray-50">
      <Stack.Screen options={{ headerShown: true, title: 'Settings' }} />
      <View className="flex-1 justify-center items-center">
        <Text className="text-2xl font-bold">Settings Page</Text>
        <Text className="text-gray-500 mt-2">More options coming soon!</Text>
      </View>
    </SafeAreaView>
  );
}
