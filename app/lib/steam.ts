"use server";

export interface SteamCategories {
  new_releases: {
    items: { id: number; name: string }[];
  };
}

export async function getGames() {
  try {
    const res = await fetch("https://store.steampowered.com/api/featuredcategories/");
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

export async function getSteamLink(title: string): Promise<string | null> {
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
    return match ? match[1] : null;
  } catch (err) {
    console.error(err);
    return null;
  }
}
