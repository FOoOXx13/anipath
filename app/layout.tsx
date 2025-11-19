import type { Metadata } from "next";
import { Roboto_Slab, Montserrat } from "next/font/google";
import "./globals.css";
import Navbar from "@/components/Navbar";
import Header from "@/components/Header";

const robotoSlab = Roboto_Slab({
  variable: "--font-roboto-slab",
  subsets: ["latin"],
});

const montserrat = Montserrat({
  variable: "--font-Montserrat",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "AniPath",
  description: "Anime and Manga Library",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${robotoSlab.variable} ${montserrat.variable} antialiased`}
      >
        <div className="flex h-screen">
          
        {/* sideBar */}
        <nav className="w-60 h-full px-2 py-3">
          <Navbar/>
        </nav>

        {/* Main content */}
        <main className="w-full h-full overflow-y-auto px-4 py-3">
          <Header/>
        {children}
        </main>

        </div>
      </body>
    </html>
  );
}
