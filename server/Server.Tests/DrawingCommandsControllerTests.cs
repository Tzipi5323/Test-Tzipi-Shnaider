using System.Collections.Generic;
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
    public class DrawingCommandsControllerTests
    {
        private DbContextOptions<AppDbContext> GetInMemoryOptions(string dbName) =>
            new DbContextOptionsBuilder<AppDbContext>().UseInMemoryDatabase(dbName).Options;

        [Fact]
        public async Task AddCommand_ReturnsCreatedAtAction()
        {
            // Arrange
            var options = GetInMemoryOptions("AddCommandDb");
            using var context = new AppDbContext(options);
            context.Drawings.Add(
                new Drawing
                {
                    Id = 1,
                    Name = "Test",
                    UserId = "user1",
                }
            );
            context.SaveChanges();
            var logger = new Mock<ILogger<DrawingCommandsController>>();
            var controller = new DrawingCommandsController(context, logger.Object);
            var command = new DrawingCommand { DrawingId = 1, CommandJson = "{\"type\":\"line\"}" };

            // Act
            var result = await controller.AddCommand(command);

            // Assert
            var createdResult = Assert.IsType<CreatedAtActionResult>(result.Result);
            var returnedCommand = Assert.IsType<DrawingCommand>(createdResult.Value);
            Assert.Equal(1, returnedCommand.DrawingId);
        }

        [Fact]
        public async Task UndoLastCommand_RemovesCommand()
        {
            // Arrange
            var options = GetInMemoryOptions("UndoCommandDb");
            using var context = new AppDbContext(options);
            context.Drawings.Add(
                new Drawing
                {
                    Id = 1,
                    Name = "Test",
                    UserId = "user1",
                }
            );
            context.DrawingCommands.Add(
                new DrawingCommand
                {
                    Id = 1,
                    DrawingId = 1,
                    CommandJson = "{\"type\":\"line\"}",
                }
            );
            context.SaveChanges();
            var logger = new Mock<ILogger<DrawingCommandsController>>();
            var controller = new DrawingCommandsController(context, logger.Object);

            // Act
            var result = await controller.UndoLastCommand(1);

            // Assert
            Assert.IsType<NoContentResult>(result);
            Assert.Empty(context.DrawingCommands);
        }
    }
}
