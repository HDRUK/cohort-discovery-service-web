import { isServer, QueryClient } from "@tanstack/react-query";

let browserQueryClient: QueryClient | undefined;

export const getQueryClient = (): QueryClient => {
  if (isServer) {
    return new QueryClient();
  }
  browserQueryClient ??= new QueryClient();
  return browserQueryClient;
};
