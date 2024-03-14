import TenantsList from "@/components/TenantList";
import { Adamina } from "next/font/google";
import AddTenant from "pages/addTenant/index";
import Login from "@/components/Login";
import Logout from "@/components/Logout";

const getTenants = async () => {
  try {
    const res = await fetch("http://localhost:3000/api/tenants", {
      cache: "no-store",
    });

    if (!res.ok) {
      throw new Error("Failed to fetch tenants");
    }

    const { tenants } = await res.json();

    console.log("Tenants: " + tenants);

    return {tenants: tenants};
  } catch (error) {
    console.log("Error loading tenants: ", error);
  }
  return [];
};

export const getServerSideProps = async (context) => {
  const {tenants} = await getTenants();

  console.log("TENANST PROPS: " + tenants);

  return { props: { tenants: tenants}};
};

export default function Home({tenants}) {
  return (
  <>
    <h1 className="font-bold text-4xl text-center">Tenants Page</h1>
    <br></br>
    <Login />
    <br></br>
    <Logout />
    <br></br>
    <AddTenant />
    <br/>
    <TenantsList tenants={tenants}/>
  </>
  );
}
