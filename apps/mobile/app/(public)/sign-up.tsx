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
import { api } from "@/lib/api";

import { toast } from "@backpackapp-io/react-native-toast";

const formSchema = z
  .object({
    email: z.string().email("Inserisci un indirizzo email valido."),
    password: z
      .string()
      .min(8, "La password deve contenere almeno 8 caratteri.")
      .max(64, "La password deve contenere al massimo 64 caratteri")
      .regex(
        /^(?=.*[a-z])/,
        "La tua password deve contenere almeno una lettera minuscola."
      )
      .regex(
        /^(?=.*[A-Z])/,
        "La tua password deve contenere almeno una lettera maiuscola."
      )
      .regex(/^(?=.*[0-9])/, "La tua password deve contenere almeno un numero.")
      .regex(
        /^(?=.*[!@#$%^&*])/,
        "La tua password deve contenere almeno un carattere speciale."
      ),
    confirmPassword: z
      .string()
      .min(8, "La password deve contenere almeno 8 caratteri."),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Le password non corrispondono.",
    path: ["confirmPassword"],
  });

export default function SignUp() {
  const { signUp } = useSupabase();

  const addUser = api.user.addUser.useMutation();
  const router = useRouter();

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      email: "",
      password: "",
      confirmPassword: "",
    },
  });

  async function onSubmit(data: z.infer<typeof formSchema>) {
    try {
      await signUp(data.email, data.password).then(async () => {
        await addUser.mutateAsync({ email: data.email }).then(() => {
          form.reset();
          router.replace("/sign-in");
          toast.success(
            "Account creato con successo! Controlla la tua email per confermare l'account.",
            {
              styles: {
                view: {
                  backgroundColor: "#00930F",
                  borderRadius: 8,
                },
                indicator: {
                  backgroundColor: "white",
                },
              },
            }
          );
        });
      });
    } catch (error: unknown) {
      if (error instanceof Error) {
        toast.error(error.message, {
          styles: {
            view: {
              backgroundColor: "#FFCCCC",
              borderRadius: 8,
            },
            indicator: {
              backgroundColor: "black",
            },
            text: {
              color: "black",
            },
          },
        });
      }
    }
  }

  return (
    <SafeAreaView className="flex-1 bg-background p-4">
      <View className="flex-1 mt-[15%]">
        <Text className="self-center mb-5 font-semibold text-2xl">
          Benvenuto! Registrati adesso
        </Text>
        <Form {...form}>
          <View className="h-fit mt-[25%]">
            <View className="gap-6 flex">
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
              <FormField
                control={form.control}
                name="confirmPassword"
                render={({ field }) => (
                  <FormInput
                    label="Confirm Password"
                    placeholder="Confirm password"
                    autoCapitalize="none"
                    autoCorrect={false}
                    secureTextEntry
                    {...field}
                  />
                )}
              />

              <Muted className="text-center">
                Creando un account, accetti i nostri{" "}
                <Pressable className="underline">
                  <Muted className="underline">Termini e Condizioni</Muted>
                </Pressable>{" "}
                e la nostra{" "}
                <Pressable className="underline">
                  <Muted className="underline">Politica sulla Privacy</Muted>
                </Pressable>
                .
              </Muted>
            </View>
            <Button
              size="lg"
              variant="default"
              onPress={form.handleSubmit(onSubmit)}
              className="bg-[#334493] mt-2"
            >
              {form.formState.isSubmitting ? (
                <ActivityIndicator size="small" />
              ) : (
                <Text className="font-bold">Registrati</Text>
              )}
            </Button>
          </View>
        </Form>
      </View>
      <View className="gap-y-4">
        <Muted
          className="text-center"
          onPress={() => {
            router.replace("/sign-in");
          }}
        >
          Hai già un account?{" "}
          <Muted className="text-foreground underline text-[#334493]">
            Accedi
          </Muted>
        </Muted>
      </View>
    </SafeAreaView>
  );
}
