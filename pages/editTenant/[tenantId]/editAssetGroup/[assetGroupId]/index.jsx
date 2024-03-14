
import EditAssetGroupForm from "@/components/EditAssetGroupForm";
import DeviceList from "@/components/DeviceList";
import AddDevice from "@/pages/addDevice/index";

const getAssetGroupById = async (id) => {
  try {
    const res = await fetch(`http://localhost:3000/api/assetgroups/${id}`, {
      cache: "no-store",
    });

    if (!res.ok) {
      throw new Error("Failed to fetch assetGroup");
    }

    const {assetGroup} = await res.json();

    return {assetGroup: assetGroup};
  } catch (error) {
    console.log(error);
  }
};

const getAssetGroupDevices = async (assetGroupId) => {
  try {
    const res = await fetch(`http://localhost:3000/api/assetgroups/${assetGroupId}/devices`, {
      cache: "no-store",
    });

    if (!res.ok) {
      throw new Error("Failed to fetch devices");
    }

    const {devices} = await res.json();

    return {devices: devices};
  } catch (error) {
    console.log("Error loading devices: ", error);
  }

  return [];
};


export const getServerSideProps = async (context) => {
  const id = context.params.assetGroupId;

  const {assetGroup} = await getAssetGroupById(id);
  const {devices} = await getAssetGroupDevices(id);

  console.log("ASSET GROUP DEVICES PROPS: " + devices);

  return { props: { devices: devices, assetGroup: assetGroup, assetGroupId: id}};
};

export default function EditAssetGroup({ devices, assetGroup, assetGroupId }) {
  const { title, description, tenantId } = assetGroup;

  return (
  <>
  <h1 className="font-bold text-4xl text-center mb-4">{title}</h1>
  <br></br>
  <h2 className="font-bold text-2xl text-center mb-4">Asset Group Info</h2>
    <EditAssetGroupForm id={assetGroupId} title={title} description={description} />
    <br></br>
    <DeviceList devices={devices} assetGroupId={assetGroupId} tenantId={tenantId}/>
    <br></br>
    <AddDevice assetGroupId={assetGroupId}/>
  </>
  );
}
