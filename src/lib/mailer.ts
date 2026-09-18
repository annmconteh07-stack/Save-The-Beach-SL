import nodemailer from "nodemailer";

function isSmtpConfigured() {
  return Boolean(process.env.SMTP_HOST && process.env.SMTP_USER && process.env.SMTP_PASS);
}

function getTransport() {
  return nodemailer.createTransport({
    host: process.env.SMTP_HOST,
    port: Number(process.env.SMTP_PORT ?? 587),
    secure: process.env.SMTP_SECURE === "true",
    auth: {
      user: process.env.SMTP_USER,
      pass: process.env.SMTP_PASS,
    },
  });
}

export async function sendVerificationEmail({
  to,
  name,
  code,
}: {
  to: string;
  name: string;
  code: string;
}) {
  const from = process.env.SMTP_FROM ?? "Save The Beach SL <no-reply@savethebeach.sl>";

  const subject = "Your Save The Beach SL verification code";
  const text = `Hello ${name},\n\nWelcome to Save The Beach SL. Your verification code is:\n\n${code}\n\nEnter this code on the website to confirm your email address. It expires in 48 hours.\n\nIf you did not create this account, you can ignore this email.`;
  const html = `
    <div style="font-family: Arial, sans-serif; max-width: 560px; margin: 0 auto; color: #062b59;">
      <h2 style="color: #095caa;">Welcome to Save The Beach SL, ${name}.</h2>
      <p>Please confirm your email address so we know it is really you.</p>
      <p style="margin: 28px 0;">
        <span style="display: inline-block; letter-spacing: 8px; font-size: 36px; font-weight: bold; color: #095caa; background: #eaf2fb; padding: 16px 24px; border-radius: 10px;">${code}</span>
      </p>
      <p style="color: #4d6478; font-size: 14px;">Enter this code on the website to confirm your email. It expires in 48 hours.</p>
      <p style="color: #4d6478; font-size: 13px;">If you did not create this account, you can safely ignore this email.</p>
    </div>
  `;

  if (!isSmtpConfigured()) {
    console.log("\n==============================================");
    console.log("EMAIL VERIFICATION (SMTP not configured)");
    console.log(`To: ${to}`);
    console.log(`Subject: ${subject}`);
    console.log(`Verification code: ${code}`);
    console.log("==============================================\n");
    return { delivered: false, code };
  }

  await getTransport().sendMail({ from, to, subject, text, html });
  return { delivered: true, code };
}