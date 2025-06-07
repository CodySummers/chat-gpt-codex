"use client";

import { useEffect, useState } from "react";
import Wheel from "../components/Wheel";
import { fetchAllGames, Game } from "../lib/geforce";

const characterLimit = 14;

export default function GeforceNowPage() {
    const [games, setGames] = useState<Game[]>([]);

    useEffect(() => {
        fetchAllGames()
            .then((items) => setGames(items))
            .catch((err) => console.error(err));
    }, []);

    const hideText = games.length > 100;

    return (
        <Wheel
            items={games}
            getLabel={(g) => g.title}
            characterLimit={characterLimit}
            hideText={hideText}
            title="GeForce Now Games Wheel"
        />
    );
}
