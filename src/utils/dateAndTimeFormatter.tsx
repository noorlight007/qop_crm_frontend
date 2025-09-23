//export default function formatDateToDMY(isoDate: any) {
//   const date = new Date(isoDate);
//   const day = String(date.getDate()).padStart(2, "0");
//   const month = String(date.getMonth() + 1).padStart(2, "0");
//   const year = date.getFullYear();
//   const hours = String(date.getHours()).padStart(2, "0");
//   const minutes = String(date.getMinutes()).padStart(2, "0");
//   const seconds = String(date.getSeconds()).padStart(2, "0");
//   return `${day}/${month}/${year}, ${hours}:${minutes}:${seconds}`;

export function formatDateToDMYAndTime(isoDate: any) {
  const date = new Date(isoDate);
  return date
    .toLocaleString("en-GB", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
      second: "2-digit",
      hour12: true,
      hourCycle: "h12",
    })
    .toUpperCase();
}

export function formatDateToDMY(isoDate: any) {
  const date = new Date(isoDate);
  return date
    .toLocaleString("en-GB", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
    })
    .toUpperCase();
}
