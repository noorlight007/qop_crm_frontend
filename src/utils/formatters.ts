// Utility formatters used across the app
export const formatChoiceFieldValue = (
  choiceFieldValue?: string | null
): string => {
  if (!choiceFieldValue) return "";
  return choiceFieldValue
    .split("_")
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
    .join(" ");
};
export default formatChoiceFieldValue;

export function formatUserTypeName(userType?: string | null): string {
  if (!userType) {
    return "";
  }
  // Remove everything up to and including the first underscore (if present)
  const afterPrefix = userType.includes("_")
    ? userType.replace(/^[^_]*_/, "")
    : userType;

  // Replace remaining underscores with spaces and title-case each word
  return afterPrefix
    .split("_")
    .map((w) => w.charAt(0).toUpperCase() + w.slice(1).toLowerCase())
    .join(" ");
}

export const calculateAge = (dob?: string | null) => {
  if (!dob) return "";
  const birth = new Date(dob);
  if (isNaN(birth.getTime())) return "";
  const today = new Date();
  let years = today.getFullYear() - birth.getFullYear();
  const m = today.getMonth() - birth.getMonth();
  if (m < 0 || (m === 0 && today.getDate() < birth.getDate())) {
    years--;
  }
  return years >= 0 ? `${years}` : "";
};
