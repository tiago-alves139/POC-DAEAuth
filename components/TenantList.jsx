import Link from "next/link";
import RemoveBtn from "./RemoveBtnTenant";
import { HiPencilAlt } from "react-icons/hi";

export default function TenantsList({tenants}) {
  console.log("TENANTS LIST: " + tenants);
  console.log(tenants);
  return (
    <>
      <h2 className="font-bold text-2xl text-center">Tenants List</h2>
      {tenants.map((t) => (
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
            <Link href={`/editTenant/${t._id}`}>
              <HiPencilAlt size={24} />
            </Link>
          </div>
        </div>
      ))}
    </>
  );
}
