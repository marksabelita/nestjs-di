import {
  map,
  join,
  pipe,
  times,
  append,
  concat,
  repeat,
  flatten,
  replace,
  head,
  last,
} from 'ramda';
import { isString } from 'util';

export const REDACTED = '[REDACTED]';

export const PATHS = [
  `["X-SP-GATEWAY"]`,
  `["MD-API-TOKEN"]`,
  `["MD-API-KEY"]`,
  `["X-API-KEY"]`,

  'authorization',
  'refreshToken',
  'bearerToken',
  'oauthKey',
  'apiKey',
  'tokens',
  'token',

  'socialSecurity',
  'ssnFilter',
  'ssn',

  'encryptedSecurityCode',
  'encryptedCardNumber',
  'encryptedExpiryDate',
  'encryptedCardData',
  'securityCode',
  'cardNumber',
  'expiryDate',

  'accountNumber',
  'routingNumber',
  'phoneNumber',
  'phone',

  'oldPassword',
  'newPassword',
  'password',

  'username',
  'emailFilter',
  'email',
  'login',
  'sub',
];

export const censorString = (word: string, mask = '.', count = 3) => {
  return head(word) + repeat(mask, count).join('') + last(word);
};

export const censorNumber = (
  number: string,
  chars = 4,
): string | string[] | undefined => {
  if (Array.isArray(number)) {
    return number.map((n) => censorNumber(n, chars)) as string[];
  }

  if (!isString(number)) return undefined;

  return `...${number.slice(-chars)}`;
};

export const censorEmail = (email: string): string | string[] | undefined => {
  if (Array.isArray(email)) {
    return email.map(censorEmail) as string[];
  }

  if (!isString(email)) return undefined;

  const [alias, domain] = email.split('@');

  return `${censorString(alias)}@${domain}`;
};

export const censorToken = (token: string, chars = 4) => {
  if (Array.isArray(token)) {
    return '[REDACTED]';
  }

  return `${token.slice(0, chars)}...${token.slice(-chars)}`;
};

export const mapKey = (key: string, depth = 6): string[] =>
  times(pipe(repeat('*.'), append(key), join(''), replace('.[', '[')), depth);

export const mapKeys = pipe(map(mapKey), flatten);

export const mapPaths = concat(mapKeys(PATHS));

export const censorValue = (
  value: string,
  path: string[],
): string | string[] | undefined => {
  if (!value) return undefined;

  const lastPath = path[path.length - 1];

  if (lastPath.toLowerCase().endsWith('token')) {
    return censorToken(value);
  }

  switch (lastPath) {
    case 'password':
    case 'oldPassword':
    case 'newPassword':
    case 'socialSecurity':
    case 'ssnFilter':
    case 'ssn':
      return REDACTED;
    case 'sub':
    case 'login':
    case 'email':
    case 'username':
    case 'emailFilter':
      return censorEmail(value);
    case 'token':
    case 'tokens':
    case 'apiKey':
    case 'oauthKey':
    case 'authorization':
      return censorToken(value);
    case 'cardNumber':
    case 'securityCode':
    case 'encryptedCardData':
    case 'encryptedCardNumber':
    case 'encryptedExpiryDate':
    case 'encryptedSecurityCode':
      return censorToken(value);
    case 'X-API-KEY':
    case 'MD-API-KEY':
    case 'MD-API-TOKEN':
    case 'X-SP-GATEWAY':

    case 'phone':
    case 'phoneNumber':
    case 'accountNumber':
    case 'routingNumber':
      return censorNumber(value);
    default:
      return censorString(value);
  }
};
