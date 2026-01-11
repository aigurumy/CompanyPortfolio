/*
  # Add Taska-Care Enhanced Features
  
  ## New Tables and Features
  
  ### Student Management
  - Extend children table with MyKid number and enhanced fields
  - Add enrollments table for enrollment workflow
  - Add allergies and medical_conditions tables
  
  ### Activity & Care Logging
  - Extend activities table for individual child logs
  - Add activity_photos table
  - Add temperature_logs table
  
  ### Staff Management
  - Add staff table
  - Add leave_requests table
  - Add staff_attendance table
  
  ### Financial Management
  - Add fee_structures table
  - Add student_fees table
  - Add payments table
  
  ### Compliance & Communication
  - Add compliance_documents table
  - Add child_documents table
  - Add messages table
  - Add feedback table
  - Add subscriptions table
  
  ## Security
  - RLS enabled on all new tables
  - Role-based access policies
*/

-- Create additional enum types
DO $$ BEGIN
  CREATE TYPE leave_type AS ENUM ('sick', 'annual', 'emergency', 'unpaid');
EXCEPTION
  WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
  CREATE TYPE leave_status AS ENUM ('pending', 'approved', 'rejected');
EXCEPTION
  WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
  CREATE TYPE payment_status AS ENUM ('pending', 'paid', 'overdue', 'partial');
EXCEPTION
  WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
  CREATE TYPE payment_method AS ENUM ('bank_transfer', 'cash', 'card', 'online');
EXCEPTION
  WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
  CREATE TYPE compliance_type AS ENUM ('jkm', 'bomba', 'kkm', 'business_license', 'insurance', 'other');
EXCEPTION
  WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
  CREATE TYPE message_status AS ENUM ('sent', 'delivered', 'read');
EXCEPTION
  WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
  CREATE TYPE feedback_category AS ENUM ('bug_report', 'feature_request', 'general', 'complaint', 'praise');
EXCEPTION
  WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
  CREATE TYPE language_preference AS ENUM ('en', 'bm');
EXCEPTION
  WHEN duplicate_object THEN null;
END $$;

-- Create update_updated_at function
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Add language preference to profiles
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_name = 'profiles' AND column_name = 'language_preference'
  ) THEN
    ALTER TABLE profiles ADD COLUMN language_preference language_preference DEFAULT 'en';
  END IF;
END $$;

-- Extend children table
DO $$
BEGIN
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'children' AND column_name = 'full_name') THEN
    ALTER TABLE children ADD COLUMN full_name text;
  END IF;
  
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'children' AND column_name = 'mykid_number') THEN
    ALTER TABLE children ADD COLUMN mykid_number text UNIQUE;
  END IF;
  
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'children' AND column_name = 'gender') THEN
    ALTER TABLE children ADD COLUMN gender text CHECK (gender IN ('male', 'female'));
  END IF;
  
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'children' AND column_name = 'emergency_contact_name') THEN
    ALTER TABLE children ADD COLUMN emergency_contact_name text;
  END IF;
  
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'children' AND column_name = 'emergency_contact_phone') THEN
    ALTER TABLE children ADD COLUMN emergency_contact_phone text;
  END IF;
  
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'children' AND column_name = 'emergency_contact_relation') THEN
    ALTER TABLE children ADD COLUMN emergency_contact_relation text;
  END IF;
  
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'children' AND column_name = 'address') THEN
    ALTER TABLE children ADD COLUMN address text;
  END IF;
  
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'children' AND column_name = 'notes') THEN
    ALTER TABLE children ADD COLUMN notes text;
  END IF;
  
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'children' AND column_name = 'is_active') THEN
    ALTER TABLE children ADD COLUMN is_active boolean DEFAULT true;
  END IF;
END $$;

-- Enrollments table (for enrollment requests)
CREATE TABLE IF NOT EXISTS enrollments (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  child_id uuid REFERENCES children(id) ON DELETE CASCADE,
  parent_id uuid REFERENCES profiles(id) ON DELETE CASCADE,
  status text CHECK (status IN ('pending', 'approved', 'rejected')) DEFAULT 'pending',
  enrollment_date date,
  start_date date,
  notes text,
  reviewed_by uuid REFERENCES profiles(id),
  reviewed_at timestamptz,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Allergies table
CREATE TABLE IF NOT EXISTS allergies (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  child_id uuid REFERENCES children(id) ON DELETE CASCADE,
  allergen text NOT NULL,
  severity text CHECK (severity IN ('mild', 'moderate', 'severe')),
  reaction_description text,
  treatment_notes text,
  created_at timestamptz DEFAULT now()
);

-- Medical conditions table
CREATE TABLE IF NOT EXISTS medical_conditions (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  child_id uuid REFERENCES children(id) ON DELETE CASCADE,
  condition_name text NOT NULL,
  description text,
  medication text,
  special_care_instructions text,
  created_at timestamptz DEFAULT now()
);

-- Activity photos table
CREATE TABLE IF NOT EXISTS activity_photos (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  activity_id uuid REFERENCES activities(id) ON DELETE CASCADE,
  photo_url text NOT NULL,
  caption text,
  created_at timestamptz DEFAULT now()
);

-- Temperature logs table
CREATE TABLE IF NOT EXISTS temperature_logs (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  child_id uuid REFERENCES children(id) ON DELETE CASCADE,
  logged_by uuid REFERENCES profiles(id),
  temperature_celsius decimal(4,2) NOT NULL,
  notes text,
  logged_at timestamptz DEFAULT now()
);

-- Staff table
CREATE TABLE IF NOT EXISTS staff (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES profiles(id) ON DELETE CASCADE UNIQUE,
  position text NOT NULL,
  employee_id text UNIQUE,
  date_joined date NOT NULL,
  salary decimal(10,2),
  ic_number text,
  is_active boolean DEFAULT true,
  created_at timestamptz DEFAULT now()
);

-- Leave requests table
CREATE TABLE IF NOT EXISTS leave_requests (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  staff_id uuid REFERENCES staff(id) ON DELETE CASCADE,
  leave_type leave_type NOT NULL,
  start_date date NOT NULL,
  end_date date NOT NULL,
  reason text NOT NULL,
  status leave_status DEFAULT 'pending',
  reviewed_by uuid REFERENCES profiles(id),
  reviewed_at timestamptz,
  review_notes text,
  created_at timestamptz DEFAULT now()
);

-- Staff attendance table
CREATE TABLE IF NOT EXISTS staff_attendance (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  staff_id uuid REFERENCES staff(id) ON DELETE CASCADE,
  attendance_date date NOT NULL,
  check_in_time timestamptz,
  check_out_time timestamptz,
  status text CHECK (status IN ('present', 'absent', 'late', 'on_leave')),
  notes text,
  created_at timestamptz DEFAULT now(),
  UNIQUE(staff_id, attendance_date)
);

-- Fee structures table
CREATE TABLE IF NOT EXISTS fee_structures (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  description text,
  monthly_amount decimal(10,2) NOT NULL,
  is_active boolean DEFAULT true,
  created_at timestamptz DEFAULT now()
);

-- Student fees table
CREATE TABLE IF NOT EXISTS student_fees (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  child_id uuid REFERENCES children(id) ON DELETE CASCADE,
  fee_structure_id uuid REFERENCES fee_structures(id),
  month_year date NOT NULL,
  base_amount decimal(10,2) NOT NULL,
  additional_charges decimal(10,2) DEFAULT 0,
  discount decimal(10,2) DEFAULT 0,
  total_amount decimal(10,2) NOT NULL,
  amount_paid decimal(10,2) DEFAULT 0,
  balance decimal(10,2) NOT NULL,
  status payment_status DEFAULT 'pending',
  due_date date,
  created_at timestamptz DEFAULT now(),
  UNIQUE(child_id, month_year)
);

-- Payments table
CREATE TABLE IF NOT EXISTS payments (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  student_fee_id uuid REFERENCES student_fees(id) ON DELETE CASCADE,
  child_id uuid REFERENCES children(id) ON DELETE CASCADE,
  paid_by uuid REFERENCES profiles(id),
  amount decimal(10,2) NOT NULL,
  payment_method payment_method NOT NULL,
  payment_date date NOT NULL,
  receipt_url text,
  reference_number text,
  notes text,
  created_at timestamptz DEFAULT now()
);

-- Compliance documents table
CREATE TABLE IF NOT EXISTS compliance_documents (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  document_type compliance_type NOT NULL,
  document_name text NOT NULL,
  document_number text,
  issue_date date,
  expiry_date date,
  issuing_authority text,
  document_url text,
  status text CHECK (status IN ('valid', 'expiring_soon', 'expired')) DEFAULT 'valid',
  notes text,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Child documents table
CREATE TABLE IF NOT EXISTS child_documents (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  child_id uuid REFERENCES children(id) ON DELETE CASCADE,
  document_type text NOT NULL,
  document_name text NOT NULL,
  document_url text NOT NULL,
  uploaded_by uuid REFERENCES profiles(id),
  uploaded_at timestamptz DEFAULT now()
);

-- Messages table
CREATE TABLE IF NOT EXISTS messages (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  sender_id uuid REFERENCES profiles(id) ON DELETE CASCADE,
  recipient_id uuid REFERENCES profiles(id) ON DELETE CASCADE,
  subject text,
  message_text text NOT NULL,
  status message_status DEFAULT 'sent',
  read_at timestamptz,
  parent_message_id uuid REFERENCES messages(id),
  created_at timestamptz DEFAULT now()
);

-- Feedback table
CREATE TABLE IF NOT EXISTS feedback (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  submitted_by uuid REFERENCES profiles(id),
  category feedback_category NOT NULL,
  rating integer CHECK (rating >= 1 AND rating <= 5),
  title text,
  message text NOT NULL,
  status text CHECK (status IN ('new', 'reviewed', 'resolved', 'closed')) DEFAULT 'new',
  admin_response text,
  created_at timestamptz DEFAULT now()
);

-- Subscriptions table
CREATE TABLE IF NOT EXISTS subscriptions (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  organization_name text NOT NULL DEFAULT 'Default Taska',
  plan_name text NOT NULL,
  features jsonb,
  monthly_price decimal(10,2) NOT NULL,
  is_active boolean DEFAULT true,
  start_date date NOT NULL,
  end_date date,
  max_students integer,
  created_at timestamptz DEFAULT now()
);

-- Create indexes
CREATE INDEX IF NOT EXISTS idx_enrollments_status ON enrollments(status);
CREATE INDEX IF NOT EXISTS idx_student_fees_status ON student_fees(status);
CREATE INDEX IF NOT EXISTS idx_student_fees_child_month ON student_fees(child_id, month_year);
CREATE INDEX IF NOT EXISTS idx_messages_recipient ON messages(recipient_id, created_at DESC);
CREATE INDEX IF NOT EXISTS idx_compliance_expiry ON compliance_documents(expiry_date);
CREATE INDEX IF NOT EXISTS idx_temperature_logs_child ON temperature_logs(child_id, logged_at DESC);

-- Enable RLS on new tables
ALTER TABLE enrollments ENABLE ROW LEVEL SECURITY;
ALTER TABLE allergies ENABLE ROW LEVEL SECURITY;
ALTER TABLE medical_conditions ENABLE ROW LEVEL SECURITY;
ALTER TABLE activity_photos ENABLE ROW LEVEL SECURITY;
ALTER TABLE temperature_logs ENABLE ROW LEVEL SECURITY;
ALTER TABLE staff ENABLE ROW LEVEL SECURITY;
ALTER TABLE leave_requests ENABLE ROW LEVEL SECURITY;
ALTER TABLE staff_attendance ENABLE ROW LEVEL SECURITY;
ALTER TABLE fee_structures ENABLE ROW LEVEL SECURITY;
ALTER TABLE student_fees ENABLE ROW LEVEL SECURITY;
ALTER TABLE payments ENABLE ROW LEVEL SECURITY;
ALTER TABLE compliance_documents ENABLE ROW LEVEL SECURITY;
ALTER TABLE child_documents ENABLE ROW LEVEL SECURITY;
ALTER TABLE messages ENABLE ROW LEVEL SECURITY;
ALTER TABLE feedback ENABLE ROW LEVEL SECURITY;
ALTER TABLE subscriptions ENABLE ROW LEVEL SECURITY;

-- RLS Policies for enrollments
CREATE POLICY "Parents can view own enrollments"
  ON enrollments FOR SELECT
  TO authenticated
  USING (
    parent_id = auth.uid()
    OR EXISTS (SELECT 1 FROM profiles WHERE profiles.id = auth.uid() AND profiles.role IN ('admin', 'teacher'))
  );

CREATE POLICY "Parents can create enrollments"
  ON enrollments FOR INSERT
  TO authenticated
  WITH CHECK (parent_id = auth.uid());

CREATE POLICY "Admins can update enrollments"
  ON enrollments FOR UPDATE
  TO authenticated
  USING (EXISTS (SELECT 1 FROM profiles WHERE profiles.id = auth.uid() AND profiles.role = 'admin'))
  WITH CHECK (EXISTS (SELECT 1 FROM profiles WHERE profiles.id = auth.uid() AND profiles.role = 'admin'));

-- RLS Policies for allergies
CREATE POLICY "Staff and parents can view allergies"
  ON allergies FOR SELECT
  TO authenticated
  USING (
    child_id IN (SELECT child_id FROM parent_children WHERE parent_id = auth.uid())
    OR EXISTS (SELECT 1 FROM profiles WHERE profiles.id = auth.uid() AND profiles.role IN ('admin', 'teacher'))
  );

CREATE POLICY "Admins can manage allergies"
  ON allergies FOR ALL
  TO authenticated
  USING (EXISTS (SELECT 1 FROM profiles WHERE profiles.id = auth.uid() AND profiles.role = 'admin'))
  WITH CHECK (EXISTS (SELECT 1 FROM profiles WHERE profiles.id = auth.uid() AND profiles.role = 'admin'));

-- RLS Policies for medical_conditions
CREATE POLICY "Staff and parents can view medical conditions"
  ON medical_conditions FOR SELECT
  TO authenticated
  USING (
    child_id IN (SELECT child_id FROM parent_children WHERE parent_id = auth.uid())
    OR EXISTS (SELECT 1 FROM profiles WHERE profiles.id = auth.uid() AND profiles.role IN ('admin', 'teacher'))
  );

CREATE POLICY "Admins can manage medical conditions"
  ON medical_conditions FOR ALL
  TO authenticated
  USING (EXISTS (SELECT 1 FROM profiles WHERE profiles.id = auth.uid() AND profiles.role = 'admin'))
  WITH CHECK (EXISTS (SELECT 1 FROM profiles WHERE profiles.id = auth.uid() AND profiles.role = 'admin'));

-- RLS Policies for activity_photos
CREATE POLICY "Parents can view activity photos"
  ON activity_photos FOR SELECT
  TO authenticated
  USING (
    activity_id IN (
      SELECT a.id FROM activities a
      INNER JOIN parent_children pc ON a.class_id IN (
        SELECT ce.class_id FROM class_enrollments ce WHERE ce.child_id = pc.child_id
      )
      WHERE pc.parent_id = auth.uid()
    )
    OR EXISTS (SELECT 1 FROM profiles WHERE profiles.id = auth.uid() AND profiles.role IN ('admin', 'teacher'))
  );

CREATE POLICY "Teachers can manage activity photos"
  ON activity_photos FOR ALL
  TO authenticated
  USING (EXISTS (SELECT 1 FROM profiles WHERE profiles.id = auth.uid() AND profiles.role IN ('admin', 'teacher')))
  WITH CHECK (EXISTS (SELECT 1 FROM profiles WHERE profiles.id = auth.uid() AND profiles.role IN ('admin', 'teacher')));

-- RLS Policies for temperature_logs
CREATE POLICY "Parents can view own children temperature"
  ON temperature_logs FOR SELECT
  TO authenticated
  USING (
    child_id IN (SELECT child_id FROM parent_children WHERE parent_id = auth.uid())
    OR EXISTS (SELECT 1 FROM profiles WHERE profiles.id = auth.uid() AND profiles.role IN ('admin', 'teacher'))
  );

CREATE POLICY "Teachers can log temperature"
  ON temperature_logs FOR INSERT
  TO authenticated
  WITH CHECK (EXISTS (SELECT 1 FROM profiles WHERE profiles.id = auth.uid() AND profiles.role IN ('admin', 'teacher')));

-- RLS Policies for staff
CREATE POLICY "Admins can view all staff"
  ON staff FOR SELECT
  TO authenticated
  USING (EXISTS (SELECT 1 FROM profiles WHERE profiles.id = auth.uid() AND profiles.role = 'admin'));

CREATE POLICY "Admins can manage staff"
  ON staff FOR ALL
  TO authenticated
  USING (EXISTS (SELECT 1 FROM profiles WHERE profiles.id = auth.uid() AND profiles.role = 'admin'))
  WITH CHECK (EXISTS (SELECT 1 FROM profiles WHERE profiles.id = auth.uid() AND profiles.role = 'admin'));

-- RLS Policies for leave_requests
CREATE POLICY "Staff can view own leave requests"
  ON leave_requests FOR SELECT
  TO authenticated
  USING (
    staff_id IN (SELECT id FROM staff WHERE user_id = auth.uid())
    OR EXISTS (SELECT 1 FROM profiles WHERE profiles.id = auth.uid() AND profiles.role = 'admin')
  );

CREATE POLICY "Staff can create leave requests"
  ON leave_requests FOR INSERT
  TO authenticated
  WITH CHECK (staff_id IN (SELECT id FROM staff WHERE user_id = auth.uid()));

CREATE POLICY "Admins can update leave requests"
  ON leave_requests FOR UPDATE
  TO authenticated
  USING (EXISTS (SELECT 1 FROM profiles WHERE profiles.id = auth.uid() AND profiles.role = 'admin'))
  WITH CHECK (EXISTS (SELECT 1 FROM profiles WHERE profiles.id = auth.uid() AND profiles.role = 'admin'));

-- RLS Policies for staff_attendance
CREATE POLICY "Staff can view own attendance"
  ON staff_attendance FOR SELECT
  TO authenticated
  USING (
    staff_id IN (SELECT id FROM staff WHERE user_id = auth.uid())
    OR EXISTS (SELECT 1 FROM profiles WHERE profiles.id = auth.uid() AND profiles.role = 'admin')
  );

CREATE POLICY "Admins can manage attendance"
  ON staff_attendance FOR ALL
  TO authenticated
  USING (EXISTS (SELECT 1 FROM profiles WHERE profiles.id = auth.uid() AND profiles.role = 'admin'))
  WITH CHECK (EXISTS (SELECT 1 FROM profiles WHERE profiles.id = auth.uid() AND profiles.role = 'admin'));

-- RLS Policies for fee_structures
CREATE POLICY "Admins can view fee structures"
  ON fee_structures FOR SELECT
  TO authenticated
  USING (EXISTS (SELECT 1 FROM profiles WHERE profiles.id = auth.uid() AND profiles.role = 'admin'));

CREATE POLICY "Admins can manage fee structures"
  ON fee_structures FOR ALL
  TO authenticated
  USING (EXISTS (SELECT 1 FROM profiles WHERE profiles.id = auth.uid() AND profiles.role = 'admin'))
  WITH CHECK (EXISTS (SELECT 1 FROM profiles WHERE profiles.id = auth.uid() AND profiles.role = 'admin'));

-- RLS Policies for student_fees
CREATE POLICY "Parents can view own children fees"
  ON student_fees FOR SELECT
  TO authenticated
  USING (
    child_id IN (SELECT child_id FROM parent_children WHERE parent_id = auth.uid())
    OR EXISTS (SELECT 1 FROM profiles WHERE profiles.id = auth.uid() AND profiles.role = 'admin')
  );

CREATE POLICY "Admins can manage student fees"
  ON student_fees FOR ALL
  TO authenticated
  USING (EXISTS (SELECT 1 FROM profiles WHERE profiles.id = auth.uid() AND profiles.role = 'admin'))
  WITH CHECK (EXISTS (SELECT 1 FROM profiles WHERE profiles.id = auth.uid() AND profiles.role = 'admin'));

-- RLS Policies for payments
CREATE POLICY "Parents can view own payments"
  ON payments FOR SELECT
  TO authenticated
  USING (
    child_id IN (SELECT child_id FROM parent_children WHERE parent_id = auth.uid())
    OR EXISTS (SELECT 1 FROM profiles WHERE profiles.id = auth.uid() AND profiles.role = 'admin')
  );

CREATE POLICY "Parents can create payments"
  ON payments FOR INSERT
  TO authenticated
  WITH CHECK (child_id IN (SELECT child_id FROM parent_children WHERE parent_id = auth.uid()));

CREATE POLICY "Admins can manage payments"
  ON payments FOR ALL
  TO authenticated
  USING (EXISTS (SELECT 1 FROM profiles WHERE profiles.id = auth.uid() AND profiles.role = 'admin'))
  WITH CHECK (EXISTS (SELECT 1 FROM profiles WHERE profiles.id = auth.uid() AND profiles.role = 'admin'));

-- RLS Policies for compliance_documents
CREATE POLICY "Admins can view compliance documents"
  ON compliance_documents FOR SELECT
  TO authenticated
  USING (EXISTS (SELECT 1 FROM profiles WHERE profiles.id = auth.uid() AND profiles.role = 'admin'));

CREATE POLICY "Admins can manage compliance documents"
  ON compliance_documents FOR ALL
  TO authenticated
  USING (EXISTS (SELECT 1 FROM profiles WHERE profiles.id = auth.uid() AND profiles.role = 'admin'))
  WITH CHECK (EXISTS (SELECT 1 FROM profiles WHERE profiles.id = auth.uid() AND profiles.role = 'admin'));

-- RLS Policies for child_documents
CREATE POLICY "Parents can view own children documents"
  ON child_documents FOR SELECT
  TO authenticated
  USING (
    child_id IN (SELECT child_id FROM parent_children WHERE parent_id = auth.uid())
    OR EXISTS (SELECT 1 FROM profiles WHERE profiles.id = auth.uid() AND profiles.role IN ('admin', 'teacher'))
  );

CREATE POLICY "Parents and admins can upload child documents"
  ON child_documents FOR INSERT
  TO authenticated
  WITH CHECK (
    child_id IN (SELECT child_id FROM parent_children WHERE parent_id = auth.uid())
    OR EXISTS (SELECT 1 FROM profiles WHERE profiles.id = auth.uid() AND profiles.role = 'admin')
  );

-- RLS Policies for messages
CREATE POLICY "Users can view own messages"
  ON messages FOR SELECT
  TO authenticated
  USING (sender_id = auth.uid() OR recipient_id = auth.uid());

CREATE POLICY "Users can send messages"
  ON messages FOR INSERT
  TO authenticated
  WITH CHECK (sender_id = auth.uid());

CREATE POLICY "Recipients can update message status"
  ON messages FOR UPDATE
  TO authenticated
  USING (recipient_id = auth.uid())
  WITH CHECK (recipient_id = auth.uid());

-- RLS Policies for feedback
CREATE POLICY "Users can view own feedback"
  ON feedback FOR SELECT
  TO authenticated
  USING (
    submitted_by = auth.uid()
    OR EXISTS (SELECT 1 FROM profiles WHERE profiles.id = auth.uid() AND profiles.role = 'admin')
  );

CREATE POLICY "Authenticated users can submit feedback"
  ON feedback FOR INSERT
  TO authenticated
  WITH CHECK (submitted_by = auth.uid());

CREATE POLICY "Admins can update feedback"
  ON feedback FOR UPDATE
  TO authenticated
  USING (EXISTS (SELECT 1 FROM profiles WHERE profiles.id = auth.uid() AND profiles.role = 'admin'))
  WITH CHECK (EXISTS (SELECT 1 FROM profiles WHERE profiles.id = auth.uid() AND profiles.role = 'admin'));

-- RLS Policies for subscriptions
CREATE POLICY "Admins can view subscriptions"
  ON subscriptions FOR SELECT
  TO authenticated
  USING (EXISTS (SELECT 1 FROM profiles WHERE profiles.id = auth.uid() AND profiles.role = 'admin'));

CREATE POLICY "Admins can manage subscriptions"
  ON subscriptions FOR ALL
  TO authenticated
  USING (EXISTS (SELECT 1 FROM profiles WHERE profiles.id = auth.uid() AND profiles.role = 'admin'))
  WITH CHECK (EXISTS (SELECT 1 FROM profiles WHERE profiles.id = auth.uid() AND profiles.role = 'admin'));

-- Update triggers for updated_at fields
DROP TRIGGER IF EXISTS update_enrollments_updated_at ON enrollments;
CREATE TRIGGER update_enrollments_updated_at BEFORE UPDATE ON enrollments
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

DROP TRIGGER IF EXISTS update_compliance_updated_at ON compliance_documents;
CREATE TRIGGER update_compliance_updated_at BEFORE UPDATE ON compliance_documents
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();