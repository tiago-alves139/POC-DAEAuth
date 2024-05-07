import TenantsList from "@/components/TenantList";
import { Adamina } from "next/font/google";
import AddTenant from "./addTenant/page";
import Login from "@/components/Login";
import Logout from "@/components/Logout";
import { getServerSession } from 'next-auth'
import { authOptions } from './api/auth/[...nextauth]/route'

const getTenants = async (accessToken) => {
  try {
    const res = await fetch("http://localhost:3000/api/tenants", {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
      cache: "no-store",
      credentials: "include"
    });

    if (!res.ok) {
      throw new Error("Failed to fetch tenants");
    }

    return res.json();
  } catch (error) {
    console.log("Error loading tenants: ", error);
  }
};

export default async function Home() {
  const session = await getServerSession(authOptions);
  const { result } = await getTenants(session.accessToken);
  const tenants = result.tenants;
  console.log("Tenants: ", tenants);
  console.log("Permission TO CREATE TENANTS: ", result.permissionCreateTenants);

  return (
  <>
    <h1 className="font-bold text-4xl">Tenants Page</h1>
    <br></br>
    {result.permissionCreateTenants && <AddTenant accessToken={session.accessToken}/>}
    <br/>
    <TenantsList tenants={tenants} accessToken={session.accessToken}/>
  </>
  );
}