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

  const setSearchParam = useCallback(
    (userSearchInput: string | null) => {
      const params = new URLSearchParams(searchParams.toString());
      const value = userSearchInput?.trim();

      if (value) {
        params.set(paramName, value);
      } else {
        params.delete(paramName);
      }

      const queryString = params.toString();
      router.replace(queryString ? `?${queryString}` : ".");
    },
    [router, searchParams, paramName]
  );

  const getSearchParam = () => searchParams?.get(paramName);

  const clearSearchParams = useCallback(() => {
    router.replace(pathname);
  }, [router, pathname]);

  return { searchParams, getSearchParam, setSearchParam, clearSearchParams };
};

export default useSearchParams;
