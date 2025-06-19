'use client';

import { KPICategorySummary } from '@/types/kpi';
import { formatKPICategory } from '@/lib/kpi-utils';

interface KPICategoryListProps {
  categories: KPICategorySummary[];
}

export default function KPICategoryList({ categories }: KPICategoryListProps) {
  return (
    <div className="space-y-4">
      {categories.map((category) => (
        <div key={category.category} className="border rounded-lg p-4">
          <h3 className="font-medium text-gray-900">
            {formatKPICategory(category.category)}
          </h3>
          
          <div className="mt-4 grid grid-cols-2 gap-4">
            <div>
              <p className="text-sm text-gray-500">Total KPI</p>
              <p className="mt-1 text-lg font-semibold text-gray-900">
                {category.totalKPIs}
              </p>
            </div>
            
            <div>
              <p className="text-sm text-gray-500">Dans la Tendance</p>
              <p className="mt-1 text-lg font-semibold text-green-600">
                {category.completedKPIs}
              </p>
            </div>
            
            <div>
              <p className="text-sm text-gray-500">En Cours</p>
              <p className="mt-1 text-lg font-semibold text-yellow-600">
                {category.inProgressKPIs}
              </p>
            </div>
            
            <div>
              <p className="text-sm text-gray-500">À Rattraper</p>
              <p className="mt-1 text-lg font-semibold text-red-600">
                {category.delayedKPIs}
              </p>
            </div>
          </div>

          <div className="mt-4">
            <div className="w-full bg-gray-200 rounded-full h-2.5">
              <div
                className="bg-green-600 h-2.5 rounded-full"
                style={{
                  width: `${(category.completedKPIs / category.totalKPIs) * 100}%`,
                }}
              ></div>
            </div>
            <p className="mt-2 text-sm text-gray-500">
              Progression : {Math.round((category.completedKPIs / category.totalKPIs) * 100)}%
            </p>
          </div>
        </div>
      ))}
    </div>
  );
} 