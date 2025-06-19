export type KPICategory = 
  | 'PLANIFICATION'
  | 'PILOTAGE_ET_MESURE_DE_LA_PERFORMANCE'
  | 'MANAGEMENT_DES_PROCESSUS'
  | 'SUIVI_DE_LA_COHERENCE_DES_SYSTEMES_D_INFORMATIONS'
  | 'ANALYSE_ET_CONTROLE_BUDGETAIRE'
  | 'OPTIMISATION_ET_RATIONALISATION_DE_L_UTILISATION_DES_RESSOURCES'
  | 'CONTROLE_DE_LA_COHERENCE_DES_INFORMATIONS_DE_GESTION'
  | 'APPUI_A_LA_COORDINATION_ET_AU_RENFORCEMENT_DES_CAPACITES';

export type KPIStatus = 
  | 'A_RATTRAPER'
  | 'DANS_LA_TENDANCE'
  | 'NON_DU_POUR_LA_PERIODE'
  | 'NON_RENSEIGNE';

export type Quarter = 'T1' | 'T2' | 'T3' | 'T4';

export interface KPIMeasurement {
  quarter: Quarter;
  value: number;
  status: KPIStatus;
  justification?: string;
  correctiveActions?: string;
}

export interface KPI {
  id: string;
  category: KPICategory;
  activity: string;
  indicator: string;
  target: number;
  calculationMethod: string;
  measurements: KPIMeasurement[];
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export interface KPICategorySummary {
  category: KPICategory;
  totalKPIs: number;
  completedKPIs: number;
  inProgressKPIs: number;
  delayedKPIs: number;
  notStartedKPIs: number;
  statusBreakdown: {
    [key in KPIStatus]: number;
  };
}

export interface KPIReport {
  period: {
    year: number;
    quarter: Quarter;
  };
  categories: KPICategorySummary[];
  overallStatus: {
    total: number;
    completed: number;
    inProgress: number;
    delayed: number;
    notStarted: number;
  };
  statusBreakdown: {
    [key in KPIStatus]: number;
  };
} 