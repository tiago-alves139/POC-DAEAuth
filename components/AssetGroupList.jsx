import Link from "next/link";
import RemoveBtn from "./RemoveBtnAssetGroup";
import { HiPencilAlt } from "react-icons/hi";

export default function AssetGroupsList({assetGroups, tenantId}) {
  console.log(assetGroups);
  return (
    <>
    <h2 className="font-bold text-2xl text-center">Asset Groups List</h2>
      {assetGroups.map((t) => (
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
            <Link href={`${tenantId}/editAssetGroup/${t._id}`}>
              <HiPencilAlt size={24} />
            </Link>
          </div>
        </div>
      ))}
    </>
  );
}
