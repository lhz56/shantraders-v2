import { NextResponse } from "next/server";
import nodemailer from "nodemailer";

function createTransporter() {
  const host = process.env.EMAIL_HOST;
  const port = Number(process.env.EMAIL_PORT || 587);
  const user = process.env.EMAIL_USER;
  const pass = process.env.EMAIL_PASSWORD;

  if (!host || !user || !pass) {
    throw new Error(
      "Email transport is not configured. Set EMAIL_HOST, EMAIL_PORT, EMAIL_USER, and EMAIL_PASSWORD environment variables."
    );
  }

  return nodemailer.createTransport({
    host,
    port,
    secure: port === 465,
    auth: {
      user,
      pass,
    },
  });
}

export async function POST(request) {
  try {
    const { email, company, items } = await request.json();

    if (!email || !company || !Array.isArray(items) || items.length === 0) {
      return NextResponse.json(
        { error: "Invalid payload" },
        { status: 400 }
      );
    }

    const formattedItems = items
      .map((item, index) => {
        const quantity = item.quantity ?? 1;
        const name = item.name ?? `Product ${index + 1}`;
        return `${index + 1}. ${name} — Qty: ${quantity}`;
      })
      .join("\n");

    const transporter = createTransporter();

    await transporter.sendMail({
      from: process.env.EMAIL_FROM || process.env.EMAIL_USER,
      to: "shantradersinc@gmail.com",
      replyTo: email,
      subject: `Quote Request from ${company}`,
      text: [
        `A new quote request was submitted through the cart.`,
        "",
        `Company: ${company}`,
        `Customer Email: ${email}`,
        "",
        "Requested Products:",
        formattedItems,
      ].join("\n"),
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("[quote.api]", error);
    return NextResponse.json(
      { error: "Failed to send quote request." },
      { status: 500 }
    );
  }
}
