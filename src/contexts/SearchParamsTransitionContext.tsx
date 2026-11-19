"use client";

import {
  createContext,
  ReactNode,
  startTransition,
  TransitionStartFunction,
  useContext,
  useOptimistic,
  useTransition,
} from "react";

interface SearchParamsTransition {
  isPending: boolean;
  startTransition: TransitionStartFunction;
  pendingSearchParams: URLSearchParams | null;
  setPendingSearchParams: (params: URLSearchParams) => void;
}

const SearchParamsTransitionContext = createContext<SearchParamsTransition>({
  isPending: false,
  startTransition,
  pendingSearchParams: null,
  setPendingSearchParams: () => {},
});

export const SearchParamsTransitionProvider = ({
  children,
}: {
  children: ReactNode;
}) => {
  const [isPending, startPageTransition] = useTransition();
  const [pendingSearchParams, setPendingSearchParams] =
    useOptimistic<URLSearchParams | null>(null);

  return (
    <SearchParamsTransitionContext.Provider
      value={{
        isPending,
        startTransition: startPageTransition,
        pendingSearchParams,
        setPendingSearchParams,
      }}
    >
      {children}
    </SearchParamsTransitionContext.Provider>
  );
};

export const useSearchParamsTransition = (): SearchParamsTransition =>
  useContext(SearchParamsTransitionContext);
