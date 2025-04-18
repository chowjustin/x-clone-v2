import type {Metadata} from "next";
import {Inter} from "next/font/google";
import "./globals.css";
import Providers from "@/app/providers";

const inter = Inter({
    variable: "--font-inter",
    subsets: ["latin"],
});

export const metadata: Metadata = {
    title: {
        default: `X`,
        template: `%s / X`,
    },
    description: `From breaking news and entertainment to sports and politics, get the full story with all the live commentary.`,
    robots: {index: true, follow: true},
    authors: [
        {
            name: "X Clone",
            url: "https://x.chow.my.id/",
        },
    ],

};
export default function RootLayout({
                                       children,
                                   }: Readonly<{
    children: React.ReactNode;
}>) {
    return (
        <html lang="en">
        <body className={`${inter.variable} antialiased`}>
        <Providers>{children}</Providers>
        </body>
        </html>
    );
}