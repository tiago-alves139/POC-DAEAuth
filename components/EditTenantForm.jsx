"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import ButtonGeneric from "./ButtonGeneric";

export default function EditTenantForm({ id, title, description, accessToken }) {
  const [newTitle, setNewTitle] = useState(title);
  const [newDescription, setNewDescription] = useState(description);
  

  const router = useRouter();

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const res = await fetch(`http://localhost:3000/api/tenants/${id}`, {
        method: "PUT",
        headers: {
          Authorization: `Bearer ${accessToken}`,
          "Content-type": "application/json",
        },
        body: JSON.stringify({ newTitle, newDescription }),
      });

      if (!res.ok) {
        throw new Error("Failed to update tenant");
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
        placeholder="Tenant Title"
      />

      <input
        onChange={(e) => setNewDescription(e.target.value)}
        value={newDescription}
        className="rounded border border-slate-500 px-8 py-2"
        type="text"
        placeholder="Tenant Description"
      />

      <ButtonGeneric title="Update Tenant"/>
    </form>
  );
}
