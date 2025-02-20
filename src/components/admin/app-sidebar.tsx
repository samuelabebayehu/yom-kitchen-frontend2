"use client";
import {
  LayoutDashboardIcon,
  User2Icon,
  HandHelping,
  Utensils,
  Sandwich,
} from "lucide-react";
import { useState, useEffect } from "react";
import { usePathname, useRouter } from "next/navigation";
import Link from "next/link";

import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  useSidebar,
} from "@/components/ui/sidebar";
import { Button } from "../ui/button";

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
  const pathname = usePathname()?.split || "";
  const [selectedItem, setSelectedItem] = useState(pathname.toString());
  const [showLogout, setShowLogout] = useState(false);
  const [username, setUsername] = useState<string | null>(null);
  const router = useRouter();

  useEffect(() => {
    const currentItem = items.find((item) =>
      pathname.toString().startsWith(item.url)
    );
    setSelectedItem(currentItem ? currentItem.url : pathname.toString());
  }, [pathname]);

  useEffect(() => {
    const fetchUsername = async () => {
      setUsername(localStorage.getItem("username"));
    };
    fetchUsername();
  }, []);

  const handleMenuItemClick = (url: string) => {
    setSelectedItem(url);
  };

  const handleLogout = () => {
    localStorage.removeItem('username');
    localStorage.removeItem('admin_jwt_token');
    router.push("/login");
  };

  const { state } = useSidebar();

  return (
    <Sidebar
      collapsible="icon"
      className="border-r bg-gradient-to-b from-gray-50 to-white"
    >
      <SidebarHeader className="border-b bg-white">
        <div className={`flex items-center justify-between ${state==='expanded' && 'p-4'}`}>
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-green-500 to-green-600 flex items-center justify-center">
              <span className="text-white font-bold">Y</span>
            </div>
            {state === "expanded" && (
              <span className="font-semibold text-gray-900 transition-opacity duration-200">
                YOM KITCHEN
              </span>
            )}
          </div>
        </div>
      </SidebarHeader>
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel className="px-4 text-xs font-medium text-gray-500 uppercase tracking-wider">
            Management
          </SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {items.map((item) => {
                const isActive = selectedItem === item.url;
                return (
                  <SidebarMenuItem key={item.title}>
                    <SidebarMenuButton
                      asChild
                      is_active={isActive}
                      className={`
                        w-full justify-start gap-3 px-4 py-2.5 
                        text-gray-600 hover:text-gray-900
                        transition-all duration-200 ease-in-out
                        relative group
                        ${
                          isActive
                            ? "text-green-600 bg-green-50 font-medium"
                            : "hover:bg-gray-50"
                        }
                      `}
                      onClick={() => handleMenuItemClick(item.url)}
                    >
                      <Link href={item.url} className="flex items-center gap-3">
                        <div
                          className={`
                          relative flex items-center justify-center
                          transition-all duration-200 ease-in-out
                          ${
                            isActive
                              ? "text-green-600"
                              : "text-gray-400 group-hover:text-gray-600"
                          }
                        `}
                        >
                          <item.icon className="w-5 h-5" />
                        </div>
                        <span
                          className={`
                          text-sm transition-all duration-200
                          ${
                            isActive
                              ? "text-green-600"
                              : "text-gray-600 group-hover:text-gray-900"
                          }
                        `}
                        >
                          {item.title}
                        </span>
                        {isActive && (
                          <span className="absolute left-0 top-1/2 -translate-y-1/2 w-1 h-8 bg-green-600 rounded-r-full" />
                        )}
                      </Link>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                );
              })}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
      <div className="mt-auto p-4 border-t">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-full bg-gray-200 flex items-center justify-center">
            <User2Icon className="w-4 h-4 text-gray-600" />
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-medium text-gray-900 truncate">
              {username || "Admin User"}
            </p>
            <p className="text-xs text-gray-500 truncate">User</p>
          </div>
          <Button variant="ghost" size="sm" onClick={() => setShowLogout(!showLogout)}>
            {showLogout ? "Cancel" : "Logout"}
          </Button>
        </div>
        {showLogout && (
          <div className="mt-2">
            <Button variant="outline" size="sm" onClick={handleLogout}>
              Confirm Logout
            </Button>
          </div>
        )}
      </div>
    </Sidebar>
  );
}
