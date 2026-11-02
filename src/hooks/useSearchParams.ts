"use client";

import { useCallback, useOptimistic } from "react";
import {
  useRouter,
  useSearchParams as useNextSearchParams,
  usePathname,
} from "next/navigation";
import { useSearchParamsTransition } from "@/contexts/SearchParamsTransitionContext";

const useSearchParams = (paramName: string = "searchTerm") => {
  const router = useRouter();
  const pathname = usePathname();
  const { startTransition } = useSearchParamsTransition();
  const [searchParams, setOptimisticSearchParams] =
    useOptimistic<URLSearchParams>(useNextSearchParams());

  const navigate = useCallback(
    (params: URLSearchParams) => {
      const queryString = params.toString();

      startTransition(() => {
        setOptimisticSearchParams(params);
        router.replace(queryString ? `?${queryString}` : pathname);
      });
    },
    [startTransition, setOptimisticSearchParams, router, pathname],
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

      navigate(params);
    },
    [navigate, searchParams],
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
    navigate(new URLSearchParams());
  }, [navigate]);

  return {
    searchParams,
    getSearchParam,
    setSearchParam,
    setSearchParams,
    clearSearchParams,
  };
};

export default useSearchParams;
