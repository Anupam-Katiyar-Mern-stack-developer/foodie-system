# 🍔 Foodie System

A production-focused **Food Delivery Management System** inspired by platforms like **Swiggy and Zomato**.

The project is being developed to understand real-world backend architecture, role-based authentication, PostgreSQL database design, REST APIs, delivery workflows, and scalable application development.

The system is designed around four major roles:

* 👤 Customer/User
* 🍽️ Restaurant
* 🛵 Delivery Agent
* 🛡️ Admin

---

## 🚀 Tech Stack

### Frontend

* React.js
* Redux Toolkit
* Tailwind CSS
* Axios
* React Router

### Backend

* Node.js
* Express.js
* PostgreSQL
* JWT Authentication
* Multer
* Nodemailer
* Socket.IO *(planned/in progress)*

### Development Tools

* Git & GitHub
* Postman
* VS Code
* PostgreSQL
* npm
* Nodemon

---

# 🏗️ Backend Architecture

The backend follows a structured and maintainable architecture.

```text
Request
   ↓
Route
   ↓
Middleware
   ↓
Controller
   ↓
Service
   ↓
PostgreSQL Database
```

Business logic is mainly handled inside the **service layer**, while controllers are responsible for handling requests and responses.

---

# 📂 Backend Structure

```text
backend/
│
├── controllers/
│   ├── admin/
│   ├── auth/
│   ├── user/
│   ├── restaurant/
│   ├── delivery/
│   ├── category/
│   └── cart/
│
├── services/
│   ├── auth.service.js
│   ├── user.service.js
│   ├── address.service.js
│   ├── restaurant.service.js
│   ├── delivery.service.js
│   ├── category.service.js
│   └── cart.service.js
│
├── middlewares/
│
├── database/
│   ├── migrations/
│   └── migrate.js
│
├── routes/
│
├── uploads/
│
├── utils/
│
├── app.js
└── server.js
```

---

# ✅ Current Backend Progress

## 👤 User Authentication

Implemented user authentication and profile functionality.

### APIs

```http
POST /api/auth/register
POST /api/auth/login
GET  /api/user/profile
```

### Features

* User registration
* User login
* Password hashing
* JWT authentication
* Protected routes
* Authenticated user profile
* PostgreSQL user storage

---

# 📍 User Address Module

Users can save delivery addresses for future orders.

### APIs

```http
POST /api/user/addresses
```

### Features

* Create saved address
* Authenticated user-based address storage
* Address linked with user account
* PostgreSQL relational data handling

More address operations will be added as development continues.

---

# 🍽️ Restaurant Module

Restaurant functionality is being developed as a separate protected module.

### Implemented Features

* Restaurant registration
* Restaurant authentication
* Unique restaurant slug
* Protected restaurant profile
* Update restaurant profile
* Restaurant open/close status
* Restaurant-specific authorization

### Example APIs

```http
POST  /api/restaurant/register
POST  /api/restaurant/login

GET   /api/restaurant/profile
PUT   /api/restaurant/profile

PATCH /api/restaurant/status
```

Restaurant URLs are designed to support **slug-based identification** instead of exposing unnecessary numeric IDs.

---

# 🛵 Delivery Agent Module

The delivery-agent system has separate authentication and profile management.

### APIs

```http
POST  /api/delivery/register
POST  /api/delivery/login

GET   /api/delivery/profile
PUT   /api/delivery/profile

PATCH /api/delivery/online-status

GET   /api/delivery/available
```

### Features

* Delivery-agent registration
* Delivery-agent login
* JWT authentication
* Protected delivery profile
* Profile update
* Profile image upload
* Vehicle details
* Online/offline status
* Availability tracking
* Fetch available delivery agents

The delivery module will later be connected with automatic order assignment and live order tracking.

---

# 🛡️ Admin Module

The Admin role is designed to have complete system-level control.

### Current Work

* Admin database setup
* Admin account setup
* Admin authentication foundation
* Protected admin operations
* Category management

Admin will eventually manage:

```text
Users
Restaurants
Delivery Agents
Categories
Foods
Orders
Payments
Website Settings
Reports
```

---

# 🗂️ Global Category Module

A global category system has been implemented for food classification.

Example categories:

```text
Pizza
Burger
Biryani
Chinese
South Indian
Desserts
Drinks
```

### Features

* Admin-managed categories
* Category name
* Category slug
* Category description
* Category image
* Active/inactive status
* Display order
* Public category listing
* PostgreSQL category storage

Categories are global and are not unnecessarily tied to a single restaurant.

### Public API

```http
GET /api/categories
```

The API returns active categories ordered using `display_order`.

---

# 🛒 Cart Module

Basic cart functionality has been implemented.

### APIs

```http
GET    /api/cart

POST   /api/cart

PUT    /api/cart/:foodId

DELETE /api/cart/:foodId

DELETE /api/cart
```

### Features

* Get user cart
* Add food to cart
* Update cart quantity
* Remove individual item
* Clear complete cart
* User-specific protected cart

---

# 🐘 PostgreSQL Database

The project uses **PostgreSQL with raw SQL queries**.

Instead of depending completely on an ORM, this project is being used to strengthen SQL and relational-database fundamentals.

Current database work includes:

* Users table
* Admin table
* Restaurants table
* Delivery agents
* Addresses
* Categories
* Cart-related data
* Foreign-key relationships
* NOT NULL constraints
* Unique constraints
* Slugs
* UUID-related database work
* Database migrations

---

# 🔄 Database Migration System

A custom migration workflow is being used to manage database schema changes.

Example:

```bash
npm run db:migrate
```

Migration files are stored inside:

```text
database/migrations/
```

This makes database changes easier to track through Git.

---

# 🔐 Authentication & Authorization

Different roles use separate protected access.

```text
User
Restaurant
Delivery Agent
Admin
```

Authentication is implemented using:

```text
JWT Token
     ↓
Authentication Middleware
     ↓
Role / Resource Validation
     ↓
Controller
```

This prevents unauthorized users from accessing protected resources.

---

# 🧠 Major Learning Areas

This project is being developed not only to build features but also to improve understanding of:

* Production backend architecture
* REST API design
* PostgreSQL
* Raw SQL
* Relational database design
* Authentication
* Authorization
* Role-based systems
* Database migrations
* Foreign keys
* Error handling
* API debugging
* Service-layer architecture
* Clean code organization
* Scalable backend design

---

# 🐛 Real Problems Solved During Development

While developing this project, several real backend/database problems have been debugged, including:

```text
relation does not exist
```

```text
NOT NULL constraint violation
```

```text
foreign-key related issues
```

```text
SQL syntax errors
```

```text
INSERT column/value mismatch
```

```text
gen_random_uuid() extension issues
```

```text
restaurant slug migration issues
```

These issues are helping strengthen practical PostgreSQL and backend debugging skills.

---

# 🔄 Planned Application Flow

The complete application is being designed around this workflow:

```text
User Registration / Login
          ↓
User Profile
          ↓
Saved Address
          ↓
Current Location
          ↓
Restaurant Listing
          ↓
Food Listing
          ↓
Cart
          ↓
Checkout
          ↓
Order Creation
          ↓
Restaurant Accept / Reject
          ↓
Food Preparation
          ↓
Delivery Agent Assignment
          ↓
Order Pickup
          ↓
Live Tracking
          ↓
Order Delivered
          ↓
Payment / Earnings
```

---

# 🚧 Upcoming Features

Development is actively continuing.

Planned modules include:

* Food management
* Restaurant food CRUD
* Search
* Filtering
* Pagination
* Order management
* Checkout
* Restaurant order acceptance/rejection
* Automatic delivery-agent assignment
* Delivery-agent earnings
* Real-time order status
* Socket.IO integration
* Live delivery tracking
* Notifications
* OTP email verification
* Forgot-password OTP
* Restaurant approval/rejection emails
* Payment integration
* Reviews & ratings
* Favorites
* Offers & coupons
* Admin analytics
* Admin dashboard
* Website settings
* Security improvements
* Deployment
* AI-powered features

---

# 🤖 Future AI Integration

After completing the core application, AI features are planned to improve the Foodie System.

Possible AI functionality includes:

* Smart food recommendations
* AI-powered search
* Personalized restaurant suggestions
* Customer-support chatbot
* Review summarization
* Restaurant insights
* Intelligent admin analytics

---

# 🎯 Project Goal

The goal of this project is not simply to create another CRUD application.

The objective is to build and understand a complete real-world food delivery ecosystem while improving skills in:

**Backend Development + PostgreSQL + System Design + Real-Time Applications + Production-Level MERN Development**

---

# 📌 Development Status

```text
Frontend Foundation          ✅
Backend Architecture         ✅
PostgreSQL Setup             ✅
Migration System             ✅
User Authentication          ✅
User Profile                 ✅
Saved Address Foundation     ✅
Restaurant Authentication    ✅
Restaurant Profile           ✅
Restaurant Status            ✅
Delivery Authentication      ✅
Delivery Profile             ✅
Delivery Availability        ✅
Global Categories            ✅
Cart Module                  ✅

Food Module                  🚧
Order Module                 ⏳
Restaurant Order Flow        ⏳
Delivery Assignment          ⏳
Socket.IO                    ⏳
Live Tracking                ⏳
Notifications                ⏳
Payment                      ⏳
AI Integration               ⏳
Deployment                   ⏳
```

---

# 👨‍💻 Developer

**Anupam Katiyar**

MERN / Full Stack Developer focused on building production-oriented web applications and strengthening backend, PostgreSQL, system-design and real-world development skills.

---

⭐ This project is actively under development. More features and improvements will be added continuously.
