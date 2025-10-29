// Utility formatters used across the app
export const formatChoiceFieldValue = (userType?: string | null): string => {
  if (!userType) return "";
  return userType
    .split("_")
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
    .join(" ");
};

export default formatChoiceFieldValue;
