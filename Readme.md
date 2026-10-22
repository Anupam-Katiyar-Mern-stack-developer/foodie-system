# 🍔 Foodie — Full Stack Food Delivery Platform

### A Complete Food Ordering & Delivery Management System

**Foodie** is a full-stack food delivery platform inspired by Swiggy and Zomato, built with **React, Node.js, Express.js, and PostgreSQL**.

It features a multi-role ecosystem connecting **Customers, Restaurants, Delivery Partners, and Admins**, with secure authentication, order management, real-time updates, and a modular backend architecture.

---

## 🚀 Tech Stack

**Frontend:** React.js • Redux Toolkit • Tailwind CSS • Axios

**Backend:** Node.js • Express.js • REST APIs • JWT • Socket.IO

**Database:** PostgreSQL • Raw SQL • Database Migrations

**Tools:** Git • GitHub • Postman • Multer • Nodemailer

---

## ✨ Key Features

- 🔐 **Authentication & RBAC** — Secure JWT authentication with role-based authorization
- 👤 **Customer Management** — Profiles, addresses, cart, checkout, and order history
- 🍽️ **Restaurant Management** — Restaurant profiles, food management, and order processing
- 🛵 **Delivery Management** — Agent availability, order assignment, and delivery tracking
- 📦 **Order Management** — Complete order lifecycle from placement to delivery
- ⚡ **Real-Time Updates** — Live order status and delivery updates using Socket.IO
- 🛡️ **Admin Dashboard** — Centralized management of users, restaurants, categories, and orders
- 🐘 **PostgreSQL** — Relational database design with raw SQL, constraints, and migrations
- 📱 **Responsive UI** — Modern, responsive frontend built with React and Tailwind CSS

---

## 🏗️ Backend Architecture

The backend follows a modular, service-oriented architecture with clear separation of concerns.

```text
Client (React + Redux)
         ↓
Express REST APIs
         ↓
Routes & Middleware
         ↓
Controllers
         ↓
Business Logic (Services)
         ↓
PostgreSQL Database
```

**Architecture Highlights:**
- Modular controllers and service layers
- JWT authentication and role-based access control
- RESTful API design
- Relational database architecture
- Version-controlled database migrations
- Real-time communication with Socket.IO

---

## 🔄 Application Workflow

```text
Customer → Browse Restaurants → Add to Cart
         → Checkout → Place Order
         → Restaurant Accepts → Food Preparation
         → Delivery Agent Assigned → Live Tracking
         → Order Delivered
```

---

## 👥 User Roles

| Role | Responsibilities |
|---|---|
| 👤 Customer | Browse food, manage cart, place and track orders |
| 🍽️ Restaurant | Manage menu, availability, and incoming orders |
| 🛵 Delivery Partner | Manage availability, assigned orders, and deliveries |
| 🛡️ Admin | Manage and monitor the entire platform |

---

## 👨‍💻 Developer

**Anupam Katiyar**

Full Stack Developer | MERN Stack | Node.js | PostgreSQL

*Building scalable applications with clean architecture and real-world engineering practices.*

---

⭐ **If you like this project, give it a star!**
