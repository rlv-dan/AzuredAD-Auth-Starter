using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Identity.Web.Resource;
using System.Security.Claims;

namespace API.Controllers;

[Authorize(Policy = "App")]
[ApiController]
public class DaemonController : ControllerBase
{
    private readonly ILogger<DaemonController> _logger;
    private readonly IConfiguration _config;

    public DaemonController(IConfiguration config, ILogger<DaemonController> logger)
    {
        _config = config;
        _logger = logger;
    }

    [Route("api/DaemonOnly")]
    [HttpGet]
    public string GetDaemonOnly()
    {
        return "Hello Daemon App!";
    }
}
