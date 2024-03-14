import EditTenantForm from "@/components/EditTenantForm";
import AssetGroupsList from "@/components/AssetGroupList";
import AddAssetGroup from "@/app/addAssetGroup/page";

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

export default async function EditTenant({ params }) {
  const { tenantId } = params;
  const { tenant } = await getTenantById(tenantId);
  const { title, description } = tenant;
  return (
  <>
  <h1 className="font-bold text-4xl text-center mb-4">{title}</h1>
    <EditTenantForm id={tenantId} title={title} description={description} />
    <br></br>
    <AssetGroupsList tenantId={tenantId}/>
    <br></br>
    <AddAssetGroup tenantId={tenantId}/>
  </>
  );
}
