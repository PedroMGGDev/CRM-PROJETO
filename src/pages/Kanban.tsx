import React from 'react';
import { useQuery } from '@tanstack/react-query';
import {
  DndContext,
  DragOverlay,
  closestCorners,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
} from '@dnd-kit/core';
import {
  SortableContext,
  arrayMove,
  sortableKeyboardCoordinates,
} from '@dnd-kit/sortable';
import { useStore } from '../store/useStore';
import { getOpportunities } from '../lib/api';
import KanbanColumn from '../components/kanban/KanbanColumn';
import OpportunityCard from '../components/kanban/OpportunityCard';
import { Plus } from 'lucide-react';

const defaultStages = [
  { id: 'new', name: 'Novo Lead' },
  { id: 'contact', name: 'Primeiro Contato' },
  { id: 'meeting', name: 'Reunião Agendada' },
  { id: 'proposal', name: 'Proposta Enviada' },
  { id: 'negotiation', name: 'Em Negociação' },
  { id: 'closed', name: 'Fechado' },
];

export default function Kanban() {
  const { user, company } = useStore();
  const [activeId, setActiveId] = React.useState(null);

  const { data: opportunities = [] } = useQuery({
    queryKey: ['opportunities', company?.id],
    queryFn: () => getOpportunities(company?.id || ''),
    enabled: !!company?.id,
  });

  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  const handleDragStart = (event) => {
    setActiveId(event.active.id);
  };

  const handleDragEnd = (event) => {
    const { active, over } = event;

    if (active.id !== over.id) {
      const activeStage = active.data.current.sortable.containerId;
      const overStage = over.data.current.sortable.containerId;

      if (activeStage !== overStage) {
        // Atualizar o estágio da oportunidade
        const opportunity = opportunities.find((opp) => opp.id === active.id);
        if (opportunity) {
          useStore.getState().moveOpportunity(active.id, overStage);
        }
      }
    }

    setActiveId(null);
  };

  return (
    <div className="h-full">
      <div className="mb-6 flex justify-between items-center">
        <h1 className="text-2xl font-bold text-gray-900">Pipeline de Vendas</h1>
        <button className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500">
          <Plus className="h-5 w-5 mr-2" />
          Nova Oportunidade
        </button>
      </div>

      <div className="h-full overflow-x-auto">
        <DndContext
          sensors={sensors}
          collisionDetection={closestCorners}
          onDragStart={handleDragStart}
          onDragEnd={handleDragEnd}
        >
          <div className="flex gap-4 h-full">
            {defaultStages.map((stage) => (
              <KanbanColumn
                key={stage.id}
                id={stage.id}
                title={stage.name}
                opportunities={opportunities.filter(
                  (opp) => opp.kanbanStage === stage.id
                )}
              />
            ))}
          </div>

          <DragOverlay>
            {activeId ? (
              <OpportunityCard
                opportunity={opportunities.find((opp) => opp.id === activeId)}
              />
            ) : null}
          </DragOverlay>
        </DndContext>
      </div>
    </div>
  );
}