import connectMongoDB from "@/libs/mongodb";
import AssetGroup from "@/models/assetgroup";
import { NextResponse } from "next/server";


export async function GET(request, { params }) {
    const { id } = params;
    await connectMongoDB();
    const assetGroups = await AssetGroup.find({ tenantId: id });
    return NextResponse.json({ assetGroups });
  }