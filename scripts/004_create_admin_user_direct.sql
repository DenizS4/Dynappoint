-- Create admin user directly in the database
-- This creates both the auth user and admin user entry in one script

-- Insert admin user into auth.users table
INSERT INTO auth.users (
  instance_id,
  id,
  aud,
  role,
  email,
  encrypted_password,
  email_confirmed_at,
  created_at,
  updated_at,
  confirmation_token,
  email_change,
  email_change_token_new,
  recovery_token
) VALUES (
  '00000000-0000-0000-0000-000000000000',
  gen_random_uuid(),
  'authenticated',
  'authenticated',
  'admin@example.com',
  crypt('admin123456', gen_salt('bf')),
  now(),
  now(),
  now(),
  '',
  '',
  '',
  ''
);

-- Insert the same user into admin_users table
INSERT INTO admin_users (id, email)
SELECT id, email FROM auth.users WHERE email = 'admin@example.com'
ON CONFLICT (id) DO NOTHING;

-- Confirm the admin user was created
SELECT 'Admin user created successfully' as status, email FROM auth.users WHERE email = 'admin@example.com';
