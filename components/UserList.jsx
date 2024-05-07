"use client";

import ButtonGeneric from "./ButtonGeneric";
import { useState, useEffect } from 'react';
import UserCard from './UserCard';
import List from "./List";

export default function UserList({ accessToken, resourceId}) {
  const [type, setType] = useState("");
  const [roleId, setRoleId] = useState("");
  const [roleOptions, setRoleOptions] = useState([]);
  const [users, setUsers] = useState([]);
  const [userEmail, setUserEmail] = useState('');
  const [permissionToAddUser, setPermissionToAddUser] = useState(false);

  useEffect(() => {
    switch (type) {
        case 'role':
            setRoleOptions(['iotmanager', 'facilitymanager', 'admin']);
            break;
        case 'scope':
            setRoleOptions(['read', 'create', 'update', 'delete', 'listUsers', 'addUserPermission']);
            break;
        case 'deny_role':
            setRoleOptions(['iotmanager', 'facilitymanager', 'admin']);
            break;
        case 'deny_scope':
            setRoleOptions(['read', 'create', 'update', 'delete', 'listUsers', 'addUserPermission']);
            break;
        case 'deny':
            setRoleOptions([]);
            break;
        // Add more cases as needed
        default:
            setRoleOptions([]);
    }
  }, [type]);

  const getRoleUsers = async (e) => {
    e.preventDefault();
    try {
        const res = await fetch(`http://localhost:3000/api/resources/${resourceId}/${type}/${roleId}/users`, {
            method: "GET",
            headers: {
                "Authorization": `Bearer ${accessToken}`
            }
        });
        if (!res.ok) {
            throw new Error("Failed to submit request");
        }
        const data = await res.json();
        console.log("data: ", data);
        setUsers(data.users);
        setPermissionToAddUser(data.permission);
    } catch (error) {
        console.log(error);
    }
  };

  const addUser = async (event) => {
    event.preventDefault();
    try {
        const res = await fetch(`http://localhost:3000/api/resources/${resourceId}/${type}/${roleId}/users/${userEmail}`, { 
            method: "POST",
            headers: {
                "Authorization": `Bearer ${accessToken}`,
            }
        });
        setUserEmail('');
        getRoleUsers(event);
    } catch {
        console.log('error');
    }
    // Add user logic here
    console.log(userEmail);
  };

  return (
    <>
      <form onSubmit={getRoleUsers} className="mb-8">
          <select value={type} onChange={e => setType(e.target.value)} className="block w-1/2 py-2 px-4 rounded mb-4 bg-white shadow border border-gray-300 border-2">
              <option value="">Select Search Type</option>
              <option value="role">Search By Role</option>
              <option value="scope">Search By Scope</option>
              <option value="deny_role">Search By Denied Role</option>
              <option value="deny_scope">Search By Denied Scope</option>
              <option value="deny">Search By Denied Path</option>
          </select>
          <select value={roleId} onChange={e => setRoleId(e.target.value)} className="block w-1/2 py-2 px-4 rounded mb-4 bg-white shadow border border-gray-300 border-2">
              <option value="">Select Respective Identifier</option>
              {roleOptions.map((role, index) => (
                  <option key={index} value={role}>{role}</option>
              ))}
          </select>
          <ButtonGeneric title="List Users" className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded">
          </ButtonGeneric>
      </form>
        <List title="Users List">
            {users.map((user, index) => (
                    <UserCard key={index} user={user} />
            ))}
        </List>
        <br/>
        {permissionToAddUser && (
            <form onSubmit={addUser} className="mb-8">
                <input
                    type="text"
                    value={userEmail}
                    onChange={e => setUserEmail(e.target.value)}
                    className="block w-1/2 py-2 px-4 rounded mb-4 bg-white shadow border border-gray-300 border-2"
                    placeholder="Enter user email"
                />
                <ButtonGeneric title="Add User" className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded">
                </ButtonGeneric>
        </form>
        )}
    </>
  );
}