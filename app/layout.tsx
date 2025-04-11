import "@fontsource/roboto";
import "@fontsource/roboto/400.css";
import "@fontsource/roboto/700.css";
import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css"; 
import Providers from "@/context/providers";
import { GenreProvider } from "@/context/GenreContext";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "ShowFlix",
  description: "An absolute OTT platform",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="h-full">
      <head />
      <body
        className={`h-full ${geistSans.variable} ${geistMono.variable} font-roboto antialiased`}
      >
        <Providers>
          <GenreProvider>{children}</GenreProvider>
        </Providers>
      </body>
    </html>
  );
}
