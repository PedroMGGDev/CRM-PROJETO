import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { Clock, User, MessageSquare, X } from 'lucide-react';
import { useStore } from '../../store/useStore';
import { getMessageQueue } from '../../lib/api';
import { formatDateTime } from '../../utils/format';

export default function MessageQueue() {
  const { company } = useStore();

  const { data: queuedMessages = [] } = useQuery({
    queryKey: ['message-queue', company?.id],
    queryFn: () => getMessageQueue(company?.id || ''),
    enabled: !!company?.id,
  });

  return (
    <div className="space-y-4">
      <h2 className="text-lg font-medium text-gray-900">Fila de Mensagens</h2>

      <div className="bg-white shadow rounded-lg divide-y divide-gray-200">
        {queuedMessages.map((message) => (
          <div key={message.id} className="p-4">
            <div className="flex justify-between items-start">
              <div className="flex items-center">
                <MessageSquare className="h-5 w-5 text-gray-400" />
                <div className="ml-3">
                  <p className="text-sm font-medium text-gray-900">
                    {message.content}
                  </p>
                  <div className="mt-1 flex items-center text-sm text-gray-500">
                    <User className="h-4 w-4 mr-1" />
                    <span>{message.contact.name}</span>
                  </div>
                </div>
              </div>
              <div className="flex items-center">
                <div className="text-sm text-gray-500 mr-4">
                  <Clock className="h-4 w-4 inline mr-1" />
                  {formatDateTime(message.scheduledFor)}
                </div>
                <button className="text-gray-400 hover:text-gray-500">
                  <X className="h-5 w-5" />
                </button>
              </div>
            </div>
            {message.mediaUrl && (
              <div className="mt-2">
                <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                  Mídia anexada
                </span>
              </div>
            )}
          </div>
        ))}

        {queuedMessages.length === 0 && (
          <div className="p-4 text-center text-gray-500">
            Nenhuma mensagem na fila
          </div>
        )}
      </div>
    </div>
  );
}