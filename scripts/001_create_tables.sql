-- Create admin users table for dashboard access
CREATE TABLE IF NOT EXISTS admin_users (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  email TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create about section table
CREATE TABLE IF NOT EXISTS about_section (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title TEXT NOT NULL,
  description TEXT NOT NULL,
  image_url TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create work schedule table
CREATE TABLE IF NOT EXISTS work_schedule (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  day_of_week INTEGER NOT NULL CHECK (day_of_week >= 0 AND day_of_week <= 6), -- 0 = Sunday, 6 = Saturday
  is_working BOOLEAN NOT NULL DEFAULT true,
  start_time TIME,
  end_time TIME,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create blogs table
CREATE TABLE IF NOT EXISTS blogs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title TEXT NOT NULL,
  description TEXT NOT NULL,
  image_url TEXT,
  external_url TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create videos table
CREATE TABLE IF NOT EXISTS videos (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title TEXT NOT NULL,
  description TEXT NOT NULL,
  thumbnail_url TEXT,
  external_url TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create FAQ table
CREATE TABLE IF NOT EXISTS faqs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  question TEXT NOT NULL,
  answer TEXT NOT NULL,
  order_index INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create SEO content table
CREATE TABLE IF NOT EXISTS seo_content (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  content TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create footer info table
CREATE TABLE IF NOT EXISTS footer_info (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  company_name TEXT,
  address TEXT,
  phone TEXT,
  email TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create appointments table
CREATE TABLE IF NOT EXISTS appointments (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  email TEXT NOT NULL,
  phone TEXT,
  appointment_date DATE NOT NULL,
  appointment_time TIME NOT NULL,
  message TEXT,
  status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'confirmed', 'cancelled')),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enable RLS on all tables
ALTER TABLE admin_users ENABLE ROW LEVEL SECURITY;
ALTER TABLE about_section ENABLE ROW LEVEL SECURITY;
ALTER TABLE work_schedule ENABLE ROW LEVEL SECURITY;
ALTER TABLE blogs ENABLE ROW LEVEL SECURITY;
ALTER TABLE videos ENABLE ROW LEVEL SECURITY;
ALTER TABLE faqs ENABLE ROW LEVEL SECURITY;
ALTER TABLE seo_content ENABLE ROW LEVEL SECURITY;
ALTER TABLE footer_info ENABLE ROW LEVEL SECURITY;
ALTER TABLE appointments ENABLE ROW LEVEL SECURITY;

-- RLS Policies for admin_users
CREATE POLICY "Admin users can view their own data" ON admin_users FOR SELECT USING (auth.uid() = id);
CREATE POLICY "Admin users can insert their own data" ON admin_users FOR INSERT WITH CHECK (auth.uid() = id);

-- RLS Policies for content tables (admin only for write, public for read)
CREATE POLICY "Anyone can view about section" ON about_section FOR SELECT USING (true);
CREATE POLICY "Admin can manage about section" ON about_section FOR ALL USING (auth.uid() IN (SELECT id FROM admin_users));

CREATE POLICY "Anyone can view work schedule" ON work_schedule FOR SELECT USING (true);
CREATE POLICY "Admin can manage work schedule" ON work_schedule FOR ALL USING (auth.uid() IN (SELECT id FROM admin_users));

CREATE POLICY "Anyone can view blogs" ON blogs FOR SELECT USING (true);
CREATE POLICY "Admin can manage blogs" ON blogs FOR ALL USING (auth.uid() IN (SELECT id FROM admin_users));

CREATE POLICY "Anyone can view videos" ON videos FOR SELECT USING (true);
CREATE POLICY "Admin can manage videos" ON videos FOR ALL USING (auth.uid() IN (SELECT id FROM admin_users));

CREATE POLICY "Anyone can view faqs" ON faqs FOR SELECT USING (true);
CREATE POLICY "Admin can manage faqs" ON faqs FOR ALL USING (auth.uid() IN (SELECT id FROM admin_users));

CREATE POLICY "Anyone can view seo content" ON seo_content FOR SELECT USING (true);
CREATE POLICY "Admin can manage seo content" ON seo_content FOR ALL USING (auth.uid() IN (SELECT id FROM admin_users));

CREATE POLICY "Anyone can view footer info" ON footer_info FOR SELECT USING (true);
CREATE POLICY "Admin can manage footer info" ON footer_info FOR ALL USING (auth.uid() IN (SELECT id FROM admin_users));

-- RLS Policies for appointments
CREATE POLICY "Users can view their own appointments" ON appointments FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can create appointments" ON appointments FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Admin can view all appointments" ON appointments FOR SELECT USING (auth.uid() IN (SELECT id FROM admin_users));
CREATE POLICY "Admin can manage all appointments" ON appointments FOR ALL USING (auth.uid() IN (SELECT id FROM admin_users));
