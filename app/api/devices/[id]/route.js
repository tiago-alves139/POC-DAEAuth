import connectMongoDB from "@/libs/mongodb";
import Device from "@/models/device";
import { NextResponse } from "next/server";

export async function PUT(request, { params }) {
  const { id } = params;
  const { newTitle: title, newDescription: description } = await request.json();
  await connectMongoDB();
  await Device.findByIdAndUpdate(id, { title, description });
  return NextResponse.json({ message: "Device updated" }, { status: 200 });
}

export async function GET(request, { params }) {
  const { id } = params;
  await connectMongoDB();
  const device = await Device.findOne({ _id: id });
  return NextResponse.json({ device }, { status: 200 });
}
