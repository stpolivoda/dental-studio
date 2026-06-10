export function isValidName(value) {
  return typeof value === 'string' && value.trim().length >= 2;
}

export function isValidPhone(value) {
  if (typeof value !== 'string') return false;
  const trimmed = value.trim();
  if (!/^\+?[\d\s()-]{7,20}$/.test(trimmed)) return false;
  const digits = trimmed.replace(/\D/g, '');
  return digits.length >= 7 && digits.length <= 15;
}
