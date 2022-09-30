import { InteractionType } from "@azure/msal-browser";
import { useMsal } from "@azure/msal-react";
import authConfig from "../authConfig";

export const SignOutButton = () => {
    const { instance } = useMsal();

    function handleLogin() {
        if(authConfig.loginMode === InteractionType.Redirect) {
            instance.logoutRedirect().catch(e => {
                console.error(e);
            });    
        } else if(authConfig.loginMode === InteractionType.Popup) {
            instance.logoutPopup().catch(e => {
                console.error(e);
            });    
        }
    }

    return (
        <button onClick={handleLogin}>Sign Out</button>
    );
}
