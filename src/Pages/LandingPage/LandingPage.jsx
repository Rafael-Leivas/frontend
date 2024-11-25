import React from 'react'
import NavBar from '../../Components/NavBar/NavBar'

import st from './LandingPage.module.css'

import imagepeaples from '../../Assets/block1.png'
import banner from '../../Assets/banner.svg'
import Card_Beneficio from '../../Components/Card_Beneficio/Card_Beneficio'
import peoples_team from '../../Assets/peoples_team.png'

// Importação do TestimonialCard
import TestimonialCard from '../../Components/Testimonial_Card/Testimonial_Card'

// Certifique-se de que você tenha uma imagem de teste (se não, adicione uma)
import testimonialImage from '../../Assets/testimonialUser.jpg';

import { TfiAgenda, TfiEye, TfiPencil, TfiRocket, TfiStatsUp, TfiReceipt, TfiAlignCenter, TfiViewListAlt, TfiTrello } from "react-icons/tfi";

const LandingPage = () => {
  return (
    <div className={st.content}>
        <div className={st.navbar}>
          <NavBar />
        </div>

        <div className={st.first_block}>
            <div className={st.texts}>
                <h1>De para seu colaborador tudo o que uma plataforma deve lhe oferecer . . .</h1>
                <button className={st.button_contrate_block_1}>Contrate</button>
            </div>
            <div className={st.image_block1}>
              <img className={st.image_first_block} src={imagepeaples} alt="Pessos felizes" />
            </div>
        </div>
    
        <div className={st.second_block}>
          <img src={banner} alt="" />
        </div>

        <div className={st.cards_product}>
            <h1 className={st.title_cards}>O que você vai poder adicionar em sua empresa !!!</h1>
            
            <div className={st.cards_cards_product}>
              <div className={st.card}>
                <Card_Beneficio 
                  title={"Onboording"}
                  icon={<TfiAgenda size={40} />}
                />
              </div>

              <div className={st.card}>
                <Card_Beneficio 
                  title={"Missão"}
                  icon={<TfiViewListAlt size={40} />}
                />
              </div>

              <div className={st.card}>
                <Card_Beneficio 
                  title={"Visão"}
                  icon={<TfiEye size={40} />}
                />
              </div>

              <div className={st.card}>
                <Card_Beneficio 
                  title={"Valores"}
                  icon={<TfiAlignCenter size={40} />}
                />
              </div>

              <div className={st.card}>
                <Card_Beneficio 
                  title={"Controle de ADMIN"}
                  icon={<TfiTrello size={40} />}
                />
              </div>

              <div className={st.card}>
                <Card_Beneficio 
                  title={"OrganoGramas"}
                  icon={<TfiReceipt size={40} />}
                />
              </div>

              <div className={st.card}>
                <Card_Beneficio 
                  title={"Personalização"}
                  icon={<TfiPencil size={40} />}
                />
              </div>

              <div className={st.card}>
                <Card_Beneficio 
                  title={"Avaliação de Desempenho"}
                  icon={<TfiStatsUp size={40} />}
                />
              </div>

              <div className={st.card}>
                <Card_Beneficio 
                  title={"Feedback Contínuo"}
                  icon={<TfiRocket size={40} />}
                />
              </div>

            </div>
        </div>

        <div className={st.team}>
          <div className={st.texts_teams}>
            <h1>Seu time mais unido !</h1>
            <p>Transforme a experiência do seu time com nossa plataforma de RH. Facilite a comunicação, simplifique o onboarding e mantenha todos atualizados sobre as novidades da empresa. Experimente e descubra um ambiente de trabalho mais conectado e engajado!</p>
            <button className={st.button_team}>Contrate agora</button>
          </div>
          <img  src={peoples_team} alt="Time de pessoas" />
        </div>

        <div className={st.testimonials}>
          <h2 className={st.testimonialsTitle}>O que nossos clientes dizem</h2>
          <div className={st.testimonialCards}>
            <TestimonialCard
              name="Maria Silva"
              testimonial="A plataforma tem transformado a gestão de pessoas na nossa empresa. Facilitou muito o processo de onboarding e comunicação."
              image={testimonialImage}
            />
            <TestimonialCard
              name="João Souza"
              testimonial="Uma ferramenta incrível que melhorou a integração do nosso time e otimizou os processos administrativos!"
              image={testimonialImage}
            />
            <TestimonialCard
              name="Ana Oliveira"
              testimonial="Recomendo a todos. A plataforma ajuda a manter todos os colaboradores mais engajados e conectados."
              image={testimonialImage}
            />
          </div>
        </div>

        <footer className={st.footer}>
      <div className={st.footerContent}>
        <p>&copy; 2024 Colab. Todos os direitos reservados.</p>
        <div className={st.socialMedia}>
          <a href="https://facebook.com" target="_blank" rel="noopener noreferrer">Facebook</a>
          <a href="https://twitter.com" target="_blank" rel="noopener noreferrer">Twitter</a>
          <a href="https://linkedin.com" target="_blank" rel="noopener noreferrer">LinkedIn</a>
        </div>
      </div>
    </footer>

    </div>
  )
}

export default LandingPage;
