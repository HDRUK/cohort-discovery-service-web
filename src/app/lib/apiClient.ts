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
): Promise<TResponse> {
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
      next: { revalidate: 0 }, // optional cache control
    });

    if (!response.ok) {
      const errorText = await extractErrorMessage(response);
      throw new Error(errorText);
    }

    return (await response.json()) as TResponse;
  } catch (error) {
    handleApiError(error);
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

export function handleApiError(error: unknown): never {
  if (error instanceof Error) {
    throw new Error(error.message);
  }
  throw new Error("An unknown error occurred");
}

export const apiClient = {
  get: <TResponse>(url: string, options?: RequestOptions<undefined>) =>
    request<TResponse>("GET", url, options),

  post: <TResponse, TBody>(
    url: string,
    body: TBody,
    options?: RequestOptions<TBody>
  ) => request<TResponse, TBody>("POST", url, { ...options, body }),

  put: <TResponse, TBody>(
    url: string,
    body: TBody,
    options?: RequestOptions<TBody>
  ) => request<TResponse, TBody>("PUT", url, { ...options, body }),

  delete: <TResponse>(url: string, options?: RequestOptions<undefined>) =>
    request<TResponse>("DELETE", url, options),
};

export default apiClient;
