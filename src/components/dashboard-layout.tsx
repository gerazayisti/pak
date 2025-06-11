"use client"

import React, { useState } from 'react';
import { DashboardHeader } from "@/components/header";
import { DashboardNav } from "@/components/nav";
import Link from "next/link";
import Image from "next/image"
import { NotificationContainer, NotificationType } from "@/components/ui/notification"
import { usePathname } from "next/navigation"
import { User, Settings, LogOut, Menu, X } from "lucide-react"
import { useSession, signOut } from "next-auth/react"
import { ThemeToggle } from "@/components/theme-toggle"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { cn } from "@/lib/utils"

interface DashboardLayoutProps {
  children: React.ReactNode;
}

export default function DashboardLayout({ children }: DashboardLayoutProps) {
  const [notifications, setNotifications] = useState<NotificationType[]>([])
  const [isSidebarOpen, setIsSidebarOpen] = useState(true)
  const pathname = usePathname()
  const { data: session } = useSession()

  const addNotification = (notification: Omit<NotificationType, "id" | "timestamp">) => {
    const newNotification: NotificationType = {
      ...notification,
      id: Math.random().toString(36).substr(2, 9),
      timestamp: new Date(),
      location: "header",
    }
    setNotifications((prev) => [...prev, newNotification])
  }

  // Exemple de notification de base de données
  const handleDatabaseUpdate = () => {
    addNotification({
      title: "Mise à jour de la base de données",
      message: "Les données ont été synchronisées avec succès.",
      type: "database",
    })
  }

  return (
    <div className="flex min-h-screen bg-background">
      {/* Sidebar */}
      <aside
        className={cn(
          "fixed inset-y-0 left-0 z-50 w-64 transition-transform duration-300 ease-in-out",
          !isSidebarOpen && "-translate-x-full"
        )}
      >
        <div className="h-full mx-4 my-4 rounded-xl bg-card border border-border shadow-lg">
          <div className="flex h-16 items-center justify-between px-6 border-b border-border">
            <Link href="/" className="flex items-center gap-2 font-bold text-2xl text-foreground">
              <div className="relative h-8 w-8 rounded-full overflow-hidden">
                <Image
                  src="/paklogo.jpg"
                  alt="Logo PAK"
                  fill
                  className="object-contain"
                  priority
                />
              </div>
              <span>PAK</span>
             
            </Link> 
            
            <button
              onClick={() => setIsSidebarOpen(false)}
              className="p-2 rounded-md hover:bg-accent lg:hidden"
            >
              <X className="h-5 w-5" />
            </button>
          </div>
          <div className="p-6">
            <DashboardNav />
          </div>
        </div>
      </aside>

      {/* Main Content */}
      <div className="flex flex-col flex-1 lg:pl-72">
        <header className="sticky top-4 z-20 bg-card border border-border rounded-lg">
          <div className="flex h-16 items-center justify-between px-4 sm:px-6 lg:px-8">
            <div className="flex items-center gap-4">
              <button
                onClick={() => setIsSidebarOpen(true)}
                className="p-2 rounded-md hover:bg-accent lg:hidden"
              >
                <Menu className="h-5 w-5" />
              </button>
              <h1 className="text-xl font-semibold text-foreground">
                {pathname === "/" ? "Tableau de bord" : 
                 pathname === "/rapports" ? "Rapports" :
                 pathname === "/utilisateurs" ? "Utilisateurs" :
                 pathname === "/parametres" ? "Paramètres" :
                 pathname === "/profil" ? "Profil" : "PAK"}
              </h1>
            </div>
            <div className="flex items-center gap-2">
              <NotificationContainer location="header" />
              <ThemeToggle />
              <button
                onClick={handleDatabaseUpdate}
                className="rounded-md bg-primary px-3 py-2 text-sm font-medium text-primary-foreground hover:bg-primary/90"
              >
                Synchroniser
              </button>
              <DropdownMenu>
                <DropdownMenuTrigger className="flex items-center gap-2 rounded-full p-2 hover:bg-accent">
                  <div className="relative h-8 w-8 rounded-full bg-muted">
                    {session?.user?.image ? (
                      <Image
                        src={session.user.image}
                        alt={session.user.name || "Avatar"}
                        fill
                        className="rounded-full object-cover"
                      />
                    ) : (
                      <User className="h-4 w-4 absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 text-muted-foreground" />
                    )}
                  </div>
                  <span className="text-sm font-medium text-foreground">
                    {session?.user?.name || "Utilisateur"}
                  </span>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-56">
                  <DropdownMenuLabel>Mon compte</DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem asChild>
                    <Link href="/profil" className="flex items-center gap-2">
                      <User className="h-4 w-4" />
                      <span>Profil</span>
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem asChild>
                    <Link href="/parametres" className="flex items-center gap-2">
                      <Settings className="h-4 w-4" />
                      <span>Paramètres</span>
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem
                    onClick={() => signOut()}
                    className="flex items-center gap-2 text-destructive"
                  >
                    <LogOut className="h-4 w-4" />
                    <span>Déconnexion</span>
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </div>
        </header>
        <main className="flex-1 p-6">
          {children}
        </main>
      </div>
    </div>
  );
} 