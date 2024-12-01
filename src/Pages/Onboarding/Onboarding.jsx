import React, { useState, useEffect } from 'react';
import Sidebar from '../../Components/SideBar/Sidebar';
import OnboardingCard from '../../Components/OnboardingCard/OnboardingCard';
import st from './Onboarding.module.css';

const Onboarding = () => {
  const [cards, setCards] = useState([]); // Estado para armazenar os dados
  const [showModal, setShowModal] = useState(false); // Controle do modal
  const [newCard, setNewCard] = useState({ title: '', subtitle: '' }); // Estado do novo card

  useEffect(() => {
    // Simulando chamada a um "banco de dados"
    setTimeout(() => {
      setCards([
        { number: "1", title: "Boas Vindas!", subtitle: "Aqui você vai encontrar como é seu começo na empresa", liberado: true },
        { number: "2", title: "Acessos", subtitle: "Veja como acessar os sistemas da empresa", liberado: true },
        { number: "3", title: "Políticas da Empresa", subtitle: "Conheça as principais políticas internas", liberado: false },
        { number: "4", title: "Seu Time", subtitle: "Veja quem são seus colegas e líderes", liberado: false },
      ]);
    }, 1000); // Simula um delay de 1 segundo
  }, []);

  // Função para abrir o modal
  const openModal = () => {
    setShowModal(true);
  };

  // Função para fechar o modal
  const closeModal = () => {
    setShowModal(false);
    setNewCard({ title: '', subtitle: '' }); // Limpa os inputs ao fechar
  };

  // Função para adicionar um novo card
  const handleAddCard = () => {
    if (newCard.title && newCard.subtitle) {
      const newCardData = {
        number: (cards.length + 1).toString(),
        title: newCard.title,
        subtitle: newCard.subtitle,
      };
      setCards([...cards, newCardData]); // Adiciona o novo card ao estado
      closeModal(); // Fecha o modal
    }
  };

  return (
    <div style={{ display: 'flex' }}>
      <Sidebar 
        currentPage="onboarding"
        name="Nome do Usuário"
        username="Teste"
      />
      <main className={st.main}>
        <h1>Onboarding</h1>
        <button className={st.addButton} onClick={openModal}>+ Adicionar Novo Card</button>
        <div className={st.cardsContainer}>
          {cards.map((card, index) => (
            <OnboardingCard 
              key={index}
              number={card.number}
              title={card.title}
              subtitle={card.subtitle}
                liberado={card.liberado}
            />
          ))}
        </div>

        {/* Modal */}
        {showModal && (
          <div className={st.modalOverlay}>
            <div className={st.modalContent}>
              <h2>Adicionar Novo Card</h2>
              <input 
                type="text" 
                placeholder="Título" 
                value={newCard.title} 
                onChange={(e) => setNewCard({ ...newCard, title: e.target.value })}
              />
              <input 
                type="text" 
                placeholder="Descrição" 
                value={newCard.subtitle} 
                onChange={(e) => setNewCard({ ...newCard, subtitle: e.target.value })}
              />
              <div className={st.modalButtons}>
                <button onClick={handleAddCard}>Salvar</button>
                <button onClick={closeModal}>Cancelar</button>
              </div>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}

export default Onboarding;
