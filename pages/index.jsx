import TenantsList from "@/components/TenantList";
import AddTenant from "./addTenant/index";

export default function Home() {
  return (
  <>
    <h1>Tenants</h1>
    <br></br>
    <AddTenant />
    <br/>
    <TenantsList />
  </>
  );
}
