using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Authorization;
using AiFitnessCoach.API.Services;
using AiFitnessCoach.Shared.Models;
using AiFitnessCoach.Shared.DTOs;

namespace AiFitnessCoach.API.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    [Authorize]
    public class WorkoutsController : ControllerBase
    {
        private readonly IWorkoutService _workoutService;
        private readonly ILogger<WorkoutsController> _logger;

        public WorkoutsController(IWorkoutService workoutService, ILogger<WorkoutsController> logger)
        {
            _workoutService = workoutService;
            _logger = logger;
        }

        [HttpGet]
        public async Task<ActionResult<List<WorkoutPlan>>> GetWorkouts()
        {
            try
            {
                var userId = User.FindFirst("userId")?.Value;
                if (string.IsNullOrEmpty(userId))
                {
                    return Unauthorized();
                }

                var workouts = await _workoutService.GetUserWorkoutsAsync(userId);
                return Ok(workouts);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Failed to get workouts for user");
                return StatusCode(500, new { message = "Internal server error" });
            }
        }

        [HttpGet("{id}")]
        public async Task<ActionResult<WorkoutPlan>> GetWorkout(string id)
        {
            try
            {
                var userId = User.FindFirst("userId")?.Value;
                if (string.IsNullOrEmpty(userId))
                {
                    return Unauthorized();
                }

                var workout = await _workoutService.GetWorkoutAsync(id, userId);
                if (workout == null)
                {
                    return NotFound();
                }

                return Ok(workout);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Failed to get workout {WorkoutId}", id);
                return StatusCode(500, new { message = "Internal server error" });
            }
        }

        [HttpPost]
        public async Task<ActionResult<WorkoutPlan>> CreateWorkout([FromBody] CreateWorkoutRequest request)
        {
            try
            {
                var userId = User.FindFirst("userId")?.Value;
                if (string.IsNullOrEmpty(userId))
                {
                    return Unauthorized();
                }

                var workout = await _workoutService.CreateWorkoutAsync(userId, request);
                return CreatedAtAction(nameof(GetWorkout), new { id = workout.Id }, workout);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Failed to create workout");
                return StatusCode(500, new { message = "Internal server error" });
            }
        }

        [HttpPost("{id}/sessions")]
        public async Task<ActionResult<WorkoutSession>> StartWorkoutSession(string id)
        {
            try
            {
                var userId = User.FindFirst("userId")?.Value;
                if (string.IsNullOrEmpty(userId))
                {
                    return Unauthorized();
                }

                var session = await _workoutService.StartWorkoutSessionAsync(id, userId);
                return Ok(session);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Failed to start workout session for workout {WorkoutId}", id);
                return StatusCode(500, new { message = "Internal server error" });
            }
        }

        [HttpPut("sessions/{sessionId}")]
        public async Task<ActionResult<WorkoutSession>> UpdateWorkoutSession(string sessionId, [FromBody] UpdateWorkoutSessionRequest request)
        {
            try
            {
                var userId = User.FindFirst("userId")?.Value;
                if (string.IsNullOrEmpty(userId))
                {
                    return Unauthorized();
                }

                var session = await _workoutService.UpdateWorkoutSessionAsync(sessionId, userId, request);
                return Ok(session);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Failed to update workout session {SessionId}", sessionId);
                return StatusCode(500, new { message = "Internal server error" });
            }
        }        [HttpPost("sessions/{sessionId}/complete")]
        public async Task<ActionResult<WorkoutSession>> CompleteWorkoutSession(string sessionId, [FromBody] CompleteWorkoutSessionRequest request)
        {
            try
            {
                var userId = User.FindFirst("userId")?.Value;
                if (string.IsNullOrEmpty(userId))
                {
                    return Unauthorized();
                }

                var session = await _workoutService.CompleteWorkoutSessionAsync(sessionId, userId, request);
                return Ok(session);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Failed to complete workout session {SessionId}", sessionId);
                return StatusCode(500, new { message = "Internal server error" });
            }
        }
    }
}
