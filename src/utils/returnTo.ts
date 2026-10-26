import { routes } from "@/config/routes";

export const safeReturnTo = (value?: string | null): string => {
  if (!value || !value.startsWith("/") || value.startsWith("//")) {
    return routes.home;
  }

  if (value.startsWith("/\\") || /^\/[^/]*:/.test(value)) {
    return routes.home;
  }

  return value;
};
