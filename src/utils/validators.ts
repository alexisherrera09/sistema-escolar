export function validateCURP(curp: string): boolean {
  const curpRegex = /^[A-Z]{4}\d{6}[HM][A-Z]{5}[0-9A-Z]\d$/;
  return curpRegex.test(curp.toUpperCase());
}

export function validateRFC(rfc: string): boolean {
  const rfcRegex = /^[A-ZÑ&]{3,4}\d{6}[A-Z0-9]{3}$/;
  return rfcRegex.test(rfc.toUpperCase());
}

export function validateEmail(email: string): boolean {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
}

export function validateAge(fechaNacimiento: string, minAge: number = 5, maxAge: number = 13): boolean {
  const birthDate = new Date(fechaNacimiento);
  const today = new Date();
  const age = today.getFullYear() - birthDate.getFullYear();
  const monthDiff = today.getMonth() - birthDate.getMonth();
  
  if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
    return age - 1 >= minAge && age - 1 <= maxAge;
  }
  
  return age >= minAge && age <= maxAge;
}

export function validatePassword(password: string): boolean {
  return password.length >= 6;
}
