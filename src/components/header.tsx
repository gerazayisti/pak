import React from "react";
import { Input } from "@/components/ui/input";
import { Bell, Search, Settings, User } from "lucide-react";

interface DashboardHeaderProps {
  // Supprimé heading, text, children car la structure de l'en-tête est maintenant fixe selon le design
}

export function DashboardHeader({}: DashboardHeaderProps) {
  return (
    <header className="flex h-16 items-center justify-between border-b px-6">
      {/* Left side: Search bar */}
      <div className="relative flex items-center">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 h-5 w-5" />
        <Input
          type="text"
          placeholder="Rechercher..."
          className="pl-10 pr-4 py-2 rounded-lg border focus:outline-none focus:ring-2 focus:ring-blue-500 w-64"
        />
      </div>

      {/* Right side: Icons */}
      <div className="flex items-center space-x-4">
        <Bell className="h-6 w-6 text-gray-600 cursor-pointer hover:text-gray-900" />
        <Settings className="h-6 w-6 text-gray-600 cursor-pointer hover:text-gray-900" />
        <div className="h-8 w-8 rounded-full bg-gray-300 flex items-center justify-center text-gray-600 cursor-pointer">
          <User className="h-5 w-5" />
        </div>
      </div>
    </header>
  );
} 