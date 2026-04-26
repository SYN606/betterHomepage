export const COMMAND_PREFIXES = [
  "yt",
  "wiki",
  "map",
  "gm",
  "gh",
  "calc",
  "notes",
  "todo",
];

export const isCommandInput = (input) => {
  const value = input.trim().toLowerCase();
  if (!value) return false;

  const firstWord = value.split(" ")[0];
  return COMMAND_PREFIXES.includes(firstWord);
};

export const isLikelyUrl = (input) => {
  const value = input.trim().toLowerCase();

  if (!value) return false;

  // Commands should be handled before URL detection
  if (isCommandInput(value)) return false;

  // Spaces usually indicate search text, not URLs
  if (value.includes(" ")) return false;

  // Supported protocols
  if (
    /^(https?|ftp|ws|wss|file):\/\//.test(value) ||
    /^mailto:/.test(value) ||
    /^tel:/.test(value)
  ) {
    return true;
  }

  // localhost support
  if (value.startsWith("localhost")) return true;

  // Local/public IPv4 support
  if (
    /^(\d{1,3}\.){3}\d{1,3}(:\d+)?(\/.*)?$/.test(value)
  ) {
    return true;
  }

  // Domain + subdomain support
  if (
    /^(?:[a-z0-9](?:[a-z0-9-]{0,61}[a-z0-9])?\.)+[a-z]{2,}(:\d+)?(\/.*)?$/i.test(
      value
    )
  ) {
    // Prevent malformed domains like google..com
    if (value.includes("..") || value.endsWith(".")) {
      return false;
    }

    return true;
  }

  return false;
};

export const normalizeUrl = (input) => {
  const value = input.trim();

  if (!value) return "";

  // Already valid protocol
  if (
    /^(https?|ftp|ws|wss|file):\/\//i.test(value) ||
    /^mailto:/i.test(value) ||
    /^tel:/i.test(value)
  ) {
    return value;
  }

  // localhost or IPs should use http by default
  if (
    value.startsWith("localhost") ||
    /^(\d{1,3}\.){3}\d{1,3}/.test(value)
  ) {
    return `http://${value}`;
  }

  // Everything else defaults to https
  return `https://${value}`;
};
