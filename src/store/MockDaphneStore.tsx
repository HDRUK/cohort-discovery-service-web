import { PropsWithChildren } from "react";
import { useDaphneStore } from "@/store/useDaphneStore";
import type { DaphneStoreState } from "@/store/useDaphneStore";
import type {
  ApiResponse,
  Collection,
  CombinedUser,
  CreateQuery,
  Query,
  Custodian,
  CreateCollectionPost,
  ConceptSet,
} from "@/types/api";
import type { RuleGroupType } from "react-querybuilder";
import { DEFAULT_SEXES } from "@/types/omop";
import { baseFields } from "@/config/queryFields";
import getConcepts from "@/actions/__mocks__/getConcepts";

type SliceOverrides = {
  [K in keyof DaphneStoreState]?: Partial<DaphneStoreState[K]>;
};

const NOOP = () => {};
const RESOLVE = <T,>(v: T) => Promise.resolve(v);

function makeDefaultStore(): DaphneStoreState {
  return {
    stateManagement: {
      isLoading: false,
      setIsLoading: NOOP,
      clearStates: NOOP,
    },
    queryBuilder: {
      fields: baseFields,
      setFields: NOOP,
      queryBuilderJson: { combinator: "and", rules: [] } as RuleGroupType,
      setQueryBuilderJson: NOOP,
      getQueryFromText: NOOP,
      selectedDatasets: [],
      setSelectedDatasets: NOOP,
      queryName: "",
      setQueryName: NOOP,
    },
    omop: {
      sexes: DEFAULT_SEXES,
      setSexes: NOOP,
      conditions: [],
      setConditions: NOOP,
      measurements: [],
      setMeasurements: NOOP,
      drugs: [],
      setDrugs: NOOP,
      observations: [],
      setObservations: NOOP,
      procedures: [],
      setProcedures: NOOP,
      setOmop: NOOP,
    },
    userData: {
      user: null as CombinedUser | null,
      setUser: NOOP,
      signIn: () => Promise.resolve(),
      queries: [] as Query[],
      setQueries: NOOP,
      fetchResults: () =>
        RESOLVE<ApiResponse<CreateQuery>>({
          data: { id: 1 } as unknown as CreateQuery,
          message: "ok",
        }),
      collections: [] as Collection[],
      setCollections: NOOP,
      conceptSets: [] as ConceptSet[],
      setConceptSets: NOOP,
      createConceptSet: () => Promise.resolve(),
      searchForConcepts: async (searchTerm: string, domain?: string) => {
        const { data } = await getConcepts(searchTerm, domain);
        return data;
      },
      addConceptsToSet: () => Promise.resolve(),
      removeConceptsFromSet: () => Promise.resolve(),
      removeConceptSet: () => Promise.resolve(),
    },
    custodianData: {
      custodians: [] as Custodian[],
      setCustodians: NOOP,
      createCollectionHost: () => Promise.resolve(),
      createCollection: (
        _custodianPid: string,
        _payload: CreateCollectionPost
      ) => Promise.resolve(),
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
    omop: { ...defaults.omop, ...(overrides?.omop ?? {}) },
    userData: { ...defaults.userData, ...(overrides?.userData ?? {}) },
    custodianData: {
      ...defaults.custodianData,
      ...(overrides?.custodianData ?? {}),
    },
  };

  useDaphneStore.setState(mock, true);

  return <>{children}</>;
};

export default MockDaphneStore;
