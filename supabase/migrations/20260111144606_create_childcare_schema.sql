/*
  # Child-Care Management System Database Schema

  ## Overview
  This migration creates the complete database schema for a child-care management system
  with role-based access control for admins, teachers, and parents.

  ## Tables Created

  ### 1. profiles
  - Extends auth.users with profile information
  - `id` (uuid, references auth.users)
  - `role` (text) - 'admin', 'teacher', or 'parent'
  - `full_name` (text)
  - `phone` (text)
  - `avatar_url` (text)
  - `created_at` (timestamptz)
  - `updated_at` (timestamptz)

  ### 2. children
  - Stores information about children enrolled in the facility
  - `id` (uuid, primary key)
  - `first_name` (text)
  - `last_name` (text)
  - `date_of_birth` (date)
  - `medical_info` (text) - allergies, medications, etc.
  - `photo_url` (text)
  - `created_at` (timestamptz)
  - `updated_at` (timestamptz)

  ### 3. parent_children
  - Links parents to their children (many-to-many relationship)
  - `parent_id` (uuid, references profiles)
  - `child_id` (uuid, references children)
  - `relationship` (text) - mother, father, guardian, etc.
  - `is_primary_contact` (boolean)

  ### 4. classes
  - Represents different classes or groups
  - `id` (uuid, primary key)
  - `name` (text) - e.g., "Toddlers A", "Preschool B"
  - `age_group` (text)
  - `capacity` (integer)
  - `description` (text)
  - `created_at` (timestamptz)

  ### 5. class_enrollments
  - Links children to their classes
  - `id` (uuid, primary key)
  - `child_id` (uuid, references children)
  - `class_id` (uuid, references classes)
  - `enrolled_at` (timestamptz)
  - `status` (text) - 'active', 'inactive'

  ### 6. teacher_assignments
  - Links teachers to their classes
  - `teacher_id` (uuid, references profiles)
  - `class_id` (uuid, references classes)
  - `is_lead_teacher` (boolean)
  - `assigned_at` (timestamptz)

  ### 7. attendance
  - Daily attendance tracking
  - `id` (uuid, primary key)
  - `child_id` (uuid, references children)
  - `date` (date)
  - `check_in_time` (timestamptz)
  - `check_out_time` (timestamptz)
  - `checked_in_by` (uuid, references profiles)
  - `checked_out_by` (uuid, references profiles)
  - `notes` (text)

  ### 8. activities
  - Daily activities, photos, and updates
  - `id` (uuid, primary key)
  - `class_id` (uuid, references classes)
  - `teacher_id` (uuid, references profiles)
  - `title` (text)
  - `description` (text)
  - `activity_type` (text) - 'meal', 'nap', 'learning', 'play', 'photo'
  - `photo_url` (text)
  - `created_at` (timestamptz)

  ### 9. announcements
  - System-wide or class-specific announcements
  - `id` (uuid, primary key)
  - `author_id` (uuid, references profiles)
  - `class_id` (uuid, references classes) - null for system-wide
  - `title` (text)
  - `content` (text)
  - `priority` (text) - 'normal', 'important', 'urgent'
  - `created_at` (timestamptz)

  ## Security
  - Row Level Security (RLS) enabled on all tables
  - Policies created for role-based access:
    - Admins: Full access to everything
    - Teachers: Access to their assigned classes and children
    - Parents: Access only to their own children's information
*/

-- Create custom types
DO $$ BEGIN
  CREATE TYPE user_role AS ENUM ('admin', 'teacher', 'parent');
EXCEPTION
  WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
  CREATE TYPE enrollment_status AS ENUM ('active', 'inactive');
EXCEPTION
  WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
  CREATE TYPE activity_type AS ENUM ('meal', 'nap', 'learning', 'play', 'photo', 'other');
EXCEPTION
  WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
  CREATE TYPE announcement_priority AS ENUM ('normal', 'important', 'urgent');
EXCEPTION
  WHEN duplicate_object THEN null;
END $$;

-- Profiles table
CREATE TABLE IF NOT EXISTS profiles (
  id uuid PRIMARY KEY REFERENCES auth.users ON DELETE CASCADE,
  role text NOT NULL DEFAULT 'parent',
  full_name text NOT NULL,
  phone text,
  avatar_url text,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;

-- Children table
CREATE TABLE IF NOT EXISTS children (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  first_name text NOT NULL,
  last_name text NOT NULL,
  date_of_birth date NOT NULL,
  medical_info text,
  photo_url text,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

ALTER TABLE children ENABLE ROW LEVEL SECURITY;

-- Parent-Children relationship table
CREATE TABLE IF NOT EXISTS parent_children (
  parent_id uuid REFERENCES profiles(id) ON DELETE CASCADE,
  child_id uuid REFERENCES children(id) ON DELETE CASCADE,
  relationship text NOT NULL DEFAULT 'parent',
  is_primary_contact boolean DEFAULT false,
  PRIMARY KEY (parent_id, child_id)
);

ALTER TABLE parent_children ENABLE ROW LEVEL SECURITY;

-- Classes table
CREATE TABLE IF NOT EXISTS classes (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  age_group text,
  capacity integer DEFAULT 20,
  description text,
  created_at timestamptz DEFAULT now()
);

ALTER TABLE classes ENABLE ROW LEVEL SECURITY;

-- Class enrollments table
CREATE TABLE IF NOT EXISTS class_enrollments (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  child_id uuid REFERENCES children(id) ON DELETE CASCADE,
  class_id uuid REFERENCES classes(id) ON DELETE CASCADE,
  enrolled_at timestamptz DEFAULT now(),
  status text DEFAULT 'active',
  UNIQUE(child_id, class_id)
);

ALTER TABLE class_enrollments ENABLE ROW LEVEL SECURITY;

-- Teacher assignments table
CREATE TABLE IF NOT EXISTS teacher_assignments (
  teacher_id uuid REFERENCES profiles(id) ON DELETE CASCADE,
  class_id uuid REFERENCES classes(id) ON DELETE CASCADE,
  is_lead_teacher boolean DEFAULT false,
  assigned_at timestamptz DEFAULT now(),
  PRIMARY KEY (teacher_id, class_id)
);

ALTER TABLE teacher_assignments ENABLE ROW LEVEL SECURITY;

-- Attendance table
CREATE TABLE IF NOT EXISTS attendance (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  child_id uuid REFERENCES children(id) ON DELETE CASCADE,
  date date NOT NULL DEFAULT CURRENT_DATE,
  check_in_time timestamptz,
  check_out_time timestamptz,
  checked_in_by uuid REFERENCES profiles(id),
  checked_out_by uuid REFERENCES profiles(id),
  notes text,
  created_at timestamptz DEFAULT now()
);

ALTER TABLE attendance ENABLE ROW LEVEL SECURITY;

-- Activities table
CREATE TABLE IF NOT EXISTS activities (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  class_id uuid REFERENCES classes(id) ON DELETE CASCADE,
  teacher_id uuid REFERENCES profiles(id),
  title text NOT NULL,
  description text,
  activity_type text DEFAULT 'other',
  photo_url text,
  created_at timestamptz DEFAULT now()
);

ALTER TABLE activities ENABLE ROW LEVEL SECURITY;

-- Announcements table
CREATE TABLE IF NOT EXISTS announcements (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  author_id uuid REFERENCES profiles(id),
  class_id uuid REFERENCES classes(id) ON DELETE CASCADE,
  title text NOT NULL,
  content text NOT NULL,
  priority text DEFAULT 'normal',
  created_at timestamptz DEFAULT now()
);

ALTER TABLE announcements ENABLE ROW LEVEL SECURITY;

-- ============================================================================
-- ROW LEVEL SECURITY POLICIES
-- ============================================================================

-- Profiles policies
CREATE POLICY "Users can view all profiles"
  ON profiles FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Users can update own profile"
  ON profiles FOR UPDATE
  TO authenticated
  USING (auth.uid() = id)
  WITH CHECK (auth.uid() = id);

CREATE POLICY "Admins can insert profiles"
  ON profiles FOR INSERT
  TO authenticated
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM profiles
      WHERE id = auth.uid() AND role = 'admin'
    )
  );

-- Children policies
CREATE POLICY "Admins can view all children"
  ON children FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM profiles
      WHERE id = auth.uid() AND role = 'admin'
    )
  );

CREATE POLICY "Teachers can view children in their classes"
  ON children FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM profiles
      WHERE id = auth.uid() AND role = 'teacher'
    )
    AND EXISTS (
      SELECT 1 FROM class_enrollments ce
      JOIN teacher_assignments ta ON ce.class_id = ta.class_id
      WHERE ce.child_id = children.id AND ta.teacher_id = auth.uid()
    )
  );

CREATE POLICY "Parents can view their own children"
  ON children FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM parent_children
      WHERE parent_id = auth.uid() AND child_id = children.id
    )
  );

CREATE POLICY "Admins can insert children"
  ON children FOR INSERT
  TO authenticated
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM profiles
      WHERE id = auth.uid() AND role = 'admin'
    )
  );

CREATE POLICY "Admins can update children"
  ON children FOR UPDATE
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM profiles
      WHERE id = auth.uid() AND role = 'admin'
    )
  )
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM profiles
      WHERE id = auth.uid() AND role = 'admin'
    )
  );

-- Parent-Children policies
CREATE POLICY "Users can view parent-child relationships for accessible children"
  ON parent_children FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM profiles
      WHERE id = auth.uid() AND role IN ('admin', 'teacher')
    )
    OR parent_id = auth.uid()
  );

CREATE POLICY "Admins can manage parent-child relationships"
  ON parent_children FOR ALL
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM profiles
      WHERE id = auth.uid() AND role = 'admin'
    )
  )
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM profiles
      WHERE id = auth.uid() AND role = 'admin'
    )
  );

-- Classes policies
CREATE POLICY "All authenticated users can view classes"
  ON classes FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Admins can manage classes"
  ON classes FOR ALL
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM profiles
      WHERE id = auth.uid() AND role = 'admin'
    )
  )
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM profiles
      WHERE id = auth.uid() AND role = 'admin'
    )
  );

-- Class enrollments policies
CREATE POLICY "Users can view enrollments for accessible children"
  ON class_enrollments FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM profiles
      WHERE id = auth.uid() AND role = 'admin'
    )
    OR EXISTS (
      SELECT 1 FROM teacher_assignments
      WHERE teacher_id = auth.uid() AND class_id = class_enrollments.class_id
    )
    OR EXISTS (
      SELECT 1 FROM parent_children
      WHERE parent_id = auth.uid() AND child_id = class_enrollments.child_id
    )
  );

CREATE POLICY "Admins can manage enrollments"
  ON class_enrollments FOR ALL
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM profiles
      WHERE id = auth.uid() AND role = 'admin'
    )
  )
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM profiles
      WHERE id = auth.uid() AND role = 'admin'
    )
  );

-- Teacher assignments policies
CREATE POLICY "Users can view teacher assignments"
  ON teacher_assignments FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Admins can manage teacher assignments"
  ON teacher_assignments FOR ALL
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM profiles
      WHERE id = auth.uid() AND role = 'admin'
    )
  )
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM profiles
      WHERE id = auth.uid() AND role = 'admin'
    )
  );

-- Attendance policies
CREATE POLICY "Admins can view all attendance"
  ON attendance FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM profiles
      WHERE id = auth.uid() AND role = 'admin'
    )
  );

CREATE POLICY "Teachers can view attendance for their classes"
  ON attendance FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM profiles
      WHERE id = auth.uid() AND role = 'teacher'
    )
    AND EXISTS (
      SELECT 1 FROM class_enrollments ce
      JOIN teacher_assignments ta ON ce.class_id = ta.class_id
      WHERE ce.child_id = attendance.child_id AND ta.teacher_id = auth.uid()
    )
  );

CREATE POLICY "Parents can view attendance for their children"
  ON attendance FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM parent_children
      WHERE parent_id = auth.uid() AND child_id = attendance.child_id
    )
  );

CREATE POLICY "Admins and teachers can manage attendance"
  ON attendance FOR ALL
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM profiles
      WHERE id = auth.uid() AND role IN ('admin', 'teacher')
    )
  )
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM profiles
      WHERE id = auth.uid() AND role IN ('admin', 'teacher')
    )
  );

-- Activities policies
CREATE POLICY "Users can view activities for accessible classes"
  ON activities FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM profiles
      WHERE id = auth.uid() AND role = 'admin'
    )
    OR EXISTS (
      SELECT 1 FROM teacher_assignments
      WHERE teacher_id = auth.uid() AND class_id = activities.class_id
    )
    OR EXISTS (
      SELECT 1 FROM parent_children pc
      JOIN class_enrollments ce ON pc.child_id = ce.child_id
      WHERE pc.parent_id = auth.uid() AND ce.class_id = activities.class_id
    )
  );

CREATE POLICY "Admins and teachers can create activities"
  ON activities FOR INSERT
  TO authenticated
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM profiles
      WHERE id = auth.uid() AND role IN ('admin', 'teacher')
    )
  );

CREATE POLICY "Authors can update their activities"
  ON activities FOR UPDATE
  TO authenticated
  USING (teacher_id = auth.uid())
  WITH CHECK (teacher_id = auth.uid());

CREATE POLICY "Admins can delete activities"
  ON activities FOR DELETE
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM profiles
      WHERE id = auth.uid() AND role = 'admin'
    )
  );

-- Announcements policies
CREATE POLICY "Users can view relevant announcements"
  ON announcements FOR SELECT
  TO authenticated
  USING (
    class_id IS NULL
    OR EXISTS (
      SELECT 1 FROM profiles
      WHERE id = auth.uid() AND role = 'admin'
    )
    OR EXISTS (
      SELECT 1 FROM teacher_assignments
      WHERE teacher_id = auth.uid() AND class_id = announcements.class_id
    )
    OR EXISTS (
      SELECT 1 FROM parent_children pc
      JOIN class_enrollments ce ON pc.child_id = ce.child_id
      WHERE pc.parent_id = auth.uid() AND ce.class_id = announcements.class_id
    )
  );

CREATE POLICY "Admins and teachers can create announcements"
  ON announcements FOR INSERT
  TO authenticated
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM profiles
      WHERE id = auth.uid() AND role IN ('admin', 'teacher')
    )
  );

CREATE POLICY "Authors can update their announcements"
  ON announcements FOR UPDATE
  TO authenticated
  USING (author_id = auth.uid())
  WITH CHECK (author_id = auth.uid());

CREATE POLICY "Admins can delete announcements"
  ON announcements FOR DELETE
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM profiles
      WHERE id = auth.uid() AND role = 'admin'
    )
  );

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_profiles_role ON profiles(role);
CREATE INDEX IF NOT EXISTS idx_parent_children_parent ON parent_children(parent_id);
CREATE INDEX IF NOT EXISTS idx_parent_children_child ON parent_children(child_id);
CREATE INDEX IF NOT EXISTS idx_class_enrollments_child ON class_enrollments(child_id);
CREATE INDEX IF NOT EXISTS idx_class_enrollments_class ON class_enrollments(class_id);
CREATE INDEX IF NOT EXISTS idx_teacher_assignments_teacher ON teacher_assignments(teacher_id);
CREATE INDEX IF NOT EXISTS idx_teacher_assignments_class ON teacher_assignments(class_id);
CREATE INDEX IF NOT EXISTS idx_attendance_child ON attendance(child_id);
CREATE INDEX IF NOT EXISTS idx_attendance_date ON attendance(date);
CREATE INDEX IF NOT EXISTS idx_activities_class ON activities(class_id);
CREATE INDEX IF NOT EXISTS idx_announcements_class ON announcements(class_id);