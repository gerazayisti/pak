"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { cn } from "@/lib/utils"

import {
  FileText,
  Search,
  Settings2,
  Upload,
  BarChart,
} from "lucide-react"

interface NavItem {
  title: string;
  href: string;
  icon: React.ElementType;
}

const navItems: NavItem[] = [
  {
    title: "Collecte & Centralisation",
    href: "/collecte",
    icon: Upload,
  },
  {
    title: "Prétraitement",
    href: "/pretraitement",
    icon: Settings2,
  },
  {
    title: "Recherche",
    href: "/recherche",
    icon: Search,
  },
  {
    title: "Rapports",
    href: "/rapports",
    icon: BarChart,
  },
];

export function DashboardNav() {
  const path = usePathname();

  return (
    <div className="group flex flex-col gap-4 py-2">
      <nav className="grid gap-1 px-0 group-[[data-collapsed=true]]:justify-center group-[[data-collapsed=true]]:px-1">
        {navItems.map((item, index) => (
          <Link
            key={index}
            href={item.href}
            className={cn(
              "flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium hover:bg-accent hover:text-accent-foreground",
              path === item.href ? "bg-accent" : "transparent"
            )}
          >
            <item.icon className="h-4 w-4" />
            <span>{item.title}</span>
          </Link>
        ))}
      </nav>
    </div>
  );
} 