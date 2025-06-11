"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { useToast } from "@/components/ui/use-toast"
import { Switch } from "@/components/ui/switch"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { useTheme } from "next-themes"
import DashboardLayout from "@/components/dashboard-layout"

export default function ParametresPage() {
  const { toast } = useToast()
  const { theme, setTheme } = useTheme()
  const [isLoading, setIsLoading] = useState(false)

  const [settings, setSettings] = useState({
    notifications: true,
    darkMode: theme === "dark",
    language: "fr",
    timezone: "Africa/Douala",
  })

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)

    try {
      // TODO: Implémenter la sauvegarde des paramètres
      await new Promise(resolve => setTimeout(resolve, 1000)) // Simulation
      
      toast({
        title: "Paramètres sauvegardés",
        description: "Vos paramètres ont été mis à jour avec succès.",
      })
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Erreur",
        description: "Une erreur est survenue lors de la sauvegarde des paramètres.",
      })
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <DashboardLayout>
    <div className="max-w-2xl mx-auto">
      <div className="bg-card rounded-lg shadow p-6">
        <h2 className="text-2xl font-semibold mb-6 text-foreground">Paramètres</h2>
        
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label>Notifications</Label>
                <p className="text-sm text-muted-foreground">
                  Recevoir des notifications pour les mises à jour importantes
                </p>
              </div>
              <Switch
                checked={settings.notifications}
                onCheckedChange={(checked) => setSettings({ ...settings, notifications: checked })}
              />
            </div>

            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label>Mode sombre</Label>
                <p className="text-sm text-muted-foreground">
                  Activer le thème sombre de l'application
                </p>
              </div>
              <Switch
                checked={settings.darkMode}
                onCheckedChange={(checked) => {
                  setSettings({ ...settings, darkMode: checked })
                  setTheme(checked ? "dark" : "light")
                }}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="language">Langue</Label>
              <Select
                value={settings.language}
                onValueChange={(value) => setSettings({ ...settings, language: value })}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Sélectionner une langue" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="fr">Français</SelectItem>
                  <SelectItem value="en">English</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="timezone">Fuseau horaire</Label>
              <Select
                value={settings.timezone}
                onValueChange={(value) => setSettings({ ...settings, timezone: value })}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Sélectionner un fuseau horaire" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Africa/Douala">Douala (GMT+1)</SelectItem>
                  <SelectItem value="Africa/Yaounde">Yaoundé (GMT+1)</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <Button type="submit" className="w-full" disabled={isLoading}>
            {isLoading ? "Sauvegarde..." : "Sauvegarder les paramètres"}
          </Button>
        </form>
      </div>
    </div>
    </DashboardLayout>
  )
} 