export interface Contact {
  id: string;
  name: string;
  number: string;
  email: string;
  profilePicUrl?: string;
  kanban: string;
  tag: string[];
  cpf: string;
  birthdayDate?: Date;
  firstName: string;
  lastName: string;
  businessName?: string;
}

export interface Opportunity {
  id: string;
  contactId: string;
  value: number;
  kanbanStage: string;
  status: 'open' | 'won' | 'lost';
  creationDate: Date;
  saleDate?: Date;
  tags: string[];
}

export interface Company {
  id: string;
  name: string;
  users: User[];
}

export interface User {
  id: string;
  name: string;
  email: string;
  role: 'admin' | 'user';
  companyId: string;
}