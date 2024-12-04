import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { Clock, Tag, Layout, Calendar, Settings } from 'lucide-react';
import { useStore } from '../../store/useStore';
import { getAutomationRules } from '../../lib/api';

export default function AutomationList() {
  const { company } = useStore();

  const { data: rules = [] } = useQuery({
    queryKey: ['automation-rules', company?.id],
    queryFn: () => getAutomationRules(company?.id || ''),
    enabled: !!company?.id,
  });

  const getTriggerIcon = (type: string) => {
    switch (type) {
      case 'tag':
        return <Tag className="h-5 w-5 text-blue-500" />;
      case 'schedule':
        return <Clock className="h-5 w-5 text-green-500" />;
      case 'kanban_stage':
        return <Layout className="h-5 w-5 text-purple-500" />;
      default:
        return null;
    }
  };

  return (
    <div className="space-y-4">
      {rules.map((rule) => (
        <div
          key={rule.id}
          className="bg-white shadow rounded-lg p-4 border border-gray-200"
        >
          <div className="flex justify-between items-start">
            <div className="flex items-center">
              {getTriggerIcon(rule.trigger.type)}
              <h3 className="ml-2 text-lg font-medium text-gray-900">
                {rule.name}
              </h3>
            </div>
            <button className="text-gray-400 hover:text-gray-500">
              <Settings className="h-5 w-5" />
            </button>
          </div>

          <div className="mt-4 space-y-2">
            <div className="flex items-center text-sm text-gray-500">
              <Calendar className="h-4 w-4 mr-2" />
              <span>
                Frequência:{' '}
                {rule.schedule?.frequency === 'daily'
                  ? 'Diária'
                  : rule.schedule?.frequency === 'weekly'
                  ? 'Semanal'
                  : 'Mensal'}
              </span>
            </div>

            <div className="flex items-center text-sm text-gray-500">
              <Clock className="h-4 w-4 mr-2" />
              <span>
                Atraso: {rule.message.delay} segundos
              </span>
            </div>

            {rule.trigger.type === 'tag' && (
              <div className="flex items-center">
                <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                  {rule.trigger.value}
                </span>
              </div>
            )}
          </div>
        </div>
      ))}

      {rules.length === 0 && (
        <div className="text-center py-6 text-gray-500">
          Nenhuma regra de automação configurada
        </div>
      )}
    </div>
  );
}