import { OptionsType } from "@/components/FormMultiSelect/FormMultiSelect";
import { CreateCollectionPost, CreateCollectionConfigPost } from "./api";

export interface CollectionHostFormValues {
  name: string;
  context: string;
}

export interface CreateCollectionFormValues {
  custodian_pid: string;
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
  users: OptionsType[];
}

export interface CreateWorkgroupFormValues {
  name: string;
  collections: OptionsType[];
  active: boolean;
}

export interface CreateNetworkFormValues {
  name: string;
  url: string;
  custodians: OptionsType[];
}

export interface UpdateNetworkFormValues {
  name: string;
  url: string;
  custodians: OptionsType[];
}
