import { Stack } from "expo-router";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useEffect } from "react";
import { router, usePathname } from "expo-router";

export {
  // Catch any errors thrown by the Layout component.
  ErrorBoundary,
} from "expo-router";

export default function RootLayout() {
  const currentRoute = usePathname();
  /**
   * Checks if onboarding has been completed.
   * If not, redirects to the onboarding screen.
   */
  const OnboardingCheck = async () => {
    const onboarding = await AsyncStorage.getItem("@OnboardingIsDone");

    if (
      (!onboarding || onboarding === "false") &&
      !currentRoute.includes("onboarding")
    ) {
      router.replace("/(protected)/(onboarding)/onboarding");
    }
  };

  useEffect(() => {
    OnboardingCheck();
  }, []);

  return (
    <Stack
      screenOptions={{
        headerShown: false,
      }}
      initialRouteName="(tabs)"
    >
      <Stack.Screen name="(tabs)" />
      <Stack.Screen name="(onboarding)/onboarding" />
    </Stack>
  );
}
