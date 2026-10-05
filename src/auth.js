// No backend, no database — the admin credential is hardcoded here.
// Change these two values to whatever you want before you deploy.
const ADMIN_USERNAME = "admin";
const ADMIN_PASSWORD = "ctgt-badminton-2026";

const SESSION_KEY = "ctgt_admin_authed";

export function checkCredentials(username, password) {
  return username === ADMIN_USERNAME && password === ADMIN_PASSWORD;
}

export function login() {
  sessionStorage.setItem(SESSION_KEY, "true");
}

export function logout() {
  sessionStorage.removeItem(SESSION_KEY);
}

export function isLoggedIn() {
  return sessionStorage.getItem(SESSION_KEY) === "true";
}
