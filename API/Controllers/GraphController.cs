using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Identity.Web.Resource;
using Microsoft.Graph;
using Microsoft.Identity.Web;

namespace API.Controllers
{
    [Authorize]
    [ApiController]
    [RequiredScope("AuthStarter.Client")]
    public class GraphController : Controller
    {
        private readonly ILogger<GraphController> _logger;
        private readonly GraphServiceClient _graphClient;

        public GraphController(ILogger<GraphController> logger, GraphServiceClient graphClient)
        {
            _logger = logger;
            _graphClient = graphClient;
        }

        [Route("api/GraphAppOnly")]
        [HttpGet]
        public async Task<ActionResult<string>> GraphAppOnly()
        {
            try
            {
                var users = await _graphClient.Users.Request().WithAppOnly().GetAsync();
                return Ok("Your tenant contains " + users.Count.ToString() + " users!");
            }
            catch (Exception ex)
            {
                return StatusCode(StatusCodes.Status500InternalServerError, "App Only Graph request failed: " + ex.InnerException?.Message);
            }
        }

        [Route("api/GraphDelegated")]
        [HttpGet]
        public async Task<ActionResult<string>> GraphDelegated()
        {
            try
            {
                // Graph Service Client reference: https://learn.microsoft.com/en-us/graph/sdks/create-requests
                var user = await _graphClient.Me.Request().Select(u => new { u.DisplayName, u.JobTitle }).GetAsync();
                return "Hello " + user.DisplayName + "!";
            }
            catch (Exception ex)
            {
                return StatusCode(StatusCodes.Status500InternalServerError, "Delegated Graph request failed: " + ex.InnerException?.Message);
            }
        }
    }
}
