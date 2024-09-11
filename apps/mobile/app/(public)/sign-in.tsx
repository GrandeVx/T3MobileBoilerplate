import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "expo-router";
import { useForm } from "react-hook-form";
import { ActivityIndicator, Pressable, View } from "react-native";
import * as z from "zod";

import { SafeAreaView } from "@/components/safe-area-view";
import { Button } from "@/components/ui/button";
import { Form, FormField, FormInput } from "@/components/ui/form";
import { Text } from "@/components/ui/text";
import { Muted } from "@/components/ui/typography";
import { useSupabase } from "@/context/supabase-provider";
import { toast } from "@backpackapp-io/react-native-toast";

const formSchema = z.object({
  email: z.string().email("Inserisci un indirizzo email valido."),
  password: z
    .string()
    .min(8, "La password deve contenere almeno 8 caratteri.")
    .max(64, "La password deve contenere al massimo 64 caratteri"),
});

export default function SignIn() {
  const { signInWithPassword } = useSupabase();
  const router = useRouter();

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  async function onSubmit(data: z.infer<typeof formSchema>) {
    try {
      await signInWithPassword(data.email, data.password);
      form.reset();
    } catch (error: Error | unknown) {
      // @ts-expect-error - This is a hack to get the error message from the unknown type
      toast.error(error.message, {
        styles: {
          view: {
            backgroundColor: "#00930F",
            borderRadius: 8,
          },
          indicator: {
            backgroundColor: "white",
          },
        },
      });
    }
  }

  return (
    <SafeAreaView className="flex-1 bg-background p-4">
      <View className="flex-1 mt-[15%] ">
        <Text className="self-center mb-5 font-semibold text-2xl">
          Accedi al tuo account
        </Text>
        <Form {...form}>
          <View className="gap-4  pb-4 mt-[25%] h-fit">
            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormInput
                  label="Email"
                  placeholder="Email"
                  autoCapitalize="none"
                  autoComplete="email"
                  autoCorrect={false}
                  keyboardType="email-address"
                  {...field}
                />
              )}
            />
            <FormField
              control={form.control}
              name="password"
              render={({ field }) => (
                <FormInput
                  label="Password"
                  placeholder="Password"
                  autoCapitalize="none"
                  autoCorrect={false}
                  secureTextEntry
                  {...field}
                />
              )}
            />

            <Pressable>
              <Text className="underline text-sm">
                Hai dimenticato la password?
              </Text>
            </Pressable>

            <Button
              size="lg"
              variant="default"
              onPress={form.handleSubmit(onSubmit)}
              className="bg-[#334493]"
            >
              {form.formState.isSubmitting ? (
                <ActivityIndicator size="small" />
              ) : (
                <Text className="font-bold">Accedi</Text>
              )}
            </Button>
          </View>
        </Form>
      </View>
      <View className="gap-y-4">
        <Muted
          className="text-center"
          onPress={() => {
            router.replace("/sign-up");
          }}
        >
          Non hai un Account?{" "}
          <Muted className="text-foreground underline text-[#334493]">
            Registrati
          </Muted>
        </Muted>
      </View>
    </SafeAreaView>
  );
}
