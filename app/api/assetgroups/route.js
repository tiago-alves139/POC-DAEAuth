import connectMongoDB from "@/libs/mongodb";
import { v4 as uuidv4 } from 'uuid';
import AssetGroup from "@/models/assetgroup";
import { revalidateTag } from "next/cache";
import { NextResponse } from "next/server";
import {createAssetGroupResource, deleteClientAuthorizationResource} from "../auth/[...nextauth]/resourceClient";
import { getUserPermissionToCreateResource, getUserResourcesByType, getUserPermissionToDeleteResource } from "../auth/[...nextauth]/resourceClient";


export async function POST(request) {
  const user_token = request.headers.get('authorization');
  const { title, description, tenantId } = await request.json();
  const permission = await getUserPermissionToCreateResource(user_token, tenantId, ""); //VERIFICA SE O USER TEM PERMISSAO PARA CRIAR ASSET GROUPS DENTRO DO TENANT
  if(permission.length === 0){
    return NextResponse.json({ message: "You don't have permission to create tenants" }, { status: 401 });
  }
  else {
    await connectMongoDB();
    const assetGroup = await AssetGroup.create({_id: uuidv4(), title, description, tenantId }); //CREATE ON MONGODB
    const id = assetGroup._id.toString(); // Get the _id of the created asset group
    //id, name, displayName, type, uris, roles, scopes, parentId
    await createAssetGroupResource(id, title, description, tenantId); //CREATE RESOURCE ON KEYCLOAK
    revalidateTag("assetGroupList");
    return NextResponse.json({ message: "AssetGroup Created" }, { status: 201 });
  }
}

export async function DELETE(request) {
  const user_token = request.headers.get('authorization');
  const id = request.nextUrl.searchParams.get("id");
  const permission = await getUserPermissionToDeleteResource(user_token, id); //VERIFICA SE O USER TEM PERMISSAO PARA ELIMINAR ASSET GROUPS
  if(permission.length === 0){
    return NextResponse.json({ message: "You don't have permission to delete asset groups" }, { status: 401 });
  }
  else {
    await connectMongoDB();
    await AssetGroup.findByIdAndDelete(id); //DELETE ON MONGODB
    await deleteClientAuthorizationResource(id); //DELETE RESOURCE ON KEYCLOAK
    return NextResponse.json({ message: "AssetGroup deleted" }, { status: 200 });
  }
}

export async function GET(request) {
  const user_token = request.headers.get('authorization');
  const res = await getUserResourcesByType(user_token, "assetgroups");
  let assetgroupsIds = [];
  if(res.length === 0){
    return NextResponse.json({ assetGroups: assetgroupsIds });
  }
  else {
    assetgroupsIds = res.map(assetgroup => assetgroup.rsid);
    await connectMongoDB();
    const assetGroupsMongo = await AssetGroup.find({
      _id: { $in: assetgroupsIds }
    });

    return NextResponse.json({ assetGroups: assetGroupsMongo });
  }
}
