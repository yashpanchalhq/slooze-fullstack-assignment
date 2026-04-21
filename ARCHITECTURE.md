# Technical Architecture & Design 🏗️

This document provides a deep dive into the technical design, architectural patterns, and security models used in the Slooze application.

---

## 🏗️ System Overview

The application follows a modern **Decoupled Architecture** with a clear separation between the presentation layer and the business logic layer.

### Frontend (Next.js 15)
- **Framework**: React with Next.js App Router for server-side optimization and client-side interactivity.
- **State Management**: React Context API for lightweight, high-performance auth and notification states.
- **Data Fetching**: Apollo Client (GraphQL) with normalized caching for efficient data synchronization.
- **Styling**: Tailwind CSS with custom monochrome design tokens for a Brutalist-minimalist aesthetic.

### Backend (NestJS)
- **Framework**: NestJS (TypeScript) utilizing a Modular architecture for scalability.
- **API Engine**: GraphQL (Code First approach) providing a type-safe interface for the frontend.
- **ORM**: Prisma for high-performance database interactions and type-safe schema management.
- **Database**: SQLite (Local Dev) for zero-config persistence.

---

## 🔐 Security & Access Control (Re-BAC)

Slooze implements a **Relationship-Based Access Control (Re-BAC)** model to enforce regional data isolation.

### 🏠 Regional Isolation
The platform is designed to be multi-tenant by country.
- **Entity Binding**: Every `User`, `Restaurant`, and `Order` is bound to a `Country`.
- **Automatic Filtering**: Resolvers automatically extract the `Country` from the authenticated JWT and inject it into Prisma queries.
- **Isolation Scope**:
  - **Members**: Can only see restaurants and menu items in their own country.
  - **Managers**: Can only manage restaurants and approve orders within their specific region.
  - **Admins**: Bypass regional checks for global oversight.

### 🛡️ Authentication
- **JWT (JSON Web Tokens)**: Secure, stateless authentication.
- **Passport.js**: Integrated with NestJS for robust strategy management.
- **Bcrypt**: Multi-round hashing for password security.

---

## ✨ Design System Principles

The UI follows a strict **"Inter-Slooze" Monochrome Design System**:
1. **Contrast-First**: Using `#0a0a0a` (Deep Carbon) and `#fafafa` (Pure Ghost) for maximum readability and a premium vibe.
2. **Glassmorphism**: Subtle `backdrop-blur` and opacity adjustments for floating elements (Toasts, Modals).
3. **Elastic Motion**: High-performance CSS keyframes with `cubic-bezier(0.19, 1, 0.22, 1)` easing to provide a "tactile" digital experience.
4. **Contextual Feedback**: Global notification provider triggered by GraphQL lifecycle events.

---

## 🛠 Patterns & Best Practices
- **Dependency Injection**: NestJS's core DI system is used for loose coupling between Services and Resolvers.
- **DTOs (Data Transfer Objects)**: Strict Input validation using `class-validator`.
- **Hybrid Components**: Next.js Server Components for layout and Client Components for interactive ordering flows.
