-- Create the first admin user

INSERT INTO admin_users (id, email) 
SELECT id, email FROM auth.users WHERE email = 'admin@example.com'
ON CONFLICT (id) DO NOTHING;
