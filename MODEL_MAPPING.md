# Model Property Mapping

## Critical Property Differences

### ProgressLog
- **API Expected**: `Date` → **Shared Model**: `LogDate`
- **API Expected**: `Measurements` → **Shared Model**: `CustomMetrics`

### WorkoutLog  
- **API Expected**: `Date` → **Shared Model**: `StartedAt`

### MealLog
- **API Expected**: `LoggedAt` → **Shared Model**: `LogDate`
- **API Expected**: `FoodId` → **Shared Model**: Missing (use MealItem structure)
- **API Expected**: `RecipeId` → **Shared Model**: Missing (use MealItem structure)
- **API Expected**: `Quantity` → **Shared Model**: Use MealItem.Amount
- **API Expected**: `Unit` → **Shared Model**: Use MealItem.Unit

### NotificationSettings
- **API Expected**: `PushNotificationsEnabled` → **Shared Model**: Missing (derive from general settings)
- **API Expected**: `WorkoutRemindersEnabled` → **Shared Model**: `WorkoutReminders`
- **API Expected**: `MealRemindersEnabled` → **Shared Model**: `MealReminders`
- **API Expected**: `ProgressRemindersEnabled` → **Shared Model**: `ProgressReminders`
- **API Expected**: `AchievementNotificationsEnabled` → **Shared Model**: `Achievements`
- **API Expected**: `WeeklyReportsEnabled` → **Shared Model**: `WeeklyReports`
- **API Expected**: `QuietHoursStart` → **Shared Model**: `QuietTimeStart`
- **API Expected**: `QuietHoursEnd` → **Shared Model**: `QuietTimeEnd`

### UserDevice
- **API Expected**: `CreatedAt` → **Shared Model**: `RegisteredAt`
- **API Expected**: `UpdatedAt` → **Shared Model**: `LastUsed`

### ScheduledNotification
- **API Expected**: `IsActive` → **Shared Model**: Missing (derive from IsSent)

### Streak
- **API Expected**: `CurrentCount` → **Shared Model**: `CurrentStreak`
- **API Expected**: `BestCount` → **Shared Model**: `LongestStreak`
- **API Expected**: `LastActivity` → **Shared Model**: `LastActivityDate`

### Achievement
- **API Expected**: `IconUrl` → **Shared Model**: Missing
- **API Expected**: `Category` → **Shared Model**: Missing

### BodyMetrics
- **API Expected**: `Measurements` → **Shared Model**: Custom computation from properties
- **API Expected**: `Date` → **Shared Model**: `RecordedAt`

### Recipe
- **API Expected**: `UserId` → **Shared Model**: Missing
- **API Expected**: `NutritionInfo` → **Shared Model**: `NutritionPerServing`

### MealPlan
- **API Expected**: `Description` → **Shared Model**: Missing

### WorkoutTemplate
- **API Expected**: `UserId` → **Shared Model**: Missing
- **API Expected**: `IsPublic` → **Shared Model**: Missing

### DTOs Missing Properties
- **ResetPasswordRequest**: Missing `Email` property
- **Various Reminder Requests**: Missing `ReminderTime` property
- **SendNotificationRequest**: Missing `UserId` property
- **LogProgressRequest**: Missing `Date` property
- **UpdateProgressLogRequest**: Missing `Measurements` property
- **CreateRecipeRequest**: Missing `NutritionInfo` property
- **CreateMealPlanRequest**: Missing `Description` property
- **LogMealRequest**: Missing `FoodId`, `RecipeId`, `Quantity`, `Unit`, `LoggedAt`, `NutritionInfo`
- **UpdateMealLogRequest**: Missing `Quantity`, `Unit`, `NutritionInfo`

## Missing Shared Models
- **DailyNutritionData**: Referenced in NutritionService but doesn't exist
- **UserGoals**: Referenced in AppDbContext and services
