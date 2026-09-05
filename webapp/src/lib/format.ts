export function format(date: Date, pattern: string): string {
  const pad = (n: number) => n.toString().padStart(2, "0");
  const day = pad(date.getDate());
  const month = pad(date.getMonth() + 1);
  const year = date.getFullYear();
  const hours = pad(date.getHours());
  const minutes = pad(date.getMinutes());

  return pattern
    .replace("dd", day)
    .replace("MM", month)
    .replace("yyyy", year.toString())
    .replace("HH", hours)
    .replace("mm", minutes);
}
