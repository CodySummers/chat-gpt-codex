"use client";

import { useEffect, useRef } from "react";

export default function LoadingWheel() {
    const canvasRef = useRef<HTMLCanvasElement>(null);

    useEffect(() => {
        const canvas = canvasRef.current;
        if (!canvas) return;
        const ctx = canvas.getContext("2d");
        if (!ctx) return;
        const radius = canvas.width / 2;
        const segments = 8;
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        for (let i = 0; i < segments; i++) {
            const angleStart = (i / segments) * Math.PI * 2;
            const angleEnd = ((i + 1) / segments) * Math.PI * 2;
            ctx.beginPath();
            ctx.moveTo(radius, radius);
            ctx.arc(radius, radius, radius, angleStart, angleEnd);
            ctx.fillStyle = i % 2 ? "#ffdf6b" : "#fbc531";
            ctx.fill();
        }
    }, []);

    return (
        <div className="wheel-wrapper small">
            <div className="pointer small" />
            <div className="wheel-container">
                <canvas
                    ref={canvasRef}
                    width={200}
                    height={200}
                    className="loading-spinner"
                />
            </div>
        </div>
    );
}
