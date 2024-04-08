import { Pressable, View } from "react-native";

import { H1, Muted } from "@/components/ui/typography";
import { Button } from "@/components/ui/button";
import { Text } from "@/components/ui/text";
import { useSupabase } from "@/context/supabase-provider";
import * as ImagePicker from "expo-image-picker";
import { useEffect, useState } from "react";
import { Image } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

export default function Modal() {
  const { uploadAvatar, getAvatarUrl } = useSupabase();

  const [image, setImage] = useState<string>();
  const [base64, setBase64] = useState<string>();
  const [loaded, setLoaded] = useState<boolean>(false);

  useEffect(() => {
    (async () => {
      const url = await getAvatarUrl();
      if (url != "") {
        setImage(url);
      }
    })();
  }, []);

  const pickImage = async () => {
    // No permissions request is necessary for launching the image library
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.All,
      allowsEditing: true,
      aspect: [4, 3],
      quality: 1,
      base64: true,
    });

    if (!result.canceled) {
      setImage(result.assets[0].uri as never);
      setBase64(result.assets[0].base64 as never);
      setLoaded(true);
    }
  };

  const Confirm = async () => {
    if (!image || !base64) return;
    await uploadAvatar(base64);
  };

  return (
    <SafeAreaView className="flex flex-1 items-center justify-center bg-background p-4 gap-y-4">
      <H1 className="text-center">Avatar Modal</H1>
      <Muted className="text-center">
        In this modal you can Try to upload Your Avatar Image
      </Muted>

      <View className="flex-1 justify-center">
        {(image && (
          <Pressable onPress={pickImage}>
            <Image
              source={{
                uri: image,
                width: 200,
                height: 200,
              }}
              className="w-60 h-60 rounded-full"
            />
          </Pressable>
        )) || (
          <Pressable
            className="w-60 h-60 rounded-full bg-gray-300"
            onPress={pickImage}
          />
        )}
      </View>
      <View className="flex-1 justify-end w-[80%]">
        <Button onPress={Confirm} disabled={!loaded}>
          <Text>Confirm</Text>
        </Button>
      </View>
    </SafeAreaView>
  );
}
