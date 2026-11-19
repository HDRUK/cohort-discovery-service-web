import { ApiError } from "@/lib/https";

const toJson = async <T>(response: Response): Promise<T> => {
  if (!response.ok) {
    throw new ApiError(response.status, await response.text());
  }
  return response.json();
};

export const routeGet = async <T>(path: string): Promise<T> =>
  toJson<T>(await fetch(path, { cache: "no-store" }));

export const routePost = async <T, B>(path: string, body: B): Promise<T> =>
  toJson<T>(
    await fetch(path, {
      method: "POST",
      cache: "no-store",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
    }),
  );
