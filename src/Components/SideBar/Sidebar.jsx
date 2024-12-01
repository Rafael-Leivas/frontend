import React from 'react';
import { FaHome, FaComments, FaCog, FaSignOutAlt } from 'react-icons/fa';
import './Sidebar.css'; // Estilos para o componente

import logo from '../../Assets/Logo-Sidebar.svg';

const Sidebar = (props) => {
  const menuItems = [
    { name: 'Onboarding', icon: <FaHome />, page: 'onboarding' },
    { name: 'Usuários', icon: <FaComments />, page: 'users' },
    { name: 'Sair', icon: <FaSignOutAlt />, page: 'logout' },
  ];

  return (
    <div className="sidebar">
      <div className="logo">
        <img src={logo} alt="Logo" />
      </div>
      <div className="user-info">
        <div className="avatar" />
        <div className="user-details">
          <h2>{props.name}</h2>
          <p>{props.username}</p>
        </div>
      </div>
      <ul className="menu">
        {menuItems.map((item) => (
          <li
            key={item.name}
            className={props.currentPage === item.page ? 'active' : ''}
          >
            {item.icon}
            <span>{item.name}</span>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default Sidebar;
