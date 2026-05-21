import { create } from "zustand";
import createCollectionWithConfig from "@/actions/collection/createCollectionWithConfig";
import updateCollectionWithConfig from "@/actions/collection/updateCollectionWithConfig";
import deleteCollection from "@/actions/collection/deleteCollection";
import createWorkgroup from "@/actions/workgroup/createWorkgroup";
import addCollectionsToWorkgroup from "@/actions/workgroup/addCollectionsToWorkgroup";
import removeCollectionsFromWorkgroup from "@/actions/workgroup/removeCollectionsFromWorkgroup";
import addCollectionToWorkgroups from "@/actions/workgroup/addCollectionToWorkgroups";
import removeCollectionFromWorkgroups from "@/actions/workgroup/removeCollectionFromWorkgroups";
import { revalidateWorkgroupAndCollections } from "@/actions/revalidate";
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
  Network,
  AddCustodiansToNetworkPost,
  CreateNetworkPost,
  RemoveCustodiansFromNetworkPost,
  UpdateNetworkPost,
} from "@/types/api";
import { emptyPaginated } from "@/utils/pagination";
import addUsersToWorkgroup from "@/actions/workgroup/addUsersToWorkgroup";
import removeUserFromWorkgroup from "@/actions/workgroup/removeUsersFromWorkgroup";
import transitionCollections from "@/actions/collection/transitionCollections";
import createNetwork from "@/actions/network/createNetwork";
import addCustodiansToNetwork from "@/actions/network/addCustodiansToNetwork";
import deleteNetwork from "@/actions/network/deleteNetwork";
import removeCustodiansFromNetwork from "@/actions/network/removeCustodiansFromNetwork";
import updateNetwork from "@/actions/network/updateNetwork";

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

  networks: Network[];
  setNetworks: (networks: Network[]) => void;

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
    refreshCache?: boolean,
  ) => Promise<void>;

  createNetwork: (payload: CreateNetworkPost) => Promise<Network>;
  updateNetwork: (id: number, payload: UpdateNetworkPost) => Promise<void>;
  deleteNetwork: (id: number) => Promise<void>;
  addCustodiansToNetwork: (
    payload: AddCustodiansToNetworkPost,
  ) => Promise<number[]>;
  removeCustodiansFromNetwork: (
    payload: RemoveCustodiansFromNetworkPost,
  ) => Promise<number[]>;

  selectedWorkgroup: Workgroup | null;
  setSelectedWorkgroup: (workgroup: Workgroup | null) => void;

  selectedNetwork: Network | null;
  setSelectedNetwork: (network: Network | null) => void;

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

  networks: [],
  setNetworks: (networks) =>
    set((state) => ({
      ...state,
      networks,
    })),

  createCollection: async (payload, payloadConfig) => {
    return await createCollectionWithConfig(payload, payloadConfig);
  },

  updateCollection: async (id, payload, payloadConfig) => {
    return await updateCollectionWithConfig(id, payload, payloadConfig);
  },

  deleteCollection: async (id) => {
    await deleteCollection(id);
  },

  createWorkgroup: async (payload) => {
    return await createWorkgroup(payload);
  },

  addCollectionsToWorkgroup: async (payload) => {
    return await addCollectionsToWorkgroup(payload);
  },

  removeCollectionsFromWorkgroup: async (payload) => {
    await removeCollectionsFromWorkgroup(payload);
  },

  addUsersToWorkgroup: async (payload) => {
    return await addUsersToWorkgroup(payload);
  },

  removeUsersFromWorkgroup: async (payload) => {
    await removeUserFromWorkgroup(payload);
  },

  addCollectionToWorkgroups: async (payload) => {
    const data = await addCollectionToWorkgroups(payload);
    await revalidateWorkgroupAndCollections();
    return data.map((d) => d.data);
  },

  removeCollectionFromWorkgroups: async (payload) => {
    await removeCollectionFromWorkgroups(payload);
    await revalidateWorkgroupAndCollections();
  },

  updateCollectionStatus: async (idOrIds, status, refreshCache = true) => {
    const state = CollectionStatus[status].toLowerCase();
    const ids = Array.isArray(idOrIds) ? idOrIds : [idOrIds];
    await transitionCollections(ids, { state }, undefined, refreshCache);
  },

  createNetwork: async (payload: CreateNetworkPost) => {
    return await createNetwork(payload);
  },
  updateNetwork: async (id: number, payload: UpdateNetworkPost) => {
    await updateNetwork(id, payload);
  },
  deleteNetwork: async (id: number) => {
    await deleteNetwork(id);
  },
  addCustodiansToNetwork: async (payload: AddCustodiansToNetworkPost) => {
    return await addCustodiansToNetwork(payload);
  },
  removeCustodiansFromNetwork: async (
    payload: RemoveCustodiansFromNetworkPost,
  ) => {
    return await removeCustodiansFromNetwork(payload);
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

  selectedNetwork: null,
  setSelectedNetwork: (selectedNetwork) =>
    set((state) => ({
      ...state,
      selectedNetwork,
    })),
}));
