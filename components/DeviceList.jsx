import Link from "next/link";
import RemoveBtn from "./RemoveBtnDevice";
import { HiPencilAlt } from "react-icons/hi";

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
    <>
    <h2 className="font-bold text-2xl text-center">Device List</h2>
      {devices.map((t) => (
        <div
          key={t._id}
          className="rounded p-4 border border-slate-300 my-3 flex justify-between gap-5 items-start"
        >
          <div>
            <h2 className="font-bold text-2xl">{t.title}</h2>
            <div>{t.description}</div>
          </div>

          <div className="flex gap-2">
            <RemoveBtn id={t._id} />
            <Link href={`${assetGroupId}/editDevice/${t._id}`}>
              <HiPencilAlt size={24} />
            </Link>
          </div>
        </div>
      ))}
    </>
  );
}
