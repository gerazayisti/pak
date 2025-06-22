"use client"

"use client"

import { useState, useRef, useEffect } from "react"
import { Bot, FileText, BarChart, Ship, Send, User, PanelLeft, X, MessageSquare } from "lucide-react"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import DashboardLayout from "@/components/dashboard-layout"
import { cn } from "@/lib/utils"
import React from "react"
import ReactMarkdown from 'react-markdown'

type Message = {
  id: string;
  sender: 'user' | 'bot';
  text: string;
};

const conversationHistory = [
  { id: '1', title: 'Rapport sur les importations de conteneurs' },
  { id: '2', title: 'Analyse des temps d\'escale des navires' },
  { id: '3', title: 'Identifier les principaux partenaires commerciaux' },
  { id: '4', title: 'Volume total de marchandises traitées en mai' },
  { id: '5', title: 'Prévisions de trafic pour le prochain trimestre' },
];

const botThinkingPhrases = [
  "Laisse-moi réfléchir...",
  "Je consulte les archives du port...",
  "Un instant, je mouille l'ancre...",
  "Les résultats sont en train d'accoster...",
  "Je décharge la réponse...",
  "Je vérifie les containers de données...",
  "Je prépare le quai des résultats...",
  "Je questionne la capitainerie..."
];

export default function RecherchePage() {
  const [messages, setMessages] = useState<Message[]>([])
  const [query, setQuery] = useState("")
  const [isHistoryOpen, setIsHistoryOpen] = useState(false)
  const [isBotThinking, setIsBotThinking] = useState(false)
  const [thinkingIndex, setThinkingIndex] = useState(0)
  const [botResponse, setBotResponse] = useState<string | null>(null)
  const messagesEndRef = useRef<HTMLDivElement>(null)
  const thinkingIntervalRef = useRef<NodeJS.Timeout | null>(null)

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }

  useEffect(() => {
    scrollToBottom()
  }, [messages, isBotThinking]);

  // Boucle animée sur les phrases d'attente
  useEffect(() => {
    if (isBotThinking) {
      thinkingIntervalRef.current = setInterval(() => {
        setThinkingIndex((prev) => (prev + 1) % botThinkingPhrases.length)
      }, 3200)
    } else {
      if (thinkingIntervalRef.current) clearInterval(thinkingIntervalRef.current)
      setThinkingIndex(0)
    }
    return () => {
      if (thinkingIntervalRef.current) clearInterval(thinkingIntervalRef.current)
    }
  }, [isBotThinking])

  const handleSendMessage = async (forcedQuery?: string) => {
    const toSend = forcedQuery !== undefined ? forcedQuery : query;
    if (!toSend.trim()) return;
    const userMessage: Message = { id: Date.now().toString(), sender: 'user', text: toSend };
    setMessages((prev) => [...prev, userMessage]);
    setQuery("");
    setIsBotThinking(true);
    setBotResponse(null);

    try {
      const res = await fetch('https://pak-auto.app.n8n.cloud/webhook/9ba11544-5c4e-4f91-818a-08a4ecb596c5', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': 'Bearer 1234567890abcde',
        },
        body: JSON.stringify({ query: toSend }),
      });
      let botText = '';
      if (res.ok) {
        const data = await res.json();
        botText = typeof data === 'string' ? data : (data.result || JSON.stringify(data));
      } else {
        botText = "Erreur lors de la récupération de la réponse du workflow n8n.";
      }
      setIsBotThinking(false);
      setBotResponse(botText);
      setMessages((prev) => [
        ...prev,
        { id: (Date.now() + 4).toString(), sender: 'bot', text: botText }
      ]);
    } catch (error) {
      setIsBotThinking(false);
      setBotResponse("Erreur lors de l'appel au workflow n8n.");
      setMessages((prev) => [
        ...prev,
        { id: (Date.now() + 4).toString(), sender: 'bot', text: "Erreur lors de l'appel au workflow n8n." }
      ]);
    }
  };

  // Fonction utilitaire pour parser le texte et extraire les questions alternatives
  function splitTextAndQuestions(text: string) {
    const intro = "Voici quelques questions alternatives qui pourraient vous aider à approfondir votre requête :";
    const idx = text.indexOf(intro);
    if (idx === -1) {
      return { main: text, questions: [] };
    }
    const main = text.slice(0, idx).trim();
    // On prend tout ce qui suit l'intro
    const after = text.slice(idx + intro.length).trim();
    // Découper en lignes, filtrer les vides, retirer les éventuels tirets/puces
    const questions = after
      .split(/\n|\r|\r\n/)
      .map(q => q.replace(/^[-*•\d.\s]+/, '').trim())
      .filter(q => q.length > 0);
    return { main, questions };
  }

  // Fonction pour envoyer une question alternative comme si l'utilisateur l'avait tapée
  const handleQuestionClick = (question: string) => {
    setQuery(""); // On vide la zone de saisie
    // On ajoute la question comme message utilisateur et on déclenche handleSendMessage
    handleSendMessage(question);
  };

  function renderBotMessage(msg: Message) {
    if (msg.sender === 'bot' && msg.text) {
      try {
        const parsed = JSON.parse(msg.text)
        // Si c'est un tableau d'objets avec output
        if (Array.isArray(parsed)) {
          const allOutputs = parsed
            .map(item => typeof item.output === 'string' ? item.output : null)
            .filter(Boolean)
            .join('\n\n---\n\n');
          if (allOutputs) {
            const { main, questions } = splitTextAndQuestions(allOutputs);
            return (
              <div>
                <div className="prose max-w-none mb-4">
                  <ReactMarkdown>{main}</ReactMarkdown>
                </div>
                {questions.length > 0 && (
                  <div className="flex flex-wrap gap-2 mt-2">
                    {questions.map((q, idx) => (
                      <button
                        key={idx}
                        className="px-3 py-1 rounded bg-blue-100 hover:bg-blue-200 text-blue-800 text-sm"
                        onClick={() => handleQuestionClick(q)}
                      >
                        {q}
                      </button>
                    ))}
                  </div>
                )}
              </div>
            )
          }
        }
        // Si c'est un objet avec output
        if (parsed && typeof parsed === 'object' && typeof parsed.output === 'string') {
          const { main, questions } = splitTextAndQuestions(parsed.output);
          return (
            <div>
              <div className="prose max-w-none mb-4">
                <ReactMarkdown>{main}</ReactMarkdown>
              </div>
              {questions.length > 0 && (
                <div className="flex flex-wrap gap-2 mt-2">
                  {questions.map((q, idx) => (
                    <button
                      key={idx}
                      className="px-3 py-1 rounded bg-blue-100 hover:bg-blue-200 text-blue-800 text-sm"
                      onClick={() => handleQuestionClick(q)}
                    >
                      {q}
                    </button>
                  ))}
                </div>
              )}
            </div>
          )
        }
      } catch {
        // pas du JSON, on affiche en markdown
        const { main, questions } = splitTextAndQuestions(msg.text);
        return (
          <div>
            <div className="prose max-w-none mb-4">
              <ReactMarkdown>{main}</ReactMarkdown>
            </div>
            {questions.length > 0 && (
              <div className="flex flex-wrap gap-2 mt-2">
                {questions.map((q, idx) => (
                  <button
                    key={idx}
                    className="px-3 py-1 rounded bg-blue-100 hover:bg-blue-200 text-blue-800 text-sm"
                    onClick={() => handleQuestionClick(q)}
                  >
                    {q}
                  </button>
                ))}
              </div>
            )}
          </div>
        )
      }
      // Si JSON.parse ne lève pas d'erreur mais ce n'est pas un objet, fallback markdown
      const { main, questions } = splitTextAndQuestions(msg.text);
      return (
        <div>
          <div className="prose max-w-none mb-4">
            <ReactMarkdown>{main}</ReactMarkdown>
          </div>
          {questions.length > 0 && (
            <div className="flex flex-wrap gap-2 mt-2">
              {questions.map((q, idx) => (
                <button
                  key={idx}
                  className="px-3 py-1 rounded bg-blue-100 hover:bg-blue-200 text-blue-800 text-sm"
                  onClick={() => handleQuestionClick(q)}
                >
                  {q}
                </button>
              ))}
            </div>
          )}
        </div>
      )
    }
    return <p>{msg.text}</p>
  }

  return (
    <DashboardLayout>
      <div className="flex h-[calc(100vh-64px)]">
        {/* History Sidebar */}
        <aside className={cn(
          "bg-gray-100 border-r flex flex-col transition-all duration-300 ease-in-out",
          isHistoryOpen ? "w-full md:w-72 p-4" : "w-0 p-0 border-none"
        )}>
          <div className="flex justify-between items-center mb-4">
            <h2 className="font-bold text-lg text-gray-800">Historique</h2>
            <Button variant="ghost" size="icon" onClick={() => setIsHistoryOpen(false)}>
              <X className="h-5 w-5 text-gray-600" />
            </Button>
          </div>
          <div className="flex-1 overflow-y-auto space-y-2">
            {conversationHistory.map(item => (
              <button key={item.id} className="w-full text-left p-2 rounded-md hover:bg-gray-200 cursor-pointer flex items-center gap-3">
                 <MessageSquare className="h-4 w-4 text-gray-500 flex-shrink-0" />
                 <span className="truncate text-sm font-medium text-gray-700">{item.title}</span>
              </button>
            ))}
          </div>
        </aside>

        {/* Main Chat Area */}
        <main className="flex-1 flex flex-col bg-gray-50 relative">
          <div className="flex-1 overflow-y-auto p-6 space-y-6">
            {!isHistoryOpen && (
              <Button
                variant="ghost"
                size="icon"
                className="absolute top-4 left-4 z-10"
                onClick={() => setIsHistoryOpen(true)}
              >
                <PanelLeft className="h-5 w-5 text-gray-600" />
              </Button>
            )}
            {messages.length === 0 ? (
              <div className="text-center mt-12">
                <div className="inline-block p-5 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-full mb-6 shadow-lg">
                  <Bot className="h-12 w-12 text-white" />
                </div>
                <h1 className="text-3xl md:text-4xl font-bold text-gray-800">Assistant d'Analyse de Données PAK</h1>
                <p className="text-lg md:text-xl text-gray-500 mt-3">Posez vos questions sur les activités portuaires.</p>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 max-w-5xl w-full mx-auto mt-10">
                  <SuggestionCard text="Rapport mensuel des importations" icon={<FileText className="h-7 w-7 text-blue-500" />} />
                  <SuggestionCard text="Performance des temps d'escale" icon={<BarChart className="h-7 w-7 text-blue-500" />} />
                  <SuggestionCard text="Flux de marchandises par pays" icon={<Ship className="h-7 w-7 text-blue-500" />} />
                </div>
              </div>
            ) : (
              messages.map((msg, idx) => (
                <div
                  key={msg.id}
                  className={cn(
                    "flex items-start gap-4 max-w-xl",
                    msg.sender === 'user' ? "ml-auto flex-row-reverse" : "mr-auto"
                  )}
                >
                  <div className={cn("p-3 rounded-full flex items-center justify-center", msg.sender === 'user' ? "bg-blue-500" : "bg-gray-200")}> 
                    {msg.sender === 'user' ? <User className="h-5 w-5 text-white" /> : <Bot className="h-5 w-5 text-gray-600" />}
                  </div>
                  <div className={cn("p-4 rounded-lg", msg.sender === 'user' ? "bg-blue-500 text-white" : "bg-white text-gray-800 shadow-sm")}> 
                    {renderBotMessage(msg)}
                  </div>
                </div>
              ))
            )}
            {/* Message d'attente animé du bot */}
            {isBotThinking && (
              <div className="flex items-center gap-3 mt-2 animate-pulse">
                <div className="p-3 rounded-full bg-gray-200 flex items-center justify-center">
                  <Bot className="h-5 w-5 text-gray-600" />
                </div>
                <div className="p-4 rounded-lg bg-white text-gray-800 shadow-sm">
                  <span>{botThinkingPhrases[thinkingIndex]}</span>
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          <div className="p-4 border-t bg-white/80 backdrop-blur-md sticky bottom-0">
            <div className="relative w-full max-w-4xl mx-auto">
              <Input
                placeholder="Ex: Quel est le volume total de conteneurs traités le mois dernier ?"
                className="w-full p-4 pl-6 pr-16 h-14 rounded-full bg-gray-100 border-gray-200 focus:ring-2 focus:ring-blue-400 text-base"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
              />
              <Button onClick={() => handleSendMessage()} size="icon" className="absolute right-3 top-1/2 -translate-y-1/2 rounded-full w-10 h-10 bg-blue-500 hover:bg-blue-600 transition-transform duration-200 active:scale-95">
                <Send className="h-5 w-5 text-white" />
              </Button>
            </div>
          </div>
        </main>
      </div>
    </DashboardLayout>
  )
}

function SuggestionCard({ text, icon }: { text: string; icon: React.ReactNode }) {
  return (
    <div className="bg-white p-5 rounded-xl border border-gray-200 hover:border-blue-400 hover:shadow-lg transition-all duration-200 cursor-pointer flex flex-col items-center text-center">
      <div className="mb-4">
        {icon}
      </div>
      <p className="font-semibold text-gray-700">{text}</p>
    </div>
  )
}