import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import Login from './pages/Auth/Login';
import MainLayout from './components/layout/MainLayout';
import Dashboard from './pages/Dashboard/Dashboard';
import ExpedientesList from './pages/Expedientes/ExpedientesList';
import ExpedienteForm from './pages/Expedientes/ExpedienteForm';
import ExpedienteDetail from './pages/Expedientes/ExpedienteDetail';
import UsuariosList from './pages/Usuarios/UsuariosList';

function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <Routes>
          <Route path="/" element={<Login />} />
          <Route element={<MainLayout />}>
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/expedientes" element={<ExpedientesList />} />
            <Route path="/expedientes/nuevo" element={<ExpedienteForm />} />
            <Route path="/expedientes/:id/editar" element={<ExpedienteForm />} />
            <Route path="/expedientes/:id" element={<ExpedienteDetail />} />
            <Route path="/usuarios" element={<UsuariosList />} />
          </Route>
          <Route path="*" element={<Navigate to="/" />} />
        </Routes>
      </AuthProvider>
    </BrowserRouter>
  );
}

export default App;
