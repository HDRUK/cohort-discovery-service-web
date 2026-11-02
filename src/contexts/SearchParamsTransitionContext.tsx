"use client";

import {
  createContext,
  ReactNode,
  startTransition,
  TransitionStartFunction,
  useContext,
  useTransition,
} from "react";

interface SearchParamsTransition {
  isPending: boolean;
  startTransition: TransitionStartFunction;
}

const SearchParamsTransitionContext = createContext<SearchParamsTransition>({
  isPending: false,
  startTransition,
});

export const SearchParamsTransitionProvider = ({
  children,
}: {
  children: ReactNode;
}) => {
  const [isPending, startPageTransition] = useTransition();

  return (
    <SearchParamsTransitionContext.Provider
      value={{ isPending, startTransition: startPageTransition }}
    >
      {children}
    </SearchParamsTransitionContext.Provider>
  );
};

export const useSearchParamsTransition = (): SearchParamsTransition =>
  useContext(SearchParamsTransitionContext);
