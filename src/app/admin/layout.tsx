import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar"
import { AppSidebar } from "@/components/app-sidebar"
import { BreadcrumbFromUrl } from "@/components/bread-crumb"


export default function Layout({ children }: { children: React.ReactNode }) {
    
  return (
    <SidebarProvider className="m-2">
      <AppSidebar />
      <main>
        <SidebarTrigger />
        <BreadcrumbFromUrl />
        {children}
      </main>
    </SidebarProvider>
    
  )
}
