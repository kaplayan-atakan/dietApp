using System.ComponentModel.DataAnnotations;

namespace AiFitnessCoach.Shared.Models
{
    public class UserSettings
    {
        public string Id { get; set; } = string.Empty;
        public string UserId { get; set; } = string.Empty;
        public string Theme { get; set; } = "light";
        public string Language { get; set; } = "en";
        public string Timezone { get; set; } = "UTC";
        public bool EmailNotifications { get; set; } = true;
        public bool PushNotifications { get; set; } = true;
        public string PrivacyLevel { get; set; } = "public";
        public DateTime CreatedAt { get; set; }
        public DateTime UpdatedAt { get; set; }
    }
}
