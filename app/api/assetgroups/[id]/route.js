import connectMongoDB from "@/libs/mongodb";
import AssetGroup from "@/models/assetgroup";
import Device from "@/models/device";
import { NextResponse } from "next/server";

export async function PUT(request, { params }) {
  const { id } = params;
  const { newTitle: title, newDescription: description } = await request.json();
  await connectMongoDB();
  await AssetGroup.findByIdAndUpdate(id, { title, description });
  return NextResponse.json({ message: "AssetGroup updated" }, { status: 200 });
}

export async function GET(request, { params }) {
  const { id } = params;
  await connectMongoDB();
  const assetGroup = await AssetGroup.findOne({ _id: id });
  return NextResponse.json({ assetGroup }, { status: 200 });
}

export async function GET_Devices(request, { params }) {
  const { id } = params;
  await connectMongoDB();
  const devices = await Device.find({ assetGroupId: id });
  return NextResponse.json({ assetGroups: devices });
}