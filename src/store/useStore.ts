import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { User, Company, Contact, Opportunity, KanbanStage } from '../types/models';

interface AuthState {
  user: User | null;
  company: Company | null;
  setUser: (user: User | null) => void;
  setCompany: (company: Company | null) => void;
  logout: () => void;
}

interface DataState {
  contacts: Contact[];
  opportunities: Opportunity[];
  kanbanStages: KanbanStage[];
  setContacts: (contacts: Contact[]) => void;
  setOpportunities: (opportunities: Opportunity[]) => void;
  setKanbanStages: (stages: KanbanStage[]) => void;
  addContact: (contact: Contact) => void;
  updateContact: (id: string, contact: Partial<Contact>) => void;
  addOpportunity: (opportunity: Opportunity) => void;
  updateOpportunity: (id: string, opportunity: Partial<Opportunity>) => void;
  moveOpportunity: (opportunityId: string, newStage: string) => void;
}

interface Store extends AuthState, DataState {}

export const useStore = create<Store>()(
  persist(
    (set) => ({
      // Auth State
      user: null,
      company: null,
      setUser: (user) => set({ user }),
      setCompany: (company) => set({ company }),
      logout: () => set({ user: null, company: null }),

      // Data State
      contacts: [],
      opportunities: [],
      kanbanStages: [],
      setContacts: (contacts) => set({ contacts }),
      setOpportunities: (opportunities) => set({ opportunities }),
      setKanbanStages: (kanbanStages) => set({ kanbanStages }),
      addContact: (contact) => 
        set((state) => ({ contacts: [...state.contacts, contact] })),
      updateContact: (id, contact) =>
        set((state) => ({
          contacts: state.contacts.map((c) =>
            c.id === id ? { ...c, ...contact } : c
          ),
        })),
      addOpportunity: (opportunity) =>
        set((state) => ({ opportunities: [...state.opportunities, opportunity] })),
      updateOpportunity: (id, opportunity) =>
        set((state) => ({
          opportunities: state.opportunities.map((o) =>
            o.id === id ? { ...o, ...opportunity } : o
          ),
        })),
      moveOpportunity: (opportunityId, newStage) =>
        set((state) => ({
          opportunities: state.opportunities.map((o) =>
            o.id === opportunityId ? { ...o, kanbanStage: newStage } : o
          ),
        })),
    }),
    {
      name: 'crm-storage',
      partialize: (state) => ({
        user: state.user,
        company: state.company,
      }),
    }
  )
);