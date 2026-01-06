import { OptionsType } from "@/components/FormMultiSelect/FormMultiSelect";
import {
  CreateCollectionPost,
  CreateCollectionConfigPost,
  Collection,
  ModelState,
} from "./api";

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
  workgroups: string[];
}

export interface UpdateWorkgroupFormValues {
  collections: OptionsType[];
}

export interface CreateWorkgroupFormValues {
  name: string;
  collections: OptionsType[];
  active: boolean;
}

export interface UpdateMultipleCollectionsFormValues {
  collections: Collection[];
  status: ModelState;
  workgroups: string[];
}
