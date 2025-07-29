using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace Server.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    [Authorize]
    public class LlmController : ControllerBase
    {
        /// <summary>
        /// מקבל פרומפט טקסטואלי ומחזיר JSON של פקודות ציור (LLM).
        /// </summary>
        /// <param name="prompt">הפרומפט הטקסטואלי</param>
        /// <returns>JSON של פקודות ציור</returns>
        /// <response code="200">הפקודות נוצרו בהצלחה</response>
        /// <response code="400">פרומפט לא תקין</response>
        [HttpPost("draw")]
        public IActionResult GetDrawingCommands([FromBody] PromptRequest request)
        {
            if (string.IsNullOrWhiteSpace(request?.Prompt))
                return BadRequest("Prompt is required");

            // כאן תוכל לממש קריאה ל-LLM אמיתי בעתיד
            return Ok();
        }
    }

    public class PromptRequest
    {
        public string Prompt { get; set; } = string.Empty;
    }
}
