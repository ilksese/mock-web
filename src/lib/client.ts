const BASE = "/_manage";

async function request<T>(path: string, options: RequestInit = {}): Promise<T> {
  const headers: Record<string, string> = {
    "Content-Type": "application/json",
    ...(options.headers as Record<string, string> || {}),
  };

  const stored = localStorage.getItem("mockweb_active_workspace");
  if (stored) {
    try {
      const { key } = JSON.parse(stored);
      headers["Authorization"] = `Bearer ${key}`;
    } catch { /* ignore */ }
  }

  const res = await fetch(`${BASE}${path}`, { ...options, headers });
  if (!res.ok) {
    const err = await res.json().catch(() => ({ error: "Request failed" }));
    throw new Error(err.error || `HTTP ${res.status}`);
  }
  return res.json();
}

export const api = {
  createWorkspace: (name: string) =>
    request<any>("/workspaces", { method: "POST", body: JSON.stringify({ name }) }),

  getWorkspace: (id: string) => request<any>(`/workspaces/${id}`),

  deleteWorkspace: (id: string) =>
    request<any>(`/workspaces/${id}`, { method: "DELETE" }),

  getEndpoints: (wsId: string) =>
    request<any[]>(`/workspaces/${wsId}/endpoints`),

  getEndpoint: (wsId: string, epId: string) =>
    request<any>(`/workspaces/${wsId}/endpoints/${epId}`),

  createEndpoint: (wsId: string, data: { name: string; method: string; path: string; delayMs?: number }) =>
    request<any>(`/workspaces/${wsId}/endpoints`, { method: "POST", body: JSON.stringify(data) }),

  updateEndpoint: (wsId: string, epId: string, data: Record<string, any>) =>
    request<any>(`/workspaces/${wsId}/endpoints/${epId}`, { method: "PUT", body: JSON.stringify(data) }),

  deleteEndpoint: (wsId: string, epId: string) =>
    request<any>(`/workspaces/${wsId}/endpoints/${epId}`, { method: "DELETE" }),

  createResponseRule: (epId: string, data: Record<string, any>) =>
    request<any>(`/endpoints/${epId}/responses`, { method: "POST", body: JSON.stringify(data) }),

  updateResponseRule: (ruleId: string, data: Record<string, any>) =>
    request<any>(`/responses/${ruleId}`, { method: "PUT", body: JSON.stringify(data) }),

  deleteResponseRule: (ruleId: string) =>
    request<any>(`/responses/${ruleId}`, { method: "DELETE" }),
};