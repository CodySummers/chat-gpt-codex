import { Metadata } from "next";
import "./globals.css";
import { ReactNode } from "react";

export const metadata: Metadata = {
    title: "Steam vent",
    description: "Spin the wheel of steam new releases to find your next game!",
};

export default function RootLayout({ children }: { children: ReactNode }) {
    return (
        <html lang="en">
            <body>{children}</body>
        </html>
    );
}
