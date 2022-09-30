using Microsoft.Extensions.Configuration;
using Microsoft.Graph;
using Microsoft.Identity.Client;
using System.Net.Http.Headers;

namespace AutheticatedDaemon
{
    internal class Graph
    {
        public static async Task Call(IConfidentialClientApplication app, IConfiguration config)
        {
            Console.WriteLine("Calling Graph...");

            try
            {
                GraphServiceClient graphServiceClient = new GraphServiceClient("https://graph.microsoft.com/V1.0/", new DelegateAuthenticationProvider(async (requestMessage) =>
                {
                    // With client credentials flows the scopes is ALWAYS of the shape "resource/.default", as the application permissions need to be set statically (in the portal or by PowerShell), and then granted by a tenant administrator.
                    var scopes = new string[] { "https://graph.microsoft.com/.default" };

                    AuthenticationResult result = await app.AcquireTokenForClient(scopes).ExecuteAsync();

                    // Add the access token in the Authorization header of the API request.
                    requestMessage.Headers.Authorization = new AuthenticationHeaderValue("Bearer", result.AccessToken);
                }));

                IGraphServiceUsersCollectionPage users = await graphServiceClient.Users.Request().GetAsync();
                Console.ForegroundColor = ConsoleColor.Green;
                Console.WriteLine($"Found {users.Count()} users in the tenant");
                Console.ResetColor();
            }
            catch (ServiceException ex)
            {
                Console.ForegroundColor = ConsoleColor.Red;
                Console.WriteLine("Error: " + ex.Message);
                Console.ResetColor();
            }
        }
    }
}
