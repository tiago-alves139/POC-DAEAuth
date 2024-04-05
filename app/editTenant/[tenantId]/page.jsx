import EditTenantForm from "@/components/EditTenantForm";
import AssetGroupsList from "@/components/AssetGroupList";
import AddAssetGroup from "@/app/addAssetGroup/page";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { getServerSession } from 'next-auth'
import UserList from "@/components/UserList";

const getTenantById = async (id, accessToken) => {
  try {
    const res = await fetch(`http://localhost:3000/api/tenants/${id}`, {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
      cache: "no-store",
    });

    if (!res.ok) {
      throw new Error("Failed to fetch tenant");
    }

    return res.json();
  } catch (error) {
    console.log(error);
  }
};

const getAssetGroups = async (accessToken, id) => {
  try {
    const res = await fetch(`http://localhost:3000/api/tenants/${id}/assetgroups`, {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
      cache: "no-store",
      credentials: "include"
    });

    if (!res.ok) {
      throw new Error("Failed to fetch assetGroups");
    }

    return res.json();
  } catch (error) {
    console.log("Error loading assetGroups: ", error);
  }
};

export default async function EditTenant({ params }) {
  const { tenantId } = params;
  const session = await getServerSession(authOptions);
  const { result } = await getTenantById(tenantId, session.accessToken);
  const tenant = result.tenant;
  const { title, description } = tenant;
  const { assetGroups } = await getAssetGroups(session.accessToken, tenantId);
  console.log("PERMISSION TO UPDATE TENANT: ", result.permissionUpdate);
  console.log("PERMISSION TO CREATE ASSET GROUPS: ", result.permissioCreateAssetGroups);
  console.log("PERMISSION TO LIST USERS: ", result.permissionListUsers);

  return (
  <>
  <h1 className="font-bold text-4xl mb-4">{title}</h1>
    {result.permissionUpdate && <EditTenantForm id={tenantId} title={title} description={description} accessToken={session.accessToken} />}
    <br></br>
    <AssetGroupsList tenantId={tenantId} assetGroups={assetGroups}/>
    <br></br>
    {result.permissioCreateAssetGroups && <AddAssetGroup tenantId={tenantId} accessToken={session.accessToken}/>}
    <br></br>
    {result.permissionListUsers && <UserList resourceId={tenantId} accessToken={session.accessToken}/>}
  </>
  );
}
