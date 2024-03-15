import connectMongoDB from "@/libs/mongodb";
import Tenant from "@/models/tenant";
import { revalidateTag } from "next/cache";
import { NextResponse } from "next/server";
import {createTenantResource, deleteClientAuthorizationResource} from "../auth/[...nextauth]/resourceClient";

export async function POST(request) {
  const { title, description } = await request.json();
  await connectMongoDB();
  const tenant = await Tenant.create({ title, description }); //CREATE ON MONGODB
  const id = tenant._id.toString();

  await createTenantResource(id, title, description); //CREATE RESOURCE ON KEYCLOAK

  revalidateTag("tenantList");
  return NextResponse.json({ message: "Tenant Created" }, { status: 201 });
}

export async function GET() {
  await connectMongoDB();
  const tenants = await Tenant.find();
  return NextResponse.json({ tenants });
}

export async function DELETE(request) {
  const id = request.nextUrl.searchParams.get("id");
  await connectMongoDB();
  await Tenant.findByIdAndDelete(id); //DELETE ON MONGODB
  await deleteClientAuthorizationResource(id); //DELETE RESOURCE ON KEYCLOAK
  return NextResponse.json({ message: "Tenant deleted" }, { status: 200 });
}
