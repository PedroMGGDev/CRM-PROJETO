import { ChartData, ChartOptions } from 'chart.js';
import { DashboardMetrics } from '../../../types/models';

export const createOpportunityPieData = (metrics: DashboardMetrics): ChartData<'pie'> => ({
  labels: ['Ganhas', 'Abertas', 'Perdidas'],
  datasets: [
    {
      data: [
        metrics.wonOpportunities,
        metrics.openOpportunities,
        metrics.lostOpportunities,
      ],
      backgroundColor: ['#10B981', '#6366F1', '#EF4444'],
    },
  ],
});

export const createMonthlyTrendData = (metrics: DashboardMetrics): ChartData<'line'> => ({
  labels: metrics.monthlyTrend.map(m => m.month),
  datasets: [
    {
      label: 'Valor Total (R$)',
      data: metrics.monthlyTrend.map(m => m.value),
      borderColor: '#6366F1',
      tension: 0.4,
    },
  ],
});

export const createUserPerformanceData = (metrics: DashboardMetrics): ChartData<'bar'> => ({
  labels: metrics.userPerformance.map(u => u.name),
  datasets: [
    {
      label: 'Oportunidades Ganhas',
      data: metrics.userPerformance.map(u => u.wonOpportunities),
      backgroundColor: '#10B981',
    },
  ],
});

export const chartOptions: ChartOptions<'pie' | 'line' | 'bar'> = {
  maintainAspectRatio: false,
  plugins: {
    legend: {
      position: 'bottom',
    },
  },
};