
import Link from "next/link";
import RemoveBtn from "./RemoveBtn";
import { HiPencilAlt } from "react-icons/hi";

export default function ListCard({ id, title, description, accessToken, editUrl, deleteUrl, permissionToDelete }) {
    console.log("permissionToDelete: ", permissionToDelete);
    return (
        <div
        key={id}
        className="rounded p-4 border border-slate-300 my-3 flex justify-between gap-5 items-start"
        >
        <div>
            <h2 className="font-bold text-2xl">{title}</h2>
            <div>{description}</div>
        </div>

        <div className="flex gap-2">
            {permissionToDelete && <RemoveBtn url={deleteUrl} accessToken={accessToken}/>}
            <Link href={editUrl}>
            <HiPencilAlt size={24} />
            </Link>
        </div>
        </div>
    );
}   