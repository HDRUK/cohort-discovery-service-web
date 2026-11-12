import {
  isServer,
  MutationCache,
  QueryCache,
  QueryClient,
} from "@tanstack/react-query";
import { ApiError } from "@/lib/https";
import { useSessionStore } from "@/store/sessionStore";

let browserQueryClient: QueryClient | undefined;

export const endSessionIfUnauthorised = (error: unknown): void => {
  if (error instanceof ApiError && error.status === 401) {
    useSessionStore.getState().endSession();
  }
};

const createBrowserQueryClient = (): QueryClient =>
  new QueryClient({
    queryCache: new QueryCache({ onError: endSessionIfUnauthorised }),
    mutationCache: new MutationCache({ onError: endSessionIfUnauthorised }),
  });

export const getQueryClient = (): QueryClient => {
  if (isServer) {
    return new QueryClient();
  }
  browserQueryClient ??= createBrowserQueryClient();
  return browserQueryClient;
};
