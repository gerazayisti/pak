"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { useToast } from "@/components/ui/use-toast"
import { Progress } from "@/components/ui/progress"
import DashboardLayout from "@/components/dashboard-layout"
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { KPICategory } from '@/types/kpi'
import { formatKPICategory } from '@/lib/kpi-utils'
import { FiUpload, FiFileText, FiFile } from 'react-icons/fi'
import { Textarea } from "@/components/ui/textarea"

const categories: KPICategory[] = [
  'PLANIFICATION',
  'PILOTAGE_ET_MESURE_DE_LA_PERFORMANCE',
  'MANAGEMENT_DES_PROCESSUS',
  'SUIVI_DE_LA_COHERENCE_DES_SYSTEMES_D_INFORMATIONS',
  'ANALYSE_ET_CONTROLE_BUDGETAIRE',
  'OPTIMISATION_ET_RATIONALISATION_DE_L_UTILISATION_DES_RESSOURCES',
  'CONTROLE_DE_LA_COHERENCE_DES_INFORMATIONS_DE_GESTION',
  'APPUI_A_LA_COORDINATION_ET_AU_RENFORCEMENT_DES_CAPACITES'
]

export default function CollectePage() {
  const [selectedCategory, setSelectedCategory] = useState<KPICategory | null>(null)
  const [inputMode, setInputMode] = useState<'upload' | 'form'>('upload')
  const [isUploading, setIsUploading] = useState(false)
  const { toast } = useToast()

  const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (!file) return

    if (!file.name.endsWith('.xlsx') && !file.name.endsWith('.xls') && !file.name.endsWith('.pdf')) {
      toast({
        title: "Erreur",
        description: "Veuillez téléverser un fichier Excel (.xlsx, .xls) ou PDF (.pdf)",
        variant: "destructive",
      })
      return
    }

    setIsUploading(true)

    try {
      const formData = new FormData()
      formData.append('file', file)

      const response = await fetch('https://pak-agent.app.n8n.cloud/webhook/9ba11544-5c4e-4f91-818a-08a4ecb596c5', {
        method: 'POST',
        headers: {
          'Authorization': 'Bearer 1234567890abcde',
        },
        body: formData,
      })

      if (!response.ok) {
        throw new Error("Erreur lors de l'envoi au webhook-test n8n")
      }

      toast({
        title: "Succès",
        description: "Le fichier a été envoyé au workflow n8n avec succès.",
      })

      event.target.value = ''
    } catch (error) {
      console.error('Erreur:', error)
      toast({
        title: "Erreur",
        description: error instanceof Error ? error.message : "Une erreur est survenue lors de l'envoi au webhook-test n8n",
        variant: "destructive",
      })
    } finally {
      setIsUploading(false)
    }
  }

  const handleFormSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    toast({
      title: "Succès",
      description: "Les données ont été enregistrées avec succès",
    })
  }

  return (
    <DashboardLayout>
      <div className="container mx-auto py-8">
        <h1 className="text-2xl font-bold mb-6">Collecte des Données KPI</h1>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
          {categories.map((category) => (
            <Card 
              key={category} 
              className="hover:shadow-lg transition-shadow cursor-pointer"
              onClick={() => setSelectedCategory(category)}
            >
              <CardHeader>
                <CardTitle className="text-lg font-semibold">
                  {formatKPICategory(category)}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-sm text-gray-500">
                  <p>Cliquez pour voir les détails et saisir les données</p>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {selectedCategory && (
          <Card className="mb-8">
            <CardHeader>
              <CardTitle>{formatKPICategory(selectedCategory)}</CardTitle>
            </CardHeader>
            <CardContent>
              <Tabs defaultValue="upload" className="w-full">
                <TabsList className="grid w-full grid-cols-2 mb-6">
                  <TabsTrigger value="upload" onClick={() => setInputMode('upload')}>
                    <FiUpload className="w-4 h-4 mr-2" />
                    Téléversement
                  </TabsTrigger>
                  <TabsTrigger value="form" onClick={() => setInputMode('form')}>
                    <FiFileText className="w-4 h-4 mr-2" />
                    Formulaire
                  </TabsTrigger>
                </TabsList>

                <TabsContent value="upload">
                  <div className="space-y-4">
                    <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center">
                      <div className="flex flex-col items-center justify-center space-y-4">
                        <FiFile className="h-12 w-12 text-gray-400" />
                        <div className="text-sm text-gray-500">
                          <p>Glissez-déposez votre fichier Excel ici ou</p>
                          <label htmlFor="file-upload" className="relative cursor-pointer">
                            <span className="text-blue-600 hover:text-blue-500">cliquez pour sélectionner</span>
                            <input
                              id="file-upload"
                              name="file-upload"
                              type="file"
                              accept=".xlsx,.xls"
                              className="sr-only"
                              onChange={handleFileUpload}
                              disabled={isUploading}
                            />
                          </label>
                        </div>
                      </div>
                    </div>

                    <div className="text-sm text-gray-500">
                      <p>Format accepté : .xlsx, .xls</p>
                      <p>Taille maximale : 10 MB</p>
                    </div>

                    {isUploading && (
                      <div className="flex items-center justify-center space-x-2">
                        <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-blue-600"></div>
                        <span>Téléversement en cours...</span>
                      </div>
                    )}
                  </div>
                </TabsContent>

                <TabsContent value="form">
                  <form onSubmit={handleFormSubmit} className="space-y-6">
                    <div className="grid gap-4">
                      <div>
                        <Label htmlFor="activity">Activité</Label>
                        <Input
                          id="activity"
                          placeholder="Entrez l'activité"
                          required
                        />
                      </div>

                      <div>
                        <Label htmlFor="indicator">Indicateur</Label>
                        <Input
                          id="indicator"
                          placeholder="Entrez l'indicateur"
                          required
                        />
                      </div>

                      <div>
                        <Label htmlFor="value">Valeur</Label>
                        <Input
                          id="value"
                          type="number"
                          placeholder="Entrez la valeur"
                          required
                        />
                      </div>

                      <div>
                        <Label htmlFor="justification">Justification</Label>
                        <Textarea
                          id="justification"
                          placeholder="Entrez la justification"
                          rows={3}
                          required
                        />
                      </div>

                      <div>
                        <Label htmlFor="corrective-actions">Actions Correctives</Label>
                        <Textarea
                          id="corrective-actions"
                          placeholder="Entrez les actions correctives"
                          rows={3}
                          required
                        />
                      </div>

                      <Button type="submit" className="w-full">
                        Enregistrer
                      </Button>
                    </div>
                  </form>
                </TabsContent>
              </Tabs>
            </CardContent>
          </Card>
        )}

        <Card>
          <CardHeader>
            <CardTitle>Instructions</CardTitle>
          </CardHeader>
          <CardContent>
            <ul className="list-disc list-inside space-y-2 text-sm text-gray-600">
              <li>Sélectionnez une catégorie KPI</li>
              <li>Choisissez entre le téléversement de fichier Excel ou la saisie manuelle</li>
              <li>Remplissez toutes les informations requises</li>
              <li>Enregistrez vos données</li>
              <li>Les données seront automatiquement traitées par le système</li>
            </ul>
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  )
} 