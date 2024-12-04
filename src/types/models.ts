export interface DashboardMetrics {
  totalContacts: number;
  contactsGrowth: string;
  openOpportunities: number;
  wonOpportunities: number;
  lostOpportunities: number;
  opportunitiesGrowth: string;
  totalValue: number;
  valueGrowth: string;
  conversionRate: number;
  conversionRateGrowth: string;
  averageClosingTime: number;
  averageTicketSize: number;
  growthRate: number;
  monthlyTrend: Array<{
    month: string;
    value: number;
  }>;
  userPerformance: Array<{
    name: string;
    wonOpportunities: number;
  }>;
}

// ... (rest of the existing types remain the same)