import { Session, User } from "@supabase/supabase-js";
import { SplashScreen, useRouter, useSegments } from "expo-router";
import { createContext, useContext, useEffect, useState } from "react";
import { decode } from 'base64-arraybuffer'

import { supabase } from "@/config/supabase";

SplashScreen.preventAutoHideAsync();

type SupabaseContextProps = {
  user: User | null;
  session: Session | null;
  initialized?: boolean;
  signUp: (email: string, password: string) => Promise<void>;
  signInWithPassword: (email: string, password: string) => Promise<void>;
  signOut: () => Promise<void>;
  uploadAvatar: (file: string) => Promise<string>;
	downloadAvatar: (fileUUID: string) => Promise<Blob>;
  getAvatarUrl: (fileUUID: string) => Promise<string>;
  uploadPostImage: (file: File, fileUUID: string) => Promise<string>;
};

type SupabaseProviderProps = {
  children: React.ReactNode;
};

export const SupabaseContext = createContext<SupabaseContextProps>({
  user: null,
  session: null,
  initialized: false,
  signUp: async () => {},
  signInWithPassword: async () => {},
  signOut: async () => {},
  uploadAvatar: async () => "",
	downloadAvatar: async () => new Blob(),
  getAvatarUrl: async () => "",
  uploadPostImage: async () => "",
});

export const useSupabase = () => useContext(SupabaseContext);

export const SupabaseProvider = ({ children }: SupabaseProviderProps) => {
  const router = useRouter();
  const segments = useSegments();
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [initialized, setInitialized] = useState<boolean>(false);

  const signUp = async (email: string, password: string) => {
    const { error } = await supabase.auth.signUp({
      email,
      password,
    });
    if (error) {
      throw error;
    }
  };

  const signInWithPassword = async (email: string, password: string) => {
    const { error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });
    if (error) {
      throw error;
    }
  };

  const signOut = async () => {
    const { error } = await supabase.auth.signOut();
    if (error) {
      throw error;
    }
  };

  /**
   * Uploads an avatar file to the Supabase storage.
   *
   * @param file - The avatar file to upload.
   * @param fileUUID - The UUID of the file.
   * @returns The uploaded data path.
   * @throws If there is an error during the upload process.
   */
  const uploadAvatar = async (file: string) => {
    const { data, error } = await supabase.storage
      .from("avatars")
      .upload(user?.id + "/" + "avatar", decode(file), {
        contentType: "image/png",
        cacheControl: "3600",
        upsert: false,
      });
    if (error) {
      throw error;
    }
    return data.path;
  };

  /**
   * Uploads a post image to Supabase storage.
   * 
   * @param file - The file to be uploaded.
   * @param fileUUID - The UUID of the file.
   * @returns The path of the uploaded file.
   * @throws If there is an error during the upload process.
   */
  const uploadPostImage = async (file: File, fileUUID: string) => {
    const { data, error } = await supabase.storage
      .from("posts")
      .upload("public/" + fileUUID, file, {
        cacheControl: "3600",
        upsert: false,
      });
    if (error) {
      throw error;
    }
    return data.path;
  }

  const getAvatarUrl = async (fileUUID: string) => {
    try {
      const { data } = supabase.storage.from("avatars").getPublicUrl(fileUUID);

      return data.publicUrl;
    } catch (error) {
      throw error;
    }
  };

  /**
   * Downloads the avatar file with the specified UUID from Supabase storage.
   * @param fileUUID The UUID of the avatar file to download.
   * @returns The downloaded avatar file data.
   * @throws If an error occurs during the download process.
   */
  const downloadAvatar = async (fileUUID: string) => {
    const publicUrl = await getAvatarUrl(fileUUID);

    console.log("publicUrl", publicUrl);

    const { data, error } = await supabase.storage
      .from("avatars")
      .download(publicUrl);

    if (error) {
      throw error;
    }

    return data;
  };

  useEffect(() => {
    const { data } = supabase.auth.onAuthStateChange(
      async (_event, session) => {
        setSession(session);
        setUser(session ? session.user : null);
        setInitialized(true);
      }
    );
    return () => {
      data.subscription.unsubscribe();
    };
  }, []);

  useEffect(() => {
    if (!initialized) return;

    const inProtectedGroup = segments[0] === "(protected)";

    if (session && !inProtectedGroup) {
      router.replace("/(protected)/(home)/home");
    } else if (!session) {
      router.replace("/(public)/welcome");
    }

    /* HACK: Something must be rendered when determining the initial auth state... 
		instead of creating a loading screen, we use the SplashScreen and hide it after
		a small delay (500 ms)
		*/

    setTimeout(() => {
      SplashScreen.hideAsync();
    }, 500);
  }, [initialized, session]);

  return (
    <SupabaseContext.Provider
      value={{
        user,
        session,
        initialized,
        signUp,
        signInWithPassword,
        signOut,
        uploadAvatar,
				downloadAvatar,
        getAvatarUrl,
        uploadPostImage
      }}
    >
      {children}
    </SupabaseContext.Provider>
  );
};
