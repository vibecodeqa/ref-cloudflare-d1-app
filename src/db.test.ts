import { describe, expect, it } from "vitest";
import { listProjects } from "./db";

class FakeStatement {
  constructor(
    private readonly sql: string,
    private values: unknown[] = []
  ) {}

  bind(...values: unknown[]) {
    return new FakeStatement(this.sql, values);
  }

  async all<T>() {
    if (!this.sql.includes("WHERE tenant_id = ?")) throw new Error("tenant predicate missing");
    if (this.sql.includes("${") || this.sql.includes(" + ")) throw new Error("dynamic SQL detected");
    const tenantId = this.values[0];
    const status = this.values[1];
    const rows = [
      { id: "project_alpha", tenant_id: "tenant_demo", name: "Alpha", status: "active" },
      { id: "project_archive", tenant_id: "tenant_demo", name: "Archive", status: "archived" }
    ].filter((row) => row.tenant_id === tenantId && (!status || row.status === status));
    return { results: rows as T[] };
  }
}

const fakeDb = {
  prepare(sql: string) {
    return new FakeStatement(sql);
  }
} as unknown as D1Database;

describe("D1 query helpers", () => {
  it("uses tenant and status values through prepared statement bindings", async () => {
    await expect(listProjects(fakeDb, { tenantId: "tenant_demo", status: "active" })).resolves.toEqual([
      { id: "project_alpha", tenant_id: "tenant_demo", name: "Alpha", status: "active" }
    ]);
  });

  it("rejects invalid status before SQL is prepared", async () => {
    await expect(listProjects(fakeDb, { tenantId: "tenant_demo", status: "DROP TABLE projects" })).rejects.toThrow();
  });
});

