import { Link, GalleryVerticalEnd } from "lucide-react";
import {
  SidebarHeader,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
} from "./ui/sidebar";

export function Header() {
  return (
    <SidebarHeader>
      <SidebarMenu>
        <SidebarMenuItem>
          <SidebarMenuButton asChild>
            <Link href="/admin">
              <div >
                <GalleryVerticalEnd className="size-4" />
              </div>
              <div >
                <span >FoodTech</span>
                <span>
                  Admin Panel
                </span>
              </div>
            </Link>
          </SidebarMenuButton>
        </SidebarMenuItem>
      </SidebarMenu>
    </SidebarHeader>
  );
}
