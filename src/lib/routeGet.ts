import { ApiError } from "@/lib/https";

export const routeGet = async <T>(path: string): Promise<T> => {
  const response = await fetch(path, { cache: "no-store" });
  if (!response.ok) {
    throw new ApiError(response.status, await response.text());
  }
  return response.json();
};
