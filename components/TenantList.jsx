import ListCard from "./ListCard";
import List from "./List";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { getServerSession } from 'next-auth'


export default async function TenantsList({ tenants }) {
  const session = await getServerSession(authOptions);
  console.log("TENANTS: ", tenants);
  return (
    <List title="Tenants List">
      {tenants.map((tenant) => (
        <ListCard id={tenant._id} title={tenant.title} description={tenant.description} accessToken={session.accessToken} 
        editUrl={`editTenant/${tenant._id}`} deleteUrl={`api/tenants?id=${tenant._id}`} permissionToDelete={tenant.scopes.includes("delete")} />
      ))}
    </List>
  );
}
