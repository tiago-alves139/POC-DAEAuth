import connectMongoDB from "@/libs/mongodb";
import Tenant from "@/models/tenant";
import AssetGroup from "@/models/assetgroup";
import { NextResponse } from "next/server";
import { updateClientAuthorizationResource } from "../../auth/[...nextauth]/resourceClient";

export async function PUT(request, { params }) {
  const { id } = params;
  const { newTitle: title, newDescription: description } = await request.json();
  await connectMongoDB();
  await Tenant.findByIdAndUpdate(id, { title, description });
  await updateClientAuthorizationResource(id, title, description);
  return NextResponse.json({ message: "Tenant updated" }, { status: 200 });
}

export async function GET(request, { params }) {
  const { id } = params;
  await connectMongoDB();
  const tenant = await Tenant.findOne({ _id: id });
  return NextResponse.json({ tenant }, { status: 200 });
}