import { router } from "expo-router";
import { Text } from "@/components/ui/text";
import { useSupabase } from "@/context/supabase-provider";
import HeaderContainer from "@/app/_header";
import { Pressable, View } from "react-native";
import { FontAwesome } from "@expo/vector-icons";

export default function Shop() {
  const { signOut } = useSupabase();

  const handleSignOut = async () => {
    await signOut()
      .then(() => {
        router.replace("/(public)/sign-in");
      })
      .catch((error) => {
        console.error(error);
      });
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
          onPress={handleSignOut}
        >
          <Text className="font-normal text-xl pl-2">Esci</Text>
          <FontAwesome name="angle-right" size={24} color="black" />
        </Pressable>
      </View>
    </HeaderContainer>
  );
}
