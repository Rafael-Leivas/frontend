import React from 'react'
import { Outlet, Link } from "react-router-dom";

import st from './NavBar.module.css'
import logo from '../../Assets/Logo.svg'

const NavBar = () => {
  return (
    <div className={st.content}>
        <img src={logo} alt="Logo Colab" />
        <div className={st.links}>
            <a className={st.login} href="/login">Login</a>
            <a className={st.cadastro} href="/register">Cadastre-se</a>
        </div>
    </div>
  )
}

export default NavBar