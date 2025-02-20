'use client'
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/admin/app-sidebar";
import { BreadcrumbFromUrl } from "@/components/admin/bread-crumb";
import { redirect } from "next/navigation";
import { useEffect } from "react";
import withAuth from "@/lib/auth";

export default function Layout({ children }: { children: React.ReactNode }) {

  useEffect(() => {
    const checkAuth = async () => {
      try {
        await withAuth().get(`${process.env.NEXT_PUBLIC_API_BASE_URL}/admin/clients`);
      } catch (error) {
        console.log(error);
        redirect("/login");
      }
    };
    checkAuth();
  }, []);

  return (
    <SidebarProvider className="m-2">
      <AppSidebar />
      <main className="flex-1">
        <div className="sticky top-0 z-10 bg-white">
          <SidebarTrigger />
          <BreadcrumbFromUrl />
        </div>
        <div className="w-3/4">{children}</div>
      </main>
    </SidebarProvider>
  );
}
