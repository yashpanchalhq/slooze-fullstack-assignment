# Database Schema & Datasets 🗄️

Slooze uses **Prisma** with a **SQLite** database for local development. This document explains the data model and the Marvel-themed seed data used for testing.

---

## 📊 Data Model (ERD)

The schema is designed around the core entities of users, restaurants, and the ordering lifecycle.

### Core Entities
- **User**: The central actor. Bound to a `Country` and a `Role`.
- **Restaurant**: Regional food providers. Bound to a `Country`.
- **MenuItem**: Specific food items provided by a restaurant.
- **Order**: A collection of `OrderItems`. Transitions from `PENDING` -> `COMPLETED` or `CANCELLED`.
- **PaymentMethod**: Saved cards/accounts belonging to a user.
- **Payment**: The transaction link between an `Order` and a `PaymentMethod`.

---

## 🧪 Seed Dataset

The application comes pre-populated with data from the Marvel Universe to help visualize regional isolation and role-based permissions.

### 👤 User Roles
| Identity | Role | Region | Use Case |
| :--- | :--- | :--- | :--- |
| **Nick Fury** | `ADMIN` | Global | Can see all restaurants and orders across India and America. |
| **Captain Marvel** | `MANAGER` | America | Can manage American restaurants and view regional orders. |
| **Thanos** | `MEMBER` | India | Can browse Indian restaurants and place personal orders. |

### 🍔 Restaurants & Menus
- **Stark Kitchen (America)**: Features "The Arc Reactor Burger" and "Jarvis Fries".
- **The Avengers Canteen (India)**: Features "Super Soldier Samosa" and "Hulk Panner".

---

## 🛠 Database Operations

### Reset & Seed
To reset the database to its pristine Marvel state:
```bash
npx prisma migrate reset --force
npm run seed
```

### Visualizing Data
You can use **Prisma Studio** to browse the data in a GUI:
```bash
npx prisma studio
```
*This will open a dashboard at `http://localhost:5555`*

---

## ⚙️ Configuration
The schema uses the `sqlite` provider. The database file is located at `backend/prisma/dev.db`.
- **Soft Deletes**: Not implemented in this MVP, but relationships use `onDelete: Cascade` for clean cleanup.
- **Enums**: SQLite does not support native enums; Prisma handles these as string-backed unions at the application level.
