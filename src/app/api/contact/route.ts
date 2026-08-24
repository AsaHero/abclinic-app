import { NextResponse } from "next/server";
import db from "@/lib/db";

type ContactBody = {
  name?: string;
  email?: string;
  phone?: string;
  service?: string;
  message?: string;
};

const insertLead = db.prepare(`
  INSERT INTO leads (name, phone, email, service, message, source)
  VALUES (@name, @phone, @email, @service, @message, 'contact_form')
`);

export async function POST(request: Request) {
  let body: ContactBody;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ success: false, message: "Некорректный запрос" }, { status: 400 });
  }

  const name = (body.name ?? "").trim();
  const email = (body.email ?? "").trim();
  const phone = (body.phone ?? "").trim();
  const service = (body.service ?? "").trim();
  const message = (body.message ?? "").trim();

  if (!name) {
    return NextResponse.json({ success: false, message: "Имя обязательно" }, { status: 400 });
  }
  if (!email && !phone) {
    return NextResponse.json(
      { success: false, message: "Укажите email или телефон" },
      { status: 400 },
    );
  }

  insertLead.run({
    name,
    email: email || null,
    phone: phone || null,
    service: service || null,
    message: message || null,
  });

  return NextResponse.json({ success: true });
}
