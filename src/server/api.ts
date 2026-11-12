import "server-only";

import { notFound, redirect } from "next/navigation";
import { ApiError } from "@/lib/https";
import { ReadArgs } from "@/types/api";
import { canonicaliseQueryString } from "@/utils/string";

const baseURL = process.env.API_BASE_URL ?? "http://localhost:8100";

type HttpMethod = "GET" | "POST" | "PUT" | "DELETE";

export enum ErrorMode {
  THROW = "throw",
  RESULT = "result",
}

export interface ReadOptions extends ReadArgs {
  errorMode?: ErrorMode;
}

export interface RequestOptions<B = undefined> {
  params?: URLSearchParams | string;
  body?: B;
  errorMode?: ErrorMode;
}

const buildUrl = (path: string, params?: URLSearchParams | string) => {
  if (!path.startsWith("/"))
    throw new Error(`API path must be relative: ${path}`);
  const queryString = canonicaliseQueryString(params);
  return `${baseURL}${path}${queryString ? `?${queryString}` : ""}`;
};

export async function request<TResponse, TBody = undefined>(
  token: string | null,
  method: HttpMethod,
  path: string,
  { params, body, errorMode = ErrorMode.THROW }: RequestOptions<TBody> = {},
): Promise<TResponse> {
  const url = buildUrl(path, params);

  try {
    const response = await fetch(url, {
      method,
      headers: {
        "Content-Type": "application/json",
        ...(token ? { Authorization: `Bearer ${token}` } : {}),
      },
      body: body !== undefined ? JSON.stringify(body) : undefined,
      cache: "no-store",
    });

    if (!response.ok) {
      const errorText = await extractErrorMessage(response);
      if (errorMode === ErrorMode.RESULT)
        return {
          data: null,
          error: { text: errorText, code: response.status },
        } as TResponse;

      console.error(errorText + " url: " + url);
      throw new ApiError(response.status, errorText);
    }
    return (await response.json()) as TResponse;
  } catch (error) {
    if (error instanceof ApiError) {
      if (error.status === 404) notFound();
      if (error.status === 403) redirect("/403");
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

export const apiGet = <TResponse>(
  token: string | null,
  path: string,
  options?: Omit<RequestOptions, "body">,
) => request<TResponse>(token, "GET", path, options);

export const apiPost = <TResponse, TBody = undefined>(
  token: string | null,
  path: string,
  body?: TBody,
  options?: Omit<RequestOptions<TBody>, "body">,
) => request<TResponse, TBody>(token, "POST", path, { ...options, body });

export const apiPut = <TResponse, TBody = undefined>(
  token: string,
  path: string,
  body: TBody,
  options?: Omit<RequestOptions<TBody>, "body">,
) => request<TResponse, TBody>(token, "PUT", path, { ...options, body });

export const apiDelete = <TResponse>(
  token: string,
  path: string,
  options?: Omit<RequestOptions, "body">,
) => request<TResponse>(token, "DELETE", path, options);
