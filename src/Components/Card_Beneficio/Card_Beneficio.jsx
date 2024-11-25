import React from 'react'

import st from './Card_Beneficio.module.css'

const Card_Beneficio = (props) => {
  return (
    <div className={st.card}>
        <div>
            {props.icon}
        </div>
        <h1>{props.title}</h1>
    </div>
  )
}

export default Card_Beneficio