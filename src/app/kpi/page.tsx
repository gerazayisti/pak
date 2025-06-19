"use client"

import { useState } from "react"
import DashboardLayout from "@/components/dashboard-layout"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, LineChart, Line, PieChart, Pie, Cell } from "recharts"

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042']

interface DataPoint {
  name: string;
  value: number;
}

const data = {
  performance: [
    { name: 'Jan', value: 400 },
    { name: 'Fév', value: 300 },
    { name: 'Mar', value: 600 },
    { name: 'Avr', value: 800 },
    { name: 'Mai', value: 500 },
    { name: 'Juin', value: 700 },
  ] as DataPoint[],
  repartition: [
    { name: 'Kit A', value: 400 },
    { name: 'Kit B', value: 300 },
    { name: 'Kit C', value: 300 },
    { name: 'Kit D', value: 200 },
  ] as DataPoint[],
  tendances: [
    { name: 'Lun', value: 2400 },
    { name: 'Mar', value: 1398 },
    { name: 'Mer', value: 9800 },
    { name: 'Jeu', value: 3908 },
    { name: 'Ven', value: 4800 },
    { name: 'Sam', value: 3800 },
    { name: 'Dim', value: 4300 },
  ] as DataPoint[]
}

export default function KPIPage() {
  const [period, setPeriod] = useState("month")

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <h1 className="text-3xl font-bold text-foreground">Indicateurs de Performance</h1>
          <Select value={period} onValueChange={setPeriod}>
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Sélectionner une période" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="week">Cette semaine</SelectItem>
              <SelectItem value="month">Ce mois</SelectItem>
              <SelectItem value="year">Cette année</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Kits</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">2,350</div>
              <p className="text-xs text-muted-foreground">
                +20.1% par rapport au mois dernier
              </p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Kits Livrés</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">1,850</div>
              <p className="text-xs text-muted-foreground">
                +15.3% par rapport au mois dernier
              </p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">En Attente</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">500</div>
              <p className="text-xs text-muted-foreground">
                -5.2% par rapport au mois dernier
              </p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Taux de Livraison</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">78.7%</div>
              <p className="text-xs text-muted-foreground">
                +2.4% par rapport au mois dernier
              </p>
            </CardContent>
          </Card>
        </div>

        <Tabs defaultValue="performance" className="space-y-4">
          <TabsList>
            <TabsTrigger value="performance">Performance</TabsTrigger>
            <TabsTrigger value="repartition">Répartition</TabsTrigger>
            <TabsTrigger value="tendances">Tendances</TabsTrigger>
          </TabsList>
          <TabsContent value="performance" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Performance Mensuelle</CardTitle>
              </CardHeader>
              <CardContent className="h-[400px]">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={data.performance}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="name" />
                    <YAxis />
                    <Tooltip />
                    <Bar dataKey="value" fill="#8884d8" />
                  </BarChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          </TabsContent>
          <TabsContent value="repartition" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Répartition des Kits</CardTitle>
              </CardHeader>
              <CardContent className="h-[400px]">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={data.repartition}
                      cx="50%"
                      cy="50%"
                      labelLine={false}
                      outerRadius={150}
                      fill="#8884d8"
                      dataKey="value"
                      label={({ name, percent }: { name: string; percent: number }) => `${name} ${(percent * 100).toFixed(0)}%`}
                    >
                      {data.repartition.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                      ))}
                    </Pie>
                    <Tooltip />
                  </PieChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          </TabsContent>
          <TabsContent value="tendances" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Tendances Hebdomadaires</CardTitle>
              </CardHeader>
              <CardContent className="h-[400px]">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={data.tendances}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="name" />
                    <YAxis />
                    <Tooltip />
                    <Line type="monotone" dataKey="value" stroke="#8884d8" />
                  </LineChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </DashboardLayout>
  )
} 