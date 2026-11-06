const BACKEND_URL_ENV = "ADMIN_BACKEND_URL";

/**
 * Resolves the admin backend base URL lazily so builds and static generation
 * can run without the variable configured. Throws only when a request actually
 * needs the backend, making deployment misconfiguration explicit.
 */
export const getBackendBaseUrl = (): string => {
  const raw = process.env.ADMIN_BACKEND_URL?.trim();

  if (!raw) {
    throw new Error(
      `${BACKEND_URL_ENV} is not set. Configure the admin backend base URL.`,
    );
  }

  const value = raw.replace(/\/+$/, "");

  if (!value) {
    throw new Error(
      `${BACKEND_URL_ENV} is not a valid backend base URL.`,
    );
  }

  return value;
};
