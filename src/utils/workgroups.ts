const ACRONYMS = new Set(["UK", "EU", "US", "NHS", "SDE"]);

const formatWorkgroupName = (value: string) => {
  const parts = value.split("-");

  return parts
    .map((part, index) => {
      if (ACRONYMS.has(part)) return part;

      const lower = part.toLowerCase();
      const capitalised = lower.charAt(0).toUpperCase() + lower.slice(1);

      if (ACRONYMS.has(parts[index + 1])) {
        return `${capitalised}-`;
      }

      return capitalised;
    })
    .join(" ")
    .replace(/-\s/g, "-");
};

export { formatWorkgroupName };
