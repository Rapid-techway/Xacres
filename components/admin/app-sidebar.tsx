"use client";

import * as React from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import {
  LayoutDashboard,
  Map,
  PlusSquare,
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

import { logout, getCurrentUser } from "@/lib/appwrite";

const navItems = [
  { name: "Dashboard", href: "/admin/dashboard", icon: LayoutDashboard },
  { name: "Lands", href: "/admin/lands", icon: Map },
  { name: "Add Land", href: "/admin/lands/new", icon: PlusSquare },
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
      className="bg-slate-50 border-r border-slate-200"
      {...props}
    >
      {/* HEADER - Logo (exactly matching your main site style) */}
      <SidebarHeader className="h-20 pt-4 border-b border-slate-200 px-6 flex items-center">
        <Link
          href="/admin/dashboard"
          className="flex flex-col"
        >
          <span className="font-bold text-slate-900 text-[22px] tracking-[-0.03em]">
            Xacres
          </span>
          <span className="text-[10px] text-slate-400 font-medium -mt-0.5">
            ADMIN DASHBOARD
          </span>
        </Link>
      </SidebarHeader>

      {/* MENU */}
      <SidebarContent className="px-3 py-6">
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
                    h-12 px-4 rounded-2xl transition-all duration-200
                    ${isActive
                      ? "bg-white text-blue-700 shadow-sm border border-slate-100"
                      : "text-slate-600 hover:bg-white hover:text-slate-900 hover:shadow-sm"
                    }
                  `}
                >
                  <Link href={item.href} className="flex items-center gap-3.5">
                    <item.icon
                      className={`size-5 transition-colors ${
                        isActive ? "text-blue-600" : "text-slate-400"
                      }`}
                      strokeWidth={2.25}
                    />
                    <span className="text-[14.5px] font-medium">
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
      <SidebarFooter className="p-4 border-t border-slate-200 mt-auto">
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <SidebarMenuButton className="h-14 w-full rounded-2xl hover:bg-white active:bg-slate-100 transition-all px-3">
              <div className="flex items-center gap-3 w-full">
                <div className="size-9 rounded-2xl bg-gradient-to-br from-slate-700 to-slate-800 flex items-center justify-center text-white text-sm font-semibold ring-2 ring-white shadow-sm shrink-0">
                  {user?.name ? user.name.substring(0, 2).toUpperCase() : "AD"}
                </div>
                <div className="flex flex-col text-left min-w-0">
                  <span className="text-sm font-semibold text-slate-900 truncate">
                    {user?.name || "Loading..."}
                  </span>
                  <span className="text-xs text-slate-500 truncate">
                    {user?.email || "..."}
                  </span>
                </div>
              </div>
            </SidebarMenuButton>
          </DropdownMenuTrigger>

          <DropdownMenuContent
            align="end"
            sideOffset={8}
            className="rounded-2xl p-1.5 border border-slate-100 shadow-xl min-w-56"
          >
            <DropdownMenuItem
              onClick={handleLogout}
              className="text-red-600 hover:bg-red-50 focus:bg-red-50 rounded-xl px-3 py-2.5 cursor-pointer flex items-center gap-2.5"
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