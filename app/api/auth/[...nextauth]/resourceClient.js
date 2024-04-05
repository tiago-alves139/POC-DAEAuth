const axios = require('axios');
import { setAccessToken, getAccessToken } from './config';

// Keycloak configuration
const keycloakConfig = {
    realm: 'POC-DaeAuth',
    "auth-server-url": 'http://localhost:8080',
    resource: 'resource-server',
    credentials: {
      secret: 'tbt1YwUnJD4iGEp2kFEj62oe55LoA1Vs'
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
            "facilitymanager": ["update"]
        };
        let scopes = ["read", "create", "update", "delete"];

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
            "facilitymanager": ["update"]
        };
        let scopes = ["read", "create", "update", "delete"];

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
            "facilitymanager": ["update"]
        };
        let scopes = ["read", "create", "update", "delete"];

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
      console.log('URL:', url);
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
      let url = `${keycloakConfig["auth-server-url"]}/realms/${keycloakConfig.realm}/protocol/openid-connect/token`;
      const response = await axios.post(url,
        {
          audience: 'resource-server',
          permission_resource_format: 'uri',
          grant_type: 'urn:ietf:params:oauth:grant-type:uma-ticket',
          permission: `/${type}#read`,
          response_mode: 'permissions'
        },
        {
            headers: {
                Authorization: `${userAccesstoken}`,
                "Content-Type": "application/x-www-form-urlencoded"
            }
        }
      );
      return response.data;
      
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
      let url = `${keycloakConfig["auth-server-url"]}/realms/${keycloakConfig.realm}/protocol/openid-connect/token`;
      let body = {};
      if(type === "root") {
        body = {
          audience: 'resource-server',
          permission_resource_format: 'uri',
          grant_type: 'urn:ietf:params:oauth:grant-type:uma-ticket',
          permission: `/${type}#create`,
          response_mode: 'permissions'
        }
      }
      else {
        body = {
          audience: 'resource-server',
          grant_type: 'urn:ietf:params:oauth:grant-type:uma-ticket',
          permission: `${resourceId}#create`,
          response_mode: 'permissions'
        }
      }
      const response = await axios.post(url,
        body,
        {
            headers: {
                Authorization: `${userAccesstoken}`,
                "Content-Type": "application/x-www-form-urlencoded"
            }
        }
      );
      return response.data;
      
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
      let url = `${keycloakConfig["auth-server-url"]}/realms/${keycloakConfig.realm}/protocol/openid-connect/token`;
      const response = await axios.post(url,
        {
          audience: 'resource-server',
          grant_type: 'urn:ietf:params:oauth:grant-type:uma-ticket',
          permission: `${resourceId}#update`,
          response_mode: 'permissions'
        },
        {
            headers: {
                Authorization: `${userAccesstoken}`,
                "Content-Type": "application/x-www-form-urlencoded"
            }
        }
      );
      console.log("RESPONSE DATA: ", response.data);
      return response.data;
      
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
      let url = `${keycloakConfig["auth-server-url"]}/realms/${keycloakConfig.realm}/protocol/openid-connect/token`;
      const response = await axios.post(url,
        {
          audience: 'resource-server',
          grant_type: 'urn:ietf:params:oauth:grant-type:uma-ticket',
          permission: `${resourceId}#delete`,
          response_mode: 'permissions'
        },
        {
            headers: {
                Authorization: `${userAccesstoken}`,
                "Content-Type": "application/x-www-form-urlencoded"
            }
        }
      );
      console.log("RESPONSE DATA: ", response.data);
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
      let url = `${keycloakConfig["auth-server-url"]}/realms/${keycloakConfig.realm}/protocol/openid-connect/token`;
      const response = await axios.post(url,
        {
          audience: 'resource-server',
          grant_type: 'urn:ietf:params:oauth:grant-type:uma-ticket',
          permission: `${resourceId}#read`,
          response_mode: 'permissions'
        },
        {
            headers: {
                Authorization: `${userAccesstoken}`,
                "Content-Type": "application/x-www-form-urlencoded"
            }
        }
      );
      console.log("RESPONSE DATA: ", response.data);
      return response.data;
      
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
    return response.data;
    
  } catch (error) {
    console.log('Error:', error);
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