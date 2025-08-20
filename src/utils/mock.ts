import { Paginated } from "../../types/api";
type PaginateOptions<T> = {
  data: T[];
  perPage?: number;
  currentPage?: number;
  path?: string;
};

export const paginateData = <T>({
  data,
  perPage = 25,
  currentPage = 1,
  path = "",
}: PaginateOptions<T>): Paginated<T[]> => {
  const total = data.length;
  const last_page = Math.max(Math.ceil(total / perPage), 1);
  const page = Math.min(Math.max(currentPage, 1), last_page);

  const from = total === 0 ? 0 : (page - 1) * perPage + 1;
  const to = Math.min(page * perPage, total);
  const paginatedData = data.slice(from - 1, to);

  const buildUrl = (p: number) =>
    p >= 1 && p <= last_page ? `${path}?page=${p}` : null;

  return {
    data: paginatedData,
    current_page: page,
    per_page: perPage,
    total,
    from,
    to,
    last_page,
    path,
    first_page_url: buildUrl(1) || "",
    last_page_url: buildUrl(last_page) || "",
    next_page_url: buildUrl(page + 1),
    prev_page_url: buildUrl(page - 1),
  };
};
