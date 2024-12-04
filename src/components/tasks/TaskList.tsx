import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { CheckCircle2, Circle, Calendar } from 'lucide-react';
import { getTasks } from '../../lib/api';
import { useStore } from '../../store/useStore';
import { formatDateTime } from '../../utils/format';
import type { Task } from '../../types/models';

interface TaskListProps {
  opportunityId: string;
}

export default function TaskList({ opportunityId }: TaskListProps) {
  const { company } = useStore();

  const { data: tasks = [] } = useQuery({
    queryKey: ['tasks', company?.id, opportunityId],
    queryFn: () => getTasks(company?.id || '', opportunityId),
    enabled: !!company?.id && !!opportunityId,
  });

  const getTaskIcon = (type: Task['type']) => {
    switch (type) {
      case 'meeting':
        return '🤝';
      case 'call':
        return '📞';
      case 'followup':
        return '📝';
      default:
        return '📋';
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h3 className="text-lg font-medium text-gray-900">Tarefas</h3>
        <button className="text-sm text-indigo-600 hover:text-indigo-500">
          Nova Tarefa
        </button>
      </div>

      <div className="space-y-2">
        {tasks.map((task) => (
          <div
            key={task.id}
            className="flex items-start space-x-3 p-3 bg-white rounded-lg border border-gray-200"
          >
            <div className="flex-shrink-0">
              {task.completed ? (
                <CheckCircle2 className="h-5 w-5 text-green-500" />
              ) : (
                <Circle className="h-5 w-5 text-gray-400" />
              )}
            </div>
            <div className="min-w-0 flex-1">
              <div className="flex items-center justify-between">
                <p className="text-sm font-medium text-gray-900">
                  <span className="mr-2">{getTaskIcon(task.type)}</span>
                  {task.title}
                </p>
                <div className="flex items-center text-sm text-gray-500">
                  <Calendar className="h-4 w-4 mr-1" />
                  {formatDateTime(task.dueDate)}
                </div>
              </div>
              {task.description && (
                <p className="mt-1 text-sm text-gray-500">{task.description}</p>
              )}
              <div className="mt-2 flex items-center text-sm text-gray-500">
                <span>Responsável: {task.assignedTo}</span>
              </div>
            </div>
          </div>
        ))}

        {tasks.length === 0 && (
          <p className="text-center text-sm text-gray-500 py-4">
            Nenhuma tarefa encontrada
          </p>
        )}
      </div>
    </div>
  );
}