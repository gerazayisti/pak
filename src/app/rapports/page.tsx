"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { useToast } from "@/components/ui/use-toast"
import { Progress } from "@/components/ui/progress"
import DashboardLayout from "@/components/dashboard-layout"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { KPICategory, Quarter } from '@/types/kpi'
import { formatKPICategory } from '@/lib/kpi-utils'
import { initialKPIData } from '@/data/kpi-data'
import { generateKPIReport } from '@/lib/kpi-utils'

const quarters: Quarter[] = ['T1', 'T2', 'T3', 'T4']
const currentYear = new Date().getFullYear()

export default function RapportsPage() {
  const [selectedQuarter, setSelectedQuarter] = useState<Quarter>('T3')
  const [selectedCategory, setSelectedCategory] = useState<KPICategory | 'ALL'>('ALL')
  const [file, setFile] = useState<File | null>(null)
  const [isGenerating, setIsGenerating] = useState(false)
  const [generationProgress, setGenerationProgress] = useState(0)
  const [downloadLinks, setDownloadLinks] = useState<{
    word?: string;
    pdf?: string;
    excel?: string;
  } | null>(null)
  const { toast } = useToast()

  const report = generateKPIReport(initialKPIData, currentYear, selectedQuarter)

  const filteredCategories = selectedCategory === 'ALL' 
    ? report.categories 
    : report.categories.filter(cat => cat.category === selectedCategory)

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
        description: "Veuillez téléverser un fichier pour générer le rapport.",
      })
      return
    }

    setIsGenerating(true)
    setGenerationProgress(0)
    setDownloadLinks(null)

    try {
      // Simuler le processus de génération de rapport
      for (let i = 0; i <= 100; i += 10) {
        await new Promise((resolve) => setTimeout(resolve, 200))
        setGenerationProgress(i)
      }

      // Simuler la génération de liens de téléchargement pour différents formats
      const dummyWordContent = `Rapport Word généré à partir de ${file.name}`
      const dummyPdfContent = `Rapport PDF généré à partir de ${file.name}`
      const dummyExcelContent = `Rapport Excel généré à partir de ${file.name}`

      setDownloadLinks({
        word: URL.createObjectURL(new Blob([dummyWordContent], { type: "application/vnd.openxmlformats-officedocument.wordprocessingml.document" })),
        pdf: URL.createObjectURL(new Blob([dummyPdfContent], { type: "application/pdf" })),
        excel: URL.createObjectURL(new Blob([dummyExcelContent], { type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet" })),
      })

      toast({
        title: "Succès",
        description: "Les rapports ont été générés et sont prêts au téléchargement.",
      })
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Erreur",
        description: "Une erreur est survenue lors de la génération des rapports.",
      })
    } finally {
      setIsGenerating(false)
    }
  }

  const handleGenerateReport = async () => {
    setIsGenerating(true)
    try {
      const response = await fetch('/api/reports/generate', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          year: currentYear,
          quarter: selectedQuarter,
        }),
      })

      if (!response.ok) {
        throw new Error('Erreur lors de la génération du rapport')
      }

      const data = await response.json()

      // Créer un lien de téléchargement
      const link = document.createElement('a')
      link.href = `data:${data.mimeType};base64,${data.content}`
      link.download = `${data.title}.docx`
      document.body.appendChild(link)
      link.click()
      document.body.removeChild(link)

      toast({
        title: 'Succès',
        description: 'Le rapport a été généré avec succès',
      })
    } catch (error) {
      toast({
        title: 'Erreur',
        description: 'Une erreur est survenue lors de la génération du rapport',
        variant: 'destructive',
      })
    } finally {
      setIsGenerating(false)
    }
  }

  return (
    <DashboardLayout>
      <div className="flex flex-col items-center justify-center min-h-[calc(100vh-64px)] p-4">
        <Tabs defaultValue="generation" className="w-full max-w-6xl">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="generation">Génération de Rapport</TabsTrigger>
            <TabsTrigger value="matrice">Matrice de Données</TabsTrigger>
          </TabsList>

          <TabsContent value="generation">
            <Card>
              <CardHeader className="text-center">
                <CardTitle className="text-3xl font-bold">Génération de Rapport</CardTitle>
                <CardDescription>
                  Prototypes de rapports disponibles à affecter au modèle IA
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-6">
                  <div className="grid gap-4">
                    <div>
                      <Label>Stockage des rapports mensuels (PDF)</Label>
                      <div className="grid grid-cols-3 gap-4 mt-2">
                        <Card>
                          <CardContent className="p-4">
                            <h4 className="font-medium mb-2">Janvier</h4>
                            <Input type="file" accept=".pdf" />
                          </CardContent>
                        </Card>
                        <Card>
                          <CardContent className="p-4">
                            <h4 className="font-medium mb-2">Février</h4>
                            <Input type="file" accept=".pdf" />
                          </CardContent>
                        </Card>
                        <Card>
                          <CardContent className="p-4">
                            <h4 className="font-medium mb-2">Mars</h4>
                            <Input type="file" accept=".pdf" />
                          </CardContent>
                        </Card>
                      </div>
                    </div>
                  </div>

                  <form onSubmit={handleSubmit} className="space-y-6">
                    <div className="grid gap-4">
                      <div>
                        <Label htmlFor="report-data-file">Fichier de Données pour le Rapport</Label>
                        <Input id="report-data-file" type="file" onChange={handleFileChange} />
                      </div>
                    </div>
                    
                    <Button type="submit" className="w-full" disabled={isGenerating || !file}>
                      {isGenerating ? `Génération en cours (${generationProgress}%)` : "Générer le Rapport"}
                    </Button>

                    {isGenerating && (
                      <Progress value={generationProgress} className="w-full mt-4" />
                    )}

                    {downloadLinks && (
                      <div className="mt-6 text-center space-y-4">
                        <p className="mb-2 text-lg font-semibold">Rapports générés :</p>
                        {downloadLinks.word && (
                          <a
                            href={downloadLinks.word}
                            download="rapport_dpcg.docx"
                            className="inline-flex items-center justify-center rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 bg-secondary text-secondary-foreground hover:bg-secondary/80 h-10 px-4 py-2 mr-2"
                          >
                            Télécharger en Word
                          </a>
                        )}
                        {downloadLinks.pdf && (
                          <a
                            href={downloadLinks.pdf}
                            download="rapport_dpcg.pdf"
                            className="inline-flex items-center justify-center rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 bg-secondary text-secondary-foreground hover:bg-secondary/80 h-10 px-4 py-2 mr-2"
                          >
                            Télécharger en PDF
                          </a>
                        )}
                        {downloadLinks.excel && (
                          <a
                            href={downloadLinks.excel}
                            download="rapport_dpcg.xlsx"
                            className="inline-flex items-center justify-center rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 bg-secondary text-secondary-foreground hover:bg-secondary/80 h-10 px-4 py-2"
                          >
                            Télécharger en Excel
                          </a>
                        )}
                      </div>
                    )}
                  </form>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="matrice">
            <Card>
              <CardHeader className="text-center">
                <CardTitle className="text-3xl font-bold">Matrice de Données</CardTitle>
                <CardDescription>
                  Données extraites des rapports de suivi-évaluation trimestriels
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-8">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                    <Card>
                      <CardHeader>
                        <CardTitle>Filtres</CardTitle>
                      </CardHeader>
                      <CardContent>
                        <div className="space-y-4">
                          <div>
                            <label className="block text-sm font-medium mb-2">Trimestre</label>
                            <Select value={selectedQuarter} onValueChange={(value) => setSelectedQuarter(value as Quarter)}>
                              <SelectTrigger>
                                <SelectValue placeholder="Sélectionnez un trimestre" />
                              </SelectTrigger>
                              <SelectContent>
                                {quarters.map((quarter) => (
                                  <SelectItem key={quarter} value={quarter}>
                                    {quarter}
                                  </SelectItem>
                                ))}
                              </SelectContent>
                            </Select>
                          </div>

                          <div>
                            <label className="block text-sm font-medium mb-2">Catégorie</label>
                            <Select value={selectedCategory} onValueChange={(value) => setSelectedCategory(value as KPICategory | 'ALL')}>
                              <SelectTrigger>
                                <SelectValue placeholder="Sélectionnez une catégorie" />
                              </SelectTrigger>
                              <SelectContent>
                                <SelectItem value="ALL">Toutes les catégories</SelectItem>
                                {report.categories.map((category) => (
                                  <SelectItem key={category.category} value={category.category}>
                                    {formatKPICategory(category.category)}
                                  </SelectItem>
                                ))}
                              </SelectContent>
                            </Select>
                          </div>

                          <Button 
                            onClick={handleGenerateReport}
                            disabled={isGenerating}
                            className="w-full"
                          >
                            {isGenerating ? 'Génération en cours...' : 'Générer le rapport Word'}
                          </Button>
                        </div>
                      </CardContent>
                    </Card>

                    <Card>
                      <CardHeader>
                        <CardTitle>Résumé Global</CardTitle>
                      </CardHeader>
                      <CardContent>
                        <div className="grid grid-cols-2 gap-4">
                          <div className="bg-gray-50 p-4 rounded-lg">
                            <p className="text-sm text-gray-500">Total KPI</p>
                            <p className="text-2xl font-bold">{report.overallStatus.total}</p>
                          </div>
                          <div className="bg-green-50 p-4 rounded-lg">
                            <p className="text-sm text-green-600">Dans la Tendance</p>
                            <p className="text-2xl font-bold text-green-700">{report.overallStatus.completed}</p>
                          </div>
                          <div className="bg-yellow-50 p-4 rounded-lg">
                            <p className="text-sm text-yellow-600">En Cours</p>
                            <p className="text-2xl font-bold text-yellow-700">{report.overallStatus.inProgress}</p>
                          </div>
                          <div className="bg-red-50 p-4 rounded-lg">
                            <p className="text-sm text-red-600">À Rattraper</p>
                            <p className="text-2xl font-bold text-red-700">{report.overallStatus.delayed}</p>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  </div>

                  <div className="space-y-6">
                    {filteredCategories.map((category) => (
                      <Card key={category.category}>
                        <CardHeader>
                          <CardTitle>{formatKPICategory(category.category)}</CardTitle>
                        </CardHeader>
                        <CardContent>
                          <div className="space-y-4">
                            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                              <div>
                                <p className="text-sm text-gray-500">Total KPI</p>
                                <p className="text-lg font-semibold">{category.totalKPIs}</p>
                              </div>
                              <div>
                                <p className="text-sm text-gray-500">Dans la Tendance</p>
                                <p className="text-lg font-semibold text-green-600">{category.completedKPIs}</p>
                              </div>
                              <div>
                                <p className="text-sm text-gray-500">En Cours</p>
                                <p className="text-lg font-semibold text-yellow-600">{category.inProgressKPIs}</p>
                              </div>
                              <div>
                                <p className="text-sm text-gray-500">À Rattraper</p>
                                <p className="text-lg font-semibold text-red-600">{category.delayedKPIs}</p>
                              </div>
                            </div>

                            <div className="w-full bg-gray-200 rounded-full h-2.5">
                              <div
                                className="bg-green-600 h-2.5 rounded-full"
                                style={{
                                  width: `${(category.completedKPIs / category.totalKPIs) * 100}%`,
                                }}
                              ></div>
                            </div>
                            <p className="text-sm text-gray-500">
                              Progression : {Math.round((category.completedKPIs / category.totalKPIs) * 100)}%
                            </p>
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </DashboardLayout>
  )
} 