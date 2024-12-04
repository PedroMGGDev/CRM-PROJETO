import api from '../api';

interface SendMessageParams {
  contactId: string;
  content: string;
  mediaUrl?: string;
  scheduleDate?: string;
}

export const sendWhatsAppMessage = async (companyId: string, params: SendMessageParams) => {
  try {
    const response = await api.post(`/companies/${companyId}/whatsapp/send`, params);
    return response.data;
  } catch (error) {
    console.error('Erro ao enviar mensagem WhatsApp:', error);
    throw error;
  }
};

export const getMessageQueue = async (companyId: string) => {
  try {
    const response = await api.get(`/companies/${companyId}/whatsapp/queue`);
    return response.data;
  } catch (error) {
    console.error('Erro ao buscar fila de mensagens:', error);
    throw error;
  }
};

export const cancelScheduledMessage = async (companyId: string, messageId: string) => {
  try {
    const response = await api.delete(`/companies/${companyId}/whatsapp/queue/${messageId}`);
    return response.data;
  } catch (error) {
    console.error('Erro ao cancelar mensagem agendada:', error);
    throw error;
  }
};