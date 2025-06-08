"use client";

import { useEffect, useRef, useState } from "react";

export interface WheelProps<T> {
    items: T[];
    getLabel: (item: T) => string;
    characterLimit?: number;
    hideText?: boolean;
    renderResult?: (item: T) => React.ReactNode;
    onSelect?: (item: T) => void;
    title: string;
}

export default function Wheel<T>({
    items,
    getLabel,
    characterLimit = 14,
    hideText = false,
    renderResult,
    onSelect,
    title,
}: WheelProps<T>) {
    const [selected, setSelected] = useState<T | null>(null);
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const [rotation, setRotation] = useState(0);
    const [seconds, setSeconds] = useState(5);
    const [showOptions, setShowOptions] = useState(false);
    const [isSpinning, setIsSpinning] = useState(false);

    const MAX_WEDGES = 100;

    useEffect(() => {
        if (!items.length) return;
        const canvas = canvasRef.current;
        if (!canvas) return;
        const ctx = canvas.getContext("2d");
        if (!ctx) return;
        const radius = canvas.width / 2;
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        const wedgeCount = Math.min(items.length, MAX_WEDGES);
        const displayItems = items.slice(0, wedgeCount);
        displayItems.forEach((item, i) => {
            const angleStart = (i / wedgeCount) * Math.PI * 2;
            const angleEnd = ((i + 1) / wedgeCount) * Math.PI * 2;
            ctx.beginPath();
            ctx.moveTo(radius, radius);
            ctx.arc(radius, radius, radius, angleStart, angleEnd);
            ctx.fillStyle = i % 2 ? "#ffdf6b" : "#fbc531";
            ctx.fill();
            if (!hideText) {
                ctx.save();
                ctx.translate(radius, radius);
                ctx.rotate(angleStart + (angleEnd - angleStart) / 2);
                ctx.textAlign = "right";
                ctx.fillStyle = "#000";
                const fontSize = 14;
                ctx.font = `${fontSize}px sans-serif`;
                const label = getLabel(item);
                const text =
                    label.length > characterLimit
                        ? label.slice(0, characterLimit) + "..."
                        : label;
                ctx.fillText(text, radius - 10, fontSize * 0.3);
                ctx.restore();
            }
        });
    }, [items, hideText, getLabel, characterLimit]);

    const spin = () => {
        setSelected(null);
        if (!items.length || isSpinning) return;
        const wedgeCount = Math.min(items.length, MAX_WEDGES);
        const wedgeIndex = Math.floor(Math.random() * wedgeCount);
        const selectedIndex = Math.floor(Math.random() * items.length);
        const anglePerSlice = 360 / wedgeCount;
        const currentCenter = (rotation + wedgeIndex * anglePerSlice + anglePerSlice / 2) % 360;
        // Align the selected wedge with the pointer at the top of the wheel
        const delta = 360 + 180 * 5 + 270 - currentCenter + seconds * 360;
        setRotation(rotation + delta);
        setIsSpinning(true);
        setTimeout(() => {
            const item = items[selectedIndex];
            setSelected(item);
            setIsSpinning(false);
            onSelect?.(item);
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
            <h1>{title}</h1>
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
                    {renderResult ? renderResult(selected) : <>You got: {getLabel(selected)}</>}
                </p>
            )}
        </main>
    );
}

