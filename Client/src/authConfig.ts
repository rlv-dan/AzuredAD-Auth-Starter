import { Configuration, InteractionType } from "@azure/msal-browser";

// MSAL Configuration: https://github.com/AzureAD/microsoft-authentication-library-for-js/blob/dev/lib/msal-browser/docs/configuration.md
const msalConfig: Configuration = {
    auth: {
        clientId: "[SPA AZURE APP CLIENT ID GUID]",
        authority: "https://login.microsoftonline.com/[AZURE TENANT ID GUID]/", // This is a URL (e.g. https://login.microsoftonline.com/{your tenant ID})
        redirectUri: "http://localhost:3000"
    },
    cache: {
        cacheLocation: "sessionStorage", // This configures where your cache will be stored
        storeAuthStateInCookie: false, // Set this to "true" if you are having issues on IE11 or Edge
    }
};

const graphConfig = {
    scopes: [
        "User.Read"
    ],
    urls: {
        getMe: "https://graph.microsoft.com/v1.0/me"
    }
}

const apiConfig = {
    scopes: [
        "api://[API AZURE APP CLIENT ID]/AuthStarter.Client"
    ],
    urls: {
        getMe: "https://localhost:7114/api/Me",
        getIsAdmin: "https://localhost:7114/api/IsAdmin",
        getAdminOnly: "https://localhost:7114/api/AdminOnly",
        getDaemonOnly: "https://localhost:7114/api/DaemonOnly",
        getGraphAppOnly: "https://localhost:7114/api/GraphAppOnly",
        getGraphDelegated: "https://localhost:7114/api/GraphDelegated",
    }
}

const sharepointConfig = {
    scopes: [
        "https://81ys3y.sharepoint.com/Sites.Search.All"
    ],
    urls: {
        search: "https://81ys3y.sharepoint.com/_api/search/query?querytext=%27sharepoint%27&rowLimit=3",
    }
}

const loginMode = InteractionType.Redirect;    // Redirect or Popup

const authConfig = {
    msal: msalConfig,
    graph: graphConfig,
    sharepoint: sharepointConfig,
    api: apiConfig,
    loginMode: loginMode
}
export default authConfig;
