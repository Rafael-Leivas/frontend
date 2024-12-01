import React from 'react';
import { FaHome, FaComments, FaSignOutAlt } from 'react-icons/fa';
import { Link } from 'react-router-dom';
import './Sidebar.css'; // Estilos para o componente

import logo from '../../Assets/Logo-Sidebar.svg';

const Sidebar = (props) => {
  const menuItems = [
    { name: 'Onboarding', icon: <FaHome />, page: 'onboarding', path: '/onboarding' },
    { name: 'Usuários', icon: <FaComments />, page: 'users', path: '/users' },
    { name: 'Sair', icon: <FaSignOutAlt />, page: 'logout', path: '/' },
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
        </div>
      </div>
      <ul className="menu">
        {menuItems.map((item) => (
          <li
            key={item.name}
            className={props.currentPage === item.page ? 'active' : ''}
          >
            <Link to={item.path} className="menu-link">
              <div className="menu-item">
                {item.icon}
                <span>{item.name}</span>
              </div>
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default Sidebar;
