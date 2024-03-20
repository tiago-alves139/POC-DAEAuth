import connectMongoDB from "@/libs/mongodb";
import { v4 as uuidv4 } from 'uuid';
import mongoose from "mongoose";
import Tenant from "@/models/tenant";
import { revalidateTag } from "next/cache";
import { NextResponse } from "next/server";
import {createTenantResource, deleteClientAuthorizationResource, getAuthorizationResource} from "../auth/[...nextauth]/resourceClient";
import { getUserResourcesByType, getUserPermissionToCreateResource, getUserPermissionToDeleteResource, getUserBulkPermissions} from "../auth/[...nextauth]/resourceClient";

export async function POST(request) {
  const user_token = request.headers.get('authorization');
  const permission = await getUserPermissionToCreateResource(user_token, null, "root"); //VERIFICA SE O USER TEM PERMISSAO PARA CRIAR TENANTS
  if(permission.length === 0){
    return NextResponse.json({ message: "You don't have permission to create tenants" }, { status: 401 });
  }
  else {
    const { title, description } = await request.json();
    await connectMongoDB();
    const tenant = await Tenant.create({_id: uuidv4(), title, description }); //CREATE ON MONGODB
    const id = tenant._id.toString();
    await createTenantResource(id, title, description); //CREATE RESOURCE ON KEYCLOAK
    revalidateTag("tenantList");
    return NextResponse.json({ message: "Tenant Created" }, { status: 201 });
  }
}

export async function GET(request) {
  const user_token = request.headers.get('authorization');
  const res = await getUserResourcesByType(user_token, "tenants"); //BUSCAR OS TENANTS QUE O USER TEM PERMISSAO READ
  let tenantsIds = [];
  if(res.length === 0){
    return NextResponse.json({ tenants: tenantsIds });
  }
  else {
    tenantsIds = res.map(tenant => tenant.rsid);
    let permissions = []
    for(let tenant of tenantsIds){
      //permissions.push({ permission: `${tenant}#create`, permission_resource_format: null });
      permissions.push({ permission: `${tenant}#read`, permission_resource_format: null});
      //permissions.push({ permission: `${tenant}#update`, permission_resource_format: null});
      permissions.push({ permission: `${tenant}#delete`, permission_resource_format: null });
    }
    const bulkPermissions = await getUserBulkPermissions(user_token, permissions);
    //MERGE DAS PERMISSOES COM O MESMO ID NUM SÓ OBJETO
    let mergedPermissions = Object.values(bulkPermissions.reduce((result, {rsid, rsname, scopes}) => {
      if(!result[rsid]) {
        result[rsid] = {rsid, rsname, scopes: []};
      }
      result[rsid].scopes.push(...scopes);
      return result;
    }, {}));
    
    await connectMongoDB();
    const tenantsMongo = await Tenant.find(  //BUSCAR OS TENANTS NO MONGODB
      { _id: { $in: tenantsIds } }
    )
    
    let tenantsObjects = [];
    for(let mergedPermission of mergedPermissions){
      let tenantMongo = tenantsMongo.find(tenant => tenant._id == mergedPermission.rsid);
      if(tenantMongo) {
        let tenantObject = tenantMongo.toObject(); //Tornar em objeto para poder adicionar propriedades
        tenantObject.scopes = mergedPermission.scopes;
        tenantsObjects.push(tenantObject);
      }
    }

    const permissionCreateTenants = await getUserPermissionToCreateResource(user_token, null, "root"); //VERIFICA SE O USER TEM PERMISSAO PARA CRIAR TENANTS
    let result = {
      tenants: tenantsObjects,
      permissionCreateTenants: permissionCreateTenants.length > 0 ? true : false
    }

    return NextResponse.json({ result: result });
  }
}

export async function DELETE(request) {
  const user_token = request.headers.get('authorization');
  const id = request.nextUrl.searchParams.get("id");
  const permission = await getUserPermissionToDeleteResource(user_token, id); //VERIFICA SE O USER TEM PERMISSAO PARA ELIMINAR TENANTS
  if(permission.length === 0){
    return NextResponse.json({ message: "You don't have permission to delete tenants" }, { status: 401 });
  }
  else {
    await connectMongoDB();
    await Tenant.findByIdAndDelete(id); //DELETE ON MONGODB
    await deleteClientAuthorizationResource(id); //DELETE RESOURCE ON KEYCLOAK
    return NextResponse.json({ message: "Tenant deleted" }, { status: 200 });
  }
}
