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

export default function RapportsPage() {
  const [file, setFile] = useState<File | null>(null)
  const [isGenerating, setIsGenerating] = useState(false)
  const [generationProgress, setGenerationProgress] = useState(0)
  const [downloadLinks, setDownloadLinks] = useState<{
    word?: string;
    pdf?: string;
    excel?: string;
  } | null>(null)
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
                  <div>
                    <h3 className="text-xl font-semibold mb-4">📊 Évaluation T1 (EVAL T1)</h3>
                    <div className="overflow-x-auto">
                      <Table>
                        <TableHeader>
                          <TableRow>
                            <TableHead>Activité</TableHead>
                            <TableHead>Indicateur</TableHead>
                            <TableHead>Cible</TableHead>
                            <TableHead>Méthode de calcul</TableHead>
                            <TableHead>Valeur T1</TableHead>
                            <TableHead>Appréciation</TableHead>
                            <TableHead>Justification</TableHead>
                            <TableHead>Actions correctives</TableHead>
                          </TableRow>
                        </TableHeader>
                        <TableBody>
                          <TableRow>
                            <TableCell>Lettre de cadrage approuvé</TableCell>
                            <TableCell>Taux de respect des délais de publication de la lettre de cadrage</TableCell>
                            <TableCell>1</TableCell>
                            <TableCell>Durée réalisée/durée prévisionnelle</TableCell>
                            <TableCell>/</TableCell>
                            <TableCell>NON DU POUR LA PERIODE</TableCell>
                            <TableCell>Cet indicateur sera évalué au second semestre</TableCell>
                            <TableCell>—</TableCell>
                          </TableRow>
                        </TableBody>
                      </Table>
                    </div>
                  </div>

                  <div>
                    <h3 className="text-xl font-semibold mb-4">📊 Évaluation T2 (EVAL T2)</h3>
                    <div className="overflow-x-auto">
                      <Table>
                        <TableHeader>
                          <TableRow>
                            <TableHead>Activité</TableHead>
                            <TableHead>Indicateur</TableHead>
                            <TableHead>Cible</TableHead>
                            <TableHead>Méthode de calcul</TableHead>
                            <TableHead>Valeur T1</TableHead>
                            <TableHead>Valeur T2</TableHead>
                            <TableHead>Appréciation</TableHead>
                            <TableHead>Justification</TableHead>
                            <TableHead>Actions correctives</TableHead>
                          </TableRow>
                        </TableHeader>
                        <TableBody>
                          <TableRow>
                            <TableCell>Lettre de cadrage approuvé</TableCell>
                            <TableCell>Taux de respect des délais de publication de la lettre de cadrage</TableCell>
                            <TableCell>1</TableCell>
                            <TableCell>Durée réalisée/durée prévisionnelle</TableCell>
                            <TableCell>/</TableCell>
                            <TableCell>/</TableCell>
                            <TableCell></TableCell>
                            <TableCell></TableCell>
                            <TableCell></TableCell>
                          </TableRow>
                        </TableBody>
                      </Table>
                    </div>
                  </div>

                  <div>
                    <h3 className="text-xl font-semibold mb-4">📊 Statistiques T3 (EVAL T3 stats)</h3>
                    <div className="overflow-x-auto">
                      <Table>
                        <TableHeader>
                          <TableRow>
                            <TableHead>Activité</TableHead>
                            <TableHead>Indicateur</TableHead>
                            <TableHead>Cible</TableHead>
                            <TableHead>Méthode de calcul</TableHead>
                            <TableHead>T1</TableHead>
                            <TableHead>T2</TableHead>
                            <TableHead>T3</TableHead>
                            <TableHead>Appréciation</TableHead>
                            <TableHead>Justification</TableHead>
                            <TableHead>Action</TableHead>
                          </TableRow>
                        </TableHeader>
                        <TableBody>
                          <TableRow>
                            <TableCell>Rapport de suivi-évaluation trimestriel</TableCell>
                            <TableCell>Nombre de rapports de suivi-évaluation</TableCell>
                            <TableCell>4</TableCell>
                            <TableCell>—</TableCell>
                            <TableCell>0</TableCell>
                            <TableCell>1</TableCell>
                            <TableCell>2</TableCell>
                            <TableCell>A RATTRAPER</TableCell>
                            <TableCell>Le rapport de T1 n'a pas été produit</TableCell>
                            <TableCell>Sensibilisation des points focaux</TableCell>
                          </TableRow>
                        </TableBody>
                      </Table>
                    </div>
                  </div>

                  <div>
                    <h3 className="text-xl font-semibold mb-4">📊 Statistiques T2 (EVAL T2 Stats)</h3>
                    <div className="overflow-x-auto">
                      <Table>
                        <TableHeader>
                          <TableRow>
                            <TableHead>Activité</TableHead>
                            <TableHead>Indicateur</TableHead>
                            <TableHead>Cible</TableHead>
                            <TableHead>Méthode de calcul</TableHead>
                            <TableHead>T1</TableHead>
                            <TableHead>T2</TableHead>
                            <TableHead>Appréciation</TableHead>
                            <TableHead>Justification</TableHead>
                            <TableHead>Actions</TableHead>
                          </TableRow>
                        </TableHeader>
                        <TableBody>
                          <TableRow>
                            <TableCell>Lettre de cadrage approuvé</TableCell>
                            <TableCell>Taux de respect des délais de publication de la lettre de cadrage</TableCell>
                            <TableCell>1</TableCell>
                            <TableCell>Durée réalisée/durée prévisionnelle</TableCell>
                            <TableCell>/</TableCell>
                            <TableCell>/</TableCell>
                            <TableCell>NON RENSEIGNE</TableCell>
                            <TableCell>—</TableCell>
                            <TableCell>—</TableCell>
                          </TableRow>
                        </TableBody>
                      </Table>
                    </div>
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