import { useSafeAreaInsets } from "react-native-safe-area-context";
import FontAwesome from "@expo/vector-icons/FontAwesome";
import { useRoute } from "@react-navigation/native";
import { canGoBack, getTitle } from "@/lib/utils";
import React, { ReactNode } from "react";
import { Pressable, Text, View } from "react-native";
import { Router } from "expo-router";
import { Dimensions } from "react-native";

interface ContainerWithChildrenProps {
  children: ReactNode;
  router?: Router;
  modal?: boolean;
  rightComponent?: ReactNode;
}

const HeaderContainer: React.FC<ContainerWithChildrenProps> = ({
  children,
  router,
  modal = false,
  rightComponent,
}) => {
  const route = useRoute();
  const insets = useSafeAreaInsets();
  const windowHeight = Dimensions.get("window").height;

  return (
    <View style={{ flex: 1 }} className="bg-background">
      <View
        className="border-b-[1px] border-gray-500"
        style={{
          position: "relative",
          paddingTop: insets.top,
          // for the height check if insets.top is bigger than 13% of the screen if so use insets.top else use 13%
          height:
            insets.top > 0.13 * windowHeight ? insets.top : 0.13 * windowHeight,
          alignItems: "center",
        }}
      >
        <Text
          className="text-black"
          style={{
            position: "absolute",
            top: insets.top,
            fontSize: 22,
            fontWeight: "600",
            zIndex: 1,
          }}
        >
          {getTitle({
            name: route.name,
          })}
        </Text>
        {canGoBack(route.name) && !modal && router && (
          <View
            style={{
              position: "absolute",
              top: insets.top,
              left: 20,
              zIndex: 1,
            }}
          >
            <Pressable
              className=" rounded-full p-3"
              onPress={() => router.back()}
            >
              <FontAwesome name="angle-left" size={24} color="black" />
            </Pressable>
          </View>
        )}

        {rightComponent && (
          <View
            style={{
              position: "absolute",
              top: insets.top,
              right: 20,
              zIndex: 1,
            }}
          >
            {rightComponent}
          </View>
        )}
      </View>
      {children}
    </View>
  );
};

export default HeaderContainer;
