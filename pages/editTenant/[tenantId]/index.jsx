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

    return res.json();
  } catch (error) {
    console.log(error);
  }
};

export const getServerSideProps = async (context) => {
  const id = context.params.tenantId;

  console.log("getServerSideProps" + id);

  try {
    const res = await fetch(`http://localhost:3000/api/tenants/${id}/assetgroups`, {
      cache: "no-store",
    });

    if (!res.ok) {
      throw new Error("Failed to fetch assetGroups");
    }
    
    const { assetGroups } = await res.json();
    
    console.log("AssetGroups: ", assetGroups)

    return { props: { assetGroups, tenantId: id }};
  } catch (error) {
    console.log("Error loading assetGroups: ", error);
  }

  return { props: { assetGroups: []}};

};

export default function EditTenant({ assetGroups, tenantId }) {
  console.log("EditTenant: " + assetGroups);
  
  //const { tenantId } = params;
  //const { tenant } = await getTenantById(tenantId);
  //const { title, description } = tenant;
  //console.log("TenantId111: " + tenantId);
  return (
  <>
  <h1>Edit Tenant</h1>
    <EditTenantForm id={tenantId} title={"as"} description={"asd"} />
    <br></br>
    <AssetGroupsList assetGroups={assetGroups}/>
    <br></br>
    <AddAssetGroup tenantId={tenantId}/>
  </>
  );
}
