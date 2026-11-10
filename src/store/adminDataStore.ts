import { create } from "zustand";
import createCollectionWithConfig from "@/actions/collection/createCollectionWithConfig";
import createWorkgroup from "@/actions/workgroup/createWorkgroup";
import addCollectionsToWorkgroup from "@/actions/workgroup/addCollectionsToWorkgroup";
import removeCollectionsFromWorkgroup from "@/actions/workgroup/removeCollectionsFromWorkgroup";
import {
  Collection,
  CreateCollectionPost,
  CreateCollectionConfigPost,
  Workgroup,
  CreateWorkgroupPost,
  AddCollectionsToWorkgroupPost,
  RemoveCollectionsFromWorkgroupPost,
  CollectionHost,
  User,
  RemoveUsersFromWorkgroupPost,
  Network,
  AddCustodiansToNetworkPost,
  CreateNetworkPost,
  RemoveCustodiansFromNetworkPost,
  UpdateNetworkPost,
} from "@/types/api";
import removeUserFromWorkgroup from "@/actions/workgroup/removeUsersFromWorkgroup";
import createNetwork from "@/actions/network/createNetwork";
import addCustodiansToNetwork from "@/actions/network/addCustodiansToNetwork";
import deleteNetwork from "@/actions/network/deleteNetwork";
import removeCustodiansFromNetwork from "@/actions/network/removeCustodiansFromNetwork";
import updateNetwork from "@/actions/network/updateNetwork";

export interface AdminDataStoreState {
  users: User[];
  setUsers: (users: User[]) => void;

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

  createWorkgroup: (payload: CreateWorkgroupPost) => Promise<Workgroup>;

  addCollectionsToWorkgroup: (
    payload: AddCollectionsToWorkgroupPost,
  ) => Promise<number[]>;
  removeCollectionsFromWorkgroup: (
    payload: RemoveCollectionsFromWorkgroupPost,
  ) => Promise<void>;

  removeUsersFromWorkgroup: (
    payload: RemoveUsersFromWorkgroupPost,
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

  createWorkgroup: async (payload) => {
    return await createWorkgroup(payload);
  },

  addCollectionsToWorkgroup: async (payload) => {
    return await addCollectionsToWorkgroup(payload);
  },

  removeCollectionsFromWorkgroup: async (payload) => {
    await removeCollectionsFromWorkgroup(payload);
  },

  removeUsersFromWorkgroup: async (payload) => {
    await removeUserFromWorkgroup(payload);
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
