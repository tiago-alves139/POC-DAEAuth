"use client";

import ListCard from "./ListCard";
import List from "./List";
import { useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';

let auto = true;

export default function TenantsList({ tenants, accessToken }) {
  const router = useRouter();

  useEffect(() => {
    if (tenants.length === 1 && auto) {
      router.push(`editTenant/${tenants[0]._id}`);
      auto = false;
    }
  }, [tenants]);

  console.log("TENANTS: ", tenants);

  return (
      (tenants.length === 1 && auto) ? 
      (
        <div>LOADING ...</div> 
      ) :
      (
        <List title="Tenants List">
          {tenants.map((tenant) => (
            <ListCard id={tenant._id} title={tenant.title} description={tenant.description} accessToken={accessToken} 
                      editUrl={`editTenant/${tenant._id}`} deleteUrl={`api/tenants?id=${tenant._id}`} permissionToDelete={tenant.scopes.includes("delete")} 
            />
          ))}
        </List>
      )
  );
}
