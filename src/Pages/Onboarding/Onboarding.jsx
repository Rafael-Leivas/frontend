import React, { useState, useEffect } from "react";
import Sidebar from "../../Components/SideBar/Sidebar";
import OnboardingCard from "../../Components/OnboardingCard/OnboardingCard";
import axios from "../../api/axiosConfig";
import st from "./Onboarding.module.css";

import { message, Modal } from "antd";
import CreateContent from "./CreateContent/CreateContent";
import { getUserId, getUserRole } from "../../api/auth";

const Onboarding = () => {
  const [cards, setCards] = useState([]);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showViewModal, setShowViewModal] = useState(false);
  const [newCard, setNewCard] = useState({
    title: "",
    subtitle: "",
    body: "",
    disponivel: false,
  });
  const [selectedCard, setSelectedCard] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  const userId = getUserId();
  const userRole = getUserRole();

  // Função para gerenciar progresso no localStorage
  const getProgressFromStorage = () => {
    const progress = localStorage.getItem(`onboarding_progress_${userId}`);
    return progress ? JSON.parse(progress) : { completedCards: [], currentCard: 0 };
  };

  const saveProgressToStorage = (completedCards, currentCard) => {
    const progress = { completedCards, currentCard };
    localStorage.setItem(`onboarding_progress_${userId}`, JSON.stringify(progress));
  };

  // Fetch inicial dos cards
  useEffect(() => {
    const fetchCards = async () => {
      if (!userId) return;

      setIsLoading(true);
      try {
        const response = await axios.get(`/conteudo/colaborador/${userId}`);
        const conteudos = response.data.data?.conteudos || [];

        // Pegar progresso do localStorage
        const progress = getProgressFromStorage();

        const fetchedCards = conteudos.map((card, index) => {
          // Determinar se o card está liberado
          let isLiberado = false;
          
          if (index === 0) {
            // Primeiro card sempre liberado
            isLiberado = true;
          } else {
            // Cards subsequentes só liberados se o anterior foi concluído
            isLiberado = progress.completedCards.includes(index - 1);
          }

          return {
            number: index,
            id: card._id.toString(),
            title: card.titulo,
            subtitle: card.tipo,
            content: card.corpo,
            liberado: isLiberado,
            completed: progress.completedCards.includes(index),
            adminName: card.id_administrador?.nome_completo || "Admin",
            createdAt: card.createdAt,
          };
        });

        setCards(fetchedCards);
      } catch (error) {
        setError(error.response?.data?.message || "Erro ao carregar os cards");
        console.error("Erro ao carregar os cards:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchCards();
  }, [userId]);

  const openCreateModal = () => {
    setShowCreateModal(true);
  };

  const closeCreateModal = () => {
    setShowCreateModal(false);
    setNewCard({ title: "", subtitle: "", body: "", disponivel: false });
    setError(null);
  };

  const openViewModal = (card) => {
    setSelectedCard(card);
    setShowViewModal(true);
  };

  const closeViewModal = () => {
    setShowViewModal(false);
    setSelectedCard(null);
  };

  const handleAddCard = async () => {
    if (!newCard.title || !newCard.subtitle || !newCard.body) return;

    setIsLoading(true);
    const newCardData = {
      titulo: newCard.title,
      tipo: newCard.subtitle,
      corpo: newCard.body,
      disponivel: false, // Sempre false por padrão
      id_administrador: "682157ed55d61d80722ba159",
    };

    try {
      const response = await axios.post("/conteudo", newCardData);
      const savedCard = response.data.data;

      // Determinar se o novo card deve estar liberado
      const progress = getProgressFromStorage();
      const newCardIndex = cards.length;
      const isLiberado = newCardIndex === 0 || progress.completedCards.includes(newCardIndex - 1);

      setCards((prevCards) => [
        ...prevCards,
        {
          number: newCardIndex,
          id: savedCard._id,
          title: savedCard.titulo,
          subtitle: savedCard.tipo,
          content: savedCard.corpo,
          liberado: isLiberado,
          completed: false,
          adminName: "Admin",
        },
      ]);

      closeCreateModal();
      message.success("Card criado com sucesso!");
    } catch (error) {
      setError(error.response?.data?.message || "Erro ao salvar o card");
      console.error("Erro ao enviar os dados para o backend:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleMarkAsCompleted = async () => {
    if (!selectedCard || selectedCard.completed) return;

    setIsLoading(true);
    try {
      // Opcional: fazer chamada para o backend se necessário
      // await axios.put(`/conteudo/${selectedCard.id}`, { ... });

      const progress = getProgressFromStorage();
      const updatedCompletedCards = [...progress.completedCards];
      
      // Adicionar o card atual como concluído se ainda não estiver
      if (!updatedCompletedCards.includes(selectedCard.number)) {
        updatedCompletedCards.push(selectedCard.number);
      }

      const nextCardIndex = selectedCard.number + 1;
      
      // Salvar progresso no localStorage
      saveProgressToStorage(updatedCompletedCards, nextCardIndex);

      // Atualizar estado dos cards
      setCards((prevCards) => {
        return prevCards.map((card, index) => {
          if (index === selectedCard.number) {
            // Marcar card atual como concluído
            return { ...card, completed: true };
          } else if (index === nextCardIndex) {
            // Liberar próximo card
            return { ...card, liberado: true };
          }
          return card;
        });
      });

      closeViewModal();
      message.success("Card marcado como concluído!");
      
      // Verificar se todos os cards foram concluídos
      if (nextCardIndex >= cards.length) {
        message.success("Parabéns! Você concluiu todo o onboarding!");
      }

    } catch (error) {
      setError(error.response?.data?.message || "Erro ao atualizar o card");
      console.error("Erro ao atualizar progresso:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleViewMore = (card) => {
    // Só permite visualizar se o card estiver liberado
    if (card.liberado) {
      openViewModal(card);
    } else {
      message.warning("Este conteúdo ainda não está disponível. Complete os cards anteriores primeiro.");
    }
  };

  const handleContentCreated = () => {
    closeCreateModal();
    message.success("Conteúdo criado com sucesso!");
    // Recarregar os cards para incluir o novo
    window.location.reload();
  };

  // Função para resetar progresso (útil para testes)
  const resetProgress = () => {
    localStorage.removeItem(`onboarding_progress_${userId}`);
    window.location.reload();
  };

  return (
    <div style={{ display: "flex" }}>
      <Sidebar currentPage="onboarding" name="Nome do Usuário" />
      <main className={st.main}>
        <h1>Onboarding</h1>

        {/* Só mostra o botão se o usuário NÃO for colaborador */}
        {userRole !== "colaborador" && (
          <div>
            <button
              className={st.addButton}
              onClick={openCreateModal}
              disabled={isLoading}
            >
              {isLoading ? "Carregando..." : "+ Adicionar Novo Card"}
            </button>
            {/* Botão para resetar progresso - remova em produção */}
            <button 
              onClick={resetProgress}
              style={{ marginLeft: '10px', background: '#ff4d4f', color: 'white', border: 'none', padding: '8px 16px', borderRadius: '4px' }}
            >
              Resetar Progresso
            </button>
          </div>
        )}

        {error && <p className={st.error}>{error}</p>}

        <div className={st.cardsContainer}>
          {cards.map((card, index) => (
            <OnboardingCard
              key={card.id || index}
              number={index + 1}
              title={card.title}
              subtitle={card.subtitle}
              liberado={card.liberado}
              completed={card.completed}
              onViewMore={() => handleViewMore(card)}
            />
          ))}
        </div>

        {/* Modal para visualização de card */}
        {showViewModal && selectedCard && (
          <div className={st.modalOverlay}>
            <div className={st.modalContent}>
              <h2>{selectedCard.title}</h2>
              <h3>{selectedCard.subtitle}</h3>
              <div
                dangerouslySetInnerHTML={{ __html: selectedCard.content }}
                style={{
                  lineHeight: "1.6",
                  fontSize: "14px",
                  color: "#333",
                }}
              />

              <div className={st.modalButtons}>
                <button 
                  onClick={handleMarkAsCompleted} 
                  disabled={isLoading || selectedCard.completed}
                  style={{ 
                    opacity: selectedCard.completed ? 0.5 : 1,
                    cursor: selectedCard.completed ? 'not-allowed' : 'pointer'
                  }}
                >
                  {isLoading ? "Processando..." : 
                   selectedCard.completed ? "Já Concluído" : "Marcar como Concluído"}
                </button>
                <button onClick={closeViewModal} disabled={isLoading}>
                  Fechar
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Modal para criar novo card - só mostra se NÃO for colaborador */}
        {userRole !== "colaborador" && (
          <Modal
            title="Adicionar novo card"
            closable={{ "aria-label": "Custom Close Button" }}
            open={showCreateModal}
            onOk={closeCreateModal}
            onCancel={closeCreateModal}
            width={800}
            style={{ top: 30 }}
            footer={null}
          >
            <CreateContent onSuccess={handleContentCreated} />
          </Modal>
        )}
      </main>
    </div>
  );
};

export default Onboarding;