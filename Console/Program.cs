using AutheticatedDaemon;
using Microsoft.Extensions.Configuration;
using Microsoft.Identity.Client;

var config = new ConfigurationBuilder()
     .SetBasePath(System.IO.Directory.GetCurrentDirectory())
     .AddJsonFile($"appsettings.json")
     .Build();

var app = ConfidentialClientApplicationBuilder
            .Create(config["AzureAD:ClientId"])
            .WithClientSecret(config["AzureAD:ClientSecret"])
            .WithAuthority(new Uri(config["AzureAD:Authority"]))
            .Build();

await API.Call(app, config);

await Graph.Call(app, config);