import { SEARCH_ENGINES } from "./searchEngines";
import { isLikelyUrl, normalizeUrl } from "./inputUtils";

const isEmail = (v) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v);
const isUsername = (v) => /^@[a-z0-9_]{3,}$/i.test(v);
const isCVE = (v) => /^cve-\d{4}-\d{4,}$/i.test(v);

export function analyzeInput(input, engineKey) {
  const q = input.trim();
  if (!q) return null;

  /* URL / IP */
  if (isLikelyUrl(q)) {
    return {
      type: "url",
      url: normalizeUrl(q)
    };
  }

  /* CVE */
  if (isCVE(q)) {
    const cve = q.toUpperCase();
    return {
      type: "cve",
      urls: [
        `https://nvd.nist.gov/vuln/detail/${cve}`,
        `https://www.exploit-db.com/search?cve=${cve}`
      ]
    };
  }

  /* Email OSINT */
  if (isEmail(q)) {
    return {
      type: "email",
      urls: [
        `https://www.dehashed.com/search?query=${q}`,
        `https://github.com/search?q="${q}"`
      ]
    };
  }

  /* Username OSINT (social) */
  if (isUsername(q)) {
    const u = q.slice(1);
    return {
      type: "username",
      urls: [
        `https://github.com/${u}`,
        `https://twitter.com/${u}`
      ]
    };
  }

  /* Default search */
  return {
    type: "search",
    url: SEARCH_ENGINES[engineKey].url + encodeURIComponent(q)
  };
}
