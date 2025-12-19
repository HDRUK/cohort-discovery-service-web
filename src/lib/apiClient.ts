"use server";

import { ACCESS_TOKEN_NAME } from "@/config/internals";
import { cookies } from "next/headers";
import { ApiError } from "./https";
import { notFound, forbidden } from "next/navigation";
import { DEFAULT_REVALIDATE } from "@/config/defaults";
import { updateTag } from "next/cache";
import { getTokenUser } from "./auth";
import { CacheOptions } from "@/types/api";

const baseURL = process.env.API_BASE_URL ?? "http://localhost:8100";

type HttpMethod = "GET" | "POST" | "PUT" | "DELETE";

interface RequestOptions<B = unknown> {
  headers?: Record<string, string>;
  body?: B;
  signal?: AbortSignal;
  cache?: RequestCache;
  next?: NextFetchRequestConfig;
}

export type CachedGetArgs = {
  url: string;
  params?: URLSearchParams;
  tags?: string[];
  cacheOptions?: CacheOptions;
  includeUserTag?: boolean;
  revalidate?: number;
};

const canonicaliseParams = (params: URLSearchParams): string => {
  const entries = Array.from(params.entries());
  entries.sort(([ak, av], [bk, bv]) =>
    ak === bk ? av.localeCompare(bv) : ak.localeCompare(bk)
  );
  return new URLSearchParams(entries).toString();
};

const buildCachedRequest = async ({
  url,
  params,
  tags,
  cacheOptions,
  includeUserTag = true,
  revalidate = DEFAULT_REVALIDATE,
}: CachedGetArgs) => {
  const { fresh = false, force = true } = cacheOptions ?? {};

  const queryString = params ? canonicaliseParams(params) : "";
  const finalUrl = queryString ? `${url}?${queryString}` : url;

  const {
    user: { id: userId },
  } = await getTokenUser();

  const queryTags =
    queryString && tags ? tags.map((t) => `${t}-${queryString}`) : [];

  const allTags = [
    "admin",
    ...queryTags,
    ...(includeUserTag ? [String(userId)] : []),
  ];

  if (fresh) {
    allTags.forEach(updateTag);
  }

  const useCache = force || fresh;

  const init: { cache?: RequestCache; next?: NextFetchRequestConfig } = {
    cache: useCache ? "force-cache" : "no-store",
    next: useCache ? { tags: allTags, revalidate } : undefined,
  };

  return { finalUrl, init, tags: allTags };
};

async function request<TResponse, TBody = undefined>(
  method: HttpMethod,
  url: string,
  options: RequestOptions<TBody> = {}
): Promise<TResponse | never> {
  const fullUrl = url.startsWith("http") ? url : `${baseURL}${url}`;
  const { headers = {}, body, signal, cache, next } = options;

  const cookieStore = await cookies();
  const token = cookieStore.get(ACCESS_TOKEN_NAME)?.value;

  try {
    const response = await fetch(fullUrl, {
      method,
      headers: {
        "Content-Type": "application/json",
        ...(token ? { Authorization: `Bearer ${token}` } : {}),
        ...headers,
      },
      body: body !== undefined ? JSON.stringify(body) : undefined,
      signal,
      cache,
      next,
    });

    if (!response.ok) {
      const errorText = await extractErrorMessage(response);
      console.error(errorText + " url: " + fullUrl);
      throw new ApiError(response.status, errorText);
    }
    return (await response.json()) as TResponse;
  } catch (error) {
    if (error instanceof ApiError) {
      if (error.status === 404) notFound();
      if (error.status === 403) forbidden();
      throw error;
    }
    throw await handleApiError(error);
  }
}

async function extractErrorMessage(response: Response): Promise<string> {
  try {
    const data = await response.json();
    console.error(data?.errors);

    if (typeof data?.message === "string") {
      return data.message;
    }
  } catch (e) {
    console.error(e);
  }
  return response.statusText || "API Error";
}

async function handleApiError(error: unknown): Promise<never> {
  if (error instanceof Error) {
    throw new ApiError(500, error.message);
  }
  throw new ApiError(500, "An unknown error occurred");
}

export async function apiGet<TResponse>(
  args: CachedGetArgs & { options?: RequestOptions<undefined> }
) {
  const { finalUrl, init } = await buildCachedRequest(args);
  return request<TResponse>("GET", finalUrl, {
    ...init,
    ...(args.options ?? {}),
  });
}

export async function apiPost<TResponse, TBody>(
  url: string,
  body?: TBody,
  options?: RequestOptions<TBody>
) {
  return request<TResponse, TBody>("POST", url, { ...options, body });
}

export async function apiPut<TResponse, TBody>(
  url: string,
  body: TBody,
  options?: RequestOptions<TBody>
) {
  return request<TResponse, TBody>("PUT", url, { ...options, body });
}

export async function apiDelete<TResponse>(
  url: string,
  options?: RequestOptions<undefined>
) {
  return request<TResponse>("DELETE", url, options);
}
