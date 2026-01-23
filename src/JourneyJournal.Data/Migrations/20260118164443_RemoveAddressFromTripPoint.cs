using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace JourneyJournal.Data.Migrations
{
    /// <inheritdoc />
    public partial class RemoveAddressFromTripPoint : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "Address",
                table: "TripPoints");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<string>(
                name: "Address",
                table: "TripPoints",
                type: "TEXT",
                maxLength: 500,
                nullable: true);
        }
    }
}
