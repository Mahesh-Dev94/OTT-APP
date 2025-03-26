import { createContext, useContext, useMemo, useState } from 'react';
import React from 'react';
const MenuContext = createContext<{ isOpen: boolean; toggleMenu: (isOpen: boolean) => void }>({
  isOpen: true,
  toggleMenu: () => {
    throw new Error('MenuContext not initialized');
  },
});

export const MenuProvider = ({ children }: { children: React.ReactNode }) => {
  const [isOpen, setIsOpen] = useState<boolean>(false);

  const value = useMemo(() => {
    return { isOpen, toggleMenu: setIsOpen };
  }, [isOpen, setIsOpen]);
// console.log('value---',value)

  return <MenuContext.Provider value={value}>{children}</MenuContext.Provider>;
};

export const useMenuContext = () => useContext(MenuContext);
