import { NextResponse } from "next/server";
import { z } from "zod";
import { authenticate } from "@/lib/repository";
import { setSession } from "@/lib/session";

const schema = z.object({ email: z.string().email(), password: z.string().min(8) });

export async function POST(request: Request) {
  const parsed = schema.safeParse(await request.json());
  if (!parsed.success) return NextResponse.json({ error: "Invalid credentials payload" }, { status: 400 });
  const user = await authenticate(parsed.data.email, parsed.data.password);
  if (!user) return NextResponse.json({ error: "Invalid email or password" }, { status: 401 });
  await setSession(user);
  return NextResponse.json({ user });
}
