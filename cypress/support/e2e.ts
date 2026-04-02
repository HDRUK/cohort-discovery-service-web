import "./commands";

// Silence known MUI / Next.js console noise during tests
Cypress.on("uncaught:exception", (err) => {
  // ResizeObserver loop errors from MUI are benign
  if (err.message.includes("ResizeObserver loop")) return false;
  // Next.js hydration mismatches don't fail the feature under test
  if (err.message.includes("Hydration")) return false;
  return true;
});
