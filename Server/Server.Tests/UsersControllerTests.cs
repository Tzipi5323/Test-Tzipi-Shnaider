using System.Threading.Tasks;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Logging;
using Moq;
using Server.Controllers;
using Server.Data;
using Server.Models;
using Xunit;

namespace Server.Tests
{
    public class UsersControllerTests
    {
        private DbContextOptions<AppDbContext> GetInMemoryOptions(string dbName) =>
            new DbContextOptionsBuilder<AppDbContext>().UseInMemoryDatabase(dbName).Options;

        [Fact]
        public async Task RegisterUser_ReturnsCreatedAtAction()
        {
            // Arrange
            var options = GetInMemoryOptions("RegisterUserDb");
            using var context = new AppDbContext(options);
            var logger = new Mock<ILogger<UsersController>>();
            var controller = new UsersController(context, logger.Object);
            var user = new AppUser { Id = "user1", UserName = "test" };

            // Act
            var result = await controller.CreateUser(user);

            // Assert
            var createdResult = Assert.IsType<CreatedAtActionResult>(result.Result);
            var returnedUser = Assert.IsType<AppUser>(createdResult.Value);
            Assert.Equal("user1", returnedUser.Id);
        }

        [Fact]
        public async Task RegisterUser_ReturnsBadRequest_WhenDuplicate()
        {
            // Arrange
            var options = GetInMemoryOptions("DuplicateUserDb");
            using var context = new AppDbContext(options);
            context.Users.Add(new AppUser { Id = "user1", UserName = "test" });
            context.SaveChanges();
            var logger = new Mock<ILogger<UsersController>>();
            var controller = new UsersController(context, logger.Object);
            var user = new AppUser { Id = "user1", UserName = "test" };

            // Act
            var result = await controller.CreateUser(user);

            // Assert
            Assert.IsType<BadRequestObjectResult>(result.Result);
        }
    }
}
