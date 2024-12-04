import React from 'react';
import { Bell, User } from 'lucide-react';
import { useStore } from '../store/useStore';

export default function Header() {
  const currentUser = useStore((state) => state.currentUser);

  return (
    <header className="bg-white shadow">
      <div className="px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex">
            <div className="flex-shrink-0 flex items-center">
              <h2 className="text-2xl font-bold text-gray-800">
                Painel de Controle
              </h2>
            </div>
          </div>
          <div className="flex items-center">
            <button className="p-1 rounded-full text-gray-400 hover:text-gray-500">
              <Bell className="h-6 w-6" />
            </button>
            <div className="ml-3 relative">
              <div className="flex items-center">
                <button className="flex text-sm rounded-full focus:outline-none">
                  <span className="sr-only">Abrir menu do usuário</span>
                  <User className="h-8 w-8 rounded-full bg-gray-100 p-1" />
                </button>
                {currentUser && (
                  <span className="ml-2 text-gray-700">{currentUser.name}</span>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
}