import type { Metadata } from "next";
import { Roboto_Slab, Montserrat } from "next/font/google";
import "./globals.css";
import Navbar from "@/components/Navbar";
import Header from "@/components/Header";
import { NavbarProvider } from "@/components/NavbarContextProvider";

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
          
          <NavbarProvider>

            <div className="h-screen flex flex-col flex-1">
              {/* Header */}
              <Header />

              {/* Main area */}
              <div className="flex flex-1 overflow-hidden">
                
                {/* Sidebar nav */}
                <nav className="  ">
                  <Navbar />
                </nav>

                {/* Page content */}
                <main className="flex-1 overflow-y-auto">
                  {children}
                </main>

              </div>
            </div>
          </NavbarProvider>


        </div>
      </body>
    </html>
  );
}
