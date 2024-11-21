import React from 'react'
import NavBar from '../../Components/NavBar/NavBar'

import st from './LandingPage.module.css'

const LandingPage = () => {
  return (
    <div className={st.content}>
        <NavBar />

        <div className={st.first_block}>
            <div className={st.texts}>
                <h1>De para seu colaborador tudo o que uma plataforma deve lhe oferecer . . .</h1>
                <button>Contrate</button>
            </div>
            <img className={st.image_first_block} src="#" alt="Pessos felizes" />
        </div>
    
        <div className={st.second_block}>
        </div>

        <div className={st.cards_product}>
            <h1>O que você vai poder adicionar em sua empresa !!!</h1>
            <h1>Card</h1>
        </div>

    </div>
  )
}

export default LandingPage