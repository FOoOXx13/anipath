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
          
        <div className="flex flex-col h-screen">
          
        {/* Mobile layout*/}
        <div className="lg:hidden">
        <div className="flex justify-between items-center h-16 gap-4 px-4">
          <Navbar/>
          <Header/>
        </div>
        <main className="flex-1  overflow-y-auto ">
          {children}
        </main>

        </div>



        {/* Desktop layout */}
        <div className="hidden lg:flex flex-1">
          {/* sideBar */}
          <nav className="h-full shrink-0">
            <Navbar/>
          </nav>

          <main className="flex-1 flex flex-col overflow-y-auto py-3">
            <Header/>
            {children}
          </main>
        </div>


        </div>
      </body>
    </html>
  );
}
