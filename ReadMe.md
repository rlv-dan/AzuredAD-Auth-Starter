# AzuredAD-Auth-Starter

Starter project for AzureAD authenticated communication with ASP.Net Core 6 API, React SPA and console app

Setting up authentication for a new project is important but can be a pain since all the pieces must fit together perfectly. I recently struggled with one of my projects, and for future reference I decided to create a starter project dealing with Azure AD authentication and authorization for a set of typical projects:

1.  ASP.Net Core 6 Web API (the server)
2.  React/Typescript SPA (single page application) (the client running in the browser)
3.  Standalone .Net 6 console application (e.g. a daemon or web job)

They all use Microsoft Authentication Library (MSAL) to acquire access tokens (bearer) from Azure AD to then connect to secured services. (It is important is to remember that different services require different tokens!)

-   The SPA logs the user in and then connects to the API, Microsoft Graph and SharePoint Online
-   The console app connects to the API and Graph using an app only context
-   The API accepts authenticated connections from these two. It also calls Microsoft Graph with an app only context as well as a delegated context in the the user's name

One of the trickiest part is to correctly setup your apps in Azure AD. Each project gets its own app registration. Besides only allowing authenticated users and apps, I use two security features of app registration to secure the API. First of all the API exposes different scopes that the other apps can consume. Then there are also app roles that further restricts access (RBAC) to different endpoints.

Here is how I registered the apps:

-   In Azure Active Directory, go to "**App registrations**"
    -   Register a new app called "AuthStarter API App":
        -   Select "Accounts in this organizational directory only (Single tenant)"
        -   When registered, find the "Application (client) ID" and copy it.
        -   Also find the "Directory (tenant) ID" and copy it
    -   Repeat this to register two more apps:
        -   "AuthStarter Client App"
        -   "AuthStarter Console App"
-   Edit the "**AuthStarter API App**":
    -   Go to "Certificates & secrets"
        -   Add a new Client Secret.
        -   When done, copy the "Value".
    -   Go to "API permissions"
        -   Add a permission: Microsoft Graph -> Delegated -> "Directory.Read.All Application"
        -   When added, click "Grant admin consent for [tenant]"
    -   Go to "Expose an API"
        -   Set the Application ID URI. Accept the default value "api://[clientid]"
        -   Click "Add a scope"
            -   We will add two scopes
            -   Name the scopes "AuthStarter.Daemon" and "AuthStarter.Client"
            -   Select "Admin only" under who can consent
        -   Click "Add a client application"
            -   We will add two applications. Recall the Client IDs from the other two apps we registered above
            -   First enter the client id for you "AuthStarter Client App" app and select the scope "api://[clientid]/AuthStarter.Client"
            -   Secondly, enter the client id for you "AuthStarter Console App" app and select the scope "api://[clientid]/AuthStarter.Daemon"
    -   Go to "App roles"
        -   Create three app roles:
            -   "AuthStarter.User" and "AuthStarter.Admin" with allowed member type set to "Users/Groups"
            -   "AuthStarter.Application" with allowed member type set to "Applications"
-   Edit the "**AuthStarter Client App**":
    -   Go to "Authentication"
        -   Click "Add a platform
            -   Select "Single-page application".
            -   Set the redirect URI to "http://localhost:3000"
        -   Further down select both "Access tokens (used for implicit flows)" and "ID tokens (used for implicit and hybrid flows)" and save.
    -   Go to "API permissions"
        -   Add a permission: Find "My APIs" and select "AuthStarter API". Select "Delegated" and then "AuthStarter.Client"
        -   Add a permission: Find SharePoint (delegated) and select Sites.Search.All
        -   Click "Grant admin consent for [tenant]"
-   Edit the "**AuthStarter Console App**":
    -   Go to "Certificates & secrets"
        -   Add a new Client Secret.
        -   When done, copy the "Value".
    -   Go to "API permissions"
        -   Remove "User.Read (delegated)"
        -   Add Microsoft Graph -> Application permissions -> "User.Read.All"
        -   Click "Grant admin consent for [tenant]"
-   Go back to Azure AD. Find "**Enterprise Applications**"
    -   (An "Enterprise Applications" is an instance of an app in the tenant. Apps that are multi tenant are registered in a single tenant but can have instances in many.)
    -   Open your "AuthStarter API App"
    -   Go to "Users and groups"
        -   Add a user of your choice. Select Admin as role
        -   Optionally add another user with User as role

Phew...

With the apps registered you can configure the projects using the ID's you copied in above steps. These are the relevant files:

-   API: appsettings.json
-   Client: authConfig.ts
-   Console: appsettings.json

Now, fingers crossed, you should now be able to run the samples! Good luck :-)

> PS: This is just a scaled down starter sample and does not always show best practice. Credentials are for example stored in the source code. Do not use in production as is or without understanding what you are doing.*
