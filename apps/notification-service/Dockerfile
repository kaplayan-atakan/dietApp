# Notification Service Dockerfile for Render.com
FROM mcr.microsoft.com/dotnet/aspnet:8.0 AS base
WORKDIR /app
EXPOSE 8080
ENV ASPNETCORE_URLS=http://+:8080

FROM mcr.microsoft.com/dotnet/sdk:8.0 AS build
WORKDIR /src

# Copy project files (relative to repository root)
COPY ["apps/notification-service/AiFitnessCoach.NotificationService.csproj", "apps/notification-service/"]
COPY ["packages/shared-types/AiFitnessCoach.Shared.csproj", "packages/shared-types/"]

# Restore dependencies
RUN dotnet restore "apps/notification-service/AiFitnessCoach.NotificationService.csproj"

# Copy all source code
COPY apps/notification-service/ apps/notification-service/
COPY packages/shared-types/ packages/shared-types/

# Build the project
WORKDIR "/src/apps/notification-service"
RUN dotnet build "AiFitnessCoach.NotificationService.csproj" -c Release -o /app/build

# Publish the project
FROM build AS publish
RUN dotnet publish "AiFitnessCoach.NotificationService.csproj" -c Release -o /app/publish /p:UseAppHost=false

# Final stage
FROM base AS final
WORKDIR /app
COPY --from=publish /app/publish .

# Create user for security
RUN addgroup --system --gid 1001 nodejs
RUN adduser --system --uid 1001 dotnetuser
USER dotnetuser

ENTRYPOINT ["dotnet", "AiFitnessCoach.NotificationService.dll"]
