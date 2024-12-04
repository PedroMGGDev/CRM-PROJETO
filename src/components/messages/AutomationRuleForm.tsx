import React from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { X } from 'lucide-react';
import { useStore } from '../../store/useStore';
import { createAutomationRule } from '../../lib/api';

const automationSchema = z.object({
  name: z.string().min(1, 'Nome é obrigatório'),
  trigger: z.object({
    type: z.enum(['tag', 'schedule', 'kanban_stage']),
    value: z.string().min(1, 'Valor do gatilho é obrigatório'),
  }),
  schedule: z.object({
    frequency: z.enum(['daily', 'weekly', 'monthly']),
    time: z.string().optional(),
    daysOfWeek: z.array(z.number()).optional(),
    dayOfMonth: z.number().optional(),
  }).optional(),
  message: z.object({
    templateId: z.string().min(1, 'Template é obrigatório'),
    delay: z.number().min(0),
  }),
});

type AutomationFormData = z.infer<typeof automationSchema>;

interface AutomationRuleFormProps {
  onClose: () => void;
  onSuccess: () => void;
}

export default function AutomationRuleForm({
  onClose,
  onSuccess,
}: AutomationRuleFormProps) {
  const { company } = useStore();

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors, isSubmitting },
  } = useForm<AutomationFormData>({
    resolver: zodResolver(automationSchema),
    defaultValues: {
      trigger: {
        type: 'tag',
      },
      schedule: {
        frequency: 'daily',
      },
      message: {
        delay: 0,
      },
    },
  });

  const triggerType = watch('trigger.type');

  const onSubmit = async (data: AutomationFormData) => {
    try {
      if (!company?.id) return;

      await createAutomationRule(company.id, data);
      onSuccess();
    } catch (error) {
      console.error('Erro ao criar regra:', error);
    }
  };

  return (
    <div className="fixed inset-0 bg-gray-500 bg-opacity-75 flex items-center justify-center p-4">
      <div className="bg-white rounded-lg max-w-2xl w-full p-6">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-lg font-medium text-gray-900">
            Nova Regra de Automação
          </h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-500"
          >
            <X className="h-6 w-6" />
          </button>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Nome da Regra
            </label>
            <input
              type="text"
              {...register('name')}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
            />
            {errors.name && (
              <p className="mt-2 text-sm text-red-600">{errors.name.message}</p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">
              Tipo de Gatilho
            </label>
            <select
              {...register('trigger.type')}
              className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm rounded-md"
            >
              <option value="tag">Tag</option>
              <option value="schedule">Agendamento</option>
              <option value="kanban_stage">Estágio Kanban</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">
              {triggerType === 'tag'
                ? 'Tag'
                : triggerType === 'schedule'
                ? 'Data/Hora'
                : 'Estágio'}
            </label>
            <input
              type={triggerType === 'schedule' ? 'datetime-local' : 'text'}
              {...register('trigger.value')}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
            />
            {errors.trigger?.value && (
              <p className="mt-2 text-sm text-red-600">
                {errors.trigger.value.message}
              </p>
            )}
          </div>

          {triggerType === 'schedule' && (
            <div>
              <label className="block text-sm font-medium text-gray-700">
                Frequência
              </label>
              <select
                {...register('schedule.frequency')}
                className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm rounded-md"
              >
                <option value="daily">Diário</option>
                <option value="weekly">Semanal</option>
                <option value="monthly">Mensal</option>
              </select>
            </div>
          )}

          <div>
            <label className="block text-sm font-medium text-gray-700">
              Template de Mensagem
            </label>
            <select
              {...register('message.templateId')}
              className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm rounded-md"
            >
              <option value="">Selecione um template</option>
              {company?.settings?.messageTemplates?.map((template) => (
                <option key={template.id} value={template.id}>
                  {template.name}
                </option>
              ))}
            </select>
            {errors.message?.templateId && (
              <p className="mt-2 text-sm text-red-600">
                {errors.message.templateId.message}
              </p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">
              Atraso (segundos)
            </label>
            <input
              type="number"
              min="0"
              {...register('message.delay', { valueAsNumber: true })}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
            />
          </div>

          <div className="flex justify-end space-x-3">
            <button
              type="button"
              onClick={onClose}
              className="inline-flex justify-center py-2 px-4 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50"
            >
              Cancelar
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className="inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700"
            >
              {isSubmitting ? 'Criando...' : 'Criar Regra'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}