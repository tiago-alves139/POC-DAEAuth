import connectMongoDB from "@/libs/mongodb";
import { v4 as uuidv4 } from 'uuid';
import AssetGroup from "@/models/assetgroup";
import Device from "@/models/device";
import Tenant from "@/models/tenant";
import { revalidateTag } from "next/cache";
import { NextResponse } from "next/server";
import { getUserPermissionToCreateResource, getUserResourcesByType, getUserPermissionToDeleteResource } from "../auth/[...nextauth]/resourceClient";

export async function GET(request) {
  const user_token = request.headers.get('authorization');
  const resTenants = await getUserResourcesByType(user_token, "tenants");
  const resAssetGroups = await getUserResourcesByType(user_token, "assetgroups");
  const resDevices = await getUserResourcesByType(user_token, "devices");
  let tenantsIds = [];
  let assetgroupsIds = [];
  let devicesIds = [];
  if(resAssetGroups.length === 0 && resDevices.length === 0 && resTenants.length === 0){
    return NextResponse.json({ resources: [] });
  }
  else {
    tenantsIds = resTenants.map(tenant => tenant.rsid);
    assetgroupsIds = resAssetGroups.map(assetgroup => assetgroup.rsid);
    devicesIds = resDevices.map(device => device.rsid);
    await connectMongoDB();
    const devicesMongo = await Device.find({
      _id: { $in: devicesIds }
    });

    for(let device of devicesMongo){
        if(!assetgroupsIds.includes(device.assetGroupId)){
            assetgroupsIds.push(device.assetGroupId);
        }
    }

    const assetGroupsMongo = await AssetGroup.find({
      _id: { $in: assetgroupsIds }
    });

    for(let assetgroup of assetGroupsMongo){
        if(!tenantsIds.includes(assetgroup.tenantId)){
            tenantsIds.push(assetgroup.tenantId);
        }
    }
    
    const tenantsMongo = await Tenant.find({
      _id: { $in: tenantsIds }
    });

    let resources = [];
    for(let tenant of tenantsMongo){
      resources.push(tenant.toObject());
    }

    for(let assetgroup of assetGroupsMongo){
      resources.push(assetgroup.toObject());
    }

    for(let device of devicesMongo){
      resources.push(device.toObject());
    }

    return NextResponse.json({ resources: resources });
  }
}
  