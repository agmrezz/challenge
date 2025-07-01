import { AppSidebar } from "@repo/ui/components/sidebar/app-sidebar";
import { SidebarInset, SidebarProvider } from "@repo/ui/components/ui/sidebar";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";

export default async function Layout({
  children,
}: {
  children: React.ReactNode;
}) {
  const accessToken = (await cookies()).get("access_token");

  if (!accessToken) {
    redirect("/login");
  }
  return (
    <SidebarProvider>
      <AppSidebar />
      <SidebarInset>{children}</SidebarInset>
    </SidebarProvider>
  );
}
