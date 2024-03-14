import Link from "next/link";
import RemoveBtn from "./RemoveBtnDevice";
import { HiPencilAlt } from "react-icons/hi";

export default function DevicesList({devices, assetGroupId, tenantId}) {
  console.log("DEVICES: " + devices);
  console.log("DEVICES ASSET GROUP ID: " + assetGroupId);
  console.log("DEVICES TENANT ID: " + tenantId);
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
            <Link href={`/editTenant/${tenantId}/editAssetGroup/${assetGroupId}/editDevice/${t._id}`}>
              <HiPencilAlt size={24} />
            </Link>
          </div>
        </div>
      ))}
    </>
  );
}
