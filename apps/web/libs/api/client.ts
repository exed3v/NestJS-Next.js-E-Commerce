const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3001";

export class ApiError extends Error {
  constructor(
    public status: number,
    message: string,
  ) {
    super(message);
    this.name = "ApiError";
  }
}

export async function fetchClient<T>(
  endpoint: string,
  options: RequestInit = {},
): Promise<T> {
  const res = await fetch(`${API_URL}${endpoint}`, {
    ...options,
    headers: {
      "Content-Type": "application/json",
      ...options.headers,
    },
    credentials: "include",
  });

  const data = await res.json().catch(() => ({}));

  if (!res.ok) {
    throw new ApiError(
      res.status,
      data.message || `Error ${res.status}: ${res.statusText}`,
    );
  }

  return data;
}
