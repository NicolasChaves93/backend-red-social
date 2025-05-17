# Social Network API with Microservices Architecture

This project is a RESTful API for a social networking application built with a microservices architecture, using Node.js, Express, TypeORM, and PostgreSQL.

## Features

- User authentication with JWT
- User profiles
- Creating posts
- Liking posts
- Post feed
- Database seeding with test data

## Project Structure

```
backend/
│
├── src/
│   ├── auth/              # Authentication service
│   ├── posts/             # Posts service
│   ├── user/              # User profile service
│   ├── db/                # Database configuration and seeders
│   ├── shared/            # Shared utilities, middlewares, and error handlers
│   └── app.ts             # Main application entry point
│
├── Dockerfile
├── docker-compose.yml
├── ormconfig.ts          # TypeORM configuration
└── tsconfig.json
```

## Getting Started

### Prerequisites

- Node.js (v14+)
- PostgreSQL or Docker

### Installation

1. Clone the repository:
   ```
   git clone https://github.com/yourusername/social-network-api.git
   cd social-network-api
   ```

2. Install dependencies:
   ```
   npm install
   ```

3. Create a `.env` file in the root directory with the following content:
   ```
   PORT=3000
   NODE_ENV=development
   JWT_SECRET=yoursecretkey
   JWT_EXPIRES_IN=1d
   DB_HOST=localhost
   DB_PORT=5432
   DB_USERNAME=postgres
   DB_PASSWORD=postgres
   DB_NAME=social_network
   ```

4. Start the application:
   ```
   npm run dev
   ```
   
   This will automatically create database tables and seed them with test data.

### Using Docker

To run the application with Docker:

```
docker-compose up
```

## API Endpoints

### Authentication

- `POST /api/auth/register` - Register a new user
- `POST /api/auth/login` - Login and get JWT token

### Posts

- `GET /api/posts` - Get all posts
- `POST /api/posts` - Create a new post
- `POST /api/posts/:id/like` - Like/unlike a post

### Users

- `GET /api/users/profile` - Get current user profile
- `GET /api/users/:id` - Get a user's profile
- `PUT /api/users/profile` - Update current user profile

## Test Users

After seeding, you can use these test accounts:

- Username: john_doe, Email: john@example.com, Password: password123
- Username: jane_smith, Email: jane@example.com, Password: password123
- Username: alex_wilson, Email: alex@example.com, Password: password123

## License

This project is licensed under the MIT License - see the LICENSE file for details.
