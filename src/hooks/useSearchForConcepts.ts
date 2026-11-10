import { useCallback } from "react";
import { routes } from "@/config/routes";
import useQueryBuilder from "@/hooks/useQueryBuilder";
import { routePost } from "@/lib/routeFetch";
import {
  ApiResponse,
  Concept,
  Paginated,
  SearchConceptsBody,
} from "@/types/api";

export interface SearchForConceptsArgs {
  searchTerm: string;
  perPage: number;
  page?: number;
  domain?: string;
}

const useSearchForConcepts = () => {
  const selectedDatasets = useQueryBuilder((qb) => qb.selectedDatasets);

  return useCallback(
    async ({
      searchTerm,
      perPage,
      page = 1,
      domain,
    }: SearchForConceptsArgs): Promise<Paginated<Partial<Concept>>> => {
      const { data } = await routePost<
        ApiResponse<Paginated<Partial<Concept>>>,
        SearchConceptsBody
      >(routes.api.conceptSearch, {
        concept_name: [searchTerm],
        concept_id: [searchTerm],
        per_page: perPage,
        page,
        domain,
        collections: selectedDatasets,
      });

      return data;
    },
    [selectedDatasets],
  );
};

export default useSearchForConcepts;
