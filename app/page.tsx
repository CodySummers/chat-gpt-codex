'use client';

import { useEffect, useRef, useState } from 'react';

interface Game {
  id: number;
  name: string;
}

export default function HomePage() {
  const [games, setGames] = useState<Game[]>([]);
  const [selected, setSelected] = useState<Game | null>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [rotation, setRotation] = useState(0);

  useEffect(() => {
    async function fetchGames() {
      try {
        const res = await fetch('https://store.steampowered.com/api/featuredcategories/');
        const data = await res.json();
        const newReleases = data?.new_releases?.items as any[];
        const mapped = newReleases.map((it: any) => ({ id: it.id, name: it.name }));
        setGames(mapped);
      } catch (err) {
        console.error(err);
      }
    }
    fetchGames();
  }, []);

  useEffect(() => {
    if (!games.length) return;
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    const radius = canvas.width / 2;
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    games.forEach((game, i) => {
      const angleStart = (i / games.length) * Math.PI * 2;
      const angleEnd = ((i + 1) / games.length) * Math.PI * 2;
      ctx.beginPath();
      ctx.moveTo(radius, radius);
      ctx.arc(radius, radius, radius, angleStart, angleEnd);
      ctx.fillStyle = i % 2 ? '#ffdf6b' : '#fbc531';
      ctx.fill();
      ctx.save();
      ctx.translate(radius, radius);
      ctx.rotate(angleStart + (angleEnd - angleStart) / 2);
      ctx.textAlign = 'right';
      ctx.fillStyle = '#000';
      ctx.font = '14px sans-serif';
      ctx.fillText(game.name, radius - 10, 0);
      ctx.restore();
    });
  }, [games]);

  const spin = () => {
    if (!games.length) return;
    const randIndex = Math.floor(Math.random() * games.length);
    const anglePerSlice = 360 / games.length;
    const finalRotation = 360 * 5 + randIndex * anglePerSlice + anglePerSlice / 2;
    setRotation(finalRotation);
    setTimeout(() => {
      setSelected(games[randIndex]);
    }, 4000); // match CSS transition duration
  };

  return (
    <main className="container">
      <h1>Steam New Releases Wheel</h1>
      <div className="wheel-container">
        <canvas
          ref={canvasRef}
          width={500}
          height={500}
          style={{ transform: `rotate(${rotation}deg)`, transition: 'transform 4s ease-out' }}
        />
      </div>
      <button className="spin" onClick={spin}>Spin</button>
      {selected && (
        <p className="result">
          You got: <a href={`https://store.steampowered.com/app/${selected.id}`} target="_blank" rel="noreferrer">{selected.name}</a>
        </p>
      )}
    </main>
  );
}
