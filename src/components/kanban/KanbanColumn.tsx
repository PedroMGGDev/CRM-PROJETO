import React from 'react';
import { useDroppable } from '@dnd-kit/core';
import {
  SortableContext,
  verticalListSortingStrategy,
} from '@dnd-kit/sortable';
import OpportunityCard from './OpportunityCard';
import type { Opportunity } from '../../types/models';

interface KanbanColumnProps {
  id: string;
  title: string;
  opportunities: Opportunity[];
}

export default function KanbanColumn({
  id,
  title,
  opportunities,
}: KanbanColumnProps) {
  const { setNodeRef } = useDroppable({ id });

  return (
    <div className="flex flex-col w-80 bg-gray-100 rounded-lg p-4">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-medium text-gray-900">{title}</h3>
        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-200 text-gray-800">
          {opportunities.length}
        </span>
      </div>

      <div
        ref={setNodeRef}
        className="flex-1 overflow-y-auto"
      >
        <SortableContext
          items={opportunities.map((opp) => opp.id)}
          strategy={verticalListSortingStrategy}
        >
          <div className="space-y-3">
            {opportunities.map((opportunity) => (
              <OpportunityCard
                key={opportunity.id}
                opportunity={opportunity}
              />
            ))}
          </div>
        </SortableContext>
      </div>
    </div>
  );
}