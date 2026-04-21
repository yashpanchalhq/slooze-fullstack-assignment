# API Reference & Collection 📝

Slooze uses a **GraphQL API** for all operations. This document outlines the available Queries and Mutations, along with example payloads to test using the GraphQL Playground (`http://localhost:4000/graphql`).

---

## 🔐 Authentication

### Login
Authenticate a user and receive a JWT token.
```graphql
mutation Login($email: String!, $password: String!) {
  login(loginInput: { email: $email, password: $password }) {
    access_token
    user {
      id
      email
      name
      role
      country
    }
  }
}
```

### Sign Up
Register a new user in a specific region.
```graphql
mutation SignUp($email: String!, $password: String!, $name: String!, $role: Role!, $country: Country!) {
  signUp(signUpInput: { 
    email: $email, 
    password: $password, 
    name: $name, 
    role: $role, 
    country: $country 
  }) {
    access_token
    user {
      id
      email
      role
    }
  }
}
```

---

## 🍽 Restaurants & Discovery

### Get All Restaurants
*Note: Results are automatically filtered by your user's country.*
```graphql
query GetRestaurants {
  restaurants {
    id
    name
    description
    country
    menuItems {
      id
      name
      price
    }
  }
}
```

### Get Menu Items
```graphql
query GetMenuItems($restaurantId: String!) {
  menuItems(restaurantId: $restaurantId) {
    id
    name
    price
    description
  }
}
```

---

## 🛒 Ordering Flow

### Create Order (Pending)
```graphql
mutation CreateOrder($restaurantId: String!, $items: [OrderItemInput!]!) {
  createOrder(createOrderInput: { 
    restaurantId: $restaurantId, 
    items: $items 
  }) {
    id
    totalAmount
    status
    createdAt
  }
}
```

### Checkout & Pay
```graphql
mutation Checkout($orderId: String!, $paymentMethodId: String!) {
  checkoutOrder(checkoutInput: { 
    orderId: $orderId, 
    paymentMethodId: $paymentMethodId 
  }) {
    id
    status
    payment {
      id
      amount
      status
    }
  }
}
```

### Cancel Order
```graphql
mutation Cancel($orderId: String!) {
  cancelOrder(orderId: $orderId) {
    id
    status
  }
}
```

---

## 💳 Payment Methods (Admin/Manager)

### Add Card
```graphql
mutation AddPaymentMethod($type: String!, $lastFour: String!, $provider: String!) {
  createPaymentMethod(createPaymentMethodInput: { 
    type: $type, 
    lastFour: $lastFour, 
    provider: $provider 
  }) {
    id
    lastFour
    provider
  }
}
```

### List My Cards
```graphql
query GetMyCards {
  paymentMethods {
    id
    type
    lastFour
    provider
    isDefault
  }
}
```
