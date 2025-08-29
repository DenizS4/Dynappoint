import { createClient } from "@/lib/supabase/server"
import { Navigation } from "@/components/navigation"
import { AboutSection } from "@/components/about-section"
import { AppointmentSection } from "@/components/appointment-section"
import { BlogsSection } from "@/components/blogs-section"
import { VideosSection } from "@/components/videos-section"
import { FaqSection } from "@/components/faq-section"
import { SeoSection } from "@/components/seo-section"
import { Footer } from "@/components/footer"

export default async function HomePage() {
  const supabase = await createClient()

  // Fetch all content data
  const [aboutData, scheduleData, blogsData, videosData, faqsData, seoData, footerData] = await Promise.all([
    supabase.from("about_section").select("*").single(),
    supabase.from("work_schedule").select("*").order("day_of_week"),
    supabase.from("blogs").select("*").order("created_at", { ascending: false }),
    supabase.from("videos").select("*").order("created_at", { ascending: false }),
    supabase.from("faqs").select("*").order("order_index"),
    supabase.from("seo_content").select("*").single(),
    supabase.from("footer_info").select("*").single(),
  ])

  return (
    <div className="min-h-screen bg-background">
      <Navigation />
      <main>
        <AboutSection data={aboutData.data} />
        <AppointmentSection scheduleData={scheduleData.data} />
        <BlogsSection data={blogsData.data || []} />
        <VideosSection data={videosData.data || []} />
        <FaqSection data={faqsData.data || []} />
        <SeoSection data={seoData.data} />
      </main>
      <Footer data={footerData.data} />
    </div>
  )
}
