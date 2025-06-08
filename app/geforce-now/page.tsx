"use client";

import React, { useEffect, useState } from "react";
import Wheel from "../components/Wheel";
import { fetchAllGames, Game } from "../lib/geforce";
import { getSteamLink } from "../lib/steam";
import Loading from "../loading";

const characterLimit = 14;

export default function GeforceNowPage() {
    const [games, setGames] = useState<Game[]>([]);
    const [isLoading, setIsLoading] = useState(true);

    const fetchLink = async (game: Game) => {
        if (
            game.steamUrl !== undefined ||
            !game.variants.some((v) => v.appStore === "STEAM")
        )
            return;
        try {
            const url = await getSteamLink(game.title);
            setGames((prev) =>
                prev.map((g) =>
                    g.title === game.title ? { ...g, steamUrl: url } : g
                )
            );
        } catch (err) {
            console.error(err);
        }
    };

    useEffect(() => {
        fetchAllGames()
            .then((items) => setGames(items))
            .catch((err) => console.error(err))
            .finally(() => setIsLoading(false));
    }, []);

    const hideText = games.length > 100;

    if (isLoading) {
        return <Loading />;
    }

    return (
        <Wheel
            items={games}
            getLabel={(g) => g.title}
            characterLimit={characterLimit}
            hideText={hideText}
            title="GeForce Now Games Wheel"
            onSelect={fetchLink}
            renderResult={(original) => {
                const game = games.find((g) => g.title === original.title) || original;
                const stores = game.variants.reduce<React.ReactNode[]>((acc, v, i) => {
                    const node = v.appStore === "STEAM" && game.steamUrl ? (
                        <a key={v.appStore} href={game.steamUrl} target="_blank" rel="noreferrer">
                            {v.appStore}
                        </a>
                    ) : (
                        <span key={v.appStore}>{v.appStore}</span>
                    );
                    return i === 0 ? [node] : [...acc, ", ", node];
                }, []);
                return (
                    <>
                        You got: {game.steamUrl ? (
                            <a href={game.steamUrl} target="_blank" rel="noreferrer">
                                {game.title}
                            </a>
                        ) : (
                            game.title
                        )}
                        {" "}(Available on: {stores})
                    </>
                );
            }}
        />
    );
}
