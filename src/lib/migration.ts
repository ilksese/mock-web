const VERSION_KEY = "mockweb_data_version";

export const CURRENT_VERSION = 1;

type Migration = () => void;

const migrations: Record<number, Migration> = {
  0: () => {
    const key = "mockweb_recent_workspaces";
    const raw = localStorage.getItem(key);
    if (!raw) return;
    try {
      const parsed = JSON.parse(raw);
      if (Array.isArray(parsed) && parsed.length > 0 && typeof parsed[0] === "string") {
        const migrated = parsed.map((id: string) => ({ id, name: id }));
        localStorage.setItem(key, JSON.stringify(migrated));
      }
    } catch { /* ignore */ }
  },
};

export function runMigrations(): boolean {
  const raw = localStorage.getItem(VERSION_KEY);
  const storedVersion = raw ? parseInt(raw, 10) : 0;

  if (Number.isNaN(storedVersion) || storedVersion < 0) {
    localStorage.setItem(VERSION_KEY, String(CURRENT_VERSION));
    return true;
  }

  if (storedVersion >= CURRENT_VERSION) return true;

  try {
    for (let v = storedVersion; v < CURRENT_VERSION; v++) {
      const migrate = migrations[v];
      if (migrate) migrate();
      localStorage.setItem(VERSION_KEY, String(v + 1));
    }
    return true;
  } catch {
    return false;
  }
}