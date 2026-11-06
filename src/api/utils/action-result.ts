export type ActionResult<T> =
  | { success: true; data: T }
  | {
      success: false;
      error: string;
      status?: number;
      sessionExpired?: boolean;
      /** Contract validation messages keyed by field name. */
      fieldErrors?: Record<string, string>;
    };
