-- Insert sample about section data
INSERT INTO about_section (title, description, image_url) VALUES (
  'About Our Services',
  'We are a professional service provider dedicated to delivering exceptional experiences. Our team of experts is committed to meeting your needs with personalized attention and quality service. With years of experience in the industry, we understand what it takes to exceed expectations.',
  '/placeholder.svg?height=400&width=600'
);

-- Insert work schedule (Monday to Saturday, closed Sunday)
INSERT INTO work_schedule (day_of_week, is_working, start_time, end_time) VALUES
(0, false, null, null), -- Sunday - closed
(1, true, '09:00', '17:00'), -- Monday
(2, true, '09:00', '17:00'), -- Tuesday
(3, true, '09:00', '17:00'), -- Wednesday
(4, true, '09:00', '17:00'), -- Thursday
(5, true, '09:00', '17:00'), -- Friday
(6, true, '09:00', '13:00'); -- Saturday - half day

-- Insert sample blogs
INSERT INTO blogs (title, description, image_url, external_url) VALUES
('10 Tips for Better Productivity', 'Discover proven strategies to boost your productivity and achieve more in less time. Learn from industry experts and implement these actionable tips today.', '/placeholder.svg?height=300&width=400', 'https://medium.com/@example/productivity-tips'),
('The Future of Digital Services', 'Explore how digital transformation is reshaping the service industry and what it means for businesses and customers alike.', '/placeholder.svg?height=300&width=400', 'https://medium.com/@example/digital-future');

-- Insert sample videos
INSERT INTO videos (title, description, thumbnail_url, external_url) VALUES
('Getting Started Guide', 'A comprehensive walkthrough of our services and how to get the most out of your experience with us.', '/placeholder.svg?height=200&width=350', 'https://youtube.com/watch?v=example1'),
('Customer Success Stories', 'Hear from our satisfied customers about their journey and the results they achieved with our services.', '/placeholder.svg?height=200&width=350', 'https://youtube.com/watch?v=example2');

-- Insert sample FAQs
INSERT INTO faqs (question, answer, order_index) VALUES
('How do I book an appointment?', 'You can easily book an appointment through our online booking system. Simply select your preferred date and time, fill in your details, and submit the form. You will receive a confirmation email shortly after.', 1),
('What is your cancellation policy?', 'We understand that plans can change. You can cancel or reschedule your appointment up to 24 hours before the scheduled time without any charges. For cancellations within 24 hours, a small fee may apply.', 2),
('Do you offer emergency services?', 'Yes, we provide emergency services for urgent situations. Please contact us directly via phone for immediate assistance. Emergency services may have different pricing and availability.', 3),
('What payment methods do you accept?', 'We accept all major credit cards, debit cards, and digital payment methods including PayPal and Apple Pay. Payment is typically processed after the service is completed.', 4);

-- Insert sample SEO content
INSERT INTO seo_content (content) VALUES (
'Welcome to our professional service platform where quality meets excellence. We specialize in providing top-tier services tailored to meet your unique needs. Our experienced team is dedicated to delivering outstanding results that exceed expectations. Whether you are looking for consultation, implementation, or ongoing support, we have the expertise and resources to help you succeed. Our commitment to customer satisfaction is unwavering, and we pride ourselves on building long-lasting relationships with our clients. Contact us today to discover how we can help you achieve your goals and take your business to the next level. We serve clients across various industries and have a proven track record of success. Our innovative approach and attention to detail set us apart from the competition.'
);

-- Insert sample footer info
INSERT INTO footer_info (company_name, address, phone, email) VALUES (
'Professional Services Co.',
'123 Business Street, Suite 100, City, State 12345',
'(555) 123-4567',
'contact@professionalservices.com'
);
