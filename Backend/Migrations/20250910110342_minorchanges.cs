using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace InternAttendenceSystem.Migrations
{
    /// <inheritdoc />
    public partial class minorchanges : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<bool>(
                name: "IsPasswordReset",
                table: "intern",
                type: "bit",
                nullable: false,
                defaultValue: false);

            migrationBuilder.AddColumn<string>(
                name: "SecurityAnswer1",
                table: "intern",
                type: "nvarchar(max)",
                nullable: true);

            migrationBuilder.AddColumn<string>(
                name: "SecurityAnswer2",
                table: "intern",
                type: "nvarchar(max)",
                nullable: true);

            migrationBuilder.AddColumn<string>(
                name: "SecurityAnswer3",
                table: "intern",
                type: "nvarchar(max)",
                nullable: true);

            migrationBuilder.AddColumn<string>(
                name: "SecurityQuestion1",
                table: "intern",
                type: "nvarchar(max)",
                nullable: true);

            migrationBuilder.AddColumn<string>(
                name: "SecurityQuestion2",
                table: "intern",
                type: "nvarchar(max)",
                nullable: true);

            migrationBuilder.AddColumn<string>(
                name: "SecurityQuestion3",
                table: "intern",
                type: "nvarchar(max)",
                nullable: true);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "IsPasswordReset",
                table: "intern");

            migrationBuilder.DropColumn(
                name: "SecurityAnswer1",
                table: "intern");

            migrationBuilder.DropColumn(
                name: "SecurityAnswer2",
                table: "intern");

            migrationBuilder.DropColumn(
                name: "SecurityAnswer3",
                table: "intern");

            migrationBuilder.DropColumn(
                name: "SecurityQuestion1",
                table: "intern");

            migrationBuilder.DropColumn(
                name: "SecurityQuestion2",
                table: "intern");

            migrationBuilder.DropColumn(
                name: "SecurityQuestion3",
                table: "intern");
        }
    }
}
