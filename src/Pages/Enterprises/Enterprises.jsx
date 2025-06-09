import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Sidebar from '../../Components/SideBar/Sidebar';
import st from './Enterprises.module.css';

const Enterprises = () => {
  const navigate = useNavigate();

  return (
    <div style={{ display: 'flex', height: '100vh' }}>
      <Sidebar currentPage="enterprise" name="Nome do Usuário" />

    </div>
  );
};

export default Enterprises;