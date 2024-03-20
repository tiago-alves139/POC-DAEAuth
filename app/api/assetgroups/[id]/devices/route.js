import connectMongoDB from "@/libs/mongodb";
import Device from "@/models/device";
import { NextResponse } from "next/server";
import { getUserResourcesByType, getUserBulkPermissions } from "@/app/api/auth/[...nextauth]/resourceClient";


export async function GET(request, { params }) {
    const user_token = request.headers.get('authorization');
    const res = await getUserResourcesByType(user_token, "devices");
    let devicesIds = [];
    if(res.length === 0){
      return NextResponse.json({ devices: devicesIds });
    }
    else {
      devicesIds = res.map(device => device.rsid);
      let permissions = []
      for(let device of devicesIds){
        //permissions.push({ permission: `${tenant}#create`, permission_resource_format: null });
        permissions.push({ permission: `${device}#read`, permission_resource_format: null});
        //permissions.push({ permission: `${tenant}#update`, permission_resource_format: null});
        permissions.push({ permission: `${device}#delete`, permission_resource_format: null });
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

      const { id } = params;
      await connectMongoDB();
      const devicesMongo = await Device.find({
        _id: { $in: devicesIds },
        assetGroupId: id
      });

      let devicesObjects = [];
      for(let mergedPermission of mergedPermissions){
        let deviceMongo = devicesMongo.find(device => device._id == mergedPermission.rsid);
        if(deviceMongo) {
          let deviceObject = deviceMongo.toObject(); //Tornar em objeto para poder adicionar propriedades
          deviceObject.scopes = mergedPermission.scopes;
          devicesObjects.push(deviceObject);
        }
      }

      return NextResponse.json({ devices: devicesObjects });
    }
}