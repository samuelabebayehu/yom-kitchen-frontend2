"use client";
import {
  LayoutDashboardIcon,
  User2Icon,
  HandHelping,
  Utensils,
  Sandwich,
} from "lucide-react";
import { useState, useEffect } from "react";
import { usePathname } from "next/navigation";
import Link from "next/link";

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
import Footer from "./footer";

// Menu items.
const items = [
  {
    title: "Dashboard",
    url: "/admin",
    icon: LayoutDashboardIcon,
  },
  {
    title: "Users",
    url: "/admin/users",
    icon: User2Icon,
  },
  {
    title: "Clients",
    url: "/admin/clients",
    icon: HandHelping,
  },
  {
    title: "Menus",
    url: "/admin/menus",
    icon: Utensils,
  },
  {
    title: "Orders",
    url: "/admin/orders",
    icon: Sandwich,
  },
];

export function AppSidebar() {
  const pathname = usePathname().split;
  const [selectedItem, setSelectedItem] = useState(pathname.toString());
  useEffect(() => {
    const currentItem = items.find((item) =>
      pathname.toString().startsWith(item.url)
    );
    setSelectedItem(currentItem ? currentItem.url : pathname.toString());
  }, [pathname]);

  const handleMenuItemClick = (url: string) => {
    setSelectedItem(url);
  };

  return (
    <Sidebar collapsible="icon">
      {/* <Header /> */}
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel>Admin Panel</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {items.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton
                    asChild
                    is_active={selectedItem === item.url}
                    onClick={() => handleMenuItemClick(item.url)}
                  >
                    <Link href={item.url}>
                      <item.icon />
                      <span>{item.title}</span>
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
      <Footer />
    </Sidebar>
  );
}
