import { Card, CardContent } from "@/components/ui/card"
import Image from "next/image"

interface AboutData {
  title: string
  description: string
  image_url: string | null
}

interface AboutSectionProps {
  data: AboutData | null
}

export function AboutSection({ data }: AboutSectionProps) {
  if (!data) return null

  return (
    <section id="about" className="py-16 bg-background">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          <div className="space-y-6">
            <h2 className="text-3xl font-bold text-foreground sm:text-4xl">{data.title}</h2>
            <p className="text-lg text-muted-foreground leading-relaxed">{data.description}</p>
          </div>
          <div className="relative">
            <Card className="overflow-hidden">
              <CardContent className="p-0">
                <Image
                  src={data.image_url || "/placeholder.svg?height=400&width=600"}
                  alt="About us"
                  width={600}
                  height={400}
                  className="w-full h-auto object-cover"
                />
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </section>
  )
}
