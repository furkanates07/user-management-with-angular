export function isValidPhone(phone: string): boolean {
  const phoneRegex = /^\+?\d{10,14}$/;
  return phoneRegex.test(phone);
}
