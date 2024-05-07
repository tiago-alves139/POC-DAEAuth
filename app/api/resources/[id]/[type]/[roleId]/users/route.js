import connectMongoDB from "@/libs/mongodb";
import Tenant from "@/models/tenant";
import AssetGroup from "@/models/assetgroup";
import { NextResponse } from "next/server";
import {getRoleUsers, getUserPermission} from "@/app/api/auth/[...nextauth]/resourceClient";
import { get } from "mongoose";

export async function GET(request, { params }) {
    const { id, type, roleId } = params;
    const user_token = request.headers.get('authorization');
    const permission = { permission: `${params.id}#listUsers`, permission_resource_format: "", response_mode: "" };
    const res = await getUserPermission(user_token, permission);
    const permissionToAddPermissionToUser = { permission: `${params.id}#manage.permissions.${type}.${roleId}`, permission_resource_format: "", response_mode: "" };
    console.log("Permission: ", permissionToAddPermissionToUser)
    const res2 = await getUserPermission(user_token, permissionToAddPermissionToUser);
    console.log("Permission to add permission to user: ", res2)
    if(!res || res2.length === 0){
        return NextResponse.json({ users: [], permission: false });
    }
    else {
        const result = await getRoleUsers(id, roleId, type);
        console.log("getRoleUsers: ", result);
        return NextResponse.json({ users: result, permission: res2 });
    }
}