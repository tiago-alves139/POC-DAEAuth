import ListCard from "./ListCard";
import List from "./List";

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
    <List title="Tenants List">
      {tenants.map((tenant) => (
        <ListCard id={tenant._id} title={tenant.title} description={tenant.description} editUrl={`editTenant/${tenant._id}`} deleteUrl={`tenants?id=${tenant._id}`} />
      ))}
    </List>
  );
}
