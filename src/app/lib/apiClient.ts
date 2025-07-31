"use server";

const baseURL = process.env.API_BASE_URL ?? "http://localhost:8100";

type HttpMethod = "GET" | "POST" | "PUT" | "DELETE";

interface RequestOptions<B = unknown> {
  headers?: Record<string, string>;
  body?: B;
  signal?: AbortSignal;
}

async function request<TResponse, TBody = undefined>(
  method: HttpMethod,
  url: string,
  options: RequestOptions<TBody> = {}
): Promise<TResponse | never> {
  const fullUrl = `${baseURL}${url}`;
  const { headers = {}, body, signal } = options;

  console.log(`[API REQUEST] ${method} ${fullUrl}`);

  try {
    const response = await fetch(fullUrl, {
      method,
      headers: {
        "Content-Type": "application/json",
        ...headers,
      },
      body: body !== undefined ? JSON.stringify(body) : undefined,
      signal,
    });

    if (!response.ok) {
      const errorText = await extractErrorMessage(response);
      throw new Error(errorText);
    }

    return (await response.json()) as TResponse;
  } catch (error) {
    throw await handleApiError(error);
  }
}

async function extractErrorMessage(response: Response): Promise<string> {
  try {
    const data = await response.json();
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
    throw new Error(error.message);
  }
  throw new Error("An unknown error occurred");
}

export async function apiGet<TResponse>(
  url: string,
  options?: RequestOptions<undefined>
) {
  return request<TResponse>("GET", url, options);
}

export async function apiPost<TResponse, TBody>(
  url: string,
  body: TBody,
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
