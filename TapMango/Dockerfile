FROM mcr.microsoft.com/dotnet/aspnet:8.0 AS base
WORKDIR /app
EXPOSE 8080

FROM mcr.microsoft.com/dotnet/sdk:8.0 AS build
WORKDIR /src
COPY ["TapMango.csproj", "./"]
RUN dotnet restore "TapMango.csproj"
COPY . .
WORKDIR "/src/."
RUN dotnet build "TapMango.csproj" -c Release -o /app/build

FROM build AS publish
RUN dotnet publish "TapMango.csproj" -c Release -o /app/publish

FROM base AS final
WORKDIR /app
COPY --from=publish /app/publish .
ENTRYPOINT ["dotnet", "TapMango.dll"]


