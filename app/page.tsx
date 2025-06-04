"use client";

import { useEffect, useRef, useState } from "react";
import { getGames } from "./lib/steam";

interface Game {
    id: number;
    name: string;
}

const characterLimit = 14;

export default function HomePage() {
    const [games, setGames] = useState<Game[]>([]);
    const [selected, setSelected] = useState<Game | null>(null);
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const [rotation, setRotation] = useState(0);
    const [seconds, setSeconds] = useState(5);
    const [showOptions, setShowOptions] = useState(false);
    const [isSpinning, setIsSpinning] = useState(false);

    useEffect(() => {
        getGames()
            .then((items) => setGames(items))
            .catch((err) => console.error(err));
    }, []);

    useEffect(() => {
        if (!games.length) return;
        const canvas = canvasRef.current;
        if (!canvas) return;
        const ctx = canvas.getContext("2d");
        if (!ctx) return;
        const radius = canvas.width / 2;
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        games.forEach((game, i) => {
            const angleStart = (i / games.length) * Math.PI * 2;
            const angleEnd = ((i + 1) / games.length) * Math.PI * 2;
            ctx.beginPath();
            ctx.moveTo(radius, radius);
            ctx.arc(radius, radius, radius, angleStart, angleEnd);
            ctx.fillStyle = i % 2 ? "#ffdf6b" : "#fbc531";
            ctx.fill();
            ctx.save();
            ctx.translate(radius, radius);
            ctx.rotate(angleStart + (angleEnd - angleStart) / 2);
            ctx.textAlign = "right";
            ctx.fillStyle = "#000";
            ctx.font = "14px sans-serif";
            const text = game.name.length > characterLimit ? game.name.slice(0, characterLimit) + "..." : game.name;
            ctx.fillText(text, radius - 10, 0);
            ctx.restore();
        });
    }, [games]);

    const spin = () => {
        setSelected(null);
        if (!games.length || isSpinning) return;
        const randIndex = Math.floor(Math.random() * games.length);
        const anglePerSlice = 360 / games.length;
        const currentCenter = (rotation + randIndex * anglePerSlice + anglePerSlice / 2) % 360;
        const delta = 360 + 180 * 5 + 90 - currentCenter + seconds * 360;
        setRotation(rotation + delta);
        setIsSpinning(true);
        setTimeout(() => {
            console.log(`Selected game: ${games[randIndex].name}`);
            setSelected(games[randIndex]);
            setIsSpinning(false);
        }, seconds * 1000);
    };

    return (
        <main className="container">
            <div className="options-container">
                <button className="options-button" onClick={() => setShowOptions(!showOptions)}>
                    Options
                </button>
                {showOptions && (
                    <div className="options-window">
                        <label htmlFor="duration">Spin Duration: {seconds}s</label>
                        <input
                            id="duration"
                            type="range"
                            min={5}
                            max={120}
                            value={seconds}
                            onChange={(e) => setSeconds(Number(e.target.value))}
                            disabled={isSpinning}
                        />
                    </div>
                )}
            </div>
            <h1>Steam New Releases Wheel</h1>
            <div className="wheel-wrapper">
                <div className="pointer" />
                <div className="wheel-container">
                    <canvas
                        ref={canvasRef}
                        width={500}
                        height={500}
                        style={{ transform: `rotate(${rotation}deg)`, transition: `transform ${seconds}s ease-out` }}
                    />
                </div>
            </div>
            <button className="spin" onClick={spin} disabled={isSpinning}>
                Spin
            </button>
            {selected && (
                <p className="result">
                    You got:{" "}
                    <a href={`https://store.steampowered.com/app/${selected.id}`} target="_blank" rel="noreferrer">
                        {selected.name}
                    </a>
                </p>
            )}
        </main>
    );
}
