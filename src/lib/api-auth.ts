import { getSession } from "next-auth/react";

/**
 * Fetch wrapper that automatically includes the backend authentication token
 * Use this for API calls that require authentication
 */
export async function fetchWithAuth(url: string, options: RequestInit = {}) {
  const session = await getSession();

  if (!session?.backendToken) {
    throw new Error("Not authenticated. Please sign in first.");
  }

  const headers = {
    "Content-Type": "application/json",
    Accept: "application/json",
    Authorization: `Bearer ${session.backendToken}`,
    ...options.headers,
  };

  const apiUrl = process.env.NEXT_PUBLIC_API_BASE_URL || "http://127.0.0.1:8000";
  const fullUrl = url.startsWith("http") ? url : `${apiUrl}${url}`;

  const response = await fetch(fullUrl, {
    ...options,
    headers,
  });

  if (!response.ok) {
    if (response.status === 401) {
      throw new Error("Authentication failed. Please sign in again.");
    }
    const errorData = await response.json().catch(() => ({}));
    throw new Error(errorData.message || `API error: ${response.status}`);
  }

  return response.json();
}

/**
 * Example usage in your components:
 *
 * // Get user profile
 * const profile = await fetchWithAuth('/api/customer-profile');
 *
 * // Place an order
 * const order = await fetchWithAuth('/api/place-order', {
 *   method: 'POST',
 *   body: JSON.stringify({ items: [...], address_id: 1 }),
 * });
 *
 * // Update user info
 * const updated = await fetchWithAuth('/api/update-profile', {
 *   method: 'PUT',
 *   body: JSON.stringify({ name: 'New Name' }),
 * });
 *
 * // Delete something
 * await fetchWithAuth(`/api/cart-item/${itemId}`, {
 *   method: 'DELETE',
 * });
 */
