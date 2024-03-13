import connectMongoDB from "@/libs/mongodb";
import Tenant from "@/models/tenant";
import { revalidateTag } from "next/cache";
import { NextResponse } from "next/server";

export async function POST(request) {
  const { title, description } = await request.json();
  await connectMongoDB();
  await Tenant.create({ title, description });
  revalidateTag("tenantList");
  return NextResponse.json({ message: "Tenant Created" }, { status: 201 });
}

export async function GET() {
  await connectMongoDB();
  const tenants = await Tenant.find();
  console.log("api tenants get" + tenants);
  return NextResponse.json({ tenants });
}

export async function DELETE(request) {
  const id = request.nextUrl.searchParams.get("id");
  await connectMongoDB();
  await Tenant.findByIdAndDelete(id);
  return NextResponse.json({ message: "Tenant deleted" }, { status: 200 });
}
