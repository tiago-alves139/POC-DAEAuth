import List from "./List";
import ListCard from "./ListCard";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { getServerSession } from 'next-auth'

export default async function DevicesList({assetGroupId, devices}) {
  const session = await getServerSession(authOptions);
  return (
    <List title="Devices List">
      {devices.map((device) => (
        <ListCard id={device._id} title={device.title} description={device.description} accessToken={session.accessToken} 
        editUrl={`${assetGroupId}/editDevice/${device._id}`} deleteUrl={`api/devices?id=${device._id}`} permissionToDelete={device.scopes.includes("delete")} />
      ))}
    </List>
  );
}
