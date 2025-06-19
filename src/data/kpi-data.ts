import { KPI, KPICategory, KPIStatus } from '@/types/kpi';

export const initialKPIData: KPI[] = [
  {
    id: 'PLAN-001',
    category: 'PLANIFICATION',
    activity: 'Lettre de cadrage approuvé',
    indicator: 'Taux de respect des délais de publication de la lettre',
    target: 1,
    calculationMethod: 'Durée réalisée/durée prévisionnelle',
    measurements: [
      {
        quarter: 'T1',
        value: 0,
        status: 'NON_RENSEIGNE'
      },
      {
        quarter: 'T2',
        value: 0,
        status: 'NON_RENSEIGNE'
      },
      {
        quarter: 'T3',
        value: 0,
        status: 'NON_RENSEIGNE',
        justification: 'A évaluer à T4'
      }
    ],
    isActive: true,
    createdAt: new Date('2024-01-01'),
    updatedAt: new Date('2024-03-31')
  },
  {
    id: 'PERF-001',
    category: 'PILOTAGE_ET_MESURE_DE_LA_PERFORMANCE',
    activity: 'Rapport de mesure de la performance',
    indicator: 'Nombre de rapport de suivi-évaluation',
    target: 4,
    calculationMethod: '/',
    measurements: [
      {
        quarter: 'T1',
        value: 0,
        status: 'A_RATTRAPER',
        justification: "Le rapport de suivi-évaluation de T1 n'a pas été produit du fait de la lenteur du remplissage des données dans les différents outils de collecte",
        correctiveActions: "Sensibilisation des points focaux sur l'importance du suivi-évaluation des performances"
      },
      {
        quarter: 'T2',
        value: 0,
        status: 'A_RATTRAPER'
      },
      {
        quarter: 'T3',
        value: 2,
        status: 'A_RATTRAPER',
        justification: "Le rapport d'évaluation à mi-parcours est encore d'élaboration"
      }
    ],
    isActive: true,
    createdAt: new Date('2024-01-01'),
    updatedAt: new Date('2024-03-31')
  },
  {
    id: 'PROC-001',
    category: 'MANAGEMENT_DES_PROCESSUS',
    activity: 'Rapport de revue des processus',
    indicator: 'Nombre de rapports de revue de processus',
    target: 1,
    calculationMethod: '/',
    measurements: [
      {
        quarter: 'T1',
        value: 0,
        status: 'NON_RENSEIGNE'
      },
      {
        quarter: 'T2',
        value: 0,
        status: 'NON_RENSEIGNE'
      },
      {
        quarter: 'T3',
        value: 0,
        status: 'NON_RENSEIGNE',
        justification: "Attente du démarrage de l'activité"
      }
    ],
    isActive: true,
    createdAt: new Date('2024-01-01'),
    updatedAt: new Date('2024-03-31')
  },
  {
    id: 'BUDG-001',
    category: 'ANALYSE_ET_CONTROLE_BUDGETAIRE',
    activity: 'Rapport de contrôle de l\'exécution du budget',
    indicator: 'Nombre de rapport produits et émis',
    target: 4,
    calculationMethod: '/',
    measurements: [
      {
        quarter: 'T1',
        value: 1,
        status: 'A_RATTRAPER'
      },
      {
        quarter: 'T2',
        value: 1,
        status: 'A_RATTRAPER'
      },
      {
        quarter: 'T3',
        value: 1,
        status: 'A_RATTRAPER',
        justification: 'Changement du Chef CACB et du Chef DPCG'
      }
    ],
    isActive: true,
    createdAt: new Date('2024-01-01'),
    updatedAt: new Date('2024-03-31')
  },
  {
    id: 'CAPA-001',
    category: 'APPUI_A_LA_COORDINATION_ET_AU_RENFORCEMENT_DES_CAPACITES',
    activity: 'Plan de formation mis en œuvre',
    indicator: 'Taux de mise en œuvre du plan de formation de la structure',
    target: 1,
    calculationMethod: 'Nombre de formation réalisée /nombre de formation validée',
    measurements: [
      {
        quarter: 'T1',
        value: 0,
        status: 'NON_RENSEIGNE'
      },
      {
        quarter: 'T2',
        value: 0.4,
        status: 'DANS_LA_TENDANCE'
      },
      {
        quarter: 'T3',
        value: 0.8,
        status: 'DANS_LA_TENDANCE',
        justification: '04 formations sur 05 planifiées ont été réalisées',
        correctiveActions: 'Relancer la DRH pour la programmation de la dernière formation'
      }
    ],
    isActive: true,
    createdAt: new Date('2024-01-01'),
    updatedAt: new Date('2024-03-31')
  }
]; 