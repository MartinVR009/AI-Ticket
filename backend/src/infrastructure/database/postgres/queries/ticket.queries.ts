export const TICKET_QUERIES = {
  INSERT: `
    INSERT INTO tickets (
      customer_name, request_text, attachment_url, category, priority, summary, status, owner, ai_raw_response, created_at, updated_at
    )
    VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11)
    RETURNING id, customer_name, request_text, attachment_url, category, priority, summary, status, owner, ai_raw_response, created_at, updated_at;
  `,

  SELECT_BY_ID: `
    SELECT id, customer_name, request_text, attachment_url, category, priority, summary, status, owner, ai_raw_response, created_at, updated_at
    FROM tickets
    WHERE id = $1;
  `,

  UPDATE: `
    UPDATE tickets
    SET
      customer_name = $2,
      request_text = $3,
      attachment_url = $4,
      category = $5,
      priority = $6,
      summary = $7,
      status = $8,
      owner = $9,
      ai_raw_response = $10,
      updated_at = $11
    WHERE id = $1
    RETURNING id, customer_name, request_text, attachment_url, category, priority, summary, status, owner, ai_raw_response, created_at, updated_at;
  `,

  DELETE: `
    DELETE FROM tickets
    WHERE id = $1;
  `
};
