"use client"

"use client"

import { useState, useRef, useEffect } from "react"
import { Bot, FileText, BarChart, Ship, Send, User, PanelLeft, X, MessageSquare } from "lucide-react"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import DashboardLayout from "@/components/dashboard-layout"
import { cn } from "@/lib/utils"

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

export default function RecherchePage() {
  const [messages, setMessages] = useState<Message[]>([])
  const [query, setQuery] = useState("")
  const [isHistoryOpen, setIsHistoryOpen] = useState(false)
  const messagesEndRef = useRef<HTMLDivElement>(null)

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }

  useEffect(() => {
    scrollToBottom()
  }, [messages]);

  const handleSendMessage = () => {
    if (!query.trim()) return;
    const userMessage: Message = { id: Date.now().toString(), sender: 'user', text: query };
    const botMessage: Message = { id: (Date.now() + 1).toString(), sender: 'bot', text: `Analyse en cours pour : "${query}". Veuillez patienter...` };
    setMessages([...messages, userMessage, botMessage]);
    setQuery("");
  };

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
              messages.map((msg) => (
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
                    <p>{msg.text}</p>
                  </div>
                </div>
              ))
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
              <Button onClick={handleSendMessage} size="icon" className="absolute right-3 top-1/2 -translate-y-1/2 rounded-full w-10 h-10 bg-blue-500 hover:bg-blue-600 transition-transform duration-200 active:scale-95">
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