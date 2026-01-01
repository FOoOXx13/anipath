"use client";

import { createContext, useContext, useState } from "react";

const NavbarContext = createContext<any>(null);

export function NavbarProvider({ children }: { children: React.ReactNode }) {
  const [active, setActive] = useState(false);

  return (
    <NavbarContext.Provider value={{ active, setActive }}>
      {children}
    </NavbarContext.Provider>
  );
}

export function useNavbar() {
  return useContext(NavbarContext);
}
