using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Server.Data;
using Server.Models;

namespace Server.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class DrawingCommandsController : ControllerBase
    {
        private readonly AppDbContext _context;
        private readonly ILogger<DrawingCommandsController> _logger;

        public DrawingCommandsController(
            AppDbContext context,
            ILogger<DrawingCommandsController> logger
        )
        {
            _context = context;
            _logger = logger;
        }

        // הוספת פקודת ציור חדשה
        /// <summary>
        /// מוסיף פקודת ציור חדשה לציור.
        /// </summary>
        /// <param name="command">אובייקט פקודת ציור</param>
        /// <returns>הפקודה החדשה שנוצרה</returns>
        /// <response code="201">הפקודה נוספה בהצלחה</response>
        /// <response code="400">נתונים לא תקינים</response>
        [HttpPost]
        public async Task<ActionResult<DrawingCommand>> AddCommand(DrawingCommand command)
        {
            _context.DrawingCommands.Add(command);
            await _context.SaveChangesAsync();
            _logger.LogInformation(
                "Drawing command added: CommandId={CommandId}, DrawingId={DrawingId}",
                command.Id,
                command.DrawingId
            );
            return CreatedAtAction(nameof(GetCommand), new { id = command.Id }, command);
        }

        // שליפת כל הפקודות של ציור
        /// <summary>
        /// מחזיר את כל פקודות הציור של ציור מסוים.
        /// </summary>
        /// <param name="drawingId">מזהה הציור</param>
        /// <returns>רשימת פקודות ציור</returns>
        /// <response code="200">הפקודות נשלפו בהצלחה</response>
        /// <response code="404">לא נמצאו פקודות לציור</response>
        [HttpGet("drawing/{drawingId}")]
        public async Task<ActionResult<IEnumerable<DrawingCommand>>> GetCommandsForDrawing(
            int drawingId
        )
        {
            return await _context
                .DrawingCommands.Where(c => c.DrawingId == drawingId)
                .OrderBy(c => c.Id)
                .ToListAsync();
        }

        // מחיקת הפקודה האחרונה (Undo)
        /// <summary>
        /// מבצע Undo (מחיקת פקודת הציור האחרונה) עבור ציור.
        /// </summary>
        /// <param name="drawingId">מזהה הציור</param>
        /// <response code="204">בוצע Undo בהצלחה</response>
        /// <response code="404">לא נמצאו פקודות לציור</response>
        [HttpDelete("undo/{drawingId}")]
        public async Task<IActionResult> UndoLastCommand(int drawingId)
        {
            var lastCommand = await _context
                .DrawingCommands.Where(c => c.DrawingId == drawingId)
                .OrderByDescending(c => c.Id)
                .FirstOrDefaultAsync();
            if (lastCommand == null)
                return NotFound("No commands to undo.");

            // שמור את הפקודה שנמחקה בטבלת Redo
            var redo = new RedoDrawingCommand
            {
                DrawingId = lastCommand.DrawingId,
                CommandJson = lastCommand.CommandJson,
            };
            _context.RedoDrawingCommands.Add(redo);
            _context.DrawingCommands.Remove(lastCommand);
            await _context.SaveChangesAsync();
            _logger.LogInformation(
                "Undo command: CommandId={CommandId}, DrawingId={DrawingId}",
                lastCommand.Id,
                lastCommand.DrawingId
            );
            return NoContent();
        }

        /// <summary>
        /// מבצע Redo (החזרת פקודת הציור האחרונה שבוטלה) עבור ציור.
        /// </summary>
        /// <param name="drawingId">מזהה הציור</param>
        /// <response code="204">בוצע Redo בהצלחה</response>
        /// <response code="404">לא נמצאו פקודות לביצוע Redo</response>
        [HttpPost("redo/{drawingId}")]
        public async Task<IActionResult> RedoLastCommand(int drawingId)
        {
            var lastRedo = await _context
                .RedoDrawingCommands.Where(r => r.DrawingId == drawingId)
                .OrderByDescending(r => r.Id)
                .FirstOrDefaultAsync();
            if (lastRedo == null)
                return NotFound("No commands to redo.");

            var command = new DrawingCommand
            {
                DrawingId = lastRedo.DrawingId,
                CommandJson = lastRedo.CommandJson,
            };
            _context.DrawingCommands.Add(command);
            _context.RedoDrawingCommands.Remove(lastRedo);
            await _context.SaveChangesAsync();
            _logger.LogInformation("Redo command: DrawingId={DrawingId}", command.DrawingId);
            return NoContent();
        }

        // (אופציונלי) החזרת פקודה שבוטלה (Redo) - דורש לוגיקה נוספת אם רוצים לשמור "פקודות שבוטלו"
        // כאן לא מיושם Redo מלא, כי לרוב הוא מנוהל בצד לקוח או דורש טבלת היסטוריה נוספת

        // שליפת פקודה בודדת
        /// <summary>
        /// מחזיר פקודת ציור בודדת לפי מזהה.
        /// </summary>
        /// <param name="id">מזהה הפקודה</param>
        /// <returns>אובייקט פקודת ציור</returns>
        /// <response code="200">הפקודה נמצאה</response>
        /// <response code="404">הפקודה לא נמצאה</response>
        [HttpGet("{id}")]
        public async Task<ActionResult<DrawingCommand>> GetCommand(int id)
        {
            var command = await _context.DrawingCommands.FindAsync(id);
            if (command == null)
                return NotFound();
            return command;
        }
    }
}
