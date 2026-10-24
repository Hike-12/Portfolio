import { NextResponse } from 'next/server';
import nodemailer from 'nodemailer';

// In-memory rate limiting map (IP -> { count, firstRequest, lastRequest })
const rateLimitMap = new Map();
const RATE_LIMIT_WINDOW_MS = 10 * 60 * 1000; // 10 minutes
const MAX_REQUESTS_PER_WINDOW = 5;
const MIN_INTERVAL_MS = 3000; // 3-second cooldown between consecutive submissions

function checkRateLimit(ip) {
  const now = Date.now();
  const record = rateLimitMap.get(ip);

  // Periodic cleanup if map grows
  if (rateLimitMap.size > 1000) {
    for (const [key, val] of rateLimitMap.entries()) {
      if (now - val.lastRequest > RATE_LIMIT_WINDOW_MS) {
        rateLimitMap.delete(key);
      }
    }
  }

  if (!record) {
    rateLimitMap.set(ip, { count: 1, firstRequest: now, lastRequest: now });
    return { allowed: true };
  }

  // Enforce cooldown between back-to-back requests
  if (now - record.lastRequest < MIN_INTERVAL_MS) {
    return {
      allowed: false,
      error: 'Please wait a few seconds before sending another message.',
    };
  }

  // Reset window after expiry
  if (now - record.firstRequest > RATE_LIMIT_WINDOW_MS) {
    rateLimitMap.set(ip, { count: 1, firstRequest: now, lastRequest: now });
    return { allowed: true };
  }

  // Check max submissions in window
  if (record.count >= MAX_REQUESTS_PER_WINDOW) {
    const minutesLeft = Math.ceil((RATE_LIMIT_WINDOW_MS - (now - record.firstRequest)) / 60000);
    return {
      allowed: false,
      error: `Too many messages sent. Please try again in ${minutesLeft} minute(s).`,
    };
  }

  record.count += 1;
  record.lastRequest = now;
  return { allowed: true };
}

function escapeHtml(str) {
  return String(str)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#039;');
}

export async function POST(request) {
  try {
    // 1. IP Rate Limiting
    const forwarded = request.headers.get('x-forwarded-for');
    const ip = forwarded ? forwarded.split(',')[0].trim() : (request.headers.get('x-real-ip') || 'unknown-ip');

    const rateLimit = checkRateLimit(ip);
    if (!rateLimit.allowed) {
      return NextResponse.json({ error: rateLimit.error }, { status: 429 });
    }

    // 2. Parse request body
    const body = await request.json().catch(() => null);
    if (!body || typeof body !== 'object') {
      return NextResponse.json({ error: 'Invalid request body' }, { status: 400 });
    }

    const { name, email, message, website, botField } = body;

    // 3. Honeypot check: silently drop automated bot spam
    if (website || botField) {
      return NextResponse.json({ success: true }, { status: 200 });
    }

    // 4. Input validation
    if (!name || typeof name !== 'string' || name.trim().length === 0) {
      return NextResponse.json({ error: 'Name is required' }, { status: 400 });
    }
    const cleanName = name.trim();
    if (cleanName.length > 100) {
      return NextResponse.json({ error: 'Name must be 100 characters or less' }, { status: 400 });
    }

    if (!email || typeof email !== 'string') {
      return NextResponse.json({ error: 'Email is required' }, { status: 400 });
    }
    const cleanEmail = email.trim();
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (cleanEmail.length > 254 || !emailRegex.test(cleanEmail)) {
      return NextResponse.json({ error: 'Please enter a valid email address' }, { status: 400 });
    }

    if (!message || typeof message !== 'string' || message.trim().length === 0) {
      return NextResponse.json({ error: 'Message is required' }, { status: 400 });
    }
    const cleanMessage = message.trim();
    if (cleanMessage.length < 5) {
      return NextResponse.json({ error: 'Message is too short (minimum 5 characters)' }, { status: 400 });
    }
    if (cleanMessage.length > 5000) {
      return NextResponse.json({ error: 'Message must be 5000 characters or less' }, { status: 400 });
    }

    // 5. Sanitized HTML rendering
    const safeName = escapeHtml(cleanName);
    const safeEmail = escapeHtml(cleanEmail);
    const safeMessage = escapeHtml(cleanMessage).replace(/\n/g, '<br/>');

    // 6. Nodemailer transporter
    const transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
      },
    });

    const mailOptions = {
      from: process.env.EMAIL_USER,
      to: 'aliqyaan12@gmail.com',
      replyTo: cleanEmail,
      subject: `Portfolio Contact Form: Message from ${cleanName}`,
      text: `
Name: ${cleanName}
Email: ${cleanEmail}

Message:
${cleanMessage}
      `,
      html: `
        <div style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; line-height: 1.6; color: #1e293b; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #e2e8f0; border-radius: 12px;">
          <h2 style="color: #0f172a; margin-top: 0; font-size: 20px; border-bottom: 2px solid #6366f1; padding-bottom: 10px;">New Portfolio Message</h2>
          <p style="margin: 8px 0;"><strong>Name:</strong> ${safeName}</p>
          <p style="margin: 8px 0;"><strong>Email:</strong> <a href="mailto:${safeEmail}" style="color: #6366f1;">${safeEmail}</a></p>
          <hr style="border: none; border-top: 1px solid #e2e8f0; margin: 16px 0;" />
          <p style="margin: 8px 0; font-weight: 600;">Message:</p>
          <div style="background-color: #f8fafc; padding: 14px 18px; border-radius: 8px; border-left: 4px solid #6366f1; font-size: 15px; color: #334155;">
            ${safeMessage}
          </div>
        </div>
      `,
    };

    await transporter.sendMail(mailOptions);

    return NextResponse.json({ success: true }, { status: 200 });
  } catch (error) {
    console.error('Contact form error:', error);
    return NextResponse.json(
      { error: 'Failed to send message. Please try again or use the email link directly.' },
      { status: 500 }
    );
  }
}
