import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { 
  BarChart as BarChartIcon, 
  Users, 
  DollarSign, 
  Target,
  Calendar,
  TrendingUp
} from 'lucide-react';
import { useStore } from '../store/useStore';
import { getDashboardMetrics } from '../lib/api';
import { Line, Bar, Pie } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  ArcElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';

// Register ChartJS components
ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  ArcElement,
  Title,
  Tooltip,
  Legend
);

export default function Dashboard() {
  const { company } = useStore();
  const [dateRange, setDateRange] = React.useState({
    startDate: new Date(new Date().setMonth(new Date().getMonth() - 1)).toISOString(),
    endDate: new Date().toISOString(),
  });

  const { data: metrics } = useQuery({
    queryKey: ['dashboard-metrics', company?.id, dateRange],
    queryFn: () => getDashboardMetrics(company?.id || '', dateRange),
    enabled: !!company?.id,
  });

  const opportunityData = {
    labels: ['Ganhas', 'Abertas', 'Perdidas'],
    datasets: [
      {
        data: [
          metrics?.wonOpportunities || 0,
          metrics?.openOpportunities || 0,
          metrics?.lostOpportunities || 0,
        ],
        backgroundColor: ['#10B981', '#6366F1', '#EF4444'],
      },
    ],
  };

  const monthlyTrendData = {
    labels: metrics?.monthlyTrend.map(m => m.month) || [],
    datasets: [
      {
        label: 'Valor Total (R$)',
        data: metrics?.monthlyTrend.map(m => m.value) || [],
        borderColor: '#6366F1',
        tension: 0.4,
      },
    ],
  };

  const userPerformanceData = {
    labels: metrics?.userPerformance.map(u => u.name) || [],
    datasets: [
      {
        label: 'Oportunidades Ganhas',
        data: metrics?.userPerformance.map(u => u.wonOpportunities) || [],
        backgroundColor: '#10B981',
      },
    ],
  };

  return (
    <div className="space-y-6">
      {/* Filtros */}
      <div className="bg-white p-4 rounded-lg shadow">
        <div className="flex gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700">Data Inicial</label>
            <input
              type="date"
              value={dateRange.startDate.split('T')[0]}
              onChange={(e) => setDateRange(prev => ({ ...prev, startDate: new Date(e.target.value).toISOString() }))}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Data Final</label>
            <input
              type="date"
              value={dateRange.endDate.split('T')[0]}
              onChange={(e) => setDateRange(prev => ({ ...prev, endDate: new Date(e.target.value).toISOString() }))}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
            />
          </div>
        </div>
      </div>

      {/* Cards */}
      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
        <DashboardCard
          title="Total de Contatos"
          value={metrics?.totalContacts.toString() || '0'}
          icon={Users}
          trend={metrics?.contactsGrowth || '0%'}
        />
        <DashboardCard
          title="Oportunidades Abertas"
          value={metrics?.openOpportunities.toString() || '0'}
          icon={Target}
          trend={metrics?.opportunitiesGrowth || '0%'}
        />
        <DashboardCard
          title="Valor Total"
          value={new Intl.NumberFormat('pt-BR', {
            style: 'currency',
            currency: 'BRL'
          }).format(metrics?.totalValue || 0)}
          icon={DollarSign}
          trend={metrics?.valueGrowth || '0%'}
        />
        <DashboardCard
          title="Taxa de Conversão"
          value={`${metrics?.conversionRate || 0}%`}
          icon={BarChartIcon}
          trend={metrics?.conversionRateGrowth || '0%'}
        />
      </div>

      {/* Gráficos */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        <div className="bg-white p-4 rounded-lg shadow">
          <h3 className="text-lg font-medium text-gray-900 mb-4">Oportunidades por Status</h3>
          <div className="h-64">
            <Pie data={opportunityData} options={{ maintainAspectRatio: false }} />
          </div>
        </div>

        <div className="bg-white p-4 rounded-lg shadow">
          <h3 className="text-lg font-medium text-gray-900 mb-4">Tendência Mensal</h3>
          <div className="h-64">
            <Line data={monthlyTrendData} options={{ maintainAspectRatio: false }} />
          </div>
        </div>

        <div className="bg-white p-4 rounded-lg shadow lg:col-span-2">
          <h3 className="text-lg font-medium text-gray-900 mb-4">Performance por Usuário</h3>
          <div className="h-64">
            <Bar data={userPerformanceData} options={{ maintainAspectRatio: false }} />
          </div>
        </div>
      </div>

      {/* Métricas Adicionais */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        <div className="bg-white p-4 rounded-lg shadow">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-medium text-gray-900">Tempo Médio de Fechamento</h3>
            <Calendar className="h-5 w-5 text-gray-400" />
          </div>
          <p className="mt-2 text-3xl font-semibold text-gray-900">
            {metrics?.averageClosingTime || 0} dias
          </p>
        </div>

        <div className="bg-white p-4 rounded-lg shadow">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-medium text-gray-900">Ticket Médio</h3>
            <DollarSign className="h-5 w-5 text-gray-400" />
          </div>
          <p className="mt-2 text-3xl font-semibold text-gray-900">
            {new Intl.NumberFormat('pt-BR', {
              style: 'currency',
              currency: 'BRL'
            }).format(metrics?.averageTicketSize || 0)}
          </p>
        </div>

        <div className="bg-white p-4 rounded-lg shadow">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-medium text-gray-900">Taxa de Crescimento</h3>
            <TrendingUp className="h-5 w-5 text-gray-400" />
          </div>
          <p className="mt-2 text-3xl font-semibold text-gray-900">
            {metrics?.growthRate || 0}%
          </p>
        </div>
      </div>
    </div>
  );
}

interface DashboardCardProps {
  title: string;
  value: string;
  icon: React.ElementType;
  trend: string;
}

function DashboardCard({ title, value, icon: Icon, trend }: DashboardCardProps) {
  const trendValue = parseFloat(trend);
  const isPositive = trendValue >= 0;

  return (
    <div className="bg-white overflow-hidden shadow rounded-lg">
      <div className="p-5">
        <div className="flex items-center">
          <div className="flex-shrink-0">
            <Icon className="h-6 w-6 text-gray-400" />
          </div>
          <div className="ml-5 w-0 flex-1">
            <dl>
              <dt className="text-sm font-medium text-gray-500 truncate">
                {title}
              </dt>
              <dd className="flex items-baseline">
                <div className="text-2xl font-semibold text-gray-900">
                  {value}
                </div>
                <div className={`ml-2 flex items-baseline text-sm font-semibold ${
                  isPositive ? 'text-green-600' : 'text-red-600'
                }`}>
                  {trend}
                </div>
              </dd>
            </dl>
          </div>
        </div>
      </div>
    </div>
  );
}