"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import DashboardLayout from "@/components/dashboard-layout"
import { Progress } from "@/components/ui/progress"
import Image from "next/image"
import { NotificationContainer, NotificationType } from "@/components/ui/notification"

export default function DashboardPage() {
  const [notifications, setNotifications] = useState<NotificationType[]>([])

  const addNotification = (notification: Omit<NotificationType, "id" | "timestamp">) => {
    const newNotification: NotificationType = {
      ...notification,
      id: Math.random().toString(36).substr(2, 9),
      timestamp: new Date(),
    }
    setNotifications((prev) => [...prev, newNotification])
  }

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (file) {
      if (file.type === "application/pdf") {
        addNotification({
          title: "Nouveau rapport PDF téléversé",
          message: `Le fichier ${file.name} a été téléversé avec succès.`,
          type: "success",
        })
      } else if (file.type === "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet") {
        addNotification({
          title: "Nouveau fichier Excel téléversé",
          message: `Le fichier ${file.name} a été téléversé pour le pré-remplissage des matrices.`,
          type: "info",
        })
      }
    }
  }

  const handleReportDownload = (type: string) => {
    addNotification({
      title: "Téléchargement de rapport",
      message: `Le rapport trimestriel ${type} est en cours de téléchargement.`,
      type: "info",
    })
  }

  return (
    <DashboardLayout>
      <div className="flex flex-col gap-6 p-6">
        {/* En-tête avec logo et titre */}
        <div className="flex items-center gap-4 mb-4">
          <div className="relative h-12 w-12 overflow-hidden rounded-md">
            <Image
              src="/paklogo.jpg"
              alt="Logo PAK"
              width={48}
              height={48}
              className="object-contain"
              priority
              onError={(e) => {
                console.error("Erreur de chargement de l'image:", e);
                // Fallback si l'image ne charge pas
                e.currentTarget.src = "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='48' height='48' viewBox='0 0 24 24' fill='none' stroke='currentColor' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'%3E%3Crect width='18' height='18' x='3' y='3' rx='2' ry='2'/%3E%3Ccircle cx='9' cy='9' r='2'/%3E%3Cpath d='m21 15-3.086-3.086a2 2 0 0 0-2.828 0L6 21'/%3E%3C/svg%3E"
              }}
            />
          </div>
          <div>
            <h1 className="text-2xl font-bold">Tableau de Bord</h1>
            <p className="text-sm text-muted-foreground">Suivi-évaluation du Port Autonome de Kribi</p>
          </div>
        </div>

        {/* En-tête avec les statistiques globales */}
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Rapports T1</CardTitle>
              <span className="text-2xl">📊</span>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">0/4</div>
              <p className="text-xs text-muted-foreground">Rapports produits</p>
              <Progress value={0} className="mt-2" />
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Rapports T2</CardTitle>
              <span className="text-2xl">📈</span>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">1/4</div>
              <p className="text-xs text-muted-foreground">Rapports produits</p>
              <Progress value={25} className="mt-2" />
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Rapports T3</CardTitle>
              <span className="text-2xl">📉</span>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">2/4</div>
              <p className="text-xs text-muted-foreground">Rapports produits</p>
              <Progress value={50} className="mt-2" />
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Taux de Complétion</CardTitle>
              <span className="text-2xl">🎯</span>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">25%</div>
              <p className="text-xs text-muted-foreground">Global</p>
              <Progress value={25} className="mt-2" />
            </CardContent>
          </Card>
        </div>

        {/* Tableau des indicateurs clés */}
        <Card>
          <CardHeader>
            <CardTitle>Indicateurs Clés de Performance</CardTitle>
            <CardDescription>
              Vue d'ensemble des indicateurs de suivi-évaluation
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Activité</TableHead>
                    <TableHead>Indicateur</TableHead>
                    <TableHead>Cible</TableHead>
                    <TableHead>T1</TableHead>
                    <TableHead>T2</TableHead>
                    <TableHead>T3</TableHead>
                    <TableHead>Appréciation</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  <TableRow>
                    <TableCell>Lettre de cadrage</TableCell>
                    <TableCell>Taux de respect des délais</TableCell>
                    <TableCell>1</TableCell>
                    <TableCell>/</TableCell>
                    <TableCell>/</TableCell>
                    <TableCell>/</TableCell>
                    <TableCell>NON RENSEIGNE</TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell>Rapports trimestriels</TableCell>
                    <TableCell>Nombre de rapports</TableCell>
                    <TableCell>4</TableCell>
                    <TableCell>0</TableCell>
                    <TableCell>1</TableCell>
                    <TableCell>2</TableCell>
                    <TableCell>A RATTRAPER</TableCell>
                  </TableRow>
                </TableBody>
              </Table>
            </div>
          </CardContent>
        </Card>

        {/* Actions correctives requises */}
        <Card>
          <CardHeader>
            <CardTitle>Actions Correctives Requises</CardTitle>
            <CardDescription>
              Liste des actions à entreprendre pour améliorer les performances
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-center gap-4 p-4 border rounded-lg">
                <div className="flex-1">
                  <h4 className="font-medium">Sensibilisation des points focaux</h4>
                  <p className="text-sm text-muted-foreground">
                    Le rapport de T1 n'a pas été produit
                  </p>
                </div>
                <div className="text-sm text-muted-foreground">
                  Priorité: Haute
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Conteneur de notifications */}
        <NotificationContainer />
      </div>
    </DashboardLayout>
  )
} 