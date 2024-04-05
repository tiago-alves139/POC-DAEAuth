import EditDeviceForm from "@/components/EditDeviceForm";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { getServerSession } from 'next-auth'

const getDeviceById = async (deviceId, accessToken) => {
  try {
    const res = await fetch(`http://localhost:3000/api/devices/${deviceId}`, {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
      cache: "no-store",
    });

    if (!res.ok) {
      throw new Error("Failed to fetch device");
    }

    return res.json();
  } catch (error) {
    console.log(error);
  }
};

export default async function EditDevice({ params }) {
  const { deviceId } = params;
  const session = await getServerSession(authOptions);
  const { result } = await getDeviceById(deviceId, session.accessToken);
  const device = result.device;
  const { title, description } = device;
  console.log("PERMISSION TO UPDATE DEVICE: ", result.permissionUpdate);
  console.log("PERMISSION TO LIST USERS: ", result.permissionListUsers);

  return (
  <>
    <h1 className="font-bold text-4xl mb-4">{title}</h1>
    {result.permissionUpdate && <EditDeviceForm id={deviceId} title={title} description={description} accessToken={session.accessToken} />}
    <br></br>
    {result.permissionListUsers && <UserList resourceId={deviceId} accessToken={session.accessToken}/>}
  </>
  );
}
