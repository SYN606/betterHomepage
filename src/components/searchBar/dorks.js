export const DORK_CATEGORIES = [
  {
    title: "Core Search",
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
    title: "Files & Documents",
    items: [
      { label: "filetype:", value: "filetype:" },
      { label: "ext:", value: "ext:" },
      { label: "cache:", value: "cache:" },
      { label: "public docs", value: "site:docs.google.com" },
    ],
  },

  {
    title: "Matching & Filters",
    items: [
      { label: '"exact"', value: '""' },
      { label: "-exclude", value: "-" },
      { label: "OR", value: " OR " },
      { label: "AND", value: " AND " },
      { label: "* wildcard", value: " * " },
      { label: "before:", value: "before:" },
      { label: "after:", value: "after:" },
    ],
  },

  {
    title: "Reference Search",
    items: [
      { label: "related:", value: "related:" },
      { label: "define:", value: "define:" },
      { label: "source:", value: "source:" },
    ],
  },

  {
    title: "Research & Security",
    items: [
      { label: "index of", value: '"index of"' },
      { label: "admin login", value: 'intitle:"admin login"' },
      { label: "login portal", value: "inurl:login" },
      { label: "config files", value: "filetype:env OR filetype:json" },
      { label: "github leaks", value: "site:github.com" },
    ],
  },
];

export const DORKS = DORK_CATEGORIES.flatMap((category) => category.items);
