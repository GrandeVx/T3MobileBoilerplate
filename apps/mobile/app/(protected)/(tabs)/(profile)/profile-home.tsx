import { router } from "expo-router";
import { Text } from "@/components/ui/text";
import { useSupabase } from "@/context/supabase-provider";
import HeaderContainer from "@/app/_header";
import { Pressable, View } from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { FontAwesome } from "@expo/vector-icons";
import { useNavigation } from "expo-router";
import { CommonActions } from "@react-navigation/native";

export default function Shop() {
  const { signOut } = useSupabase();
  const navigation = useNavigation();

  const ResetOnboarding = async () => {
    await AsyncStorage.setItem("@OnboardingIsDone", "false");
  };

  return (
    <HeaderContainer router={router}>
      <View className="flex-1 items-center  justify-start bg-background gap-y-2">
        <View className="w-full flex pl-3 mb-2 pt-4">
          <Text className="font-normal text-md text-gray-400">
            IMPOSTAZIONI
          </Text>
        </View>

        <Pressable
          className="w-full flex flex-row justify-between border-b-2 p-2 border-[#CACACA]"
          onPress={() => {
            signOut();
            ResetOnboarding();
            navigation.dispatch(
              CommonActions.reset({
                routes: [{ key: "(tabs)", name: "(tabs)" }],
              })
            );
            router.navigate("/(public)/sign-in");
          }}
        >
          <Text className="font-normal text-xl pl-2">Esci</Text>
          <FontAwesome name="angle-right" size={24} color="black" />
        </Pressable>
      </View>
    </HeaderContainer>
  );
}
