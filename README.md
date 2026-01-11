# Child-Care Management System

A comprehensive child-care management system built with React, TypeScript, and Supabase. This system provides role-based dashboards for administrators, teachers, and parents to manage daily operations, track attendance, share activities, and communicate effectively.

## Features

### Admin Dashboard
- View system-wide statistics (children, teachers, parents, classes)
- Manage users, children, and class assignments
- Track attendance across all classes
- Post announcements and updates
- View recent activities from all classes

### Teacher Dashboard
- View assigned classes and enrolled students
- Track daily attendance for classes
- Post activities with photos and descriptions
- Monitor class attendance rates
- Access daily schedules and quick actions

### Parent Dashboard
- View children's information and class assignments
- Track daily check-in/check-out times
- View recent activities and photos from classes
- Stay informed with announcements
- Access upcoming events and schedules

## Technology Stack

- **Frontend**: React 18 + TypeScript
- **Styling**: Tailwind CSS
- **Routing**: React Router v7
- **Database**: Supabase (PostgreSQL)
- **Authentication**: Supabase Auth
- **Icons**: Lucide React

## Database Schema

The system uses the following main tables:
- `profiles` - User profiles with role-based access (admin/teacher/parent)
- `children` - Children enrolled in the facility
- `parent_children` - Links parents to their children
- `classes` - Class/group information
- `class_enrollments` - Links children to classes
- `teacher_assignments` - Links teachers to classes
- `attendance` - Daily attendance tracking
- `activities` - Activity posts with photos and descriptions
- `announcements` - System-wide and class-specific announcements

All tables have Row Level Security (RLS) enabled with role-based policies.

## Getting Started

1. Install dependencies:
```bash
npm install
```

2. Start the development server:
```bash
npm run dev
```

3. Build for production:
```bash
npm run build
```

## Demo Accounts

To test the system, you can create demo accounts with the following roles:

- **Admin**: Full system access
- **Teacher**: Access to assigned classes and students
- **Parent**: Access to own children's information

## Project Structure

```
src/
├── components/          # Reusable components
│   ├── DashboardNav.tsx # Navigation for authenticated users
│   └── ProtectedRoute.tsx # Route protection wrapper
├── contexts/            # React contexts
│   └── AuthContext.tsx  # Authentication context and hooks
├── lib/                 # Utility libraries
│   └── supabase.ts      # Supabase client configuration
├── pages/              # Page components
│   ├── dashboards/     # Role-based dashboard pages
│   │   ├── AdminDashboard.tsx
│   │   ├── TeacherDashboard.tsx
│   │   └── ParentDashboard.tsx
│   ├── Dashboard.tsx   # Dashboard router
│   └── Login.tsx       # Login page
└── App.tsx             # Main application component
```

## Security

- Row Level Security (RLS) enforced on all database tables
- Role-based access control for all operations
- Secure authentication using Supabase Auth
- Protected routes with authentication guards

## Future Enhancements

- Messaging system between teachers and parents
- Document management for medical records and permissions
- Billing and payment tracking
- Mobile app for iOS and Android
- Push notifications for important updates
- Advanced reporting and analytics