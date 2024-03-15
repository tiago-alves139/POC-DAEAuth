import List from "./List";
import ListCard from "./ListCard";

const getDevices = async (assetGroupId) => {
  try {
    const res = await fetch(`http://localhost:3000/api/assetgroups/${assetGroupId}/devices`, {
      cache: "no-store",
    });

    if (!res.ok) {
      throw new Error("Failed to fetch devices");
    }

    return res.json();
  } catch (error) {
    console.log("Error loading devices: ", error);
  }
};

export default async function DevicesList({assetGroupId}) {
  const { devices } = await getDevices(assetGroupId);

  return (
    <List title="Devices List">
      {devices.map((device) => (
        <ListCard id={device._id} title={device.title} description={device.description} editUrl={`${assetGroupId}/editDevice/${device._id}`} deleteUrl={`devices?id=${device._id}`} />
      ))}
    </List>
  );
}
