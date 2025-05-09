import NavBar from "@/components/ui/navbar";
import { IMenu } from "@/components/ui/navbar";

// Menú de navegación para +COLOR
const mascolorMenus: IMenu[] = [
  {
    id: 2,
    title: "Productos",
    url: "/#productos",
    dropdown: false,
  },
  {
    id: 3,
    title: "¿Dónde comprar?",
    url: "/donde-comprar",
    dropdown: false,
  },
  {
    id: 4,
    title: "Contacto",
    url: "/contacto",
    dropdown: false,
  },
];

interface MascolorNavBarProps {
  isMobile?: boolean;
}

export function MascolorNavBar({ isMobile = false }: MascolorNavBarProps) {
  return (
    <div className={isMobile ? "flex flex-col" : ""}>
      <NavBar list={mascolorMenus} />
    </div>
  );
}
