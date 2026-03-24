import { create } from "zustand";
import createCollectionHost from "@/actions/collectionHost/createCollectionHost";
import updateCollectionHost from "@/actions/collectionHost/updateCollectionHost";
import deleteCollectionHost from "@/actions/collectionHost/deleteCollectionHost";
import createCustodianCollection from "@/actions/collection/createCustodianCollection";
import createCollectionConfig from "@/actions/collection/createCollectionConfig";
import updateCollection from "@/actions/collection/updateCollection";
import updateCollectionConfig from "@/actions/collection/updateCollectionConfig";
import deleteCollection from "@/actions/collection/deleteCollection";
import { revalidateCollections } from "@/actions/revalidate";
import {
  Collection,
  Custodian,
  CreateCollectionPost,
  CreateCollectionConfigPost,
  UpdateCollectionHostPayload,
  CollectionHost,
  Paginated,
  CollectionWithHosts,
  CollectionStatus,
} from "@/types/api";
import { emptyPaginated } from "@/utils/pagination";
import transitionCollections from "@/actions/collection/transitionCollections";

export interface CustodianDataStoreState {
  current: {
    custodian: Custodian | null;
    setCustodian: (custodian: Custodian | null) => void;

    collections: Paginated<CollectionWithHosts>;
    setCollections: (collections: Paginated<CollectionWithHosts>) => void;

    collectionHosts: CollectionHost[];
    setCollectionHosts: (collectionHosts: CollectionHost[]) => void;
  };
  createCollectionHost: (
    custodianId: number,
    payload: { name: string; context: string },
  ) => Promise<void>;
  updateCollectionHost: (
    id: number,
    payload: UpdateCollectionHostPayload,
  ) => Promise<void>;
  deleteCollectionHost: (id: number) => Promise<void>;

  createCollection: (
    custodianPid: string,
    payload: CreateCollectionPost,
    payloadConfig: Omit<CreateCollectionConfigPost, "collection_id">,
  ) => Promise<Collection>;
  updateCollection: (
    id: number,
    payload: Partial<CreateCollectionPost>,
    payloadConfig: Partial<CreateCollectionConfigPost>,
    refreshCache?: boolean,
  ) => Promise<Collection>;
  deleteCollection: (
    id: number | string,
    custodianPid: string,
  ) => Promise<void>;

  requestCollectionMadeActive: (ids: number | number[]) => Promise<void>;
  toggleCollectionActive: (collection: CollectionWithHosts) => Promise<string>;
}

export const useCustodianDataStore = create<CustodianDataStoreState>(
  (set, get) => ({
    current: {
      custodian: null,
      setCustodian: (custodian) =>
        set((state) => ({
          ...state,
          current: { ...state.current, custodian },
        })),

      collections: emptyPaginated<CollectionWithHosts>([]),
      setCollections: (collections) =>
        set((state) => ({
          ...state,
          current: {
            ...state.current,
            collections,
          },
        })),

      collectionHosts: [],
      setCollectionHosts: (collectionHosts) =>
        set((state) => ({
          ...state,
          current: {
            ...state.current,
            collectionHosts,
          },
        })),
    },
    createCollectionHost: async (custodianId, payload) => {
      await createCollectionHost(custodianId, payload);
      const currentCustodian = get().current.custodian;
      if (currentCustodian?.id === custodianId) {
        await revalidateCollections(currentCustodian.pid);
      }
    },

    updateCollectionHost: async (id, payload) => {
      await updateCollectionHost(id, payload);
      const currentCustodian = get().current.custodian;
      await revalidateCollections(currentCustodian?.pid);
    },

    deleteCollectionHost: async (id) => {
      await deleteCollectionHost(id);
      const currentCustodian = get().current.custodian;
      await revalidateCollections(currentCustodian?.pid);
    },

    createCollection: async (custodianPid, payload, payloadConfig) => {
      const { data } = await createCustodianCollection(custodianPid, payload);

      await createCollectionConfig({
        ...payloadConfig,
        collection_id: data.id,
      });

      await revalidateCollections(custodianPid);

      return data;
    },

    updateCollection: async (
      id,
      payload,
      payloadConfig,
      refreshCache = true,
    ) => {
      const { data } = await updateCollection(id, payload);

      const idConfig = data.config.id;
      await updateCollectionConfig(idConfig, payloadConfig);
      if (refreshCache) await revalidateCollections(data.custodian.pid);
      return data;
    },

    deleteCollection: async (id, custodianPid) => {
      await deleteCollection(id);
      await revalidateCollections(custodianPid);
    },

    requestCollectionMadeActive: async (idOrIds: number | number[]) => {
      const currentCustodian = get().current.custodian;
      const ids = Array.isArray(idOrIds) ? idOrIds : [idOrIds];
      const state = CollectionStatus[CollectionStatus.PENDING].toLowerCase();
      await transitionCollections(ids, { state });
      await revalidateCollections(currentCustodian?.pid);
    },

    toggleCollectionActive: async (collection: CollectionWithHosts) => {
      const currentCustodian = get().current.custodian;

      const stateId = collection.model_state.state_id;

      let nextState: string;

      switch (stateId) {
        case CollectionStatus.ACTIVE:
          // ACTIVE -> DRAFT
          nextState = CollectionStatus[CollectionStatus.DRAFT].toLowerCase();
          break;

        case CollectionStatus.DRAFT:
          // DRAFT -> PENDING
          nextState = CollectionStatus[CollectionStatus.PENDING].toLowerCase();
          break;

        default:
          // fallback
          nextState = CollectionStatus[CollectionStatus.PENDING].toLowerCase();
          break;
      }

      await transitionCollections([collection.id], { state: nextState });
      await revalidateCollections(currentCustodian?.pid);

      return nextState;
    },
  }),
);
