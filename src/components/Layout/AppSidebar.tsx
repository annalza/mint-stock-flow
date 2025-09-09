import { Package, Users, ClipboardList, BarChart3, TrendingUp, Settings, ChefHat } from "lucide-react";
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar";

interface AppSidebarProps {
  onNavigate: (page: string) => void;
  currentPage: string;
}

const menuItems = [
  {
    title: "Inventory",
    key: "inventory",
    icon: Package,
  },
  {
    title: "Recipes",
    key: "recipes",
    icon: ChefHat,
  },
  {
    title: "Procurement",
    key: "procurement",
    icon: ClipboardList,
  },
  {
    title: "Suppliers",
    key: "suppliers",
    icon: Users,
  },
  {
    title: "Reports",
    key: "reports",
    icon: BarChart3,
  },
  {
    title: "Forecast",
    key: "forecast",
    icon: TrendingUp,
  },
  {
    title: "Admin",
    key: "admin",
    icon: Settings,
  },
];

export function AppSidebar({ onNavigate, currentPage }: AppSidebarProps) {
  return (
    <Sidebar>
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel>HTTM ERP System</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {menuItems.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton 
                    onClick={() => onNavigate(item.key)}
                    isActive={currentPage === item.key}
                  >
                    <item.icon />
                    <span>{item.title}</span>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
    </Sidebar>
  );
}