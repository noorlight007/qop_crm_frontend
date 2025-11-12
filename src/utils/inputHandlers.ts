/**
 * Utility functions for handling input field behaviors
 */

/**
 * Limits decimal input to a maximum of 2 decimal places
 * @param e - The input event from a number input field
 */
export const limitDecimalPlaces = (
  e: React.FormEvent<HTMLInputElement>,
  maxDecimals: number = 2
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
