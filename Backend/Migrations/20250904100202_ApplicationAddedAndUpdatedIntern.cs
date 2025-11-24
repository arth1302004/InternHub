using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace InternAttendenceSystem.Migrations
{
    /// <inheritdoc />
    public partial class ApplicationAddedAndUpdatedIntern : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<string>(
                name: "Address",
                table: "intern",
                type: "nvarchar(max)",
                nullable: false,
                defaultValue: "");

            migrationBuilder.AddColumn<string>(
                name: "Availability",
                table: "intern",
                type: "nvarchar(max)",
                nullable: false,
                defaultValue: "");

            migrationBuilder.AddColumn<double>(
                name: "CGPA",
                table: "intern",
                type: "float",
                nullable: true);

            migrationBuilder.AddColumn<string>(
                name: "ContactNumber",
                table: "intern",
                type: "nvarchar(max)",
                nullable: false,
                defaultValue: "");

            migrationBuilder.AddColumn<DateTime>(
                name: "DateOfBirth",
                table: "intern",
                type: "datetime2",
                nullable: false,
                defaultValue: new DateTime(1, 1, 1, 0, 0, 0, 0, DateTimeKind.Unspecified));

            migrationBuilder.AddColumn<string>(
                name: "Degree",
                table: "intern",
                type: "nvarchar(max)",
                nullable: false,
                defaultValue: "");

            migrationBuilder.AddColumn<string>(
                name: "EducationLevel",
                table: "intern",
                type: "nvarchar(max)",
                nullable: false,
                defaultValue: "");

            migrationBuilder.AddColumn<string>(
                name: "EmergencyContact",
                table: "intern",
                type: "nvarchar(max)",
                nullable: false,
                defaultValue: "");

            migrationBuilder.AddColumn<string>(
                name: "EnrollmentNumber",
                table: "intern",
                type: "nvarchar(max)",
                nullable: false,
                defaultValue: "");

            migrationBuilder.AddColumn<string>(
                name: "Gender",
                table: "intern",
                type: "nvarchar(max)",
                nullable: false,
                defaultValue: "");

            migrationBuilder.AddColumn<string>(
                name: "GitHubUrl",
                table: "intern",
                type: "nvarchar(max)",
                nullable: false,
                defaultValue: "");

            migrationBuilder.AddColumn<string>(
                name: "InternshipRole",
                table: "intern",
                type: "nvarchar(max)",
                nullable: false,
                defaultValue: "");

            migrationBuilder.AddColumn<string>(
                name: "LinkedInUrl",
                table: "intern",
                type: "nvarchar(max)",
                nullable: false,
                defaultValue: "");

            migrationBuilder.AddColumn<string>(
                name: "LocationPreference",
                table: "intern",
                type: "nvarchar(max)",
                nullable: false,
                defaultValue: "");

            migrationBuilder.AddColumn<string>(
                name: "ModeOfInternship",
                table: "intern",
                type: "nvarchar(max)",
                nullable: false,
                defaultValue: "");

            migrationBuilder.AddColumn<string>(
                name: "MotivationStatement",
                table: "intern",
                type: "nvarchar(max)",
                nullable: false,
                defaultValue: "");

            migrationBuilder.AddColumn<string>(
                name: "Nationality",
                table: "intern",
                type: "nvarchar(max)",
                nullable: false,
                defaultValue: "");

            migrationBuilder.AddColumn<string>(
                name: "PortfolioUrl",
                table: "intern",
                type: "nvarchar(max)",
                nullable: false,
                defaultValue: "");

            migrationBuilder.AddColumn<DateTime>(
                name: "PreferredEndDate",
                table: "intern",
                type: "datetime2",
                nullable: false,
                defaultValue: new DateTime(1, 1, 1, 0, 0, 0, 0, DateTimeKind.Unspecified));

            migrationBuilder.AddColumn<DateTime>(
                name: "PreferredStartDate",
                table: "intern",
                type: "datetime2",
                nullable: false,
                defaultValue: new DateTime(1, 1, 1, 0, 0, 0, 0, DateTimeKind.Unspecified));

            migrationBuilder.AddColumn<string>(
                name: "PreviousExperience",
                table: "intern",
                type: "nvarchar(max)",
                nullable: false,
                defaultValue: "");

            migrationBuilder.AddColumn<string>(
                name: "ResumeUrl",
                table: "intern",
                type: "nvarchar(max)",
                nullable: false,
                defaultValue: "");

            migrationBuilder.AddColumn<string>(
                name: "SoftSkills",
                table: "intern",
                type: "nvarchar(max)",
                nullable: false,
                defaultValue: "");

            migrationBuilder.AddColumn<string>(
                name: "SourceOfApplication",
                table: "intern",
                type: "nvarchar(max)",
                nullable: false,
                defaultValue: "");

            migrationBuilder.AddColumn<string>(
                name: "TechnicalSkills",
                table: "intern",
                type: "nvarchar(max)",
                nullable: false,
                defaultValue: "");

            migrationBuilder.AddColumn<string>(
                name: "UniversityName",
                table: "intern",
                type: "nvarchar(max)",
                nullable: false,
                defaultValue: "");

            migrationBuilder.AddColumn<string>(
                name: "YearOfStudy",
                table: "intern",
                type: "nvarchar(max)",
                nullable: false,
                defaultValue: "");

            migrationBuilder.CreateTable(
                name: "Applications",
                columns: table => new
                {
                    applicationId = table.Column<Guid>(type: "uniqueidentifier", nullable: false),
                    FullName = table.Column<string>(type: "nvarchar(100)", maxLength: 100, nullable: false),
                    DateOfBirth = table.Column<DateTime>(type: "datetime2", nullable: false),
                    Gender = table.Column<string>(type: "nvarchar(max)", nullable: false),
                    ContactNumber = table.Column<string>(type: "nvarchar(max)", nullable: false),
                    Email = table.Column<string>(type: "nvarchar(450)", nullable: false),
                    Address = table.Column<string>(type: "nvarchar(max)", nullable: false),
                    Nationality = table.Column<string>(type: "nvarchar(max)", nullable: false),
                    EducationLevel = table.Column<string>(type: "nvarchar(max)", nullable: false),
                    UniversityName = table.Column<string>(type: "nvarchar(max)", nullable: false),
                    Degree = table.Column<string>(type: "nvarchar(max)", nullable: false),
                    YearOfStudy = table.Column<string>(type: "nvarchar(max)", nullable: false),
                    EnrollmentNumber = table.Column<string>(type: "nvarchar(450)", nullable: false),
                    CGPA = table.Column<double>(type: "float", nullable: true),
                    InternshipRole = table.Column<string>(type: "nvarchar(max)", nullable: false),
                    PreferredStartDate = table.Column<DateTime>(type: "datetime2", nullable: false),
                    PreferredEndDate = table.Column<DateTime>(type: "datetime2", nullable: false),
                    ModeOfInternship = table.Column<string>(type: "nvarchar(max)", nullable: false),
                    LocationPreference = table.Column<string>(type: "nvarchar(max)", nullable: false),
                    TechnicalSkills = table.Column<string>(type: "nvarchar(max)", nullable: false),
                    SoftSkills = table.Column<string>(type: "nvarchar(max)", nullable: false),
                    PreviousExperience = table.Column<string>(type: "nvarchar(max)", nullable: false),
                    ResumeUrl = table.Column<string>(type: "nvarchar(max)", nullable: false),
                    PortfolioUrl = table.Column<string>(type: "nvarchar(max)", nullable: false),
                    LinkedInUrl = table.Column<string>(type: "nvarchar(max)", nullable: false),
                    GitHubUrl = table.Column<string>(type: "nvarchar(max)", nullable: false),
                    MotivationStatement = table.Column<string>(type: "nvarchar(max)", nullable: false),
                    SourceOfApplication = table.Column<string>(type: "nvarchar(max)", nullable: false),
                    Availability = table.Column<string>(type: "nvarchar(max)", nullable: false),
                    EmergencyContact = table.Column<string>(type: "nvarchar(max)", nullable: false),
                    AgreementAccepted = table.Column<bool>(type: "bit", nullable: false),
                    RequestDate = table.Column<DateTime>(type: "datetime2", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Applications", x => x.applicationId);
                });

            migrationBuilder.CreateIndex(
                name: "IX_Applications_Email",
                table: "Applications",
                column: "Email",
                unique: true);

            migrationBuilder.CreateIndex(
                name: "IX_Applications_EnrollmentNumber",
                table: "Applications",
                column: "EnrollmentNumber",
                unique: true);

            migrationBuilder.CreateIndex(
                name: "IX_Applications_RequestDate",
                table: "Applications",
                column: "RequestDate");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropTable(
                name: "Applications");

            migrationBuilder.DropColumn(
                name: "Address",
                table: "intern");

            migrationBuilder.DropColumn(
                name: "Availability",
                table: "intern");

            migrationBuilder.DropColumn(
                name: "CGPA",
                table: "intern");

            migrationBuilder.DropColumn(
                name: "ContactNumber",
                table: "intern");

            migrationBuilder.DropColumn(
                name: "DateOfBirth",
                table: "intern");

            migrationBuilder.DropColumn(
                name: "Degree",
                table: "intern");

            migrationBuilder.DropColumn(
                name: "EducationLevel",
                table: "intern");

            migrationBuilder.DropColumn(
                name: "EmergencyContact",
                table: "intern");

            migrationBuilder.DropColumn(
                name: "EnrollmentNumber",
                table: "intern");

            migrationBuilder.DropColumn(
                name: "Gender",
                table: "intern");

            migrationBuilder.DropColumn(
                name: "GitHubUrl",
                table: "intern");

            migrationBuilder.DropColumn(
                name: "InternshipRole",
                table: "intern");

            migrationBuilder.DropColumn(
                name: "LinkedInUrl",
                table: "intern");

            migrationBuilder.DropColumn(
                name: "LocationPreference",
                table: "intern");

            migrationBuilder.DropColumn(
                name: "ModeOfInternship",
                table: "intern");

            migrationBuilder.DropColumn(
                name: "MotivationStatement",
                table: "intern");

            migrationBuilder.DropColumn(
                name: "Nationality",
                table: "intern");

            migrationBuilder.DropColumn(
                name: "PortfolioUrl",
                table: "intern");

            migrationBuilder.DropColumn(
                name: "PreferredEndDate",
                table: "intern");

            migrationBuilder.DropColumn(
                name: "PreferredStartDate",
                table: "intern");

            migrationBuilder.DropColumn(
                name: "PreviousExperience",
                table: "intern");

            migrationBuilder.DropColumn(
                name: "ResumeUrl",
                table: "intern");

            migrationBuilder.DropColumn(
                name: "SoftSkills",
                table: "intern");

            migrationBuilder.DropColumn(
                name: "SourceOfApplication",
                table: "intern");

            migrationBuilder.DropColumn(
                name: "TechnicalSkills",
                table: "intern");

            migrationBuilder.DropColumn(
                name: "UniversityName",
                table: "intern");

            migrationBuilder.DropColumn(
                name: "YearOfStudy",
                table: "intern");
        }
    }
}
