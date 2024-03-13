import connectMongoDB from "@/libs/mongodb";
import Device from "@/models/device";
import { NextResponse } from "next/server";


export async function GET(request, { params }) {
    const { id } = params;
    await connectMongoDB();
    const devices = await Device.find({ assetGroupId: id });
    return NextResponse.json({ devices });
  }