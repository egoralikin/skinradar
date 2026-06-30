export const STEAM_OPENID_URL = "https://steamcommunity.com/openid/login";
export const CS2_APP_ID = 730;
export const CS2_CONTEXT_ID = 2;

type SteamPlayer = {
  steamid: string;
  personaname?: string;
  avatarfull?: string;
  avatarmedium?: string;
};

export type SteamInventoryItem = {
  assetId: string;
  classId?: string;
  instanceId?: string;
  name: string;
  marketHashName?: string;
  imageUrl?: string;
  exterior?: string;
  rarity?: string;
  tradable: boolean;
  marketable: boolean;
};

export function getAppUrl(requestOrigin?: string) {
  return process.env.NEXT_PUBLIC_APP_URL || requestOrigin || "http://localhost:3000";
}

export function buildSteamLoginUrl(origin: string) {
  const appUrl = getAppUrl(origin);
  const returnTo = `${appUrl}/api/auth/steam/callback`;
  const params = new URLSearchParams({
    "openid.ns": "http://specs.openid.net/auth/2.0",
    "openid.mode": "checkid_setup",
    "openid.return_to": returnTo,
    "openid.realm": appUrl,
    "openid.identity": "http://specs.openid.net/auth/2.0/identifier_select",
    "openid.claimed_id": "http://specs.openid.net/auth/2.0/identifier_select"
  });
  return `${STEAM_OPENID_URL}?${params.toString()}`;
}

export async function verifySteamOpenId(params: URLSearchParams): Promise<string | null> {
  const claimedId = params.get("openid.claimed_id");
  if (!claimedId) return null;

  const steamIdMatch = claimedId.match(/^https?:\/\/steamcommunity\.com\/openid\/id\/(\d+)$/);
  if (!steamIdMatch) return null;

  const verifyParams = new URLSearchParams(params);
  verifyParams.set("openid.mode", "check_authentication");

  const response = await fetch(STEAM_OPENID_URL, {
    method: "POST",
    headers: { "Content-Type": "application/x-www-form-urlencoded" },
    body: verifyParams.toString(),
    cache: "no-store"
  });

  const text = await response.text();
  if (!text.includes("is_valid:true")) return null;
  return steamIdMatch[1];
}

export async function fetchSteamProfile(steamId: string): Promise<SteamPlayer | null> {
  const key = process.env.STEAM_API_KEY;
  if (!key) return { steamid: steamId };

  const url = new URL("https://api.steampowered.com/ISteamUser/GetPlayerSummaries/v0002/");
  url.searchParams.set("key", key);
  url.searchParams.set("steamids", steamId);

  const response = await fetch(url, { cache: "no-store" });
  if (!response.ok) return { steamid: steamId };

  const data = await response.json();
  return data?.response?.players?.[0] ?? { steamid: steamId };
}

function tagValue(description: any, category: string) {
  const tag = description?.tags?.find((item: any) => item?.category === category);
  return tag?.localized_tag_name || tag?.name || undefined;
}

export async function fetchCs2Inventory(steamId: string): Promise<SteamInventoryItem[]> {
  const url = `https://steamcommunity.com/inventory/${steamId}/${CS2_APP_ID}/${CS2_CONTEXT_ID}?l=english&count=2000`;
  const response = await fetch(url, {
    cache: "no-store",
    headers: { "User-Agent": "CS2TradingMVP/0.1" }
  });

  if (!response.ok) {
    throw new Error("Could not fetch inventory. The inventory may be private, empty, or temporarily rate-limited by Steam.");
  }

  const data = await response.json();
  const assets = Array.isArray(data.assets) ? data.assets : [];
  const descriptions = Array.isArray(data.descriptions) ? data.descriptions : [];

  const descriptionMap = new Map<string, any>();
  for (const description of descriptions) {
    descriptionMap.set(`${description.classid}_${description.instanceid}`, description);
  }

  return assets.map((asset: any) => {
    const description = descriptionMap.get(`${asset.classid}_${asset.instanceid}`) || {};
    const icon = description.icon_url_large || description.icon_url;
    return {
      assetId: String(asset.assetid),
      classId: asset.classid ? String(asset.classid) : undefined,
      instanceId: asset.instanceid ? String(asset.instanceid) : undefined,
      name: description.name || description.market_hash_name || "Unknown CS2 item",
      marketHashName: description.market_hash_name,
      imageUrl: icon ? `https://community.cloudflare.steamstatic.com/economy/image/${icon}/330x192` : undefined,
      exterior: tagValue(description, "Exterior"),
      rarity: tagValue(description, "Rarity"),
      tradable: Boolean(description.tradable),
      marketable: Boolean(description.marketable)
    } satisfies SteamInventoryItem;
  });
}
