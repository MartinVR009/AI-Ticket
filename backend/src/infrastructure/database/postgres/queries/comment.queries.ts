export const COMMENT_QUERIES = {
  INSERT: `
    INSERT INTO comments (ticket_id, author, content, created_at)
    VALUES ($1, $2, $3, $4)
    RETURNING id, ticket_id, author, content, created_at;
  `,

  SELECT_BY_TICKET_ID: `
    SELECT id, ticket_id, author, content, created_at
    FROM comments
    WHERE ticket_id = $1
    ORDER BY created_at ASC;
  `
};
