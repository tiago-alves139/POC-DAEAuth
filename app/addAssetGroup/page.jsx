"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import ButtonGeneric from "../../components/ButtonGeneric";

export default function AddAssetGroup({tenantId, accessToken}) {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");

  const router = useRouter();

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!title || !description) {
      alert("Title and description are required.");
      return;
    }

    try {
      const res = await fetch("http://localhost:3000/api/assetgroups", {
        next: {tags: ["assetGroupList"]},
        method: "POST",
        headers: {
          "Authorization": `Bearer ${accessToken}`,
          "Content-type": "application/json",
        },
        body: JSON.stringify({ title, description, tenantId }),
      });

      if (res.ok) {
        router.refresh();
        setTitle("");
        setDescription("");
      } else {
        throw new Error("Failed to create a assetGroup");
      }
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <>
    <h2 className="font-bold text-2xl mb-4">Create New Asset Group</h2>
    <form onSubmit={handleSubmit} className="max-w-xl flex flex-col gap-3">
      <input
        onChange={(e) => setTitle(e.target.value)}
        value={title}
        className="rounded border border-slate-500 px-8 py-2"
        type="text"
        placeholder="AssetGroup Title"
      />

      <input
        onChange={(e) => setDescription(e.target.value)}
        value={description}
        className="rounded border border-slate-500 px-8 py-2"
        type="text"
        placeholder="AssetGroup Description"
      />

      <ButtonGeneric title="Create AssetGroup"/>
    </form>
    </>
  );
}
