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
            <body>
                <nav style={{ marginBottom: "1rem" }}>
                    <a href="/" style={{ marginRight: "1rem" }}>Steam</a>
                    <a href="/geforce-now">GeForce Now</a>
                </nav>
                {children}
            </body>
        </html>
    );
}
