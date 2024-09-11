import { useRouter } from "expo-router";
import {
  ActivityIndicator,
  NativeSyntheticEvent,
  ScrollView,
  TextInput,
  TextInputChangeEventData,
  View,
} from "react-native";
import { SafeAreaView } from "@/components/safe-area-view";
import { Button } from "@/components/ui/button";
import { Text } from "@/components/ui/text";
import { H1, Muted } from "@/components/ui/typography";
import { api } from "@/lib/api";
import { useEffect, useState } from "react";
import * as z from "zod";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useNavigation } from "expo-router";
import { CommonActions } from "@react-navigation/native";

export default function Onboarding() {
  const router = useRouter();
  const utils = api.useUtils();

  // Before the rendering you can use the "utils" to invalidate all the other queries for prioritizing the current one

  const { data: user, isLoading: userLoading } = api.user.getUser.useQuery({});

  const [name, setName] = useState(
    user?.firstName && user?.lastName
      ? user.firstName + " " + user.lastName
      : ""
  );

  const [phoneNumber, setPhoneNumber] = useState(user?.phone || "");

  const SetUser = api.user.UpdateUser.useMutation();

  const navigation = useNavigation();
  useEffect(() => {
    if (user) {
      if (user.firstName && user.lastName)
        setName(user.firstName + " " + user.lastName);

      if (user.phone) setPhoneNumber(user.phone);
    }
  }, [user]);

  const HandleSubmit = async () => {
    // check if the user has filled all the fields and if the type is correct
    if (!name || !phoneNumber) {
      alert("Assicurati di aver compilato tutti i campi");
      return;
    }

    // check if the name is correct using zod (it should contain a space in the middle to separate the first name and the last name) can contain "'"

    const nameSchema = z.string().regex(/^[a-zA-Z]+ [a-zA-Z]+$/);
    const nameResult = nameSchema.safeParse(name as string);

    if (!nameResult.success) {
      alert(
        "Assicurati di aver inserito il nome e il cognome correttamente (es. Mario Rossi)"
      );
      return;
    }

    // check if the phone number is correct using zod
    const phoneNumberSchema = z
      .string()
      .regex(/^\(?([0-9]{3})\)?[-. ]?([0-9]{3})[-. ]?([0-9]{4})$/);
    const phoneNumberResult = phoneNumberSchema.safeParse(phoneNumber);

    if (!phoneNumberResult.success) {
      alert("Il numero di telefono non è valido");
      return;
    }

    await SetUser.mutateAsync({
      firstName: name.split(" ")[0],
      lastName: name.split(" ")[1],
      phoneNumber,
    }).then(async () => {
      await AsyncStorage.setItem("@OnboardingIsDone", "true").then(() => {
        utils.invalidate();
        navigation.dispatch(
          CommonActions.reset({
            routes: [{ key: "(tabs)", name: "(tabs)" }],
          })
        );
        router.push("/(protected)/(tabs)/(home)/home");
      });
    });
  };

  if (userLoading) {
    return (
      <SafeAreaView className="flex-1 bg-background p-4 h-full">
        <ActivityIndicator className="flex-1 justify-center items-center bg-background" />
      </SafeAreaView>
    );
  } else
    return (
      <SafeAreaView className="flex-1 bg-background p-4 relative">
        <ScrollView className="z-20" keyboardShouldPersistTaps="handled">
          <View className="flex-1 z-20 pb-40">
            <H1 className="self-start mt-10 font-semibold">Ehi ciao!</H1>
            <Muted className="self-start mb-5 text-lg">
              Abbiamo bisogno di qualche informazione per migliorare la tua
              esperienza nell’applicazione.
            </Muted>

            <View className="flex flex-col gap-5">
              <View className="flex gap-2">
                <Text className="">Nome e Cognome</Text>
                <TextInput
                  className="border-[1px] border-gray-500 rounded-2xl   text-black p-4"
                  value={name}
                  placeholder="Inserisci il tuo nome e cognome"
                  onChange={(
                    value: NativeSyntheticEvent<TextInputChangeEventData>
                  ) => setName(value.nativeEvent.text)}
                />
              </View>

              <View className="flex gap-2">
                <Text className="">Numero di Telefono</Text>
                <View className="flex flex-row">
                  <View className="border-[1px] border-gray-500 rounded-lg ">
                    <Text className="text-black   p-4 rounded-2xl">🇮🇹 +39</Text>
                  </View>
                  <TextInput
                    className="border-[1px] border-gray-500 rounded-2xl    text-black p-4 flex-1 ml-5"
                    value={phoneNumber}
                    placeholder="Numero di Telefono"
                    onChange={(
                      value: NativeSyntheticEvent<TextInputChangeEventData>
                    ) => setPhoneNumber(value.nativeEvent.text)}
                  />
                </View>
              </View>
            </View>
            <View className="flex-1 justify-end pb-4 ">
              <Button
                className="mt-5 bg-[#334493]   text-black w-full rounded-lg p-3"
                onPress={HandleSubmit}
              >
                <Text className="font-bold">Continua</Text>
              </Button>
            </View>
          </View>
        </ScrollView>
      </SafeAreaView>
    );
}
