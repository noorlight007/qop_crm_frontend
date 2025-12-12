export function formatDateAndTime(isoDate: any) {
  if (isoDate == null) return "";
  const date = new Date(isoDate);
  if (isNaN(date.getTime())) return "";
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  const hours = String(date.getHours()).padStart(2, "0");
  const minutes = String(date.getMinutes()).padStart(2, "0");
  const seconds = String(date.getSeconds()).padStart(2, "0");
  return `${year}-${month}-${day}, ${hours}:${minutes}:${seconds}`;
}

export function formatDate(isoDate: any): string {
  if (isoDate == null) return "";
  const date = new Date(isoDate);
  if (isNaN(date.getTime())) return "";
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
}

export function calculateMonthsDuration(
  startDate: string | null | undefined
): string {
  if (!startDate) return "0m";

  const startDateObj = new Date(startDate);
  const endDate = new Date();

  if (isNaN(startDateObj.getTime())) return "0m";

  let months = (endDate.getFullYear() - startDateObj.getFullYear()) * 12;
  months += endDate.getMonth() - startDateObj.getMonth();

  return `${Math.max(0, months)}m`;
}
