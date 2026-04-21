import { gql } from '@apollo/client';

export const GET_RESTAURANTS = gql`
  query GetRestaurants {
    restaurants {
      id
      name
      description
      country
      createdAt
      updatedAt
      menuItems {
        id
        name
        description
        price
        restaurantId
      }
    }
  }
`;

export const GET_RESTAURANT = gql`
  query GetRestaurant($id: String!) {
    restaurant(id: $id) {
      id
      name
      description
      country
      createdAt
      updatedAt
      menuItems {
        id
        name
        description
        price
        restaurantId
      }
    }
  }
`;

export const GET_MENU_ITEMS = gql`
  query GetMenuItems($restaurantId: String!) {
    menuItems(restaurantId: $restaurantId) {
      id
      name
      description
      price
      restaurantId
    }
  }
`;
