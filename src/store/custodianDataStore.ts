import { create } from "zustand";
import createCollectionHost from "@/actions/createCollectionHost";
import updateCollectionHost from "@/actions/updateCollectionHost";
import deleteCollectionHost from "@/actions/deleteCollectionHost";
import createCustodianCollection from "@/actions/createCustodianCollection";
import createCollectionConfig from "@/actions/createCollectionConfig";
import updateCollection from "@/actions/updateCollection";
import updateCollectionConfig from "@/actions/updateCollectionConfig";
import deleteCollection from "@/actions/deleteCollection";
import { revalidateAction } from "@/actions/revalidate";
import {
  Collection,
  Custodian,
  CreateCollectionPost,
  CreateCollectionConfigPost,
  UpdateCollectionHostPayload,
  CollectionHost,
  Paginated,
  CollectionWithHosts,
} from "@/types/api";
import {
  getCollectionHostTag,
  getTagCustodianCollection,
  TAG_COLLECTION_ADMIN,
  TAG_COLLECTIONS,
  TAG_COLLECTION_HOSTS,
} from "@/config/tags";
import { emptyPaginated } from "@/utils/pagination";

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
  ) => Promise<Collection>;
  deleteCollection: (
    id: number | string,
    custodianPid: string,
  ) => Promise<void>;
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
        await revalidateAction(getCollectionHostTag(currentCustodian.pid));
      }
    },

    updateCollectionHost: async (id, payload) => {
      await updateCollectionHost(id, payload);
      const currentCustodian = get().current.custodian;
      await revalidateAction(TAG_COLLECTION_HOSTS);
      if (currentCustodian)
        await revalidateAction(getCollectionHostTag(currentCustodian.pid));
    },

    deleteCollectionHost: async (id) => {
      await deleteCollectionHost(id);
      const currentCustodian = get().current.custodian;
      if (currentCustodian)
        await revalidateAction(getCollectionHostTag(currentCustodian.pid));
      await revalidateAction(TAG_COLLECTION_HOSTS);
    },

    createCollection: async (custodianPid, payload, payloadConfig) => {
      const { data } = await createCustodianCollection(custodianPid, payload);

      await createCollectionConfig({
        ...payloadConfig,
        collection_id: data.id,
      });

      await revalidateAction(getTagCustodianCollection(custodianPid));
      await revalidateAction(TAG_COLLECTION_ADMIN);
      await revalidateAction(TAG_COLLECTIONS);
      await revalidateAction(getCollectionHostTag(custodianPid));
      await revalidateAction(TAG_COLLECTION_HOSTS);

      return data;
    },

    updateCollection: async (id, payload, payloadConfig) => {
      const { data } = await updateCollection(id, payload);

      const idConfig = data.config.id;
      await updateCollectionConfig(idConfig, payloadConfig);

      await revalidateAction(getTagCustodianCollection(data.custodian.pid));
      await revalidateAction(TAG_COLLECTION_ADMIN);
      await revalidateAction(TAG_COLLECTIONS);
      await revalidateAction(getCollectionHostTag(data.custodian.pid));
      await revalidateAction(TAG_COLLECTION_HOSTS);

      return data;
    },

    deleteCollection: async (id, custodianPid) => {
      await deleteCollection(id);
      await revalidateAction(getTagCustodianCollection(custodianPid));
      await revalidateAction(TAG_COLLECTION_ADMIN);
    },
  }),
);
