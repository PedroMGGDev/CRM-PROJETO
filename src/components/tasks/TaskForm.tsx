import React from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useStore } from '../../store/useStore';
import { createTask } from '../../lib/api';

const taskSchema = z.object({
  type: z.enum(['meeting', 'call', 'followup']),
  title: z.string().min(1, 'Título é obrigatório'),
  description: z.string().optional(),
  dueDate: z.string().min(1, 'Data é obrigatória'),
  assignedTo: z.string().min(1, 'Responsável é obrigatório'),
});

type TaskFormData = z.infer<typeof taskSchema>;

interface TaskFormProps {
  opportunityId: string;
  onSuccess: () => void;
  onCancel: () => void;
}

export default function TaskForm({ opportunityId, onSuccess, onCancel }: TaskFormProps) {
  const { company, users } = useStore();

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<TaskFormData>({
    resolver: zodResolver(taskSchema),
  });

  const onSubmit = async (data: TaskFormData) => {
    try {
      if (!company?.id) return;

      await createTask(company.id, opportunityId, {
        ...data,
        completed: false,
      });

      onSuccess();
    } catch (error) {
      console.error('Erro ao criar tarefa:', error);
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
      <div>
        <label className="block text-sm font-medium text-gray-700">
          Tipo
        </label>
        <select
          {...register('type')}
          className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm rounded-md"
        >
          <option value="meeting">Reunião</option>
          <option value="call">Ligação</option>
          <option value="followup">Acompanhamento</option>
        </select>
        {errors.type && (
          <p className="mt-2 text-sm text-red-600">{errors.type.message}</p>
        )}
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700">
          Título
        </label>
        <input
          type="text"
          {...register('title')}
          className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
        />
        {errors.title && (
          <p className="mt-2 text-sm text-red-600">{errors.title.message}</p>
        )}
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

      <div>
        <label className="block text-sm font-medium text-gray-700">
          Data
        </label>
        <input
          type="datetime-local"
          {...register('dueDate')}
          className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
        />
        {errors.dueDate && (
          <p className="mt-2 text-sm text-red-600">{errors.dueDate.message}</p>
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
        {errors.assignedTo && (
          <p className="mt-2 text-sm text-red-600">{errors.assignedTo.message}</p>
        )}
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
          {isSubmitting ? 'Criando...' : 'Criar Tarefa'}
        </button>
      </div>
    </form>
  );
}