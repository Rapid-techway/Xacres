import { SidebarProvider, SidebarInset, SidebarTrigger } from "@/components/ui/sidebar"
import { AppSidebar } from "@/components/admin/app-sidebar"
import { Menu } from "lucide-react"

export default function AdminProtectedLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <SidebarProvider>
      <div className="flex min-h-svh w-full bg-white">
        {/* Sidebar */}
        <AppSidebar />

        <SidebarInset className="flex flex-col flex-1 min-w-0">
          {/* Header with Hamburger Menu for Mobile - Hidden on Desktop */}
          <header className="sticky top-0 z-40 flex h-16 shrink-0 items-center justify-between border-b border-slate-200 bg-white/80 backdrop-blur-md px-4 md:hidden">
            <div className="flex items-center gap-4">
              <SidebarTrigger>
                <Menu className="size-5 text-slate-600" />
              </SidebarTrigger>
              
              <div className="flex items-center gap-2">
                <span className="font-bold text-slate-900 tracking-tight text-lg">
                  Xacres
                </span>
                <div className="h-4 w-[1px] bg-slate-200 mx-1" />
                <span className="text-[10px] text-slate-500 font-semibold align-middle uppercase tracking-widest">
                  Admin
                </span>
              </div>
            </div>
          </header>

          <main className="flex-1 w-full">
            <div className="p-4 md:p-8 w-full">
              {children}
            </div>
          </main>
        </SidebarInset>
      </div>
    </SidebarProvider>
  )
}