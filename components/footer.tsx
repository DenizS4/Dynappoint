"use client"

import { MapPin, Phone, Mail } from "lucide-react"

interface FooterData {
  company_name: string | null
  address: string | null
  phone: string | null
  email: string | null
}

interface FooterProps {
  data: FooterData | null
}

export function Footer({ data }: FooterProps) {
  return (
    <footer className="bg-card border-t border-border">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          <div>
            <h3 className="text-lg font-semibold text-foreground mb-4">
              {data?.company_name || "Professional Services"}
            </h3>
            <p className="text-muted-foreground">
              Providing exceptional services with professional excellence and customer satisfaction.
            </p>
          </div>

          <div>
            <h4 className="text-md font-medium text-foreground mb-4">Contact Information</h4>
            <div className="space-y-3">
              {data?.address && (
                <div className="flex items-start gap-3">
                  <MapPin className="h-5 w-5 text-primary mt-0.5 flex-shrink-0" />
                  <span className="text-muted-foreground">{data.address}</span>
                </div>
              )}
              {data?.phone && (
                <div className="flex items-center gap-3">
                  <Phone className="h-5 w-5 text-primary flex-shrink-0" />
                  <span className="text-muted-foreground">{data.phone}</span>
                </div>
              )}
              {data?.email && (
                <div className="flex items-center gap-3">
                  <Mail className="h-5 w-5 text-primary flex-shrink-0" />
                  <span className="text-muted-foreground">{data.email}</span>
                </div>
              )}
            </div>
          </div>

          <div>
            <h4 className="text-md font-medium text-foreground mb-4">Quick Links</h4>
            <div className="space-y-2">
              <button
                onClick={() => document.getElementById("about")?.scrollIntoView({ behavior: "smooth" })}
                className="block text-muted-foreground hover:text-primary transition-colors"
              >
                About Us
              </button>
              <button
                onClick={() => document.getElementById("appointments")?.scrollIntoView({ behavior: "smooth" })}
                className="block text-muted-foreground hover:text-primary transition-colors"
              >
                Book Appointment
              </button>
              <button
                onClick={() => document.getElementById("faq")?.scrollIntoView({ behavior: "smooth" })}
                className="block text-muted-foreground hover:text-primary transition-colors"
              >
                FAQ
              </button>
            </div>
          </div>
        </div>

        <div className="border-t border-border mt-8 pt-8 text-center">
          <p className="text-muted-foreground">
            © {new Date().getFullYear()} {data?.company_name || "Professional Services"}. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  )
}
