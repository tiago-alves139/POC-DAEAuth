import connectMongoDB from "@/libs/mongodb";
import AssetGroup from "@/models/assetgroup";
import { revalidateTag } from "next/cache";
import { NextResponse } from "next/server";
import {createAssetGroupResource, deleteClientAuthorizationResource} from "../auth/[...nextauth]/resourceClient";


export async function POST(request) {
  const { title, description, tenantId } = await request.json();

  await connectMongoDB();
  const assetGroup = await AssetGroup.create({ title, description, tenantId }); //CREATE ON MONGODB
  const id = assetGroup._id.toString(); // Get the _id of the created asset group

  //id, name, displayName, type, uris, roles, scopes, parentId
  await createAssetGroupResource(id, title, description, tenantId); //CREATE RESOURCE ON KEYCLOAK

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
  await AssetGroup.findByIdAndDelete(id); //DELETE ON MONGODB
  await deleteClientAuthorizationResource(id); //DELETE RESOURCE ON KEYCLOAK
  
  return NextResponse.json({ message: "AssetGroup deleted" }, { status: 200 });
}
