"use client";

import { useEffect, useState } from "react";
import Wheel from "../components/Wheel";
import { fetchAllGames, Game } from "../lib/geforce";
import Loading from "../loading";

const characterLimit = 14;

export default function GeforceNowPage() {
    const [games, setGames] = useState<Game[]>([]);
    const [isLoading, setIsLoading] = useState(true);

    const fetchLink = async (game: Game) => {
        if (game.steamUrl !== undefined) return;
        try {
            const res = await fetch(
                `/api/steam-link?title=${encodeURIComponent(game.title)}`
            );
            if (res.ok) {
                const data = await res.json();
                setGames((prev) =>
                    prev.map((g) =>
                        g.title === game.title ? { ...g, steamUrl: data.url } : g
                    )
                );
            }
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
            renderResult={(g) => (
                <>You got: {g.steamUrl ? (
                    <a href={g.steamUrl} target="_blank" rel="noreferrer">{g.title}</a>
                ) : (
                    g.title
                )}</>
            )}
        />
    );
}
