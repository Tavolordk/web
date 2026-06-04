const API_URL = process.env.NEXT_PUBLIC_API_URL;

if (!API_URL) {
  throw new Error('NEXT_PUBLIC_API_URL no está definida');
}

export async function apiFetch<T>(
  path: string,
  options?: RequestInit,
): Promise<T> {
  const response = await fetch(`${API_URL}${path}`, {
    ...options,
    headers: {
      'Content-Type': 'application/json',
      ...options?.headers,
    },
    cache: 'no-store',
  });

  if (!response.ok) {
    const errorText = await response.text();

    throw new Error(
      `API Error ${response.status}: ${errorText || response.statusText}`,
    );
  }

  return response.json() as Promise<T>;
}