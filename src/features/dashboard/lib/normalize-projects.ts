export type DashboardProject = {
  id: string;
  name: string;
  original_image_url: string | null;
  updated_at: string;
};

export function normalizeProjects(input: unknown): DashboardProject[] {
  if (!Array.isArray(input)) return [];

  return input
    .map((item) => {
      if (!item || typeof item !== 'object') return null;
      const value = item as Record<string, unknown>;

      const id = typeof value.id === 'string' ? value.id : '';
      const name = typeof value.name === 'string' ? value.name : 'Untitled Project';
      const original_image_url =
        typeof value.original_image_url === 'string' ? value.original_image_url : null;
      const updated_at =
        typeof value.updated_at === 'string' ? value.updated_at : new Date(0).toISOString();

      if (!id) return null;

      return {
        id,
        name,
        original_image_url,
        updated_at,
      };
    })
    .filter((project): project is DashboardProject => Boolean(project));
}