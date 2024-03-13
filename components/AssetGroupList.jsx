import Link from "next/link";
import RemoveBtn from "./RemoveBtnAssetGroup";
import { HiPencilAlt } from "react-icons/hi";

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
    <>
    <h1>Asset Groups List</h1>
      {assetGroups.map((t) => (
        <div
          key={t._id}
          className="p-4 border border-slate-300 my-3 flex justify-between gap-5 items-start"
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
