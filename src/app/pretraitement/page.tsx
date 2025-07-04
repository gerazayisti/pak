"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { useToast } from "@/components/ui/use-toast"
import { Progress } from "@/components/ui/progress"
import DashboardLayout from "@/components/dashboard-layout"

export default function PretraitementPage() {
  const [file, setFile] = useState<File | null>(null)
  const [isProcessing, setIsProcessing] = useState(false)
  const [downloadLink, setDownloadLink] = useState<string | null>(null)
  const [processingProgress, setProcessingProgress] = useState(0)
  const { toast } = useToast()

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files && event.target.files[0]) {
      setFile(event.target.files[0])
    }
  }

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault()

    if (!file) {
      toast({
        variant: "destructive",
        title: "Fichier manquant",
        description: "Veuillez téléverser un fichier pour le prétraitement.",
      })
      return
    }

    setIsProcessing(true)
    setProcessingProgress(0)
    setDownloadLink(null)

    try {
      // Simuler le téléversement et le traitement
      for (let i = 0; i <= 100; i += 10) {
        await new Promise((resolve) => setTimeout(resolve, 200))
        setProcessingProgress(i)
      }

      // Simuler la génération du lien de téléchargement (données nettoyées)
      const dummyProcessedContent = `Données nettoyées et standardisées de ${file.name}`
      const dummyDownloadLink = URL.createObjectURL(new Blob([dummyProcessedContent], { type: "application/octet-stream" }))
      setDownloadLink(dummyDownloadLink)

      toast({
        title: "Succès",
        description: "Les données ont été traitées et sont prêtes au téléchargement.",
      })
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Erreur",
        description: "Une erreur est survenue lors du prétraitement des fichiers.",
      })
    } finally {
      setIsProcessing(false)
    }
  }

  return (
    <DashboardLayout>
      <div className="flex flex-col items-center justify-center min-h-[calc(100vh-64px)] p-4">
        <Card className="w-full max-w-2xl">
          <CardHeader className="text-center">
            <CardTitle className="text-3xl font-bold">Module 2 : Prétraitement et Standardisation des Données</CardTitle>
            <CardDescription>Téléversez des fichiers pour vérifier, corriger et harmoniser les données.</CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid gap-4">
                <div>
                  <Label htmlFor="data-file">Fichier de Données à Prétraiter</Label>
                  <Input id="data-file" type="file" onChange={handleFileChange} />
                </div>
              </div>
              
              <Button type="submit" className="w-full" disabled={isProcessing || !file}>
                {isProcessing ? `Traitement en cours (${processingProgress}%)` : "Prétraiter & Standardiser"}
              </Button>

              {isProcessing && (
                <Progress value={processingProgress} className="w-full mt-4" />
              )}

              {downloadLink && (
                <div className="mt-6 text-center">
                  <p className="mb-2">Fichier traité généré :</p>
                  <a
                    href={downloadLink}
                    download="donnees_standardisees.xlsx"
                    className="inline-flex items-center justify-center rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 bg-primary text-primary-foreground hover:bg-primary/90 h-10 px-4 py-2"
                  >
                    Télécharger le Fichier Traité
                  </a>
                </div>
              )}
            </form>
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  )
} 