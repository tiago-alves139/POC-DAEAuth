import connectMongoDB from "@/libs/mongodb";
import Device from "@/models/device";
import { NextResponse } from "next/server";
import { updateClientAuthorizationResource, getUserPermissionToUpdateResource, getUserPermissionToReadResource } from "../../auth/[...nextauth]/resourceClient";

export async function PUT(request, { params }) {
  const user_token = request.headers.get('authorization');
  const { id } = params;
  const permission = await getUserPermissionToUpdateResource(user_token, id); //VERIFICA SE O USER TEM PERMISSAO PARA UPDATE DEVICE
  if(permission.length === 0){
    return NextResponse.json({ message: "You don't have permission to update devices" }, { status: 401 });
  }
  else {
    const { newTitle: title, newDescription: description } = await request.json();
    await connectMongoDB();
    await Device.findByIdAndUpdate(id, { title, description });
    await updateClientAuthorizationResource(id, title, description);
    return NextResponse.json({ message: "Device updated" }, { status: 200 });
  }
}

export async function GET(request, { params }) {
  const user_token = request.headers.get('authorization');
  const { id } = params;
  const permission = await getUserPermissionToReadResource(user_token, id); //VERIFICA SE O USER TEM PERMISSAO PARA LER DEVICE
  if(permission.length === 0){
    return NextResponse.json({ message: "You don't have permission to read devices" }, { status: 401 });
  }
  else {
    await connectMongoDB();
    const device = await Device.findOne({ _id: id });
    const permissionToUpdate = await getUserPermissionToUpdateResource(user_token, id); //VERIFICA SE O USER TEM PERMISSAO PARA UPDATE TENANT

    let result = {
      device: device,
      permissionUpdate: permissionToUpdate.length > 0 ? true : false
    }

    return NextResponse.json({ result }, { status: 200 });
  }
}
