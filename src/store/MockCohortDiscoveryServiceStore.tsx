import { PropsWithChildren, useState } from "react";
import {
  SessionData,
  SessionDataProvider,
} from "@/contexts/SessionDataContext";
import {
  AdminSectionData,
  AdminSectionDataProvider,
} from "@/contexts/AdminSectionContext";
import { CustodianSectionDataProvider } from "@/contexts/CustodianSectionContext";

import type {
  CollectionHost,
  CombinedUser,
  Custodian,
} from "@/types/api";

import { EXAMPLE_1, NO_QUERY } from "@/config/queryExamples";
import type {
  BoardIndex,
  SizeCache,
  RuleNodeType,
  RuleGroupType,
} from "@/types/rules";
import type { UniqueIdentifier } from "@dnd-kit/core";

import { validateRuleTree } from "@/utils/rules";
import { queryToText } from "@/utils/queryBuilder";

import { LocalizationProvider } from "@mui/x-date-pickers";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { NotifyProvider } from "@/providers/NotifyProvider";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";

import { useQueryBuilderStore } from "./queryBuilderStore";
import { useStateManagementStore } from "@/store/stateManagementStore";
import { useSelectionStore } from "@/store/selectionStore";
import { useFeatureFlagsStore } from "@/store/featureFlagsStore";
import ConfirmProvider from "@/components/ConfirmProvider";
import { DefaultProvider } from "@/providers/DefaultProvider";
import { themeOptions } from "@/config/theme";
import { HdrukUiProvider } from "@hdruk/ui";
import { ThemeOptions } from "@mui/material";
import { CohortBuilderProvider } from "@/providers/CohortBuilderProvider";
import ApplicationModeProvider from "@/providers/ApplicationModeProvider";

const queryClient = new QueryClient();

type StateManagementState = ReturnType<typeof useStateManagementStore.getState>;
type QueryBuilderState = ReturnType<typeof useQueryBuilderStore.getState>;
type FeatureFlagsStoreState = ReturnType<typeof useFeatureFlagsStore.getState>;

type SliceOverrides = {
  stateManagement?: Partial<StateManagementState>;
  queryBuilder?: Partial<QueryBuilderState>;
  session?: Partial<SessionData>;
  adminSection?: Partial<AdminSectionData>;
  custodianSection?: {
    custodian?: Custodian | null;
    collectionHosts?: CollectionHost[];
  };
  featureFlags?: Partial<FeatureFlagsStoreState>;
};

const NOOP = () => {};
const RESOLVE = <T,>(v: T) => Promise.resolve(v);

const DEFAULT_QUERY: RuleGroupType =
  process.env.NEXT_PUBLIC_USE_EXAMPLE_QUERY === "true" ? EXAMPLE_1 : NO_QUERY;

const seedStores = (overrides?: SliceOverrides) => {
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

  useSelectionStore.setState({
    selectedUserId: null,
    selectedCollectionIds: [],
  });

  useFeatureFlagsStore.setState(
    {
      ...useFeatureFlagsStore.getState(),
      flags: null,
      setFlags: NOOP,
      ...(overrides?.featureFlags ?? {}),
    } as FeatureFlagsStoreState,
    true,
  );
};

const MockSections = ({
  overrides,
  children,
}: PropsWithChildren<{ overrides?: SliceOverrides }>) => {
  const { adminSection, custodianSection } = overrides ?? {};
  const custodian = custodianSection?.custodian;

  const withCustodian = custodian ? (
    <CustodianSectionDataProvider
      value={{
        custodian,
        collectionHosts: custodianSection?.collectionHosts ?? [],
      }}
    >
      {children}
    </CustodianSectionDataProvider>
  ) : (
    children
  );

  return adminSection ? (
    <AdminSectionDataProvider
      value={{
        users: [],
        collections: [],
        collectionHosts: [],
        ...adminSection,
      }}
    >
      {withCustodian}
    </AdminSectionDataProvider>
  ) : (
    withCustodian
  );
};

const MockCohortDiscoveryServiceStore = ({
  overrides,
  children,
}: PropsWithChildren<{ overrides?: SliceOverrides }>) => {
  useState(() => seedStores(overrides));
  const [sessionData] = useState<SessionData>(() => ({
    user: {
      id: 1,
      roles: [],
      custodians: [],
      workgroups: [],
    } as unknown as CombinedUser,
    userCollections: [],
    custodians: [],
    workgroups: [],
    ...overrides?.session,
  }));

  return (
    <ApplicationModeProvider>
      <DefaultProvider>
        <HdrukUiProvider themeOptions={themeOptions as ThemeOptions}>
          <QueryClientProvider client={queryClient}>
            <CohortBuilderProvider>
              <LocalizationProvider dateAdapter={AdapterDayjs}>
                <ConfirmProvider>
                  <NotifyProvider>
                    <SessionDataProvider value={sessionData}>
                      <MockSections overrides={overrides}>
                        {children}
                      </MockSections>
                    </SessionDataProvider>
                  </NotifyProvider>
                </ConfirmProvider>
              </LocalizationProvider>
            </CohortBuilderProvider>
          </QueryClientProvider>
        </HdrukUiProvider>
      </DefaultProvider>
    </ApplicationModeProvider>
  );
};

export default MockCohortDiscoveryServiceStore;
