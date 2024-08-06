import { Session, User } from "@supabase/supabase-js";
import { SplashScreen, useRouter, useSegments } from "expo-router";
import { createContext, useContext, useEffect, useState } from "react";
import { decode } from "base64-arraybuffer";

import { supabase } from "@/config/supabase";
import { getBaseUrl } from "@/lib/api";

SplashScreen.preventAutoHideAsync();

type SupabaseContextProps = {
  user: User | null;
  session: Session | null;
  initialized?: boolean;
  // Auth
  signUp: (email: string, password: string) => Promise<void>;
  signInWithPassword: (email: string, password: string) => Promise<void>;
  signOut: () => Promise<void>;
  PasswordReset: (email: string) => Promise<void>;

  // Storage upload
  uploadAvatar: (file: string) => Promise<string>;
  uploadRequestImage: (file: string, fileUUID: string) => Promise<string>;
  uploadReportImage: (file: string, fileUUID: string) => Promise<string>;

  // Storage retrieval
  getReportImageUrl: (fileUUID: string) => Promise<string>;
  getPostImageUrl: (fileUUID: string) => Promise<string>;
  getProductImageUrl: (fileUUID: string, cityUUID: string) => Promise<string>;
  getAvatarUrl: () => Promise<string>;
  getRequestImageUrl: (fileUUID: string) => Promise<string>;
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
  PasswordReset: async () => {},
  uploadAvatar: async () => "",
  getAvatarUrl: async () => "",
  uploadRequestImage: async () => "",
  getRequestImageUrl: async () => "",
  uploadReportImage: async () => "",
  getReportImageUrl: async () => "",
  getPostImageUrl: async () => "",
  getProductImageUrl: async () => "",
});

export const useSupabase = () => useContext(SupabaseContext);

export const SupabaseProvider = ({ children }: SupabaseProviderProps) => {
  const router = useRouter();
  const segments = useSegments();
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [initialized, setInitialized] = useState<boolean>(false);

  /**
   * Sends a password reset email to the user.
   */
  const PasswordReset = async () => {
    const { error } = await supabase.auth.resetPasswordForEmail(
      user?.email as string,
      {
        // You Will redirect to the Web App (Next.js) to reset the password
        redirectTo: getBaseUrl() + "/auth/reset-password",
      }
    );
    if (error) {
      throw error;
    }
  };

  /**
   * Signs up a new user with the provided email and password.
   * @param email - The email of the new user.
   * @param password - The password of the new user.
   * @throws If there is an error during the sign-up process
   * @returns
   *
   */
  const signUp = async (email: string, password: string) => {
    const { error } = await supabase.auth.signUp({
      email,
      password,
    });
    if (error) {
      throw error;
    }
  };

  /**
   * Signs in a user with the provided email and password.
   * @param email - The email of the user.
   * @param password - The password of the user.
   * @throws If there is an error during the sign-in process.
   */
  const signInWithPassword = async (email: string, password: string) => {
    const { error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });
    if (error) {
      throw error;
    }
  };

  /**
   * Signs out the current user.
   * @throws If there is an error during the sign-out process.
   */
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
  const uploadRequestImage = async (file: string, fileUUID: string) => {
    const { data, error } = await supabase.storage
      .from("requests")
      .upload(user?.id + "/" + fileUUID, decode(file), {
        contentType: "image/png",
        cacheControl: "3600",
        upsert: false,
      });
    if (error) {
      console.error("Error uploading file: ", error);
      throw error;
    }
    return data.path;
  };

  const getRequestImageUrl = async (fileUUID: string) => {
    const { data } = await supabase.storage
      .from("requests")
      .getPublicUrl(user?.id + "/" + fileUUID);

    if (!data) {
      return "";
    }

    const url =
      data.publicUrl.split("/").slice(0, -1).join("/") + "/" + fileUUID;
    return url;
  };

  /**
   * Uploads a post image to Supabase storage.
   *
   * @param file - The file to be uploaded.
   * @param fileUUID - The UUID of the file.
   * @returns The path of the uploaded file.
   * @throws If there is an error during the upload process.
   */
  const uploadReportImage = async (file: string, fileUUID: string) => {
    const { data, error } = await supabase.storage
      .from("reports")
      .upload(user?.id + "/" + fileUUID, decode(file), {
        contentType: "image/png",
        cacheControl: "3600",
        upsert: false,
      });
    if (error) {
      console.error("Error uploading file: ", error);
      throw error;
    }
    return data.path;
  };

  /**
   * Retrieves the public URL of a report image from Supabase storage.
   * @param fileUUID - The UUID of the file.
   * @returns The URL of the report image.
   */
  const getReportImageUrl = async (fileUUID: string) => {
    const { data } = await supabase.storage
      .from("reports")
      .getPublicUrl(user?.id + "/" + fileUUID);

    if (!data) {
      return "";
    }

    const url =
      data.publicUrl.split("/").slice(0, -1).join("/") + "/" + fileUUID;
    return url;
  };

  const getPostImageUrl = async (fileUUID: string) => {
    const { data } = await supabase.storage
      .from("posts")
      .getPublicUrl(user?.id + "/" + fileUUID);

    if (!data) {
      return "";
    }

    const url =
      data.publicUrl.split("/").slice(0, -1).join("/") +
      "/" +
      user?.id +
      "/" +
      fileUUID;
    return url;
  };

  /**
   * Retrieves the public URL of a product image from Supabase storage.
   * @param fileUUID - The UUID of the file.
   * @param cityUUID - The UUID of the city.
   * @returns The URL of the product image.
   */
  const getProductImageUrl = async (fileUUID: string, cityUUID: string) => {
    const { data } = await supabase.storage
      .from("shop")
      .getPublicUrl(cityUUID + "/" + fileUUID);

    if (!data) {
      return "";
    }
    return data.publicUrl;
  };

  /**
   * Retrieves the URL of the user's avatar from the Supabase storage.
   * @returns The URL of the user's avatar, or an empty string if the avatar is not found.
   */
  const getAvatarUrl = async () => {
    const { data } = await supabase.storage
      .from("avatars")
      .getPublicUrl("avatar");

    if (!data) {
      return "";
    }

    const url =
      data.publicUrl.split("/").slice(0, -1).join("/") +
      "/" +
      user?.id +
      "/avatar";

    return url;
  };

  useEffect(() => {
    const { data } = supabase.auth.onAuthStateChange(
      async (_event, session) => {
        const get_session = await supabase.auth.getUser(session?.access_token);

        if (get_session.data.user) {
          setSession(session);
          setUser(session ? session.user : null);
          setInitialized(true);
        } else {
          setSession(null);
          setUser(null);
          setInitialized(true);
        }
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
      router.replace("/(protected)/(tabs)/(home)/home");
    } else if (!session) {
      router.replace("/(public)/sign-in");
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
        PasswordReset,
        uploadAvatar,
        getAvatarUrl,
        uploadRequestImage,
        getRequestImageUrl,
        uploadReportImage,
        getReportImageUrl,
        getPostImageUrl,
        getProductImageUrl,
      }}
    >
      {children}
    </SupabaseContext.Provider>
  );
};
