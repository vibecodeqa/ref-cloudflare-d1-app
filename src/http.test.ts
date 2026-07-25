import { describe, expect, it } from "vitest";
import { handleRequest } from "./http";

const fakeDb = {
  prepare() {
    return {
      bind() {
        return {
          async all() {
            return { results: [{ id: "project_alpha", tenant_id: "tenant_demo", name: "Alpha", status: "active" }] };
          }
        };
      }
    };
  }
} as unknown as D1Database;

describe("Worker HTTP boundary", () => {
  it("requires tenant context for tenant-owned data", async () => {
    const response = await handleRequest(new Request("https://example.test/projects"), { DB: fakeDb });
    expect(response.status).toBe(403);
  });

  it("returns tenant-scoped projects", async () => {
    const response = await handleRequest(
      new Request("https://example.test/projects?status=active", { headers: { "x-tenant-id": "tenant_demo" } }),
      { DB: fakeDb }
    );

    expect(response.status).toBe(200);
    await expect(response.json()).resolves.toEqual({
      projects: [{ id: "project_alpha", tenant_id: "tenant_demo", name: "Alpha", status: "active" }]
    });
  });
});

