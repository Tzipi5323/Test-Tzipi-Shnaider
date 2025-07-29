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
        public async Task<IActionResult> GetDrawingCommands([FromBody] PromptRequest request)
        {
            if (string.IsNullOrWhiteSpace(request?.Prompt))
                return BadRequest("Prompt is required");

            // יש להכניס כאן את ה-API Key שלך
            var apiKey = "YOUR_OPENAI_API_KEY";
            var apiUrl = "https://api.openai.com/v1/chat/completions";

            var prompt =
                $@"המר את ההוראה הבאה לפקודות ציור בפורמט JSON. דוגמה לפקודה: [{{""type"":""circle"",""x"":100,""y"":100,""radius"":50,""color"":""yellow""}}]. הוראה: {request.Prompt}";

            using var http = new HttpClient();
            http.DefaultRequestHeaders.Add("Authorization", $"Bearer {apiKey}");

            var body = new
            {
                model = "gpt-3.5-turbo",
                messages = new[]
                {
                    new
                    {
                        role = "system",
                        content = "אתה ממיר הוראות ציור לפקודות JSON עבור קנבס ב-React. החזר רק מערך JSON של פקודות ציור.",
                    },
                    new { role = "user", content = prompt },
                },
                max_tokens = 500,
            };

            var content = new StringContent(
                System.Text.Json.JsonSerializer.Serialize(body),
                System.Text.Encoding.UTF8,
                "application/json"
            );
            var response = await http.PostAsync(apiUrl, content);
            if (!response.IsSuccessStatusCode)
                return StatusCode((int)response.StatusCode, "שגיאה מה-LLM");

            var json = await response.Content.ReadAsStringAsync();
            using var doc = System.Text.Json.JsonDocument.Parse(json);
            var result = doc
                .RootElement.GetProperty("choices")[0]
                .GetProperty("message")
                .GetProperty("content")
                .GetString();

            // מנסה להחזיר את הפלט כ-JSON
            try
            {
                var commands = System.Text.Json.JsonSerializer.Deserialize<object>(result!);
                return Ok(commands);
            }
            catch
            {
                return Ok(result);
            }
        }
    }

    public class PromptRequest
    {
        public string Prompt { get; set; } = string.Empty;
    }
}
