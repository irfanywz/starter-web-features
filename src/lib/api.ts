import { env } from "@/lib/env";

export class ApiError extends Error {
  readonly status: number;
  readonly data: unknown;

  constructor(status: number, message: string, data?: unknown) {
    super(message);
    this.name = "ApiError";
    this.status = status;
    this.data = data;
  }
}

type QueryParams = Record<string, string | number | boolean | undefined>;

export interface RequestOptions extends Omit<RequestInit, "body" | "headers"> {
  body?: unknown;
  params?: QueryParams;
  headers?: Record<string, string>;
  /** Timeout dalam milidetik, default 15 detik. */
  timeout?: number;
}

function buildUrl(path: string, params?: QueryParams): string {
  const search = new URLSearchParams();
  Object.entries(params ?? {}).forEach(([key, value]) => {
    if (value !== undefined) search.set(key, String(value));
  });
  const query = search.toString();
  return `${env.apiBaseUrl}${path}${query ? `?${query}` : ""}`;
}

export async function request<T>(path: string, options: RequestOptions = {}): Promise<T> {
  const { body, params, headers, timeout = 15_000, ...init } = options;

  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), timeout);

  try {
    const res = await fetch(buildUrl(path, params), {
      ...init,
      signal: controller.signal,
      headers: {
        Accept: "application/json",
        ...(body !== undefined ? { "Content-Type": "application/json" } : {}),
        ...headers,
      },
      body: body !== undefined ? JSON.stringify(body) : undefined,
    });

    const contentType = res.headers.get("content-type") ?? "";
    const data: unknown = contentType.includes("application/json")
      ? await res.json()
      : await res.text();

    if (!res.ok) {
      const message =
        typeof data === "object" && data !== null && "message" in data
          ? String((data as { message: unknown }).message)
          : res.statusText || "Request gagal";
      throw new ApiError(res.status, message, data);
    }

    return data as T;
  } catch (err) {
    if (err instanceof DOMException && err.name === "AbortError") {
      throw new ApiError(408, "Request timeout");
    }
    throw err;
  } finally {
    clearTimeout(timer);
  }
}

export const api = {
  get: <T>(path: string, options?: RequestOptions) =>
    request<T>(path, { ...options, method: "GET" }),

  post: <T>(path: string, body?: unknown, options?: RequestOptions) =>
    request<T>(path, { ...options, method: "POST", body }),

  put: <T>(path: string, body?: unknown, options?: RequestOptions) =>
    request<T>(path, { ...options, method: "PUT", body }),

  patch: <T>(path: string, body?: unknown, options?: RequestOptions) =>
    request<T>(path, { ...options, method: "PATCH", body }),

  delete: <T>(path: string, options?: RequestOptions) =>
    request<T>(path, { ...options, method: "DELETE" }),
};
