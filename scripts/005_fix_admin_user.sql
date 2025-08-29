-- First, let's check if the admin user exists and fix any issues
-- This script will ensure the admin user is properly set up

-- Check if admin user exists in auth.users
DO $$
DECLARE
    admin_user_id UUID;
BEGIN
    -- Get the admin user ID
    SELECT id INTO admin_user_id 
    FROM auth.users 
    WHERE email = 'admin@example.com';
    
    IF admin_user_id IS NULL THEN
        -- Create the admin user if it doesn't exist
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
            NOW(),
            NOW(),
            NOW(),
            '',
            '',
            '',
            ''
        ) RETURNING id INTO admin_user_id;
        
        RAISE NOTICE 'Created new admin user with ID: %', admin_user_id;
    ELSE
        RAISE NOTICE 'Admin user already exists with ID: %', admin_user_id;
    END IF;
    
    -- Ensure the admin user is in admin_users table
    INSERT INTO admin_users (id, email, created_at)
    VALUES (admin_user_id, 'admin@example.com', NOW())
    ON CONFLICT (id) DO NOTHING;
    
    RAISE NOTICE 'Admin user setup complete';
END $$;

-- Temporarily disable RLS on admin_users for testing
ALTER TABLE admin_users DISABLE ROW LEVEL SECURITY;

-- Re-enable RLS but with a simple policy
ALTER TABLE admin_users ENABLE ROW LEVEL SECURITY;

-- Drop existing policies if they exist
DROP POLICY IF EXISTS "Admin users can read admin_users" ON admin_users;
DROP POLICY IF EXISTS "Admin users can insert admin_users" ON admin_users;
DROP POLICY IF EXISTS "Admin users can update admin_users" ON admin_users;
DROP POLICY IF EXISTS "Admin users can delete admin_users" ON admin_users;

-- Create simple policies for admin_users table
CREATE POLICY "Allow authenticated users to read admin_users" ON admin_users
    FOR SELECT USING (auth.role() = 'authenticated');

CREATE POLICY "Allow authenticated users to insert admin_users" ON admin_users
    FOR INSERT WITH CHECK (auth.role() = 'authenticated');

CREATE POLICY "Allow authenticated users to update admin_users" ON admin_users
    FOR UPDATE USING (auth.role() = 'authenticated');

CREATE POLICY "Allow authenticated users to delete admin_users" ON admin_users
    FOR DELETE USING (auth.role() = 'authenticated');
