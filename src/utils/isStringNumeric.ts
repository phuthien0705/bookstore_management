export function isStringNumeric(input: string): boolean {
  return /^\d+$/.test(input);
}
