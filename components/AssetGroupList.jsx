import List from "./List";
import ListCard from "./ListCard";

const getAssetGroups = async (id) => {
  try {
    const res = await fetch(`http://localhost:3000/api/tenants/${id}/assetgroups`, {
      cache: "no-store",
    });

    if (!res.ok) {
      throw new Error("Failed to fetch assetGroups");
    }

    return res.json();
  } catch (error) {
    console.log("Error loading assetGroups: ", error);
  }
};

export default async function AssetGroupsList({tenantId}) {
  const { assetGroups } = await getAssetGroups(tenantId);

  return (
    <List title="Asset Groups List">
      {assetGroups.map((assetGroup) => (
        <ListCard id={assetGroup._id} title={assetGroup.title} description={assetGroup.description} editUrl={`${tenantId}/editAssetGroup/${assetGroup._id}`} deleteUrl={`assetGroups?id=${assetGroup._id}`} />
      ))}
    </List>
  );
}
