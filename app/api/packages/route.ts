import { NextResponse } from "next/server";
import { getSession } from "@/lib/session";
import { listPackages, createPackage } from "@/lib/repository";

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const opportunityId = searchParams.get("opportunityId");
  if (!opportunityId) return NextResponse.json({ error: "opportunityId required" }, { status: 400 });
  const packages = await listPackages(opportunityId);
  return NextResponse.json(packages);
}

export async function POST(req: Request) {
  const session = await getSession();
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  const body = await req.json();
  if (!body.opportunityId || !body.nameAr || !body.nameEn || typeof body.price !== "number") {
    return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
  }
  try {
    const pkg = await createPackage({
      opportunityId: body.opportunityId,
      nameAr: body.nameAr,
      nameEn: body.nameEn,
      price: body.price,
      quantity: body.quantity,
      entitlements: Array.isArray(body.entitlements) ? body.entitlements : [],
      actorOrgId: session.organizationId
    });
    return NextResponse.json(pkg, { status: 201 });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 403 });
  }
}
