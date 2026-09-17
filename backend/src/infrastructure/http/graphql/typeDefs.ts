export const typeDefs = `#graphql
  enum TicketCategory {
    Finance
    Legal
    Procurement
    Operations
    Other
  }

  enum TicketPriority {
    High
    Medium
    Low
  }

  enum TicketStatus {
    open
    in_progress
    resolved
    closed
  }

  enum AuditAction {
    CREATE
    UPDATE
    DELETE
    AI_CLASSIFY
  }

  type Comment {
    id: ID!
    ticketId: ID!
    author: String!
    content: String!
    createdAt: String!
  }

  type AuditLog {
    id: ID!
    userId: String!
    action: AuditAction!
    resource: String!
    resourceId: Int
    details: String
    ipAddress: String
    createdAt: String!
  }

  type Ticket {
    id: ID!
    customerName: String!
    requestText: String!
    attachmentUrl: String
    category: TicketCategory
    priority: TicketPriority!
    summary: String
    status: TicketStatus!
    owner: String
    createdAt: String!
    updatedAt: String!
    comments: [Comment!]!
    auditLogs: [AuditLog!]!
  }

  type TicketConnection {
    tickets: [Ticket!]!
    totalCount: Int!
  }

  type HealthStatus {
    status: String!
    database: String!
    aiService: String!
    timestamp: String!
  }

  # --- Inputs ---
  input CreateTicketInput {
    customerName: String!
    requestText: String!
    attachmentUrl: String
    autoClassify: Boolean
  }

  input UpdateTicketInput {
    id: ID!
    status: TicketStatus
    owner: String
  }

  input ClassifyTicketInput {
    ticketId: ID!
  }

  input AddCommentInput {
    ticketId: ID!
    author: String
    content: String!
  }

  # --- Payloads ---
  type CreateTicketPayload {
    ticket: Ticket
    userErrors: [String!]
  }

  type UpdateTicketPayload {
    ticket: Ticket
    userErrors: [String!]
  }

  type ClassifyTicketPayload {
    ticket: Ticket
    userErrors: [String!]
  }

  type AddCommentPayload {
    comment: Comment
    ticket: Ticket
    userErrors: [String!]
  }

  type DeleteTicketPayload {
    success: Boolean!
    userErrors: [String!]
  }

  # --- Queries & Mutations ---
  type Query {
    tickets(
      category: TicketCategory
      priority: TicketPriority
      status: TicketStatus
      search: String
      limit: Int
      offset: Int
    ): TicketConnection!

    ticket(id: ID!): Ticket

    auditLogs(
      resource: String
      resourceId: Int
      limit: Int
    ): [AuditLog!]!

    health: HealthStatus!
  }

  type Mutation {
    createTicket(input: CreateTicketInput!): CreateTicketPayload!
    updateTicket(input: UpdateTicketInput!): UpdateTicketPayload!
    classifyTicket(input: ClassifyTicketInput!): ClassifyTicketPayload!
    addComment(input: AddCommentInput!): AddCommentPayload!
    deleteTicket(id: ID!): DeleteTicketPayload!
  }
`;
