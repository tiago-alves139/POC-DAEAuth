
import EditTenantForm from "@/components/EditTenantForm";
import AssetGroupsList from "@/components/AssetGroupList";
import AddAssetGroup from "@/pages/addAssetGroup/index";

const getTenantById = async (id) => {
  try {
    const res = await fetch(`http://localhost:3000/api/tenants/${id}`, {
      cache: "no-store",
    });

    if (!res.ok) {
      throw new Error("Failed to fetch tenant");
    }

    const {tenant} = await res.json();

    console.log("Tenant" + tenant);
    return {tenant: tenant};

  } catch (error) {
    console.log(error);
  }
};

const getTenantAssetGroups = async (id) => {
  try {
    const res = await fetch(`http://localhost:3000/api/tenants/${id}/assetgroups`, {
      cache: "no-store",
    });

    if (!res.ok) {
      throw new Error("Failed to fetch assetGroups");
    }
    
    const { assetGroups } = await res.json();
    
    console.log("AssetGroups: ", assetGroups)

    return {assetGroups: assetGroups};
  } catch (error) {
    console.log("Error loading assetGroups: ", error);
  }

  return [];
};

export const getServerSideProps = async (context) => {
  const id = context.params.tenantId;

  const {tenant} = await getTenantById(id);
  const {assetGroups} = await getTenantAssetGroups(id);

  console.log("Asset Groups PROPS: " + assetGroups);

  return { props: { assetGroups: assetGroups, tenant: tenant, tenantId: id}};
};

export default function EditTenant({ assetGroups, tenantId, tenant }) {
  const { title, description } = tenant;
  return (
  <>
  <h1 className="font-bold text-4xl text-center mb-4">{title}</h1>
  <br></br>
  <h2 className="font-bold text-2xl text-center mb-4">Tenant Info</h2>
    <EditTenantForm id={tenantId} title={title} description={description} />
    <br></br>
    <AssetGroupsList assetGroups={assetGroups} tenantId={tenantId}/>
    <br></br>
    <AddAssetGroup tenantId={tenantId}/>
  </>
  );
}
