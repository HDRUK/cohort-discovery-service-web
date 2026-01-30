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
  Workgroup,
} from "@/types/api";
import {
  getCollectionHostTag,
  getTagCustodianCollection,
  TAG_COLLECTION_ADMIN,
  TAG_COLLECTIONS,
  TAG_COLLECTION_HOSTS,
} from "@/config/tags";

export interface CustodianDataStoreState {
  currentCustodian: Custodian | null;
  setCurrentCustodian: (custodian: Custodian | null) => void;

  collections: Collection[];
  setCollections: (collections: Collection[]) => void;

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

  workgroups: Workgroup[];
  setWorkgroups: (workgroups: Workgroup[]) => void;
}

export const useCustodianDataStore = create<CustodianDataStoreState>(
  (set, get) => ({
    currentCustodian: null,
    setCurrentCustodian: (custodian) =>
      set((state) => ({
        ...state,

        currentCustodian: custodian,
      })),

    collections: [],
    setCollections: (collections) =>
      set((state) => ({
        ...state,
        collections,
      })),

    createCollectionHost: async (custodianId, payload) => {
      await createCollectionHost(custodianId, payload);
      const currentCustodian = get().currentCustodian;
      if (currentCustodian?.id === custodianId) {
        await revalidateAction(getCollectionHostTag(currentCustodian.pid));
      }
    },

    updateCollectionHost: async (id, payload) => {
      await updateCollectionHost(id, payload);
      const currentCustodian = get().currentCustodian;
      await revalidateAction(TAG_COLLECTION_HOSTS);
      if (currentCustodian)
        await revalidateAction(getCollectionHostTag(currentCustodian.pid));
    },

    deleteCollectionHost: async (id) => {
      await deleteCollectionHost(id);
      const currentCustodian = get().currentCustodian;
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
      await revalidateAction(getCollectionHostTag(data.custodian.pid));
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

    workgroups: [],
    setWorkgroups: (workgroups) =>
      set((state) => ({
        ...state,
        workgroups,
      })),
  }),
);
