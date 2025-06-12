# API Service Dockerfile for Render.com
FROM mcr.microsoft.com/dotnet/aspnet:8.0 AS base
WORKDIR /app
EXPOSE 8080
ENV ASPNETCORE_URLS=http://+:8080

FROM mcr.microsoft.com/dotnet/sdk:8.0 AS build
WORKDIR /src

# Copy project files (relative to repository root)
COPY ["apps/api/AiFitnessCoach.API.csproj", "apps/api/"]
COPY ["packages/shared-types/AiFitnessCoach.Shared.csproj", "packages/shared-types/"]

# Restore dependencies
RUN dotnet restore "apps/api/AiFitnessCoach.API.csproj"

# Copy all source code
COPY apps/api/ apps/api/
COPY packages/shared-types/ packages/shared-types/

# Build the project
WORKDIR "/src/apps/api"
RUN dotnet build "AiFitnessCoach.API.csproj" -c Release -o /app/build

# Publish the project
FROM build AS publish
RUN dotnet publish "AiFitnessCoach.API.csproj" -c Release -o /app/publish /p:UseAppHost=false

# Final stage
FROM base AS final
WORKDIR /app
COPY --from=publish /app/publish .

# Create user for security
RUN addgroup --system --gid 1001 nodejs
RUN adduser --system --uid 1001 dotnetuser
USER dotnetuser

ENTRYPOINT ["dotnet", "AiFitnessCoach.API.dll"]
