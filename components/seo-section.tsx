interface SeoData {
  content: string
}

interface SeoSectionProps {
  data: SeoData | null
}

export function SeoSection({ data }: SeoSectionProps) {
  if (!data) return null

  return (
    <section className="py-16 bg-muted/30">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="prose prose-lg max-w-none text-muted-foreground">
          <p className="leading-relaxed">{data.content}</p>
        </div>
      </div>
    </section>
  )
}
