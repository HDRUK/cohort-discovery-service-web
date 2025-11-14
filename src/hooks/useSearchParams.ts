"use client";

import { useCallback } from "react";
import {
  useRouter,
  useSearchParams as useNextSearchParams,
} from "next/navigation";

const useSearchParams = (paramName: string = "searchTerm") => {
  const router = useRouter();
  const searchParams = useNextSearchParams();

  const setSearchParam = useCallback(
    (userSearchInput: string) => {
      const params = new URLSearchParams(searchParams.toString());
      const value = userSearchInput.trim();

      if (value) {
        params.set(paramName, value);
      } else {
        params.delete(paramName);
      }

      const queryString = params.toString();
      router.replace(queryString ? `?${queryString}` : ".");
    },
    [router, searchParams]
  );

  return { ...searchParams, setSearchParam };
};

export default useSearchParams;
