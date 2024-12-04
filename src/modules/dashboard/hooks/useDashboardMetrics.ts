import { useQuery } from '@tanstack/react-query';
import { getDashboardMetrics } from '../../../lib/api';
import { useStore } from '../../../store/useStore';

interface UseDashboardMetricsProps {
  startDate: string;
  endDate: string;
}

export function useDashboardMetrics({ startDate, endDate }: UseDashboardMetricsProps) {
  const { company } = useStore();

  return useQuery({
    queryKey: ['dashboard-metrics', company?.id, startDate, endDate],
    queryFn: () => getDashboardMetrics(company?.id || '', { startDate, endDate }),
    enabled: !!company?.id,
  });
}