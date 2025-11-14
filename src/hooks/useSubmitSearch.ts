"use client";

import { useCallback } from "react";
import { useRouter, useSearchParams } from "next/navigation";

const useSearchSubmit = (paramName: string = "searchTerm") => {
  const router = useRouter();
  const searchParams = useSearchParams();

  const submitSearch = useCallback(
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

  return { submitSearch };
};

export default useSearchSubmit;
