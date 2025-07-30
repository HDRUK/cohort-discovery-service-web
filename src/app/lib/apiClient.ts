import axios from "axios";

const apiClient = axios.create({
  baseURL: process.env.API_BASE_URL ?? "http://localhost:8100",
  headers: {
    "Content-Type": "application/json",
  },
  maxBodyLength: Infinity,
  timeout: 10000,
});

apiClient.interceptors.request.use((config) => {
  console.log(`[API REQUEST] ${config.method?.toUpperCase()} ${config.url}`);
  return config;
});

export function handleApiError(error: unknown): never {
  if (axios.isAxiosError(error)) {
    throw new Error(error.response?.data?.message || error.message);
  } else if (error instanceof Error) {
    throw error;
  } else {
    throw new Error("An unknown error occurred");
  }
}

export default apiClient;
