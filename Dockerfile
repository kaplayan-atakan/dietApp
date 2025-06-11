# Mobile App (React Native with Expo)
FROM node:18-alpine as mobile-build
WORKDIR /app
COPY apps/mobile/package.json ./
RUN npm install
COPY apps/mobile/ ./
RUN npm run build

# Web App (Next.js)
FROM node:18-alpine as web-build
WORKDIR /app
COPY apps/web-app/package.json ./
RUN npm install
COPY apps/web-app/ ./
RUN npm run build

# Landing Page (Vite)
FROM node:18-alpine as landing-build
WORKDIR /app
COPY apps/landing-page/package.json ./
RUN npm install
COPY apps/landing-page/ ./
RUN npm run build

# API Service (.NET Core)
FROM mcr.microsoft.com/dotnet/aspnet:8.0 AS api-base
WORKDIR /app
EXPOSE 80
EXPOSE 443

FROM mcr.microsoft.com/dotnet/sdk:8.0 AS api-build
WORKDIR /src
COPY ["apps/api/AiFitnessCoach.API.csproj", "apps/api/"]
COPY ["packages/shared-types/AiFitnessCoach.Shared.csproj", "packages/shared-types/"]
RUN dotnet restore "apps/api/AiFitnessCoach.API.csproj"
COPY . .
WORKDIR "/src/apps/api"
RUN dotnet build "AiFitnessCoach.API.csproj" -c Release -o /app/build

FROM api-build AS api-publish
RUN dotnet publish "AiFitnessCoach.API.csproj" -c Release -o /app/publish

FROM api-base AS api-final
WORKDIR /app
COPY --from=api-publish /app/publish .
ENTRYPOINT ["dotnet", "AiFitnessCoach.API.dll"]

# Notification Service (.NET Core)
FROM mcr.microsoft.com/dotnet/aspnet:8.0 AS notification-base
WORKDIR /app
EXPOSE 80

FROM mcr.microsoft.com/dotnet/sdk:8.0 AS notification-build
WORKDIR /src
COPY ["apps/notification-service/AiFitnessCoach.NotificationService.csproj", "apps/notification-service/"]
COPY ["packages/shared-types/AiFitnessCoach.Shared.csproj", "packages/shared-types/"]
RUN dotnet restore "apps/notification-service/AiFitnessCoach.NotificationService.csproj"
COPY . .
WORKDIR "/src/apps/notification-service"
RUN dotnet build "AiFitnessCoach.NotificationService.csproj" -c Release -o /app/build

FROM notification-build AS notification-publish
RUN dotnet publish "AiFitnessCoach.NotificationService.csproj" -c Release -o /app/publish

FROM notification-base AS notification-final
WORKDIR /app
COPY --from=notification-publish /app/publish .
ENTRYPOINT ["dotnet", "AiFitnessCoach.NotificationService.dll"]

# Queue Processor (.NET Core)
FROM mcr.microsoft.com/dotnet/aspnet:8.0 AS queue-base
WORKDIR /app

FROM mcr.microsoft.com/dotnet/sdk:8.0 AS queue-build
WORKDIR /src
COPY ["apps/queue-processor/AiFitnessCoach.QueueProcessor.csproj", "apps/queue-processor/"]
COPY ["packages/shared-types/AiFitnessCoach.Shared.csproj", "packages/shared-types/"]
RUN dotnet restore "apps/queue-processor/AiFitnessCoach.QueueProcessor.csproj"
COPY . .
WORKDIR "/src/apps/queue-processor"
RUN dotnet build "AiFitnessCoach.QueueProcessor.csproj" -c Release -o /app/build

FROM queue-build AS queue-publish
RUN dotnet publish "AiFitnessCoach.QueueProcessor.csproj" -c Release -o /app/publish

FROM queue-base AS queue-final
WORKDIR /app
COPY --from=queue-publish /app/publish .
ENTRYPOINT ["dotnet", "AiFitnessCoach.QueueProcessor.dll"]

# Web Server (Nginx) for serving static files
FROM nginx:alpine as web-server
COPY --from=web-build /app/out /usr/share/nginx/html/app
COPY --from=landing-build /app/dist /usr/share/nginx/html
COPY docker/nginx.conf /etc/nginx/nginx.conf
EXPOSE 80
