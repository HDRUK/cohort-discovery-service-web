import { QueryContext } from "@/types/context";
import { ApiResponse, Collection, Distribution } from "../../types/api";

const getMockDistribution = (rest?: Partial<Distribution>): Distribution => ({
  id: 1,
  collection_id: 101,
  task_id: 1001,
  name: "SEX",
  category: "demographics",
  description: "sex",
  count: 100,
  q1: 0,
  q3: 1,
  min: 0,
  max: 1,
  mean: 0.48,
  median: 0,
  created_at: "2025-01-01T00:00:00Z",
  updated_at: "2025-01-01T00:00:00Z",
  ...rest,
});

interface MockDemographicsProps {
  collection_id: number;
  n?: number;
}

const getMockDemographics = ({
  collection_id,
  n = 100,
}: MockDemographicsProps): Distribution[] => {
  const nMale = Math.round(n / 2);
  const nFemale = n - nMale;
  return [
    getMockDistribution({ collection_id, count: n }),
    getMockDistribution({ collection_id, count: nMale, name: "Male" }),
    getMockDistribution({ collection_id, count: nFemale, name: "Female" }),
  ];
};

export const mockCollections: Collection[] = [
  {
    id: 1,
    pid: "db6d9b451b818ccc9a449383f2f0c450",
    name: "Test Dataset #1",
    url: null,
    type: QueryContext.BUNNY,
    created_at: "2025-01-01 00:00:00",
    updated_at: "2025-01-01 00:00:00",
    demographics: getMockDemographics({ collection_id: 1, n: 1213 }),
    size: getMockDistribution({ collection_id: 1, count: 1213 }),
  },
  {
    id: 2,
    pid: "db6d9b451b818ccc9a449383f2f0c451",
    name: "Test Dataset #2",
    url: null,
    type: QueryContext.BUNNY,
    created_at: "2025-01-01 00:00:00",
    updated_at: "2025-01-01 00:00:00",
    demographics: getMockDemographics({ collection_id: 2 }),
    size: getMockDistribution({ collection_id: 1, count: 1213 }),
  },
];

const getCollections = async (): Promise<ApiResponse<Collection[]>> => {
  return {
    data: mockCollections,
    message: "success",
  };
};

export default getCollections;
