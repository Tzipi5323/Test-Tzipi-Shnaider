using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Text;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Microsoft.IdentityModel.Tokens;
using Server.Data;
using Server.Models;

namespace Server.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class UsersController : ControllerBase
    {
        private readonly AppDbContext _context;
        private readonly ILogger<UsersController> _logger;

        public UsersController(AppDbContext context, ILogger<UsersController> logger)
        {
            _context = context;
            _logger = logger;
        }

        public class LoginRequest
        {
            public string UserName { get; set; } = string.Empty;
            public string Password { get; set; } = string.Empty;
        }

        // התחברות משתמש והנפקת טוקן JWT
        /// <summary>
        /// מבצע התחברות ומחזיר טוקן JWT אם המשתמש קיים.
        /// </summary>
        /// <param name="loginRequest">אובייקט עם שם משתמש וסיסמה</param>
        /// <returns>טוקן JWT</returns>
        /// <response code="200">התחברות הצליחה</response>
        /// <response code="401">שם משתמש או סיסמה שגויים</response>
        [HttpPost("login")]
        [Microsoft.AspNetCore.Authorization.AllowAnonymous]
        public async Task<IActionResult> Login([FromBody] LoginRequest loginRequest)
        {
            var user = await _context.Users.FirstOrDefaultAsync(u =>
                u.UserName == loginRequest.UserName
            );
            if (user == null)
            {
                _logger.LogWarning(
                    "Login attempt failed for user: {UserName}",
                    loginRequest.UserName
                );
                return Unauthorized("שם משתמש או סיסמה שגויים");
            }

            _logger.LogInformation("User {UserName} logged in successfully", user.UserName);

            var jwtKey = "SuperSecretKey12345!"; // אותו מפתח כמו ב-Program.cs
            var tokenHandler = new JwtSecurityTokenHandler();
            var key = Encoding.UTF8.GetBytes(jwtKey);
            var tokenDescriptor = new SecurityTokenDescriptor
            {
                Subject = new ClaimsIdentity(
                    new[]
                    {
                        new Claim(ClaimTypes.Name, user.UserName),
                        new Claim(ClaimTypes.NameIdentifier, user.Id),
                    }
                ),
                Expires = DateTime.UtcNow.AddHours(2),
                SigningCredentials = new SigningCredentials(
                    new SymmetricSecurityKey(key),
                    SecurityAlgorithms.HmacSha256Signature
                ),
            };
            var token = tokenHandler.CreateToken(tokenDescriptor);
            var tokenString = tokenHandler.WriteToken(token);
            return Ok(new { token = tokenString });
        }

        // שליפת כל המשתמשים
        /// <summary>
        /// מחזיר את כל המשתמשים במערכת.
        /// </summary>
        /// <returns>רשימת משתמשים</returns>
        /// <response code="200">המשתמשים נשלפו בהצלחה</response>
        [HttpGet]
        public async Task<ActionResult<IEnumerable<AppUser>>> GetUsers()
        {
            return await _context.Users.ToListAsync();
        }

        // שליפת משתמש בודד לפי מזהה
        /// <summary>
        /// מחזיר משתמש בודד לפי מזהה.
        /// </summary>
        /// <param name="id">מזהה המשתמש</param>
        /// <returns>אובייקט משתמש</returns>
        /// <response code="200">המשתמש נמצא</response>
        /// <response code="404">המשתמש לא נמצא</response>
        [HttpGet("{id}")]
        public async Task<ActionResult<AppUser>> GetUser(string id)
        {
            var user = await _context.Users.FindAsync(id);
            if (user == null)
                return NotFound();
            return user;
        }

        // יצירת משתמש חדש
        /// <summary>
        /// יוצר משתמש חדש במערכת.
        /// </summary>
        /// <param name="user">אובייקט משתמש ליצירה</param>
        /// <returns>המשתמש החדש שנוצר</returns>
        /// <response code="201">המשתמש נוצר בהצלחה</response>
        /// <response code="400">נתונים לא תקינים</response>
        [HttpPost]
        public async Task<ActionResult<AppUser>> CreateUser(AppUser user)
        {
            _context.Users.Add(user);
            await _context.SaveChangesAsync();
            _logger.LogInformation(
                "New user created: {UserName} (ID: {UserId})",
                user.UserName,
                user.Id
            );
            return CreatedAtAction(nameof(GetUser), new { id = user.Id }, user);
        }
    }
}
