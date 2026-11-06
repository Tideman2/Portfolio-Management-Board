/**
 * Destructive confirmations require the exact value, trimmed but
 * case-sensitive, so a reflexive click cannot erase an account.
 */
export const isConfirmationMatch = (
  expected: string,
  input: string,
): boolean => {
  const trimmedInput = input.trim();

  return trimmedInput.length > 0 && trimmedInput === expected.trim();
};
