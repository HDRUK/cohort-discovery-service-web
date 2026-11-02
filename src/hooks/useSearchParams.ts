"use client";

import { useCallback } from "react";
import {
  useRouter,
  useSearchParams as useNextSearchParams,
  usePathname,
} from "next/navigation";
import { useSearchParamsTransition } from "@/contexts/SearchParamsTransitionContext";

const useSearchParams = (paramName: string = "searchTerm") => {
  const router = useRouter();
  const searchParams = useNextSearchParams();
  const pathname = usePathname();
  const startTransition = useSearchParamsTransition()?.startTransition;

  const replace = useCallback(
    (url: string) => {
      if (startTransition) {
        startTransition(() => router.replace(url));
      } else {
        router.replace(url);
      }
    },
    [router, startTransition],
  );

  const setSearchParams = useCallback(
    (updates: Record<string, string | null>) => {
      const params = new URLSearchParams(searchParams.toString());

      Object.entries(updates).forEach(([name, update]) => {
        const value = update?.trim();

        if (value) {
          params.set(name, value);
        } else {
          params.delete(name);
        }
      });

      const queryString = params.toString();
      replace(queryString ? `?${queryString}` : pathname);
    },
    [replace, searchParams, pathname],
  );

  const setSearchParam = useCallback(
    (userSearchInput: string | null) =>
      setSearchParams({ [paramName]: userSearchInput }),
    [setSearchParams, paramName],
  );

  const getSearchParam = useCallback(
    () => searchParams?.get(paramName),
    [paramName, searchParams],
  );

  const clearSearchParams = useCallback(() => {
    replace(pathname);
  }, [replace, pathname]);

  return {
    searchParams,
    getSearchParam,
    setSearchParam,
    setSearchParams,
    clearSearchParams,
  };
};

export default useSearchParams;
