import connectMongoDB from "@/libs/mongodb";
import Tenant from "@/models/tenant";
import AssetGroup from "@/models/assetgroup";
import { NextResponse } from "next/server";
import { updateClientAuthorizationResource } from "../../auth/[...nextauth]/resourceClient";
import { getUserPermissionToUpdateResource, getUserPermissionToReadResource, getUserPermissionToCreateResource } from "../../auth/[...nextauth]/resourceClient";

export async function PUT(request, { params }) {
  const user_token = request.headers.get('authorization');
  const { id } = params;
  const permission = await getUserPermissionToUpdateResource(user_token, id); //VERIFICA SE O USER TEM PERMISSAO PARA UPDATE TENANT
  if(permission.length === 0){
    return NextResponse.json({ message: "You don't have permission to update tenants" }, { status: 401 });
  }
  else {
    const { newTitle: title, newDescription: description } = await request.json();
    await connectMongoDB();
    await Tenant.findByIdAndUpdate(id, { title, description });
    await updateClientAuthorizationResource(id, title, description);
    return NextResponse.json({ message: "Tenant updated" }, { status: 200 });
  }
}

export async function GET(request, { params }) {
  const user_token = request.headers.get('authorization');
  const { id } = params;
  const permission = await getUserPermissionToReadResource(user_token, id); //VERIFICA SE O USER TEM PERMISSAO PARA LER TENANT
  if(permission.length === 0){
    return NextResponse.json({ message: "You don't have permission to read tenants" }, { status: 401 });
  }
  else {
    await connectMongoDB();
    const tenant = await Tenant.findOne({ _id: id });
    const permissionToUpdate = await getUserPermissionToUpdateResource(user_token, id); //VERIFICA SE O USER TEM PERMISSAO PARA UPDATE TENANT
    const permissionToCreateAssetGroups = await getUserPermissionToCreateResource(user_token, id, ""); //VERIFICA SE O USER TEM PERMISSAO PARA CRIAR ASSET GROUPS DENTRO DO TENANT

    let result = {
      tenant: tenant,
      permissionUpdate: permissionToUpdate.length > 0 ? true : false,
      permissioCreateAssetGroups: permissionToCreateAssetGroups.length > 0 ? true : false
    }
    return NextResponse.json({ result }, { status: 200 });
  }
}