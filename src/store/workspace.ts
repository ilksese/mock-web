import { createSignal } from "solid-js";
import { getActiveWorkspace, setActiveWorkspace, addRecentWorkspace } from "../lib/storage";

const [currentWorkspace, setCurrentWorkspace] = createSignal<{ id: string; key: string } | null>(
  getActiveWorkspace()
);

export function useWorkspaceStore() {
  const setWorkspace = (id: string, key: string, name?: string) => {
    setActiveWorkspace(id, key);
    if (name) addRecentWorkspace(id, name);
    setCurrentWorkspace({ id, key });
  };

  return { currentWorkspace, setWorkspace };
}