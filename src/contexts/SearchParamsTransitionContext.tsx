"use client";

import {
  createContext,
  ReactNode,
  TransitionStartFunction,
  useContext,
  useTransition,
} from "react";

interface SearchParamsTransition {
  isPending: boolean;
  startTransition: TransitionStartFunction;
}

const SearchParamsTransitionContext =
  createContext<SearchParamsTransition | null>(null);

export const SearchParamsTransitionProvider = ({
  children,
}: {
  children: ReactNode;
}) => {
  const [isPending, startTransition] = useTransition();

  return (
    <SearchParamsTransitionContext.Provider
      value={{ isPending, startTransition }}
    >
      {children}
    </SearchParamsTransitionContext.Provider>
  );
};

export const useSearchParamsTransition = (): SearchParamsTransition | null =>
  useContext(SearchParamsTransitionContext);
