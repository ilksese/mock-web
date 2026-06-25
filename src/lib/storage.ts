const KEYS = {
  RECENT_WORKSPACES: "mockweb_recent_workspaces",
  ACTIVE_WORKSPACE: "mockweb_active_workspace",
};

export interface RecentWorkspace {
  id: string;
  name: string;
}

export function getRecentWorkspaces(): RecentWorkspace[] {
  try {
    const raw = JSON.parse(localStorage.getItem(KEYS.RECENT_WORKSPACES) || "[]");
    if (!Array.isArray(raw)) return [];
    return raw.filter((x) => x && typeof x.id === "string" && typeof x.name === "string");
  } catch {
    return [];
  }
}

export function addRecentWorkspace(id: string, name: string): void {
  const list = getRecentWorkspaces().filter((x) => x.id !== id);
  list.unshift({ id, name });
  localStorage.setItem(KEYS.RECENT_WORKSPACES, JSON.stringify(list.slice(0, 10)));
}

export function removeRecentWorkspace(id: string): void {
  const list = getRecentWorkspaces().filter((x) => x.id !== id);
  localStorage.setItem(KEYS.RECENT_WORKSPACES, JSON.stringify(list));
}

export function clearActiveWorkspace(): void {
  localStorage.removeItem(KEYS.ACTIVE_WORKSPACE);
}

export function getActiveWorkspace(): { id: string; key: string } | null {
  try {
    return JSON.parse(localStorage.getItem(KEYS.ACTIVE_WORKSPACE) || "null");
  } catch {
    return null;
  }
}

export function setActiveWorkspace(id: string, key: string): void {
  localStorage.setItem(KEYS.ACTIVE_WORKSPACE, JSON.stringify({ id, key }));
}