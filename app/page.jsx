import TenantsList from "@/components/TenantList";
import { Adamina } from "next/font/google";
import AddTenant from "./addTenant/page";

export default function Home() {
  return (
  <>
    <h1 className="font-bold text-4xl text-center">Tenants Page</h1>
    <br></br>
    <AddTenant />
    <br/>
    <TenantsList />
  </>
  );
}
