"use client";

import * as React from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import {
  LayoutDashboard,
  Map,
  PlusSquare,
  Inbox,
  LogOut,
} from "lucide-react";

import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  useSidebar,
} from "@/components/ui/sidebar";

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

import { logout, getCurrentUser } from "@/lib/supabase";

const navItems = [
  { name: "Dashboard", href: "/admin/dashboard", icon: LayoutDashboard },
  { name: "Lands", href: "/admin/lands", icon: Map },
  { name: "Add Land", href: "/admin/lands/new", icon: PlusSquare },
  { name: "Leads", href: "/admin/leads", icon: Inbox },
];

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  const pathname = usePathname();
  const router = useRouter();
  const { setOpenMobile } = useSidebar();
  const [user, setUser] = React.useState<{ name: string; email: string } | null>(null);

  const [mounted, setMounted] = React.useState(false);

  React.useEffect(() => {
    setMounted(true);
    const fetchUser = async () => {
      const currentUser = await getCurrentUser();
      if (currentUser) {
        setUser({
          name: currentUser.name || "Admin User",
          email: currentUser.email || "admin@xacres.com",
        });
      }
    };
    fetchUser();
  }, []);

  const handleLogout = async () => {
    await logout();
    router.push("/admin/login");
  };

  if (!mounted) return null;

  return (
    <Sidebar
      className="bg-[#fafafa] border-r border-[#e7e5e4]"
      {...props}
    >
      {/* HEADER - Logo (exactly matching your main site style) */}
      <SidebarHeader className="h-20 pt-4 border-b border-[#e7e5e4] px-6 flex items-center bg-[#fafafa]">
        <Link
          href="/admin/dashboard"
          className="flex flex-col"
        >
          <span className="font-sans font-bold text-stone-900 text-[22px] tracking-tight">
            Xacres
          </span>
          <span className="text-[9px] text-stone-400 font-semibold tracking-widest -mt-0.5 uppercase">
            ADMIN PANEL
          </span>
        </Link>
      </SidebarHeader>

      {/* MENU */}
      <SidebarContent className="px-3 py-6 bg-[#fafafa]">
        <SidebarMenu className="gap-1.5">
          {navItems.map((item) => {
            const isActive =
              pathname === item.href ||
              (pathname?.startsWith(item.href + "/") &&
                !navItems.some(
                  (other) =>
                    other.href !== item.href &&
                    other.href.startsWith(item.href) &&
                    pathname.startsWith(other.href)
                ));

            return (
              <SidebarMenuItem key={item.name}>
                <SidebarMenuButton
                  asChild
                  isActive={isActive}
                  onClick={() => setOpenMobile(false)}
                  className={`
                    h-10 px-4 rounded-full transition-all duration-150
                    ${isActive
                      ? "bg-white text-stone-900 shadow-sm border border-[#e7e5e4]"
                      : "text-stone-605 hover:bg-white/60 hover:text-stone-900"
                    }
                  `}
                >
                  <Link href={item.href} className="flex items-center gap-3">
                    <item.icon
                      className={`size-4.5 transition-colors ${
                        isActive ? "text-blue-600" : "text-stone-400"
                      }`}
                      strokeWidth={isActive ? 2.25 : 1.75}
                    />
                    <span className="text-[14px] font-medium tracking-[0.15px]">
                      {item.name}
                    </span>
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>
            );
          })}
        </SidebarMenu>
      </SidebarContent>

      {/* FOOTER - Profile */}
      <SidebarFooter className="p-4 border-t border-[#e7e5e4] bg-[#fafafa] mt-auto">
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <SidebarMenuButton className="h-12 w-full rounded-full hover:bg-white/85 active:bg-white transition-all px-3">
              <div className="flex items-center gap-2.5 w-full">
                <div className="size-8 rounded-full bg-blue-50 border border-blue-100 flex items-center justify-center text-blue-700 text-xs font-semibold shrink-0">
                  {user?.name ? user.name.substring(0, 2).toUpperCase() : "AD"}
                </div>
                <div className="flex flex-col text-left min-w-0">
                  <span className="text-xs font-semibold text-stone-900 truncate">
                    {user?.name || "Loading..."}
                  </span>
                  <span className="text-[10px] text-stone-500 truncate">
                    {user?.email || "..."}
                  </span>
                </div>
              </div>
            </SidebarMenuButton>
          </DropdownMenuTrigger>

          <DropdownMenuContent
            align="end"
            sideOffset={8}
            className="rounded-xl p-1 border border-[#e7e5e4] bg-white shadow-md min-w-52"
          >
            <DropdownMenuItem
              onClick={handleLogout}
              className="text-red-600 hover:bg-red-50 focus:bg-red-50 rounded-lg px-3 py-2 cursor-pointer flex items-center gap-2 text-xs"
            >
              <LogOut className="size-4" />
              <span className="font-medium">Logout</span>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </SidebarFooter>
    </Sidebar>
  );
}