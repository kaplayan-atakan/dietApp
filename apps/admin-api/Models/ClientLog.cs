using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace AdminApi.Models
{
    public class ClientLog
    {
        [Key]
        public int Id { get; set; }

        [Required]
        public DateTime Timestamp { get; set; }

        [Required]
        [StringLength(20)]
        public string Level { get; set; } = string.Empty; // DEBUG, INFO, WARN, ERROR, FATAL

        [Required]
        [StringLength(500)]
        public string Message { get; set; } = string.Empty;

        [StringLength(100)]
        public string? Component { get; set; }

        [StringLength(100)]
        public string? Action { get; set; }

        [Column(TypeName = "jsonb")]
        public string? Context { get; set; } // JSON string for additional data

        [StringLength(200)]
        public string? UserAgent { get; set; }

        [StringLength(500)]
        public string? Url { get; set; }

        [StringLength(50)]
        public string? UserId { get; set; }

        [StringLength(100)]
        public string? SessionId { get; set; }

        [StringLength(45)]
        public string? IpAddress { get; set; }

        public string? StackTrace { get; set; }

        public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
    }
}
