import connectMongoDB from "@/libs/mongodb";
import Device from "@/models/device";
import { v4 as uuidv4 } from 'uuid';
import { revalidateTag } from "next/cache";
import { NextResponse } from "next/server";
import { createDeviceResource, deleteClientAuthorizationResource, getUserPermissionToCreateResource, getUserPermissionToDeleteResource } from "../auth/[...nextauth]/resourceClient";

export async function POST(request) {
  const user_token = request.headers.get('authorization');
  const { title, description, assetGroupId } = await request.json();
  const permission = await getUserPermissionToCreateResource(user_token, assetGroupId, ""); //VERIFICA SE O USER TEM PERMISSAO PARA CRIAR DEVICES no AssetGroup
  if(permission.length === 0){
    return NextResponse.json({ message: "You don't have permission to create devices" }, { status: 401 });
  }
  else {
    await connectMongoDB();
    const device = await Device.create({_id: uuidv4(), title, description, assetGroupId: assetGroupId }); //Create on MongoDB
    const id = device._id.toString();
    await createDeviceResource(id, title, description, assetGroupId); //Create resource on Keycloak
    revalidateTag("deviceList");
    return NextResponse.json({ message: "Device Created" }, { status: 201 });
  }
}

export async function DELETE(request) {
  const user_token = request.headers.get('authorization');
  const id = request.nextUrl.searchParams.get("id");
  const permission = await getUserPermissionToDeleteResource(user_token, id); //VERIFICA SE O USER TEM PERMISSAO PARA ELIMINAR DEVICES
  if(permission.length === 0){
    return NextResponse.json({ message: "You don't have permission to delete devices" }, { status: 401 });
  }
  else {
    await connectMongoDB();
    await Device.findByIdAndDelete(id); //DELETE ON MONGODB
    await deleteClientAuthorizationResource(id); //DELETE RESOURCE ON KEYCLOAK
    return NextResponse.json({ message: "Device deleted" }, { status: 200 });
  }
}
