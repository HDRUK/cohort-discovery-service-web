"use client";

import { useCallback } from "react";
import {
  useRouter,
  useSearchParams as useNextSearchParams,
  usePathname,
} from "next/navigation";

const useSearchParams = (paramName: string = "searchTerm") => {
  const router = useRouter();
  const searchParams = useNextSearchParams();
  const pathname = usePathname();

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
      router.replace(queryString ? `?${queryString}` : ".");
    },
    [router, searchParams],
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
    router.replace(pathname);
  }, [router, pathname]);

  return {
    searchParams,
    getSearchParam,
    setSearchParam,
    setSearchParams,
    clearSearchParams,
  };
};

export default useSearchParams;
