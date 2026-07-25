INSERT INTO tenants (id, name) VALUES ('tenant_demo', 'Demo Tenant');

INSERT INTO projects (id, tenant_id, name, status)
VALUES
  ('project_alpha', 'tenant_demo', 'Alpha', 'active'),
  ('project_archive', 'tenant_demo', 'Archive', 'archived');

