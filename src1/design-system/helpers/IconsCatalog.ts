import { Grid3X3, Home,Search,LogOut,LogIn, LayoutDashboard, LayoutGrid } from 'lucide-react-native';

export const iconsCatalog = {
  Home: Home,
  Search:Search,
  LogOut:LogOut,
  LogIn:LogIn,
  Grid3X3: Grid3X3,
  LayoutGrid: LayoutGrid,
  LayoutDashboard: LayoutDashboard,
};

export type IconName = keyof typeof iconsCatalog;
