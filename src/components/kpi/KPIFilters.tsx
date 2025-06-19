'use client';

import { Quarter, KPIStatus } from '@/types/kpi';
import { formatKPIStatus } from '@/lib/kpi-utils';

interface KPIFiltersProps {
  selectedQuarter: Quarter;
  selectedStatus: string | null;
  selectedCategory: string | null;
  onQuarterChange: (quarter: Quarter) => void;
  onStatusChange: (status: string | null) => void;
  onCategoryChange: (category: string | null) => void;
}

export default function KPIFilters({
  selectedQuarter,
  selectedStatus,
  selectedCategory,
  onQuarterChange,
  onStatusChange,
  onCategoryChange,
}: KPIFiltersProps) {
  const quarters: Quarter[] = ['T1', 'T2', 'T3', 'T4'];
  const statuses: KPIStatus[] = [
    'A_RATTRAPER',
    'DANS_LA_TENDANCE',
    'NON_DU_POUR_LA_PERIODE',
    'NON_RENSEIGNE'
  ];

  return (
    <div className="bg-white rounded-lg shadow p-4">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Trimestre
          </label>
          <select
            value={selectedQuarter}
            onChange={(e) => onQuarterChange(e.target.value as Quarter)}
            className="w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
          >
            {quarters.map((quarter) => (
              <option key={quarter} value={quarter}>
                {quarter}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Statut
          </label>
          <select
            value={selectedStatus || ''}
            onChange={(e) => onStatusChange(e.target.value || null)}
            className="w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
          >
            <option value="">Tous les statuts</option>
            {statuses.map((status) => (
              <option key={status} value={status}>
                {formatKPIStatus(status)}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Catégorie
          </label>
          <select
            value={selectedCategory || ''}
            onChange={(e) => onCategoryChange(e.target.value || null)}
            className="w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
          >
            <option value="">Toutes les catégories</option>
            <option value="PLANIFICATION">Planification</option>
            <option value="PILOTAGE_ET_MESURE_DE_LA_PERFORMANCE">
              Pilotage et Mesure de la Performance
            </option>
            <option value="MANAGEMENT_DES_PROCESSUS">
              Management des Processus
            </option>
            <option value="SUIVI_DE_LA_COHERENCE_DES_SYSTEMES_D_INFORMATIONS">
              Suivi de la Cohérence des Systèmes d'Informations
            </option>
            <option value="ANALYSE_ET_CONTROLE_BUDGETAIRE">
              Analyse et Contrôle Budgétaire
            </option>
            <option value="OPTIMISATION_ET_RATIONALISATION_DE_L_UTILISATION_DES_RESSOURCES">
              Optimisation et Rationalisation des Ressources
            </option>
            <option value="CONTROLE_DE_LA_COHERENCE_DES_INFORMATIONS_DE_GESTION">
              Contrôle de la Cohérence des Informations de Gestion
            </option>
            <option value="APPUI_A_LA_COORDINATION_ET_AU_RENFORCEMENT_DES_CAPACITES">
              Appui à la Coordination et au Renforcement des Capacités
            </option>
          </select>
        </div>
      </div>
    </div>
  );
} 