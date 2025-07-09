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
import { Checkbox } from "@/components/ui/checkbox"

/**
 * Nettoie et formate le texte brut pour un affichage ou une génération propre.
 * - Supprime les marqueurs markdown (###, **, ---)
 * - Garde les listes à puces/numérotées sous forme simple
 * - Transforme les tableaux markdown en texte lisible
 * - Gère les paragraphes et les retours à la ligne
 */
function formatPlainText(input: string): string {
  const lines = input.split('\n');
  let output: string[] = [];
  let inTable = false;
  let tableBuffer: string[] = [];

  for (let line of lines) {
    let trimmed = line.trim();

    // Supprimer les séparateurs
    if (trimmed.startsWith('---')) continue;

    // Titre niveau 1 ou 2
    if (trimmed.startsWith('### ')) {
      output.push(trimmed.replace(/^###\s*/, '').trim());
      continue;
    }
    if (trimmed.startsWith('**') && trimmed.endsWith('**')) {
      output.push(trimmed.replace(/\*\*/g, '').trim());
      continue;
    }

    // Champ en gras
    if (trimmed.startsWith('**')) {
      output.push(trimmed.replace(/\*\*/g, '').trim());
      continue;
    }

    // Liste à puces
    if (trimmed.startsWith('* ')) {
      output.push('• ' + trimmed.replace(/^\*\s*/, '').trim());
      continue;
    }

    // Liste numérotée
    if (trimmed.match(/^\d+\.\s/)) {
      output.push(trimmed); // On garde la numérotation telle quelle
      continue;
    }

    // Tableaux markdown
    if (trimmed.startsWith('|')) {
      inTable = true;
      tableBuffer.push(trimmed);
      continue;
    } else if (inTable) {
      // Fin du tableau, on le transforme en texte
      if (tableBuffer.length > 0) {
        // On ignore la ligne de séparation (|---|)
        const tableRows = tableBuffer.filter(l => !/^\|[-\s|]+\|$/.test(l));
        tableRows.forEach(row => {
          const cells = row.split('|').slice(1, -1).map(cell => cell.trim());
          output.push(cells.join(' | '));
        });
        tableBuffer = [];
      }
      inTable = false;
    }

    // Ligne vide = nouveau paragraphe
    if (trimmed.length === 0) {
      output.push('');
      continue;
    }

    // Paragraphe normal
    output.push(trimmed);
  }

  // Si le texte se termine par un tableau
  if (inTable && tableBuffer.length > 0) {
    const tableRows = tableBuffer.filter(l => !/^\|[-\s|]+\|$/.test(l));
    tableRows.forEach(row => {
      const cells = row.split('|').slice(1, -1).map(cell => cell.trim());
      output.push(cells.join(' | '));
    });
  }

  // Nettoyage final : supprime les multiples lignes vides consécutives
  return output.join('\n').replace(/\n{3,}/g, '\n\n').trim();
}

const quarters: Quarter[] = ['T1', 'T2', 'T3', 'T4']
const currentYear = new Date().getFullYear()
const months = [
  "Janvier", "Février", "Mars", "Avril", "Mai", "Juin",
  "Juillet", "Août", "Septembre", "Octobre", "Novembre", "Décembre"
];
const categories = [
  "Planification",
  "Pilotage Et Mesure De La Performance",
  "Management Des Processus",
  "Suivi De La Coherence Des Systemes D Informations",
  "Analyse Et Controle Budgetaire",
  "Optimisation Et Rationalisation De L Utilisation Des Ressources",
  "Controle De La Coherence Des Informations De Gestion",
  "Appui A La Coordination Et Au Renforcement Des Capacites"
];
const N8N_WEBHOOK_URL = 'https://pak-agent.app.n8n.cloud/webhook/9ba11544-5c4e-4f91-818a-08a4ecb596c5';
const N8N_TOKEN = '1234567890qwerty';

export default function RapportsPage() {
  const [selectedQuarter, setSelectedQuarter] = useState<Quarter>('T3')
  const [selectedCategory, setSelectedCategory] = useState<KPICategory | 'ALL'>('ALL')
  const [selectedMonths, setSelectedMonths] = useState<string[]>([]);
  const [reportFormat, setReportFormat] = useState<'word' | 'pdf'>('word');
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

  const handleMonthToggle = (month: string) => {
    setSelectedMonths((prev) =>
      prev.includes(month)
        ? prev.filter((m) => m !== month)
        : [...prev, month]
    );
  };

  function formatN8NData(n8nData: any) {
    if (!n8nData) return "";
    let texte = "";
    if (Array.isArray(n8nData)) {
      n8nData.forEach((item: any, idx: number) => {
        texte += `\n\nSECTION ${idx + 1}\n`;
        Object.entries(item).forEach(([key, value]) => {
          texte += `• ${key} : ${value}\n`;
        });
      });
    } else if (typeof n8nData === "object") {
      texte += `\n\nSECTION\n`;
      Object.entries(n8nData).forEach(([key, value]) => {
        texte += `• ${key} : ${value}\n`;
      });
    } else {
      texte = String(n8nData);
    }
    return texte.trim();
  }

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (selectedMonths.length === 0) {
      toast({
        variant: "destructive",
        title: "Mois manquant",
        description: "Veuillez sélectionner au moins un mois.",
      });
      return;
    }
    setIsGenerating(true);
    setGenerationProgress(0);
    setDownloadLinks(null);
    try {
      setGenerationProgress(10);
      // 1. Appel à n8n pour obtenir les données à insérer dans le rapport
      const n8nRes = await fetch(N8N_WEBHOOK_URL, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${N8N_TOKEN}`,
        },
        body: JSON.stringify({
          query: {
            months: selectedMonths,
            categories,
            prompt: '', 
          }
        }),
      });
      setGenerationProgress(40);
      let n8nData = null;
      if (n8nRes.ok) {
        n8nData = await n8nRes.json();
      } else {
        toast({ title: 'Erreur n8n', description: "Erreur lors de la récupération des données de n8n", variant: 'destructive' });
        setIsGenerating(false);
        return;
      }
      setGenerationProgress(60);
      // 2. Génération du rapport avec les données de n8n
      const rawText = formatN8NData(n8nData); // <-- ta fonction de formatage n8nData
      const formattedText = formatPlainText(rawText); // <-- on applique le nettoyage ici !
      const response = await fetch('/api/reports/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          months: selectedMonths,
          format: reportFormat,
          n8nData,
          formattedText, // <-- on envoie le texte nettoyé
        }),
      });
      setGenerationProgress(90);
      if (!response.ok) throw new Error('Erreur lors de la génération du rapport');
      const data = await response.json();
      const link = document.createElement('a');
      link.href = `data:${data.mimeType};base64,${data.content}`;
      link.download = `${data.title}.${reportFormat === 'pdf' ? 'pdf' : 'docx'}`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      setGenerationProgress(100);
      toast({ title: 'Succès', description: 'Le rapport a été généré avec succès' });
    } catch (error) {
      toast({ title: 'Erreur', description: 'Une erreur est survenue lors de la génération du rapport', variant: 'destructive' });
    } finally {
      setIsGenerating(false);
      setTimeout(() => setGenerationProgress(0), 1000);
    }
  };

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
                  Sélectionnez les mois et le format du rapport à générer.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleSubmit} className="space-y-6">
                    <div>
                    <Label>Mois à inclure dans le rapport</Label>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-2 mt-2">
                      {months.map((month) => (
                        <label key={month} className="flex items-center gap-2">
                          <Checkbox checked={selectedMonths.includes(month)} onChange={() => handleMonthToggle(month)} />
                          <span>{month}</span>
                        </label>
                      ))}
                    </div>
                  </div>
                  <div>
                    <Label>Format du rapport</Label>
                    <div className="flex gap-4 mt-2">
                      <label className="flex items-center gap-2">
                        <input type="radio" name="format" value="word" checked={reportFormat === 'word'} onChange={() => setReportFormat('word')} /> Word
                      </label>
                      <label className="flex items-center gap-2">
                        <input type="radio" name="format" value="pdf" checked={reportFormat === 'pdf'} onChange={() => setReportFormat('pdf')} /> PDF
                      </label>
                    </div>
                  </div>
                  {isGenerating && (
                    <div className="w-full my-2">
                      <Progress value={generationProgress} />
                      <div className="text-center text-xs text-gray-500 mt-1">
                        {generationProgress}%
                      </div>
                    </div>
                  )}
                  <Button type="submit" className="w-full" disabled={isGenerating || selectedMonths.length === 0}>
                    {isGenerating ? 'Génération en cours...' : 'Générer le Rapport'}
                  </Button>
                </form>
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