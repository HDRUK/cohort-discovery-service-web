import { CreateCollectionPost, CreateCollectionConfigPost } from "./api";

export interface CollectionHostFormValues {
  name: string;
  context: string;
}

export interface CreateCollectionFormValues {
  collection: CreateCollectionPost;
  config: CreateCollectionConfigPost;
}

export interface UpdateCollectionFormValues {
  collection: Partial<CreateCollectionPost>;
  config: Partial<CreateCollectionConfigPost>;
}

export interface UpdateWorkgroupFormValues {
  collectionIds: number[];
}

export interface CreateWorkgroupFormValues {
  name: string;
  collectionIds: number[];
  active: boolean;
}
