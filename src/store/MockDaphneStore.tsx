import { PropsWithChildren } from "react";

import type {
  ApiResponse,
  Collection,
  CombinedUser,
  CreateQuery,
  Query,
  Custodian,
  CreateCollectionPost,
  ConceptSet,
  Concept,
  Workgroup,
  Paginated,
  CreateConceptSetPost,
  UpdateCollectionHostPayload,
  CreateCollectionConfigPost,
  CollectionWithHosts,
  DistributionType,
  AddCollectionsToWorkgroupPost,
  RemoveCollectionsFromWorkgroupPost,
  AddCollectionToWorkgroupsPost,
  RemoveCollectionFromWorkgroupsPost,
} from "@/types/api";

import { EXAMPLE_1, NO_QUERY } from "@/config/queryExamples";
import type {
  BoardIndex,
  SizeCache,
  RuleNodeType,
  RuleGroupType,
} from "@/types/rules";
import type { UniqueIdentifier } from "@dnd-kit/core";

import getConcepts from "@/actions/concept/__mocks__/getConcepts";
import { validateRuleTree } from "@/utils/rules";
import { queryToText } from "@/utils/queryBuilder";

import { LocalizationProvider } from "@mui/x-date-pickers";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { NotifyProvider } from "@/providers/NotifyProvider";
import { getMockCollection } from "@/actions/collection/__mocks__/getCollections";
import { getMockWorkgroup } from "@/actions/workgroup/__mocks__/getWorkgroups";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { getMockQuery } from "@/actions/query/__mocks__/getQueries";

import { useQueryBuilderStore } from "./queryBuilderStore";
import { useStateManagementStore } from "@/store/stateManagementStore";
import { useUserDataStore } from "@/hooks/userDataStore";
import { useCustodianDataStore } from "@/store/custodianDataStore";
import { useAdminDataStore } from "@/store/adminDataStore";
import { useFeatureFlagsStore } from "@/store/featureFlagsStore";
import ConfirmProvider from "@/components/ConfirmProvider";
import { DefaultProvider } from "@/providers/DefaultProvider";

const queryClient = new QueryClient();

type StateManagementState = ReturnType<typeof useStateManagementStore.getState>;
type QueryBuilderState = ReturnType<typeof useQueryBuilderStore.getState>;
type UserStoreState = ReturnType<typeof useUserDataStore.getState>;
type CustodianStoreState = ReturnType<typeof useCustodianDataStore.getState>;
type AdminStoreState = ReturnType<typeof useAdminDataStore.getState>;
type FeatureFlagsStoreState = ReturnType<typeof useFeatureFlagsStore.getState>;

type SliceOverrides = {
  stateManagement?: Partial<StateManagementState>;
  queryBuilder?: Partial<QueryBuilderState>;
  user?: Partial<UserStoreState>;
  custodian?: Partial<CustodianStoreState>;
  admin?: Partial<AdminStoreState>;
  featureFlags?: Partial<FeatureFlagsStoreState>;
};

const NOOP = () => {};
const RESOLVE = <T,>(v: T) => Promise.resolve(v);

const DEFAULT_QUERY: RuleGroupType =
  process.env.NEXT_PUBLIC_USE_EXAMPLE_QUERY === "true" ? EXAMPLE_1 : NO_QUERY;

const MockDaphneStore = ({
  overrides,
  children,
}: PropsWithChildren<{ overrides?: SliceOverrides }>) => {
  useStateManagementStore.setState(
    {
      ...useStateManagementStore.getState(),
      isLoading: false,
      setIsLoading: NOOP,
      clearStates: NOOP,
      ...(overrides?.stateManagement ?? {}),
    },
    true,
  );

  useQueryBuilderStore.setState(
    {
      queryBuilderJson: validateRuleTree(DEFAULT_QUERY),
      queryAsText: queryToText(DEFAULT_QUERY),
      getNodeName: (node: RuleNodeType) => node?.name ?? node.id,
      setNodeName: (_node: RuleNodeType, _name: string) => {},
      boardIndex: {} as BoardIndex,
      sizeCache: {} as SizeCache,
      setSizeCache: (
        _id: UniqueIdentifier,
        _w: number | string,
        _h: number | string,
      ) => {},
      hovered: {},
      setHovered: (_id: UniqueIdentifier, _reset: boolean) => {},
      selected: {},
      toggleSelected: (_id: UniqueIdentifier) => {},
      setQueryBuilderJson: (q: RuleGroupType) => validateRuleTree(q),
      resetQueryBuilderJson: NOOP,
      getQueryFromText: (_input: string) => RESOLVE(DEFAULT_QUERY),
      previouslySelectedDatasets: [],
      setPreviouslySelectedDatasets: NOOP,
      selectedDatasets: [],
      setSelectedDatasets: NOOP,
      queryName: "",
      setQueryName: NOOP,
      setSelected: NOOP,
      select: NOOP,
      deselect: NOOP,
      openSelectDatasetsPanel: true,
      setOpenSelectDatasetsPanel: NOOP,
      showDescendants: {},
      setShowDescendants: NOOP,
      validateRules: (root: RuleGroupType) => root,
      errors: [],
      setErrors: (_rules: RuleGroupType, _pids: UniqueIdentifier[]) => NOOP,
      appendError: (_error: string) => NOOP,
      ...(overrides?.queryBuilder ?? {}),
    } as QueryBuilderState,
    true,
  );

  useUserDataStore.setState(
    {
      user: null as CombinedUser | undefined | null,
      queries: [] as Query[],
      custodians: [] as Custodian[],
      selectedCollections: [] as CollectionWithHosts[],
      conceptSets: [] as ConceptSet[],
      fetchResults: (_queryName?: string, _reset?: boolean) =>
        RESOLVE<ApiResponse<CreateQuery>>({
          data: { query_pid: "mock-pid" } as unknown as CreateQuery,
          message: "ok",
        }),
      rerunTask: NOOP,
      setSelectedCollections: NOOP,
      runDistributions: (
        _collection: CollectionWithHosts,
        _query_type: DistributionType,
      ) => RESOLVE<Query>(getMockQuery()),
      createConceptSet: (_payload: CreateConceptSetPost) =>
        RESOLVE<void>(undefined),
      searchForConcepts: async (searchTerm: string, domain?: string) => {
        const { data } = await getConcepts(searchTerm, domain);
        return data as Paginated<Partial<Concept>>;
      },
      addConceptsToSet: (_conceptSetId: number, _conceptIds: number[]) =>
        RESOLVE<void>(undefined),
      removeConceptsFromSet: (_conceptSetId: number, _conceptIds: number[]) =>
        RESOLVE<void>(undefined),
      removeConceptSet: (_conceptSetId: number) => RESOLVE<void>(undefined),
      deleteQueries: (_pids: string[]) => RESOLVE<void>(undefined),
      ...(overrides?.user ?? {}),
    } as UserStoreState,
    true,
  );

  useCustodianDataStore.setState(
    {
      createCollectionHost: (
        _custodianId: number,
        _payload: { name: string; context: string },
      ) => RESOLVE<void>(undefined),
      updateCollectionHost: (
        _id: number,
        _payload: UpdateCollectionHostPayload,
      ) => RESOLVE<void>(undefined),
      deleteCollectionHost: (_id: number) => RESOLVE<void>(undefined),
      createCollection: (
        _custodianPid: string,
        _payload: CreateCollectionPost,
        _payloadConfig: Omit<CreateCollectionConfigPost, "collection_id">,
      ) => RESOLVE<Collection>(getMockCollection()),
      updateCollection: (
        _id: number,
        _payload: Partial<CreateCollectionPost>,
        _payloadConfig: Partial<CreateCollectionConfigPost>,
      ) => RESOLVE<Collection>(getMockCollection()),
      deleteCollection: (_id: number | string, _custodianPid: string) =>
        RESOLVE<void>(undefined),
      ...(overrides?.custodian ?? {}),
      current: {
        custodian: null,
        collections: [] as Collection[],
        workgroups: [] as Workgroup[],
        ...(overrides?.custodian?.current ?? {}),
      },
    } as CustodianStoreState,
    true,
  );

  useAdminDataStore.setState(
    {
      collections: [] as Collection[],
      selectedWorkgroup: null,
      createCollection: (_payload: CreateCollectionPost) =>
        RESOLVE<Collection>(getMockCollection()),
      updateCollection: (
        _id: number,
        _payload: Partial<CreateCollectionPost>,
      ) => RESOLVE<Collection>(getMockCollection()),
      deleteCollection: (_id: number | string) => RESOLVE<void>(undefined),
      createWorkgroup: (_payload: {
        name: string;
        collections?: number[];
        active: boolean;
      }) => RESOLVE<Workgroup>(getMockWorkgroup()),
      addCollectionsToWorkgroup: (_payload: AddCollectionsToWorkgroupPost) =>
        RESOLVE<number[]>([1]),
      removeCollectionsFromWorkgroup: (
        _payload: RemoveCollectionsFromWorkgroupPost,
      ) => RESOLVE<void>(undefined),
      addCollectionToWorkgroups: (_payload: AddCollectionToWorkgroupsPost) =>
        RESOLVE<number[]>([1]),
      removeCollectionFromWorkgroups: (
        _payload: RemoveCollectionFromWorkgroupsPost,
      ) => RESOLVE<void>(undefined),
      ...(overrides?.admin ?? {}),
    } as AdminStoreState,
    true,
  );

  useFeatureFlagsStore.setState(
    {
      ...useFeatureFlagsStore.getState(),
      flags: null,
      setFlags: NOOP,
      ...(overrides?.featureFlags ?? {}),
    } as FeatureFlagsStoreState,
    true,
  );

  return (
    <DefaultProvider>
      <QueryClientProvider client={queryClient}>
        <LocalizationProvider dateAdapter={AdapterDayjs}>
          <ConfirmProvider>
            <NotifyProvider>{children}</NotifyProvider>
          </ConfirmProvider>
        </LocalizationProvider>
      </QueryClientProvider>
    </DefaultProvider>
  );
};

export default MockDaphneStore;
