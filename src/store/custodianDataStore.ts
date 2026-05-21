import { create } from "zustand";
import createCollectionHost from "@/actions/collectionHost/createCollectionHost";
import updateCollectionHost from "@/actions/collectionHost/updateCollectionHost";
import deleteCollectionHost from "@/actions/collectionHost/deleteCollectionHost";
import createCustodianCollectionWithConfig from "@/actions/collection/createCustodianCollectionWithConfig";
import updateCollectionWithConfig from "@/actions/collection/updateCollectionWithConfig";
import deleteCollection from "@/actions/collection/deleteCollection";
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
      const currentCustodian = get().current.custodian;
      const pid =
        currentCustodian?.id === custodianId ? currentCustodian.pid : undefined;
      await createCollectionHost(custodianId, payload, pid);
    },

    updateCollectionHost: async (id, payload) => {
      const currentCustodian = get().current.custodian;
      await updateCollectionHost(id, payload, currentCustodian?.pid);
    },

    deleteCollectionHost: async (id) => {
      const currentCustodian = get().current.custodian;
      await deleteCollectionHost(id, currentCustodian?.pid);
    },

    createCollection: async (custodianPid, payload, payloadConfig) => {
      return await createCustodianCollectionWithConfig(
        custodianPid,
        payload,
        payloadConfig,
      );
    },

    updateCollection: async (id, payload, payloadConfig, refreshCache = true) => {
      return await updateCollectionWithConfig(
        id,
        payload,
        payloadConfig,
        refreshCache,
      );
    },

    deleteCollection: async (id, custodianPid) => {
      await deleteCollection(id, custodianPid);
    },

    requestCollectionMadeActive: async (idOrIds: number | number[]) => {
      const currentCustodian = get().current.custodian;
      const ids = Array.isArray(idOrIds) ? idOrIds : [idOrIds];
      const state = CollectionStatus[CollectionStatus.PENDING].toLowerCase();
      await transitionCollections(ids, { state }, currentCustodian?.pid);
    },

    toggleCollectionActive: async (collection: CollectionWithHosts) => {
      const currentCustodian = get().current.custodian;

      const stateId = collection.model_state.state_id;

      let nextState: string;

      switch (stateId) {
        case CollectionStatus.ACTIVE:
          nextState = CollectionStatus[CollectionStatus.DRAFT].toLowerCase();
          break;

        case CollectionStatus.DRAFT:
          nextState = CollectionStatus[CollectionStatus.PENDING].toLowerCase();
          break;

        default:
          nextState = CollectionStatus[CollectionStatus.PENDING].toLowerCase();
          break;
      }

      await transitionCollections(
        [collection.id],
        { state: nextState },
        currentCustodian?.pid,
      );

      return nextState;
    },
  }),
);
