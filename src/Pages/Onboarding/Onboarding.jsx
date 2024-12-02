import React, { useState, useEffect } from 'react';
import Sidebar from '../../Components/SideBar/Sidebar';
import OnboardingCard from '../../Components/OnboardingCard/OnboardingCard';
import st from './Onboarding.module.css';

const Onboarding = () => {
  const [cards, setCards] = useState([]); // Estado para armazenar os dados
  const [showModal, setShowModal] = useState(false); // Controle do modal
  const [newCard, setNewCard] = useState({ title: '', subtitle: '', body: '' }); // Estado do novo card
  const [selectedCard, setSelectedCard] = useState(null); // Estado para armazenar o card selecionado para visualização

  // Fetch inicial dos cards
  useEffect(() => {
    const fetchCards = async () => {
      try {
        const response = await fetch('http://localhost:8000/conteudo/all');
        const data = await response.json();

        const fetchedCards = data.map(card => ({
          number: card.id_conteudo.toString(),
          title: card.titulo,
          subtitle: card.tipo,
          content: card.corpo,
          liberado: card.disponivel,
        }));

        setCards(fetchedCards);
      } catch (error) {
        console.error('Erro ao carregar os cards:', error);
      }
    };

    fetchCards();
  }, []);

  const openModal = () => {
    setShowModal(true);
  };

  const closeModal = () => {
    setShowModal(false);
    setNewCard({ title: '', subtitle: '', body: '' }); // Limpa o estado
    setSelectedCard(null); // Limpa o card selecionado
  };

  const handleAddCard = async () => {
    if (newCard.title && newCard.subtitle && newCard.body) {
      const newCardData = {
        titulo: newCard.title,
        tipo: newCard.subtitle,
        corpo: newCard.body,
        disponivel: false,
        id_administrador: 1,
      };

      try {
        const response = await fetch('http://localhost:8000/conteudo', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(newCardData),
        });

        if (response.ok) {
          const savedCard = await response.json();
          // Atualize o estado com o novo card e force uma nova renderização
          setCards((prevCards) => [
            ...prevCards,
            {
              number: savedCard.id_conteudo.toString(),
              title: savedCard.titulo,
              subtitle: savedCard.tipo,
              content: savedCard.corpo,
              liberado: savedCard.disponivel,
            },
          ]);

          // Fechar o modal e limpar os dados
          closeModal();
        } else {
          console.error('Erro ao salvar o card:', response);
        }
      } catch (error) {
        console.error('Erro ao enviar os dados para o backend:', error);
      }
    }
  };

  const handleMarkAsCompleted = async () => {
    if (!selectedCard) return;
  
    const updatedCard = { ...selectedCard, liberado: true };
  
    // Atualiza o card atual para marcar como concluído (disponível = true)
    try {
      const response = await fetch(`http://localhost:8000/conteudo/${selectedCard.number}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          titulo: selectedCard.title,
          tipo: selectedCard.subtitle,
          corpo: selectedCard.content,
          disponivel: true, // Marca como disponível
          id_administrador: 1, // Ou o id do administrador correspondente
        }),
      });
  
      if (response.ok) {
        // Atualiza a lista de cards para liberar o próximo card
        setCards(prevCards => {
          const updatedCards = prevCards.map(card => {
            if (card.number === selectedCard.number) {
              return { ...card, liberado: true };
            }
            return card;
          });
  
          // Liberar o próximo card
          const nextCardIndex = prevCards.findIndex(card => card.number === selectedCard.number) + 1;
          if (nextCardIndex < prevCards.length) {
            updatedCards[nextCardIndex] = { ...updatedCards[nextCardIndex], liberado: true };
          }
  
          return updatedCards;
        });
  
        closeModal(); // Fecha o modal após a atualização
      } else {
        console.error('Erro ao atualizar o card:', response);
      }
    } catch (error) {
      console.error('Erro ao enviar a atualização:', error);
    }
  };
  

  const handleViewMore = (card) => {
    setSelectedCard(card); // Atualiza o card selecionado
    setShowModal(true); // Abre o modal
  };

  return (
    <div style={{ display: 'flex' }}>
      <Sidebar currentPage="onboarding" name="Nome do Usuário" />
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
              onViewMore={() => handleViewMore(card)} // Passa o card para o modal
            />
          ))}
        </div>

        {/* Modal para visualização de card */}
        {showModal && selectedCard && (
          <div className={st.modalOverlay}>
            <div className={st.modalContent}>
              <h2>{selectedCard.title}</h2>
              <h3>{selectedCard.subtitle}</h3>
              <p>{selectedCard.content}</p>
              <div className={st.modalButtons}>
                <button onClick={closeModal}>Fechar</button>
              </div>
            </div>
          </div>
        )}

        {/* Modal para adicionar novo card */}
        {showModal && !selectedCard && (
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
              <textarea
                placeholder="Corpo"
                value={newCard.body}
                onChange={(e) => setNewCard({ ...newCard, body: e.target.value })}
              />
              <div className={st.modalButtons}>
                <button onClick={handleAddCard}>Salvar</button>
                <button onClick={closeModal}>Cancelar</button>
              </div>
            </div>
          </div>
        )}
        
        {showModal && selectedCard && (
          <div className={st.modalOverlay}>
            <div className={st.modalContent}>
              <h2>{selectedCard.title}</h2>
              <h3>{selectedCard.subtitle}</h3>
              <p>
                {selectedCard.content.split('\n').map((line, index) => (
                  <React.Fragment key={index}>
                    {line}
                    {index < selectedCard.content.split('\n').length - 1 && <br />}
                  </React.Fragment>
                ))}
              </p>

              <div className={st.modalButtons}>
                <button onClick={handleMarkAsCompleted}>Marcar como Concluído</button>
                <button onClick={closeModal}>Fechar</button>
              </div>
            </div>
          </div>
        )}

      </main>
    </div>
  );
};

export default Onboarding;
