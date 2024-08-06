import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

/**
 * Get the title of the current route.
 * @param route
 * @returns
 */
export function getTitle(route: { name: string }) {
  switch (route.name) {
    case "home":
      return "Home";

    case "profile-home":
      return "Il mio Profilo";

    default:
      return route.name;
  }
}

/**
 *  Check if the user can go back from the current route.
 * @param route
 * @returns
 */
export function canGoBack(route: string): boolean {
  if (route == "home" || route == "profile-home") {
    return false;
  }

  return true;
}
