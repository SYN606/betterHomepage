import { SEARCH_ENGINES } from "../utils/searchEngines";
import {
  isLikelyUrl,
  normalizeUrl,
  isCommandInput,
} from "../utils/inputUtils";

// Pattern Detectors
const isEmail = (value) =>
  /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);

const isUsername = (value) =>
  /^@[a-z0-9._-]{3,}$/i.test(value);

const isCVE = (value) =>
  /^cve-\d{4}-\d{4,}$/i.test(value);

const isIPv4 = (value) =>
  /^(\d{1,3}\.){3}\d{1,3}$/.test(value);

const isIPv4Subnet = (value) =>
  /^(\d{1,3}\.){3}\d{1,3}\/\d{1,2}$/.test(value);

const isEthAddress = (value) =>
  /^0x[a-fA-F0-9]{40}$/.test(value);

const isBtcAddress = (value) =>
  /^(1|3|bc1)[a-zA-HJ-NP-Z0-9]{25,39}$/.test(value);

const isNpmPackage = (value) =>
  /^@[a-z0-9-~][a-z0-9-._~]*\/[a-z0-9-._~]+$/i.test(value);

function parseCommand(input) {
  const trimmed = input.trim();
  const [command, ...rest] = trimmed.split(" ");
  const query = rest.join(" ").trim();

  switch (command.toLowerCase()) {
    case "yt":
      return {
        type: "command",
        url: query
          ? `https://www.youtube.com/results?search_query=${encodeURIComponent(query)}`
          : "https://www.youtube.com",
      };

    case "wiki":
      return {
        type: "command",
        url: query
          ? `https://en.wikipedia.org/wiki/Special:Search?search=${encodeURIComponent(query)}`
          : "https://en.wikipedia.org",
      };

    case "map":
    case "maps":
      return {
        type: "command",
        url: query
          ? `https://www.google.com/maps/search/${encodeURIComponent(query)}`
          : "https://maps.google.com",
      };

    case "gm":
    case "mail":
      return {
        type: "command",
        url: "https://mail.google.com/mail/u/0/#inbox",
      };

    case "gh":
      return {
        type: "command",
        url: query
          ? `https://github.com/search?q=${encodeURIComponent(query)}`
          : "https://github.com",
      };

    case "r":
    case "reddit":
      return {
        type: "command",
        url: query
          ? `https://www.reddit.com/search/?q=${encodeURIComponent(query)}`
          : "https://www.reddit.com",
      };

    case "npm":
      return {
        type: "command",
        url: query
          ? `https://www.npmjs.com/search?q=${encodeURIComponent(query)}`
          : "https://www.npmjs.com",
      };

    case "pip":
    case "pypi":
      return {
        type: "command",
        url: query
          ? `https://pypi.org/search/?q=${encodeURIComponent(query)}`
          : "https://pypi.org",
      };

    case "ai":
    case "gpt":
      return {
        type: "command",
        url: query
          ? `https://chatgpt.com/?q=${encodeURIComponent(query)}`
          : "https://chatgpt.com",
      };

    case "doc":
    case "docs":
      return {
        type: "command",
        url: "https://docs.google.com",
      };

    case "drive":
      return {
        type: "command",
        url: "https://drive.google.com",
      };

    case "calc":
      return {
        type: "command",
        url: `https://www.google.com/search?q=${encodeURIComponent(query || "calculator")}`,
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

export function analyzeInput(input, engineKey = "duckduckgo") {
  const query = input.trim();

  if (!query) return null;

  /* 1. Quick Commands (yt, wiki, gh, r, npm, ai, etc.) */
  if (isCommandInput(query)) {
    const commandResult = parseCommand(query);
    if (commandResult) return commandResult;
  }

  /* 2. Direct Web URLs */
  if (isLikelyUrl(query)) {
    return {
      type: "url",
      url: normalizeUrl(query),
    };
  }

  /* 3. Scoped NPM Packages (@babel/core, @types/react) */
  if (isNpmPackage(query)) {
    return {
      type: "npm",
      url: `https://www.npmjs.com/package/${query}`,
    };
  }

  /* 4. IPv4 Single IP OSINT */
  if (isIPv4(query)) {
    return {
      type: "ip",
      urls: [
        `https://www.virustotal.com/gui/ip-address/${query}`,
        `https://www.abuseipdb.com/check/${query}`,
        `https://shodan.io/host/${query}`,
      ],
    };
  }

  /* 5. IPv4 Subnet Range Lookups */
  if (isIPv4Subnet(query)) {
    return {
      type: "subnet",
      urls: [
        `https://bgp.he.net/net/${query}`,
        `https://shodan.io/search?query=net:${query}`,
      ],
    };
  }

  /* 6. Crypto Blockchain Lookups */
  if (isEthAddress(query)) {
    return {
      type: "eth",
      url: `https://etherscan.io/address/${query}`,
    };
  }

  if (isBtcAddress(query)) {
    return {
      type: "btc",
      url: `https://www.blockchain.com/explorer/addresses/btc/${query}`,
    };
  }

  /* 7. CVE Vulnerability Intelligence */
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

  /* 8. Email OSINT & Data Breach Checks */
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

  /* 9. Username Social Footprint Lookups */
  if (isUsername(query)) {
    const username = query.slice(1);

    return {
      type: "username",
      urls: [
        `https://github.com/${username}`,
        `https://x.com/${username}`,
        `https://www.reddit.com/user/${username}`,
      ],
    };
  }

  /* 10. Default Search Engine Query */
  const engine = SEARCH_ENGINES[engineKey] || SEARCH_ENGINES["duckduckgo"];
  return {
    type: "search",
    url: engine.url + encodeURIComponent(query),
  };
}