"use client";

import List from "./List";
import ListCard from "./ListCard";
import { useEffect } from 'react';
import { useRouter } from 'next/navigation';

let auto = true;

export default function AssetGroupsList({tenantId, assetGroups, accessToken}) {
  const router = useRouter();
  
  useEffect(() => {
    if (assetGroups.length === 1 && auto) {
      router.push(`${tenantId}/editAssetGroup/${assetGroups[0]._id}`);
      auto = false;
    }
  }, [assetGroups]);

  console.log("ASSET GROUPS: ", assetGroups);

  return (
    (assetGroups.length === 1 && auto) ? 
    (
      <div>LOADING ...</div> 
    ) :
    (
      <List title="Asset Groups List">
        {assetGroups.map((assetGroup) => (
          <ListCard id={assetGroup._id} title={assetGroup.title} description={assetGroup.description} accessToken={accessToken} 
          editUrl={`${tenantId}/editAssetGroup/${assetGroup._id}`} deleteUrl={`api/assetGroups?id=${assetGroup._id}`} permissionToDelete={assetGroup.scopes.includes("delete")} />
        ))}
      </List>
    )
  );
}
