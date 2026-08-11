# 💸 Tally — Split Bills, Not Friendships!

Tally is a full-stack bill-splitting application designed to make managing group expenses simple, transparent, and hassle-free.

🌐 **Live Demo:** [Tally](https://tally1-lvqw.onrender.com)

---

## 🚀 Features

* 👥 **Create & Manage Groups** — Create groups and manage group members.
* 💸 **Add & Split Expenses** — Add shared expenses and split them among group members.
* 📊 **Track Balances** — Keep track of individual balances within each group.
* ⚡ **Settlement Calculation** — Easily determine who owes whom.
* 🔐 **JWT Authentication** — Secure user authentication using JSON Web Tokens.
* 📱 **Responsive UI** — Clean and responsive interface across different screen sizes.
* 🔄 **RESTful APIs** — Backend APIs for authentication, groups, expenses, and balance management.

---

## 🛠️ Tech Stack

### Frontend

* React.js
* Vite
* Tailwind CSS
* JavaScript

### Backend

* Node.js
* Express.js
* REST APIs

### Database

* MongoDB

### Authentication

* JWT (JSON Web Token)

### Deployment

* Render

---

## 🏗️ Project Architecture

```text
Tally
│
├── client/                 # React frontend
│   ├── src/
│   ├── components/
│   ├── pages/
│   └── ...
│
├── server/                 # Node.js + Express backend
│   ├── controllers/
│   ├── models/
│   ├── routes/
│   ├── middleware/
│   └── ...
│
└── README.md
```

---

## ⚙️ Getting Started

Follow these steps to run Tally locally.

### 1. Clone the Repository

```bash
git clone https://github.com/AkashChaudhary180/Tally.git
cd Tally
```

### 2. Install Dependencies

Install frontend dependencies:

```bash
cd client
npm install
```

Install backend dependencies:

```bash
cd ../server
npm install
```

---

## 🔐 Environment Variables

Create a `.env` file inside the `server` directory:

```env
MONGO_URI=your_mongodb_connection_string
JWT_SECRET=your_jwt_secret
PORT=8000
```

If your frontend uses an environment variable for the backend URL, create a `.env` file inside the `client` directory:

```env
VITE_API_URL=http://localhost:8000/api
```

> ⚠️ Never commit your `.env` files or secret credentials to GitHub.

---

## ▶️ Running the Project

### Start Backend

```bash
cd server
npm start
```

Or, if you are using nodemon:

```bash
npm run dev
```

### Start Frontend

Open another terminal:

```bash
cd client
npm run dev
```

The frontend will be available at:

```text
http://localhost:5173
```

---

## 📊 How Tally Works

1. **Create an account** or log in using JWT authentication.
2. **Create a group** and add members.
3. **Add expenses** made by group members.
4. Tally calculates each member's **share and balance**.
5. View **who owes whom** and simplify expense settlement.

---

## 🌐 Deployment

Tally is deployed using **Render**.

🔗 **Live Application:**
https://tally1-lvqw.onrender.com

---

## 🎯 Learning Outcomes

This project provided hands-on experience with:

* Full-stack application development
* React and component-based UI development
* REST API design and integration
* Node.js and Express.js backend development
* MongoDB database management
* JWT-based authentication
* Frontend-backend communication
* Environment variable management
* Cloud deployment using Render
* Responsive UI development with Tailwind CSS

---

## 🚀 Future Improvements

Some potential improvements for future versions:

* 🔔 Expense notifications
* 📧 Email notifications
* 📈 Expense analytics and visualizations
* 💳 Online payment integration
* 🔄 Automatic settlement tracking
* 📱 Progressive Web App (PWA) support

---

## 👨‍💻 Author

**Akash Chaudhary**

B.Tech — Information Technology
IIIT Una

---

⭐ If you found this project useful, consider giving the repository a star!

```
```
