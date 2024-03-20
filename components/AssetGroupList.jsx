import List from "./List";
import ListCard from "./ListCard";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { getServerSession } from 'next-auth'

export default async function AssetGroupsList({tenantId, assetGroups}) {
  const session = await getServerSession(authOptions);
  console.log("ASSET GROUPS: ", assetGroups);

  return (
    <List title="Asset Groups List">
      {assetGroups.map((assetGroup) => (
        <ListCard id={assetGroup._id} title={assetGroup.title} description={assetGroup.description} accessToken={session.accessToken} 
        editUrl={`${tenantId}/editAssetGroup/${assetGroup._id}`} deleteUrl={`api/assetGroups?id=${assetGroup._id}`} permissionToDelete={assetGroup.scopes.includes("delete")} />
      ))}
    </List>
  );
}
