# Slooze - Role-Based Food Ordering App 🍱

A premium, full-stack food ordering application built with **NestJS**, **Next.js**, **GraphQL**, and **Prisma**. It features a stunning monochrome minimalist design, animated notifications, and a robust role-based access control system for global team management.

## 🚀 Quick Start

### 1. Prerequisite
- Node.js (v18+)
- npm or pnpm

### 2. Backend Setup (NestJS)
```bash
cd backend
npm install
npx prisma migrate dev --name init
npm run seed
npm run start:dev
```
- **GraphQL Playground**: `http://localhost:4000/graphql`

### 3. Frontend Setup (Next.js)
```bash
cd frontend
npm install
npm run dev
```
- **URL**: `http://localhost:3000`

---

## 🔑 Demo Credentials

Use the following accounts to test role-based functionality:

| Role | Email | Password |
| :--- | :--- | :--- |
| **Admin** | `nick.fury@slooze.com` | `password123` |
| **Manager** | `captain.marvel@slooze.com` | `password123` |
| **Member** | `thanos@slooze.com` | `password123` |

---

## ✨ Features

- **Role-Based Access Control**: Different UI and permissions for Admins, Managers (regional isolation), and Members.
- **Premium Design System**: Monochrome minimalist aesthetic with high-performance blurred backgrounds and smooth transitions.
- **Animated Notifications**: Success/Warning/Error alerts with elastic entrance animations and auto-dismiss.
- **Restaurant Management**: View menus, select items, and manage regional restaurants.
- **Order Lifecycle**: Seamless flow from selection to checkout and cancellation.
- **Payment Management**: Securely add and manage credit/debit cards (Manager/Admin only).

## 🛠 Tech Stack
- **Frontend**: Next.js 15, Tailwind CSS, Radix UI, Apollo Client, Lucide Icons.
- **Backend**: NestJS, GraphQL (Code First), Prisma ORM, JWT Auth.
- **Database**: SQLite (Local development).

---

## 📽 Demo Script

To showcase the app's full capabilities:
1. **Browse & Select**: Login as `thanos@slooze.com` (Member). Browse restaurants and add "The Avengers Burger" to your order.
2. **Payment Add**: Logout and login as `captain.marvel@slooze.com` (Manager). Go to the **Payments** tab and add a mock credit card.
3. **Checkout**: Go to the **Orders** tab, find your pending order, click "Pay", select your newly added card, and watch the animated success notification.
4. **Admin View**: Logout and login as `nick.fury@slooze.com` (Admin) to see the global overview of all orders across the system.

---

## 📚 Deep Dive Resources

For a comprehensive understanding of the technical stack and internal logic, refer to these documents:

- **[Architecture & Design](ARCHITECTURE.md)**: Details on the NestJS/Next.js stack, Re-BAC security model, and monochrome design system.
- **[API Reference](API_REFERENCE.md)**: Full list of GraphQL queries and mutations with copy-pasteable example payloads.
- **[Database & Dataset Guide](DATABASE_GUIDE.md)**: Breakdown of the Prisma schema and the Marvel-themed test data.

