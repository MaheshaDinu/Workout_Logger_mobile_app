import { Stack } from "expo-router";
import React from "react";

function Layout() {
  return (
  <Stack>
    <Stack.Screen name="index" options={{ headerShown: false }} />
    <Stack.Screen name="edit" options={{ headerShown: false, title: 'Edit Profile' }} />
  </Stack>
  );
}

export default Layout;
