
import { Stack } from "expo-router";

export {
	// Catch any errors thrown by the Layout component.
	ErrorBoundary,
} from "expo-router";

export default function RootLayout() {
	return (

					<Stack
						screenOptions={{
							headerShown: false,
						}}
					>
						<Stack.Screen name="home" />
						<Stack.Screen
							name="create-modal"
							options={{
								presentation: "modal",
							}}
						/>
					</Stack>

	);
}
