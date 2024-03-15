"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import ButtonGeneric from "./ButtonGeneric";

export default function EditAssetGroupForm({ id, title, description }) {
  const [newTitle, setNewTitle] = useState(title);
  const [newDescription, setNewDescription] = useState(description);

  const router = useRouter();

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const res = await fetch(`http://localhost:3000/api/assetgroups/${id}`, {
        method: "PUT",
        headers: {
          "Content-type": "application/json",
        },
        body: JSON.stringify({ newTitle, newDescription }),
      });

      if (!res.ok) {
        throw new Error("Failed to update assetGroup");
      }

      router.refresh();
      router.back();
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="max-w-xl flex flex-col gap-3">
      <input
        onChange={(e) => setNewTitle(e.target.value)}
        value={newTitle}
        className="rounded border border-slate-500 px-8 py-2"
        type="text"
        placeholder="AssetGroup Title"
      />

      <input
        onChange={(e) => setNewDescription(e.target.value)}
        value={newDescription}
        className="rounded border border-slate-500 px-8 py-2"
        type="text"
        placeholder="AssetGroup Description"
      />

      <ButtonGeneric title="Update AssetGroup">
      </ButtonGeneric>
    </form>
  );
}
