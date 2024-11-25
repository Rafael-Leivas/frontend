import React from 'react'
import st from './NavBar.module.css'
import logo from '../../Assets/Logo.svg'

const NavBar = () => {
  return (
    <div className={st.content}>
        <img src={logo} alt="Logo Colab" />
        <div className={st.links}>
            <a className={st.login} href="#">Login</a>
            <a className={st.cadastro} href="#">Cadastre-se</a>
        </div>
    </div>
  )
}

export default NavBar