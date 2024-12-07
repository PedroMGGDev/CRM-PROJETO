import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { useStore } from './store/useStore';
import Layout from './components/Layout';
import Dashboard from './pages/Dashboard';
import Contacts from './pages/Contacts';
import Companies from './pages/Companies';
import Kanban from './pages/Kanban';
import Messages from './pages/Messages';
import Settings from './pages/Settings';

function PrivateRoute({ children }: { children: React.ReactNode }) {
  const currentUser = useStore((state) => state.currentUser);

  // Verificar se o usuário está logado
  return currentUser ? <>{children}</> : <Navigate to="/dashboard" />;
}

function AdminRoute({ children }: { children: React.ReactNode }) {
  const currentUser = useStore((state) => state.currentUser);

  // Verificar se o usuário é um admin
  return currentUser && currentUser.role === 'admin' ? <>{children}</> : <Navigate to="/" />;
}

function App() {
  const currentUser = useStore((state) => state.currentUser);

  return (
    <Router>
      <Routes>
        <Route
          path="/"
          element={
            <PrivateRoute>
              <Layout />
            </PrivateRoute>
          }
        >
          <Route index element={<Dashboard />} />
          <Route path="contacts" element={<Contacts />} />
          <Route path="companies" element={<Companies />} />
          <Route path="kanban" element={<Kanban />} />
          <Route path="messages" element={<Messages />} />
          <Route path="settings" element={<AdminRoute><Settings /></AdminRoute>} />
        </Route>
        {/* Caso o usuário não esteja logado, ele será redirecionado para o Dashboard */}
        <Route path="*" element={<Navigate to="/" />} />
      </Routes>
    </Router>
  );
}

export default App;
