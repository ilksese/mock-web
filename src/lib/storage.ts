const KEYS = {
  RECENT_WORKSPACES: "mockweb_recent_workspaces",
  ACTIVE_WORKSPACE: "mockweb_active_workspace",
};

export function getRecentWorkspaces(): string[] {
  try {
    return JSON.parse(localStorage.getItem(KEYS.RECENT_WORKSPACES) || "[]");
  } catch {
    return [];
  }
}

export function addRecentWorkspace(id: string): void {
  const list = getRecentWorkspaces().filter((x) => x !== id);
  list.unshift(id);
  localStorage.setItem(KEYS.RECENT_WORKSPACES, JSON.stringify(list.slice(0, 10)));
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