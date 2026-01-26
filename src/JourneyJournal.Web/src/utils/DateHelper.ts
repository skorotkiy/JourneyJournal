export class DateHelper {
  static formatDate(dateString?: string): string | null {
    if (!dateString) return null;
    const date = new Date(dateString);
    const day = String(date.getDate()).padStart(2, '0');
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const year = date.getFullYear();
    return `${day}/${month}/${year}`;
  }

  static calculateNights(checkInDate?: string, checkOutDate?: string): number | null {
    if (!checkInDate || !checkOutDate) return null;
    const checkIn = new Date(checkInDate);
    const checkOut = new Date(checkOutDate);
    const diffTime = Math.abs(checkOut.getTime() - checkIn.getTime());
    return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  }

  // Returns 'YYYY-MM-DD' for date inputs (handles ISO or already-short strings)
  static formatDateShort(date?: string): string {
    if (!date) return '';
    return date.split('T')[0];
  }

  // Returns 'DD/MM/YYYY HH:MM' for display of date-times
  static formatDateTime(dateString?: string): string | null {
    if (!dateString) return null;
    const d = new Date(dateString);
    const dd = String(d.getDate()).padStart(2, '0');
    const mm = String(d.getMonth() + 1).padStart(2, '0');
    const yyyy = d.getFullYear();
    const hh = String(d.getHours()).padStart(2, '0');
    const min = String(d.getMinutes()).padStart(2, '0');
    return `${dd}/${mm}/${yyyy} ${hh}:${min}`;
  }
}
