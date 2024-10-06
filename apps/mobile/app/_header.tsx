import { useSafeAreaInsets } from "react-native-safe-area-context";
import FontAwesome from "@expo/vector-icons/FontAwesome";
import { useRoute } from "@react-navigation/native";
import { canGoBack, getTitle } from "@/lib/utils";
import React, { ReactNode } from "react";
import { Platform, Pressable, Text, View } from "react-native";
import { Href, Router } from "expo-router";
import { Dimensions } from "react-native";
import { StatusBar } from "expo-status-bar";

interface ContainerWithChildrenProps {
  children: ReactNode;
  router?: Router;
  modal?: boolean;
  backRoute?: Href<string | object>;
  rightComponent?: ReactNode;
}

const HeaderContainer: React.FC<ContainerWithChildrenProps> = ({
  children,
  router,
  modal = false,
  backRoute,
  rightComponent,
}) => {
  const route = useRoute();
  const insets = useSafeAreaInsets();
  const windowHeight = Dimensions.get("window").height;

  const headerHeight = Math.max(insets.top + 44, 0.13 * windowHeight);

  return (
    <View style={{ flex: 1 }} className="bg-background">
      <View
        style={{
          height: headerHeight,
          paddingTop: insets.top,
          flexDirection: "row",
          alignItems: "center",
          justifyContent: "center",
          position: "relative",
        }}
      >
        <Text
          className="text-black"
          style={{
            fontSize: 24,
            fontWeight: "600",
          }}
        >
          {getTitle({ name: route.name })}
        </Text>

        {canGoBack(route.name) && !modal && router && (
          <Pressable
            style={{
              position: "absolute",
              left: 20,
              top: (headerHeight - insets.top - 40) / 2 + insets.top,
            }}
            className="rounded-full bg-white p-3 px-5"
            onPress={() => {
              backRoute ? router.navigate(backRoute) : router.back();
            }}
          >
            <FontAwesome
              name="angle-left"
              size={24}
              color={"hsl(25 33% 33%)"}
            />
          </Pressable>
        )}

        {rightComponent && (
          <View
            style={{
              position: "absolute",
              right: 20,
              top: (headerHeight - insets.top - 40) / 2 + insets.top,
            }}
            className="rounded-full bg-white p-3 px-3"
          >
            {rightComponent}
          </View>
        )}
      </View>
      <StatusBar style={Platform.OS === "ios" ? "auto" : "auto"} />
      {children}
    </View>
  );
};

export default HeaderContainer;
