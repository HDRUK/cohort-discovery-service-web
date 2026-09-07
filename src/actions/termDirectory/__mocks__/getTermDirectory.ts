import { TermDirectoryEntry, ApiResponse, Paginated } from "@/types/api";
import { paginateData } from "@/utils/mock";

export const getMockTermDirectoryEntry = (
  rest?: Partial<TermDirectoryEntry>,
): TermDirectoryEntry => ({
  concept_id: 201826,
  concept_name: "Type 2 diabetes mellitus",
  domain_id: "Condition",
  count: 1234,
  ncollections: 2,
  ...rest,
});

export const mockTermDirectoryEntries: TermDirectoryEntry[] = [
  getMockTermDirectoryEntry(),
  getMockTermDirectoryEntry({
    concept_id: 4329847,
    concept_name: "Myocardial infarction",
    domain_id: "Observation",
    count: 50,
    ncollections: 1,
  }),
];

const getTermDirectory = async (): Promise<
  ApiResponse<Paginated<TermDirectoryEntry>>
> => {
  return {
    message: "success",
    data: paginateData({ data: mockTermDirectoryEntries }),
  };
};

export default getTermDirectory;
