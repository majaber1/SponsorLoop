import { NextResponse } from "next/server";
import { z } from "zod";
import { register } from "@/lib/repository";
import { setSession } from "@/lib/session";

const schema = z.object({
  email: z.string().email(),
  password: z.string().min(8),
  name: z.string().min(2),
  organizationName: z.string().min(2),
  role: z.enum(["advertiser", "owner", "agency"])
});

export async function POST(request: Request) {
  const parsed = schema.safeParse(await request.json());
  if (!parsed.success) return NextResponse.json({ error: "Invalid registration payload", details: parsed.error.flatten() }, { status: 400 });
  try {
    const user = await register(parsed.data);
    await setSession(user);
    return NextResponse.json({ user }, { status: 201 });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Registration failed";
    return NextResponse.json({ error: message }, { status: 409 });
  }
}
