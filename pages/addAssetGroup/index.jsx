import { useRouter } from "next/navigation";

export default function AddAssetGroup({tenantId}) {
  const [title, setTitle] = "test";
  const [description, setDescription] = "teste";

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
    <h1>Add New Asset Group</h1>
    <form onSubmit={handleSubmit} className="flex flex-col gap-3">
      <input
        onChange={(e) => setTitle(e.target.value)}
        value={title}
        className="border border-slate-500 px-8 py-2"
        type="text"
        placeholder="AssetGroup Title"
      />

      <input
        onChange={(e) => setDescription(e.target.value)}
        value={description}
        className="border border-slate-500 px-8 py-2"
        type="text"
        placeholder="AssetGroup Description"
      />

      <button
        type="submit"
        className="bg-green-600 font-bold text-white py-3 px-6 w-fit"
      >
        Add AssetGroup
      </button>
    </form>
    </>
  );
}
