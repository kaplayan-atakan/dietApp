namespace AdminApi.DTOs
{
    public class LoginRequest
    {
        public string Username { get; set; } = string.Empty;
        public string Password { get; set; } = string.Empty;
    }

    public class LoginResponse
    {
        public string Token { get; set; } = string.Empty;
        public string Username { get; set; } = string.Empty;
        public string Role { get; set; } = string.Empty;
        public DateTime ExpiresAt { get; set; }
    }

    public class LogQueryRequest
    {
        public DateTime? StartDate { get; set; }
        public DateTime? EndDate { get; set; }
        public string? Level { get; set; }
        public string? Component { get; set; }
        public string? UserId { get; set; }
        public string? Message { get; set; }
        public int Page { get; set; } = 1;
        public int PageSize { get; set; } = 50;
    }    public class LogResponse
    {
        public int Id { get; set; }
        public DateTime Timestamp { get; set; }
        public string Level { get; set; } = string.Empty;
        public string Message { get; set; } = string.Empty;
        public string? Component { get; set; }
        public string? Action { get; set; }
        public string? UserId { get; set; }
        public string? SessionId { get; set; }
        public string? IpAddress { get; set; }
        public string? Context { get; set; }
        public string? StackTrace { get; set; }
        public DateTime CreatedAt { get; set; }
    }

    public class LogSummaryResponse
    {
        public int TotalLogs { get; set; }
        public int ErrorCount { get; set; }
        public int WarningCount { get; set; }
        public int InfoCount { get; set; }
        public DateTime? LastLogTime { get; set; }
        public Dictionary<string, int> LogsByComponent { get; set; } = new();        public Dictionary<string, int> LogsByLevel { get; set; } = new();
    }

    public class CreateLogRequest
    {
        public DateTime Timestamp { get; set; }
        public string Level { get; set; } = string.Empty;
        public string Message { get; set; } = string.Empty;
        public string? Component { get; set; }
        public string? Action { get; set; }
        public string? UserId { get; set; }
        public string? SessionId { get; set; }
        public string? IpAddress { get; set; }
        public string? Context { get; set; }
        public string? StackTrace { get; set; }
        public string? UserAgent { get; set; }
        public string? Url { get; set; }
    }

    public class BatchLogRequest
    {
        public List<CreateLogRequest> Logs { get; set; } = new();
    }

    public class PagedResponse<T>
    {
        public List<T> Data { get; set; } = new();
        public int TotalCount { get; set; }
        public int PageNumber { get; set; }
        public int PageSize { get; set; }
        public int TotalPages { get; set; }
        public bool HasNextPage { get; set; }
        public bool HasPreviousPage { get; set; }
    }
}
