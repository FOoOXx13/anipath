import type { Metadata } from "next";
import { Roboto_Slab, Montserrat } from "next/font/google";
import "./globals.css";
import Navbar from "@/components/Navbar";
import Header from "@/components/Header";
import { NavbarProvider } from "@/components/NavbarContextProvider";
import ScrollToTop from "@/components/ScrollToTop";
import { ClerkProvider } from "@clerk/nextjs";


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
    <ClerkProvider>
    <html lang="en">
      <body
        className={`${robotoSlab.variable} ${montserrat.variable} antialiased`}
      >

        <div className="flex flex-col h-screen">
          <NavbarProvider>

            {/*Desktop layout */}
        <div className="hidden h-screen min-[1400px]:flex flex-1">
                  {/* Sidebar nav */}
                <nav className=" ">
                  <Navbar />
                </nav>
         

              {/* Main area */}
              <div className="flex flex-col flex-1 overflow-hidden">
                {/* Page content */}
                <main className="flex-1 overflow-y-auto">

                {/* Header */}
              <Header />
                   <ScrollToTop />
                  {children}
                </main>

              </div>
             </div>

          
                {/*Mobile layout */} 
            <div className=" h-screen flex flex-col flex-1 min-[1400px]:hidden">
    

              {/* Main area */}
              <div className="flex  overflow-hidden">
                {/* Sidebar nav */}
                <nav className="  ">
                  <Navbar />
                </nav>

                {/* Page content */}
                <main className="flex-1 overflow-y-auto">
                          {/* Header */}
              <Header />
                     <ScrollToTop />
                  {children}
                </main>

              </div>
            </div>
          </NavbarProvider>


        </div>
          
      </body>
    </html>
    </ClerkProvider>
  );
}
