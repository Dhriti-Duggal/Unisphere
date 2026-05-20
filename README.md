# UniSphere SaaS Dashboard

UniSphere is a SaaS Dashboard designed to provide an intuitive and user-friendly interface for managing various aspects of a SaaS platform. This project includes both the backend and frontend code for the dashboard, offering a seamless experience for administrators, instructors, and users.

## Features

### General Features
- **Authentication**: Secure login and user management with JWT-based authentication.
- **Role-Based Access Control**: Different roles (e.g., Admin, Instructor, User) with specific permissions.
- **Responsive Design**: Fully optimized for desktop, tablet, and mobile devices.

### User Management
- **User Profiles**: View and update user details.
- **Role Management**: Assign roles and permissions to users.
- **Activity Logs**: Track user activity for auditing purposes.

### Course Management
- **Course Creation**: Add new courses with detailed descriptions, images, and metadata.
- **Course Updates**: Edit or delete existing courses.
- **Enrollment Management**: Manage user enrollments in courses.

### Assignments
- **Assignment Uploads**: Allow instructors to upload assignments for users.
- **Submission Tracking**: Track assignment submissions by users.
- **Grading System**: Enable instructors to grade and provide feedback on assignments.

### Live Classes
- **Scheduling**: Schedule live classes with date, time, and instructor details.
- **Integration**: Integrate with video conferencing tools (e.g., Zoom, Google Meet).
- **Notifications**: Notify users about upcoming live classes.

### Chat System
- **Real-Time Messaging**: Enable users to communicate in real-time using Socket.IO.
- **Group Chats**: Create chat groups for courses or assignments.
- **Message History**: Store and retrieve chat history.

### File Uploads
- **Secure Uploads**: Upload files securely with rate limiting to prevent abuse.
- **Direct Uploads**: Support for direct uploads to cloud storage (e.g., AWS S3, Google Cloud Storage).
- **File Deletion**: Allow users to delete uploaded files.

### Dashboard Analytics
- **User Insights**: View user activity and engagement metrics.
- **Course Performance**: Analyze course enrollments and completion rates.
- **Revenue Tracking**: Track revenue generated from subscriptions or course sales.

## Prerequisites

Before running the project, ensure you have the following installed:

- [Node.js](https://nodejs.org/) (v14 or higher)
- [npm](https://www.npmjs.com/) (Node Package Manager)
- [PostgreSQL](https://www.postgresql.org/) (for database)
- [Redis](https://redis.io/) (optional, for caching and rate limiting)

## Installation

### Backend Setup

1. Navigate to the backend directory:
   ```bash
   cd backend