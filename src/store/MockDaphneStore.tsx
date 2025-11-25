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
  Paginated,
  CreateConceptSetPost,
  UpdateCollectionHostPayload,
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

      setQueryBuilderJson: NOOP,
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

      collections: [] as Collection[],
      setCollections: NOOP,

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
    },

    custodianData: {
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
        _payload: CreateCollectionPost
      ) => RESOLVE<void>(undefined),
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
  };

  useDaphneStore.setState(mock, true);
  return (
    <LocalizationProvider dateAdapter={AdapterDayjs}>
      <NotifyProvider>{children}</NotifyProvider>
    </LocalizationProvider>
  );
};

export default MockDaphneStore;
