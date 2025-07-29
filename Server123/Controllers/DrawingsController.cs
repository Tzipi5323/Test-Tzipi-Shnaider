using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Server.Data;
using Server.Models;

namespace Server.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    [Microsoft.AspNetCore.Authorization.Authorize]
    public class DrawingsController : ControllerBase
    {
        private readonly AppDbContext _context;
        private readonly ILogger<DrawingsController> _logger;

        public DrawingsController(AppDbContext context, ILogger<DrawingsController> logger)
        {
            _context = context;
            _logger = logger;
        }

        // שליפת כל הציורים של משתמש
        /// <summary>
        /// מחזיר את כל הציורים של משתמש מסוים.
        /// </summary>
        /// <param name="userId">מזהה המשתמש</param>
        /// <returns>רשימת ציורים של המשתמש</returns>
        /// <response code="200">הציורים נשלפו בהצלחה</response>
        /// <response code="404">לא נמצאו ציורים למשתמש</response>
        [HttpGet("user/{userId}")]
        public async Task<ActionResult<IEnumerable<Drawing>>> GetDrawingsByUser(string userId)
        {
            return await _context
                .Drawings.Include(d => d.Commands)
                .Where(d => d.UserId == userId)
                .ToListAsync();
        }

        // שליפת ציור בודד לפי מזהה
        /// <summary>
        /// מחזיר ציור בודד לפי מזהה.
        /// </summary>
        /// <param name="id">מזהה הציור</param>
        /// <returns>אובייקט ציור</returns>
        /// <response code="200">הציור נמצא</response>
        /// <response code="404">הציור לא נמצא</response>
        [HttpGet("{id}")]
        public async Task<ActionResult<Drawing>> GetDrawing(int id)
        {
            var drawing = await _context
                .Drawings.Include(d => d.Commands)
                .FirstOrDefaultAsync(d => d.Id == id);
            if (drawing == null)
                return NotFound();
            return drawing;
        }

        // יצירת ציור חדש
        /// <summary>
        /// יוצר ציור חדש עבור משתמש.
        /// </summary>
        /// <param name="drawing">אובייקט ציור עם שם, מזהה משתמש ופקודות.</param>
        /// <returns>הציור החדש שנוצר.</returns>
        /// <response code="201">הציור נוצר בהצלחה</response>
        /// <response code="400">נתונים לא תקינים או שם ציור כפול</response>
        [HttpPost]
        public async Task<ActionResult<Drawing>> CreateDrawing(Drawing drawing)
        {
            if (!ModelState.IsValid)
                return BadRequest(ModelState);

            // בדיקת ייחודיות שם ציור למשתמש
            bool nameExists = await _context.Drawings.AnyAsync(d =>
                d.UserId == drawing.UserId && d.Name == drawing.Name
            );
            if (nameExists)
            {
                _logger.LogWarning(
                    "Attempt to create duplicate drawing name '{DrawingName}' for user {UserId}",
                    drawing.Name,
                    drawing.UserId
                );
                return BadRequest(
                    $"A drawing with the name '{drawing.Name}' already exists for this user."
                );
            }

            _context.Drawings.Add(drawing);
            await _context.SaveChangesAsync();
            _logger.LogInformation(
                "Drawing created: {DrawingName} (ID: {DrawingId}) by user {UserId}",
                drawing.Name,
                drawing.Id,
                drawing.UserId
            );
            return CreatedAtAction(nameof(GetDrawing), new { id = drawing.Id }, drawing);
        }

        // עדכון ציור (כולל פקודות)
        /// <summary>
        /// מעדכן ציור קיים (כולל פקודות).
        /// </summary>
        /// <param name="id">מזהה הציור לעדכון</param>
        /// <param name="drawing">אובייקט ציור מעודכן</param>
        /// <response code="204">הציור עודכן בהצלחה</response>
        /// <response code="400">נתונים לא תקינים או מזהה לא תואם</response>
        /// <response code="404">הציור לא נמצא</response>
        [HttpPut("{id}")]
        public async Task<IActionResult> UpdateDrawing(int id, Drawing drawing)
        {
            if (id != drawing.Id)
                return BadRequest();
            _context.Entry(drawing).State = EntityState.Modified;
            await _context.SaveChangesAsync();
            _logger.LogInformation(
                "Drawing updated: {DrawingName} (ID: {DrawingId}) by user {UserId}",
                drawing.Name,
                drawing.Id,
                drawing.UserId
            );
            return NoContent();
        }

        // מחיקת ציור
        /// <summary>
        /// מוחק ציור לפי מזהה.
        /// </summary>
        /// <param name="id">מזהה הציור למחיקה</param>
        /// <response code="204">הציור נמחק בהצלחה</response>
        /// <response code="404">הציור לא נמצא</response>
        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteDrawing(int id)
        {
            var drawing = await _context.Drawings.FindAsync(id);
            if (drawing == null)
                return NotFound();
            _context.Drawings.Remove(drawing);
            await _context.SaveChangesAsync();
            _logger.LogInformation(
                "Drawing deleted: {DrawingName} (ID: {DrawingId}) by user {UserId}",
                drawing.Name,
                drawing.Id,
                drawing.UserId
            );
            return NoContent();
        }
    }
}
