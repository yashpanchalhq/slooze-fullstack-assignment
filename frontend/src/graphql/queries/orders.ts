import { gql } from '@apollo/client';

export const GET_ORDERS = gql`
  query GetOrders {
    orders {
      id
      userId
      status
      totalAmount
      country
      createdAt
      updatedAt
      orderItems {
        id
        menuItemId
        quantity
        price
        menuItem {
          id
          name
          description
          price
        }
      }
      payment {
        id
        amount
        status
        paymentMethod {
          id
          type
          lastFour
          provider
        }
      }
    }
  }
`;

export const GET_ORDER = gql`
  query GetOrder($id: String!) {
    order(id: $id) {
      id
      userId
      status
      totalAmount
      country
      createdAt
      updatedAt
      orderItems {
        id
        menuItemId
        quantity
        price
        menuItem {
          id
          name
          description
          price
        }
      }
      payment {
        id
        amount
        status
        paymentMethod {
          id
          type
          lastFour
          provider
        }
      }
    }
  }
`;
