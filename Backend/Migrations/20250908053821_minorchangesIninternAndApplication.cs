using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace InternAttendenceSystem.Migrations
{
    /// <inheritdoc />
    public partial class minorchangesIninternAndApplication : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.RenameColumn(
                name: "role",
                table: "intern",
                newName: "internshipStatus");

            migrationBuilder.AddColumn<string>(
                name: "department",
                table: "intern",
                type: "nvarchar(max)",
                nullable: false,
                defaultValue: "");

            migrationBuilder.AddColumn<string>(
                name: "mentor",
                table: "intern",
                type: "nvarchar(max)",
                nullable: true);

            migrationBuilder.AddColumn<string>(
                name: "department",
                table: "Applications",
                type: "nvarchar(max)",
                nullable: false,
                defaultValue: "");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "department",
                table: "intern");

            migrationBuilder.DropColumn(
                name: "mentor",
                table: "intern");

            migrationBuilder.DropColumn(
                name: "department",
                table: "Applications");

            migrationBuilder.RenameColumn(
                name: "internshipStatus",
                table: "intern",
                newName: "role");
        }
    }
}
