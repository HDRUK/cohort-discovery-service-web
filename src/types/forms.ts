import { CreateCollectionPost, CreateCollectionConfigPost } from "./api";

export interface CollectionHostFormValues {
  name: string;
  context: string;
}

export enum CollectionConfigFrequency {
  WEEKLY = "",
}

export interface CreateCollectionFormValues {
  collection: CreateCollectionPost;
  config: CreateCollectionConfigPost;
}
