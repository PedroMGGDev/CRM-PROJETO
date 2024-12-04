import { getAutomationRules, sendWhatsAppMessage } from '../lib/api';
import type { AutomationRule } from '../types/models';

const checkRules = async (companyId: string) => {
  try {
    const rules = await getAutomationRules(companyId);
    
    for (const rule of rules) {
      await processRule(companyId, rule);
    }
  } catch (error) {
    console.error('Erro ao processar regras:', error);
  }
};

const processRule = async (companyId: string, rule: AutomationRule) => {
  try {
    // Implementar lógica específica para cada tipo de regra
    switch (rule.trigger.type) {
      case 'tag':
        await processTagRule(companyId, rule);
        break;
      case 'schedule':
        await processScheduleRule(companyId, rule);
        break;
      case 'kanban_stage':
        await processKanbanRule(companyId, rule);
        break;
    }
  } catch (error) {
    console.error(`Erro ao processar regra ${rule.id}:`, error);
  }
};

const processTagRule = async (companyId: string, rule: AutomationRule) => {
  // Implementar lógica para regras baseadas em tags
};

const processScheduleRule = async (companyId: string, rule: AutomationRule) => {
  // Implementar lógica para regras baseadas em agendamento
};

const processKanbanRule = async (companyId: string, rule: AutomationRule) => {
  // Implementar lógica para regras baseadas em estágios do kanban
};

// Iniciar o cron job para verificar as regras a cada 2 minutos
export const startCronJob = (companyId: string) => {
  setInterval(() => {
    checkRules(companyId);
  }, 2 * 60 * 1000); // 2 minutos
};