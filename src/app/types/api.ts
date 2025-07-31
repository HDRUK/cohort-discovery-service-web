import { RuleGroupType } from "react-querybuilder";

export interface ApiResponse<T> {
  message: string;
  data: T;
}

export interface CreateQueryPost {
  name: string;
  definition: RuleGroupType;
  task_type: string;
}

export interface CreateQuery {
  query_pid: string;
  task_count: number;
  task_pids: string[];
}
export type Tasks = string[];

export interface DemographicParsedData {
  Q1: string;
  Q3: string;
  MAX: string;
  MIN: string;
  CODE: string;
  MEAN: string;
  OMOP: string;
  COUNT: string;
  MEDIAN: string;
  BIOBANK: string;
  DATASET: string;
  CATEGORY: string;
  OMOP_DESCR: string;
  DESCRIPTION: string;
  ALTERNATIVES: string;
}

export interface DemographicParsedFile {
  file_name: string;
  file_type: string;
  file_description: string;
  parsed_data: DemographicParsedData[];
}

export interface SubmittedDemographicsQuery {
  id: number;
  pid: string;
  name: string;
  definition: {
    code: string;
  };
  created_at: string;
}

export interface Demographics {
  id: number;
  pid: string;
  query_id: number;
  collection_id: number;
  created_at: string;
  completed_at: string;
  task_type: string;
  submitted_query: SubmittedDemographicsQuery;
  result: ResultDemographics;
}

export interface Collection {
  id: number;
  name: string;
  pid: string;
  type: string;
  created_at: string;
  updated_at: string;
  demographics?: Demographics;
}

export interface Result {
  id: number;
  pid: string;
  count: number;
  metadata: unknown;
  created_at: string;
  updated_at: string;
}

export interface ResultDemographics extends Result {
  metadata: {
    parsed_files: DemographicParsedFile[];
  };
}

export interface Task {
  id: number;
  pid: string;
  query_id: number;
  collection_id: number;
  created_at: string;
  completed_at: string;
  task_type: string;
  collection: Collection;
  result: Result;
}

export interface Query {
  id: number;
  pid: string;
  name: string;
  definition: unknown;
  created_at: string;
  tasks: Task[];
}
