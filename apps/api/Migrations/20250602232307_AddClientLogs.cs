using System;
using System.Collections.Generic;
using Microsoft.EntityFrameworkCore.Migrations;
using Npgsql.EntityFrameworkCore.PostgreSQL.Metadata;

#nullable disable

#pragma warning disable CA1814 // Prefer jagged arrays over multidimensional

namespace AiFitnessCoach.API.Migrations
{
    /// <inheritdoc />
    public partial class AddClientLogs : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DeleteData(
                table: "Exercises",
                keyColumn: "Id",
                keyValue: "1e794659-bcab-442f-a712-de8a819f9d74");

            migrationBuilder.DeleteData(
                table: "Exercises",
                keyColumn: "Id",
                keyValue: "df523a1a-f949-4d97-b1bb-fb245c5e46d4");

            migrationBuilder.AlterColumn<string>(
                name: "Data",
                table: "NotificationHistory",
                type: "text",
                nullable: true,
                oldClrType: typeof(string),
                oldType: "text");

            migrationBuilder.CreateTable(
                name: "ClientLogs",
                columns: table => new
                {
                    Id = table.Column<int>(type: "integer", nullable: false)
                        .Annotation("Npgsql:ValueGenerationStrategy", NpgsqlValueGenerationStrategy.IdentityByDefaultColumn),
                    Timestamp = table.Column<DateTime>(type: "timestamp with time zone", nullable: false),
                    Level = table.Column<string>(type: "character varying(20)", maxLength: 20, nullable: false),
                    Message = table.Column<string>(type: "character varying(500)", maxLength: 500, nullable: false),
                    Component = table.Column<string>(type: "character varying(100)", maxLength: 100, nullable: true),
                    Action = table.Column<string>(type: "character varying(100)", maxLength: 100, nullable: true),
                    Context = table.Column<string>(type: "jsonb", nullable: true),
                    UserAgent = table.Column<string>(type: "character varying(200)", maxLength: 200, nullable: true),
                    Url = table.Column<string>(type: "character varying(500)", maxLength: 500, nullable: true),
                    UserId = table.Column<string>(type: "character varying(50)", maxLength: 50, nullable: true),
                    SessionId = table.Column<string>(type: "character varying(100)", maxLength: 100, nullable: true),
                    IpAddress = table.Column<string>(type: "character varying(45)", maxLength: 45, nullable: true),
                    StackTrace = table.Column<string>(type: "text", nullable: true),
                    CreatedAt = table.Column<DateTime>(type: "timestamp with time zone", nullable: false, defaultValueSql: "CURRENT_TIMESTAMP")
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_ClientLogs", x => x.Id);
                });

            migrationBuilder.InsertData(
                table: "Exercises",
                columns: new[] { "Id", "Category", "Description", "Difficulty", "Equipment", "ImageUrl", "Instructions", "MuscleGroups", "Name", "VideoUrl" },
                values: new object[,]
                {
                    { "0299b586-6971-44ac-a0df-6f4e149b2dcc", "Bodyweight", "A fundamental lower body exercise", "beginner", "[]", "", new List<string> { "Stand with feet shoulder-width apart", "Lower your body as if sitting back into a chair", "Return to standing position" }, "[\"Quadriceps\",\"Glutes\",\"Hamstrings\"]", "Squat", "" },
                    { "e0c8c693-dbbe-41a5-8926-cd5657136aea", "Bodyweight", "A bodyweight exercise that targets chest, shoulders, and triceps", "beginner", "[]", "", new List<string> { "Start in a plank position with hands shoulder-width apart", "Lower your body until chest nearly touches the floor", "Push back up to starting position" }, "[\"Chest\",\"Shoulders\",\"Triceps\"]", "Push-up", "" }
                });

            migrationBuilder.CreateIndex(
                name: "IX_ClientLogs_Component",
                table: "ClientLogs",
                column: "Component");

            migrationBuilder.CreateIndex(
                name: "IX_ClientLogs_CreatedAt",
                table: "ClientLogs",
                column: "CreatedAt");

            migrationBuilder.CreateIndex(
                name: "IX_ClientLogs_Level",
                table: "ClientLogs",
                column: "Level");

            migrationBuilder.CreateIndex(
                name: "IX_ClientLogs_Timestamp",
                table: "ClientLogs",
                column: "Timestamp");

            migrationBuilder.CreateIndex(
                name: "IX_ClientLogs_UserId",
                table: "ClientLogs",
                column: "UserId");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropTable(
                name: "ClientLogs");

            migrationBuilder.DeleteData(
                table: "Exercises",
                keyColumn: "Id",
                keyValue: "0299b586-6971-44ac-a0df-6f4e149b2dcc");

            migrationBuilder.DeleteData(
                table: "Exercises",
                keyColumn: "Id",
                keyValue: "e0c8c693-dbbe-41a5-8926-cd5657136aea");

            migrationBuilder.AlterColumn<string>(
                name: "Data",
                table: "NotificationHistory",
                type: "text",
                nullable: false,
                defaultValue: "",
                oldClrType: typeof(string),
                oldType: "text",
                oldNullable: true);

            migrationBuilder.InsertData(
                table: "Exercises",
                columns: new[] { "Id", "Category", "Description", "Difficulty", "Equipment", "ImageUrl", "Instructions", "MuscleGroups", "Name", "VideoUrl" },
                values: new object[,]
                {
                    { "1e794659-bcab-442f-a712-de8a819f9d74", "Bodyweight", "A fundamental lower body exercise", "beginner", "[]", "", new List<string> { "Stand with feet shoulder-width apart", "Lower your body as if sitting back into a chair", "Return to standing position" }, "[\"Quadriceps\",\"Glutes\",\"Hamstrings\"]", "Squat", "" },
                    { "df523a1a-f949-4d97-b1bb-fb245c5e46d4", "Bodyweight", "A bodyweight exercise that targets chest, shoulders, and triceps", "beginner", "[]", "", new List<string> { "Start in a plank position with hands shoulder-width apart", "Lower your body until chest nearly touches the floor", "Push back up to starting position" }, "[\"Chest\",\"Shoulders\",\"Triceps\"]", "Push-up", "" }
                });
        }
    }
}
