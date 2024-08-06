import "../global.css";
import { Stack } from "expo-router";
import { SafeAreaProvider } from "react-native-safe-area-context";

import { SupabaseProvider } from "@/context/supabase-provider";
import { TRPCProvider } from "@/lib/api";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import { Toasts } from "@backpackapp-io/react-native-toast";

export {
  // Catch any errors thrown by the Layout component.
  ErrorBoundary,
} from "expo-router";

export default function RootLayout() {
  return (
    <SupabaseProvider>
      <TRPCProvider>
        <SafeAreaProvider>
          <GestureHandlerRootView className="flex-1">
            <Stack
              screenOptions={{
                headerShown: false,
              }}
              initialRouteName="(public)"
            >
              <Stack.Screen name="(protected)" />
              <Stack.Screen name="(public)" />
            </Stack>
            <Toasts />
          </GestureHandlerRootView>
        </SafeAreaProvider>
      </TRPCProvider>
    </SupabaseProvider>
  );
}
