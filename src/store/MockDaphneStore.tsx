import { PropsWithChildren } from "react";
import { useDaphneStore } from "@/store/useDaphneStore";
import type { DaphneStoreState, NodeKind } from "@/store/useDaphneStore";
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
import getConcepts from "@/actions/__mocks__/getConcepts";
import { validateRuleTree } from "@/utils/rules";
import { queryToText } from "@/utils/queryBuilder";
import { LocalizationProvider } from "@mui/x-date-pickers";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { NotifyProvider } from "@/providers/NotifyProvider";
import { getMockCollection } from "@/actions/__mocks__/getCollections";
import { getMockWorkgroup } from "@/actions/__mocks__/getWorkgroups";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { getMockQuery } from "@/actions/__mocks__/getQueries";
const queryClient = new QueryClient();

type SliceOverrides = {
  [K in keyof DaphneStoreState]?: Partial<DaphneStoreState[K]>;
};

const NOOP = () => {};
const RESOLVE = <T,>(v: T) => Promise.resolve(v);

const DEFAULT_QUERY: RuleGroupType =
  process.env.NEXT_PUBLIC_USE_EXAMPLE_QUERY === "true" ? EXAMPLE_1 : NO_QUERY;

function makeDefaultStore(): DaphneStoreState {
  return {
    stateManagement: {
      isLoading: false,
      setIsLoading: NOOP,
      clearStates: NOOP,
    },

    queryBuilder: {
      queryBuilderJson: validateRuleTree(DEFAULT_QUERY),
      queryAsText: queryToText(DEFAULT_QUERY),

      getNodeName: (node: RuleNodeType) => node?.name ?? node.id,
      setNodeName: (_node: RuleNodeType, _name: string) => {},

      boardIndex: {} as BoardIndex,
      sizeCache: {} as SizeCache,
      setSizeCache: (
        _id: UniqueIdentifier,
        _w: number | string,
        _h: number | string
      ) => {},
      selected: {},
      toggleSelected: (_id: UniqueIdentifier) => {},

      createNewNode: (_kind: NodeKind, _above: boolean = true) => {},
      createNewRule: (_above: boolean = true) => {},
      createNewGroup: (_above: boolean = true) => {},
      createNewOperator: (_above: boolean = true) => {},
      createNewAgeFilter: (_above: boolean = true) => {},

      setQueryBuilderJson: NOOP,
      resetQueryBuilderJson: NOOP,
      getQueryFromText: (_input: string) => {},

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
      validateRules: (_root: RuleGroupType) => _root,
    },

    userData: {
      user: null as CombinedUser | undefined | null,
      setUser: NOOP,

      queries: [] as Query[],
      setQueries: NOOP,

      fetchResults: (_queryName?: string, _reset?: boolean) =>
        RESOLVE<ApiResponse<CreateQuery>>({
          data: { id: 1 } as unknown as CreateQuery,
          message: "ok",
        }),

      rerunTask: NOOP,
      collections: [] as Collection[],
      setCollections: NOOP,
      selectedCollections: [] as CollectionWithHosts[],
      setSelectedCollections: NOOP,
      runDistributions: (
        _collection: CollectionWithHosts,
        _query_type: DistributionType
      ) => RESOLVE<Query>(getMockQuery()),

      conceptSets: [] as ConceptSet[],
      setConceptSets: NOOP,

      createConceptSet: (_payload: CreateConceptSetPost) =>
        RESOLVE<void>(undefined),

      searchForConcepts: async (searchTerm: string, domain?: string) => {
        const { data } = await getConcepts(searchTerm, domain);
        return data as Paginated<Partial<Concept>[]>;
      },

      addConceptsToSet: (_conceptSetId: number, _conceptIds: number[]) =>
        RESOLVE<void>(undefined),

      removeConceptsFromSet: (_conceptSetId: number, _conceptIds: number[]) =>
        RESOLVE<void>(undefined),

      removeConceptSet: (_conceptSetId: number) => RESOLVE<void>(undefined),
      deleteQueries: (_pids: string[]) => RESOLVE<void>(undefined),
    },

    custodianData: {
      currentCustodian: null,
      setCurrentCustodian: NOOP,
      custodians: [] as Custodian[],
      setCustodians: NOOP,

      createCollectionHost: (
        _custodianId: number,
        _payload: { name: string; context: string }
      ) => RESOLVE<void>(undefined),
      updateCollectionHost: (
        _id: number,
        _payload: UpdateCollectionHostPayload
      ) => RESOLVE<void>(undefined),
      deleteCollectionHost: (_id: number) => RESOLVE<void>(undefined),
      createCollection: (
        _custodianPid: string,
        _payload: CreateCollectionPost,
        _payloadConfig: Omit<CreateCollectionConfigPost, "collection_id">
      ) => RESOLVE<Collection>(getMockCollection()),
      updateCollection: (
        _id: number,
        _payload: Partial<CreateCollectionPost>,
        _payloadConfig: Partial<CreateCollectionConfigPost>
      ) => RESOLVE<Collection>(getMockCollection()),
      deleteCollection: (_id: number | string, _custodianPid: string) =>
        RESOLVE<void>(undefined),
      workgroups: [] as Workgroup[],
      setWorkgroups: NOOP,
    },

    adminData: {
      collections: [] as Collection[],
      setCollections: NOOP,
      createCollection: (_payload: CreateCollectionPost) =>
        RESOLVE<Collection>(getMockCollection()),
      updateCollection: (
        _id: number,
        _payload: Partial<CreateCollectionPost>
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
        _payload: RemoveCollectionsFromWorkgroupPost
      ) => RESOLVE<void>(undefined),
      addCollectionToWorkgroups: (_payload: AddCollectionToWorkgroupsPost) =>
        RESOLVE<number[]>([1]),
      removeCollectionFromWorkgroups: (
        _payload: RemoveCollectionFromWorkgroupsPost
      ) => RESOLVE<void>(undefined),
      selectedWorkgroup: null,
      setSelectedWorkgroup: NOOP,
    },

    featureFlags: {
      flags: null,
      setFlags: NOOP,
    },
  };
}

const MockDaphneStore = ({
  overrides,
  children,
}: PropsWithChildren<{ overrides?: SliceOverrides }>) => {
  const defaults = makeDefaultStore();

  const mock: DaphneStoreState = {
    stateManagement: {
      ...defaults.stateManagement,
      ...(overrides?.stateManagement ?? {}),
    },
    queryBuilder: {
      ...defaults.queryBuilder,
      ...(overrides?.queryBuilder ?? {}),
    },
    userData: {
      ...defaults.userData,
      ...(overrides?.userData ?? {}),
    },
    custodianData: {
      ...defaults.custodianData,
      ...(overrides?.custodianData ?? {}),
    },
    adminData: {
      ...defaults.adminData,
      ...(overrides?.adminData ?? {}),
    },
    featureFlags: {
      ...defaults.featureFlags,
      ...(overrides?.featureFlags ?? {}),
    },
  };

  useDaphneStore.setState(mock, true);
  return (
    <QueryClientProvider client={queryClient}>
      <LocalizationProvider dateAdapter={AdapterDayjs}>
        <NotifyProvider>{children}</NotifyProvider>
      </LocalizationProvider>
    </QueryClientProvider>
  );
};

export default MockDaphneStore;
