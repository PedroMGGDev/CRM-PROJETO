import React from 'react';
import { NavLink } from 'react-router-dom';
import { 
  Users, 
  Building2, 
  LayoutDashboard, 
  PieChart,
  MessageSquare,
  Settings
} from 'lucide-react';

const navigation = [
  { name: 'Dashboard', to: '/', icon: LayoutDashboard },
  { name: 'Contatos', to: '/contacts', icon: Users },
  { name: 'Empresas', to: '/companies', icon: Building2 },
  { name: 'Kanban', to: '/kanban', icon: PieChart },
  { name: 'Mensagens', to: '/messages', icon: MessageSquare },
  { name: 'Configurações', to: '/settings', icon: Settings },
];

export default function Sidebar() {
  return (
    <div className="hidden lg:flex lg:flex-shrink-0">
      <div className="flex flex-col w-64">
        <div className="flex flex-col flex-grow bg-gray-800 pt-5 pb-4 overflow-y-auto">
          <div className="flex items-center flex-shrink-0 px-4">
            <h1 className="text-white text-2xl font-bold">CRM System</h1>
          </div>
          <nav className="mt-5 flex-1 px-2 space-y-1">
            {navigation.map((item) => (
              <NavLink
                key={item.name}
                to={item.to}
                className={({ isActive }) =>
                  `group flex items-center px-2 py-2 text-sm font-medium rounded-md ${
                    isActive
                      ? 'bg-gray-900 text-white'
                      : 'text-gray-300 hover:bg-gray-700 hover:text-white'
                  }`
                }
              >
                <item.icon className="mr-3 h-6 w-6" />
                {item.name}
              </NavLink>
            ))}
          </nav>
        </div>
      </div>
    </div>
  );
}