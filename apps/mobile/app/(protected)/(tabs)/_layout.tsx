import { Tabs } from "expo-router";

import React from "react";
import { theme } from "@/lib/constants";
import BankIcon from "@/assets/icons/bank";
import UserIcon from "@/assets/icons/user";

// import { theme } from "@/lib/constants";
// import { useColorScheme } from "@/lib/useColorScheme";

export default function ProtectedLayout() {
  return (
    <Tabs
      screenOptions={{
        tabBarActiveTintColor: "#FFFFFF",
        tabBarInactiveTintColor: theme.light.tabs_muted,
        tabBarStyle: {
          height: 80,
          borderWidth: 1,
          borderRadius: 40,
          marginHorizontal: 10,
          backgroundColor: theme.light.tabs,
          position: "absolute",
          bottom: 30,
          paddingHorizontal: 20,
          borderColor: "#243239",
          flex: 1,
          borderTopWidth: 0,
        },
        headerShown: false,

        headerStyle: {
          height: 120,
        },

        tabBarLabelStyle: {
          fontSize: 10,
          fontWeight: "bold",
        },
        tabBarItemStyle: {
          height: 65,
        },
      }}
      initialRouteName="(home)"
    >
      <Tabs.Screen
        name="(home)"
        options={{
          title: "Home",
          tabBarIcon: ({ color }) => (
            <BankIcon width={28} height={28} color={color} />
          ),
        }}
      />

      <Tabs.Screen
        name="(profile)"
        options={{
          title: "Profilo",

          tabBarIcon: ({ color }) => (
            <UserIcon width={28} height={28} color={color} />
          ),
        }}
      />

      {/*
          // This is an example of a tab that has a badge.
          // it's based on old project so you need to adapt it to your needs 
          <Tabs.Screen
            name="(profile)"
            options={{
              title: "Profilo",

              tabBarIcon: ({ color }) => (
                <View className="relative">
                  {!isLoading &&
                    data!.length > 0 &&
                    data![0].messages[data![0].messages.length - 1].userId !=
                      data![0].userId && (
                      <View className="absolute right-0 bg-red-500 rounded-full z-10 min-h-3 min-w-3"></View>
                    )}

                  <UserIcon width={28} height={28} color={color} />
                </View>
              ),
            }}
          />
      */}
    </Tabs>
  );
}
