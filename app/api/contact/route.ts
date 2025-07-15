import { Resend } from 'resend'
import { NextResponse } from 'next/server'

const resend = new Resend(process.env.RESEND_API_KEY)

export async function POST(req: Request) {
  const body = await req.json()
  const { name, email, company, subject, message } = body

  try {
    const data = await resend.emails.send({
      from: 'contact@whichllms.com', 
      to: ['thomas.bodenan@gmail.com'], 
      subject: `New contact form submission: ${subject}`,
      replyTo: email,
      text: `
        Name: ${name}
        Email: ${email}
        Company: ${company}
        Subject: ${subject}
        Message:
        ${message}
      `,
    })

    return NextResponse.json({ success: true, data })
  } catch (error) {
    return NextResponse.json({ success: false, error })
  }
}
