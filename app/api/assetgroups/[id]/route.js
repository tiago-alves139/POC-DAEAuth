import connectMongoDB from "@/libs/mongodb";
import AssetGroup from "@/models/assetgroup";
import Device from "@/models/device";
import { NextResponse } from "next/server";
import { updateClientAuthorizationResource, getUserPermissionToUpdateResource, getUserPermissionToReadResource, getUserPermissionToCreateResource } from "../../auth/[...nextauth]/resourceClient";

export async function PUT(request, { params }) {
  const user_token = request.headers.get('authorization');
  const { id } = params;
  const permission = await getUserPermissionToUpdateResource(user_token, id); //VERIFICA SE O USER TEM PERMISSAO PARA UPDATE ASSET GROUP
  if(permission.length === 0){
    return NextResponse.json({ message: "You don't have permission to update asset groups" }, { status: 401 });
  }
  else {
    const { newTitle: title, newDescription: description } = await request.json();
    await connectMongoDB();
    await AssetGroup.findByIdAndUpdate(id, { title, description });
    await updateClientAuthorizationResource(id, title, description);
    return NextResponse.json({ message: "AssetGroup updated" }, { status: 200 });
  }
}

export async function GET(request, { params }) {
  const user_token = request.headers.get('authorization');
  const { id } = params;
  const permission = await getUserPermissionToReadResource(user_token, id); //VERIFICA SE O USER TEM PERMISSAO PARA LER ASSET GROUP
  if(permission.length === 0){
    return NextResponse.json({ message: "You don't have permission to read asset groups" }, { status: 401 });
  }
  else {
    await connectMongoDB();
    const assetGroup = await AssetGroup.findOne({ _id: id });
    const permissionToUpdate = await getUserPermissionToUpdateResource(user_token, id); //VERIFICA SE O USER TEM PERMISSAO PARA UPDATE TENANT
    const permissionToCreateDevices = await getUserPermissionToCreateResource(user_token, id, ""); //VERIFICA SE O USER TEM PERMISSAO PARA CRIAR ASSET GROUPS DENTRO DO TENANT
    const permission = { permission: `${id}#listUsers`, permission_resource_format: "", response_mode: "" };
    const res = await getUserPermission(user_token, permission);

    let result = {
      assetGroup: assetGroup,
      permissionUpdate: permissionToUpdate.length > 0 ? true : false,
      permissionCreateDevices: permissionToCreateDevices.length > 0 ? true : false,
      permissionListUsers: res
    }

    return NextResponse.json({ result }, { status: 200 });
  }
}
