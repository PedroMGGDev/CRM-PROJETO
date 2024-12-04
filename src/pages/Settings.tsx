import React from 'react';
import { useStore } from '../store/useStore';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { updateCompany } from '../lib/api';

const settingsSchema = z.object({
  companyName: z.string().min(1, 'Nome da empresa é obrigatório'),
  emailSettings: z.object({
    smtpHost: z.string().min(1, 'Host SMTP é obrigatório'),
    smtpPort: z.string().min(1, 'Porta SMTP é obrigatória'),
    smtpUser: z.string().email('Email inválido'),
    smtpPassword: z.string().min(1, 'Senha SMTP é obrigatória'),
  }),
  whatsappSettings: z.object({
    apiUrl: z.string().url('URL inválida'),
    apiToken: z.string().min(1, 'Token é obrigatório'),
  }),
});

type SettingsFormData = z.infer<typeof settingsSchema>;

export default function Settings() {
  const { company, setCompany } = useStore();

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<SettingsFormData>({
    resolver: zodResolver(settingsSchema),
    defaultValues: {
      companyName: company?.name || '',
      emailSettings: {
        smtpHost: company?.settings?.smtp?.host || '',
        smtpPort: company?.settings?.smtp?.port || '',
        smtpUser: company?.settings?.smtp?.user || '',
        smtpPassword: company?.settings?.smtp?.password || '',
      },
      whatsappSettings: {
        apiUrl: company?.settings?.whatsapp?.apiUrl || '',
        apiToken: company?.settings?.whatsapp?.apiToken || '',
      },
    },
  });

  const onSubmit = async (data: SettingsFormData) => {
    try {
      if (!company?.id) return;

      const updatedCompany = await updateCompany(company.id, {
        name: data.companyName,
        settings: {
          ...company.settings,
          smtp: {
            host: data.emailSettings.smtpHost,
            port: data.emailSettings.smtpPort,
            user: data.emailSettings.smtpUser,
            password: data.emailSettings.smtpPassword,
          },
          whatsapp: {
            apiUrl: data.whatsappSettings.apiUrl,
            apiToken: data.whatsappSettings.apiToken,
          },
        },
      });

      setCompany(updatedCompany);
    } catch (error) {
      console.error('Erro ao atualizar configurações:', error);
    }
  };

  return (
    <div className="max-w-3xl mx-auto">
      <h1 className="text-2xl font-bold text-gray-900 mb-6">Configurações</h1>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-8">
        <div className="bg-white shadow rounded-lg p-6">
          <h2 className="text-lg font-medium text-gray-900 mb-4">
            Informações da Empresa
          </h2>
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Nome da Empresa
            </label>
            <input
              type="text"
              {...register('companyName')}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
            />
            {errors.companyName && (
              <p className="mt-2 text-sm text-red-600">
                {errors.companyName.message}
              </p>
            )}
          </div>
        </div>

        <div className="bg-white shadow rounded-lg p-6">
          <h2 className="text-lg font-medium text-gray-900 mb-4">
            Configurações de Email
          </h2>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700">
                Host SMTP
              </label>
              <input
                type="text"
                {...register('emailSettings.smtpHost')}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
              />
              {errors.emailSettings?.smtpHost && (
                <p className="mt-2 text-sm text-red-600">
                  {errors.emailSettings.smtpHost.message}
                </p>
              )}
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">
                Porta SMTP
              </label>
              <input
                type="text"
                {...register('emailSettings.smtpPort')}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
              />
              {errors.emailSettings?.smtpPort && (
                <p className="mt-2 text-sm text-red-600">
                  {errors.emailSettings.smtpPort.message}
                </p>
              )}
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">
                Usuário SMTP
              </label>
              <input
                type="email"
                {...register('emailSettings.smtpUser')}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
              />
              {errors.emailSettings?.smtpUser && (
                <p className="mt-2 text-sm text-red-600">
                  {errors.emailSettings.smtpUser.message}
                </p>
              )}
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">
                Senha SMTP
              </label>
              <input
                type="password"
                {...register('emailSettings.smtpPassword')}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
              />
              {errors.emailSettings?.smtpPassword && (
                <p className="mt-2 text-sm text-red-600">
                  {errors.emailSettings.smtpPassword.message}
                </p>
              )}
            </div>
          </div>
        </div>

        <div className="bg-white shadow rounded-lg p-6">
          <h2 className="text-lg font-medium text-gray-900 mb-4">
            Configurações do WhatsApp
          </h2>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700">
                URL da API
              </label>
              <input
                type="url"
                {...register('whatsappSettings.apiUrl')}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
              />
              {errors.whatsappSettings?.apiUrl && (
                <p className="mt-2 text-sm text-red-600">
                  {errors.whatsappSettings.apiUrl.message}
                </p>
              )}
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">
                Token da API
              </label>
              <input
                type="password"
                {...register('whatsappSettings.apiToken')}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
              />
              {errors.whatsappSettings?.apiToken && (
                <p className="mt-2 text-sm text-red-600">
                  {errors.whatsappSettings.apiToken.message}
                </p>
              )}
            </div>
          </div>
        </div>

        <div className="flex justify-end">
          <button
            type="submit"
            disabled={isSubmitting}
            className="inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
          >
            {isSubmitting ? 'Salvando...' : 'Salvar Configurações'}
          </button>
        </div>
      </form>
    </div>
  );
}