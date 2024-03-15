import connectMongoDB from "@/libs/mongodb";
import Device from "@/models/device";
import { revalidateTag } from "next/cache";
import { NextResponse } from "next/server";
import { createDeviceResource, deleteClientAuthorizationResource } from "../auth/[...nextauth]/resourceClient";

export async function POST(request) {
  const { title, description, assetGroupId } = await request.json();
  await connectMongoDB();
  const device = await Device.create({ title, description, assetGroupId: assetGroupId }); //Create on MongoDB
  const id = device._id.toString();

  await createDeviceResource(id, title, description, assetGroupId); //Create resource on Keycloak

  revalidateTag("deviceList");
  return NextResponse.json({ message: "Device Created" }, { status: 201 });
}

export async function GET() {
  await connectMongoDB();
  const devices = await Device.find();
  return NextResponse.json({ devices });
}

export async function DELETE(request) {
  const id = request.nextUrl.searchParams.get("id");
  await connectMongoDB();
  await Device.findByIdAndDelete(id); //DELETE ON MONGODB
  await deleteClientAuthorizationResource(id); //DELETE RESOURCE ON KEYCLOAK
  return NextResponse.json({ message: "Device deleted" }, { status: 200 });
}
