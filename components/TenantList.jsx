import Link from "next/link";
import RemoveBtn from "./RemoveBtnTenant";
import { HiPencilAlt } from "react-icons/hi";

const getTenants = async () => {
  try {
    const res = await fetch("http://localhost:3000/api/tenants", {
      cache: "no-store",
    });

    if (!res.ok) {
      throw new Error("Failed to fetch tenants");
    }

    return res.json();
  } catch (error) {
    console.log("Error loading tenants: ", error);
  }
};

export default async function TenantsList() {
  const { tenants } = await getTenants();

  return (
    <>
      <h1>Tenants List</h1>
      {tenants.map((t) => (
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
            <Link href={`/editTenant/${t._id}`}>
              <HiPencilAlt size={24} />
            </Link>
          </div>
        </div>
      ))}
    </>
  );
}
