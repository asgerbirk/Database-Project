// TODO Opsæt hjælpe funktioner til at validere data til brug i unit tests

export async function validateEmail(email: string) {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
}

export async function validatePassword(password: string) {
  const passwordRegex = /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z]).{8,}$/;
  return passwordRegex.test(password);
}

export async function validateFirstName(name: string) {
  const nameRegex = /^[a-zA-Z]+$/;
  return nameRegex.test(name);
}

export async function validateLastName(name: string) {
  const nameRegex = /^[a-zA-Z]+$/;
  return nameRegex.test(name);
}

export async function validateMembershipId(membershipId: string) {
  const membershipIdRegex = /^[0-9]+$/;
  return membershipIdRegex.test(membershipId);
}

export async function validateDate(date: string) {
  const dateRegex = /^\d{4}-\d{2}-\d{2}$/;
  return dateRegex.test(date);
}

export async function validateAddress(address: string) {
  const addressRegex = /^[a-zA-Z0-9\s,'-]*$/;
  return addressRegex.test(address);
}

export async function validatePhoneNumber(phoneNumber: string) {
  const phoneRegex = /^\d{8}$/;
  return phoneRegex.test(phoneNumber);
}