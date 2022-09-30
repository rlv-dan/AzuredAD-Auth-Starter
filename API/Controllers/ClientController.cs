using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Identity.Web.Resource;
using System.Security.Claims;

namespace API.Controllers;

[Authorize]
[ApiController]
[RequiredScope("AuthStarter.Client")]
public class ClientController : ControllerBase
{
    private readonly ILogger<ClientController> _logger;
    private readonly IConfiguration _config;

    public ClientController(IConfiguration config, ILogger<ClientController> logger)
    {
        _config = config;
        _logger = logger;
    }

    [Route("api/Me")]
    [HttpGet]
    public string GetUser()
    {
        return "Hello authenticated user! You UPN is: " + User.FindFirst(ClaimTypes.Upn)?.Value;
    }

    [Route("api/IsAdmin")]
    [HttpGet]
    public string IsAdmin()
    {
        return User.IsInRole(_config["Roles:Admin"]) ? "You are an admin!" : "You are not an admin...";
    }

    [Route("api/AdminOnly")]
    [HttpGet]
    [Authorize(Policy = "Admin")]
    public string GetAdminOnly()
    {
        return "Welcome ADMIN!";
    }

}
