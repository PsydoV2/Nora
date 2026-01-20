import React from "react";
import FontAwesome from "@expo/vector-icons/FontAwesome";
import { Link, Tabs } from "expo-router";
import { Pressable } from "react-native";
import Colors from "@/constants/StyleVariables";
import { useColorScheme } from "react-native";
import Octicons from "@expo/vector-icons/Octicons";

function TabBarIcon(props: {
  name: React.ComponentProps<typeof FontAwesome>["name"];
  color: string;
}) {
  return <FontAwesome size={26} style={{ marginBottom: -20 }} {...props} />;
}

export default function TabsLayout() {
  const scheme = useColorScheme();
  const theme = Colors[scheme ?? "light"];

  return (
    <Tabs
      screenOptions={{
        headerStyle: { backgroundColor: theme.bgDark },
        headerTintColor: theme.text,
        tabBarStyle: { backgroundColor: theme.bgDark },
        tabBarActiveTintColor: theme.primary,
        tabBarInactiveTintColor: `${theme.primary}40`,
        tabBarLabelStyle: { fontSize: 12, fontWeight: "600" },
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          title: "",
          tabBarIcon: ({ color }) => (
            <Octicons
              name="calendar"
              size={24}
              style={{ marginBottom: -12 }}
              color={color}
            />
          ),
          headerShown: false,
        }}
      />
      <Tabs.Screen
        name="settings"
        options={{
          title: "",
          tabBarIcon: ({ color }) => (
            <Octicons
              name="gear"
              size={24}
              style={{ marginBottom: -12 }}
              color={color}
            />
          ),
          headerShown: false,
        }}
      />
    </Tabs>
  );
}
