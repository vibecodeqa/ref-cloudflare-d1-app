import { listProjects, type Env } from "./db";

export function json(data: unknown, init?: ResponseInit): Response {
  return new Response(JSON.stringify(data), {
    ...init,
    headers: {
      "content-type": "application/json; charset=utf-8",
      "cache-control": "no-store",
      ...init?.headers
    }
  });
}

export function tenantFromRequest(request: Request): string | null {
  return request.headers.get("x-tenant-id");
}

export async function handleRequest(request: Request, env: Env): Promise<Response> {
  const url = new URL(request.url);

  if (url.pathname === "/health") {
    return json({ ok: true, service: "ref-cloudflare-d1-app" });
  }

  if (url.pathname === "/projects") {
    const tenantId = tenantFromRequest(request);
    if (!tenantId) return json({ error: { code: "missing_tenant", message: "Tenant context is required" } }, { status: 403 });

    try {
      const status = url.searchParams.get("status") ?? undefined;
      const projects = await listProjects(env.DB, { tenantId, status });
      return json({ projects });
    } catch (error) {
      console.error("D1 project query failed", { path: url.pathname, error });
      return json({ error: { code: "query_failed", message: "Unable to load projects" } }, { status: 400 });
    }
  }

  return json({ error: { code: "not_found", message: "Route not found" } }, { status: 404 });
}

