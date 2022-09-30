import { InteractionType } from "@azure/msal-browser";
import { useMsal } from "@azure/msal-react";
import authConfig from "../authConfig";

export const SignInButton = () => {
    const { instance } = useMsal();

    function handleLogin() {
        if(authConfig.loginMode === InteractionType.Redirect) {
            instance.loginRedirect({ scopes: []}).catch(e => {
                console.error("MSAL login error:", e);
            });    
        }
        if(authConfig.loginMode === InteractionType.Popup) {
            instance.loginPopup({ scopes: []}).then(response => {
                instance.setActiveAccount(response.account);
                console.log("MSAL logged in: ", response);
            }).catch(e => {
                console.error("MSAL login error:", e);
            });    
        }
    }

    return (
        <button onClick={handleLogin}>Sign In</button>
    );
}
