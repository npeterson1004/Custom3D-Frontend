<div align="center">

<img src="https://natescustom3d.com/assets/images/welcome-hero/homeimage.png" alt="Custom3D Logo" width="200" />

# 🧰 **Nate's Custom3D Webstore**
### *Your Hub for Personalized 3D Printing Services*

---

🚀 **Created by:** Nathan Peterson  
🗓️ **Date:** March 4, 2025  
📁 **Project Type:** Full-Stack E-Commerce Platform  
🌐 **Live Site:** [natescustom3d.com](https://natescustom3d.com)

---

</div>


# 📌 Project Overview

The **3D Print Webstore** is a full-stack e‑commerce platform designed to manage and sell custom 3D‑printed items. It enables users to browse products, add items to their cart, register and log in securely, place orders, and submit inquiries with 3D model file uploads.

**Tech Stack**  
- **Backend**: Node.js, Express.js, MongoDB Atlas  
- **Frontend**: HTML, CSS, JavaScript, Bootstrap, AJAX  
- **Storage**: Cloudinary (images & 3D model files)  
- **Auth**: JWT for users, session-based for admins  
- **Deployment**: Render (backend), Netlify (frontend)

---

## 🚀 Features

### 🛍 Public Pages  
- **Home Page** (`index.html`) – Featured products & store info  
- **Warehouse Page** (`warehouse.html`) – List of all available 3D-printed items  
- **Contact Page** (`contact.html`) – Send inquiries with 3D model file uploads (STL, OBJ, STEP, 3MF)  
- **Cart Page** (`cart.html`) – Add/remove items and proceed to checkout  
- **Find Prints Page** (`find-prints.html`) – Search for available 3D prints  

### 🔒 User Authentication  
- **Login Page** (`login.html`) – JWT-secured user login  
- **Register Page** (`register.html`) – Secure user registration with password hashing  
- **Logout** – Securely logs users out and clears their session  

### 🛠️ Admin Functionality  
- **Admin Login** (`admin-login.html`) – Authenticate admin users securely  
- **Admin Dashboard** (`admin-dashboard.html`) – Manage:  
  - **Products** – Add/Edit/Delete 3D print items  
  - **Users** – View/manage registered customers  
  - **Contact Requests** – View/download 3D model file submissions  
  - **Orders** – View/manage customer orders  

### 🗄️ Database & File Management  
- **MongoDB Atlas** – Stores users, products, orders, and contact inquiries  
- **Cloudinary Integration**:  
  - Stores product images  
  - Handles 3D model file uploads (STL, OBJ, STEP, 3MF)  
- **Automatic Featured Products** – Randomly selects featured prints for the homepage  

### 🔐 Security & API  
- **RESTful API** – Handles authentication, products, orders, and contact forms  
- **CORS-enabled API** – Ensures secure client-server communication  
- **JWT Authentication** – For user routes  
- **Session-Based Auth** – For admin routes  
- **Password Encryption** – Uses bcrypt  
- **File Uploads** – Managed via Multer and Cloudinary  

---

## 🛠️ Tech Stack

### 1️⃣ Backend (Server-Side)  
- **Language**: Node.js  
- **Frameworks/Libraries**: Express.js, Mongoose, dotenv, bcrypt, jsonwebtoken, express-session, cookie-parser, cors, multer, Cloudinary  
- **Database**: MongoDB Atlas  
- **Controllers**:  
  - `authController.js` – User/auth logic  
  - `adminController.js` – Admin-specific logic  
  - `productController.js` – Product CRUD  
  - `contactController.js` – Inquiry/file uploads  
  - `orderController.js` – Order processing  
  - `paymentController.js` – Payment processing  
- **Models (Schemas)**: User, Admin, Product, Contact, Order, Payment  
- **Middleware**: `authMiddleware.js` – JWT-based route protection  

### 2️⃣ Frontend (Client-Side)  
- **Languages**: HTML, CSS, JavaScript  
- **Frameworks/Libraries**: Bootstrap, AJAX (Fetch API)  
- **Scripts**:  
  - `Home.js`, `Warehouse.js`, `Login.js`, `register.js`, `contact.js`, `payment.js`,  
    `admin-dashboard.js`, `adminlogin.js`, `cart.js`, `order.js`, `auth.js`, `config.js`
    
---

## 📁 File Structure
```
Custom3D/
│
├── backend/
│   ├── controllers/
│   │   ├── authController.js
│   │   ├── productController.js
│   │   ├── adminController.js
│   │   ├── contactController.js
│   │   ├── orderController.js
│   │   └── paymentController.js
│   │
│   ├── data/
│   │   └── db.js
│   │
│   ├── models/
│   │   ├── User.js
│   │   ├── Admin.js
│   │   ├── Product.js
│   │   ├── Contact.js
│   │   └── Order.js
│   │
│   ├── routes/
│   │   ├── authRoutes.js
│   │   ├── productRoutes.js
│   │   ├── adminRoutes.js
│   │   ├── contactRoutes.js
│   │   └── orderRoutes.js
│   │
│   ├── middleware/
│   │   └── authMiddleware.js
│   │
│   ├── config/
│   │   └── db.js
│   │
│   ├── uploads/
│   ├── .env
│   ├── server.js
│   └── package.json
│
├── frontend/
│   ├── public/
│   │   ├── index.html
│   │   ├── admin-login.html
│   │   ├── login.html
│   │   ├── admin-dashboard.html
│   │   ├── warehouse.html
│   │   ├── contact.html
│   │   ├── cart.html
│   │   ├── register.html
│   │   └── find-prints.html
│   │
│   └── assets/
│       ├── css/
│       │   └── styles.css
│       ├── fonts/
│       ├── images/
│       ├── logo/
│       └── js/
│           ├── Home.js
│           ├── Warehouse.js
│           ├── Login.js
│           ├── register.js
│           ├── contact.js
│           ├── admin-dashboard.js
│           ├── adminlogin.js
│           ├── cart.js
│           ├── order.js
│           ├── auth.js
│           └── config.js
│
├── README.md
└── .gitignore
```
