import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { Plus, Calendar, Clock, Tags } from 'lucide-react';
import { useStore } from '../store/useStore';
import MessageTemplateForm from '../components/messages/MessageTemplateForm';
import AutomationRuleForm from '../components/messages/AutomationRuleForm';
import { getCompany } from '../lib/api';

export default function Messages() {
  const [showTemplateForm, setShowTemplateForm] = React.useState(false);
  const [showAutomationForm, setShowAutomationForm] = React.useState(false);
  const { company } = useStore();

  const { data: companyData } = useQuery({
    queryKey: ['company', company?.id],
    queryFn: () => getCompany(company?.id || ''),
    enabled: !!company?.id,
  });

  const templates = companyData?.settings.messageTemplates || [];
  const automationRules = companyData?.settings.automationRules || [];

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold text-gray-900">
          Mensagens e Automações
        </h1>
        <div className="space-x-3">
          <button
            onClick={() => setShowTemplateForm(true)}
            className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700"
          >
            <Plus className="h-5 w-5 mr-2" />
            Novo Template
          </button>
          <button
            onClick={() => setShowAutomationForm(true)}
            className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-green-600 hover:bg-green-700"
          >
            <Plus className="h-5 w-5 mr-2" />
            Nova Automação
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        <div>
          <h2 className="text-lg font-medium text-gray-900 mb-4">
            Templates de Mensagem
          </h2>
          <div className="space-y-4">
            {templates.map((template) => (
              <div
                key={template.id}
                className="bg-white shadow rounded-lg p-4 border border-gray-200"
              >
                <div className="flex justify-between items-start">
                  <h3 className="text-md font-medium text-gray-900">
                    {template.name}
                  </h3>
                  <button className="text-gray-400 hover:text-gray-500">
                    <span className="sr-only">Editar</span>
                    {/* Ícone de edição */}
                  </button>
                </div>
                <p className="mt-2 text-sm text-gray-600">{template.content}</p>
                {template.mediaAttachments && template.mediaAttachments.length > 0 && (
                  <div className="mt-2">
                    <span className="text-xs font-medium text-gray-500">
                      Anexos: {template.mediaAttachments.length}
                    </span>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>

        <div>
          <h2 className="text-lg font-medium text-gray-900 mb-4">
            Regras de Automação
          </h2>
          <div className="space-y-4">
            {automationRules.map((rule) => (
              <div
                key={rule.id}
                className="bg-white shadow rounded-lg p-4 border border-gray-200"
              >
                <div className="flex justify-between items-start">
                  <h3 className="text-md font-medium text-gray-900">
                    {rule.name}
                  </h3>
                  <div className="flex space-x-2">
                    <button className="text-gray-400 hover:text-gray-500">
                      <span className="sr-only">Editar</span>
                      {/* Ícone de edição */}
                    </button>
                  </div>
                </div>
                <div className="mt-2 space-y-2">
                  <div className="flex items-center text-sm text-gray-500">
                    {rule.trigger.type === 'tag' && <Tags className="h-4 w-4 mr-2" />}
                    {rule.trigger.type === 'schedule' && <Clock className="h-4 w-4 mr-2" />}
                    {rule.trigger.type === 'kanban_stage' && <Calendar className="h-4 w-4 mr-2" />}
                    <span>
                      Gatilho: {rule.trigger.type === 'tag' ? 'Tag' : 
                               rule.trigger.type === 'schedule' ? 'Agendamento' : 
                               'Estágio Kanban'}
                    </span>
                  </div>
                  <div className="text-sm text-gray-500">
                    Valor: {rule.trigger.value}
                  </div>
                  {rule.schedule && (
                    <div className="text-sm text-gray-500">
                      Frequência: {rule.schedule.frequency}
                      {rule.schedule.time && ` às ${rule.schedule.time}`}
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {showTemplateForm && (
        <MessageTemplateForm
          onClose={() => setShowTemplateForm(false)}
          onSuccess={() => {
            setShowTemplateForm(false);
            // Recarregar dados
          }}
        />
      )}

      {showAutomationForm && (
        <AutomationRuleForm
          onClose={() => setShowAutomationForm(false)}
          onSuccess={() => {
            setShowAutomationForm(false);
            // Recarregar dados
          }}
        />
      )}
    </div>
  );
}