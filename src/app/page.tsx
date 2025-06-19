import KPIDashboard from '@/components/kpi/KPIDashboard';
import DashboardLayout from "@/components/dashboard-layout"

export default function Home() {
  return (
    <DashboardLayout>
      <main className="min-h-screen bg-gray-50">
        <div className="container mx-auto py-8">
          <KPIDashboard />
        </div>
      </main>
    </DashboardLayout>
  );
} 