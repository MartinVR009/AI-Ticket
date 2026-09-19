import { gql } from '@apollo/client';

export const CREATE_TICKET = gql`
  mutation CreateTicket($input: CreateTicketInput!) {
    createTicket(input: $input) {
      ticket {
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
      }
      userErrors
    }
  }
`;

export const UPDATE_TICKET = gql`
  mutation UpdateTicket($input: UpdateTicketInput!) {
    updateTicket(input: $input) {
      ticket {
        id
        status
        owner
        updatedAt
      }
      userErrors
    }
  }
`;

export const CLASSIFY_TICKET = gql`
  mutation ClassifyTicket($input: ClassifyTicketInput!) {
    classifyTicket(input: $input) {
      ticket {
        id
        category
        priority
        summary
        updatedAt
      }
      userErrors
    }
  }
`;

export const ADD_COMMENT = gql`
  mutation AddComment($input: AddCommentInput!) {
    addComment(input: $input) {
      comment {
        id
        ticketId
        author
        content
        createdAt
      }
      ticket {
        id
        updatedAt
      }
      userErrors
    }
  }
`;
