import React from 'react';
import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { DollarSign, Calendar, User } from 'lucide-react';
import type { Opportunity } from '../../types/models';
import { formatCurrency } from '../../utils/format';

interface OpportunityCardProps {
  opportunity: Opportunity;
}

export default function OpportunityCard({ opportunity }: OpportunityCardProps) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
  } = useSortable({ id: opportunity.id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      {...attributes}
      {...listeners}
      className="bg-white p-4 rounded-lg shadow-sm border border-gray-200 cursor-move hover:shadow-md transition-shadow"
    >
      <div className="space-y-3">
        <div className="flex items-start justify-between">
          <h4 className="text-sm font-medium text-gray-900 truncate">
            {opportunity.contact?.name || 'Sem nome'}
          </h4>
          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
            {opportunity.status}
          </span>
        </div>

        <div className="flex items-center text-sm text-gray-500">
          <DollarSign className="h-4 w-4 mr-1" />
          <span>{formatCurrency(opportunity.value)}</span>
        </div>

        {opportunity.assignedTo && (
          <div className="flex items-center text-sm text-gray-500">
            <User className="h-4 w-4 mr-1" />
            <span>{opportunity.assignedTo}</span>
          </div>
        )}

        <div className="flex items-center text-sm text-gray-500">
          <Calendar className="h-4 w-4 mr-1" />
          <span>
            {new Date(opportunity.creationDate).toLocaleDateString()}
          </span>
        </div>

        {opportunity.tags.length > 0 && (
          <div className="flex flex-wrap gap-1">
            {opportunity.tags.map((tag) => (
              <span
                key={tag}
                className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-gray-100 text-gray-800"
              >
                {tag}
              </span>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}