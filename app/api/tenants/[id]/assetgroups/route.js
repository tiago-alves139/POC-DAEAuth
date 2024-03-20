import connectMongoDB from "@/libs/mongodb";
import AssetGroup from "@/models/assetgroup";
import { NextResponse } from "next/server";
import { getUserResourcesByType, getUserBulkPermissions } from "@/app/api/auth/[...nextauth]/resourceClient";


export async function GET(request, { params }) {
    const user_token = request.headers.get('authorization');
    const res = await getUserResourcesByType(user_token, "assetgroups");
    let assetgroupsIds = [];
    if(res.length === 0){
      return NextResponse.json({ assetGroups: assetgroupsIds });
    }
    else {
      assetgroupsIds = res.map(assetgroup => assetgroup.rsid);
      let permissions = []
      for(let assetGroup of assetgroupsIds){
        // permissions.push({ permission: `${assetGroup}#create`, permission_resource_format: null });
        permissions.push({ permission: `${assetGroup}#read`, permission_resource_format: null});
        // permissions.push({ permission: `${assetGroup}#update`, permission_resource_format: null});
        permissions.push({ permission: `${assetGroup}#delete`, permission_resource_format: null });
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
      const assetGroupsMongo = await AssetGroup.find({
        _id: { $in: assetgroupsIds },
        tenantId: id
      });

      let assetGroupObjects = [];
      for(let mergedPermission of mergedPermissions){
        let assetGroupMongo = assetGroupsMongo.find(assetGroup => assetGroup._id === mergedPermission.rsid);
        if(assetGroupMongo){
          let assetGroupObject = assetGroupMongo.toObject();
          assetGroupObject.scopes = mergedPermission.scopes;
          assetGroupObjects.push(assetGroupObject);
        }
      }
      return NextResponse.json({ assetGroups: assetGroupObjects });
    }
}
