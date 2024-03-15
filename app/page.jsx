import TenantsList from "@/components/TenantList";
import { Adamina } from "next/font/google";
import AddTenant from "./addTenant/page";
import Login from "@/components/Login";
import Logout from "@/components/Logout";
import { getServerSession } from 'next-auth'
import { authOptions } from './api/auth/[...nextauth]/route'

export default async function Home() {
  // const session = await getServerSession(authOptions);
  // console.log("AUTH OPTIONS: " + authOptions);
  // console.log(authOptions);
  // console.log("SESSION: " + session);

  // if (session) {
  return (
  <>
    <h1 className="font-bold text-4xl">Tenants Page</h1>
    <br></br>
    <AddTenant />
    <br/>
    <TenantsList />
  </>
  );
} 
//   else {
//     return (
//       <div>
//         <Login />
//       </div>
//     )
//   }
// }
