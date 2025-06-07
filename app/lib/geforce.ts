"use server";

import { cache } from "react";

export type Game = {
    title: string;
    sortName: string;
    gfn: {
        minimumMembershipTierLabel: string;
    };
    variants: {
        appStore: string;
        publisherName: string;
    }[];
};

export type PageInfo = {
    endCursor: string;
    hasNextPage: boolean;
};

export type GamesResponse = {
    apps: {
        numberReturned: number;
        pageInfo: PageInfo;
        items: Game[];
    };
};

const API_URL = "https://api-prod.nvidia.com/services/gfngames/v1/gameList";
const listSize = 100;

export async function fetchGamesPage(afterCursor?: string): Promise<GamesResponse> {
    const afterParam = afterCursor ? ` after:"${afterCursor}"` : "";
    const queryBody = `{ apps(country:"GB" language:"en_GB" first:${listSize}${afterParam}) {\n  numberReturned\n  pageInfo {\n    endCursor\n    hasNextPage\n  }\n  items {\n    title\n    sortName\n    gfn{\n      minimumMembershipTierLabel\n    }\n    variants{\n      appStore\n      publisherName\n    }\n  }\n}}`;

    const response = await fetch(API_URL, {
        method: "POST",
        next: { revalidate: 60 * 60 * 24 * 3 },
        headers: {
            accept: "*/*",
            "accept-language": "en-GB,en-US;q=0.9,en;q=0.8,sq;q=0.7",
            "cache-control": "no-cache",
            "content-type": "application/json;charset=UTF-8",
            origin: "https://www.nvidia.com",
            pragma: "no-cache",
            priority: "u=0, i",
            referer: "https://www.nvidia.com/",
            "sec-ch-ua": '"Chromium";v="136", "Google Chrome";v="136", "Not.A/Brand";v="99"',
            "sec-ch-ua-mobile": "?0",
            "sec-ch-ua-platform": '"macOS"',
            "sec-fetch-dest": "empty",
            "sec-fetch-mode": "cors",
            "sec-fetch-site": "same-site",
            "user-agent":
                "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/136.0.0.0 Safari/537.36",
        },
        body: queryBody,
    });

    if (!response.ok) {
        const text = await response.text();
        throw new Error(`Failed to fetch games: ${response.status} ${response.statusText}\n${text}`);
    }

    const data = await response.json();
    return data.data as GamesResponse;
}

export const fetchAllGames = cache(async (): Promise<Game[]> => {
    let allGames: Game[] = [];
    let afterCursor: string | undefined = undefined;
    let hasNextPage = true;

    while (hasNextPage) {
        const { apps } = await fetchGamesPage(afterCursor);
        allGames = allGames.concat(apps.items);

        hasNextPage = apps.pageInfo.hasNextPage;
        afterCursor = apps.pageInfo.endCursor;

        console.log(`Fetched ${allGames.length} games so far...`);
    }

    return allGames;
});

