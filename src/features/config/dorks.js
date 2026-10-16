export const DORK_CATEGORIES = [
  {
    title: "Core Search & Scope",
    items: [
      { label: "site:", value: "site:" },
      { label: "intitle:", value: "intitle:" },
      { label: "allintitle:", value: "allintitle:" },
      { label: "inurl:", value: "inurl:" },
      { label: "allinurl:", value: "allinurl:" },
      { label: "intext:", value: "intext:" },
      { label: "allintext:", value: "allintext:" },
    ],
  },
  {
    title: "Files & Cloud Leaks",
    items: [
      { label: "filetype:", value: "filetype:" },
      { label: "ext:", value: "ext:" },
      { label: "S3 Buckets", value: 'site:s3.amazonaws.com' },
      { label: "Google Drive", value: 'site:drive.google.com' },
      { label: "Public Docs", value: 'site:docs.google.com' },
      { label: "Notion Pages", value: 'site:notion.site' },
    ],
  },
  {
    title: "Logic & Time Range",
    items: [
      { label: '"exact phrase"', value: '""' },
      { label: "-exclude", value: "-" },
      { label: "OR", value: " OR " },
      { label: "AND", value: " AND " },
      { label: "* wildcard", value: " * " },
      { label: "after:YYYY-MM-DD", value: "after:" },
      { label: "before:YYYY-MM-DD", value: "before:" },
    ],
  },
  {
    title: "Dev & Code Intelligence",
    items: [
      { label: "GitHub Leaks", value: 'site:github.com' },
      { label: "Gist Code", value: 'site:gist.github.com' },
      { label: "StackOverflow", value: 'site:stackoverflow.com' },
      { label: "Pastebin", value: 'site:pastebin.com' },
      { label: "API Keys", value: 'intext:"api_key" OR intext:"apikey"' },
      { label: "Dotenv Files", value: 'filetype:env OR filename:".env"' },
    ],
  },
  {
    title: "Security & OSINT",
    items: [
      { label: "Directory Listing", value: 'intitle:"Index of /"' },
      { label: "Admin Panels", value: 'intitle:"Admin" inurl:login' },
      { label: "Config Files", value: 'ext:xml OR ext:json OR ext:yaml OR ext:sql' },
      { label: "DB Dumps", value: 'filetype:sql "dump"' },
      { label: "Exposed Logs", value: 'filetype:log "error"' },
      { label: "Subdomains", value: 'site:*.example.com -site:www.example.com' },
    ],
  },
];