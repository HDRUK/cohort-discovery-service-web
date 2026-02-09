import { create } from "zustand";
import createCollection from "@/actions/createCollection";
import deleteCollection from "@/actions/deleteCollection";
import updateCollection from "@/actions/updateCollection";
import createCollectionConfig from "@/actions/createCollectionConfig";
import updateCollectionConfig from "@/actions/updateCollectionConfig";
import createWorkgroup from "@/actions/createWorkgroup";
import addCollectionsToWorkgroup from "@/actions/addCollectionsToWorkgroup";
import removeCollectionsFromWorkgroup from "@/actions/removeCollectionsFromWorkgroup";
import addCollectionToWorkgroups from "@/actions/addCollectionToWorkgroups";
import removeCollectionFromWorkgroups from "@/actions/removeCollectionFromWorkgroups";
import { revalidateAction, revalidateCollections } from "@/actions/revalidate";
import {
  Collection,
  CreateCollectionPost,
  CreateCollectionConfigPost,
  UpdateCollectionPayload,
  Workgroup,
  CreateWorkgroupPost,
  AddCollectionsToWorkgroupPost,
  RemoveCollectionsFromWorkgroupPost,
  AddCollectionToWorkgroupsPost,
  RemoveCollectionFromWorkgroupsPost,
  CollectionHost,
  Paginated,
  CollectionWithHosts,
  User,
  AddUsersToWorkgroupPost,
  RemoveUsersFromWorkgroupPost,
  CollectionStatus,
} from "@/types/api";
import { TAG_WORKGROUP_ADMIN, TAG_ADMIN_USERS } from "@/config/tags";
import { emptyPaginated } from "@/utils/pagination";
import addUsersToWorkgroup from "@/actions/addUsersToWorkgroup";
import removeUserFromWorkgroup from "@/actions/removeUsersFromWorkgroup";
import transitionCollections from "@/actions/transitionCollections";

export interface AdminDataStoreState {
  users: User[];
  setUsers: (users: User[]) => void;

  // for collections the admin searches on in the tables
  collections: Paginated<CollectionWithHosts>;
  setCollections: (collections: Paginated<CollectionWithHosts>) => void;

  // for all collections needed when assigning workgroups
  allAprovedCollections: Collection[];
  setAllAprovedCollections: (allAprovedCollections: Collection[]) => void;

  collectionHosts: CollectionHost[];
  setCollectionHosts: (collectionHosts: CollectionHost[]) => void;

  workgroups: Workgroup[];
  setWorkgroups: (workgroups: Workgroup[]) => void;

  createCollection: (
    payload: CreateCollectionPost,
    payloadConfig: Omit<CreateCollectionConfigPost, "collection_id">,
  ) => Promise<Collection>;
  updateCollection: (
    id: number,
    payload: UpdateCollectionPayload,
    payloadConfig: Partial<CreateCollectionConfigPost>,
  ) => Promise<Collection>;
  deleteCollection: (id: number | string) => Promise<void>;

  createWorkgroup: (payload: CreateWorkgroupPost) => Promise<Workgroup>;

  addCollectionsToWorkgroup: (
    payload: AddCollectionsToWorkgroupPost,
  ) => Promise<number[]>;
  removeCollectionsFromWorkgroup: (
    payload: RemoveCollectionsFromWorkgroupPost,
  ) => Promise<void>;

  addUsersToWorkgroup: (payload: AddUsersToWorkgroupPost) => Promise<number[]>;
  removeUsersFromWorkgroup: (
    payload: RemoveUsersFromWorkgroupPost,
  ) => Promise<void>;

  addCollectionToWorkgroups: (
    payload: AddCollectionToWorkgroupsPost,
  ) => Promise<number[]>;
  removeCollectionFromWorkgroups: (
    payload: RemoveCollectionFromWorkgroupsPost,
  ) => Promise<void>;

  updateCollectionStatus: (
    idOrIds: number | number[],
    status: CollectionStatus,
  ) => Promise<void>;

  selectedWorkgroup: Workgroup | null;
  setSelectedWorkgroup: (workgroup: Workgroup | null) => void;

  selectedUser: User | null;
  setSelectedUser: (user: User | null) => void;
}

export const useAdminDataStore = create<AdminDataStoreState>((set) => ({
  users: [],
  setUsers: (users) => set((state) => ({ ...state, users })),

  allAprovedCollections: [],
  setAllAprovedCollections: (allAprovedCollections) =>
    set((state) => ({
      ...state,
      allAprovedCollections,
    })),

  collections: emptyPaginated<CollectionWithHosts>([]),
  setCollections: (collections) =>
    set((state) => ({
      ...state,
      collections,
    })),

  collectionHosts: [],
  setCollectionHosts: (collectionHosts) =>
    set((state) => ({
      ...state,
      collectionHosts,
    })),

  workgroups: [],
  setWorkgroups: (workgroups) =>
    set((state) => ({
      ...state,
      workgroups,
    })),

  createCollection: async (payload, payloadConfig) => {
    const { data } = await createCollection(payload);

    await createCollectionConfig({
      ...payloadConfig,
      collection_id: data.id,
    });

    await revalidateCollections(data.custodian.pid);

    return data;
  },

  updateCollection: async (id, payload, payloadConfig) => {
    const { data } = await updateCollection(id, payload);
    await updateCollectionConfig(data.config.id, payloadConfig);

    await revalidateCollections(data.custodian.pid);

    return data;
  },

  deleteCollection: async (id) => {
    await deleteCollection(id);
    await revalidateCollections();
  },

  createWorkgroup: async (payload) => {
    const { data } = await createWorkgroup(payload);
    await revalidateAction(TAG_WORKGROUP_ADMIN);
    return data;
  },

  addCollectionsToWorkgroup: async (payload) => {
    const data = await addCollectionsToWorkgroup(payload);
    await revalidateAction(TAG_WORKGROUP_ADMIN);
    await revalidateCollections();
    return data.map((d) => d.data);
  },

  removeCollectionsFromWorkgroup: async (payload) => {
    await removeCollectionsFromWorkgroup(payload);
    await revalidateCollections();
    await revalidateAction(TAG_WORKGROUP_ADMIN);
  },

  addUsersToWorkgroup: async (payload) => {
    const data = await addUsersToWorkgroup(payload);
    await revalidateAction(TAG_WORKGROUP_ADMIN);
    await revalidateCollections();
    await revalidateAction(TAG_ADMIN_USERS);
    return data.map((d) => d.data);
  },

  removeUsersFromWorkgroup: async (payload) => {
    await removeUserFromWorkgroup(payload);
    await revalidateCollections();
    await revalidateAction(TAG_WORKGROUP_ADMIN);
    await revalidateAction(TAG_ADMIN_USERS);
  },

  addCollectionToWorkgroups: async (payload) => {
    const data = await addCollectionToWorkgroups(payload);
    await revalidateAction(TAG_WORKGROUP_ADMIN);
    await revalidateCollections();
    return data.map((d) => d.data);
  },

  removeCollectionFromWorkgroups: async (payload) => {
    await removeCollectionFromWorkgroups(payload);
    await revalidateCollections();
    await revalidateAction(TAG_WORKGROUP_ADMIN);
  },

  updateCollectionStatus: async (idOrIds, status) => {
    const state = CollectionStatus[status].toLowerCase();
    const ids = Array.isArray(idOrIds) ? idOrIds : [idOrIds];

    await transitionCollections(ids, { state });
    await revalidateCollections();
  },

  selectedWorkgroup: null,
  setSelectedWorkgroup: (selectedWorkgroup) =>
    set((state) => ({
      ...state,
      selectedWorkgroup,
    })),

  selectedUser: null,
  setSelectedUser: (selectedUser) =>
    set((state) => ({
      ...state,
      selectedUser,
    })),
}));
