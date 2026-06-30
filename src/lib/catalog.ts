export type CatalogGroup = {
  title: string;
  subtitle: string;
  href: string;
  items: string[];
};

export const heroQuickLinks = [
  { label: "Cases", href: "/game-items#cases" },
  { label: "Knives", href: "/game-items#knives" },
  { label: "Gloves", href: "/game-items#gloves" },
  { label: "All items", href: "/market" }
];

export const caseNames = [
  "CS:GO Weapon Case",
  "CS:GO Weapon Case 2",
  "CS:GO Weapon Case 3",
  "Operation Bravo Case",
  "Winter Offensive Weapon Case",
  "Operation Phoenix Weapon Case",
  "Huntsman Weapon Case",
  "Operation Breakout Case",
  "Chroma Case",
  "Chroma 2 Case",
  "Falchion Case",
  "Shadow Case",
  "Revolver Case",
  "Gamma Case",
  "Gamma 2 Case",
  "Glove Case",
  "Spectrum Case",
  "Spectrum 2 Case",
  "Clutch Case",
  "Horizon Case",
  "Danger Zone Case",
  "Prisma Case",
  "Shattered Web Case",
  "CS20 Case",
  "Prisma 2 Case",
  "Fracture Case",
  "Operation Broken Fang Case",
  "Snakebite Case",
  "Operation Riptide Case",
  "Dreams & Nightmares Case",
  "Recoil Case",
  "Revolution Case",
  "Kilowatt Case",
  "Gallery Case",
  "Fever Case",
  "Sealed Genesis Terminal",
  "Sealed Dead Hand Terminal"
];

export const knifeNames = [
  "Skeleton Knife",
  "Kukri Knife",
  "Bayonet",
  "Classic Knife",
  "Flip Knife",
  "Gut Knife",
  "Karambit",
  "M9 Bayonet",
  "Huntsman Knife",
  "Falchion Knife",
  "Bowie Knife",
  "Butterfly Knife",
  "Shadow Daggers",
  "Paracord Knife",
  "Survival Knife",
  "Ursus Knife",
  "Navaja Knife",
  "Nomad Knife",
  "Stiletto Knife",
  "Talon Knife"
];

export const gloveNames = [
  "Bloodhound Gloves",
  "Sport Gloves",
  "Driver Gloves",
  "Hand Wraps",
  "Moto Gloves",
  "Specialist Gloves",
  "Hydra Gloves",
  "Broken Fang Gloves"
];

export const weaponGroups: CatalogGroup[] = [
  {
    title: "CS2 Skins",
    subtitle: "Browse the most traded skin categories.",
    href: "/game-items#skins",
    items: ["Knives", "Gloves", "Pistols", "Rifles", "SMGs", "Heavy"]
  },
  {
    title: "CS2 Items",
    subtitle: "Search collectibles, cosmetics, and utility items.",
    href: "/game-items#items",
    items: ["Stickers", "Charms", "Agents", "Music Kits", "Patches", "Pins", "Graffiti"]
  },
  {
    title: "CS2 Cases",
    subtitle: "Quick links for popular containers.",
    href: "/game-items#cases",
    items: ["Sealed Dead Hand Terminal", "Sealed Genesis Terminal", "Fever Case", "Gallery Case", "Kilowatt Case", "Revolution Case", "All Cases"]
  },
  {
    title: "CS2 Tools",
    subtitle: "Trading utilities for signed-in users.",
    href: "/dashboard",
    items: ["Inventory", "Watchlist", "Supported Markets", "Trade URL", "Seller Listings"]
  }
];

export const popularSearches = [
  "Karambit Doppler",
  "Butterfly Knife Fade",
  "Sport Gloves Vice",
  "AK-47 Redline",
  "AWP Asiimov",
  "M4A1-S Printstream",
  "USP-S Kill Confirmed",
  "Desert Eagle Blaze"
];

export function slugify(value: string) {
  return value
    .toLowerCase()
    .replace(/&/g, "and")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "");
}
