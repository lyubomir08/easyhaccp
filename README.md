# 🧾 EasyHACCP  
**Digital HACCP Management System for Food Businesses**

EasyHACCP is a **full-stack MERN application** (MongoDB, Express.js, React, Node.js) designed to help restaurants, catering companies, and food stores manage hygiene, temperature logs, suppliers, and compliance with food safety regulations (HACCP).  

The platform provides different levels of access for **administrators**, **owners**, and **managers**, ensuring structured control over all business operations.

---

## ⚙️ Tech Stack

- **Front-end:** React  
- **Back-end:** Node.js + Express.js  
- **Database:** MongoDB
- **Styling:** Tailwind CSS

---

## ✨ Features

### 🔓 Public Area
- **Registration Form** – Business registration request with firm data, owner, and objects (locations).  
- **Login Page** – Secure login with role-based redirection (Admin, Owner, Manager).  

---

### 🔐 Private Area

#### 👑 Owner Dashboard
- View all **objects** under their firm.  
- Add or manage:
  - Employees and their health cards  
  - Food groups and recipes  
  - Suppliers and clients  
  - Refrigerators, fryers, rooms, disinfectants  
- Access all **HACCP daily logs** per object.

#### 🧍 Manager Dashboard
- Access only **their assigned object**.  
- Manage:
  - Staff members for their object  
  - Hygiene and temperature records  
  - Incoming food and packaging logs  
  - Training records for employees  

#### 🧰 Admin Panel
- Approve or reject new company registrations.  
- Manage all firms, users, and roles.

---


## 🧠 Roles & Access Control

| Role | Permissions |
|------|--------------|
| **Admin** | Full system access (approve firms, manage users, all data). |
| **Owner** | Manage all objects under their firm. |
| **Manager** | Manage data for their assigned object only. |

---
