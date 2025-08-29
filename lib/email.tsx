import nodemailer from "nodemailer"


// Create transporter for sending emails
const createTransporter = () => {
  return nodemailer.createTransport({
    host: process.env.SMTP_HOST || "smtp.gmail.com",
    port: Number.parseInt(process.env.SMTP_PORT || "587"),
    secure: false, // true for 465, false for other ports
    auth: {
      user: process.env.SMTP_USER,
      pass: process.env.SMTP_PASS,
    },
  })
}


// Email templates
const getAdminNotificationTemplate = (appointment: any, adminPanelUrl: string) => {
  return {
    subject: `New Appointment Request - ${appointment.name}`,
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <h2 style="color: #059669;">New Appointment Request</h2>
        
        <div style="background: #f9fafb; padding: 20px; border-radius: 8px; margin: 20px 0;">
          <h3>Customer Details:</h3>
          <p><strong>Name:</strong> ${appointment.name}</p>
          <p><strong>Email:</strong> ${appointment.email}</p>
          <p><strong>Phone:</strong> ${appointment.phone}</p>
          <p><strong>Date:</strong> ${new Date(appointment.appointment_date).toLocaleDateString()}</p>
          <p><strong>Time:</strong> ${appointment.appointment_time}</p>
          <p><strong>Message:</strong> ${appointment.message || "No message provided"}</p>
        </div>
        
        <div style="text-align: center; margin: 30px 0;">
          <a href="${adminPanelUrl}/admin/appointments" 
             style="background: #059669; color: white; padding: 12px 24px; text-decoration: none; border-radius: 6px; display: inline-block; margin: 0 10px;">
            View in Admin Panel
          </a>
        </div>
        
        <p style="color: #6b7280; font-size: 14px;">
          Please review and respond to this appointment request as soon as possible.
        </p>
      </div>
    `,
  }
}

const getCustomerConfirmationTemplate = (appointment: any) => {
  return {
    subject: "Appointment Request Received",
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <h2 style="color: #059669;">Appointment Request Received</h2>
        
        <p>Dear ${appointment.name},</p>
        
        <p>Thank you for your appointment request. We have received your booking and will review it shortly.</p>
        
        <div style="background: #f9fafb; padding: 20px; border-radius: 8px; margin: 20px 0;">
          <h3>Your Appointment Details:</h3>
          <p><strong>Date:</strong> ${new Date(appointment.appointment_date).toLocaleDateString()}</p>
          <p><strong>Time:</strong> ${appointment.appointment_time}</p>
          <p><strong>Message:</strong> ${appointment.message || "No message provided"}</p>
        </div>
        
        <p>You will receive another email once your appointment is confirmed or if we need to make any changes.</p>
        
        <p style="color: #6b7280; font-size: 14px;">
          If you have any questions, please don't hesitate to contact us.
        </p>
      </div>
    `,
  }
}

const getCustomerStatusUpdateTemplate = (appointment: any, status: string) => {
  const isApproved = status === "confirmed" || status === "approved"
  const statusText = isApproved ? "Approved" : "Denied"
  const statusColor = isApproved ? "#059669" : "#dc2626"

  return {
    subject: `Appointment ${statusText} - ${new Date(appointment.appointment_date).toLocaleDateString()}`,
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <h2 style="color: ${statusColor};">Appointment ${statusText}</h2>
        
        <p>Dear ${appointment.name},</p>
        
        <p>Your appointment request has been <strong style="color: ${statusColor};">${statusText.toLowerCase()}</strong>.</p>
        
        <div style="background: #f9fafb; padding: 20px; border-radius: 8px; margin: 20px 0;">
          <h3>Appointment Details:</h3>
          <p><strong>Date:</strong> ${new Date(appointment.appointment_date).toLocaleDateString()}</p>
          <p><strong>Time:</strong> ${appointment.appointment_time}</p>
          <p><strong>Status:</strong> <span style="color: ${statusColor};">${statusText}</span></p>
        </div>
        
        ${
          isApproved
            ? "<p>We look forward to seeing you at your scheduled appointment time.</p>"
            : "<p>We apologize for any inconvenience. Please feel free to request another appointment time.</p>"
        }
        
        <p style="color: #6b7280; font-size: 14px;">
          If you have any questions, please don't hesitate to contact us.
        </p>
      </div>
    `,
  }
}

// Email sending functions
export const sendAdminNotification = async (appointment: any, adminEmail: string) => {
  try {
    const transporter = createTransporter()
    const adminPanelUrl = process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000"
    const template = getAdminNotificationTemplate(appointment, adminPanelUrl)

    await transporter.sendMail({
      from: process.env.SMTP_FROM || process.env.SMTP_USER,
      to: adminEmail,
      subject: template.subject,
      html: template.html,
    })

  } catch (error) {
    throw error
  }
}

export const sendCustomerConfirmation = async (appointment: any) => {
  try {
    const transporter = createTransporter()
    const template = getCustomerConfirmationTemplate(appointment)

    await transporter.sendMail({
      from: process.env.SMTP_FROM || process.env.SMTP_USER,
      to: appointment.email,
      subject: template.subject,
      html: template.html,
    })

    console.log("Customer confirmation email sent successfully")
  } catch (error) {
    console.error("Error sending customer confirmation email:", error)
    throw error
  }
}

export const sendCustomerStatusUpdate = async (appointment: any, status: string) => {
  try {
    const transporter = createTransporter()
    const template = getCustomerStatusUpdateTemplate(appointment, status)

    await transporter.sendMail({
      from: process.env.SMTP_FROM || process.env.SMTP_USER,
      to: appointment.email,
      subject: template.subject,
      html: template.html,
    })

    console.log("Customer status update email sent successfully")
  } catch (error) {
    console.error("Error sending customer status update email:", error)
    throw error
  }
}
