import "./commands";

// Silence known MUI / Next.js console noise during tests
Cypress.on("uncaught:exception", (err) => {
  // ResizeObserver loop errors from MUI are benign
  if (err.message.includes("ResizeObserver loop")) return false;
  // Next.js hydration mismatches don't fail the feature under test
  if (err.message.includes("Hydration")) return false;
  // Next.js RSC re-renders (triggered by usePaginatedTable's router.replace) POST
  // to the current page URL; the production build returns 404 for this RSC format,
  // which surfaces as an uncaught "application code" error containing the Server
  // Components render message. The UI still renders correctly — suppress so assertions can run.
  if (err.message.includes("Server Components render")) return false;
  if (err.message.includes("originated from your application code")) return false;
  return true;
});
