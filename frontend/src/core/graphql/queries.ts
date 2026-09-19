import { gql } from '@apollo/client';

export const GET_TICKETS = gql`
  query GetTickets(
    $category: TicketCategory
    $priority: TicketPriority
    $status: TicketStatus
    $search: String
    $limit: Int
    $offset: Int
  ) {
    tickets(
      category: $category
      priority: $priority
      status: $status
      search: $search
      limit: $limit
      offset: $offset
    ) {
      totalCount
      tickets {
        id
        customerName
        requestText
        attachmentUrl
        category
        priority
        summary
        status
        owner
        createdAt
        updatedAt
      }
    }
  }
`;

export const GET_TICKET_DETAIL = gql`
  query GetTicketDetail($id: ID!) {
    ticket(id: $id) {
      id
      customerName
      requestText
      attachmentUrl
      category
      priority
      summary
      status
      owner
      createdAt
      updatedAt
      comments {
        id
        ticketId
        author
        content
        createdAt
      }
      auditLogs {
        id
        userId
        action
        resource
        resourceId
        details
        ipAddress
        createdAt
      }
    }
  }
`;

export const GET_HEALTH = gql`
  query GetHealth {
    health {
      status
      database
      aiService
      timestamp
    }
  }
`;
