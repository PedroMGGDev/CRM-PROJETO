export const formatCurrency = (value: number): string => {
  return new Intl.NumberFormat('pt-BR', {
    style: 'currency',
    currency: 'BRL',
  }).format(value);
};

export const formatPercentage = (value: number): string => {
  return `${value.toFixed(1)}%`;
};

export const formatDays = (days: number): string => {
  return `${days} dias`;
};

export const formatGrowth = (value: string): string => {
  const numValue = parseFloat(value);
  return numValue >= 0 ? `+${value}` : value;
};