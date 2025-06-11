using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace AiFitnessCoach.API.Models
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

    public class ClientLogDto
    {
        public DateTime Timestamp { get; set; }
        public string Level { get; set; } = string.Empty;
        public string Message { get; set; } = string.Empty;
        public string? Component { get; set; }
        public string? Action { get; set; }
        public object? Context { get; set; }
        public string? UserAgent { get; set; }
        public string? Url { get; set; }
        public string? UserId { get; set; }
        public string? SessionId { get; set; }
        public string? StackTrace { get; set; }
    }

    public class LogQueryParams
    {
        public string? Level { get; set; }
        public string? Component { get; set; }
        public string? UserId { get; set; }
        public DateTime? StartDate { get; set; }
        public DateTime? EndDate { get; set; }
        public int Page { get; set; } = 1;
        public int PageSize { get; set; } = 50;
        public string? Search { get; set; }
    }

    public class LogStatsDto
    {
        public int TotalLogs { get; set; }
        public int ErrorCount { get; set; }
        public int WarnCount { get; set; }
        public int InfoCount { get; set; }
        public int DebugCount { get; set; }
        public Dictionary<string, int> ComponentStats { get; set; } = new();
        public Dictionary<string, int> HourlyStats { get; set; } = new();
    }
}
