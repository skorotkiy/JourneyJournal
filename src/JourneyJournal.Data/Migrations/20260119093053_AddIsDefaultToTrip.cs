using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace JourneyJournal.Data.Migrations
{
    /// <inheritdoc />
    public partial class AddIsDefaultToTrip : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<bool>(
                name: "IsDefault",
                table: "Trips",
                type: "INTEGER",
                nullable: false,
                defaultValue: false);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "IsDefault",
                table: "Trips");
        }
    }
}
