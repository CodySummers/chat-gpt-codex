"use server";

export const revalidate = 60 * 60 * 24 * 180;

export interface SteamCategories {
  new_releases: {
    items: { id: number; name: string }[];
  };
}

export async function getGames() {
  try {
    const res = await fetch(
      "https://store.steampowered.com/api/featuredcategories/",
      {
        // keep this list reasonably fresh
        next: { revalidate: 60 * 60 * 12 },
      }
    );
    if (!res.ok) {
      throw new Error("Failed to fetch games");
    }
    const data: SteamCategories = await res.json();
    return data.new_releases.items;
  } catch (err) {
    console.error(err);
    return [];
  }
}

const linkCache = new Map<string, { url: string | null; expires: number }>();

export async function getSteamLink(title: string): Promise<string | null> {
  const cached = linkCache.get(title);
  const now = Date.now();
  if (cached && cached.expires > now) {
    return cached.url;
  }
  try {
    const url = `https://store.steampowered.com/search/suggest?term=${encodeURIComponent(
      title
    )}&f=games&cc=GB`;
    const res = await fetch(url, {
      headers: {
        "User-Agent":
          "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/136.0.0.0 Safari/537.36",
      },
    });
    if (!res.ok) {
      throw new Error("Failed to fetch steam link");
    }
    const text = await res.text();
    const match = text.match(/<a[^>]*href="([^"]+)"/);
    const link = match ? match[1] : null;
    linkCache.set(title, {
      url: link,
      expires: now + 1000 * 60 * 60 * 24 * 180,
    });
    return link;
  } catch (err) {
    console.error(err);
    return null;
  }
}
