import axios from 'axios';
import type { 
  Contact, 
  Opportunity, 
  Company, 
  User, 
  Task, 
  DashboardMetrics,
  AutomationRule,
  MessageTemplate 
} from '../types/models';

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add request interceptor to include auth token
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('auth_token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Auth
export const login = (email: string, password: string) => 
  api.post<{ email: string; requiresMfa: boolean }>('/auth/login', { email, password });

export const verifyMfa = (email: string, code: string) =>
  api.post<{ token: string; user: User }>('/auth/verify-mfa', { email, code });

export const requestPasswordReset = (email: string) =>
  api.post('/auth/forgot-password', { email });

export const resetPassword = (token: string, newPassword: string) =>
  api.post('/auth/reset-password', { token, newPassword });

// Dashboard
export const getDashboardMetrics = (
  companyId: string,
  filters?: {
    startDate?: string;
    endDate?: string;
    userId?: string;
    tags?: string[];
    kanbanStage?: string;
  }
) => api.get<DashboardMetrics>(`/companies/${companyId}/dashboard`, { params: filters });

// Companies
export const createCompany = (company: Partial<Company>) =>
  api.post<Company>('/companies', company);

export const getCompany = (companyId: string) =>
  api.get<Company>(`/companies/${companyId}`);

export const updateCompany = (companyId: string, company: Partial<Company>) =>
  api.put<Company>(`/companies/${companyId}`, company);

// Users
export const getUsers = (companyId: string) =>
  api.get<User[]>(`/companies/${companyId}/users`);

export const createUser = (companyId: string, user: Partial<User>) =>
  api.post<User>(`/companies/${companyId}/users`, user);

export const updateUser = (companyId: string, userId: string, user: Partial<User>) =>
  api.put<User>(`/companies/${companyId}/users/${userId}`, user);

// Contacts
export const getContacts = (companyId: string, filters?: {
  search?: string;
  tags?: string[];
  kanbanStage?: string;
}) => api.get<Contact[]>(`/companies/${companyId}/contacts`, { params: filters });

export const createContact = (companyId: string, contact: Partial<Contact>) =>
  api.post<Contact>(`/companies/${companyId}/contacts`, contact);

export const updateContact = (companyId: string, contactId: string, contact: Partial<Contact>) =>
  api.put<Contact>(`/companies/${companyId}/contacts/${contactId}`, contact);

// Opportunities
export const getOpportunities = (companyId: string, filters?: {
  status?: 'open' | 'won' | 'lost';
  startDate?: string;
  endDate?: string;
  userId?: string;
  tags?: string[];
}) => api.get<Opportunity[]>(`/companies/${companyId}/opportunities`, { params: filters });

export const createOpportunity = (companyId: string, opportunity: Partial<Opportunity>) =>
  api.post<Opportunity>(`/companies/${companyId}/opportunities`, opportunity);

export const updateOpportunity = (companyId: string, opportunityId: string, opportunity: Partial<Opportunity>) =>
  api.put<Opportunity>(`/companies/${companyId}/opportunities/${opportunityId}`, opportunity);

// Tasks
export const getTasks = (companyId: string, opportunityId: string) =>
  api.get<Task[]>(`/companies/${companyId}/opportunities/${opportunityId}/tasks`);

export const createTask = (companyId: string, opportunityId: string, task: Partial<Task>) =>
  api.post<Task>(`/companies/${companyId}/opportunities/${opportunityId}/tasks`, task);

export const updateTask = (companyId: string, opportunityId: string, taskId: string, task: Partial<Task>) =>
  api.put<Task>(`/companies/${companyId}/opportunities/${opportunityId}/tasks/${taskId}`, task);

// Message Templates
export const getMessageTemplates = (companyId: string) =>
  api.get<MessageTemplate[]>(`/companies/${companyId}/message-templates`);

export const createMessageTemplate = (companyId: string, template: Partial<MessageTemplate>) =>
  api.post<MessageTemplate>(`/companies/${companyId}/message-templates`, template);

export const updateMessageTemplate = (companyId: string, templateId: string, template: Partial<MessageTemplate>) =>
  api.put<MessageTemplate>(`/companies/${companyId}/message-templates/${templateId}`, template);

// Automation Rules
export const getAutomationRules = (companyId: string) =>
  api.get<AutomationRule[]>(`/companies/${companyId}/automation-rules`);

export const createAutomationRule = (companyId: string, rule: Partial<AutomationRule>) =>
  api.post<AutomationRule>(`/companies/${companyId}/automation-rules`, rule);

export const updateAutomationRule = (companyId: string, ruleId: string, rule: Partial<AutomationRule>) =>
  api.put<AutomationRule>(`/companies/${companyId}/automation-rules/${ruleId}`, rule);

// Messages
export const sendMessage = (companyId: string, contactId: string, message: {
  content: string;
  mediaUrl?: string;
}) => api.post(`/companies/${companyId}/contacts/${contactId}/messages`, message);

export const scheduleMessage = (companyId: string, contactId: string, message: {
  content: string;
  mediaUrl?: string;
  scheduleDate: string;
}) => api.post(`/companies/${companyId}/contacts/${contactId}/schedule-message`, message);

// Webhooks
export const handleContactWebhook = (data: any) =>
  api.post('/webhooks/contact', data);

export const handleKanbanWebhook = (data: any) =>
  api.post('/webhooks/kanban', data);

export default api;