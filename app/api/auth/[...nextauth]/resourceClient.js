const axios = require('axios');
import { nullable } from 'zod';
import { setAccessToken, getAccessToken } from './config';

// Keycloak configuration
const keycloakConfig = {
    realm: 'POC-DaeAuth',
    "auth-server-url": 'http://localhost:8080',
    resource: 'resource-server',
    credentials: {
      secret: 'Ix187wO4vrSobRL8lXJJG4ELWu0KDaA9'
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
      
      console.log('Response Data: ', response.data);
      console.log('Authenticated with Keycloak: ', response.data.access_token);
      console.log("SetAccessToken: " + setAccessToken);
      
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
            "facilitymanager": ["write"]
        };
        let scopes = ["read", "write"];

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
        let uris = ["/tenants"];
        let roles = {
            "iotmanager": ["read"],
            "facilitymanager": ["write"]
        };
        let scopes = ["read", "write"];

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
        let uris = ["/tenants"];
        let roles = {
            "iotmanager": ["read"],
            "facilitymanager": ["write"]
        };
        let scopes = ["read", "write"];

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
    console.log('Access token:', token);

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
    console.log('Access token:', token);

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
    console.log('Access token:', token);

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

