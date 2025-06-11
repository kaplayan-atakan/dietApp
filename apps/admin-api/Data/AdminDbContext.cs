using Microsoft.EntityFrameworkCore;
using AdminApi.Models;

namespace AdminApi.Data
{
    public class AdminDbContext : DbContext
    {
        public AdminDbContext(DbContextOptions<AdminDbContext> options) : base(options)
        {
        }

        public DbSet<User> Users { get; set; }
        public DbSet<ClientLog> ClientLogs { get; set; }

        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            base.OnModelCreating(modelBuilder);

            // Configure User entity
            modelBuilder.Entity<User>(entity =>
            {
                entity.HasIndex(e => e.Username).IsUnique();
                entity.HasIndex(e => e.Email).IsUnique();
            });

            // Configure ClientLog entity
            modelBuilder.Entity<ClientLog>(entity =>
            {
                entity.HasIndex(e => e.Timestamp);
                entity.HasIndex(e => e.Level);
                entity.HasIndex(e => e.Component);
                entity.HasIndex(e => e.UserId);
                entity.HasIndex(e => e.SessionId);
            });
        }
    }
}
