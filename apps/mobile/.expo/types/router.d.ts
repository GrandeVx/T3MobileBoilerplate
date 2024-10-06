/* eslint-disable */
import * as Router from 'expo-router';

export * from 'expo-router';

declare module 'expo-router' {
  export namespace ExpoRouter {
    export interface __routes<T extends string = string> extends Record<string, unknown> {
      StaticRoutes: `/` | `/(home)` | `/(home)/home` | `/(onboarding)/onboarding` | `/(profile)` | `/(profile)/profile-home` | `/(protected)` | `/(protected)/(home)` | `/(protected)/(home)/home` | `/(protected)/(onboarding)/onboarding` | `/(protected)/(profile)` | `/(protected)/(profile)/profile-home` | `/(protected)/(tabs)` | `/(protected)/(tabs)/(home)` | `/(protected)/(tabs)/(home)/home` | `/(protected)/(tabs)/(profile)` | `/(protected)/(tabs)/(profile)/profile-home` | `/(protected)/(tabs)/home` | `/(protected)/(tabs)/profile-home` | `/(protected)/home` | `/(protected)/onboarding` | `/(protected)/profile-home` | `/(public)` | `/(public)/sign-in` | `/(public)/sign-up` | `/(tabs)` | `/(tabs)/(home)` | `/(tabs)/(home)/home` | `/(tabs)/(profile)` | `/(tabs)/(profile)/profile-home` | `/(tabs)/home` | `/(tabs)/profile-home` | `/_header` | `/_sitemap` | `/home` | `/onboarding` | `/profile-home` | `/sign-in` | `/sign-up`;
      DynamicRoutes: never;
      DynamicRouteTemplate: never;
    }
  }
}
