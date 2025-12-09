// Utility formatters used across the app
export function formatChoiceFieldValue(
  choiceFieldValue?: string | null
): string {
  if (!choiceFieldValue) return "";
  return choiceFieldValue
    .split("_")
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
    .join(" ");
}

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
