import "react-native-url-polyfill/auto";

import { createClient } from "@supabase/supabase-js";
import * as SecureStore from "expo-secure-store";

const ExpoSecureStoreAdapter = {
  getItem: (key: string) => {
    const v1 = SecureStore.getItemAsync(key + "1");
    const v2 = SecureStore.getItemAsync(key + "2");
    return Promise.all([v1, v2]).then((values) => values.join(""));
  },
  setItem: (key: string, value: string) => {
    const v1 = value.substring(0, value.length / 2);
    const v2 = value.substring(value.length / 2, value.length);
    SecureStore.setItemAsync(key + "1", v1);
    SecureStore.setItemAsync(key + "2", v2);
  },
  removeItem: (key: string) => {
    SecureStore.deleteItemAsync(key + "1");
    SecureStore.deleteItemAsync(key + "2");
  },
};

const supabaseUrl = process.env.EXPO_PUBLIC_API_URL as string;
const supabaseKey = process.env.EXPO_PUBLIC_API_KEY as string;

export const supabase = createClient(supabaseUrl, supabaseKey, {
  auth: {
    storage: ExpoSecureStoreAdapter as any,
    autoRefreshToken: true,
    persistSession: true,
    detectSessionInUrl: false,
  },
});
