"use client";

import { useSearchParams } from "next/navigation";
import { ReactNode, Suspense } from "react";

export interface SearchParamsSuspenseProps {
  fallback: ReactNode;
  children: ReactNode;
}

const SearchParamsSuspense = ({
  fallback,
  children,
}: SearchParamsSuspenseProps) => {
  const searchParams = useSearchParams();

  return (
    <Suspense key={searchParams.toString()} fallback={fallback}>
      {children}
    </Suspense>
  );
};

export default SearchParamsSuspense;
