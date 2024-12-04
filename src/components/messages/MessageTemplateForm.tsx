import React from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useStore } from '../../store/useStore';
import { updateCompany } from '../../lib/api';
import { X } from 'lucide-react';

const templateSchema = z.object({
  name: z.string().min(1, 'Nome é obrigatório'),
  content: z.string().min(1, 'Conteúdo é obrigatório'),
  greetings: z.array(z.string()).min(1, 'Adicione pelo menos uma saudação'),
  endings: z.array(z.string()).min(1, 'Adicione pelo menos uma despedida'),
  mediaAttachments: z.array(z.string()).optional(),
});

type TemplateFormData = z.infer<typeof templateSchema>;

interface MessageTemplateFormProps {
  onClose: () => void;
  onSuccess: () => void;
}

export default function MessageTemplateForm({
  onClose,
  onSuccess,
}: MessageTemplateFormProps) {
  const { company } = useStore();
  const [greetingInput, setGreetingInput] = React.useState('');
  const [endingInput, setEndingInput] = React.useState('');

  const {
    register,
    handleSubmit,
    watch,
    setValue,
    formState: { errors, isSubmitting },
  } = useForm<TemplateFormData>({
    resolver: zodResolver(templateSchema),
    defaultValues: {
      greetings: [],
      endings: [],
      mediaAttachments: [],
    },
  });

  const greetings = watch('greetings');
  const endings = watch('endings');

  const addGreeting = () => {
    if (greetingInput.trim()) {
      setValue('greetings', [...greetings, greetingInput.trim()]);
      setGreetingInput('');
    }
  };

  const addEnding = () => {
    if (endingInput.trim()) {
      setValue('endings', [...endings, endingInput.trim()]);
      setEndingInput('');
    }
  };

  const removeGreeting = (index: number) => {
    setValue(
      'greetings',
      greetings.filter((_, i) => i !== index)
    );
  };

  const removeEnding = (index: number) => {
    setValue(
      'endings',
      endings.filter((_, i) => i !== index)
    );
  };

  const onSubmit = async (data: TemplateFormData) => {
    try {
      if (!company?.id) return;

      const updatedCompany = {
        ...company,
        settings: {
          ...company.settings,
          messageTemplates: [
            ...(company.settings.messageTemplates || []),
            {
              id: crypto.randomUUID(),
              ...data,
            },
          ],
        },
      };

      await updateCompany(company.id, updatedCompany);
      onSuccess();
    } catch (error) {
      console.error('Erro ao criar template:', error);
    }
  };

  return (
    <div className="fixed inset-0 bg-gray-500 bg-opacity-75 flex items-center justify-center p-4">
      <div className="bg-white rounded-lg max-w-2xl w-full p-6">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-lg font-medium text-gray-900">
            Novo Template de Mensagem
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
              Nome do Template
            </label>
            <input
              type="text"
              {...register('name')}
              className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
            />
            {errors.name && (
              <p className="mt-2 text-sm text-red-600">{errors.name.message}</p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">
              Conteúdo da Mensagem
            </label>
            <textarea
              {...register('content')}
              rows={4}
              className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
              placeholder="Use {greeting} para saudação e {ending} para despedida"
            />
            {errors.content && (
              <p className="mt-2 text-sm text-red-600">{errors.content.message}</p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">
              Saudações
            </label>
            <div className="mt-1 flex space-x-2">
              <input
                type="text"
                value={greetingInput}
                onChange={(e) => setGreetingInput(e.target.value)}
                className="block w-full border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                placeholder="Ex: Bom dia"
              />
              <button
                type="button"
                onClick={addGreeting}
                className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700"
              >
                Adicionar
              </button>
            </div>
            <div className="mt-2 flex flex-wrap gap-2">
              {greetings.map((greeting, index) => (
                <span
                  key={index}
                  className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-indigo-100 text-indigo-800"
                >
                  {greeting}
                  <button
                    type="button"
                    onClick={() => removeGreeting(index)}
                    className="ml-1.5 inline-flex items-center justify-center h-4 w-4 rounded-full text-indigo-400 hover:bg-indigo-200 hover:text-indigo-500 focus:outline-none"
                  >
                    <X className="h-3 w-3" />
                  </button>
                </span>
              ))}
            </div>
            {errors.greetings && (
              <p className="mt-2 text-sm text-red-600">
                {errors.greetings.message}
              </p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">
              Despedidas
            </label>
            <div className="mt-1 flex space-x-2">
              <input
                type="text"
                value={endingInput}
                onChange={(e) => setEndingInput(e.target.value)}
                className="block w-full border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                placeholder="Ex: Atenciosamente"
              />
              <button
                type="button"
                onClick={addEnding}
                className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700"
              >
                Adicionar
              </button>
            </div>
            <div className="mt-2 flex flex-wrap gap-2">
              {endings.map((ending, index) => (
                <span
                  key={index}
                  className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800"
                >
                  {ending}
                  <button
                    type="button"
                    onClick={() => removeEnding(index)}
                    className="ml-1.5 inline-flex items-center justify-center h-4 w-4 rounded-full text-green-400 hover:bg-green-200 hover:text-green-500 focus:outline-none"
                  >
                    <X className="h-3 w-3" />
                  </button>
                </span>
              ))}
            </div>
            {errors.endings && (
              <p className="mt-2 text-sm text-red-600">{errors.endings.message}</p>
            )}
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
              className="inline-flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700"
            >
              {isSubmitting ? 'Salvando...' : 'Salvar Template'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}