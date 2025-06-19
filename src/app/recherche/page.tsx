"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent } from "@/components/ui/card"
import { useToast } from "@/components/ui/use-toast"
import { Search, Send, Smile, Edit, Lightbulb, Code } from "lucide-react"
import { cn } from "@/lib/utils"
import DashboardLayout from "@/components/dashboard-layout"

type Message = {
  id: string;
  sender: 'user' | 'bot';
  text: string;
};

export default function RecherchePage() {
  const [query, setQuery] = useState("")
  const [messages, setMessages] = useState<Message[]>([])
  const [isThinking, setIsThinking] = useState(false)
  const [isHistoryVisible, setIsHistoryVisible] = useState(true);
  const { toast } = useToast()

  const suggestionPrompts = [
    {
      icon: Smile,
      text: "Aidez-moi à trouver des rapports sur l'activité portuaire de l'année dernière."
    },
    {
      icon: Edit,
      text: "Décrivez les principales étapes du processus de standardisation des données."
    },
    {
      icon: Lightbulb,
      text: "Comment puis-je optimiser la collecte de données PDF ?"
    },
    {
      icon: Code,
      text: "Donnez-moi un résumé des données traitées en Q1."
    }
  ];

  const recentChats = [
    { id: "1", title: "Rapport sur les cargaisons de conteneurs...", text: "J'ai besoin d'informations sur le volume de conteneurs traités en..." },
    { id: "2", title: "Planification des opérations 2023...", text: "Je suis à la recherche de données sur la planification des opérations..." },
    { id: "3", title: "Analyse des données d'importation...", text: "Pouvez-vous me fournir une analyse des données d'importation de..." },
    { id: "4", title: "Fonction de recherche de documents...", text: "Comment fonctionne la fonction de recherche de documents pour..." },
  ];

  const handleQueryChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setQuery(event.target.value)
  }

  const handleSendMessage = async () => {
    if (!query.trim()) {
      toast({
        variant: "destructive",
        title: "Requête vide",
        description: "Veuillez saisir une requête.",
      })
      return
    }

    const userMessage: Message = { id: Date.now().toString(), sender: 'user', text: query };
    setMessages((prevMessages) => [...prevMessages, userMessage]);
    setQuery("");
    setIsThinking(true);

    try {
      // Simuler la recherche RAG et la génération LLM
      await new Promise((resolve) => setTimeout(resolve, 2000)); // Simule un délai de traitement

      const dummyResponses = [
        "Le volume total de cargaison traité au Port Autonome de Kribi au dernier trimestre a augmenté de 7.2% grâce à l'optimisation des processus de dédouane-ment et à l'augmentation des importations de conteneurs.",
        "Les principales incohérences détectées dans les fichiers Excel sont liées aux formats de dates et aux unités de mesure incohérentes. Des règles de standardisation automatiques ont été appliquées pour corriger ces erreurs.",
        "Le rapport mensuel sur les opérations portuaires indique une augmentation significative du nombre d'escales de navires de marchandises en vrac, notamment pour les produits agricoles et miniers. Les mesures de sécurité ont été renforcées.",
        "Le système de suivi-évaluation a identifié un écart de performance dans la gestion des importations de pétrole brut au cours du dernier semestre. Des analyses approfondies sont en cours pour déterminer les causes et proposer des actions correctives.",
        "Pour générer un rapport détaillé sur l'impact environnemental des opérations portuaires, veuillez spécifier la période souhaitée et les indicateurs clés à inclure, tels que les émissions de CO2, la consommation d'eau et la gestion des déchets."
      ];
      const randomResponse = dummyResponses[Math.floor(Math.random() * dummyResponses.length)];

      const botMessage: Message = { id: (Date.now() + 1).toString(), sender: 'bot', text: randomResponse };
      setMessages((prevMessages) => [...prevMessages, botMessage]);

      toast({
        title: "Recherche terminée",
        description: "La réponse pertinente a été générée.",
      });
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Erreur",
        description: "Une erreur est survenue lors de la recherche intelligente.",
      });
    } finally {
      setIsThinking(false);
    }
  };

  const handleSuggestionClick = (text: string) => {
    setQuery(text);
  };

  return (
    <DashboardLayout>
      <div className="flex min-h-[calc(100vh-64px)] p-4">
        {/* Main Chat Area (Left Column) */}
        <div className="flex-1 flex flex-col items-center justify-start p-6">
          <div className="text-center mb-10">
            <h1 className="text-4xl font-bold text-gray-800 mb-2">Hello, <span className="text-purple-600">there</span></h1>
            <h2 className="text-2xl text-gray-700">How can I help you today?</h2>
          </div>

          {/* Suggestion Cards */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 w-full max-w-4xl mb-10">
            {suggestionPrompts.map((prompt, index) => (
              <Card key={index} className="cursor-pointer hover:bg-gray-50 transition-colors" onClick={() => handleSuggestionClick(prompt.text)}>
                <CardContent className="p-4 flex flex-col items-start justify-between h-full">
                  <div className="rounded-full bg-gray-100 p-2 mb-4">
                    <prompt.icon className="h-6 w-6 text-gray-600" />
                  </div>
                  <p className="text-sm font-medium text-gray-800">{prompt.text}</p>
                </CardContent>
              </Card>
            ))}
          </div>

          {/* Chat History Display (Scrollable) */}
          {isHistoryVisible && (
            <div className="flex-1 w-full max-w-3xl overflow-y-auto mb-20 space-y-4">
              {messages.map((msg) => (
                <div key={msg.id} className={cn(
                  "p-3 rounded-lg max-w-[80%]",
                  msg.sender === 'user' ? "ml-auto bg-blue-500 text-white" : "mr-auto bg-gray-200 text-gray-800"
                )}>
                  <p>{msg.text}</p>
                </div>
              ))}
            </div>
          )}

          {/* Chat Input (Fixed at bottom) */}
          <div className="w-full max-w-3xl fixed bottom-4 bg-white p-4 rounded-lg shadow-lg flex items-center space-x-3">
            <Input
              type="text"
              placeholder="Enter a prompt here"
              className="flex-1 pr-12" 
              value={query}
              onChange={handleQueryChange}
              onKeyPress={(e) => {
                if (e.key === 'Enter' && !isThinking) {
                  handleSendMessage();
                }
              }}
              disabled={isThinking}
            />
            <Button onClick={handleSendMessage} disabled={isThinking} className="absolute right-6 top-1/2 -translate-y-1/2 bg-blue-600 text-white hover:bg-blue-700 rounded-full p-2 h-auto w-auto">
              <Send className="h-5 w-5" />
            </Button>
          </div>

        </div>

        {/* Right Sidebar */}
        <aside className="w-80 border-l p-6 bg-gray-50 flex flex-col space-y-6">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 h-5 w-5" />
            <Input type="text" placeholder="Search chat" className="pl-10" />
          </div>

          <div className="flex flex-col space-y-4">
            {recentChats.map((chat) => (
              <Card key={chat.id} className="cursor-pointer hover:bg-gray-100">
                <CardContent className="p-4">
                  <h4 className="font-medium">{chat.title}</h4>
                  <p className="text-xs text-muted-foreground truncate">{chat.text}</p>
                </CardContent>
              </Card>
            ))}
          </div>

          <Button className="w-full bg-blue-600 text-white hover:bg-blue-700" onClick={() => setIsHistoryVisible(!isHistoryVisible)}>
            {isHistoryVisible ? "Hide History" : "Show History"}
          </Button>
        </aside>
      </div>
    </DashboardLayout>
  )
} 