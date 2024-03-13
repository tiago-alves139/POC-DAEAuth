import connectMongoDB from "@/libs/mongodb";
import AssetGroup from "@/models/assetgroup";
import { revalidateTag } from "next/cache";
import { NextResponse } from "next/server";

export async function POST(request) {
  const { title, description, tenantId } = await request.json();
  await connectMongoDB();
  await AssetGroup.create({ title, description, tenantId });
  revalidateTag("assetGroupList");
  return NextResponse.json({ message: "AssetGroup Created" }, { status: 201 });
}

export async function GET() {
  await connectMongoDB();
  const assetGroups = await AssetGroup.find();
  return NextResponse.json({ assetGroups });
}

export async function DELETE(request) {
  const id = request.nextUrl.searchParams.get("id");
  await connectMongoDB();
  await AssetGroup.findByIdAndDelete(id);
  return NextResponse.json({ message: "AssetGroup deleted" }, { status: 200 });
}
