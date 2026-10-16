import { NextResponse } from "next/server";

export const runtime = "nodejs";

export async function POST(request: Request) {
  const apiBase = process.env.DJPRO_API_BASE?.replace(/\/+$/, "");
  const apiKey = process.env.DJPRO_API_KEY;

  if (!apiBase || !apiKey) {
    return NextResponse.json(
      { success: false, message: "Δεν έχει ρυθμιστεί η σύνδεση με το DJ PRO HUB." },
      { status: 500 }
    );
  }

  let body: Record<string, unknown>;

  try {
    body = await request.json();
  } catch {
    return NextResponse.json(
      { success: false, message: "Μη έγκυρα δεδομένα." },
      { status: 400 }
    );
  }

  const requiredFields = [
    "first_name",
    "last_name",
    "phone",
    "email",
    "event_type",
    "event_date",
    "event_time",
    "area",
    "venue",
  ];

  const missing = requiredFields.filter(
    (field) =>
      typeof body[field] !== "string" ||
      !(body[field] as string).trim()
  );

  if (
    missing.length > 0 ||
    typeof body.guest_count !== "number" ||
    !Number.isInteger(body.guest_count) ||
    body.guest_count < 1
  ) {
    return NextResponse.json(
      {
        success: false,
        message: "Συμπληρώστε σωστά όλα τα υποχρεωτικά πεδία.",
        missing,
      },
      { status: 400 }
    );
  }

  try {
    const response = await fetch(
      `${apiBase}/apiCreateBookingRequest`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "x-api-key": apiKey,
        },
        body: JSON.stringify(body),
        cache: "no-store",
      }
    );

    let data: Record<string, unknown>;

    try {
      data = await response.json();
    } catch {
      return NextResponse.json(
        {
          success: false,
          message: "Το DJ PRO HUB επέστρεψε μη έγκυρη απάντηση.",
        },
        { status: 502 }
      );
    }

    if (response.status === 401) {
      return NextResponse.json(
        { success: false, message: "Αποτυχία πιστοποίησης της σύνδεσης." },
        { status: 502 }
      );
    }

    return NextResponse.json(data, {
      status: response.status,
    });
  } catch {
    return NextResponse.json(
      {
        success: false,
        message: "Δεν ήταν δυνατή η επικοινωνία με το DJ PRO HUB.",
      },
      { status: 502 }
    );
  }
}