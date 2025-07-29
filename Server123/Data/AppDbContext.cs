using Microsoft.EntityFrameworkCore;
using Server.Models;

namespace Server.Data
{
    public class AppDbContext : DbContext
    {
        public AppDbContext(DbContextOptions<AppDbContext> options)
            : base(options) { }

        public DbSet<AppUser> Users { get; set; }
        public DbSet<Drawing> Drawings { get; set; }

        public DbSet<DrawingCommand> DrawingCommands { get; set; }
        public DbSet<RedoDrawingCommand> RedoDrawingCommands { get; set; }

        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            modelBuilder
                .Entity<Drawing>()
                .HasMany(d => d.Commands)
                .WithOne()
                .HasForeignKey(dc => dc.DrawingId);
        }
    }
}
