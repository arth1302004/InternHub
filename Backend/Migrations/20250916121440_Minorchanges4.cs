using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace InternAttendenceSystem.Migrations
{
    /// <inheritdoc />
    public partial class Minorchanges4 : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<double>(
                name: "performance",
                table: "tasks",
                type: "float",
                nullable: true);

            migrationBuilder.AddColumn<DateTime>(
                name: "joiningDate",
                table: "intern",
                type: "datetime2",
                nullable: true);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "performance",
                table: "tasks");

            migrationBuilder.DropColumn(
                name: "joiningDate",
                table: "intern");
        }
    }
}
