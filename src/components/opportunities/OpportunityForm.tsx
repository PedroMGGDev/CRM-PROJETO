import React from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useStore } from '../../store/useStore';
import { createOpportunity } from '../../lib/api';

const opportunitySchema = z.object({
  contactId: z.string().min(1, 'Selecione um contato'),
  value: z.number().min(0, 'Valor deve ser maior que zero'),
  kanbanStage: z.string().min(1, 'Selecione um estágio'),
  tags: z.array(z.string()),
  assignedTo: z.string().optional(),
  description: z.string().optional(),
});

type OpportunityFormData = z.infer<typeof opportunitySchema>;

interface OpportunityFormProps {
  onSuccess: () => void;
  onCancel: () => void;
}

export default function OpportunityForm({ onSuccess, onCancel }: OpportunityFormProps) {
  const { company, contacts, users } = useStore();
  
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<OpportunityFormData>({
    resolver: zodResolver(opportunitySchema),
    defaultValues: {
      kanbanStage: 'new',
      tags: [],
    },
  });

  const onSubmit = async (data: OpportunityFormData) => {
    try {
      if (!company?.id) return;
      
      await createOpportunity(company.id, {
        ...data,
        status: 'open',
        creationDate: new Date().toISOString(),
        tasks: [],
      });
      
      onSuccess();
    } catch (error) {
      console.error('Erro ao criar oportunidade:', error);
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
      <div>
        <label className="block text-sm font-medium text-gray-700">
          Contato
        </label>
        <select
          {...register('contactId')}
          className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm rounded-md"
        >
          <option value="">Selecione um contato</option>
          {contacts.map((contact) => (
            <option key={contact.id} value={contact.id}>
              {contact.name}
            </option>
          ))}
        </select>
        {errors.contactId && (
          <p className="mt-2 text-sm text-red-600">{errors.contactId.message}</p>
        )}
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700">
          Valor
        </label>
        <div className="mt-1 relative rounded-md shadow-sm">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <span className="text-gray-500 sm:text-sm">R$</span>
          </div>
          <input
            type="number"
            step="0.01"
            {...register('value', { valueAsNumber: true })}
            className="mt-1 block w-full pl-12 pr-3 py-2 text-base border-gray-300 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm rounded-md"
          />
        </div>
        {errors.value && (
          <p className="mt-2 text-sm text-red-600">{errors.value.message}</p>
        )}
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700">
          Responsável
        </label>
        <select
          {...register('assignedTo')}
          className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm rounded-md"
        >
          <option value="">Selecione um responsável</option>
          {users.map((user) => (
            <option key={user.id} value={user.id}>
              {user.name}
            </option>
          ))}
        </select>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700">
          Descrição
        </label>
        <textarea
          {...register('description')}
          rows={3}
          className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
        />
      </div>

      <div className="flex justify-end space-x-3">
        <button
          type="button"
          onClick={onCancel}
          className="inline-flex justify-center py-2 px-4 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
        >
          Cancelar
        </button>
        <button
          type="submit"
          disabled={isSubmitting}
          className="inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
        >
          {isSubmitting ? 'Criando...' : 'Criar Oportunidade'}
        </button>
      </div>
    </form>
  );
}