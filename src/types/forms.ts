import { CreateCollectionPost, CreateCollectionConfigPost } from "./api";

export interface CollectionHostFormValues {
  name: string;
  context: string;
}

export interface CreateCollectionFormValues {
  collection: CreateCollectionPost;
  config: CreateCollectionConfigPost;
}
