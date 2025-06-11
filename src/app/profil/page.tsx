"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { useToast } from "@/components/ui/use-toast"
import { useSession } from "next-auth/react"
import DashboardLayout from "@/components/dashboard-layout"

export default function ProfilPage() {
  const { toast } = useToast()
  const { data: session } = useSession()
  const [isLoading, setIsLoading] = useState(false)

  const [profile, setProfile] = useState({
    name: session?.user?.name || "",
    email: session?.user?.email || "",
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  })

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)

    try {
      // TODO: Implémenter la mise à jour du profil
      await new Promise(resolve => setTimeout(resolve, 1000)) // Simulation
      
      toast({
        title: "Profil mis à jour",
        description: "Vos informations ont été mises à jour avec succès.",
      })
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Erreur",
        description: "Une erreur est survenue lors de la mise à jour du profil.",
      })
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <DashboardLayout>
      <div className="max-w-2xl mx-auto">
        <div className="bg-card rounded-lg shadow p-6">
          <h2 className="text-2xl font-semibold mb-6 text-foreground">Profil</h2>
          
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="name">Nom</Label>
                <Input
                  id="name"
                  value={profile.name}
                  onChange={(e) => setProfile({ ...profile, name: e.target.value })}
                  placeholder="Votre nom"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  type="email"
                  value={profile.email}
                  onChange={(e) => setProfile({ ...profile, email: e.target.value })}
                  placeholder="votre@email.com"
                />
              </div>

              <div className="border-t border-border pt-6">
                <h3 className="text-lg font-medium mb-4 text-foreground">Changer le mot de passe</h3>
                
                <div className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="currentPassword">Mot de passe actuel</Label>
                    <Input
                      id="currentPassword"
                      type="password"
                      value={profile.currentPassword}
                      onChange={(e) => setProfile({ ...profile, currentPassword: e.target.value })}
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="newPassword">Nouveau mot de passe</Label>
                    <Input
                      id="newPassword"
                      type="password"
                      value={profile.newPassword}
                      onChange={(e) => setProfile({ ...profile, newPassword: e.target.value })}
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="confirmPassword">Confirmer le mot de passe</Label>
                    <Input
                      id="confirmPassword"
                      type="password"
                      value={profile.confirmPassword}
                      onChange={(e) => setProfile({ ...profile, confirmPassword: e.target.value })}
                    />
                  </div>
                </div>
              </div>
            </div>

            <Button type="submit" className="w-full" disabled={isLoading}>
              {isLoading ? "Mise à jour..." : "Mettre à jour le profil"}
            </Button>
          </form>
        </div>
      </div>
    </DashboardLayout>
  )
} 