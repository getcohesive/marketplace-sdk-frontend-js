export const ERROR = 1;
export const DEBUG = 2;
const LOG_PREFIX = 'COHESIVE_SDK';
const LOG_LEVEL = ERROR;

/**
 * SDK Log fn
 * @param {number} level log enum - Error: 1, Debug: 2
 * @param {any} message log message
 */
export const log = (level: number, message: any) => {
  if (level < LOG_LEVEL) {
    return;
  }
  switch (level) {
    case undefined:
      console.debug(LOG_PREFIX, message);
      break;
    case ERROR:
      console.error(LOG_PREFIX, message);
      break;
    case DEBUG:
      console.debug(LOG_PREFIX, message);
      break;
    default:
      console.debug(LOG_PREFIX, message);
      break;
  }
};

/**
 * Returns a JS object representation of a Javascript Web Token from its common encoded
 * string form.
 *
 * @template T the expected shape of the parsed token
 * @param {string} token a Javascript Web Token in base64 encoded, `.` separated form
 * @returns {(T | undefined)} an object-representation of the token
 * or undefined if parsing failed
 */
export function parseJwt<T>(token: string): T | undefined {
  const base64Url = token.split('.')[1];
  const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
  const jsonPayload = decodeURIComponent(
    window
      .atob(base64)
      .split('')
      .map(function (c) {
        return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
      })
      .join('')
  );

  return JSON.parse(jsonPayload);
}
