import { AppSidebar } from "@repo/ui/components/sidebar/app-sidebar";
import { SidebarInset, SidebarProvider } from "@repo/ui/components/ui/sidebar";

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <SidebarProvider>
      <AppSidebar />
      <SidebarInset>{children}</SidebarInset>
    </SidebarProvider>
  );
}
