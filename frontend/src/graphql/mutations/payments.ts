import { gql } from '@apollo/client';

export const GET_PAYMENT_METHODS = gql`
  query GetPaymentMethods {
    paymentMethods {
      id
      userId
      type
      lastFour
      provider
      isDefault
      createdAt
      updatedAt
    }
  }
`;

export const CREATE_PAYMENT_METHOD = gql`
  mutation CreatePaymentMethod($createPaymentMethodInput: CreatePaymentMethodInput!) {
    createPaymentMethod(createPaymentMethodInput: $createPaymentMethodInput) {
      id
      userId
      type
      lastFour
      provider
      isDefault
      createdAt
      updatedAt
    }
  }
`;

export const UPDATE_PAYMENT_METHOD = gql`
  mutation UpdatePaymentMethod($id: String!, $updateData: UpdatePaymentMethodInput!) {
    updatePaymentMethod(id: $id, updateData: $updateData) {
      id
      userId
      type
      lastFour
      provider
      isDefault
      createdAt
      updatedAt
    }
  }
`;

export const DELETE_PAYMENT_METHOD = gql`
  mutation DeletePaymentMethod($id: String!) {
    deletePaymentMethod(id: $id) {
      id
      userId
      type
      lastFour
      provider
      isDefault
      createdAt
      updatedAt
    }
  }
`;
