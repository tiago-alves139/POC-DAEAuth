import connectMongoDB from "@/libs/mongodb";
import Tenant from "@/models/tenant";
import AssetGroup from "@/models/assetgroup";
import { NextResponse } from "next/server";
import {addPermissionToUser, addPermissionToUser_WithUserToken, getUserPermission} from "@/app/api/auth/[...nextauth]/resourceClient";
import { get } from "mongoose";

export async function POST(request, { params }) {
    const { id, type, roleId, userId } = params;
    const user_token = request.headers.get('authorization');
    //const permission = { permission: `${params.id}#addUserPermission`, permission_resource_format: "", response_mode: "" };
    const permission = { permission: `${params.id}#manage.permissions.${type}.${roleId}`, permission_resource_format: "", response_mode: "" };
    const res = await getUserPermission(user_token, permission);
    console.log("Permission to add permission to user: ", res)
    if(!res || res.length === 0){
        return new NextResponse().status(403);
    }
    else {
        //const result = await addPermissionToUser(id, userId, roleId, type, user_token);
        const result = await addPermissionToUser_WithUserToken(id, userId, roleId, type, user_token);
        console.log("addPermissionToUser With User Token: ", result);
        return NextResponse.json({ result: result });
    }
}