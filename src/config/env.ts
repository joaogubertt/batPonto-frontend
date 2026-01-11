export const env = {
  apiBaseUrl: import.meta.env.VITE_API_BASE_URL as string | undefined,
};

export function getApiBaseUrl(): string {
  const url = env.apiBaseUrl?.trim();
  if (!url) {
    throw new Error("VITE_API_BASE_URL is not set. Check your .env file.");
  }
  return url.replace(/\/$/, "");
}