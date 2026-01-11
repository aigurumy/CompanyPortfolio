# Setup Guide

This guide will help you set up the Child-Care Management System from scratch.

## Prerequisites

- Node.js 18+ installed
- A Supabase account (free tier works)
- Basic knowledge of React and TypeScript

## Step 1: Clone and Install

```bash
# Install dependencies
npm install
```

## Step 2: Supabase Setup

### 2.1 Create a Supabase Project

1. Go to [supabase.com](https://supabase.com)
2. Create a new project
3. Wait for the database to be provisioned

### 2.2 Run Database Migration

1. Go to your Supabase project dashboard
2. Click on "SQL Editor" in the left sidebar
3. Create a new query
4. Copy the entire contents of the migration file from:
   `supabase/migrations/[timestamp]_create_childcare_schema.sql`
5. Paste and run the query

This will create all the necessary tables, set up Row Level Security, and create the required indexes.

### 2.3 Configure Environment Variables

The `.env` file should already contain your Supabase credentials:

```
VITE_SUPABASE_URL=your-project-url
VITE_SUPABASE_ANON_KEY=your-anon-key
```

If not, get these values from:
- Supabase Dashboard → Settings → API

## Step 3: Create Demo Users (Optional)

To test the system with demo data, you'll need to create user accounts:

### 3.1 Create Auth Users

1. Go to Supabase Dashboard → Authentication → Users
2. Click "Add user" and create accounts with these emails:
   - admin@childcare.com (password: admin123)
   - teacher@childcare.com (password: teacher123)
   - parent@childcare.com (password: parent123)

### 3.2 Create Profile Records

After creating auth users, you need to create their profiles:

1. Go to SQL Editor
2. For each user, get their UUID from the auth.users table
3. Run these queries (replace the UUIDs with actual values):

```sql
-- Admin profile
INSERT INTO profiles (id, role, full_name, phone)
VALUES ('user-uuid-here', 'admin', 'Admin User', '+1-555-0001');

-- Teacher profile
INSERT INTO profiles (id, role, full_name, phone)
VALUES ('user-uuid-here', 'teacher', 'Teacher User', '+1-555-0002');

-- Parent profile
INSERT INTO profiles (id, role, full_name, phone)
VALUES ('user-uuid-here', 'parent', 'Parent User', '+1-555-0003');
```

### 3.3 Seed Demo Data (Optional)

For a complete demo experience, run the `seed-demo-data.sql` script:

1. First, create the auth users as described above
2. Update the UUIDs in `seed-demo-data.sql` with your actual user IDs
3. Run the entire script in Supabase SQL Editor

This will create:
- 3 Classes (Toddlers A, Preschool B, Pre-K Stars)
- 5 Children with parent relationships
- Sample attendance records
- Sample activities and announcements

## Step 4: Run the Application

```bash
# Start development server
npm run dev
```

The application will be available at `http://localhost:5173`

## Step 5: Login and Test

Try logging in with one of the demo accounts:

- **Admin**: admin@childcare.com / admin123
- **Teacher**: teacher@childcare.com / teacher123
- **Parent**: parent@childcare.com / parent123

Each role will see a different dashboard with appropriate features.

## Common Issues

### Issue: "Missing Supabase environment variables"
**Solution**: Check that your `.env` file exists and contains valid Supabase credentials.

### Issue: Login shows "Invalid credentials"
**Solution**: Make sure you've created the user in Supabase Auth and the profile record exists in the profiles table.

### Issue: Dashboard is empty
**Solution**: You need to seed data using the SQL script or manually create records through the Supabase dashboard.

### Issue: "Row Level Security policy violation"
**Solution**: Ensure the user's profile has the correct role set and the RLS policies were created during migration.

## Development Tips

### Adding New Features

1. All database changes should go through migrations
2. Always enable RLS on new tables
3. Create appropriate policies for each role
4. Test with all three role types

### Testing RLS Policies

You can test RLS policies in Supabase SQL Editor:

```sql
-- Test as a specific user
SET request.jwt.claims.sub = 'user-uuid-here';

-- Then run your queries to see what they can access
SELECT * FROM children;
```

### Debugging

- Check browser console for errors
- Check Supabase logs: Dashboard → Logs
- Verify RLS policies: Dashboard → Table Editor → Select table → Policies

## Production Deployment

1. Build the application:
```bash
npm run build
```

2. Deploy the `dist` folder to your hosting provider:
   - Vercel
   - Netlify
   - AWS S3 + CloudFront
   - Any static hosting service

3. Update environment variables in your hosting platform

4. Enable Supabase production mode:
   - Review and update RLS policies
   - Enable email confirmations (if desired)
   - Set up custom SMTP (optional)
   - Configure auth redirects

## Need Help?

- Check the main README.md for system overview
- Review Supabase documentation: https://supabase.com/docs
- Check React documentation: https://react.dev
