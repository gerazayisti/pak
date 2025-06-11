"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { useToast } from "@/components/ui/use-toast"
import { Progress } from "@/components/ui/progress"
import DashboardLayout from "@/components/dashboard-layout"

export default function CollectePage() {
  const [pdfFile, setPdfFile] = useState<File | null>(null)
  const [excelFile, setExcelFile] = useState<File | null>(null)
  const [isProcessing, setIsProcessing] = useState(false)
  const [downloadLink, setDownloadLink] = useState<string | null>(null)
  const [processingProgress, setProcessingProgress] = useState(0)
  const { toast } = useToast()

  const handlePdfFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files && event.target.files[0]) {
      setPdfFile(event.target.files[0])
    }
  }

  const handleExcelFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files && event.target.files[0]) {
      setExcelFile(event.target.files[0])
    }
  }

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault()

    if (!pdfFile && !excelFile) {
      toast({
        variant: "destructive",
        title: "Fichiers manquants",
        description: "Veuillez téléverser au moins un fichier PDF ou Excel.",
      })
      return
    }

    setIsProcessing(true)
    setProcessingProgress(0)
    setDownloadLink(null)

    try {
      // Simuler le téléversement et le traitement
      for (let i = 0; i <= 100; i += 10) {
        await new Promise((resolve) => setTimeout(resolve, 300))
        setProcessingProgress(i)
      }

      // Simuler la génération du lien de téléchargement
      const dummyDownloadLink = URL.createObjectURL(new Blob(["Contenu de la matrice préremplie"], { type: "application/octet-stream" }))
      setDownloadLink(dummyDownloadLink)

      toast({
        title: "Succès",
        description: "La matrice préremplie est prête au téléchargement.",
      })
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Erreur",
        description: "Une erreur est survenue lors du traitement des fichiers.",
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
          <CardTitle className="text-3xl font-bold">Module 1 : Collecte et Centralisation des Données</CardTitle>
          <CardDescription>Téléversez vos rapports PDF et fichiers Excel pour le pré-remplissage des matrices.</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid gap-4">
              <div>
                <Label htmlFor="pdf-file">Rapport PDF (Mensuel/Trimestriel)</Label>
                <Input id="pdf-file" type="file" accept=".pdf" onChange={handlePdfFileChange} />
              </div>
              <div>
                <Label htmlFor="excel-file">Fichier Excel d'engagement (ERP)</Label>
                <Input id="excel-file" type="file" accept=".xls,.xlsx" onChange={handleExcelFileChange} />
              </div>
            </div>
            
            <Button type="submit" className="w-full" disabled={isProcessing || (!pdfFile && !excelFile)}>
              {isProcessing ? `Traitement en cours (${processingProgress}%)` : "Extraire & Pré-remplir"}
            </Button>

            {isProcessing && (
              <Progress value={processingProgress} className="w-full mt-4" />
            )}

            {downloadLink && (
              <div className="mt-6 text-center">
                <p className="mb-2">Matrice préremplie générée :</p>
                <a
                  href={downloadLink}
                  download="matrice_preremplie.xlsx"
                  className="inline-flex items-center justify-center rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 bg-primary text-primary-foreground hover:bg-primary/90 h-10 px-4 py-2"
                >
                  Télécharger la Matrice Préremplie
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