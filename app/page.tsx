"use client";

import { useEffect, useState } from "react";
import Wheel from "./components/Wheel";
import { getGames } from "./lib/steam";

interface Game {
    id: number;
    name: string;
}

export default function HomePage() {
    const [games, setGames] = useState<Game[]>([]);

    useEffect(() => {
        getGames()
            .then((items) => setGames(items))
            .catch((err) => console.error(err));
    }, []);

    return (
        <Wheel
            items={games}
            getLabel={(g) => g.name}
            title="Steam New Releases Wheel"
            renderResult={(g) => (
                <>You got: <a href={`https://store.steampowered.com/app/${(g as Game).id}`} target="_blank" rel="noreferrer">{(g as Game).name}</a></>
            )}
        />
    );
}
