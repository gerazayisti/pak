"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { cn } from "@/lib/utils"

import {
  FileText,
  Search,
  Settings2,
  Upload,
  Inbox,
  BarChart,
  MessageSquare, 
} from "lucide-react"

interface NavItem {
  title: string;
  href: string;
  icon: React.ElementType;
}

interface DashboardNavProps {
  collapsed?: boolean;
}

const navItems: NavItem[] = [
  {
    title: "Collecte",
    href: "/collecte",
    icon: Inbox,
  },

  {
    title: "Recherche",
    href: "/recherche",
    icon: MessageSquare,
  },
  {
    title: "Rapports",
    href: "/rapports",
    icon: FileText,
  },
];

export function DashboardNav({ collapsed = false }: DashboardNavProps) {
  const path = usePathname();

  return (
    <div className="group flex flex-col gap-4 py-2">
      <nav className={cn(
        "grid gap-2 px-0",
        collapsed ? "justify-center px-1" : ""
      )}>
        {navItems.map((item, index) => (
          <Link
            key={index}
            href={item.href}
            className={cn(
              "flex items-center rounded-lg py-2 text-sm font-medium hover:bg-accent hover:text-accent-foreground transition-all duration-200",
              collapsed ? "justify-center items-center px-0 w-full h-12" : "gap-3 px-3",
              path === item.href ? "bg-accent" : "transparent"
            )}
            title={collapsed ? item.title : undefined}
          >
            <item.icon className={collapsed ? "h-7 w-7" : "h-5 w-5"} />
            {!collapsed && <span className="ml-3">{item.title}</span>}
          </Link>
        ))}
      </nav>
    </div>
  );
} 