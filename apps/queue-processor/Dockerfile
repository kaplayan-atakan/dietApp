# Queue Processor Dockerfile for Render.com
FROM mcr.microsoft.com/dotnet/runtime:8.0 AS base
WORKDIR /app

FROM mcr.microsoft.com/dotnet/sdk:8.0 AS build
WORKDIR /src

# Copy project files (relative to repository root)
COPY ["apps/queue-processor/AiFitnessCoach.QueueProcessor.csproj", "apps/queue-processor/"]
COPY ["packages/shared-types/AiFitnessCoach.Shared.csproj", "packages/shared-types/"]

# Restore dependencies
RUN dotnet restore "apps/queue-processor/AiFitnessCoach.QueueProcessor.csproj"

# Copy all source code
COPY apps/queue-processor/ apps/queue-processor/
COPY packages/shared-types/ packages/shared-types/

# Build the project
WORKDIR "/src/apps/queue-processor"
RUN dotnet build "AiFitnessCoach.QueueProcessor.csproj" -c Release -o /app/build

# Publish the project
FROM build AS publish
RUN dotnet publish "AiFitnessCoach.QueueProcessor.csproj" -c Release -o /app/publish /p:UseAppHost=false

# Final stage
FROM base AS final
WORKDIR /app
COPY --from=publish /app/publish .

# Create user for security
RUN addgroup --system --gid 1001 nodejs
RUN adduser --system --uid 1001 dotnetuser
USER dotnetuser

ENTRYPOINT ["dotnet", "AiFitnessCoach.QueueProcessor.dll"]
