import { useRouter } from "expo-router";
import { View } from "react-native";

import { Button } from "@/components/ui/button";
import { Text } from "@/components/ui/text";
import { H1, Muted } from "@/components/ui/typography";
import { api } from "@/lib/api";
export default function TabOneScreen() {
	const { data, isLoading } = api.post.protectedHello.useQuery({
		text: "Peppe",
	});

	const router = useRouter();

	return (
		<View className="flex-1 items-center justify-center bg-background p-4 gap-y-4">
			<H1 className="text-center">Home</H1>
			<Muted className="text-center">
				You are now authenticated and this session will persist even after
				closing the app.
			</Muted>
			{isLoading ? <Text>Loading...</Text> : <Text>{data?.greeting}</Text>}
			<Button
				className="w-full"
				variant="default"
				size="default"
				onPress={() => {
					router.push("/create-modal");
				}}
			>
				<Text>Open Avatar Modal</Text>
			</Button>
		</View>
	);
}
