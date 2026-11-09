// Full page load, for targets that must hit the server (e.g. route handlers
// that set cookies). Kept as its own module so tests can mock it, since
// jsdom does not allow window.location to be replaced.
export const hardNavigate = (url: string): void => {
  window.location.href = url;
};
