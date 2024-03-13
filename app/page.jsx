import TenantsList from "@/components/TenantList";
import { Adamina } from "next/font/google";
import AddTenant from "./addTenant/page";

export default function Home() {
  return (
  <>
    <h1>Tenants</h1>
    <br></br>
    {/*<AddTenant />*/}
    <br/>
    <TenantsList />
  </>
  );
}
