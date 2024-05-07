"use client";

import ListCard from "./ListCard";
import List from "./List";
import { useEffect } from 'react';
import { useRouter } from 'next/navigation';

let auto = true;

export default function DevicesList({assetGroupId, devices, accessToken}) {
  const router = useRouter();

  useEffect(() => {
    if (devices.length === 1 && auto) {
      router.push(`${assetGroupId}/editDevice/${devices[0]._id}`);
      auto = false;
    }
  }, [devices]);

  console.log("DEVICES: ", devices);

  return (
    (devices.length === 1 && auto) ? 
      (
        <div>LOADING ...</div> 
      ) :
      (
        <List title="Devices List">
          {devices.map((device) => (
            <ListCard id={device._id} title={device.title} description={device.description} accessToken={accessToken} 
            editUrl={`${assetGroupId}/editDevice/${device._id}`} deleteUrl={`api/devices?id=${device._id}`} permissionToDelete={device.scopes.includes("delete")} />
          ))}
        </List>
      )
  );
}
