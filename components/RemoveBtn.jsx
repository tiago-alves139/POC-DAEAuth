"use client";

import { HiOutlineTrash } from "react-icons/hi";
import { useRouter } from "next/navigation";

export default function RemoveBtn({ url, accessToken }) {
  const router = useRouter();
  const removeResource = async () => {
    const confirmed = confirm("Are you sure?");

    if (confirmed) {
      const res = await fetch(`http://localhost:3000/${url}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${accessToken}`,
        }
      });

      if (res.ok) {
        router.refresh();
      }
    }
  };

  return (
    <button onClick={removeResource} className="text-red-400">
      <HiOutlineTrash size={24} />
    </button>
  );
}
