import { router } from "expo-router";
import { ActivityIndicator, View } from "react-native";

import { Text } from "@/components/ui/text";

import HeaderContainer from "@/app/_header";
import { api } from "@/lib/api";
import React from "react";

export default function TabOneScreen() {
  const { data: user, isLoading: userLoading } = api.user.getUser.useQuery({});

  if (userLoading) {
    return (
      <HeaderContainer>
        <ActivityIndicator className="flex-1 justify-center items-center bg-background" />
      </HeaderContainer>
    );
  } else
    return (
      <HeaderContainer router={router}>
        <View>
          <Text>
            Welcome back,{" "}
            {user?.firstName && user?.lastName
              ? user.firstName + " " + user.lastName
              : ""}
            !
          </Text>
        </View>
      </HeaderContainer>
    );
}
