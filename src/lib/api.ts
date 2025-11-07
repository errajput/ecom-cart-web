export const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL;

export async function fetchAPI(endpoint: string, options?: RequestInit) {
  const res = await fetch(`${API_BASE_URL}${endpoint}`, {
    headers: { "Content-Type": "application/json" },
    ...options,
  });
  if (!res.ok) throw new Error(`API Error: ${res.statusText}`);
  return res.json();
}
