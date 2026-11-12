import {
  isServer,
  MutationCache,
  QueryCache,
  QueryClient,
} from "@tanstack/react-query";
import { endSessionIfUnauthorised } from "@/lib/sessionEnd";

let browserQueryClient: QueryClient | undefined;

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
