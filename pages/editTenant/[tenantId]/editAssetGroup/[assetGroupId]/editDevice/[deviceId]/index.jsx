import EditDeviceForm from "@/components/EditDeviceForm";

const getDeviceById = async (deviceId) => {
  try {
    const res = await fetch(`http://localhost:3000/api/devices/${deviceId}`, {
      cache: "no-store",
    });

    if (!res.ok) {
      throw new Error("Failed to fetch device");
    }

    const {device} = await res.json();

    console.log("GET DEVICE BY ID: " + device);

    return {device: device};

  } catch (error) {
    console.log(error);
  }
};

export const getServerSideProps = async (context) => {
  const id = context.params.deviceId;

  const {device} = await getDeviceById(id);

  console.log("DEVICE PROPS: " + device);
  console.log("DEVICE ID PROPS: " + id);

  return { props: { device: device, deviceId: id}};
};

export default function EditDevice({ device, deviceId }) {
  console.log("DEVICE: " + device);
  const { title, description } = device;
  return (
  <>
    <h1 className="font-bold text-4xl text-center mb-4">{title}</h1>
    <br></br>
    <h2 className="font-bold text-2xl text-center mb-4" >Device Info</h2>
    <EditDeviceForm id={deviceId} title={title} description={description} />
  </>
  );
}
