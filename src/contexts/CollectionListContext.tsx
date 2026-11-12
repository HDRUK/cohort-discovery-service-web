"use client";

import { createContext, ReactNode, use, useContext } from "react";
import { CollectionWithHosts, Paginated } from "@/types/api";

type CollectionList = Paginated<CollectionWithHosts> | undefined;

type CollectionListSource = Promise<CollectionList> | CollectionList;

const CollectionListContext = createContext<CollectionListSource>(undefined);

export const CollectionListProvider = ({
  collections,
  children,
}: {
  collections: CollectionListSource;
  children: ReactNode;
}) => (
  <CollectionListContext.Provider value={collections}>
    {children}
  </CollectionListContext.Provider>
);

export const useCollectionList = (): CollectionList => {
  const source = useContext(CollectionListContext);
  return source instanceof Promise ? use(source) : source;
};
