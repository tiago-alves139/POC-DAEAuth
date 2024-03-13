import EditAssetGroupForm from "@/components/EditAssetGroupForm";
import DeviceList from "@/components/DeviceList";
import AddDevice from "@/app/addDevice/page";

const getAssetGroupById = async (id) => {
  try {
    const res = await fetch(`http://localhost:3000/api/assetgroups/${id}`, {
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

export default async function EditAssetGroup({ params }) {
  const { assetGroupId } = params;
  const { assetGroup } = await getAssetGroupById(assetGroupId);
  const { title, description } = assetGroup;

  return (
  <>
  <h1>Edit Asset Group</h1>
    <EditAssetGroupForm id={assetGroupId} title={title} description={description} />
    <br></br>
    <DeviceList assetGroupId={assetGroupId}/>
    <br></br>
    <AddDevice assetGroupId={assetGroupId}/>
  </>
  );
}
