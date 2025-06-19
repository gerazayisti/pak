"use client"

import { useState } from 'react';
import { KPI, Quarter } from '@/types/kpi';
import { initialKPIData } from '@/data/kpi-data';
import { generateKPIReport } from '@/lib/kpi-utils';
import KPISummary from './KPISummary';
import KPIFilters from './KPIFilters';
import KPICategoryList from './KPICategoryList';

export default function KPIDashboard() {
  const [selectedYear] = useState(new Date().getFullYear());
  const [selectedQuarter, setSelectedQuarter] = useState<Quarter>('T3');
  const [selectedStatus, setSelectedStatus] = useState<string | null>(null);
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);

  const report = generateKPIReport(initialKPIData, selectedYear, selectedQuarter);

  const filteredKPIs = initialKPIData.filter(kpi => {
    const matchesCategory = !selectedCategory || kpi.category === selectedCategory;
    const measurement = kpi.measurements.find(m => m.quarter === selectedQuarter);
    const matchesStatus = !selectedStatus || measurement?.status === selectedStatus;
    return matchesCategory && matchesStatus;
  });

  return (
    <div className="p-6 space-y-6">
      <h1 className="text-2xl font-bold text-gray-900">Tableau de Bord KPI</h1>
      
      <KPIFilters
        selectedQuarter={selectedQuarter}
        selectedStatus={selectedStatus}
        selectedCategory={selectedCategory}
        onQuarterChange={setSelectedQuarter}
        onStatusChange={setSelectedStatus}
        onCategoryChange={setSelectedCategory}
      />

      <KPISummary report={report} />

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white rounded-lg shadow p-6">
          <h2 className="text-lg font-semibold mb-4">Répartition par Catégorie</h2>
          <KPICategoryList categories={report.categories} />
        </div>

        <div className="bg-white rounded-lg shadow p-6">
          <h2 className="text-lg font-semibold mb-4">Détails des KPI</h2>
          <div className="space-y-4">
            {filteredKPIs.map(kpi => (
              <div key={kpi.id} className="border rounded-lg p-4">
                <h3 className="font-medium">{kpi.activity}</h3>
                <p className="text-sm text-gray-600">{kpi.indicator}</p>
                <div className="mt-2">
                  <span className="text-sm font-medium">Cible: </span>
                  <span className="text-sm">{kpi.target}</span>
                </div>
                <div className="mt-2">
                  <span className="text-sm font-medium">Méthode de calcul: </span>
                  <span className="text-sm">{kpi.calculationMethod}</span>
                </div>
                {kpi.measurements
                  .filter(m => m.quarter === selectedQuarter)
                  .map(measurement => (
                    <div key={measurement.quarter} className="mt-2">
                      <div className="flex justify-between items-center">
                        <span className="text-sm font-medium">Valeur: </span>
                        <span className="text-sm">{measurement.value}</span>
                      </div>
                      {measurement.justification && (
                        <div className="mt-1">
                          <span className="text-sm font-medium">Justification: </span>
                          <span className="text-sm">{measurement.justification}</span>
                        </div>
                      )}
                      {measurement.correctiveActions && (
                        <div className="mt-1">
                          <span className="text-sm font-medium">Actions correctives: </span>
                          <span className="text-sm">{measurement.correctiveActions}</span>
                        </div>
                      )}
                    </div>
                  ))}
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
} 