import './App.css';
import { AuthenticatedTemplate, UnauthenticatedTemplate, useMsal, useIsAuthenticated, useAccount } from "@azure/msal-react";
import { SignInButton } from './components/SignInButton';
import { SignOutButton } from './components/SignOutButton';
import authConfig from './authConfig';
import { RequestButton } from './components/RequestButton';
import { MicrosoftGraphUser } from '@microsoft/microsoft-graph-types';
import { ISharePointJsonSearchResult } from './SharePointJsonSearchResult';

function App() {

  const isAuthenticated = useIsAuthenticated();
  
  const { instance } = useMsal();

  // ensure active account is set
  if (instance.getActiveAccount() == null && instance.getAllAccounts().length > 0) {
    const accounts = instance.getAllAccounts();
    instance.setActiveAccount(accounts[0]);
    console.log("MSAL accountInfo:", accounts[0])
  }
  
  const accountInfo = useAccount();
  
  return (
    <>
      { isAuthenticated ? 
        <header className='green'>
          <span>Logged in as {accountInfo?.name} &lt;{accountInfo?.username}&gt;</span>
          <span className='right'>
            <SignOutButton />
          </span>
        </header> 
        : 
        <header className='red'>
          <span>
            <SignInButton />
          </span>
        </header> 
      }
      <UnauthenticatedTemplate>
        <main>
          <p>Please log in</p>
        </main>
      </UnauthenticatedTemplate>
      <AuthenticatedTemplate>
        <main>
          <RequestButton title="MS GRAPH: Get my profile"
            endpoint={authConfig.graph.urls.getMe}
            scopes={authConfig.graph.scopes}
            printResult={(result: any) => {
              var user = result as MicrosoftGraphUser;
              console.log("Parsed into user profile: ", user);
              return(`Hello ${user.displayName}!`);
            }}/>
          <RequestButton title="API: Get my info"
            endpoint={authConfig.api.urls.getMe}
            scopes={authConfig.api.scopes}
            printResult={(result: any) => {
              return(result);
            }}/>
          <RequestButton title="API: Am I an admin?"
            endpoint={authConfig.api.urls.getIsAdmin}
            scopes={authConfig.api.scopes}
            printResult={(result: any) => {
              return(result);
            }}/>
          <RequestButton title="API: Get from admin only endpoint"
            endpoint={authConfig.api.urls.getAdminOnly}
            scopes={authConfig.api.scopes}
            printResult={(result: any) => {
              return(result);
            }}/>
          <RequestButton title="API: Get from app only (daemon) endpoint (should fail)"
            endpoint={authConfig.api.urls.getDaemonOnly}
            scopes={authConfig.api.scopes}
            printResult={(result: any) => {
              return(result);
            }}/>
          <RequestButton title="SHAREPOINT: Do a search"
            endpoint={authConfig.sharepoint.urls.search}
            scopes={authConfig.sharepoint.scopes}
            printResult={(result: any) => {
              const  searchResult = result as ISharePointJsonSearchResult;
              const titles = searchResult.PrimaryQueryResult.RelevantResults.Table.Rows.map(r => r.Cells.find(c => c.Key === "Title")?.Value).join(", ");
              return(`Search returned ${searchResult.PrimaryQueryResult.RelevantResults.RowCount} results: ${titles}`);
            }}/>
          <RequestButton title="API: Call MS Graph from backend (API context)"
            endpoint={authConfig.api.urls.getGraphAppOnly}
            scopes={authConfig.api.scopes}
            printResult={(result: any) => {
              return(result);
            }}/>
          <RequestButton title="API: Call MS Graph from backend (User delegated context)"
            endpoint={authConfig.api.urls.getGraphDelegated}
            scopes={authConfig.api.scopes}
            printResult={(result: any) => {
              return(result);
            }}/>
        </main>
      </AuthenticatedTemplate>
    </>
  );
}

export default App;
