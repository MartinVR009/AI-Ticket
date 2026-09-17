export const AUDIT_QUERIES = {
  INSERT: `
    INSERT INTO audit_logs (user_id, action, resource, resource_id, details, ip_address, created_at)
    VALUES ($1, $2, $3, $4, $5, $6, $7)
    RETURNING id, user_id, action, resource, resource_id, details, ip_address, created_at;
  `,

  SELECT_BY_RESOURCE: `
    SELECT id, user_id, action, resource, resource_id, details, ip_address, created_at
    FROM audit_logs
    WHERE resource = $1 AND resource_id = $2
    ORDER BY created_at DESC;
  `,

  SELECT_RECENT: `
    SELECT id, user_id, action, resource, resource_id, details, ip_address, created_at
    FROM audit_logs
    ORDER BY created_at DESC
    LIMIT $1;
  `
};
