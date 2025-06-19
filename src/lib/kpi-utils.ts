import { KPI, KPICategory, KPIStatus, KPICategorySummary, KPIReport, Quarter } from '@/types/kpi';

export function calculateCategorySummary(kpis: KPI[], category: KPICategory, quarter: Quarter): KPICategorySummary {
  const categoryKPIs = kpis.filter(kpi => kpi.category === category);
  const statusCounts = {
    A_RATTRAPER: 0,
    DANS_LA_TENDANCE: 0,
    NON_DU_POUR_LA_PERIODE: 0,
    NON_RENSEIGNE: 0
  };

  categoryKPIs.forEach(kpi => {
    const measurement = kpi.measurements.find(m => m.quarter === quarter);
    if (measurement) {
      statusCounts[measurement.status]++;
    }
  });

  return {
    category,
    totalKPIs: categoryKPIs.length,
    completedKPIs: statusCounts.DANS_LA_TENDANCE,
    inProgressKPIs: statusCounts.NON_DU_POUR_LA_PERIODE,
    delayedKPIs: statusCounts.A_RATTRAPER,
    notStartedKPIs: statusCounts.NON_RENSEIGNE,
    statusBreakdown: statusCounts
  };
}

export function generateKPIReport(kpis: KPI[], year: number, quarter: Quarter): KPIReport {
  const categories: KPICategory[] = [
    'PLANIFICATION',
    'PILOTAGE_ET_MESURE_DE_LA_PERFORMANCE',
    'MANAGEMENT_DES_PROCESSUS',
    'SUIVI_DE_LA_COHERENCE_DES_SYSTEMES_D_INFORMATIONS',
    'ANALYSE_ET_CONTROLE_BUDGETAIRE',
    'OPTIMISATION_ET_RATIONALISATION_DE_L_UTILISATION_DES_RESSOURCES',
    'CONTROLE_DE_LA_COHERENCE_DES_INFORMATIONS_DE_GESTION',
    'APPUI_A_LA_COORDINATION_ET_AU_RENFORCEMENT_DES_CAPACITES'
  ];

  const categorySummaries = categories.map(category => 
    calculateCategorySummary(kpis, category, quarter)
  );

  const overallStatus = {
    total: kpis.length,
    completed: categorySummaries.reduce((sum, cat) => sum + cat.completedKPIs, 0),
    inProgress: categorySummaries.reduce((sum, cat) => sum + cat.inProgressKPIs, 0),
    delayed: categorySummaries.reduce((sum, cat) => sum + cat.delayedKPIs, 0),
    notStarted: categorySummaries.reduce((sum, cat) => sum + cat.notStartedKPIs, 0)
  };

  const statusBreakdown = {
    A_RATTRAPER: categorySummaries.reduce((sum, cat) => sum + cat.statusBreakdown.A_RATTRAPER, 0),
    DANS_LA_TENDANCE: categorySummaries.reduce((sum, cat) => sum + cat.statusBreakdown.DANS_LA_TENDANCE, 0),
    NON_DU_POUR_LA_PERIODE: categorySummaries.reduce((sum, cat) => sum + cat.statusBreakdown.NON_DU_POUR_LA_PERIODE, 0),
    NON_RENSEIGNE: categorySummaries.reduce((sum, cat) => sum + cat.statusBreakdown.NON_RENSEIGNE, 0)
  };

  return {
    period: { year, quarter },
    categories: categorySummaries,
    overallStatus,
    statusBreakdown
  };
}

export function getKPIStatusColor(status: KPIStatus): string {
  switch (status) {
    case 'A_RATTRAPER':
      return 'text-red-500';
    case 'DANS_LA_TENDANCE':
      return 'text-green-500';
    case 'NON_DU_POUR_LA_PERIODE':
      return 'text-yellow-500';
    case 'NON_RENSEIGNE':
      return 'text-gray-500';
    default:
      return 'text-gray-500';
  }
}

export function formatKPICategory(category: KPICategory): string {
  return category
    .split('_')
    .map(word => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
    .join(' ');
}

export function formatKPIStatus(status: KPIStatus): string {
  return status
    .split('_')
    .map(word => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
    .join(' ');
} 