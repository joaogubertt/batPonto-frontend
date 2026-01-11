import { getApiBaseUrl } from "../config/env";

type HttpMethod = "GET" | "POST" | "PUT" | "PATCH" | "DELETE";

type RequestOptions = {
  method: HttpMethod;
  path: string;
  query?: Record<string, string | number | boolean | undefined>;
  body?: unknown;
  auth?: boolean;
  headers?: Record<string, string>;
};

function buildUrl(path: string, query?: RequestOptions["query"]) {
  const baseUrl = getApiBaseUrl();
  const url = new URL(baseUrl + path);

  if (query) {
    Object.entries(query).forEach(([k, v]) => {
      if (v !== undefined) url.searchParams.set(k, String(v));
    });
  }

  return url.toString();
}

export async function http<T>(options: RequestOptions): Promise<T> {
  const auth = options.auth ?? true;

  const headers: Record<string, string> = {
    ...(options.headers ?? {}),
  };

  if (options.body !== undefined) {
    headers["Content-Type"] = "application/json";
  }

  if (auth) {
    const token = localStorage.getItem("token");
    if (!token) throw new Error("Usuário não autenticado.");
    headers["Authorization"] = `Bearer ${token}`;
  }

  const res = await fetch(buildUrl(options.path, options.query), {
    method: options.method,
    headers,
    body: options.body !== undefined ? JSON.stringify(options.body) : undefined,
  });

  if (!res.ok) {
    const message =
      (await res.json().catch(() => null))?.message ??
      `Erro ${res.status}: ${res.statusText}`;
    throw new Error(message);
  }

  // 204
  if (res.status === 204) return undefined as T;

  return (await res.json()) as T;
}

export async function httpBlob(options: RequestOptions): Promise<Blob> {
  const auth = options.auth ?? true;

  const headers: Record<string, string> = {
    ...(options.headers ?? {}),
  };

  if (auth) {
    const token = localStorage.getItem("token");
    if (!token) throw new Error("Usuário não autenticado.");
    headers["Authorization"] = `Bearer ${token}`;
  }

  const res = await fetch(buildUrl(options.path, options.query), {
    method: options.method,
    headers,
  });

  if (!res.ok) {
    const message =
      (await res.json().catch(() => null))?.message ??
      `Erro ${res.status}: ${res.statusText}`;
    throw new Error(message);
  }

  return await res.blob();
}