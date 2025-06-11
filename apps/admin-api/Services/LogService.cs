using Microsoft.EntityFrameworkCore;
using AdminApi.Data;
using AdminApi.DTOs;
using AdminApi.Models;

namespace AdminApi.Services
{    public interface ILogService
    {
        Task<PagedResponse<LogResponse>> GetLogsAsync(LogQueryRequest request);
        Task<LogSummaryResponse> GetLogSummaryAsync(DateTime? startDate = null, DateTime? endDate = null);
        Task<LogResponse?> GetLogByIdAsync(int id);
        Task<List<string>> GetComponentsAsync();
        Task<List<string>> GetLogLevelsAsync();
        Task<int> CreateLogsAsync(List<CreateLogRequest> logs);
    }

    public class LogService : ILogService
    {
        private readonly AdminDbContext _context;

        public LogService(AdminDbContext context)
        {
            _context = context;
        }

        public async Task<PagedResponse<LogResponse>> GetLogsAsync(LogQueryRequest request)
        {
            var query = _context.ClientLogs.AsQueryable();

            // Apply filters
            if (request.StartDate.HasValue)
                query = query.Where(l => l.Timestamp >= request.StartDate.Value);

            if (request.EndDate.HasValue)
                query = query.Where(l => l.Timestamp <= request.EndDate.Value);

            if (!string.IsNullOrEmpty(request.Level))
                query = query.Where(l => l.Level == request.Level);

            if (!string.IsNullOrEmpty(request.Component))
                query = query.Where(l => l.Component == request.Component);

            if (!string.IsNullOrEmpty(request.UserId))
                query = query.Where(l => l.UserId == request.UserId);

            if (!string.IsNullOrEmpty(request.Message))
                query = query.Where(l => l.Message.Contains(request.Message));

            // Get total count
            var totalCount = await query.CountAsync();            // Apply pagination
            var logs = await query
                .OrderByDescending(l => l.Timestamp)
                .Skip((request.Page - 1) * request.PageSize)
                .Take(request.PageSize)
                .Select(l => new LogResponse
                {
                    Id = l.Id,
                    Timestamp = l.Timestamp,
                    Level = l.Level,
                    Message = l.Message,
                    Component = l.Component,
                    Action = l.Action,
                    UserId = l.UserId,
                    SessionId = l.SessionId,
                    IpAddress = l.IpAddress,
                    Context = l.Context,
                    StackTrace = l.StackTrace,
                    CreatedAt = l.CreatedAt
                })
                .ToListAsync();

            var totalPages = (int)Math.Ceiling((double)totalCount / request.PageSize);

            return new PagedResponse<LogResponse>
            {
                Data = logs,
                TotalCount = totalCount,
                PageNumber = request.Page,
                PageSize = request.PageSize,
                TotalPages = totalPages,
                HasNextPage = request.Page < totalPages,
                HasPreviousPage = request.Page > 1
            };
        }

        public async Task<LogSummaryResponse> GetLogSummaryAsync(DateTime? startDate = null, DateTime? endDate = null)
        {
            var query = _context.ClientLogs.AsQueryable();

            if (startDate.HasValue)
                query = query.Where(l => l.Timestamp >= startDate.Value);

            if (endDate.HasValue)
                query = query.Where(l => l.Timestamp <= endDate.Value);

            var totalLogs = await query.CountAsync();
            var errorCount = await query.CountAsync(l => l.Level == "ERROR");
            var warningCount = await query.CountAsync(l => l.Level == "WARN");
            var infoCount = await query.CountAsync(l => l.Level == "INFO");
            var lastLogTime = await query.OrderByDescending(l => l.Timestamp)
                .Select(l => l.Timestamp)
                .FirstOrDefaultAsync();

            var logsByComponent = await query
                .Where(l => l.Component != null)
                .GroupBy(l => l.Component)
                .Select(g => new { Component = g.Key, Count = g.Count() })
                .ToDictionaryAsync(x => x.Component!, x => x.Count);

            var logsByLevel = await query
                .GroupBy(l => l.Level)
                .Select(g => new { Level = g.Key, Count = g.Count() })
                .ToDictionaryAsync(x => x.Level, x => x.Count);

            return new LogSummaryResponse
            {
                TotalLogs = totalLogs,
                ErrorCount = errorCount,
                WarningCount = warningCount,
                InfoCount = infoCount,
                LastLogTime = lastLogTime == default ? null : lastLogTime,
                LogsByComponent = logsByComponent,
                LogsByLevel = logsByLevel
            };
        }        public async Task<LogResponse?> GetLogByIdAsync(int id)
        {
            return await _context.ClientLogs
                .Where(l => l.Id == id)
                .Select(l => new LogResponse
                {
                    Id = l.Id,
                    Timestamp = l.Timestamp,
                    Level = l.Level,
                    Message = l.Message,
                    Component = l.Component,
                    Action = l.Action,
                    UserId = l.UserId,
                    SessionId = l.SessionId,
                    IpAddress = l.IpAddress,
                    Context = l.Context,
                    StackTrace = l.StackTrace,
                    CreatedAt = l.CreatedAt
                })
                .FirstOrDefaultAsync();
        }

        public async Task<List<string>> GetComponentsAsync()
        {
            return await _context.ClientLogs
                .Where(l => l.Component != null)
                .Select(l => l.Component!)
                .Distinct()
                .OrderBy(c => c)
                .ToListAsync();
        }        public async Task<List<string>> GetLogLevelsAsync()
        {
            return await _context.ClientLogs
                .Select(l => l.Level)
                .Distinct()
                .OrderBy(l => l)
                .ToListAsync();
        }

        public async Task<int> CreateLogsAsync(List<CreateLogRequest> logs)
        {
            var clientLogs = logs.Select(log => new ClientLog
            {
                Timestamp = log.Timestamp,
                Level = log.Level,
                Message = log.Message,
                Component = log.Component,
                Action = log.Action,
                UserId = log.UserId,
                SessionId = log.SessionId,
                IpAddress = log.IpAddress ?? GetClientIpAddress(),
                Context = log.Context,
                StackTrace = log.StackTrace,
                CreatedAt = DateTime.UtcNow
            }).ToList();

            await _context.ClientLogs.AddRangeAsync(clientLogs);
            await _context.SaveChangesAsync();

            return clientLogs.Count;
        }

        private string GetClientIpAddress()
        {
            // Bu method HTTP context'den IP address alacak şekilde geliştirilebilir
            return "::1"; // Default localhost for now
        }
    }
}
