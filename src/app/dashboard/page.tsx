"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import DashboardLayout from "@/components/dashboard-layout"
import { Progress } from "@/components/ui/progress"

export default function DashboardPage() {
  return (
    <DashboardLayout>
      <div className="flex flex-col gap-6 p-6">
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
      </div>
    </DashboardLayout>
  )
} 