import api from "@/utils/api/axios";

/**
 * Fetches data from the API using the configured axios instance
 * @param endpoint API endpoint to fetch from
 * @param options Additional fetch options
 * @returns The fetched data
 */
export async function fetchFromApi<T = any>(
  endpoint: string,
  options?: {
    method?: "GET" | "POST" | "PUT" | "DELETE" | "PATCH";
    body?: any;
    headers?: Record<string, string>;
  }
): Promise<T> {
  try {
    const method = options?.method || "GET";
    const url = endpoint.startsWith("/") ? endpoint : `/${endpoint}`;

    let response;

    switch (method) {
      case "GET":
        response = await api.get<T>(url, { headers: options?.headers });
        break;
      case "POST":
        response = await api.post<T>(url, options?.body, {
          headers: options?.headers,
        });
        break;
      case "PUT":
        response = await api.put<T>(url, options?.body, {
          headers: options?.headers,
        });
        break;
      case "DELETE":
        response = await api.delete<T>(url, {
          headers: options?.headers,
          data: options?.body,
        });
        break;
      case "PATCH":
        response = await api.patch<T>(url, options?.body, {
          headers: options?.headers,
        });
        break;
      default:
        throw new Error(`Unsupported method: ${method}`);
    }

    return response.data;
  } catch (error) {
    console.error(`API request failed for ${endpoint}:`, error);
    throw error;
  }
}
