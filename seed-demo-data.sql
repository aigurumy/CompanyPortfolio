-- Seed Demo Data for Child-Care Management System
-- This script creates demo users, children, classes, and sample data
-- Run this in your Supabase SQL Editor after setting up the schema

-- Note: You'll need to create user accounts in Supabase Auth first
-- Then update the UUIDs below with the actual user IDs

-- Demo scenario:
-- 1 Admin user
-- 2 Teacher users
-- 3 Parent users
-- 5 Children
-- 3 Classes

-- ============================================================================
-- STEP 1: Create demo profiles (after creating auth users)
-- ============================================================================

-- Admin Profile
-- Email: admin@childcare.com / Password: admin123
INSERT INTO profiles (id, role, full_name, phone) VALUES
('00000000-0000-0000-0000-000000000001', 'admin', 'Sarah Johnson', '+1-555-0101')
ON CONFLICT (id) DO NOTHING;

-- Teacher Profiles
-- Email: teacher1@childcare.com / Password: teacher123
INSERT INTO profiles (id, role, full_name, phone) VALUES
('00000000-0000-0000-0000-000000000002', 'teacher', 'Emily Davis', '+1-555-0102')
ON CONFLICT (id) DO NOTHING;

-- Email: teacher2@childcare.com / Password: teacher123
INSERT INTO profiles (id, role, full_name, phone) VALUES
('00000000-0000-0000-0000-000000000003', 'teacher', 'Michael Brown', '+1-555-0103')
ON CONFLICT (id) DO NOTHING;

-- Parent Profiles
-- Email: parent1@childcare.com / Password: parent123
INSERT INTO profiles (id, role, full_name, phone) VALUES
('00000000-0000-0000-0000-000000000004', 'parent', 'Jennifer Smith', '+1-555-0104')
ON CONFLICT (id) DO NOTHING;

-- Email: parent2@childcare.com / Password: parent123
INSERT INTO profiles (id, role, full_name, phone) VALUES
('00000000-0000-0000-0000-000000000005', 'parent', 'David Wilson', '+1-555-0105')
ON CONFLICT (id) DO NOTHING;

-- Email: parent3@childcare.com / Password: parent123
INSERT INTO profiles (id, role, full_name, phone) VALUES
('00000000-0000-0000-0000-000000000006', 'parent', 'Lisa Anderson', '+1-555-0106')
ON CONFLICT (id) DO NOTHING;

-- ============================================================================
-- STEP 2: Create Classes
-- ============================================================================

INSERT INTO classes (id, name, age_group, capacity, description) VALUES
('10000000-0000-0000-0000-000000000001', 'Toddlers A', '1-2 years', 12, 'A nurturing environment for our youngest learners'),
('10000000-0000-0000-0000-000000000002', 'Preschool B', '3-4 years', 15, 'Fun and educational activities for preschoolers'),
('10000000-0000-0000-0000-000000000003', 'Pre-K Stars', '4-5 years', 18, 'Kindergarten preparation program')
ON CONFLICT (id) DO NOTHING;

-- ============================================================================
-- STEP 3: Assign Teachers to Classes
-- ============================================================================

INSERT INTO teacher_assignments (teacher_id, class_id, is_lead_teacher) VALUES
('00000000-0000-0000-0000-000000000002', '10000000-0000-0000-0000-000000000001', true),
('00000000-0000-0000-0000-000000000003', '10000000-0000-0000-0000-000000000002', true),
('00000000-0000-0000-0000-000000000003', '10000000-0000-0000-0000-000000000003', true)
ON CONFLICT (teacher_id, class_id) DO NOTHING;

-- ============================================================================
-- STEP 4: Create Children
-- ============================================================================

INSERT INTO children (id, first_name, last_name, date_of_birth, medical_info) VALUES
('20000000-0000-0000-0000-000000000001', 'Emma', 'Smith', '2022-03-15', 'No known allergies'),
('20000000-0000-0000-0000-000000000002', 'Oliver', 'Smith', '2020-07-22', 'Allergic to peanuts'),
('20000000-0000-0000-0000-000000000003', 'Sophia', 'Wilson', '2021-11-08', 'No known allergies'),
('20000000-0000-0000-0000-000000000004', 'Liam', 'Anderson', '2020-05-14', 'Lactose intolerant'),
('20000000-0000-0000-0000-000000000005', 'Ava', 'Anderson', '2022-09-30', 'No known allergies')
ON CONFLICT (id) DO NOTHING;

-- ============================================================================
-- STEP 5: Link Parents to Children
-- ============================================================================

INSERT INTO parent_children (parent_id, child_id, relationship, is_primary_contact) VALUES
('00000000-0000-0000-0000-000000000004', '20000000-0000-0000-0000-000000000001', 'mother', true),
('00000000-0000-0000-0000-000000000004', '20000000-0000-0000-0000-000000000002', 'mother', true),
('00000000-0000-0000-0000-000000000005', '20000000-0000-0000-0000-000000000003', 'father', true),
('00000000-0000-0000-0000-000000000006', '20000000-0000-0000-0000-000000000004', 'mother', true),
('00000000-0000-0000-0000-000000000006', '20000000-0000-0000-0000-000000000005', 'mother', true)
ON CONFLICT (parent_id, child_id) DO NOTHING;

-- ============================================================================
-- STEP 6: Enroll Children in Classes
-- ============================================================================

INSERT INTO class_enrollments (child_id, class_id, status) VALUES
('20000000-0000-0000-0000-000000000001', '10000000-0000-0000-0000-000000000001', 'active'),
('20000000-0000-0000-0000-000000000005', '10000000-0000-0000-0000-000000000001', 'active'),
('20000000-0000-0000-0000-000000000003', '10000000-0000-0000-0000-000000000002', 'active'),
('20000000-0000-0000-0000-000000000002', '10000000-0000-0000-0000-000000000003', 'active'),
('20000000-0000-0000-0000-000000000004', '10000000-0000-0000-0000-000000000003', 'active')
ON CONFLICT (child_id, class_id) DO NOTHING;

-- ============================================================================
-- STEP 7: Add Sample Attendance Records (Today's date)
-- ============================================================================

INSERT INTO attendance (child_id, date, check_in_time, checked_in_by) VALUES
('20000000-0000-0000-0000-000000000001', CURRENT_DATE, CURRENT_TIMESTAMP - INTERVAL '2 hours', '00000000-0000-0000-0000-000000000002'),
('20000000-0000-0000-0000-000000000002', CURRENT_DATE, CURRENT_TIMESTAMP - INTERVAL '2 hours', '00000000-0000-0000-0000-000000000003'),
('20000000-0000-0000-0000-000000000003', CURRENT_DATE, CURRENT_TIMESTAMP - INTERVAL '1 hour 30 minutes', '00000000-0000-0000-0000-000000000003'),
('20000000-0000-0000-0000-000000000005', CURRENT_DATE, CURRENT_TIMESTAMP - INTERVAL '3 hours', '00000000-0000-0000-0000-000000000002');

-- ============================================================================
-- STEP 8: Add Sample Activities
-- ============================================================================

INSERT INTO activities (class_id, teacher_id, title, description, activity_type) VALUES
('10000000-0000-0000-0000-000000000001', '00000000-0000-0000-0000-000000000002', 'Morning Circle Time', 'We sang songs and learned about colors today!', 'learning'),
('10000000-0000-0000-0000-000000000001', '00000000-0000-0000-0000-000000000002', 'Outdoor Play', 'The children enjoyed playing in the sandbox and on the swings.', 'play'),
('10000000-0000-0000-0000-000000000002', '00000000-0000-0000-0000-000000000003', 'Art Project', 'We created beautiful paintings using finger paints and stamps.', 'learning'),
('10000000-0000-0000-0000-000000000003', '00000000-0000-0000-0000-000000000003', 'Story Time', 'Read "The Very Hungry Caterpillar" and discussed butterflies.', 'learning'),
('10000000-0000-0000-0000-000000000002', '00000000-0000-0000-0000-000000000003', 'Healthy Snack', 'The children enjoyed apple slices with cheese.', 'meal');

-- ============================================================================
-- STEP 9: Add Sample Announcements
-- ============================================================================

INSERT INTO announcements (author_id, class_id, title, content, priority) VALUES
('00000000-0000-0000-0000-000000000001', NULL, 'Holiday Closure', 'The center will be closed next Monday for the holiday. We will reopen on Tuesday.', 'important'),
('00000000-0000-0000-0000-000000000002', '10000000-0000-0000-0000-000000000001', 'Show and Tell Friday', 'Please send your child with a favorite toy for show and tell this Friday!', 'normal'),
('00000000-0000-0000-0000-000000000003', '10000000-0000-0000-0000-000000000002', 'Field Trip Next Week', 'We will be visiting the local zoo next Thursday. Permission slips must be returned by Monday.', 'important');

-- ============================================================================
-- INSTRUCTIONS
-- ============================================================================

-- To use this demo data:
-- 1. First, create user accounts in Supabase Auth Dashboard with these credentials:
--    - admin@childcare.com / admin123
--    - teacher1@childcare.com / teacher123
--    - teacher2@childcare.com / teacher123
--    - parent1@childcare.com / parent123
--    - parent2@childcare.com / parent123
--    - parent3@childcare.com / parent123
--
-- 2. Get the actual user IDs from auth.users table
-- 3. Update the profile inserts above with the real user IDs
-- 4. Run this entire script in Supabase SQL Editor
--
-- Or use placeholder UUIDs for testing (they won't link to real auth users)
