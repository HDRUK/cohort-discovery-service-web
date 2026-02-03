"use server";

import { ACCESS_TOKEN_NAME } from "@/config/internals";
import { cookies } from "next/headers";
import { ApiError } from "./https";
import { notFound, forbidden } from "next/navigation";
import { DEFAULT_REVALIDATE } from "@/config/defaults";
import { getTokenUser } from "./auth";
import { CacheOptions } from "@/types/api";
import { paramsToString } from "@/utils/string";

const baseURL = process.env.API_BASE_URL ?? "http://localhost:8100";

type HttpMethod = "GET" | "POST" | "PUT" | "DELETE";

export enum ErrorMode {
  THROW = "throw",
  RESULT = "result",
}

export interface RequestOptions<B = unknown> {
  headers?: Record<string, string>;
  body?: B;
  signal?: AbortSignal;
  cache?: RequestCache;
  next?: NextFetchRequestConfig;
  errorMode?: ErrorMode;
}

export type CachedGetArgs = {
  url: string;
  params?: URLSearchParams | string;
  tags?: string[];
  cacheOptions?: CacheOptions;
  includeUserTag?: boolean;
  revalidate?: number;
};

const buildCachedRequest = async ({
  url,
  params,
  tags,
  cacheOptions,
  includeUserTag = true,
  revalidate = DEFAULT_REVALIDATE,
}: CachedGetArgs) => {
  const { useCache = true } = cacheOptions ?? {};

  const queryString = paramsToString(params);
  const finalUrl = queryString ? `${url}?${queryString}` : url;

  const {
    user: { id: userId },
  } = await getTokenUser();

  const queryTags =
    queryString && tags ? tags.map((t) => `${t}-${queryString}`) : [];

  const allTags = [
    "admin",
    ...(tags ? tags : []),
    ...queryTags,
    ...(includeUserTag ? [String(userId)] : []),
  ];

  const init: { cache?: RequestCache; next?: NextFetchRequestConfig } = {
    cache: useCache ? "force-cache" : "no-store",
    next: useCache ? { tags: allTags, revalidate } : undefined,
  };

  return { finalUrl, init, tags: allTags };
};

async function request<TResponse, TBody = undefined>(
  method: HttpMethod,
  url: string,
  options: RequestOptions<TBody> = {},
): Promise<TResponse | never> {
  const fullUrl = url.startsWith("http") ? url : `${baseURL}${url}`;
  const {
    headers = {},
    body,
    signal,
    cache,
    next,
    errorMode = ErrorMode.THROW,
  } = options;

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
      if (errorMode === ErrorMode.RESULT)
        return {
          data: null,
          error: { text: errorText, code: response.status },
        } as TResponse;

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
  args: CachedGetArgs & { options?: RequestOptions<undefined> },
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
  options?: RequestOptions<TBody>,
) {
  return request<TResponse, TBody>("POST", url, { ...options, body });
}

export async function apiPut<TResponse, TBody>(
  url: string,
  body: TBody,
  options?: RequestOptions<TBody>,
) {
  return request<TResponse, TBody>("PUT", url, { ...options, body });
}

export async function apiDelete<TResponse>(
  url: string,
  options?: RequestOptions<undefined>,
) {
  return request<TResponse>("DELETE", url, options);
}
