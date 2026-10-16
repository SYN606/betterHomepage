// Modern SolidJS Icons Module powered by lucide-solid & solid-icons
// Zero-runtime SVG errors, fully responsive, CSP compliant, tree-shaken

import {
  Sparkles,
  Sun,
  Sprout,
  Image as LucideImage,
  RotateCw,
  Upload,
  House,
  Check,
  Copy,
  ExternalLink,
  X,
  Pencil,
  Plus,
  Trash2,
  Search,
  ChevronDown,
} from "lucide-solid";

import {
  SiGoogle,
  SiGmail,
  SiYoutube,
  SiGoogledrive,
  SiGooglephotos,
  SiGoogledocs,
  SiGooglecalendar,
  SiDuckduckgo,
  SiBrave,
  SiWikipedia,
  SiGithub,
  SiReddit,
  SiStackoverflow,
  SiGooglemaps,
  SiGooglegemini,
  SiPerplexity,
} from "solid-icons/si";

import { TbOutlineBrandBing } from "solid-icons/tb";

function createIcon(Component, defaultClass = "w-4 h-4") {
  return function IconWrapper(props = {}) {
    return (
      <Component
        {...props}
        class={props.class || defaultClass}
      />
    );
  };
}

// System & UI Icons (Lucide)
export const SparklesIcon = createIcon(Sparkles, "w-4 h-4");
export const SunIcon = createIcon(Sun, "w-4 h-4");
export const PlantIcon = createIcon(Sprout, "w-4 h-4");
export const ImageIcon = createIcon(LucideImage, "w-4 h-4");
export const RefreshIcon = createIcon(RotateCw, "w-4 h-4");
export const UploadIcon = createIcon(Upload, "w-4 h-4");
export const HomeIcon = createIcon(House, "w-5 h-5");
export const CheckIcon = createIcon(Check, "w-4 h-4");
export const CopyIcon = createIcon(Copy, "w-4 h-4");
export const ExternalLinkIcon = createIcon(ExternalLink, "w-4 h-4");
export const XIcon = createIcon(X, "w-4 h-4");
export const EditIcon = createIcon(Pencil, "w-3 h-3");
export const PlusIcon = createIcon(Plus, "w-4 h-4");
export const TrashIcon = createIcon(Trash2, "w-3.5 h-3.5");
export const SearchIcon = createIcon(Search, "w-4 h-4");
export const ChevronDownIcon = createIcon(ChevronDown, "w-3.5 h-3.5");

// Brand & Service Icons (Simple Icons & Tabler)
export const GoogleIcon = createIcon(SiGoogle, "w-4 h-4");
export const GmailIcon = createIcon(SiGmail, "w-5 h-5");
export const YoutubeIcon = createIcon(SiYoutube, "w-5 h-5");
export const DriveIcon = createIcon(SiGoogledrive, "w-5 h-5");
export const PhotosIcon = createIcon(SiGooglephotos, "w-5 h-5");
export const DocsIcon = createIcon(SiGoogledocs, "w-5 h-5");
export const CalendarIcon = createIcon(SiGooglecalendar, "w-5 h-5");
export const DuckduckgoIcon = createIcon(SiDuckduckgo, "w-4 h-4");
export const BraveIcon = createIcon(SiBrave, "w-4 h-4");
export const WikipediaIcon = createIcon(SiWikipedia, "w-4 h-4");
export const GithubIcon = createIcon(SiGithub, "w-4 h-4");
export const RedditIcon = createIcon(SiReddit, "w-4 h-4");
export const StackoverflowIcon = createIcon(SiStackoverflow, "w-4 h-4");
export const BingIcon = createIcon(TbOutlineBrandBing, "w-4 h-4");
export const MapsIcon = createIcon(SiGooglemaps, "w-4 h-4");
export const GeminiIcon = createIcon(SiGooglegemini, "w-4 h-4");
export const PerplexityIcon = createIcon(SiPerplexity, "w-4 h-4");

// 4-Color Google Brandmark for Google Services trigger
export function GoogleColorIcon(props = {}) {
  return (
    <svg
      viewBox="0 0 24 24"
      class={props.class || "w-4.5 h-4.5"}
      style={props.style}
    >
      <path
        fill="#4285F4"
        d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
      />
      <path
        fill="#34A853"
        d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
      />
      <path
        fill="#FBBC05"
        d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"
      />
      <path
        fill="#EA4335"
        d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"
      />
    </svg>
  );
}
