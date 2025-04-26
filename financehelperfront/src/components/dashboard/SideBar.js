// src/components/dashboard/SideBar.js
import React from 'react';
import { Nav } from 'react-bootstrap';
import { clearTokens } from '../../services/loginService';

const SideBar = () => {
  const handleLogout = () => {
    clearTokens();
    window.location.href = "/"; // Volta para login
  };

  return (
    <div className="bg-white shadow-sm p-4 vh-100" style={{ width: '250px' }}>
      <h4 className="mb-4 fw-bold text-primary">Meu Painel</h4>
      <Nav className="flex-column gap-2">
        <Nav.Link href="/dashboard" className="text-dark sidebar-link">Dashboard</Nav.Link>
        <Nav.Link href="#" className="text-dark sidebar-link">Relatórios</Nav.Link>
        <Nav.Link href="#" className="text-dark sidebar-link">Usuários</Nav.Link>
        <Nav.Link onClick={handleLogout} className="text-danger sidebar-link">Sair</Nav.Link>
      </Nav>
      <style>{`
        .sidebar-link:hover {
          background-color: #f8f9fa;
          border-radius: 8px;
          padding-left: 10px;
        }
      `}</style>
    </div>
  );
};

export default SideBar;
