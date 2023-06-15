import { transliterate } from 'transliteration';

import { FullName } from 'modules/user/types';
import { getInitials } from 'utils/names';

const alpha = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ';
const numbers = '0123456789';
// const symbols = '!@#$%^&*_-+=';

const chars = alpha + numbers;

export function getRandomPassword(length: number): string {
  let password = '';
  for (let i = 0; i < length; i += 1) {
    password += chars[Math.floor(Math.random() * chars.length)];
  }
  return password;
}

export function randInt(min: number, max: number): number {
  return Math.floor(Math.random() * (max - min) + min);
}

export function getRandomCredentials(
  fullName: FullName,
  passwordLength: number,
): {
  randUsername: string;
  randPassword: string;
} {
  const initals = getInitials(fullName).replaceAll(' ', '');
  const randDiscriminator = randInt(1000, 10_000);
  const randUsername = `${transliterate(initals)}-${randDiscriminator}`;
  const randPassword = getRandomPassword(passwordLength);
  return { randUsername, randPassword };
}
