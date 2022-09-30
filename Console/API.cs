using Microsoft.Extensions.Configuration;
using Microsoft.Identity.Client;
using System.Net.Http.Headers;

namespace AutheticatedDaemon
{
    internal class API
    {
        public static async Task Call(IConfidentialClientApplication app, IConfiguration config)
        {
            Console.WriteLine("Getting an access token for the API...");
            AuthenticationResult apiTokenResult = null;
            try
            {
                string[] ApiResourceIds = new string[] { config["API:Scope"] }; // We can have more than one ResourceId, (or scope), that we want to call hence we create a string array to cater for this
                apiTokenResult = await app.AcquireTokenForClient(ApiResourceIds).ExecuteAsync();
                Console.ForegroundColor = ConsoleColor.Green;
                Console.WriteLine("Token acquired! \n");
                Console.WriteLine(apiTokenResult.AccessToken + "\n");
                Console.ResetColor();
            }
            catch (MsalClientException ex)
            {
                Console.ForegroundColor = ConsoleColor.Red;
                Console.WriteLine("Error: " + ex.Message);
                Console.ResetColor();
            }

            if (!string.IsNullOrEmpty(apiTokenResult?.AccessToken))
            {
                Console.WriteLine("Calling the API...");

                var httpClient = new HttpClient();

                var defaultRequestHeaders = httpClient.DefaultRequestHeaders;
                if (defaultRequestHeaders.Accept == null || !defaultRequestHeaders.Accept.Any(m => m.MediaType == "application/json"))
                {
                    httpClient.DefaultRequestHeaders.Accept.Add(new MediaTypeWithQualityHeaderValue("application/json"));
                }

                defaultRequestHeaders.Authorization = new AuthenticationHeaderValue("bearer", apiTokenResult.AccessToken);

                try
                {
                    HttpResponseMessage response = await httpClient.GetAsync(config["API:ProtectedURL"]);
                    if (response.IsSuccessStatusCode)
                    {
                        string json = await response.Content.ReadAsStringAsync();
                        Console.ForegroundColor = ConsoleColor.Green;
                        Console.WriteLine(json);
                        Console.ResetColor();
                    }
                    else
                    {
                        Console.ForegroundColor = ConsoleColor.Red;
                        Console.WriteLine($"Failed to call the Web Api: {response.StatusCode}");
                        string content = await response.Content.ReadAsStringAsync();
                        Console.WriteLine($"Content: {content}");
                        Console.ResetColor();
                    }
                }
                catch (Exception ex)
                {
                    Console.ForegroundColor = ConsoleColor.Red;
                    Console.WriteLine($"Failed to call the Web Api: {ex.Message}");
                    Console.ResetColor();
                }
            }
        }
    }
}
