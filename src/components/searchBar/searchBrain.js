import { SEARCH_ENGINES } from "./searchEngines";
import {
  isLikelyUrl,
  normalizeUrl,
  isCommandInput,
} from "./inputUtils";

const isEmail = (value) =>
  /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);

const isUsername = (value) =>
  /^@[a-z0-9._-]{3,}$/i.test(value);

const isCVE = (value) =>
  /^cve-\d{4}-\d{4,}$/i.test(value);

const isIPv4 = (value) =>
  /^(\d{1,3}\.){3}\d{1,3}$/.test(value);

function parseCommand(input) {
  const trimmed = input.trim();
  const [command, ...rest] = trimmed.split(" ");
  const query = rest.join(" ").trim();

  switch (command.toLowerCase()) {
    case "yt":
      return {
        type: "command",
        url: `https://www.youtube.com/results?search_query=${encodeURIComponent(query)}`,
      };

    case "wiki":
      return {
        type: "command",
        url: `https://en.wikipedia.org/wiki/Special:Search?search=${encodeURIComponent(query)}`,
      };

    case "map":
      return {
        type: "command",
        url: `https://www.google.com/maps/search/${encodeURIComponent(query)}`,
      };

    case "gm":
      return {
        type: "command",
        url: "https://mail.google.com/mail/u/0/#inbox",
      };

    case "gh":
      return {
        type: "command",
        url: `https://github.com/search?q=${encodeURIComponent(query)}`,
      };

    case "calc":
      return {
        type: "command",
        url: `https://www.google.com/search?q=${encodeURIComponent(query)}`,
      };

    case "notes":
      return {
        type: "command",
        url: "https://keep.google.com/",
      };

    case "todo":
      return {
        type: "command",
        url: "https://calendar.google.com/calendar/u/0/r/tasks",
      };

    default:
      return null;
  }
}

export function analyzeInput(input, engineKey) {
  const query = input.trim();

  if (!query) return null;

  /* Commands */
  if (isCommandInput(query)) {
    const commandResult = parseCommand(query);
    if (commandResult) return commandResult;
  }

  /* URL / Domain / IP */
  if (isLikelyUrl(query)) {
    return {
      type: "url",
      url: normalizeUrl(query),
    };
  }

  /* Direct IP Intelligence */
  if (isIPv4(query)) {
    return {
      type: "ip",
      urls: [
        `https://www.virustotal.com/gui/ip-address/${query}`,
        `https://www.abuseipdb.com/check/${query}`,
      ],
    };
  }

  /* CVE Lookup */
  if (isCVE(query)) {
    const cve = query.toUpperCase();

    return {
      type: "cve",
      urls: [
        `https://nvd.nist.gov/vuln/detail/${cve}`,
        `https://cve.mitre.org/cgi-bin/cvename.cgi?name=${cve}`,
        `https://www.exploit-db.com/search?cve=${cve}`,
      ],
    };
  }

  /* Email OSINT */
  if (isEmail(query)) {
    return {
      type: "email",
      urls: [
        `https://github.com/search?q=${encodeURIComponent(`"${query}"`)}`,
        `https://www.google.com/search?q=${encodeURIComponent(`"${query}"`)}`,
        `https://haveibeenpwned.com/`,
      ],
    };
  }

  /* Username OSINT */
  if (isUsername(query)) {
    const username = query.slice(1);

    return {
      type: "username",
      urls: [
        `https://github.com/${username}`,
        `https://twitter.com/${username}`,
        `https://www.reddit.com/user/${username}`,
      ],
    };
  }

  /* Default Search */
  return {
    type: "search",
    url:
      SEARCH_ENGINES[engineKey].url +
      encodeURIComponent(query),
  };
}
