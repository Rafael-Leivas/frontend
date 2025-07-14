import React from "react";
import { FaHome, FaComments, FaSignOutAlt } from "react-icons/fa";
import { BiHomeSmile } from "react-icons/bi";
import { Link, useNavigate } from "react-router-dom";
import "./Sidebar.css";

import logo from "../../Assets/Logo-Sidebar.svg";
import { useAuth } from "../../hooks/useAuth";

const Sidebar = (props) => {
  const navigate = useNavigate();
  const { logout } = useAuth();

  const handleLogout = () => {
    logout();
    navigate("/");
  };

  const menuItems = [
    {
      name: "Onboarding",
      icon: <FaHome />,
      page: "onboarding",
      path: "/onboarding",
    },
    {
      name: "Usuários",
      icon: <FaComments />,
      page: "users",
      path: "/users",
    },
    // {
    //   name: "Empresa",
    //   icon: <BiHomeSmile />,
    //   page: "enterprise",
    //   path: "/enterprise",
    // },
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
            className={props.currentPage === item.page ? "active" : ""}
          >
            <Link to={item.path} className="menu-link">
              <div className="menu-item">
                {item.icon}
                <span>{item.name}</span>
              </div>
            </Link>
          </li>
        ))}

        <li>
          <button className="logout-button" onClick={handleLogout}>
            <FaSignOutAlt />
            <span>Sair</span>
          </button>
        </li>
      </ul>
    </div>
  );
};

export default Sidebar;
