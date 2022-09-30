import '../App.css';
import axios from 'axios';
import { useAccount, useMsal } from "@azure/msal-react";
import { useCallback, useState } from "react";

export interface IRequestButtonProps {
    title: string;
    endpoint: string;
    scopes: string[];
    printResult: (result: any) => string;
  }

export const RequestButton = (props: IRequestButtonProps) => {

    const { instance, accounts } = useMsal();
    const account = useAccount(accounts[0] || {});
    
    const [data, setData] = useState<string | null>(null);
    const [error, setError] = useState<string | null>(null);
    const [loading, setLoading] = useState(false);

    const requestData = useCallback(async (event: React.MouseEvent<HTMLButtonElement>) => {
        setError(null);
        setData(null);
        if (account) {
            setLoading(true);
            instance.acquireTokenSilent({
                scopes: props.scopes,
                account: account
            }).then((response) => {
                if(response) {
                    console.log("Got access token:", response);
                    axios.create({
                        headers: {'Authorization': `Bearer ${response.accessToken}`}
                    })
                    .get(props.endpoint)
                    .then(function (response) {
                        console.log("Request response:", response);
                        var result:string = props.printResult(response.data)
                        console.log("Processed result: " + result);
                        setData(result);
                    })
                    .catch(function (error) {
                        setError("Error fetching data: " + error.message);
                        console.error(error);
                    })
                    .then(function () {
                        // always executed
                        setLoading(false);
                    });
                } else {
                    setError("Empty token??");
                    console.error("no token acquired");
                }
            }).catch( error => {
                setError("Error getting token: " + error.message);
                console.error(error);
                setLoading(false);
            });
        } else {
            setError("No account...");
        }
    }, [props, instance, account]);

    return (
        <p>
            <button onClick={requestData}>{props.title}</button>
            { loading &&
                <span className="yellow output">Loading...</span>
            }
            { data &&
                <span className="green output">{data}</span>
            }
            { error &&
                <span className="red output">{error}</span>
            }
        </p>
    );
}
