const ABSOLUTE_URL = /^[a-z][a-z\d+.-]*:\/\//i;

export const isExternalHref = (href: string): boolean => ABSOLUTE_URL.test(href);
