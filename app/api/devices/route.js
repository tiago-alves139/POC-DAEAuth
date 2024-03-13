import connectMongoDB from "@/libs/mongodb";
import Device from "@/models/device";
import { revalidateTag } from "next/cache";
import { NextResponse } from "next/server";

export async function POST(request) {
  const { title, description, assetGroupId } = await request.json();
  await connectMongoDB();
  await Device.create({ title, description, assetGroupId: assetGroupId });
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
  await Device.findByIdAndDelete(id);
  return NextResponse.json({ message: "Device deleted" }, { status: 200 });
}
