import React from 'react'
import st from './NavBar.module.css'

const NavBar = () => {
  return (
    <div className={st.content}>
        <div>LOGO</div>
        <div className={st.links}>
            <a href="#">Login</a>
            <a href="#">Cadastre-se</a>
        </div>
    </div>
  )
}

export default NavBar