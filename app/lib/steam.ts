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
