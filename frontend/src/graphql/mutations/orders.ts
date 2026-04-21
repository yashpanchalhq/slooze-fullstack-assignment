import { gql } from '@apollo/client';

export const CREATE_ORDER = gql`
  mutation CreateOrder($createOrderInput: CreateOrderInput!) {
    createOrder(createOrderInput: $createOrderInput) {
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
    }
  }
`;

export const CANCEL_ORDER = gql`
  mutation CancelOrder($id: String!) {
    cancelOrder(id: $id) {
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
    }
  }
`;

export const CHECKOUT_ORDER = gql`
  mutation CheckoutOrder($id: String!, $paymentMethodId: String!) {
    checkoutOrder(id: $id, paymentMethodId: $paymentMethodId) {
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
