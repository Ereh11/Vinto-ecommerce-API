# Vinto E-commerce API

Vinto E-commerce API is a backend application designed to handle the operations of an e-commerce platform.  
Built with Node.js and Express, it manages products, users, orders, and more.

## Table of Contents

- [Features](#features)
- [Technologies Used](#technologies-used)
- [Getting Started](#getting-started)
  - [Prerequisites](#prerequisites)
  - [Installation](#installation)
  - [Environment Variables](#environment-variables)
  - [Running the Application](#running-the-application)
- [Project Structure](#project-structure)
- [API Documentation](#api-documentation)
- [Contributing](#contributing)
- [License](#license)

## Features

- **User Authentication**: Secure user registration and login functionalities.
- **Product Management**: CRUD operations for products.
- **Order Processing**: Manage user orders and order statuses.
- **Middleware Integration**: Custom middleware for error handling and request validation.

## Technologies Used

- **Node.js**: JavaScript runtime for server-side development.
- **Express**: Web framework for Node.js.
- **MongoDB**: NoSQL database for data storage.
- **Mongoose**: ODM for MongoDB.
- **Joi**: Data validation library.
- **JWT**: JSON Web Tokens for authentication.
- **bcrypt**: Library for hashing passwords.

## Getting Started

### Prerequisites

Ensure you have the following installed:

- **Node.js**: Ensure you have Node.js installed. [Download Node.js](https://nodejs.org/)
- **MongoDB**: Set up a MongoDB database. [Install MongoDB](https://www.mongodb.com/try/download/community)

### Installation

1. **Clone the Repository**:

   ```bash
   git clone https://github.com/Ereh11/Vinto-ecommerce-API.git
2. **Navigate to the Project Directory**:

    ```bash
     cd Vinto-ecommerce-API
3. **Install Dependencies**:

    ```bash
    npm install
4. **Configure environment variables:**

    ```bash
    PORT = 3000
    MONGODB_URI=your_mongodb_connection_string
    JWT_SECRET=your_jwt_secret

    Ask me for this file..
5. **Start the server:**

    ```bash
    npm start

The server should now be running at <http://localhost:4000>.

## API Documentation

The API follows RESTful principles. Below are the available some endpoints grouped by feature:

---

### 🔐 Authentication

#### Register a new user

- **URL**: `/api/auth/register`
- **Method**: `POST`
- **Body**:

  ```json
  {
    "username": "example",
    "email": "user@example.com",
    "password": "yourpassword"
  }
  
### Login a user

- **URL**: `/api/auth/login`
- **Method**: `POST`
- **Body**:

   ```json
   {
  "email": "user@example.com",
  "password": "yourpassword"
   }

- **Response**:

   ```json
   {
  "token": "jwt_token_here"
   }

### 📦 Products

#### Get All Products

- **URL**: `/api/products`  
- **Method**: `GET`

#### Get a Product by ID

- **URL**: `/api/products/:id`  
- **Method**: `GET`

#### Create a New Product

- **URL**: `/api/products`  
- **Method**: `POST`  
- **Request Body**:

  ```json
  {
    "name": "Product Name",
    "description": "Product Description",
    "price": 99.99,
    "category": "Category Name",
    "quantity": 10,
    "characteristics": [],
    "img": []
  }

### 🛒 Cart

#### Get All Carts

- **URL**: `/api/carts`  
- **Method**: `GET`  
- **Headers**:

#### Get Cart by ID

- **URL**: `/api/carts/:id`  
- **Method**: `GET`  
- **Headers**:

- **Request Body**:

  ```json
  {
    "ItemsOrdered": ["item_ordered_id1", "item_ordered_id2"],
    "status": "pending",  //(default: "pending")
    "total": 150.50,
    "user": "user_id"
  }

#### we can go to controllers folder to see the rest of endpoints, and Let me know if you'd like to add endpoints for categories, users, or other resources as well

## Project Structure

  ```sh
  Vinto-ecommerce-API/
  ├── controllers/       # Route handlers
  ├── middlewares/       # Custom middleware functions
  ├── models/            # Mongoose schemas and models
  ├── routes/            # API route definitions
  ├── utils/             # Utility functions
  ├── .env               # Environment variables
  ├── .gitignore         # Files to ignore in git
  ├── index.js           # Entry point of the application
  ├── package.json       # Project metadata and dependencies
  └── README.md       
  ```

## 📌 Future Enhancements

- Implementing all admin dashboard

- Fix any related issues

## 📬 Contact

If you have any questions or suggestions, feel free to reach out via Email: <hanysaadstd@gmail.com>
Happy coding! 😊

## 📜 License

This project is licensed under the MIT License.
