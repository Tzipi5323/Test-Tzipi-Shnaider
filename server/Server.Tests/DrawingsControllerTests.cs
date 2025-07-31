using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Logging;
using Moq;
using Server.Controllers;
using Server.Data;
using Server.Models;

namespace Server.Tests
{
    public class DrawingsControllerTests
    {
        private DbContextOptions<AppDbContext> GetInMemoryOptions(string dbName) =>
            new DbContextOptionsBuilder<AppDbContext>().UseInMemoryDatabase(dbName).Options;

        [Fact]
        public async Task GetDrawingsByUser_ReturnsUserDrawings()
        {
            // Arrange
            var options = GetInMemoryOptions("GetDrawingsDb");
            using var context = new AppDbContext(options);
            context.Drawings.AddRange(
                new Drawing
                {
                    Id = 1,
                    Name = "Test1",
                    UserId = "user1",
                },
                new Drawing
                {
                    Id = 2,
                    Name = "Test2",
                    UserId = "user2",
                }
            );
            context.SaveChanges();
            var logger = new Mock<ILogger<DrawingsController>>();
            var controller = new DrawingsController(context, logger.Object);

            // Act
            var result = await controller.GetDrawingsByUser("user1");

            // Assert
            var okResult = Assert.IsType<ActionResult<IEnumerable<Drawing>>>(result);
            Assert.NotNull(okResult.Value);
            Assert.Single(okResult.Value);
            Assert.Equal("user1", okResult.Value.First().UserId);
        }

        [Fact]
        public async Task CreateDrawing_ReturnsCreatedAtAction()
        {
            // Arrange
            var options = GetInMemoryOptions("AddDrawingDb");
            using var context = new AppDbContext(options);
            var logger = new Mock<ILogger<DrawingsController>>();
            var controller = new DrawingsController(context, logger.Object);
            var drawing = new Drawing { Name = "New Drawing", UserId = "user1" };

            // Act
            var result = await controller.CreateDrawing(drawing);

            // Assert
            var createdResult = Assert.IsType<CreatedAtActionResult>(result.Result);
            var returnedDrawing = Assert.IsType<Drawing>(createdResult.Value);
            Assert.Equal("New Drawing", returnedDrawing.Name);
        }

        [Fact]
        public async Task DeleteDrawing_RemovesDrawing()
        {
            // Arrange
            var options = GetInMemoryOptions("DeleteDrawingDb");
            using var context = new AppDbContext(options);
            context.Drawings.Add(
                new Drawing
                {
                    Id = 1,
                    Name = "ToDelete",
                    UserId = "user1",
                }
            );
            context.SaveChanges();
            var logger = new Mock<ILogger<DrawingsController>>();
            var controller = new DrawingsController(context, logger.Object);

            // Act
            var result = await controller.DeleteDrawing(1);

            // Assert
            Assert.IsType<NoContentResult>(result);
            Assert.Empty(context.Drawings);
        }

        [Fact]
        public async Task GetDrawing_ReturnsNotFound_WhenNotExists()
        {
            // Arrange
            var options = GetInMemoryOptions("NotFoundDb");
            using var context = new AppDbContext(options);
            var logger = new Mock<ILogger<DrawingsController>>();
            var controller = new DrawingsController(context, logger.Object);

            // Act
            var result = await controller.GetDrawing(999);

            // Assert
            Assert.IsType<NotFoundResult>(result.Result);
        }
    }
}
