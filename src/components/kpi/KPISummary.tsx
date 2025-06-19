'use client';

import { KPIReport } from '@/types/kpi';
import { formatKPIStatus, getKPIStatusColor } from '@/lib/kpi-utils';

interface KPISummaryProps {
  report: KPIReport;
}

export default function KPISummary({ report }: KPISummaryProps) {
  const { period, overallStatus, statusBreakdown } = report;

  return (
    <div className="bg-white rounded-lg shadow p-6">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-gray-50 rounded-lg p-4">
          <h3 className="text-sm font-medium text-gray-500">Total KPI</h3>
          <p className="mt-2 text-3xl font-semibold text-gray-900">
            {overallStatus.total}
          </p>
        </div>

        <div className="bg-green-50 rounded-lg p-4">
          <h3 className="text-sm font-medium text-green-600">Dans la Tendance</h3>
          <p className="mt-2 text-3xl font-semibold text-green-700">
            {overallStatus.completed}
          </p>
        </div>

        <div className="bg-yellow-50 rounded-lg p-4">
          <h3 className="text-sm font-medium text-yellow-600">En Cours</h3>
          <p className="mt-2 text-3xl font-semibold text-yellow-700">
            {overallStatus.inProgress}
          </p>
        </div>

        <div className="bg-red-50 rounded-lg p-4">
          <h3 className="text-sm font-medium text-red-600">À Rattraper</h3>
          <p className="mt-2 text-3xl font-semibold text-red-700">
            {overallStatus.delayed}
          </p>
        </div>
      </div>

      <div className="mt-6">
        <h3 className="text-lg font-medium text-gray-900 mb-4">
          Répartition par Statut
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {Object.entries(statusBreakdown).map(([status, count]) => (
            <div
              key={status}
              className={`bg-white border rounded-lg p-4 ${getKPIStatusColor(status as any)}`}
            >
              <h4 className="text-sm font-medium">
                {formatKPIStatus(status as any)}
              </h4>
              <p className="mt-2 text-2xl font-semibold">{count}</p>
            </div>
          ))}
        </div>
      </div>

      <div className="mt-6">
        <h3 className="text-lg font-medium text-gray-900 mb-4">
          Période : {period.year} - {period.quarter}
        </h3>
      </div>
    </div>
  );
} 