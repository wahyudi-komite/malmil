export function formatDate(date: Date): string {
  return new Intl.DateTimeFormat('id-ID', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
    hour12: false,
    timeZone: 'Asia/Jakarta',
  })
    .format(new Date(date))
    .replace(/\//g, '-') // Ubah "/" menjadi "-"
    .replace(',', '') // Hilangkan koma setelah tanggal
    .replace(/\./g, ':'); // Ubah titik menjadi titik dua untuk jam
}
