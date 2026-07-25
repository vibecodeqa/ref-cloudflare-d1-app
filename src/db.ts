import { z } from "zod";

export interface Env {
  DB: D1Database;
}

export const projectSchema = z.object({
  id: z.string().min(1),
  tenant_id: z.string().min(1),
  name: z.string().min(1),
  status: z.enum(["active", "archived"])
});

export const listQuerySchema = z.object({
  tenantId: z.string().min(1),
  status: z.enum(["active", "archived"]).optional()
});

export type Project = z.infer<typeof projectSchema>;

export async function listProjects(db: D1Database, input: unknown): Promise<Project[]> {
  const query = listQuerySchema.parse(input);

  const statement = query.status
    ? db.prepare(
        "SELECT id, tenant_id, name, status FROM projects WHERE tenant_id = ? AND status = ? ORDER BY created_at DESC"
      ).bind(query.tenantId, query.status)
    : db.prepare(
        "SELECT id, tenant_id, name, status FROM projects WHERE tenant_id = ? ORDER BY created_at DESC"
      ).bind(query.tenantId);

  const result = await statement.all<Project>();
  return result.results.map((row) => projectSchema.parse(row));
}

