const axios = require('axios');
import { setAccessToken, getAccessToken } from './config';

// Keycloak configuration
const keycloakConfig = {
    realm: 'POC-DaeAuth',
    "auth-server-url": 'http://localhost:8080',
    resource: 'resource-server',
    credentials: {
      secret: 'tOfwQcsrXo1UFaKqzCFKwIOXqAizH94X'
    }
};

// Function to authenticate with Keycloak
async function authenticate() {
    try {
      const response = await axios.post(`${keycloakConfig["auth-server-url"]}/realms/${keycloakConfig.realm}/protocol/openid-connect/token`, new URLSearchParams({
        grant_type: 'client_credentials',
        client_id: keycloakConfig.resource,
        client_secret: keycloakConfig.credentials.secret
      }));
      
      setAccessToken(response.data.access_token); // Store the access token
    } catch (error) {
      console.error('Error authenticating with Keycloak:', error.message);
      throw error;
    }
}

//Create Tenant Resource Info
export async function createTenantResource(id, name, displayName) {
    try{
        let resourceType = "Tenant";
        let uris = ["/tenants"];
        let roles = {
            "iotmanager": ["read"],
            "facilitymanager": ["update"],
            "admin": ["read", "create", "update", "delete", "listUsers", "addUserPermission"]
          };
          let scopes = ["read", "create", "update", "delete", "listUsers", "addUserPermission"];

        await createClientAuthorizationResource(id, name, displayName, resourceType, uris, roles, scopes, null);
    }
    catch(error)
    {
        console.error('Error creating tenant resource:', error.message);
        throw error;
    }
}

//Create AssetGrou Resource Info
export async function createAssetGroupResource(id, name, displayName, parentId) {
    try{
        let resourceType = "AssetGroup";
        let uris = ["/assetgroups"];
        let roles = {
            "iotmanager": ["read"],
            "facilitymanager": ["update"],
            "admin": ["read", "create", "update", "delete", "listUsers", "addUserPermission"]
        };
        let scopes = ["read", "create", "update", "delete", "listUsers", "addUserPermission"];

        await createClientAuthorizationResource(id, name, displayName, resourceType, uris, roles, scopes, parentId);
    }
    catch(error)
    {
        console.error('Error creating tenant resource:', error.message);
        throw error;
    }
}

//Create Device Resource Info
export async function createDeviceResource(id, name, displayName, parentId) {
    try{
        let resourceType = "Device";
        let uris = ["/devices"];
        let roles = {
            "iotmanager": ["read"],
            "facilitymanager": ["update"],
            "admin": ["read", "create", "update", "delete", "listUsers", "addUserPermission"]
        };
        let scopes = ["read", "create", "update", "delete", "listUsers", "addUserPermission"];

        await createClientAuthorizationResource(id, name, displayName, resourceType, uris, roles, scopes, parentId);
    }
    catch(error)
    {
        console.error('Error creating tenant resource:', error.message);
        throw error;
    }
}

async function createClientAuthorizationResource(id, name, displayName, type, uris, roles, scopes, parentId) {
    await authenticate(); // Authenticate with Keycloak
    const token = getAccessToken(); // Get the stored access token

    if (!token) {
      console.error('Access token not found. Please authenticate first.');
      return;
    }
    try {
      let url = `${keycloakConfig["auth-server-url"]}/realms/${keycloakConfig.realm}/resource-server/${keycloakConfig.resource}/resource`;
      const response = await axios.post(url, 
        {
            id: id,
            name: name,
            displayName: displayName,
            type: type,
            uris: uris,
            roles: roles,
            scopes: scopes,
            parentId: parentId
        }, 
        {
            headers: {
                Authorization: `Bearer ${token}`
            }
        }
      );

      console.log('Client authorization resource created:', response.data);
      
    } catch (error) {
      console.error('Error creating client authorization resource:', error.message);
      throw error;
    }
}

export async function deleteClientAuthorizationResource(id) {
    await authenticate(); // Authenticate with Keycloak
    const token = getAccessToken(); // Get the stored access token

    if (!token) {
      console.error('Access token not found. Please authenticate first.');
      return;
    }
    try {
      let url = `${keycloakConfig["auth-server-url"]}/realms/${keycloakConfig.realm}/resource-server/${keycloakConfig.resource}/resource/${id}`;
      console.log('URL:', url);
      const response = await axios.delete(url, 
        {
            headers: {
                Authorization: `Bearer ${token}`
            }
        }
      );

      console.log('Client authorization resource deleted:', response.data);
      
    } catch (error) {
      console.error('Error deleting client authorization resource:', error.message);
      throw error;
    }
}

export async function updateClientAuthorizationResource(id, name, displayName) {
    await authenticate(); // Authenticate with Keycloak
    const token = getAccessToken(); // Get the stored access token

    if (!token) {
      console.error('Access token not found. Please authenticate first.');
      return;
    }
    try {
      let url = `${keycloakConfig["auth-server-url"]}/realms/${keycloakConfig.realm}/resource-server/${keycloakConfig.resource}/resource/${id}`;
      console.log('URL:', url);
      const response = await axios.put(url, 
        {
            id: id,
            name: name,
            displayName: displayName,
            scopes: [],
            roles: {},
            uris: []
        }, 
        {
            headers: {
                Authorization: `Bearer ${token}`
            }
        }
      );

      console.log('Client authorization resource updated:', response.data);
      
    } catch (error) {
      console.error('Error updating client authorization resource:', error.message);
      throw error;
    }
}

export async function getAuthorizationResource(id) {
    await authenticate(); // Authenticate with Keycloak
    const token = getAccessToken(); // Get the stored access token

    if (!token) {
      console.error('Access token not found. Please authenticate first.');
      return;
    }
    try {
      let url = `${keycloakConfig["auth-server-url"]}/realms/${keycloakConfig.realm}/resource-server/${keycloakConfig.resource}/resource/${id}`;
      const response = await axios.get(url, 
        {
            headers: {
                Authorization: `Bearer ${token}`
            }
        }
      );
      return response.data;
      
    } catch (error) {
      console.error('Error getting client authorization resource:', error.message);
      return error;
    }
}

export async function getUserResourcesByType(userAccesstoken, type){
    if (!userAccesstoken) {
      console.error('User Access token not found. Please authenticate first.');
      return;
    }
    try {
      let permission = { permission: `/${type}#read`, permission_resource_format: "uri", response_mode: "permissions" };
      let result = await getUserPermission(userAccesstoken, permission);
      console.log("RESPONSE DATA: ", result);

      return result;
      
    } catch (error) {
      console.error(`Error getting user resources by type: ${type}: `, error.message);
      return [];
    }
}

export async function getUserPermissionToCreateResource(userAccesstoken, resourceId, type) {
    if (!userAccesstoken) {
      console.error('User Access token not found. Please authenticate first.');
      return;
    }
    try {
      let permission = {};
      if(type === "root") {
        permission = { permission: `/${type}#create`, permission_resource_format: "uri", response_mode: "permissions" };
      }
      else {
        permission = { permission: `${resourceId}#create`, permission_resource_format: "", response_mode: "permissions" };
      }
      console.log("PERMISSION: ", permission)
      let result = await getUserPermission(userAccesstoken, permission);
      console.log("RESPONSE DATA: ", result);

      return result;
      
    } catch (error) {
      console.error('Error getting permission to create resources:', error.message);
      return [];
    }
}

export async function getUserPermissionToUpdateResource(userAccesstoken, resourceId) {
    if (!userAccesstoken) {
      console.error('User Access token not found. Please authenticate first.');
      return;
    }
    try {
      let permission = { permission: `${resourceId}#update`, permission_resource_format: "", response_mode: "permissions" };
      let result = await getUserPermission(userAccesstoken, permission);
      console.log("RESPONSE DATA: ", result);

      return result;
      
    } catch (error) {
      console.error('Error getting user permission to update resource:', error.message);
      return [];
    }
}

export async function getUserPermissionToDeleteResource(userAccesstoken, resourceId) {
    if (!userAccesstoken) {
      console.error('User Access token not found. Please authenticate first.');
      return;
    }
    try {
      let permission = { permission: `${resourceId}#delete`, permission_resource_format: "", response_mode: "permissions" };
      let result = await getUserPermission(userAccesstoken, permission);
      console.log("RESPONSE DATA: ", result);

      return response.data;
      
    } catch (error) {
      console.error('Error getting user permission to delete resource:', error.message);
      return [];
    }
}

export async function getUserPermissionToReadResource(userAccesstoken, resourceId) {
    if (!userAccesstoken) {
      console.error('User Access token not found. Please authenticate first.');
      return;
    }
    try {
      let permission = { permission: `${resourceId}#read`, permission_resource_format: "", response_mode: "permissions" };
      let result = await getUserPermission(userAccesstoken, permission);
      console.log("RESPONSE DATA: ", result);

      return result;
      
    } catch (error) {
      console.error('Error getting user permission to read resource:', error.message);
      return [];
    }
}

export async function getUserBulkPermissions(userAccesstoken, permissions) {
    if (!userAccesstoken) {
      console.error('User Access token not found. Please authenticate first.');
      return;
    }
    try {
      let url = `${keycloakConfig["auth-server-url"]}/realms/${keycloakConfig.realm}/resource-server/${keycloakConfig.resource}/permission/bulk`;
      const response = await axios.post(url,
        permissions,
        {
            headers: {
                Authorization: `${userAccesstoken}`,
                "Content-Type": "application/json"
            }
        }
      );
      return response.data;
      
    } catch (error) {
      console.error('Error getting user bulk permissions:', error.message);
      return [];
    }
}

export async function getUserPermission(userAccesstoken, permission) {
  if (!userAccesstoken) {
    console.error('User Access token not found. Please authenticate first.');
    return;
  }
  
  try {
    let url = `${keycloakConfig["auth-server-url"]}/realms/${keycloakConfig.realm}/resource-server/${keycloakConfig.resource}/permission`;
    const response = await axios.post(url,
      permission,
      {
          headers: {
              Authorization: `${userAccesstoken}`,
              "Content-Type": "application/json"
          }
      }
    );
    console.log("RESPONSE DATA: ", response.data);
    return response.data;
    
  } catch (error) {
      console.error('Error getting user permission:', error.message);
    return [];
  }
}

export async function getRoleUsers(resourceId, roleId, type) {
  await authenticate(); // Authenticate with Keycloak
  const token = getAccessToken(); // Get the stored access token

  if (!token) {
    console.error('Access token not found. Please authenticate first.');
    return;
  }

  try{
    let url = `${keycloakConfig["auth-server-url"]}/realms/${keycloakConfig.realm}/resource-server/${keycloakConfig.resource}/resource/${resourceId}/${type}/${roleId}/users`;
    console.log('URL:', url);
    const response = await axios.get(url,
      {
          headers: {
              Authorization: `Bearer ${token}`
          }
      }
    );
    return response.data;
  } catch (error) {
    console.error('Error getting role users:', error.message);
    return [];
  }
}

async function getUserByEmail(email) {
  await authenticate(); // Authenticate with Keycloak
  const token = getAccessToken(); // Get the stored access token

  if (!token) {
    console.error('Access token not found. Please authenticate first.');
    return;
  }

  try {
    let url = `${keycloakConfig["auth-server-url"]}/admin/realms/${keycloakConfig.realm}/users?email=${encodeURIComponent(email)}`;
    console.log('URL:', url);
    const response = await axios.get(url,
      {
          headers: {
              Authorization: `Bearer ${token}`
          }
      }
    );
    console.log('User obtained:', response.data);
    return response.data;
  } catch (error) {
    console.error('Error getting user:', error.message);
    return [];
  }
}

export async function addPermissionToUser(resourceId, userId, roleId, type) {
  await authenticate(); // Authenticate with Keycloak
  const token = getAccessToken(); // Get the stored access token

  if (!token) {
    console.error('Access token not found. Please authenticate first.');
    return;
  }

  try{
    let user = await getUserByEmail(userId);
    console.log('User:', user);
    userId = user[0].id;
    let url = `${keycloakConfig["auth-server-url"]}/realms/${keycloakConfig.realm}/resource-server/${keycloakConfig.resource}/user/${userId}/${type}/${roleId}/resource/${resourceId}`;
    console.log('URL:', url);
    const response = await axios.post(url, {},
      {
          headers: {
              Authorization: `Bearer ${token}`
          }
      }
    );
    console.log('Permission added to user:', response.data);
    return response.data;
  } catch (error) {
    console.error('Error adding permission to user:', error.message);
    return [];
  }
}

export async function addPermissionToUser_WithUserToken(resourceId, userId, roleId, type, userAccesstoken) {
  if (!userAccesstoken) {
    console.error('Access token not found. Please authenticate first.');
    return;
  }

  try{
    let user = await getUserByEmail(userId);
    userId = user[0].id;
    let url = `${keycloakConfig["auth-server-url"]}/realms/${keycloakConfig.realm}/resource-server/${keycloakConfig.resource}/user/${userId}/${type}/${roleId}/resource/${resourceId}`;
    console.log('URL:', url);
    const response = await axios.post(url, {},
      {
          headers: {
              Authorization: `${userAccesstoken}`
          }
      }
    );
    console.log('Permission added to user:', response.data);
    return response.data;
  } catch (error) {
    console.error('Error adding permission to user:', error.message);
    return [];
  }
}