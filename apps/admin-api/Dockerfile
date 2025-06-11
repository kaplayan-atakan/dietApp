# Admin API Service Dockerfile for Render.com
FROM mcr.microsoft.com/dotnet/aspnet:8.0 AS base
WORKDIR /app
EXPOSE 8080

FROM mcr.microsoft.com/dotnet/sdk:8.0 AS build
WORKDIR /src

# Copy project files
COPY ["apps/admin-api/admin-api.csproj", "apps/admin-api/"]

# Restore dependencies
RUN dotnet restore "apps/admin-api/admin-api.csproj"

# Copy all source code
COPY . .

# Build the project
WORKDIR "/src/apps/admin-api"
RUN dotnet build "admin-api.csproj" -c Release -o /app/build

# Publish the project
FROM build AS publish
RUN dotnet publish "admin-api.csproj" -c Release -o /app/publish /p:UseAppHost=false

# Final stage
FROM base AS final
WORKDIR /app
COPY --from=publish /app/publish .

# Create user for security
RUN addgroup --system --gid 1001 nodejs
RUN adduser --system --uid 1001 dotnetuser
USER dotnetuser

ENTRYPOINT ["dotnet", "admin-api.dll"]
