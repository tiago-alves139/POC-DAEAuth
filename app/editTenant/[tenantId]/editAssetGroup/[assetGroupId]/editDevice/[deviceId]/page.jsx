import EditDeviceForm from "@/components/EditDeviceForm";

const getDeviceById = async (deviceId) => {
  try {
    const res = await fetch(`http://localhost:3000/api/devices/${deviceId}`, {
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
  const { device } = await getDeviceById(deviceId);
  const { title, description } = device;

  return (
  <>
    <h1 className="font-bold text-4xl mb-4">{title}</h1>
    <EditDeviceForm id={deviceId} title={title} description={description} />
  </>
  );
}
