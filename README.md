# Learning Platform (CFG-15)

A full-stack learning platform with multi-role user management, including admins, champions, and saathis. The application allows users to access courses, earn certificates, and request promotions to higher roles.

## Features

- **Multi-Role Authentication System**: Secure login and registration with role-based access control
- **Dashboard for Different Roles**: Customized dashboards for admin, champion, and saathi users
- **Promotion Request System**: Champions can request promotion to saathi after earning certificates
- **Admin Approval Workflow**: Admins can review and approve/reject promotion requests
- **Profile Management**: Users can update their profiles and preferences

## Tech Stack

### Frontend:

- React 19
- React Router v7
- Material UI v7
- Axios for API calls
- JWT authentication

### Backend:

- Node.js with Express
- MongoDB with Mongoose
- JWT for authentication
- HTTP-Only cookies for security

## Getting Started

### Prerequisites

- Node.js (v18+)
- MongoDB

### Installation

1. Clone the repository:

```
git clone https://github.com/yourusername/CFG-15.git
cd CFG-15
```

2. Install dependencies for client, server, and root:

```
npm run install:all
```

3. Environment variables:
   - Create a `.env` file in the server directory with:

```
PORT=4000
MONGO_URI=mongodb://localhost:27017/learningPlatform
JWT_SECRET=your_jwt_secret_key
CLIENT_URL=http://localhost:5173
```

4. Running the application:

```
# Development mode (runs both client and server)
npm run dev

# Running client only
npm run client

# Running server only
npm run server
```

5. Creating an admin user:

```
cd server
node scripts/createAdmin.js
```

## API Endpoints

### Auth

- POST `/api/auth/register` - Register a new user
- POST `/api/auth/login` - Login
- POST `/api/auth/logout` - Logout
- POST `/api/auth/register-teacher` - Register a new teacher (admin only)

### User

- GET `/api/user/profile` - Get user profile
- PUT `/api/user/updateprofile` - Update user profile
- GET `/api/user/dashboard` - Get dashboard information
- POST `/api/user/request-saathi-promotion` - Request saathi promotion (champion only)
- GET `/api/user/promotion-requests` - Get all promotion requests (admin only)
- POST `/api/user/process-promotion` - Process a promotion request (admin only)

### Courses

- GET `/api/courses` - Get all courses
- GET `/api/courses/:id` - Get course details
- POST `/api/courses/create` - Create a course (admin only)

## License

This project is licensed under the LICENSE - see the LICENSE file for details.

- Modules -3 ("Admin, Mentor, User")

  ## User:

  - Register / Authentication
  - Dashboard (Course blue print)
  - Pre test
  - Course access (Course tracking), Comment section in videos
  - Post Test
  - Form through which they can choose next role (Mandatory)

  ## Trainers:

  - Login
  - Language they teach in
  - Course outline
  - Modify (with permission of mentor) session and answer to the questions
  - For saathi chat bot

  ## Admin:

  - Dashboard
  - Profile upload
  - Whole access

  ## Extra:

  - Translated resources
  - Common user dashboard

- Individual dashboards based on the role they play.
- Course outline "Completed and Upcoming"
- Sessions you can unlock by completing previous ones and codes three times a session
- Badges and points for more involvement
- Course Pathways - 1. Saathi 2. Guide Mentoring 3. Trainer
- Individual Path tracking / building their own path "MyPath"
- Chats / discussion boards
- Research and details that can be searched by people to know about certain things
- Normal people can also learn and access some course
