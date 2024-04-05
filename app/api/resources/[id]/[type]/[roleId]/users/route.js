import connectMongoDB from "@/libs/mongodb";
import Tenant from "@/models/tenant";
import AssetGroup from "@/models/assetgroup";
import { NextResponse } from "next/server";
import {getRoleUsers, getUserPermission} from "@/app/api/auth/[...nextauth]/resourceClient";
import { get } from "mongoose";

export async function GET(request, { params }) {
    const user_token = request.headers.get('authorization');
    const permission = { permission: `${params.id}#listUsers`, permission_resource_format: "", response_mode: "" };
    const res = await getUserPermission(user_token, permission);
    console.log("Permission to list users: ", res)
    if(!res){
        return NextResponse.json({ users: [] });
    }
    else {
        const { id, type, roleId } = params;
        const result = await getRoleUsers(id, roleId, type);
        console.log("getRoleUsers: ", result);
        return NextResponse.json({ users: result });
    }
}