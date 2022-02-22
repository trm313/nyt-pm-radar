/**
 * LOCALSTORAGE DATA STRUCTURE VERSIONING
 */

/*
 * History:
 * null -> Sheets API
 * 2    -> Forms API
 *
 * Operation:
 * - Currently, the web app will discard any stored objects that don't match this version on page load
 * - In the future, this could be used to trigger graceful migrations
 */
export const FORM_STORAGE_VERSION = 2;

/**
 * GOOGLE APP
 */

export const GOOGLE_CLIENT_ID =
  "12032474523-j8qabilh90gi615h4luvhc608aq4ar8n.apps.googleusercontent.com";
export const GOOGLE_SCOPE =
  "profile email https://www.googleapis.com/auth/forms.body.readonly https://www.googleapis.com/auth/forms.responses.readonly";
