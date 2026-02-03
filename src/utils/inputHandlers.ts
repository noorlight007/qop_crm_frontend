/**
 * Utility functions for handling input field behaviors
 */

/**
 * Limits decimal input to a maximum of 2 decimal places
 * @param e - The input event from a number input field
 */
export const limitDecimalPlaces = (
  e: React.FormEvent<HTMLInputElement>,
  maxDecimals: number = 2,
): void => {
  const target = e.currentTarget;
  const val = target.value;

  if (!val) return;

  const parts = val.split(".");

  if (parts[1] && parts[1].length > maxDecimals) {
    target.value = `${parts[0]}.${parts[1].slice(0, maxDecimals)}`;
  }
};

/**
 * Props for number input fields with decimal limitation
 */
export const decimalInputProps = {
  inputMode: "decimal" as const,
  onInput: limitDecimalPlaces,
};

/**
 * Phone number validation
 */
export const validateAndSanitizePhone = (phone: string) => {
  // Remove all characters except digits and +
  const sanitized = phone.replace(/[^\d+]/g, "");

  // If empty, it's valid (let required validation handle it)
  if (!sanitized) {
    return {
      sanitized,
      isValid: true,
      errorMessage: "",
    };
  }

  // Count + symbols
  const plusCount = (sanitized.match(/\+/g) || []).length;

  // Check if + appears anywhere other than the first position
  const plusIndex = sanitized.indexOf("+");
  const hasInvalidPlus = plusIndex > 0 || plusCount > 1;

  // Determine if valid
  if (hasInvalidPlus) {
    return {
      sanitized,
      isValid: false,
      errorMessage:
        "Please enter a valid number (+ can only be at the beginning)",
    };
  }

  // Check if it matches the pattern: optional + at start, followed by digits
  const phoneRegex = /^\+?\d+$/;
  const isValid = phoneRegex.test(sanitized);

  return {
    sanitized,
    isValid,
    errorMessage: isValid ? "" : "Only + and digits are allowed",
  };
};

export const isValidPhoneNumber = (phone: string): boolean => {
  const phoneRegex = /^\+?\d*$/;
  return phoneRegex.test(phone);
};
