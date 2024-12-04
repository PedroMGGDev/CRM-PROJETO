import api from '../api';
import type { Contact, Opportunity } from '../../types/models';

export const handleContactWebhook = async (data: {
  contact: Partial<Contact>;
  tags?: string[];
  kanbanStage?: string;
}) => {
  try {
    const response = await api.post('/webhooks/contact', data);
    return response.data;
  } catch (error) {
    console.error('Erro ao processar webhook de contato:', error);
    throw error;
  }
};

export const handleOpportunityWebhook = async (data: {
  opportunity: Partial<Opportunity>;
  status?: 'won' | 'lost';
}) => {
  try {
    const response = await api.post('/webhooks/opportunity', data);
    return response.data;
  } catch (error) {
    console.error('Erro ao processar webhook de oportunidade:', error);
    throw error;
  }
};

export const handleKanbanWebhook = async (data: {
  contactId: string;
  fromStage: string;
  toStage: string;
}) => {
  try {
    const response = await api.post('/webhooks/kanban', data);
    return response.data;
  } catch (error) {
    console.error('Erro ao processar webhook do kanban:', error);
    throw error;
  }
};