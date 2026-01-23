using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace JourneyJournal.Data.Migrations
{
    /// <inheritdoc />
    public partial class AddPlannedCostToTrip : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<decimal>(
                name: "PlannedCost",
                table: "Trips",
                type: "TEXT",
                nullable: true);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "PlannedCost",
                table: "Trips");
        }
    }
}
