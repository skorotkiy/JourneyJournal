using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace JourneyJournal.Data.Migrations
{
    /// <inheritdoc />
    public partial class AddNotesToExpense : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<string>(
                name: "Notes",
                table: "Expenses",
                type: "TEXT",
                maxLength: 200,
                nullable: true);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "Notes",
                table: "Expenses");
        }
    }
}
