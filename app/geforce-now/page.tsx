"use client";

import { useEffect, useState } from "react";
import Wheel from "../components/Wheel";
import { fetchAllGames, Game } from "../lib/geforce";
import Loading from "../loading";

const characterLimit = 14;

export default function GeforceNowPage() {
    const [games, setGames] = useState<Game[]>([]);
    const [isLoading, setIsLoading] = useState(true);

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
