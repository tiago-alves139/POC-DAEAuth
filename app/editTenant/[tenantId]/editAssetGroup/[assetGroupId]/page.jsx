import EditAssetGroupForm from "@/components/EditAssetGroupForm";
import DeviceList from "@/components/DeviceList";
import AddDevice from "@/app/addDevice/page";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { getServerSession } from 'next-auth'

const getAssetGroupById = async (id, accessToken) => {
  try {
    const res = await fetch(`http://localhost:3000/api/assetgroups/${id}`, {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
      cache: "no-store",
    });

    if (!res.ok) {
      throw new Error("Failed to fetch assetGroup");
    }

    return res.json();
  } catch (error) {
    console.log(error);
  }
};

const getDevices = async (accessToken, assetGroupId) => {
  try {
    const res = await fetch(`http://localhost:3000/api/assetgroups/${assetGroupId}/devices`, {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
      cache: "no-store",
      credentials: "include"
    });

    if (!res.ok) {
      throw new Error("Failed to fetch devices");
    }

    return res.json();
  } catch (error) {
    console.log("Error loading devices: ", error);
  }
};


export default async function EditAssetGroup({ params }) {
  const { assetGroupId } = params;
  const session = await getServerSession(authOptions);
  const { result } = await getAssetGroupById(assetGroupId, session.accessToken);
  const assetGroup = result.assetGroup;
  const { title, description } = assetGroup;
  const { devices } = await getDevices(session.accessToken, assetGroupId);
  console.log("PERMISSION TO UPDATE ASSET GROUP: ", result.permissionUpdate);
  console.log("PERMISSION TO CREATE DEVICES: ", result.permissionCreateDevices);
  console.log("PERMISSION TO LIST USERS: ", result.permissionListUsers);

  return (
  <>
  <h1 className="font-bold text-4xl mb-4">{title}</h1>
    {result.permissionUpdate && <EditAssetGroupForm id={assetGroupId} title={title} description={description} accessToken={session.accessToken} />}
    <br></br>
    <DeviceList assetGroupId={assetGroupId} devices={devices}/>
    <br></br>
    {result.permissionCreateDevices && <AddDevice assetGroupId={assetGroupId} accessToken={session.accessToken}/>}
    <br></br>
    {result.permissionListUsers && <UserList resourceId={assetGroupId} accessToken={session.accessToken}/>}
  </>
  );
}
