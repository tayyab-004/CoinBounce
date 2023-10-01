# CoinBounce

Welcome to CoinBounce, a full-stack MERN project that provides a platform for cryptocurrency enthusiasts to explore, share, and engage with the community.

## Table of Contents

- [Introduction](#introduction)
- [Project Overview](#project-overview)
- [Features](#features)
- [Technologies Used](#technologies-used)
- [Backend Details](#backend-details)
- [Frontend Details](#frontend-details)
- [API Handling](#api-handling)
- [Custom Hooks](#custom-hooks)
- [Getting Started](#getting-started)
- [Contributing](#contributing)

## Introduction

This project is a full-stack MERN application, featuring a backend and frontend. It offers both protected and unprotected routes, allowing users to explore cryptocurrencies, create accounts, and engage with the blog section.

## Project Overview

The project consists of two main parts: the backend and the frontend.

### Features

- Home Page
- Cryptocurrency Page
- Signup Page
- Login Page
- Blog
- Submit a Blog
- Edit & Delete a Blog (Authenticated Users Only)

### Technologies Used

#### Backend

- Middlewares
- Joi (Validation)
- Bcryptjs (Password Hashing)
- DTO (Data Transfer Object)
- JWT (Authentication)
- Cookie-parser (Secure Authentication)

#### Frontend

- Props (Dynamic Content)
- Modular CSS (Component-specific Styling)
- react-router-dom (Routing)
- useParams (Parent-to-Child Parameter Passing)
- useNavigate (Navigation)
- react-redux (State Management)
- useSelector (Global State Access)
- Formik (Form Validation)
- Yup (Validation Rules)
- Axios (API Calls)
- CORS (Security Relaxation)
- react-loader-spinner (Loading Spinner)

### Backend Details

The backend of the project utilizes various technologies and tools, including middlewares, Joi for validation, Bcryptjs for password hashing, DTOs for data filtering, JWT for authorization, and cookie-parser for enhanced security.

### Frontend Details

The frontend incorporates a range of technologies and techniques, such as props for dynamic content, modular CSS for component-specific styling, react-router-dom for route management, useParams for parameter passing, and react-redux for state management.

### API Handling

The project employs both external and internal APIs for data retrieval:

#### External API

- [NewsAPI](https://newsapi.org) (Home Page)
- [CoinGecko API](https://coingecko.com/en/api) (Cryptocurrency Page)

#### Internal API

- Functions for fetching responses based on requests
- Auto login token refresh function

### Custom Hooks

- `useAutoLogin`: A custom hook for handling automatic login functionality by sending requests to the server to refresh the user's authentication token.

## Getting Started

### Backend

1. Install dependencies:

   ```
   npm i
   ```

2. Start the backend server:
   ```
   npm run dev
   ```
   OR
   ```
   npm start
   ```

### Frontend

1. Install dependencies:

   ```
   npm i
   ```

2. Start the frontend server:
   ```
   npm start
   ```

This section provides clear instructions on how to set up and run both the backend and frontend of CoinBounce project locally.

## Contributing

We welcome contributions to enhance CoinBounce. To contribute, please follow these steps:

1. Fork the repository.

2. Create a new branch for your feature or bug fix:

   ```
   git checkout -b feature-name
   ```

3. Make your changes and commit them:

   ```
   git commit -m 'Description of changes'
   ```

4. Push your changes to your forked repository:

   ```
   git push origin feature-name
   ```

5. Create a Pull Request, providing a detailed description of your changes.

---

Explore, share, and engage with the community! 🚀 Happy coding!
